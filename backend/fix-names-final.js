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

// Düzeltilmiş isimler
const corrections = {
  'Askı Sanayi': 'Askı Sanayi',
  'Dar Dokuma ve Örme Sanayi': 'Dar Dokuma ve Örme Sanayi',
  'Düğme-toka ve Metal Aksesuar Sanayi': 'Düğme, Toka ve Metal Aksesuar Sanayi',
  'Etiket Sanayi': 'Etiket Sanayi',
  'Fermuar Sanayi': 'Fermuar Sanayi',
  'Tela,elyaf ve Vatka Sanayi': 'Tela, Elyaf ve Vatka Sanayi'
};

async function main() {
  console.log('=== İSİMLER DÜZELTİLİYOR ===\n');

  for (const [oldName, newName] of Object.entries(corrections)) {
    const group = await prisma.industryGroup.findFirst({
      where: { name: oldName }
    });

    if (group) {
      const newSlug = createSlug(newName);
      await prisma.industryGroup.update({
        where: { id: group.id },
        data: {
          name: newName,
          slug: newSlug,
          description: `${newName} sektöründe faaliyet gösteren KYSD üyesi firmalar.`
        }
      });
      console.log(`  ✓ "${oldName}" → "${newName}"`);

      // Menüdeki ismi de güncelle
      await prisma.menu.updateMany({
        where: { title: oldName },
        data: {
          title: newName,
          url: `/sanayi-grubu/${newSlug}`
        }
      });
    }
  }

  console.log('\n=== GÜNCEL SANAYİ GRUPLARI ===\n');

  const groups = await prisma.industryGroup.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { order: 'asc' }
  });

  groups.forEach((g, i) => {
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
