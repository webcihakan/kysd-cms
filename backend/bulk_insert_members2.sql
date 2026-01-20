-- Dugme-Toka (Grup 14) - 19 uye
INSERT INTO industry_members (id,companyName,phone,email,`order`,isActive,groupId,createdAt,updatedAt) VALUES
(168,'BUFALO DUGME','0212 798 27 26','info@bufalo.com.tr',1,1,14,NOW(),NOW()),
(169,'ATA TEKSTIL AKSESUARLARI','0212 677 23 50','ata@ataimalat.com',2,1,14,NOW(),NOW()),
(170,'CAG-TEK ZAMAK DUGME','0212 553 17 81','m.ozcelik@cag-tek.com.tr',3,1,14,NOW(),NOW()),
(171,'D.VECI TEKSTIL','0212 637 55 10','suna@d-veci.com',4,1,14,NOW(),NOW()),
(172,'DOGA METAL DUGME','0212 637 11 73','info@dogametal.com',5,1,14,NOW(),NOW()),
(173,'EMAKS TEKSTIL AKSESUAR','0212 644 08 44','birkan@emaksesuar.com',6,1,14,NOW(),NOW()),
(174,'BEDI DUGME AKSESUAR','0212 995 06 07','info@example.com',7,1,14,NOW(),NOW()),
(175,'FORM DIS TICARET','0212 886 17 00','info@formdis.com',8,1,14,NOW(),NOW()),
(176,'HITIT TEKSTIL','0212 637 03 34','gcaglar@hitittransfer.com',9,1,14,NOW(),NOW()),
(177,'KEM-SAN DUGME AKSESUAR','0212 507 38 13','info@kemsanaksesuar.com',10,1,14,NOW(),NOW()),
(178,'KLEOPATRA DUGME','0212 643 72 72','info@kleopatradugme.com.tr',11,1,14,NOW(),NOW()),
(179,'KOMET METAL','0212 481 22 17','komet@kometmetal.com.tr',12,1,14,NOW(),NOW()),
(180,'NOYAN GRUP','0212 557 34 44','info@noyangroup.com',13,1,14,NOW(),NOW()),
(181,'PLASSAN DUGME','0212 225 17 65','info@plassanbutton.com',14,1,14,NOW(),NOW()),
(182,'POLSAN DUGME','0216 488 87 87','info@polsanbutton.com.tr',15,1,14,NOW(),NOW()),
(183,'SPORTMEN DUGME','0212 507 57 60','ihsan@sportmendugme.com.tr',16,1,14,NOW(),NOW()),
(184,'TIMAY CIT CIT','0212 482 37 62','info@timay-tempo.com',17,1,14,NOW(),NOW()),
(185,'URCEL TICARET','0212 407 02 07','ayseguluran@urcelticaret.com',18,1,14,NOW(),NOW()),
(186,'IZMIR FINAL DUGME','0212 630 36 08','info@finaldugme.com',19,1,14,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();

-- Etiket Sanayi (Grup 15) - 19 uye
INSERT INTO industry_members (id,companyName,phone,email,`order`,isActive,groupId,createdAt,updatedAt) VALUES
(187,'AKBARKOD ETIKET','0212 637 25 30','ismail@akbarkod.com',1,1,15,NOW(),NOW()),
(188,'DAMLA ETIKET','0212 674 88 62','info@example.com',2,1,15,NOW(),NOW()),
(189,'DERI DESEN ETIKET','0212 671 17 15','seher.cetindag@deridesen.com.tr',3,1,15,NOW(),NOW()),
(190,'SERTKAYA TEKSTIL','0212 545 41 53','info@example.com',4,1,15,NOW(),NOW()),
(191,'DIZAYN ETIKET','0212 551 11 66','info@dizaynetiket.com',5,1,15,NOW(),NOW()),
(192,'ECEM ETIKET','0212 501 32 46','ecem@ecemetiket.com.tr',6,1,15,NOW(),NOW()),
(193,'ETIKET SANAYI','0212 552 38 00','gokhan@etiketsanayi.com',7,1,15,NOW(),NOW()),
(194,'MEGA ETIKET','0212 637 45 70','info@megaetiket.com',8,1,15,NOW(),NOW()),
(195,'RAKAM ETIKET','0212 502 66 89','info@rakametiket.com',9,1,15,NOW(),NOW()),
(196,'REBILTEKS ETIKET','0850 811 70 71','info@rebilgroup.com',10,1,15,NOW(),NOW()),
(197,'SEDEF ETIKET','0212 485 67 50','info@sedefetiket.com',11,1,15,NOW(),NOW()),
(198,'SAYPAS ETIKET','0212 639 47 29','info@saypasetiket.com.tr',12,1,15,NOW(),NOW()),
(199,'SEN ETIKET','0212 565 51 45','ibrahim@senetiket.com.tr',13,1,15,NOW(),NOW()),
(200,'SIMSEK EGE','0212 444 7 343','osmanege@simsekege.com.tr',14,1,15,NOW(),NOW()),
(201,'TREND ETIKET','0212 478 10 79','trend@trendetiket.com.tr',15,1,15,NOW(),NOW()),
(202,'TUNTEKS ETIKET','0212 503 55 56','info@tunteks.com',16,1,15,NOW(),NOW()),
(203,'VINTAGE TEKSTIL','0282 654 34 38','mesut@vintagetrimmings.com',17,1,15,NOW(),NOW()),
(204,'YENEL TEKS ETIKET','0212 552 20 86','info@yeneletiket.com',18,1,15,NOW(),NOW()),
(205,'NETSAN ETIKET','0212 553 00 00','netsan@netsanetiket.com.tr',19,1,15,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
