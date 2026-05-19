# Configuración de PM2 y Nginx para producción en VPS

## 1. Instalar PM2 (gestor de procesos)
npm install -g pm2

## 2. Iniciar backend con PM2
cd /opt/biblioteca/backend
NODE_ENV=production pm2 start server.js --name biblioteca-backend
pm2 save
pm2 startup

## 3. Build del frontend
cd /opt/biblioteca/frontend
npm install
npm run build

## 4. Configurar Nginx
cat > /etc/nginx/sites-available/biblioteca << 'EOF'
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    # Frontend (archivos estáticos)
    root /opt/biblioteca/frontend/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Archivos subidos
    location /uploads/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # SPA routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

## 5. Habilitar sitio y SSL
ln -s /etc/nginx/sites-available/biblioteca /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# SSL gratis con Let's Encrypt
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tudominio.com -d www.tudominio.com
