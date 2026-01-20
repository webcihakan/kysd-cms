const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const menus = await prisma.menu.findMany({
    where: {
      OR: [
        { title: { contains: 'Q' } },
        { title: { contains: 'Belge' } },
        { title: { contains: 'Kalite' } }
      ]
    },
    include: {
      children: true
    }
  });
  
  console.log('Q Belgesi ile ilgili menüler:');
  menus.forEach(m => {
    console.log(`- ${m.title} (URL: ${m.url})`);
    if (m.children && m.children.length > 0) {
      m.children.forEach(c => console.log(`  - ${c.title} (URL: ${c.url})`));
    }
  });
  
  await prisma.$disconnect();
}

check().catch(console.error);
