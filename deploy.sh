#!/bin/bash

# KYSD CMS VPS Deployment Script
# VPS IP: 37.148.208.249
# Bu script'i VPS'te çalıştırın

set -e

echo "======================================"
echo "KYSD CMS Deployment Başlıyor..."
echo "======================================"

# Sistem güncellemesi
echo ""
echo "[1/12] Sistem güncelleniyor..."
apt-get update -y && apt-get upgrade -y

# Gerekli paketler
echo ""
echo "[2/12] Gerekli paketler kuruluyor..."
apt-get install -y curl git nginx mysql-server

# Node.js 20.x
echo ""
echo "[3/12] Node.js kuruluyor..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# PM2
echo ""
echo "[4/12] PM2 kuruluyor..."
npm install -g pm2

# MySQL yapılandırması
echo ""
echo "[5/12] MySQL yapılandırılıyor..."
MYSQL_ROOT_PASSWORD="Kysd2024!Secure"

# MySQL zaten çalışıyor mu kontrol et
if systemctl is-active --quiet mysql; then
    mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '${MYSQL_ROOT_PASSWORD}';" 2>/dev/null || true
    mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true
fi

# Veritabanı oluştur
echo ""
echo "[6/12] MySQL veritabanı oluşturuluyor..."
DB_NAME="kysd_cms"
DB_USER="kysd_user"
DB_PASSWORD="Kysd2024!DbPass"

mysql -uroot -p${MYSQL_ROOT_PASSWORD} <<MYSQL_SCRIPT 2>/dev/null || mysql <<MYSQL_SCRIPT
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
MYSQL_SCRIPT

echo "✅ Veritabanı: ${DB_NAME}"

# Proje klonla
echo ""
echo "[7/12] Proje GitHub'dan indiriliyor..."
cd /var/www
[ -d "kysd-cms" ] && rm -rf kysd-cms
git clone https://github.com/webcihakan/kysd-cms.git
cd kysd-cms

# Backend kurulum
echo ""
echo "[8/12] Backend kurulumu..."
cd backend

cat > .env <<EOF
NODE_ENV=production
PORT=5000
DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@localhost:3306/${DB_NAME}"
JWT_SECRET="kysd-super-secret-jwt-key-2024-production"
FRONTEND_URL=http://37.148.208.249
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EOF

npm install
npx prisma generate
npx prisma db push --accept-data-loss
node prisma/seed.js || true

# Frontend build
echo ""
echo "[9/12] Frontend build..."
cd ../frontend

cat > .env <<EOF
VITE_API_URL=http://37.148.208.249/api
EOF

npm install
npm run build

# Nginx yapılandırma
echo ""
echo "[10/12] Nginx yapılandırılıyor..."
cat > /etc/nginx/sites-available/kysd-cms <<'NGINX_CONFIG'
server {
    listen 80;
    server_name 37.148.208.249;
    client_max_body_size 50M;

    location / {
        root /var/www/kysd-cms/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /uploads {
        alias /var/www/kysd-cms/backend/uploads;
    }
}
NGINX_CONFIG

ln -sf /etc/nginx/sites-available/kysd-cms /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# PM2 ile backend başlat
echo ""
echo "[11/12] Backend başlatılıyor..."
cd /var/www/kysd-cms/backend
pm2 delete kysd-backend 2>/dev/null || true
pm2 start server.js --name kysd-backend
pm2 save
pm2 startup systemd -u root --hp /root

# Firewall
echo ""
echo "[12/12] Firewall ayarları..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 22/tcp
    ufw --force enable || true
fi

echo ""
echo "======================================"
echo "✅ DEPLOYMENT TAMAMLANDI!"
echo "======================================"
echo ""
echo "🌐 Website: http://37.148.208.249"
echo "⚙️  Admin: http://37.148.208.249/admin"
echo ""
echo "🔑 Veritabanı:"
echo "   Database: ${DB_NAME}"
echo "   User: ${DB_USER}"
echo "   Password: ${DB_PASSWORD}"
echo "   Root Password: ${MYSQL_ROOT_PASSWORD}"
echo ""
echo "📝 Komutlar:"
echo "   pm2 status"
echo "   pm2 logs kysd-backend"
echo "   pm2 restart kysd-backend"
echo ""
