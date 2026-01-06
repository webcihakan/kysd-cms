const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Slug oluşturma fonksiyonu
function createSlug(text) {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };

  return text
    .toLowerCase()
    .replace(/[çğışöüÇĞİŞÖÜ]/g, char => turkishMap[char] || char)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Firma adından notları temizle
function cleanCompanyName(name) {
  if (!name) return '';
  return name
    .replace(/üyemiz ama ödeme yapmıyor/gi, '')
    .replace(/üyelik dosyasını bulamadım/gi, '')
    .replace(/Kapandı yok firması/gi, '')
    .replace(/Dosyası yok.*$/gi, '')
    .replace(/Dosya yok.*$/gi, '')
    .replace(/SORALIM.*$/gi, '')
    .replace(/artık.*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function main() {
  console.log('=== VERİTABANI TEMİZLENİYOR ===\n');

  // Önce tüm üyeleri sil
  const deletedMembers = await prisma.industryMember.deleteMany({});
  console.log(`✓ ${deletedMembers.count} üye silindi`);

  // Sonra tüm grupları sil
  const deletedGroups = await prisma.industryGroup.deleteMany({});
  console.log(`✓ ${deletedGroups.count} sanayi grubu silindi`);

  console.log('\n=== EXCEL VERİLERİ EKLENİYOR ===\n');

  // Excel dosyasını oku
  const workbook = XLSX.readFile('C:\\Users\\Huawei\\Desktop\\kysd-cms\\Kitap1.xlsx');
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  // Grupları ve üyeleri ayır
  const groups = [];
  let currentGroup = null;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (!row || row.length === 0) continue;

    // Grup başlığı kontrolü
    if (!row[0] && row[1] && typeof row[1] === 'string' && row[1].trim()) {
      if (!row[2] && !row[3]) {
        currentGroup = {
          name: row[1].trim(),
          members: []
        };
        groups.push(currentGroup);
      }
    }
    // Üye kontrolü
    else if (row[0] && typeof row[0] === 'number' && currentGroup) {
      const rawName = row[1] ? row[1].toString().trim() : '';
      const cleanedName = cleanCompanyName(rawName);

      if (cleanedName) {
        const member = {
          companyName: cleanedName,
          mobile: row[2] ? row[2].toString().trim() : '',
          phone: row[3] ? row[3].toString().trim() : '',
          fax: row[4] ? row[4].toString().trim() : '',
          email: row[5] ? row[5].toString().trim().split(';')[0] : '',
          address: row[6] ? row[6].toString().trim() : '',
          website: row[7] ? row[7].toString().trim() : ''
        };
        currentGroup.members.push(member);
      }
    }
  }

  // Boş grupları filtrele
  const validGroups = groups.filter(g => g.members.length > 0);

  console.log(`${validGroups.length} sanayi grubu bulundu.\n`);

  // Veritabanına ekle
  for (let i = 0; i < validGroups.length; i++) {
    const group = validGroups[i];
    const slug = createSlug(group.name);

    // Grubu oluştur
    const dbGroup = await prisma.industryGroup.create({
      data: {
        name: group.name,
        slug: slug,
        description: `${group.name} sektöründe faaliyet gösteren KYSD üyesi firmalar.`,
        order: i + 1,
        isActive: true
      }
    });

    console.log(`[${i + 1}/${validGroups.length}] ${dbGroup.name} (${group.members.length} üye)`);

    // Üyeleri ekle
    for (let j = 0; j < group.members.length; j++) {
      const member = group.members[j];

      // Telefon bilgisini birleştir
      let phoneInfo = member.phone || member.mobile || '';

      await prisma.industryMember.create({
        data: {
          companyName: member.companyName,
          phone: phoneInfo || null,
          email: member.email || null,
          website: member.website || null,
          address: member.address || null,
          order: j + 1,
          isActive: true,
          groupId: dbGroup.id
        }
      });
    }
  }

  console.log('\n=== TAMAMLANDI ===\n');

  // Özet bilgi
  const totalGroups = await prisma.industryGroup.count();
  const totalMembers = await prisma.industryMember.count();
  console.log(`Toplam ${totalGroups} sanayi grubu ve ${totalMembers} üye firma eklendi.`);

  // Grup detayları
  console.log('\nSanayi Grupları:');
  const allGroups = await prisma.industryGroup.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { order: 'asc' }
  });

  allGroups.forEach((g, i) => {
    console.log(`  ${i + 1}. ${g.name} (${g._count.members} üye)`);
  });
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
