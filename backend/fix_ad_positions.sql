TRUNCATE TABLE advertisement_positions;
INSERT INTO advertisement_positions (id, name, code, description, width, height, priceMonthly, priceQuarterly, priceYearly, isActive, `order`, createdAt, updatedAt) VALUES
(1, 'Anasayfa Ust Banner', 'homepage_top', 'Ana sayfanin en ustundeki banner alani - gorsellik olarak en cok dikkat ceken konum', 1200, 300, 5000.00, 13500.00, 48000.00, 1, 1, NOW(), NOW()),
(2, 'Anasayfa Yan Banner', 'homepage_side', 'Ana sayfa sag tarafta yer alan yan banner alani', 300, 600, 3000.00, 8100.00, 28800.00, 1, 2, NOW(), NOW()),
(3, 'Icerik Arasi Banner', 'content_middle', 'Sayfa iceriginin ortasinda gorunen banner', 728, 90, 2000.00, 5400.00, 19200.00, 1, 3, NOW(), NOW()),
(4, 'Footer Ustu Banner', 'footer_top', 'Her sayfanin alt kisminda footer oncesi gorunen banner', 1200, 200, 2500.00, 6750.00, 24000.00, 1, 4, NOW(), NOW()),
(5, 'Mobil Anasayfa Banner', 'mobile_homepage', 'Mobil cihazlar icin optimize edilmis anasayfa banner', 320, 100, 1500.00, 4050.00, 14400.00, 1, 5, NOW(), NOW());
