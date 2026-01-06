const express = require('express');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all menus (public - nested structure)
router.get('/', async (req, res) => {
  try {
    const { all } = req.query;
    const where = all === 'true' ? { parentId: null } : { isActive: true, parentId: null };

    const menus = await prisma.menu.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        children: {
          where: all === 'true' ? {} : { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            children: {
              where: all === 'true' ? {} : { isActive: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Menüler getirilemedi' });
  }
});

// Get flat menu list (for admin)
router.get('/flat', auth, async (req, res) => {
  try {
    const menus = await prisma.menu.findMany({
      orderBy: [{ parentId: 'asc' }, { order: 'asc' }]
    });

    res.json(menus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Menüler getirilemedi' });
  }
});

// Get single menu
router.get('/:id', async (req, res) => {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { children: true, parent: true }
    });

    if (!menu) {
      return res.status(404).json({ error: 'Menü bulunamadı' });
    }

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Menü getirilemedi' });
  }
});

// Create menu
router.post('/', auth, adminOnly, [
  body('title').notEmpty().withMessage('Başlık gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, url, pageId, parentId, order, isActive, target } = req.body;

    const menu = await prisma.menu.create({
      data: { title, url, pageId, parentId, order, isActive, target }
    });

    res.status(201).json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Menü oluşturulamadı' });
  }
});

// Update menu
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { title, url, pageId, parentId, order, isActive, target } = req.body;

    const menu = await prisma.menu.update({
      where: { id: parseInt(req.params.id) },
      data: { title, url, pageId, parentId, order, isActive, target }
    });

    res.json(menu);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Menü güncellenemedi' });
  }
});

// Reorder menus
router.put('/reorder/bulk', auth, adminOnly, async (req, res) => {
  try {
    const { items } = req.body;

    await Promise.all(
      items.map(item =>
        prisma.menu.update({
          where: { id: item.id },
          data: { order: item.order, parentId: item.parentId }
        })
      )
    );

    res.json({ message: 'Sıralama güncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Sıralama güncellenemedi' });
  }
});

// Delete menu (with children)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const menuId = parseInt(req.params.id);

    // Recursive function to delete menu and all children
    async function deleteMenuRecursive(id) {
      // First find all children
      const children = await prisma.menu.findMany({
        where: { parentId: id }
      });

      // Delete children recursively
      for (const child of children) {
        await deleteMenuRecursive(child.id);
      }

      // Then delete the menu itself
      await prisma.menu.delete({ where: { id } });
    }

    await deleteMenuRecursive(menuId);
    res.json({ message: 'Menu ve alt menuleri silindi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Menu silinemedi' });
  }
});

module.exports = router;
