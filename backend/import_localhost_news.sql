-- Localhost haberlerini ekle (resimli olanlar)
UPDATE news SET image="/uploads/news/tesvik-destek.jpg", isFeatured=1 WHERE id=24 OR slug LIKE "%yeni-tesvik-paketi%";
UPDATE news SET image="/uploads/news/news-5-fuar.jpg", isFeatured=1 WHERE id=23 OR slug LIKE "%tekstil-fuarlarina%";
UPDATE news SET image="/uploads/news/yesil-donusum.jpg", isFeatured=1 WHERE id=22 OR slug LIKE "%surdurulebilir-tekstil%";
UPDATE news SET image="/uploads/news/dijital-donusum.jpg", isFeatured=1 WHERE id=21 OR slug LIKE "%dijital-donusum%";
UPDATE news SET image="/uploads/news/news-1-ihracat.jpg", isFeatured=1 WHERE id=20 OR slug LIKE "%ihracati-rekor%";
UPDATE news SET image="/uploads/news/makine-ekipman.jpg", isFeatured=1 WHERE id=19 OR slug LIKE "%makine-ekipman%";
UPDATE news SET image="/uploads/news/news-8-istihdam.jpg", isFeatured=1 WHERE id=18 OR slug LIKE "%istihdam-tesviki%";
UPDATE news SET image="/uploads/news/yesil-donusum.jpg", isFeatured=1 WHERE id=17 OR slug LIKE "%yesil-donusum%";
UPDATE news SET image="/uploads/news/dijital-donusum.jpg", isFeatured=1 WHERE id=16 OR slug LIKE "%dijital-donusum-destegi%";
UPDATE news SET image="/uploads/news/arge-inovasyon.jpg", isFeatured=1 WHERE id=15 OR slug LIKE "%ar-ge-ve-inovasyon%";

-- Eksik haberleri ekle
INSERT INTO news (title, slug, content, excerpt, image, isActive, isFeatured, viewCount, createdAt, updatedAt)
SELECT * FROM (
  SELECT 
    "Türkiye Tekstil İhracatı Rekor Kırdı" as title,
    "turkiye-tekstil-ihracati-rekor-kirdi" as slug,
    "<h2>Tekstil Sektöründe Büyük Başarı</h2><p>Türkiye tekstil ve hazır giyim sektörü, 2024 yılında tarihi bir başarıya imza atarak 35 milyar dolar ihracat rakamına ulaştı.</p>" as content,
    "Türkiye tekstil ve hazır giyim sektörü 2024 yılında 35 milyar dolar ihracat hedefine ulaştı." as excerpt,
    "/uploads/news/news-1-ihracat.jpg" as image,
    1 as isActive,
    1 as isFeatured,
    0 as viewCount,
    NOW() as createdAt,
    NOW() as updatedAt
) AS tmp
WHERE NOT EXISTS (
  SELECT 1 FROM news WHERE slug = "turkiye-tekstil-ihracati-rekor-kirdi"
) LIMIT 1;
