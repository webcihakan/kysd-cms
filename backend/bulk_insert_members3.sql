-- Fermuar (Grup 16) - 15 uye
INSERT INTO industry_members (id,companyName,phone,email,`order`,isActive,groupId,createdAt,updatedAt) VALUES
(206,'AFA FERMUAR','0212 637 88 55','info@afafermuar.com.tr',1,1,16,NOW(),NOW()),
(207,'ECE FERMUAR','0212 428 23 40','info@ecefermuar.com.tr',2,1,16,NOW(),NOW()),
(208,'HUMA FERMUAR','0212 886 69 70','info@humafermuar.com',3,1,16,NOW(),NOW()),
(209,'EMR FERMUAR','0212 886 69 70','fabrika@emrfermuar.com',4,1,16,NOW(),NOW()),
(210,'ESMAS METAL','0212 428 23 40','info@esmasmetal.com',5,1,16,NOW(),NOW()),
(211,'FERSAN FERMUAR','0212 637 05 46','info@fersanfermuar.com',6,1,16,NOW(),NOW()),
(212,'FERMAS FERMUAR','0212 637 30 16','fermas@fermas.com.tr',7,1,16,NOW(),NOW()),
(213,'FIM FERMUAR','0212 522 03 14','muhasebe@fimfermuar.com',8,1,16,NOW(),NOW()),
(214,'INCI FERMUAR','0212 565 55 30','etanriverdi@incifermuar.com.tr',9,1,16,NOW(),NOW()),
(215,'IZER FERMUAR','0212 447 35 47','info@izerfermuar.com',10,1,16,NOW(),NOW()),
(216,'TAC FERMUAR','0212 547 10 99','info@tacfermuar.com',11,1,16,NOW(),NOW()),
(217,'TIT FERMUAR','0212 482 49 70','mustafaaras@titbas.com.tr',12,1,16,NOW(),NOW()),
(218,'YSS FERMUAR','0212 511 31 91','muhasebe@slsfermuar.com',13,1,16,NOW(),NOW()),
(219,'ZIPSAN FERMUAR','0212 544 55 41','zipsan@zipsan.com.tr',14,1,16,NOW(),NOW()),
(220,'NEC FERMUAR','0212 618 52 34','info@necfermuar.com',15,1,16,NOW(),NOW())
ON DUPLICATE KEY UPDATE updatedAt=NOW();
