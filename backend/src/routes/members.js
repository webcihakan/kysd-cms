const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const { auth } = require('../middleware/auth')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const prisma = new PrismaClient()

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

// Üye profil güncelleme
router.put('/profile', auth, upload.single('logo'), async (req, res) => {
  try {
    if (req.user.role !== 'MEMBER') {
      return res.status(403).json({ error: 'Sadece üyeler profil güncelleyebilir' })
    }

    const {
      companyName,
      tradeName,
      taxOffice,
      taxNumber,
      address,
      city,
      district,
      postalCode,
      phone,
      fax,
      email,
      website,
      foundedYear,
      employeeCount,
      sector,
      description
    } = req.body

    const companyProfile = await prisma.userCompanyProfile.findUnique({
      where: { userId: req.user.id }
    })

    if (!companyProfile) {
      return res.status(404).json({ error: 'Firma profili bulunamadı' })
    }

    const updateData = {
      companyName,
      tradeName,
      taxOffice,
      taxNumber,
      address,
      city,
      district,
      postalCode,
      phone,
      fax,
      email,
      website,
      foundedYear: foundedYear ? parseInt(foundedYear) : null,
      employeeCount: employeeCount ? parseInt(employeeCount) : null,
      sector,
      description
    }

    // Logo yüklendiyse
    if (req.file) {
      // Eski logoyu sil
      if (companyProfile.logo) {
        const oldLogoPath = path.join(__dirname, '../../', companyProfile.logo)
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath)
        }
      }
      updateData.logo = `/uploads/logos/${req.file.filename}`
    }

    const updated = await prisma.userCompanyProfile.update({
      where: { id: companyProfile.id },
      data: updateData
    })

    res.json(updated)
  } catch (error) {
    console.error('Profil güncellenemedi:', error)

    // Yüklenen dosyayı sil (hata durumunda)
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }

    res.status(500).json({ error: 'Profil güncellenemedi' })
  }
})

module.exports = router
