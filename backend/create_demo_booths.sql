-- Demo booth applications
INSERT INTO virtual_booth_applications (id, fairId, boothTypeId, companyName, contactName, email, phone, website, message, status, createdAt, updatedAt) VALUES
(1, 1, 1, 'EMR Fermuar A.S.', 'Murat Ozpehlivan', 'info@emrfermuar.com', '+90 212 886 69 70', 'www.emrfermuar.com', 'Premium stand basvurusu', 'APPROVED', NOW(), NOW()),
(2, 1, 2, 'Cag-Tek Zamak Dugme', 'Gizem Ozcelik', 'info@cag-tek.com.tr', '+90 212 557 09 22', 'www.cag-tek.com.tr', 'Standart stand basvurusu', 'APPROVED', NOW(), NOW());

-- Demo booths
INSERT INTO virtual_booths (id, fairId, boothTypeId, applicationId, companyName, companyLogo, description, website, email, phone, isActive, viewCount, `order`, createdAt, updatedAt) VALUES
(1, 1, 1, 1, 'EMR Fermuar A.S.', '/uploads/logos/logo-209.png', 'Turkiye nin lider fermuar uretici firmalarindan biri. 30 yillik tecrubesiyle yurt ici ve yurt disinda hizmet vermektedir.', 'www.emrfermuar.com', 'info@emrfermuar.com', '+90 212 886 69 70', 1, 0, 1, NOW(), NOW()),
(2, 1, 2, 2, 'Cag-Tek Zamak Dugme', '/uploads/logos/logo-170-1766883932506.png', 'Metal dugme ve aksesuar uretiminde uzman firma. Modern uretim tesisleri ile kaliteli urun gamı sunmaktadir.', 'www.cag-tek.com.tr', 'info@cag-tek.com.tr', '+90 212 557 09 22', 1, 0, 2, NOW(), NOW());
