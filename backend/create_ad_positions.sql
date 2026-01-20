TRUNCATE TABLE advertisement_positions;
INSERT INTO advertisement_positions (id, name, `key`, description, width, height, isActive, createdAt, updatedAt) VALUES
(1, 'Anasayfa Ust Banner', 'homepage_top', 'Ana sayfanin en ustundeki banner alani', '1200', '300', 1, NOW(), NOW()),
(2, 'Anasayfa Yan Banner', 'homepage_side', 'Ana sayfa sag yan banner', '300', '600', 1, NOW(), NOW()),
(3, 'Icerik Arasi Banner', 'content_middle', 'Icerik ortasinda gorunen banner', '728', '90', 1, NOW(), NOW()),
(4, 'Footer Ustu Banner', 'footer_top', 'Footer ustunde yer alan banner', '1200', '200', 1, NOW(), NOW());
