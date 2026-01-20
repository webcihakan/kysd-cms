const nodemailer = require('nodemailer')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Mail transporter oluştur
const createTransporter = async () => {
  // Ayarlardan SMTP bilgilerini al
  const settings = await prisma.setting.findMany()
  const getSettingValue = (key) => settings.find(s => s.key === key)?.value || ''

  const smtpHost = getSettingValue('smtp_host') || 'smtp.gmail.com'
  const smtpPort = parseInt(getSettingValue('smtp_port')) || 587
  const smtpUser = getSettingValue('smtp_user')
  const smtpPass = getSettingValue('smtp_pass')
  const smtpSecure = getSettingValue('smtp_secure') === 'true'

  if (!smtpUser || !smtpPass) {
    console.warn('SMTP ayarları eksik, mail gönderilemeyecek')
    return null
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  })
}

// Aidat bildirimi maili gönder
const sendDueNotification = async (member, due, settings = {}) => {
  try {
    const transporter = await createTransporter()
    if (!transporter) return { success: false, error: 'SMTP ayarları eksik' }

    const siteName = settings.site_name || 'KYSD'
    const contactEmail = settings.contact_email || 'info@kysd.org.tr'

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount)
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .amount-box { background: white; border: 2px solid #1e40af; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
    .amount { font-size: 28px; font-weight: bold; color: #1e40af; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .info-table td:first-child { font-weight: bold; color: #64748b; width: 40%; }
    .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .btn { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${siteName}</h1>
      <p>Aidat Ödeme Bildirimi</p>
    </div>
    <div class="content">
      <p>Sayın <strong>${member.companyName}</strong> Yetkilisi,</p>

      <p>${due.year} yılına ait aidat ödemeniz hakkında bilgilendirme yapılmaktadır.</p>

      <div class="amount-box">
        <p style="margin: 0; color: #64748b;">Ödenecek Tutar</p>
        <p class="amount">${formatCurrency(due.amount)}</p>
      </div>

      <table class="info-table">
        <tr>
          <td>Dönem</td>
          <td>${due.year} Yılı${due.month ? ' - ' + due.month + '. Ay' : ''}</td>
        </tr>
        <tr>
          <td>Son Ödeme Tarihi</td>
          <td>${formatDate(due.dueDate)}</td>
        </tr>
        <tr>
          <td>Firma</td>
          <td>${member.companyName}</td>
        </tr>
      </table>

      <p>Ödemenizi zamanında yapmanızı rica ederiz. Ödeme ile ilgili sorularınız için bizimle iletişime geçebilirsiniz.</p>

      <p style="color: #64748b; font-size: 14px;">
        <strong>Banka Bilgileri:</strong><br>
        ${settings.bank_name || 'Banka bilgileri için iletişime geçiniz'}<br>
        ${settings.bank_iban || ''}
      </p>
    </div>
    <div class="footer">
      <p>${siteName}</p>
      <p>${settings.contact_address || ''}</p>
      <p>Tel: ${settings.contact_phone || ''} | E-posta: ${contactEmail}</p>
    </div>
  </div>
</body>
</html>
`

    const mailOptions = {
      from: `"${siteName}" <${settings.smtp_user || contactEmail}>`,
      to: member.email,
      subject: `${siteName} - ${due.year} Yılı Aidat Ödeme Bildirimi`,
      html: htmlContent
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Mail gönderilemedi:', error)
    return { success: false, error: error.message }
  }
}

// Toplu aidat bildirimi gönder
const sendBulkDueNotifications = async (dues) => {
  const settings = await prisma.setting.findMany()
  const settingsObj = {}
  settings.forEach(s => { settingsObj[s.key] = s.value })

  let sent = 0
  let failed = 0
  const errors = []

  for (const due of dues) {
    if (due.member && due.member.email) {
      const result = await sendDueNotification(due.member, due, settingsObj)
      if (result.success) {
        sent++
      } else {
        failed++
        errors.push({ member: due.member.companyName, error: result.error })
      }
      // Rate limiting - her mail arasında 500ms bekle
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  return { sent, failed, errors }
}

// Etkinlik bildirimi maili gönder
const sendEventNotification = async (event, users, settings = {}) => {
  try {
    const transporter = await createTransporter()
    if (!transporter) return { success: false, error: 'SMTP ayarları eksik' }

    const siteName = settings.site_name || 'KYSD'
    const contactEmail = settings.contact_email || 'info@kysd.org.tr'

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long'
      })
    }

    const eventTypeNames = {
      fair: 'Fuar',
      training: 'Eğitim/Seminer',
      project: 'Proje',
      holiday: 'Resmi Tatil'
    }

    const eventTypeName = eventTypeNames[event.type] || 'Etkinlik'
    const eventIcon = event.type === 'fair' ? '🏢' : event.type === 'training' ? '📚' :
                     event.type === 'project' ? '🎯' : '🎉'

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .icon { font-size: 48px; margin-bottom: 10px; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .event-box { background: white; border-left: 4px solid #1e40af; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .event-title { font-size: 24px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .info-table td:first-child { font-weight: bold; color: #64748b; width: 40%; }
    .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">${eventIcon}</div>
      <h1>${siteName}</h1>
      <p>${eventTypeName} Hatırlatması</p>
    </div>
    <div class="content">
      <div class="alert">
        <strong>⏰ Hatırlatma:</strong> ${eventTypeName} 7 gün sonra başlayacak!
      </div>

      <div class="event-box">
        <div class="event-title">${event.title}</div>
        ${event.description ? `<p>${event.description}</p>` : ''}

        <table class="info-table">
          <tr>
            <td>Etkinlik Türü</td>
            <td>${eventTypeName}</td>
          </tr>
          <tr>
            <td>Tarih</td>
            <td>${formatDate(event.date)}</td>
          </tr>
          ${event.endDate ? `<tr><td>Bitiş Tarihi</td><td>${formatDate(event.endDate)}</td></tr>` : ''}
          ${event.location ? `<tr><td>Konum</td><td>${event.location}</td></tr>` : ''}
          ${event.eventTime ? `<tr><td>Saat</td><td>${event.eventTime}</td></tr>` : ''}
        </table>
      </div>

      <p>Bu etkinlikle ilgili detaylı bilgi için web sitemizi ziyaret edebilirsiniz.</p>
    </div>
    <div class="footer">
      <p>${siteName}</p>
      <p>${settings.contact_address || ''}</p>
      <p>Tel: ${settings.contact_phone || ''} | E-posta: ${contactEmail}</p>
    </div>
  </div>
</body>
</html>
`

    const results = []
    for (const user of users) {
      if (user.email && user.isActive) {
        try {
          const mailOptions = {
            from: `"${siteName}" <${settings.smtp_user || contactEmail}>`,
            to: user.email,
            subject: `${siteName} - ${eventTypeName} Hatırlatması: ${event.title}`,
            html: htmlContent
          }

          await transporter.sendMail(mailOptions)
          results.push({ email: user.email, success: true })

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          results.push({ email: user.email, success: false, error: error.message })
        }
      }
    }

    return { success: true, results }
  } catch (error) {
    console.error('Mail gönderilemedi:', error)
    return { success: false, error: error.message }
  }
}

// İş başvurusunu tüm üyelere gönder
const sendJobApplicationToMembers = async (application, jobPosting, settings = {}) => {
  try {
    const transporter = await createTransporter()
    if (!transporter) return { success: false, error: 'SMTP ayarları eksik' }

    const siteName = settings.site_name || 'KYSD'
    const contactEmail = settings.contact_email || 'info@kysd.org.tr'
    const siteUrl = settings.site_url || 'https://kysd.org.tr'

    // Tüm KYSD üyelerini al
    const members = await prisma.member.findMany({
      where: { isActive: true },
      include: {
        companyProfile: true
      }
    })

    if (members.length === 0) {
      return { success: false, error: 'Aktif üye bulunamadı' }
    }

    const formatDate = (date) => {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 700px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; }
    .job-box { background: white; border-left: 4px solid #1e40af; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .job-title { font-size: 22px; font-weight: bold; color: #1e40af; margin-bottom: 15px; }
    .applicant-box { background: #f1f5f9; border-radius: 10px; padding: 20px; margin: 20px 0; }
    .info-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    .info-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
    .info-table td:first-child { font-weight: bold; color: #64748b; width: 35%; }
    .section-title { font-size: 18px; font-weight: bold; color: #1e40af; margin: 20px 0 10px; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
    .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
    .note { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .btn { display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💼 ${siteName}</h1>
      <p>İş Başvurusu Bildirimi</p>
    </div>
    <div class="content">
      <p>Sayın KYSD Üyesi,</p>

      <p>Kariyer portalımıza gelen bir iş başvurusunu sizinle paylaşmak istiyoruz. İlgili pozisyon için uygun bulmanız durumunda adayla iletişime geçebilirsiniz.</p>

      <div class="job-box">
        <div class="job-title">${jobPosting.title}</div>
        <table class="info-table">
          <tr>
            <td>Firma</td>
            <td><strong>${jobPosting.companyName}</strong></td>
          </tr>
          <tr>
            <td>Çalışma Şekli</td>
            <td>${jobPosting.jobType}</td>
          </tr>
          <tr>
            <td>Deneyim Seviyesi</td>
            <td>${jobPosting.experienceLevel}</td>
          </tr>
          <tr>
            <td>Şehir</td>
            <td>${jobPosting.city}${jobPosting.district ? ', ' + jobPosting.district : ''}</td>
          </tr>
        </table>
      </div>

      <div class="section-title">👤 Aday Bilgileri</div>
      <div class="applicant-box">
        <table class="info-table">
          <tr>
            <td>Ad Soyad</td>
            <td><strong>${application.firstName} ${application.lastName}</strong></td>
          </tr>
          <tr>
            <td>E-posta</td>
            <td>${application.email}</td>
          </tr>
          <tr>
            <td>Telefon</td>
            <td>${application.phone}</td>
          </tr>
          <tr>
            <td>Şehir</td>
            <td>${application.city}${application.district ? ', ' + application.district : ''}</td>
          </tr>
          ${application.birthDate ? `<tr><td>Doğum Tarihi</td><td>${formatDate(application.birthDate)}</td></tr>` : ''}
          ${application.gender ? `<tr><td>Cinsiyet</td><td>${application.gender}</td></tr>` : ''}
        </table>
      </div>

      <div class="section-title">🎓 Eğitim Bilgileri</div>
      <table class="info-table">
        <tr>
          <td>Eğitim Seviyesi</td>
          <td>${application.educationLevel}</td>
        </tr>
        ${application.university ? `<tr><td>Üniversite</td><td>${application.university}</td></tr>` : ''}
        ${application.department ? `<tr><td>Bölüm</td><td>${application.department}</td></tr>` : ''}
        ${application.graduationYear ? `<tr><td>Mezuniyet Yılı</td><td>${application.graduationYear}</td></tr>` : ''}
      </table>

      <div class="section-title">💼 İş Deneyimi</div>
      <table class="info-table">
        <tr>
          <td>Deneyim Süresi</td>
          <td>${application.experienceYears}</td>
        </tr>
        ${application.currentCompany ? `<tr><td>Mevcut Şirket</td><td>${application.currentCompany}</td></tr>` : ''}
        ${application.currentPosition ? `<tr><td>Mevcut Pozisyon</td><td>${application.currentPosition}</td></tr>` : ''}
      </table>

      ${application.skills ? `
        <div class="section-title">🔧 Beceriler</div>
        <p style="background: #f8fafc; padding: 15px; border-radius: 8px;">${application.skills}</p>
      ` : ''}

      ${application.languages ? `
        <div class="section-title">🌍 Yabancı Diller</div>
        <p style="background: #f8fafc; padding: 15px; border-radius: 8px;">${application.languages}</p>
      ` : ''}

      ${application.coverLetter ? `
        <div class="section-title">✉️ Ön Yazı</div>
        <p style="background: #f8fafc; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${application.coverLetter}</p>
      ` : ''}

      ${application.expectedSalary ? `
        <table class="info-table">
          <tr>
            <td>Beklenen Maaş</td>
            <td><strong>${parseFloat(application.expectedSalary).toLocaleString('tr-TR')} TL</strong></td>
          </tr>
        </table>
      ` : ''}

      <div class="note">
        <strong>📋 Not:</strong> Bu başvuru tüm KYSD üyelerine gönderilmektedir. İlgilendiğiniz takdirde doğrudan adayla iletişime geçebilirsiniz.
        ${application.cvFile ? '<br><br><strong>CV Dosyası:</strong> Admin panelinden görüntüleyebilirsiniz.' : ''}
      </div>

      <p style="text-align: center;">
        <a href="${siteUrl}/admin/kariyer/basvurular" class="btn">Admin Panelinde Görüntüle</a>
      </p>
    </div>
    <div class="footer">
      <p>${siteName}</p>
      <p>${settings.contact_address || ''}</p>
      <p>Tel: ${settings.contact_phone || ''} | E-posta: ${contactEmail}</p>
    </div>
  </div>
</body>
</html>
`

    let sent = 0
    let failed = 0
    const errors = []

    for (const member of members) {
      const memberEmail = member.companyProfile?.email || member.email

      if (!memberEmail) {
        failed++
        errors.push({ member: member.companyName, error: 'E-posta adresi yok' })
        continue
      }

      try {
        const mailOptions = {
          from: `"${siteName}" <${settings.smtp_user || contactEmail}>`,
          to: memberEmail,
          subject: `${siteName} - İş Başvurusu: ${application.firstName} ${application.lastName} - ${jobPosting.title}`,
          html: htmlContent
        }

        await transporter.sendMail(mailOptions)
        sent++

        // Rate limiting - her mail arasında 500ms bekle
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        failed++
        errors.push({ member: member.companyName, error: error.message })
      }
    }

    return { success: true, sent, failed, errors, totalMembers: members.length }
  } catch (error) {
    console.error('Toplu mail gönderilemedi:', error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  createTransporter,
  sendDueNotification,
  sendBulkDueNotifications,
  sendEventNotification,
  sendJobApplicationToMembers
}
