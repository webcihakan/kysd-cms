const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all settings (public - for frontend)
router.get('/', async (req, res) => {
  try {
    const { group } = req.query;
    const where = group ? { group } : {};

    const settings = await prisma.setting.findMany({ where });

    const settingsObject = {};
    settings.forEach(s => {
      settingsObject[s.key] = s.value;
    });

    res.json(settingsObject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ayarlar getirilemedi' });
  }
});

// Get all settings as array (admin)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }]
    });

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ayarlar getirilemedi' });
  }
});

// Get single setting by key
router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key }
    });

    if (!setting) {
      return res.status(404).json({ error: 'Ayar bulunamadı' });
    }

    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ayar getirilemedi' });
  }
});

// Create or update setting
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { key, value, type, group } = req.body;

    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value, type, group },
      create: { key, value, type, group }
    });

    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ayar kaydedilemedi' });
  }
});

// Update multiple settings
router.put('/bulk', auth, adminOnly, async (req, res) => {
  try {
    const { settings } = req.body;

    await Promise.all(
      settings.map(s =>
        prisma.setting.upsert({
          where: { key: s.key },
          update: { value: s.value },
          create: { key: s.key, value: s.value, type: s.type || 'text', group: s.group || 'general' }
        })
      )
    );

    res.json({ message: 'Ayarlar güncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ayarlar güncellenemedi' });
  }
});

// Delete setting
router.delete('/:key', auth, adminOnly, async (req, res) => {
  try {
    await prisma.setting.delete({ where: { key: req.params.key } });
    res.json({ message: 'Ayar silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ayar silinemedi' });
  }
});

module.exports = router;
