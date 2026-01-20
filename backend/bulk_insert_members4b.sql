-- Tela Elyaf Vatka (Grup 17) - Son 19 uye
INSERT INTO industry_members (id,companyName,phone,email,`order`,isActive,groupId,createdAt,updatedAt) VALUES
(241,'OZCELIK DUGME','0212 554 05 74','dilek@ozcelikaksesuar.com',21,1,17,NOW(),NOW()),
(242,'OZHAN GRUP','0212 225 63 10','info@ozhanfermuar.com',22,1,17,NOW(),NOW()),
(243,'MUSLU GALVANO','0212 642 74 42','muhasebe@umutaksesuar.com.tr',23,1,17,NOW(),NOW()),
(244,'BRODERIN TEKSTIL','0530 700 01 77','aykut@broderin.com',24,1,17,NOW(),NOW()),
(247,'RESULT ITHALAT','0444 77 58','result@result.com.tr',27,1,17,NOW(),NOW()),
(248,'NICE FERMUAR','0212 642 31 00','bahri@fermuar.com',28,1,17,NOW(),NOW()),
(249,'ZAMAKS METAL','0212 671 05 04','ulas@zamakstrim.es',29,1,17,NOW(),NOW()),
(250,'METAKS TEKSTIL','0212 637 73 23','info@metaksaksesuar.com',30,1,17,NOW(),NOW()),
(251,'ORG TEKSTIL','0212 291 60 00','ovi@orgtekstil.com.tr',31,1,17,NOW(),NOW()),
(252,'CELIKSAN AKSESUAR','0212 637 50 16','celiksann@gmail.com',32,1,17,NOW(),NOW()),
(253,'MERCAN CIT CIT','0212 225 56 86','mercan@mercancitcit.com',33,1,17,NOW(),NOW()),
(254,'MEVAKS FERMUAR','0212 505 09 09','info@mevaks.com',34,1,17,NOW(),NOW()),
(255,'ENVER TEKSTIL','0212 520 70 69','canertanriverdi@envertekstil.com',35,1,17,NOW(),NOW()),
(256,'AVKAR TEKSTIL','0212 672 12 56','nihat@avkar.com',36,1,17,NOW(),NOW()),
(257,'ENGINS BUTTON','0530 516 81 75','info@enginsbutton.com',37,1,17,NOW(),NOW()),
(258,'ASIL DERI ETIKET','0212 671 66 54','sidar@asilderietiket.com',38,1,17,NOW(),NOW()),
(259,'EMRE DAR DOKUMA','0212 556 99 40','aysegul@emredardokuma.com',39,1,17,NOW(),NOW()),
(260,'KACAR TEKSTIL','0212 446 86 69','ozgur@kacarteks.com',40,1,17,NOW(),NOW()),
(285,'TELASIS TEKSTIL','0212 886 60 50','ali.sisman@telasis.com.tr',0,1,17,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
