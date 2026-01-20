DELETE FROM virtual_booth_types;
INSERT INTO virtual_booth_types (id,fairId,name,description,price,features,maxProducts,`order`,isActive,createdAt,updatedAt) VALUES
(1,1,'Premium Stand','En genis alan, sinirsiz urun, ozel tasarim, video ve katalog destegi. Ana sayfada one cikarilma.','15000','["Sinirsiz Urun","Video Galeri","Katalog Indirme","One Cikarma","Canli Destek Badge"]',50,1,1,NOW(),NOW()),
(2,1,'Standart Stand','Orta olcekli firmalar icin ideal. 25 urun, video ve katalog destegi.','8000','["25 Urun","Video Galeri","Katalog Indirme"]',25,2,1,NOW(),NOW()),
(3,1,'Baslangic Stand','Kucuk firmalar ve yeni girisimciler icin ekonomik secenek.','3500','["10 Urun","Firma Logosu","Iletisim Bilgileri"]',10,3,1,NOW(),NOW()),
(4,2,'Gold Stand','Maksimum gorunurluk ve tum ozellikler dahil.','12000','["40 Urun","Video","Katalog","One Cikarma"]',40,1,1,NOW(),NOW()),
(5,2,'Silver Stand','Orta seviye firmalar icin ideal paket.','6000','["20 Urun","Video","Katalog"]',20,2,1,NOW(),NOW()),
(6,2,'Bronze Stand','Baslangic seviyesi icin uygun fiyatli secenek.','2500','["8 Urun","Firma Bilgileri"]',8,3,1,NOW(),NOW());
