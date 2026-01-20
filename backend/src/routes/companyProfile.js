const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const prisma = require('../lib/prisma')

// Multer ayarları - logo yükleme
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/logos')
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true })
    }
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error('Sadece resim dosyaları yüklenebilir'))
  }
})

// Kullanıcının şirket profilini getir
router.get('/me', auth, async (req, res) => {
  try {
    let profile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id },
      include: {
        member: {
          include: {
            group: true
          }
        }
      }
    })

    // Profil yoksa boş döndür
    if (!profile) {
      return res.json(null)
    }

    res.json(profile)
  } catch (error) {
    console.error('Profil getirilemedi:', error)
    res.status(500).json({ error: 'Profil getirilemedi' })
  }
})

// Şirket profili oluştur veya güncelle
router.put('/me', auth, async (req, res) => {
  try {
    const { companyName, taxNumber, phone, address, website, description } = req.body

    let profile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (profile) {
      // Güncelle
      profile = await prisma.userCompanyProfile.update({
        where: { userId: req.user.id },
        data: {
          companyName,
          taxNumber,
          phone,
          address,
          website,
          description
        },
        include: {
          member: {
            include: {
              group: true
            }
          }
        }
      })
    } else {
      // Oluştur
      profile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName,
          taxNumber,
          phone,
          address,
          website,
          description
        },
        include: {
          member: {
            include: {
              group: true
            }
          }
        }
      })
    }

    res.json(profile)
  } catch (error) {
    console.error('Profil güncellenemedi:', error)
    res.status(500).json({ error: 'Profil güncellenemedi' })
  }
})

// Logo yükle
router.post('/me/logo', auth, upload.single('logo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' })
    }

    const logoPath = '/uploads/logos/' + req.file.filename

    let profile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    // Eski logoyu sil
    if (profile?.logo) {
      const oldPath = path.join(__dirname, '../..', profile.logo)
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
      }
    }

    if (profile) {
      profile = await prisma.userCompanyProfile.update({
        where: { userId: req.user.id },
        data: { logo: logoPath }
      })
    } else {
      profile = await prisma.userCompanyProfile.create({
        data: {
          userId: req.user.id,
          companyName: req.user.company || 'Şirket Adı',
          logo: logoPath
        }
      })
    }

    res.json({ logo: logoPath })
  } catch (error) {
    console.error('Logo yüklenemedi:', error)
    res.status(500).json({ error: 'Logo yüklenemedi' })
  }
})

// Kullanıcının aidatlarını getir (onaylı üye ise)
router.get('/me/dues', auth, async (req, res) => {
  try {
    const profile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!profile || !profile.memberId) {
      return res.json([])
    }

    const dues = await prisma.memberDue.findMany({
      where: { memberId: profile.memberId },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    res.json(dues)
  } catch (error) {
    console.error('Aidatlar getirilemedi:', error)
    res.status(500).json({ error: 'Aidatlar getirilemedi' })
  }
})

module.exports = router
