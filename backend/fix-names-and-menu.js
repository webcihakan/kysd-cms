const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Türkçe title case fonksiyonu
function toTurkishTitleCase(text) {
  const lowerMap = {
    'İ': 'i', 'I': 'ı', 'Ş': 'ş', 'Ğ': 'ğ', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç'
  };
  const upperMap = {
    'i': 'İ', 'ı': 'I', 'ş': 'Ş', 'ğ': 'Ğ', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç'
  };

  // Önce tamamını küçük harfe çevir (Türkçe karakterlere dikkat ederek)
  let lower = '';
  for (let char of text) {
    if (lowerMap[char]) {
      lower += lowerMap[char];
    } else {
      lower += char.toLowerCase();
    }
  }

  // Kelimelere ayır ve her kelimenin ilk harfini büyük yap
  const words = lower.split(' ');
  const result = words.map(word => {
    if (word.length === 0) return word;

    // "ve", "ve/veya" gibi bağlaçlar küçük kalsın (ilk kelime değilse)
    const conjunctions = ['ve', 'veya', 'ile'];
    if (conjunctions.includes(word)) {
      return word;
    }

    const firstChar = word[0];
    const rest = word.slice(1);

    // İlk harfi büyük yap (Türkçe karakterlere dikkat ederek)
    let upperFirst = upperMap[firstChar] || firstChar.toUpperCase();

    return upperFirst + rest;
  });

  return result.join(' ');
}

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

async function main() {
  console.log('=== SANAYİ GRUPLARI İSİMLERİ DÜZELTİLİYOR ===\n');

  const groups = await prisma.industryGroup.findMany({
    orderBy: { order: 'asc' }
  });

  for (const group of groups) {
    const newName = toTurkishTitleCase(group.name);
    const newSlug = createSlug(newName);

    await prisma.industryGroup.update({
      where: { id: group.id },
      data: {
        name: newName,
        slug: newSlug,
        description: `${newName} sektöründe faaliyet gösteren KYSD üyesi firmalar.`
      }
    });

    console.log(`  "${group.name}" → "${newName}"`);
  }

  console.log('\n=== ÜYELER MENÜSÜ EKLENİYOR ===\n');

  // Önce mevcut menüleri kontrol et
  const existingMenu = await prisma.menu.findFirst({
    where: { title: 'Üyeler' }
  });

  if (existingMenu) {
    console.log('Üyeler menüsü zaten mevcut, siliniyor...');
    // Alt menüleri sil
    await prisma.menu.deleteMany({
      where: { parentId: existingMenu.id }
    });
    // Ana menüyü sil
    await prisma.menu.delete({
      where: { id: existingMenu.id }
    });
  }

  // Menü sırasını bul
  const maxOrder = await prisma.menu.aggregate({
    _max: { order: true }
  });
  const newOrder = (maxOrder._max.order || 0) + 1;

  // Üyeler ana menüsünü oluştur
  const uyelerMenu = await prisma.menu.create({
    data: {
      title: 'Üyeler',
      url: '/sanayi-gruplari',
      order: 4, // Kurumsal'dan sonra
      isActive: true,
      target: '_self'
    }
  });

  console.log(`✓ "Üyeler" ana menüsü oluşturuldu`);

  // Alt menüler olarak sanayi gruplarını ekle
  const updatedGroups = await prisma.industryGroup.findMany({
    orderBy: { order: 'asc' }
  });

  for (let i = 0; i < updatedGroups.length; i++) {
    const group = updatedGroups[i];
    await prisma.menu.create({
      data: {
        title: group.name,
        url: `/sanayi-grubu/${group.slug}`,
        parentId: uyelerMenu.id,
        order: i + 1,
        isActive: true,
        target: '_self'
      }
    });
    console.log(`  + ${group.name}`);
  }

  console.log('\n=== TAMAMLANDI ===\n');

  // Menü yapısını göster
  const allMenus = await prisma.menu.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { order: 'asc' }
  });

  console.log('Menü Yapısı:');
  allMenus.forEach(menu => {
    console.log(`  ${menu.order}. ${menu.title}`);
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach(child => {
        console.log(`      - ${child.title}`);
      });
    }
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
