const XLSX = require('xlsx')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Slug oluşturma fonksiyonu
function createSlug(text) {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  }

  return text
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function importData() {
  console.log('Excel dosyası okunuyor...')
  const workbook = XLSX.readFile('C:\\Users\\Huawei\\Downloads\\YENİ ÜYE LİSTESİ NURCAN.xlsx')

  // 1. ÜYE LİSTESİ - Sanayi grupları ve üyeler
  console.log('\n=== ÜYE LİSTESİ İŞLENİYOR ===')
  const memberSheet = workbook.Sheets['ÜYE LİSTESİ']
  const memberData = XLSX.utils.sheet_to_json(memberSheet, { header: 1 })

  // Grupları ve üyeleri ayır
  const groups = []
  let currentGroup = null

  for (let i = 1; i < memberData.length; i++) {
    const row = memberData[i]
    if (!row || row.length === 0) continue

    // Grup başlığı tespiti (numara yok, firma adı var, telefon yok)
    if (!row[0] && row[1] && typeof row[1] === 'string' && row[1].trim() && !row[2] && !row[3]) {
      // Önceki grupları "SANAYİ" ile bitenleri filtrele
      const groupName = row[1].trim()
      if (groupName.includes('SANAYİ') || groupName.includes('GRUBU') || groupName.includes('SİS KURDELA')) {
        currentGroup = {
          name: groupName,
          members: []
        }
        groups.push(currentGroup)
        console.log(`\nGrup bulundu: ${groupName}`)
      }
    }
    // Üye satırı (numara var)
    else if (row[0] && typeof row[0] === 'number' && currentGroup) {
      const member = {
        no: row[0],
        companyName: row[1] ? row[1].toString().trim().replace(/\s+/g, ' ') : '',
        contactPerson: row[2] ? row[2].toString().trim() : '',
        tcNo: row[3] ? row[3].toString().trim() : '',
        birthDate: row[4],
        mobile: row[5] ? row[5].toString().trim() : '',
        phone: row[6] ? row[6].toString().trim() : '',
        fax: row[7] ? row[7].toString().trim() : '',
        email: row[8] ? row[8].toString().trim() : '',
        address: row[9] ? row[9].toString().trim() : '',
        website: row[10] ? row[10].toString().trim() : ''
      }

      // Şirket adını temizle (notları kaldır)
      member.companyName = member.companyName
        .replace(/üyemiz ama ödeme yapmıyor/gi, '')
        .replace(/üyelik dosyasını bulamadım/gi, '')
        .replace(/Kapandı yok firması/gi, '')
        .replace(/üyelik dosyası yok/gi, '')
        .trim()

      if (member.companyName) {
        currentGroup.members.push(member)
      }
    }
  }

  console.log(`\nToplam ${groups.length} sanayi grubu bulundu`)
  groups.forEach(g => console.log(`  - ${g.name}: ${g.members.length} üye`))

  // Veritabanına kaydet
  console.log('\n=== VERİTABANINA KAYDEDİLİYOR ===')

  const memberIdMap = {} // Excel no -> DB member ID eşleştirmesi

  for (const group of groups) {
    // Grup oluştur veya güncelle
    let dbGroup = await prisma.industryGroup.findFirst({
      where: { name: { contains: group.name.substring(0, 20) } }
    })

    if (!dbGroup) {
      let baseSlug = createSlug(group.name) || `grup-${Date.now()}`
      let slug = baseSlug
      let suffix = 1

      // Slug benzersiz olana kadar dene
      while (await prisma.industryGroup.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix}`
        suffix++
      }

      dbGroup = await prisma.industryGroup.create({
        data: {
          name: group.name,
          slug: slug,
          isActive: true
        }
      })
      console.log(`Yeni grup oluşturuldu: ${group.name} (slug: ${slug})`)
    } else {
      console.log(`Mevcut grup bulundu: ${group.name}`)
    }

    // Üyeleri ekle
    for (const member of group.members) {
      // Aynı şirket var mı kontrol et
      let dbMember = await prisma.industryMember.findFirst({
        where: {
          groupId: dbGroup.id,
          companyName: { contains: member.companyName.substring(0, 30) }
        }
      })

      if (!dbMember) {
        dbMember = await prisma.industryMember.create({
          data: {
            companyName: member.companyName,
            contactPerson: member.contactPerson,
            phone: member.phone || member.mobile,
            email: member.email,
            website: member.website,
            address: member.address,
            groupId: dbGroup.id,
            isActive: true
          }
        })
        console.log(`  Yeni üye: ${member.companyName}`)
      } else {
        // Mevcut üyeyi güncelle
        dbMember = await prisma.industryMember.update({
          where: { id: dbMember.id },
          data: {
            contactPerson: member.contactPerson || dbMember.contactPerson,
            phone: member.phone || member.mobile || dbMember.phone,
            email: member.email || dbMember.email,
            website: member.website || dbMember.website,
            address: member.address || dbMember.address
          }
        })
        console.log(`  Güncellendi: ${member.companyName}`)
      }

      // Excel no -> DB ID eşleştirmesi
      memberIdMap[member.no] = dbMember.id
    }
  }

  // 2. AİDAT LİSTESİ - Aidat bilgileri
  console.log('\n=== AİDAT LİSTESİ İŞLENİYOR ===')
  const duesSheet = workbook.Sheets['AİDAT LİSTESİ']
  const duesData = XLSX.utils.sheet_to_json(duesSheet, { header: 1 })

  // Başlık satırından yılları al
  const headerRow = duesData[0]
  const years = []
  for (let col = 5; col <= 13; col++) {
    if (headerRow[col] && typeof headerRow[col] === 'number') {
      years.push({ col, year: headerRow[col] })
    }
  }
  console.log('Yıllar:', years.map(y => y.year).join(', '))

  let duesCreated = 0
  let duesUpdated = 0

  for (let i = 1; i < duesData.length; i++) {
    const row = duesData[i]
    if (!row || !row[0]) continue

    const excelNo = row[0]
    const companyName = row[1] ? row[1].toString().trim() : ''

    // Şirket adını temizle
    const cleanCompanyName = companyName
      .replace(/üyemiz ama ödeme yapmıyor/gi, '')
      .replace(/üyelik dosyasını bulamadım/gi, '')
      .replace(/Kapandı yok firması/gi, '')
      .replace(/SORALIM/gi, '')
      .trim()

    // DB'de üyeyi bul
    let dbMember = null

    // Önce Excel no ile dene
    if (memberIdMap[excelNo]) {
      dbMember = await prisma.industryMember.findUnique({
        where: { id: memberIdMap[excelNo] }
      })
    }

    // Bulunamadıysa isimle ara
    if (!dbMember && cleanCompanyName) {
      dbMember = await prisma.industryMember.findFirst({
        where: { companyName: { contains: cleanCompanyName.substring(0, 20) } }
      })
    }

    if (!dbMember) {
      console.log(`  Üye bulunamadı: ${cleanCompanyName} (No: ${excelNo})`)
      continue
    }

    // Her yıl için aidat kaydı oluştur
    for (const yearInfo of years) {
      const cellValue = row[yearInfo.col]

      // Değer yoksa veya null ise atla
      if (cellValue === null || cellValue === undefined || cellValue === '') continue

      let status = 'PENDING'
      let amount = 0
      let notes = ''

      if (cellValue === 'X') {
        // X = Ödendi (eski üyeler için)
        status = 'PAID'
        amount = yearInfo.year <= 2021 ? 750 : (yearInfo.year === 2022 ? 1500 : 3000)
      } else if (typeof cellValue === 'number') {
        // Sayı = Ödeme tutarı
        amount = cellValue
        status = cellValue > 0 ? 'PAID' : 'PENDING'
      } else if (typeof cellValue === 'string') {
        // String = Not (ödeme yapmıyor vs.)
        notes = cellValue
        status = 'OVERDUE'
        amount = yearInfo.year <= 2021 ? 750 : (yearInfo.year === 2022 ? 1500 : 3000)
      }

      // Son sütunda not olabilir
      const lastColNote = row[14]
      if (lastColNote && typeof lastColNote === 'string') {
        notes = lastColNote
        if (lastColNote.includes('ödeme yapmıyor') || lastColNote.includes('kapandı')) {
          status = 'OVERDUE'
        }
      }

      // Aidat kaydı oluştur veya güncelle
      try {
        const existingDue = await prisma.memberDue.findFirst({
          where: {
            memberId: dbMember.id,
            year: yearInfo.year,
            month: null
          }
        })

        if (existingDue) {
          await prisma.memberDue.update({
            where: { id: existingDue.id },
            data: {
              amount,
              status,
              notes,
              paidDate: status === 'PAID' ? new Date(yearInfo.year, 11, 31) : null
            }
          })
          duesUpdated++
        } else {
          await prisma.memberDue.create({
            data: {
              memberId: dbMember.id,
              year: yearInfo.year,
              month: null,
              amount,
              status,
              dueDate: new Date(yearInfo.year, 2, 31), // 31 Mart
              paidDate: status === 'PAID' ? new Date(yearInfo.year, 11, 31) : null,
              notes
            }
          })
          duesCreated++
        }
      } catch (err) {
        console.log(`  Aidat kaydı hatası: ${cleanCompanyName} - ${yearInfo.year}: ${err.message}`)
      }
    }
  }

  console.log(`\nAidat özeti: ${duesCreated} yeni, ${duesUpdated} güncellendi`)

  // Özet
  const totalGroups = await prisma.industryGroup.count()
  const totalMembers = await prisma.industryMember.count()
  const totalDues = await prisma.memberDue.count()

  console.log('\n=== SONUÇ ===')
  console.log(`Toplam Sanayi Grubu: ${totalGroups}`)
  console.log(`Toplam Üye: ${totalMembers}`)
  console.log(`Toplam Aidat Kaydı: ${totalDues}`)

  await prisma.$disconnect()
  console.log('\nİşlem tamamlandı!')
}

importData().catch(console.error)
