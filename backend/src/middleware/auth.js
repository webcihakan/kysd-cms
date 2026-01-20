const jwt = require('jsonwebtoken');


const prisma = require('../lib/prisma');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Yetkilendirme gerekli' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Geçersiz token' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Yetkilendirme başarısız' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Bu işlem için admin yetkisi gerekli' });
  }
  next();
};

const editorOrAdmin = (req, res, next) => {
  if (!['ADMIN', 'EDITOR'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Bu işlem için editör veya admin yetkisi gerekli' });
  }
  next();
};

module.exports = { auth, adminOnly, editorOrAdmin };
