-- Tela Elyaf Vatka (Grup 17) - Birinci 20 uye
INSERT INTO industry_members (id,companyName,phone,email,`order`,isActive,groupId,createdAt,updatedAt) VALUES
(221,'BAYTEKS KONFEKSIYON','0212 653 79 43','muhasebe@tcs.com.tr',1,1,17,NOW(),NOW()),
(222,'BEZCI TEKSTIL','0212 578 08 19','bezcitekstil@bezcitekstil.com',2,1,17,NOW(),NOW()),
(223,'HASSAN TEKSTIL','0212 886 60 50','info@telasis.com.tr',3,1,17,NOW(),NOW()),
(224,'HELSAKAM KONF','0212 596 69 69','scetiner@helsakam.com.tr',4,1,17,NOW(),NOW()),
(225,'MENDERES TEKS','0258 429 12 12','bekirkondu@menderes.com',5,1,17,NOW(),NOW()),
(226,'TELATEKS','0216 394 32 60','telateks@telateks.com',6,1,17,NOW(),NOW()),
(227,'ULUSAL TELA','0212 637 72 30','gurbuz.turan@ulusaltela.com.tr',7,1,17,NOW(),NOW()),
(228,'VANTELA TEKSTIL','0212 798 26 56','info@vantela.com.tr',8,1,17,NOW(),NOW()),
(229,'DOK-SAN DENIZLI','0258 269 10 32','atahan@doksan.com',9,1,17,NOW(),NOW()),
(230,'RON MAKINA','0212 501 06 00','muhasebe@ronmikron.com',10,1,17,NOW(),NOW()),
(231,'MEGA KORDON','0212 425 14 61','info@megakordon.com',11,1,17,NOW(),NOW()),
(232,'ADEN DAR DOKUMA','0212 438 18 80','info@adendardokuma.com.tr',12,1,17,NOW(),NOW()),
(233,'GULER BUJITERI','0212 640 26 78','filiz@gulerbijuteri.com',13,1,17,NOW(),NOW()),
(234,'B2K MATBAACILIK','0212 924 90 75','info@b2k.com.tr',14,1,17,NOW(),NOW()),
(235,'HARMANCI ETIKET','0212 620 91 01','orhan@harmanci.com.tr',15,1,17,NOW(),NOW()),
(236,'DARSEL DOKUMA','0372 638 40 66','muhasebe@selga.com.tr',16,1,17,NOW(),NOW()),
(237,'KARACA KONF','0212 482 28 09','erkan@karacabutton.com',17,1,17,NOW(),NOW()),
(238,'TURQUOISE DESIGN','0535 740 08 62','info@turquoisedt.com',18,1,17,NOW(),NOW()),
(239,'EREN ETIKET','0212 613 96 60','sales@erenetiket.com',19,1,17,NOW(),NOW()),
(240,'MSH DUGME','0212 644 29 30','info@mshdugme.com',20,1,17,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
