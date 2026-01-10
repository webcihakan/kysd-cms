const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Tüm ekonomik göstergeleri getir (kategoriye göre filtrelenebilir)
router.get('/', async (req, res) => {
  try {
    const { category, year, limit } = req.query;
    
    const where = {
      isActive: true
    };
    
    if (category) where.category = category;
    if (year) where.year = parseInt(year);
    
    const indicators = await prisma.economicIndicator.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ],
      take: limit ? parseInt(limit) : undefined
    });
    
    res.json(indicators);
  } catch (error) {
    res.status(500).json({ error: 'Veriler yüklenemedi' });
  }
});

// Kategorileri getir
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.economicIndicator.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true }
    });
    
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Kategoriler yüklenemedi' });
  }
});

// Tek gösterge getir
router.get('/:id', async (req, res) => {
  try {
    const indicator = await prisma.economicIndicator.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!indicator) {
      return res.status(404).json({ error: 'Gösterge bulunamadı' });
    }
    
    res.json(indicator);
  } catch (error) {
    res.status(500).json({ error: 'Gösterge yüklenemedi' });
  }
});

// Admin: Yeni gösterge ekle
router.post('/', async (req, res) => {
  try {
    const indicator = await prisma.economicIndicator.create({
      data: req.body
    });
    res.json(indicator);
  } catch (error) {
    res.status(500).json({ error: 'Gösterge eklenemedi' });
  }
});

// Admin: Gösterge güncelle
router.put('/:id', async (req, res) => {
  try {
    const indicator = await prisma.economicIndicator.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(indicator);
  } catch (error) {
    res.status(500).json({ error: 'Gösterge güncellenemedi' });
  }
});

// Admin: Gösterge sil
router.delete('/:id', async (req, res) => {
  try {
    await prisma.economicIndicator.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Gösterge silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Gösterge silinemedi' });
  }
});

module.exports = router;
