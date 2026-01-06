const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanPastEvents() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('Bugün:', today.toISOString().split('T')[0]);

  // Geçmiş eğitimleri sil
  const deletedTrainings = await prisma.training.deleteMany({
    where: {
      eventDate: { lt: today }
    }
  });
  console.log('Silinen geçmiş eğitimler:', deletedTrainings.count);

  // Geçmiş fuarları sil (bitiş tarihi bugünden önce)
  const deletedFairs = await prisma.fair.deleteMany({
    where: {
      endDate: { lt: today }
    }
  });
  console.log('Silinen geçmiş fuarlar:', deletedFairs.count);

  // Tamamlanmış projeleri sil (bitiş tarihi bugünden önce)
  const deletedProjects = await prisma.project.deleteMany({
    where: {
      endDate: { lt: today }
    }
  });
  console.log('Silinen tamamlanmış projeler:', deletedProjects.count);

  // Kalan verileri listele
  console.log('\n=== KALAN VERİLER ===');

  const trainings = await prisma.training.findMany({ select: { title: true, eventDate: true } });
  console.log('\nEğitimler (' + trainings.length + '):');
  trainings.forEach(t => console.log('-', t.title, '|', t.eventDate?.toISOString().split('T')[0]));

  const fairs = await prisma.fair.findMany({ select: { title: true, startDate: true, endDate: true } });
  console.log('\nFuarlar (' + fairs.length + '):');
  fairs.forEach(f => console.log('-', f.title, '|', f.startDate?.toISOString().split('T')[0]));

  const projects = await prisma.project.findMany({ select: { title: true, status: true, endDate: true } });
  console.log('\nProjeler (' + projects.length + '):');
  projects.forEach(p => console.log('-', p.title, '|', p.status));

  await prisma.$disconnect();
}

cleanPastEvents();
