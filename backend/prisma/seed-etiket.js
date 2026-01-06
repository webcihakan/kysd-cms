const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Etiket Sanayi üyeleri ekleniyor...');

  // Etiket Sanayi grubunu bul
  const group = await prisma.industryGroup.findUnique({
    where: { slug: 'etiket-sanayi' }
  });

  if (!group) {
    console.log('Etiket Sanayi grubu bulunamadı!');
    return;
  }

  const members = [
    {
      companyName: 'DİZAYN ETİKET',
      address: 'Çobançeşme Mah. Sanayi Cad. Kalender Sok. No: 28 Yenibosna / İstanbul',
      phone: '0212 551 11 66',
      email: 'info@dizaynetiket.com',
      website: 'http://www.dizaynetiket.com',
      order: 1
    },
    {
      companyName: 'ETİKET SANAYİ A.Ş.',
      address: 'Yenibosna Mrk Mah. Prof Dr.Nevzat Pisak Cad.4/5 Blok No:13 Bahçelievler',
      phone: '0212 552 38 00',
      email: 'etiket@etiketsanayi.com',
      website: 'http://www.etiketsanayi.com',
      order: 2
    },
    {
      companyName: 'MEGA ETİKET VE TEKSTİL SANAYİ VE TİC.LTD ŞTİ',
      address: 'Keresteciler Sit.Mehmet Akif Cad. No:44 Merter/İstanbul',
      phone: '0212 637 45 70',
      email: 'info@megaetiket.com',
      website: 'http://www.megaetiket.com',
      order: 3
    },
    {
      companyName: 'NETSAN ETİKET VE MATBAA - NEDİM BALCI',
      address: 'Orta Mah.Trikocular Cad.Ceyhan Sk.No:11/A Bayrampaşa / İstanbul',
      phone: '0212 553 00 00',
      email: 'netsan@netsanetiket.com.tr',
      website: 'http://www.netsanetiket.com.tr',
      order: 4
    },
    {
      companyName: 'RAKAM ETİKET VE JAK. DAR. DOK. SAN. VE TİC. A.Ş.',
      address: 'Fatih Cad. Kasım Sok. No:10 Merter / İstanbul',
      phone: '0212 502 66 89',
      email: 'info@rakametiket.com',
      website: 'http://www.rakametiket.com',
      order: 5
    },
    {
      companyName: 'REBİLTEKS ETİKET SAN.VE TİC.LTD.ŞTİ.',
      address: 'Davutpaşa Cad.Emintaş Matbaacılar Sitesi, No:266/267 Topkapı-İstanbul',
      phone: '0850 811 70 71',
      email: 'info@rebilgroup.com',
      website: 'http://www.rebilgroup.com',
      order: 6
    },
    {
      companyName: 'SAYPAŞ ETİKET SAN.VE TİC.LTD.ŞTİ.',
      address: 'Prof.Dr.Nevzat Pisak cd.Doğu San.Sit. No:4/1 Kapı:11-14A Bahçelievler-İstanbul',
      phone: '0212 639 47 29',
      email: 'info@saypasetiket.com.tr',
      website: 'http://www.saypasetiket.com.tr',
      order: 7
    },
    {
      companyName: 'SEDEF ETİKET VE MATBAACILIK SAN.',
      address: 'Organize Sanayi Bölgesi Atatürk bulvarı 10.cadde 34 Portall İş Merkezi Altı zemin kat İkitelli/İstanbul',
      phone: '0212 485 67 50',
      email: 'info@sedefetiket.com',
      website: 'http://www.sedefetiket.com',
      order: 8
    },
    {
      companyName: 'SERTKAYA TEKSTİL AKS. TUR. YAT. İŞL. TİC. LTD. ŞTİ.',
      address: 'Aykosan Ayakkabıcılar San. Sitesi F Blok No: 13 İkitelli / İstanbul',
      phone: '0212 545 41 53',
      email: 'sertkayaturizm@doruk.net.tr',
      website: null,
      order: 9
    },
    {
      companyName: 'ŞEN ETİKET MATBAACILIK LTD.ŞTİ.',
      address: 'Davutpaşa Cad. Emintaş San.Sit. No:103/288-289 Topkapı/İstanbul',
      phone: '0212 565 51 45',
      email: 'ibrahim@senetiket.com.tr',
      website: 'https://www.senetiket.com.tr',
      order: 10
    },
    {
      companyName: 'ŞİMŞEK EGE MATBAA.ÜR.SAN.TİC.LTD.ŞTİ',
      address: 'Zafer Mahallesi 148. Sokak No:5 Esenyurt-Istanbul (34513)',
      phone: '0212 444 7 343',
      email: 'pazarlama@simsekege.com.tr',
      website: 'http://www.simsekege.com.tr',
      order: 11
    },
    {
      companyName: 'TUNTEKS ETİKET KONF. VE DOK. SAN. TİC. A.Ş.',
      address: 'Yenibosna Merkez Remzi Özkaya Cad.No :4 Bahçelievler / İstanbul',
      phone: '0212 503 55 56',
      email: 'info@tunteks.com',
      website: 'http://www.tunteks.com',
      order: 12
    },
    {
      companyName: 'TEKSPA KONFEKSİYON TEKSTİL SANAYİ VE TİC.A.Ş.',
      address: 'Sanayi Mah.Kanarya cad.Çavuşoğlu Sokak No:2/1 Güngören/İstanbul',
      phone: '0212 637 49 04',
      email: 'emrah@tekspa.com.tr',
      website: 'http://www.tekspa.com.tr',
      order: 13
    },
    {
      companyName: 'TREND ETİKET KEMER DERİ METAL AKS.LTD.ŞTİ.',
      address: 'İkitelli OSB.Fatih San.Sit.4A Blok No:1 Kat:2 Başakşehir',
      phone: '0212 478 10 79',
      email: 'trend@trendetiket.com.tr',
      website: 'http://www.trendetiket.com.tr',
      order: 14
    },
    {
      companyName: 'VINTAGE TEKSTİL VE DERİ ÜRÜN.İTH.İHR.SAN.TİC.LTD.ŞTİ.',
      address: 'Sağlık Mah.Edirne Bulvarı No 105 Ergene / Tekirdağ',
      phone: '0282 654 34 38',
      email: 'mesut@vintagetrimmings.com',
      website: 'http://www.vintagetrimmings.com',
      order: 15
    },
    {
      companyName: 'TRENDBARKOD ETİKET SAN.TİC.LTD.ŞTİ.',
      address: 'Mehmet Nesih Özmen Mah.Kavaklı Sk.No:5/B Güngören Merter / İstanbul',
      phone: '0212 551 33 41',
      email: 'murat@trendbarkod.com',
      website: 'http://www.trendbarkod.com',
      order: 16
    },
    {
      companyName: 'YENEL TEKS.ETİKET MATB. SAN.VE TİC.LTD.ŞTİ.',
      address: 'Mithatpaşa Cad. Çardak Sk.Saç San.Sitesi No:16/2 Y.Bosna/İstanbul',
      phone: '0212 552 20 86',
      email: 'info@yeneletiket.com',
      website: 'http://www.yeneletiket.com',
      order: 17
    }
  ];

  for (const member of members) {
    const existing = await prisma.industryMember.findFirst({
      where: {
        companyName: member.companyName,
        groupId: group.id
      }
    });

    if (!existing) {
      await prisma.industryMember.create({
        data: {
          ...member,
          groupId: group.id,
          isActive: true
        }
      });
      console.log('Eklendi:', member.companyName);
    } else {
      console.log('Zaten mevcut:', member.companyName);
    }
  }

  console.log('Etiket Sanayi üyeleri eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
