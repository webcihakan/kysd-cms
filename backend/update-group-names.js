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

// İsim düzeltmeleri (mevcut isim -> yeni isim)
const nameUpdates = [
  { current: 'Askı Sanayi', newName: 'Askı Sanayi Grubu ve Üyeleri' },
  { current: 'Dar Dokuma ve Örme Sanayi', newName: 'Dar Dokuma ve Örme Sanayi' },
  { current: 'Düğme, Toka ve Metal Aksesuar Sanayi', newName: 'Düğme - Toka ve Metal Aksesuar Sanayi' },
  { current: 'Etiket Sanayi', newName: 'Etiket Sanayi' },
  { current: 'Fermuar Sanayi', newName: 'Fermuar Sanayi ve Grubu Üyeleri' },
  { current: 'Tela, Elyaf ve Vatka Sanayi', newName: 'Tele Elyaf ve Vatka Sanayi' }
];

// Yeni eklenecek boş gruplar
const newGroups = [
  'İplik Sanayi',
  'Kapitone Sanayi'
];

async function main() {
  console.log('=== SANAYİ GRUPLARI GÜNCELLENİYOR ===\n');

  // Mevcut grupları güncelle
  for (const update of nameUpdates) {
    const group = await prisma.industryGroup.findFirst({
      where: { name: update.current }
    });

    if (group) {
      const newSlug = createSlug(update.newName);
      await prisma.industryGroup.update({
        where: { id: group.id },
        data: {
          name: update.newName,
          slug: newSlug,
          description: `${update.newName} sektöründe faaliyet gösteren KYSD üyesi firmalar.`
        }
      });
      console.log(`  ✓ "${update.current}" → "${update.newName}"`);
    }
  }

  // Yeni boş grupları ekle
  console.log('\n=== YENİ GRUPLAR EKLENİYOR ===\n');

  const maxOrder = await prisma.industryGroup.aggregate({
    _max: { order: true }
  });
  let order = (maxOrder._max.order || 0) + 1;

  for (const groupName of newGroups) {
    // Zaten var mı kontrol et
    const existing = await prisma.industryGroup.findFirst({
      where: { name: groupName }
    });

    if (!existing) {
      const slug = createSlug(groupName);
      await prisma.industryGroup.create({
        data: {
          name: groupName,
          slug: slug,
          description: `${groupName} sektöründe faaliyet gösteren KYSD üyesi firmalar.`,
          order: order++,
          isActive: true
        }
      });
      console.log(`  + ${groupName} (yeni grup oluşturuldu)`);
    } else {
      console.log(`  ○ ${groupName} (zaten mevcut)`);
    }
  }

  // Üyeler menüsünü güncelle
  console.log('\n=== ÜYELER MENÜSÜ GÜNCELLENİYOR ===\n');

  // Önce eski Üyeler menüsünü ve alt menülerini sil
  const uyelerMenu = await prisma.menu.findFirst({
    where: { title: 'Üyeler' }
  });

  if (uyelerMenu) {
    await prisma.menu.deleteMany({
      where: { parentId: uyelerMenu.id }
    });
    await prisma.menu.delete({
      where: { id: uyelerMenu.id }
    });
  }

  // Yeni Üyeler menüsü oluştur
  const newUyelerMenu = await prisma.menu.create({
    data: {
      title: 'Üyeler',
      url: '/sanayi-gruplari',
      order: 4,
      isActive: true,
      target: '_self'
    }
  });

  // Güncel grupları al ve menüye ekle
  const allGroups = await prisma.industryGroup.findMany({
    orderBy: { order: 'asc' }
  });

  for (let i = 0; i < allGroups.length; i++) {
    const group = allGroups[i];
    await prisma.menu.create({
      data: {
        title: group.name,
        url: `/sanayi-grubu/${group.slug}`,
        parentId: newUyelerMenu.id,
        order: i + 1,
        isActive: true,
        target: '_self'
      }
    });
    console.log(`  + ${group.name}`);
  }

  console.log('\n=== GÜNCEL SANAYİ GRUPLARI ===\n');

  const finalGroups = await prisma.industryGroup.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { order: 'asc' }
  });

  finalGroups.forEach((g, i) => {
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
