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
  // Parantez içindeki notları ve özel notları temizle
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
  console.log('Excel dosyası okunuyor...');

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
          phone: row[3] ? row[3].toString().trim() : (row[2] ? row[2].toString().trim() : ''),
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

  console.log(`\n${validGroups.length} sanayi grubu bulundu.`);

  // Veritabanına ekle
  for (let i = 0; i < validGroups.length; i++) {
    const group = validGroups[i];
    const slug = createSlug(group.name);

    console.log(`\n[${i + 1}/${validGroups.length}] ${group.name} (${group.members.length} üye)`);

    // Önce grubu kontrol et veya oluştur
    let dbGroup = await prisma.industryGroup.findFirst({
      where: { slug: slug }
    });

    if (!dbGroup) {
      dbGroup = await prisma.industryGroup.create({
        data: {
          name: group.name,
          slug: slug,
          description: `${group.name} sektöründe faaliyet gösteren firmalar.`,
          order: i + 1,
          isActive: true
        }
      });
      console.log(`  ✓ Grup oluşturuldu: ${dbGroup.name}`);
    } else {
      console.log(`  ○ Grup mevcut: ${dbGroup.name}`);
    }

    // Üyeleri ekle
    for (let j = 0; j < group.members.length; j++) {
      const member = group.members[j];

      // Aynı isimde üye var mı kontrol et
      const existingMember = await prisma.industryMember.findFirst({
        where: {
          companyName: member.companyName,
          groupId: dbGroup.id
        }
      });

      if (!existingMember) {
        await prisma.industryMember.create({
          data: {
            companyName: member.companyName,
            phone: member.phone || null,
            email: member.email || null,
            website: member.website || null,
            address: member.address || null,
            order: j + 1,
            isActive: true,
            groupId: dbGroup.id
          }
        });
        console.log(`    + ${member.companyName}`);
      } else {
        console.log(`    ○ ${member.companyName} (mevcut)`);
      }
    }
  }

  console.log('\n\n=== TAMAMLANDI ===');

  // Özet bilgi
  const totalGroups = await prisma.industryGroup.count();
  const totalMembers = await prisma.industryMember.count();
  console.log(`Toplam ${totalGroups} sanayi grubu ve ${totalMembers} üye firma veritabanında.`);
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
