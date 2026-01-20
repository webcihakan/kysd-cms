-- Askı Sanayi (Grup 12)
INSERT INTO industry_members (id,companyName,phone,email,website,address,`order`,isActive,groupId,createdAt,updatedAt) VALUES 
(147,'DOGUS PLASTIK MAKINE KALIP','0212 481 11 88','cengiz@dogusaski.com.tr','www.dogusaski.com.tr','Maltepe Zeytinburnu',3,1,12,NOW(),NOW()),
(145,'MAINETTI ASKI','0212 875 07 23','sales@turkey.mainetti.com','www.mainettigroup.com','Beylikduzu',1,1,12,NOW(),NOW()),
(146,'NYN AHSAP VE METAL','0212 472 07 81','satis@nyn.com.tr','www.nyn.com.tr','Ikitelli',2,1,12,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();

-- Dar Dokuma (Grup 13) - 20 üye
INSERT INTO industry_members (id,companyName,phone,email,`order`,isActive,groupId,createdAt,updatedAt) VALUES
(150,'AKAR TEKSTIL','0212 556 13 47','info@akartekstil.com.tr',3,1,13,NOW(),NOW()),
(149,'AR-TEKS TEKSTIL','0212 886 51 71','muharrem@ar-teks.com',2,1,13,NOW(),NOW()),
(148,'ARMOTEKS DOKUMA','0232 257 51 48','armotex@armotex.com',1,1,13,NOW(),NOW()),
(151,'AZIZEM TEKS','0212 422 17 30','info@azizemtekstil.com',4,1,13,NOW(),NOW()),
(152,'BOYTEKS DAR DOK','0212 637 87 24','info@boyteks.net',5,1,13,NOW(),NOW()),
(153,'CETINKAYA KURDELE','0212 652 99 96','gokhan@cetinkayakurdele.com',6,1,13,NOW(),NOW()),
(154,'DOKUTEKS DAR DOKUMA','0212 295 06 05','dokuteks@dokuteks.com',7,1,13,NOW(),NOW()),
(155,'DONATIM TICARET','0212 511 26 51','satis@donatimticaret.com.tr',8,1,13,NOW(),NOW()),
(156,'ERKAN AKSESUAR','0212 555 50 81','erkan@erkantekstilaksesuar.com',9,1,13,NOW(),NOW()),
(157,'GULEN DAR TEKSTIL','0212 657 49 12','info@gulendartekstil.com',10,1,13,NOW(),NOW()),
(158,'GUR AKSESUAR','0212 637 66 66','muhasebe@guraksesuar.com',11,1,13,NOW(),NOW()),
(159,'MASIV ENDUSTRI','0212 671 28 12','m.oztaskin@masiv.com.tr',12,1,13,NOW(),NOW()),
(160,'OZ-EL LASTIK','0212 551 25 33','funda.ozturk@oz-el.com',13,1,13,NOW(),NOW()),
(161,'OZEL KURDELE','0212 554 25 85','muzaffer.ozturk@ozelkurdele.com.tr',14,1,13,NOW(),NOW()),
(162,'PARS TEKSTIL','0216 304 24 00','marketing@parteks.com',15,1,13,NOW(),NOW()),
(163,'RIMTEKS ORME','0212 422 09 00','info@rimteksorme.com',16,1,13,NOW(),NOW()),
(164,'SIRTEKS','0532 366 77 75','sirteks@gmail.com',17,1,13,NOW(),NOW()),
(165,'TASKIN TEKSTIL','0212 579 21 48','taskin@taskinteks.com',18,1,13,NOW(),NOW()),
(166,'TUR-IP TEKSTIL','0212 617 43 00','aksesuar@turip.com.tr',19,1,13,NOW(),NOW()),
(167,'KOSAROGLU TEKSTIL','0212 677 58 40','kosaroglu@kosaroglu.com.tr',20,1,13,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
