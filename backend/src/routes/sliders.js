const express = require('express');
const { body, validationResult } = require('express-validator');

const { auth, editorOrAdmin } = require('../middleware/auth');

const router = express.Router();
const prisma = require('../lib/prisma');

// Get all sliders (public)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? {} : { isActive: true };

    const sliders = await prisma.slider.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    res.json(sliders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sliderlar getirilemedi' });
  }
});

// Get single slider
router.get('/:id', async (req, res) => {
  try {
    const slider = await prisma.slider.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!slider) {
      return res.status(404).json({ error: 'Slider bulunamadı' });
    }

    res.json(slider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Slider getirilemedi' });
  }
});

// Create slider
router.post('/', auth, editorOrAdmin, [
  body('image').notEmpty().withMessage('Görsel gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, subtitle, image, mobileImage, link, buttonText, order, isActive } = req.body;

    const slider = await prisma.slider.create({
      data: { title, subtitle, image, mobileImage, link, buttonText, order, isActive }
    });

    res.status(201).json(slider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Slider oluşturulamadı' });
  }
});

// Update slider
router.put('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    const { title, subtitle, image, mobileImage, link, buttonText, order, isActive } = req.body;

    const slider = await prisma.slider.update({
      where: { id: parseInt(req.params.id) },
      data: { title, subtitle, image, mobileImage, link, buttonText, order, isActive }
    });

    res.json(slider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Slider güncellenemedi' });
  }
});

// Reorder sliders
router.put('/reorder/bulk', auth, editorOrAdmin, async (req, res) => {
  try {
    const { items } = req.body;

    await Promise.all(
      items.map(item =>
        prisma.slider.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    res.json({ message: 'Sıralama güncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sıralama güncellenemedi' });
  }
});

// Delete slider
router.delete('/:id', auth, editorOrAdmin, async (req, res) => {
  try {
    await prisma.slider.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Slider silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Slider silinemedi' });
  }
});

module.exports = router;
