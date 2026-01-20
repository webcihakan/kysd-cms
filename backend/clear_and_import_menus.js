const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting import...');
  
  // Disable foreign key checks
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=0');
  
  // Clear menus
  await prisma.$executeRawUnsafe('TRUNCATE TABLE menu');
  console.log('Cleared menus');
  
  // Import parent menus first
  const parentMenus = [
    {id:35,title:'Kurumsal',url:null,pageId:null,parentId:null,order:1,isActive:true,target:'_self'},
    {id:40,title:'Üyelik',url:null,pageId:null,parentId:null,order:2,isActive:true,target:'_self'},
    {id:44,title:'Sektörel Bilgiler',url:null,pageId:null,parentId:null,order:3,isActive:true,target:'_self'},
    {id:48,title:'Faaliyetler',url:null,pageId:null,parentId:null,order:4,isActive:true,target:'_self'},
    {id:52,title:'Medya',url:null,pageId:null,parentId:null,order:5,isActive:true,target:'_self'},
    {id:56,title:'İletişim',url:'/iletisim',pageId:null,parentId:null,order:6,isActive:true,target:'_self'}
  ];
  
  for (const menu of parentMenus) {
    await prisma.menu.create({ data: menu });
  }
  console.log('Created parent menus');
  
  // Import child menus
  const childMenus = [
    {id:36,title:'Hakkımızda',url:'/hakkimizda',pageId:null,parentId:35,order:1,isActive:true,target:'_self'},
    {id:38,title:'Yönetim Kurulu',url:'/yonetim-kurulu',pageId:null,parentId:35,order:3,isActive:true,target:'_self'},
    {id:39,title:'Tüzük',url:'/tuzuk',pageId:null,parentId:35,order:4,isActive:true,target:'_self'},
    {id:41,title:'Neden Üye Olmalıyım?',url:'/neden-uye-olmaliyim',pageId:null,parentId:40,order:1,isActive:true,target:'_self'},
    {id:42,title:'Üyelik Başvurusu',url:'/uyelik-basvurusu',pageId:null,parentId:40,order:2,isActive:true,target:'_self'},
    {id:43,title:'Üye Rehberi',url:'/uyeler',pageId:null,parentId:40,order:3,isActive:true,target:'_self'},
    {id:45,title:'Sektör Raporları',url:'/sektor-raporlari',pageId:null,parentId:44,order:1,isActive:true,target:'_self'},
    {id:46,title:'Mevzuat',url:'/mevzuat',pageId:null,parentId:44,order:2,isActive:true,target:'_self'},
    {id:47,title:'Teşvik ve Destekler',url:'/tesvik-ve-destekler',pageId:null,parentId:44,order:3,isActive:true,target:'_self'},
    {id:49,title:'Eğitimler & Seminerler',url:'/egitimler-seminerler',pageId:null,parentId:48,order:1,isActive:true,target:'_self'},
    {id:50,title:'Projeler',url:'/projeler',pageId:null,parentId:48,order:2,isActive:true,target:'_self'},
    {id:51,title:'Fuarlar',url:'/fuarlar',pageId:null,parentId:48,order:3,isActive:true,target:'_self'},
    {id:53,title:'Haberler',url:'/haberler',pageId:null,parentId:52,order:1,isActive:true,target:'_self'},
    {id:54,title:'Duyurular',url:'/duyurular',pageId:null,parentId:52,order:2,isActive:true,target:'_self'},
    {id:55,title:'Galeri',url:'/galeri',pageId:null,parentId:52,order:3,isActive:true,target:'_self'}
  ];
  
  for (const menu of childMenus) {
    await prisma.menu.create({ data: menu });
  }
  console.log('Created child menus');
  
  // Enable foreign key checks
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS=1');
  
  console.log('✅ Menus imported successfully!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
