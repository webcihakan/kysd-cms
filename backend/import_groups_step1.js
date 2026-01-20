const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const groups = [
  {id:12,name:'Aski Sanayi Grubu ve Uyeleri',slug:'aski-sanayi-grubu-ve-uyeleri',description:'Aski Sanayi Grubu ve Uyeleri sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:1,isActive:true},
  {id:13,name:'Dar Dokuma ve Orme Sanayi',slug:'dar-dokuma-ve-orme-sanayi',description:'Dar Dokuma ve Orme Sanayi sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:2,isActive:true},
  {id:14,name:'Dugme - Toka ve Metal Aksesuar Sanayi',slug:'dugme-toka-ve-metal-aksesuar-sanayi',description:'Dugme - Toka ve Metal Aksesuar Sanayi sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:3,isActive:true},
  {id:15,name:'Etiket Sanayi',slug:'etiket-sanayi',description:'Etiket Sanayi sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:4,isActive:true},
  {id:16,name:'Fermuar Sanayi ve Grubu Uyeleri',slug:'fermuar-sanayi-ve-grubu-uyeleri',description:'Fermuar Sanayi ve Grubu Uyeleri sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:5,isActive:true},
  {id:18,name:'Iplik Sanayi',slug:'iplik-sanayi',description:'Iplik Sanayi sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:7,isActive:true},
  {id:19,name:'Kapitone Sanayi',slug:'kapitone-sanayi',description:'Kapitone Sanayi sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:8,isActive:true},
  {id:17,name:'Tela, Elyaf ve Vatka Sanayi',slug:'tela-elyaf-ve-vatka-sanayi',description:'Tele Elyaf ve Vatka Sanayi sektorunde faaliyet gosteren KYSD uyesi firmalar.',image:null,order:6,isActive:true}
];

async function main() {
  console.log('Importing industry groups...');
  for (const group of groups) {
    await prisma.industryGroup.create({ data: group });
  }
  console.log('Industry groups imported:', groups.length);
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
