const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting import...');
  
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0');
  console.log('Disabled foreign key checks');
  
  console.log('Clearing tables...');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE menus');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE pages');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE sliders');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE news');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE settings');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE industry_members');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE industry_groups');
  console.log('Tables cleared');
  
  console.log('Importing menus...');
  const parentMenus = [
    {id:35,title:'Kurumsal',url:null,pageId:null,parentId:null,order:1,isActive:true,target:'_self'},
    {id:40,title:'Uyelik',url:null,pageId:null,parentId:null,order:2,isActive:true,target:'_self'},
    {id:44,title:'Sektorel Bilgiler',url:null,pageId:null,parentId:null,order:3,isActive:true,target:'_self'},
    {id:48,title:'Faaliyetler',url:null,pageId:null,parentId:null,order:4,isActive:true,target:'_self'},
    {id:52,title:'Medya',url:null,pageId:null,parentId:null,order:5,isActive:true,target:'_self'},
    {id:56,title:'Iletisim',url:'/iletisim',pageId:null,parentId:null,order:6,isActive:true,target:'_self'}
  ];
  
  for (const menu of parentMenus) {
    await prisma.menu.create({ data: menu });
  }
  
  const childMenus = [
    {id:36,title:'Hakkimizda',url:'/hakkimizda',pageId:null,parentId:35,order:1,isActive:true,target:'_self'},
    {id:38,title:'Yonetim Kurulu',url:'/yonetim-kurulu',pageId:null,parentId:35,order:3,isActive:true,target:'_self'},
    {id:39,title:'Tuzuk',url:'/tuzuk',pageId:null,parentId:35,order:4,isActive:true,target:'_self'},
    {id:41,title:'Neden Uye Olmaliyim?',url:'/neden-uye-olmaliyim',pageId:null,parentId:40,order:1,isActive:true,target:'_self'},
    {id:42,title:'Uyelik Basvurusu',url:'/uyelik-basvurusu',pageId:null,parentId:40,order:2,isActive:true,target:'_self'},
    {id:43,title:'Uye Rehberi',url:'/uyeler',pageId:null,parentId:40,order:3,isActive:true,target:'_self'},
    {id:45,title:'Sektor Raporlari',url:'/sektor-raporlari',pageId:null,parentId:44,order:1,isActive:true,target:'_self'},
    {id:46,title:'Mevzuat',url:'/mevzuat',pageId:null,parentId:44,order:2,isActive:true,target:'_self'},
    {id:47,title:'Tesvik ve Destekler',url:'/tesvik-ve-destekler',pageId:null,parentId:44,order:3,isActive:true,target:'_self'},
    {id:49,title:'Egitimler & Seminerler',url:'/egitimler-seminerler',pageId:null,parentId:48,order:1,isActive:true,target:'_self'},
    {id:50,title:'Projeler',url:'/projeler',pageId:null,parentId:48,order:2,isActive:true,target:'_self'},
    {id:51,title:'Fuarlar',url:'/fuarlar',pageId:null,parentId:48,order:3,isActive:true,target:'_self'},
    {id:53,title:'Haberler',url:'/haberler',pageId:null,parentId:52,order:1,isActive:true,target:'_self'},
    {id:54,title:'Duyurular',url:'/duyurular',pageId:null,parentId:52,order:2,isActive:true,target:'_self'},
    {id:55,title:'Galeri',url:'/galeri',pageId:null,parentId:52,order:3,isActive:true,target:'_self'}
  ];
  
  for (const menu of childMenus) {
    await prisma.menu.create({ data: menu });
  }
  console.log('Menus imported: 21 total');
  
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1');
  console.log('Enabled foreign key checks');
  
  console.log('Import completed successfully!');
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
