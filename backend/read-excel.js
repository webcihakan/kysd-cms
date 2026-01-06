const XLSX = require('xlsx')

// Excel dosyasını oku
const workbook = XLSX.readFile('C:\\Users\\Huawei\\Downloads\\YENİ ÜYE LİSTESİ NURCAN.xlsx')

// Sheet isimlerini listele
console.log('Sheet isimleri:', workbook.SheetNames)

// Her sheet'i oku
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n=== ${sheetName} ===`)
  const worksheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

  // İlk 30 satırı göster
  console.log('İlk 30 satır:')
  data.slice(0, 30).forEach((row, index) => {
    if (row && row.length > 0) {
      console.log(`Satır ${index + 1}:`, JSON.stringify(row))
    }
  })

  console.log(`\nToplam satır: ${data.length}`)
})
