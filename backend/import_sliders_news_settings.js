const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sliders = [
  {id:1,title:'KYSD\'ye Hos Geldiniz',subtitle:'Konfeksiyon Yan Sanayi Dernegi olarak sektorun gelisimi icin calisiyoruz',image:'/uploads/slider/slider-1.jpg',mobileImage:null,link:'/hakkimizda',buttonText:'Hakkimizda',order:1,isActive:true},
  {id:2,title:'Sanayi Gruplarimiz',subtitle:'7 farkli sanayi grubunda yuzlerce uye firma ile guclu bir ag',image:'/uploads/slider/slider-sanayi.jpg',mobileImage:null,link:'/sanayi-gruplari',buttonText:'Gruplari Incele',order:2,isActive:true},
  {id:3,title:'KYSD Akademi',subtitle:'Sektore yonelik egitim ve gelisim programlari',image:'/uploads/slider/slider-3.jpg',mobileImage:null,link:'/kysd-akademi',buttonText:'Egitimleri Gor',order:3,isActive:true},
  {id:4,title:'Sanayi Gruplarimiz',subtitle:'7 farkli sanayi grubunda yuzlerce uye firma ile guclu bir ag',image:'/uploads/slider/slider-sanayi.jpg',mobileImage:null,link:'/sanayi-gruplari',buttonText:'Gruplari Incele',order:4,isActive:true},
  {id:5,title:'Uye Firmalarimiz',subtitle:'Konfeksiyon yan sanayi sektorunun onde gelen firmalari',image:'/uploads/slider/slider-3.jpg',mobileImage:null,link:'/sanayi-gruplari',buttonText:'Firmalari Gor',order:5,isActive:true},
  {id:6,title:'Bize Katilin',subtitle:'KYSD ailesine katilarak sektordeki yerinizi alin',image:'/uploads/slider/slider-1.jpg',mobileImage:null,link:'/kayit',buttonText:'Uye Ol',order:6,isActive:true}
];

const settings = {
  site_name:'KYSD - Konfeksiyon Yan Sanayi Dernegi',
  site_description:'Konfeksiyon Yan Sanayi Dernegi Resmi Web Sitesi',
  contact_email:'kysd@kysd.org.tr',
  contact_phone:'0212 438 12 96 – 97',
  contact_address:'Giyimkent Sitesi 11. Sokak No:33 Esenler – ISTANBUL',
  social_facebook:'',
  social_twitter:'',
  social_instagram:'',
  social_linkedin:''
};

async function main() {
  console.log('Importing sliders...');
  for (const slider of sliders) {
    await prisma.slider.create({ data: slider });
  }
  console.log('Sliders imported:', sliders.length);
  
  console.log('Importing settings...');
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value, type: 'text', group: 'general' }
    });
  }
  console.log('Settings imported');
  
  console.log('All data imported successfully!');
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
