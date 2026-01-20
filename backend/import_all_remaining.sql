-- Yonetim Kurulu (24 kisi)
TRUNCATE TABLE board_members;
INSERT INTO board_members (id,name,title,companyName,address,phone,`order`,isActive,createdAt,updatedAt) VALUES
(1,'Dr. Murat OZPEHLIVAN','Baskan','EMR FERMUAR','AKCABURGAZ MAH. ESENYURT-ISTANBUL','+90 212 886 69 70',1,1,NOW(),NOW()),
(2,'Gizem Ozcelik','Baskan Vekili','Cag-Tek Zamak Dugme','Sanayi mah. Gungoren/Istanbul','+90 212 557 09 22',2,1,NOW(),NOW()),
(3,'Sezai Boyraz','Baskan Yardimcisi','Boyteks','FATIH CAD Merter GUNGOREN ISTANBUL','+90 212 637 87 24',3,1,NOW(),NOW()),
(4,'Ismail Ali Sahin','Baskan Yardimcisi','Akbarkod Etiket','Mehmet Nesih Ozmen Mh. Gungoren/Istanbul','+90 212 637 25 30',4,1,NOW(),NOW()),
(5,'Okan Atabeyoglu','Baskan Yardimcisi','Ata Tekstil','Ikitelli OSB Basaksehir / Istanbul','+90 212 485 83 87',5,1,NOW(),NOW()),
(6,'Emirali Kilic','Baskan Yardimcisi','Trend Etiket','Ikitelli OSB Istanbul','+90 212 438 10 79',6,1,NOW(),NOW()),
(7,'Cemil Kiraz','Sayman','Bedi Dugme','Sanayi Mah. Gungoren/Istanbul','+90 212 995 06 07',7,1,NOW(),NOW()),
(8,'Mahmut Vanli','Yonetim Kurulu Uyesi','Vantela Tekstil','Cumhuriyet Mah. Domanic / Kutahya','+90 212 798 26 56',8,1,NOW(),NOW()),
(9,'Ramazan Tuncay','Yonetim Kurulu Uyesi','Bayteks','M.Nesih Ozmen Mh. Bagcilar / Istanbul','+90 212 513 21 31',9,1,NOW(),NOW()),
(10,'Mustafa Oktay','Yonetim Kurulu Uyesi','Form Dis Ticaret','Akcaburgaz Mah. Esenyurt - Istanbul','+90 212 886 17 00',10,1,NOW(),NOW()),
(11,'Izzet Kandemir','Yonetim Kurulu Uyesi','Izer Fermuar','Cobancesme Mah. Yenibosna Istanbul','+90 212 447 35 47',11,1,NOW(),NOW()),
(12,'Sait Gur','Yonetim Kurulu Uyesi','Gur Aksesuar','Mehmet Nesih Ozmen Gungoren/Istanbul','+90 212 637 66 66',12,1,NOW(),NOW()),
(13,'Sena Bahadir','Yonetim Kurulu Uyesi','Mega Etiket','Keresteciler Sitesi Merter Istanbul','+90 212 637 45 70',13,1,NOW(),NOW()),
(14,'Ibrahim Senturk','Yonetim Kurulu Uyesi','Sen Etiket','Maltepe Zeytinburnu/Istanbul','+90 212 565 51 45',14,1,NOW(),NOW()),
(15,'Emre Tanriverdi','Yonetim Kurulu Uyesi','Inci Fermuar','Firüzkoy Mahallesi Avcilar / Istanbul','+90 212 504 57 00',15,1,NOW(),NOW()),
(16,'Ilkan Argun','Yonetim Kurulu Uyesi','Kleopatra Dugme','Sanayi Mah. Gungoren / ISTANBUL','+90 212 643 72 72',16,1,NOW(),NOW()),
(17,'Murat Bekir Kondu','Yonetim Kurulu Uyesi','Menderes Tekstil','Adalet Mah. Bayrakli / Izmir','+90 232 435 05 65',17,1,NOW(),NOW()),
(18,'Emre Eroglu','Yonetim Kurulu Uyesi','Rebilteks Etiket','Maltepe Zeytinburnu/Istanbul','+90 850 811 70 71',18,1,NOW(),NOW()),
(19,'Filiz Guler','Yonetim Kurulu Uyesi','Guler Bijuteri','KOCATEPE MAH. BAYRAMPASA, ISTANBUL','+90 530 926 59 66',19,1,NOW(),NOW()),
(20,'Muharrem Celebi','Yonetim Kurulu Uyesi','Doga Metal','Samsun Sok. Gungoren / Istanbul','+90 212 637 11 73',20,1,NOW(),NOW()),
(21,'Birkan Haluk Ceylan','Yonetim Kurulu Uyesi','Emaks Tekstil','Genc Osman Cd. Gungoren, Istanbul','+90 212 644 08 44',21,1,NOW(),NOW()),
(22,'Omer Haksever','Yonetim Kurulu Uyesi','MSH Dugme','M. Nesih Ozmen Mah. Merter Istanbul','+90 212 644 29 30',22,1,NOW(),NOW()),
(23,'Yahya Ugur','Yonetim Kurulu Uyesi','Sirteks','Armaganevler Umraniye/Istanbul','+90 216 693 32 66',23,1,NOW(),NOW()),
(24,'Cengiz Sogut','Yonetim Kurulu Uyesi','Dogus Plastik','Kirklareli OSB Kirklareli','+90 288 263 40 81',24,1,NOW(),NOW());

-- Duyurular
TRUNCATE TABLE announcements;
INSERT INTO announcements (id,title,slug,content,excerpt,isActive,isPinned,createdAt,updatedAt) VALUES
(1,'2021 KYSD Olagan Kurul Duyurusu','2021-kysd-olagan-kurul-duyurusu','<p><strong>KONFEKSIYON YAN SANAYICILERI DERNEGI (K.Y.S.D.)</strong></p>','Olagan Genel Kurul Toplantimiz, 14 Ekim 2021 Persembe gunu saat 11:00 de Dernek Merkezimizde yapilacaktir.',1,1,'2021-10-07 00:00:00',NOW()),
(2,'6. Tekstil Aksesuarlari Sanal Fuari','6-tekstil-aksesuarlari-sanal-fuari','<p>Tekstil Aksesuarlari Sanal Fuari 25-27 Mayis Tarihinde Gerceklestirdik.</p>','Tekstil Aksesuarlari Sanal Fuari 25-27 Mayis Tarihinde Gerceklestirdik.',1,0,'2021-05-25 00:00:00',NOW());
