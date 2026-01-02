# Quick Setup Guide - GitHub Actions Deploy

## 📋 Шаги для настройки автоматического деплоя

### 1️⃣ Настройте GitHub Secrets

В вашем GitHub репозитории добавьте следующие секреты:

**Settings → Secrets and variables → Actions → New repository secret**

| Имя секрета | Значение | Пример |
|-------------|----------|--------|
| `SERVER_IP` | IP адрес вашего сервера | `123.45.67.89` |
| `SERVER_USER` | Имя пользователя SSH | `root` |
| `SUDO_PASSWORD` | Пароль для SSH | `your-password` |

### 2️⃣ Подготовьте сервер

```bash
# Подключитесь к серверу
ssh root@your-server-ip

# Установите Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установите Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Создайте директорию для деплоя
mkdir -p /root/smart_soft_system

# Откройте порт 5051 (если используется файрвол)
sudo ufw allow 5051/tcp
```

### 3️⃣ Запушьте код в GitHub

```bash
# В директории проекта
git init
git add .
git commit -m "Initial commit - Smart Soft System"
git branch -M main
git remote add origin https://github.com/your-username/smart_soft_system.git
git push -u origin main
```

### 4️⃣ Автоматический деплой

После push в ветку `main`:
- GitHub Actions автоматически соберет Docker образ
- Скопирует его на сервер
- Запустит контейнер

Ваш сайт будет доступен по адресу: `http://your-server-ip:5051`

---

## 🔒 Безопасность (Рекомендуется)

Вместо пароля используйте SSH ключи:

```bash
# На вашем компьютере
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions

# Скопируйте ключ на сервер
ssh-copy-id -i ~/.ssh/github_actions.pub root@your-server-ip

# Добавьте приватный ключ в GitHub Secrets
# Имя: SSH_PRIVATE_KEY
# Значение: содержимое файла ~/.ssh/github_actions
```

Затем обновите workflow (см. SETUP.md для деталей).

---

## 🌐 Настройка домена и HTTPS

```bash
# На сервере установите Nginx
sudo apt-get install nginx certbot python3-certbot-nginx

# Создайте конфигурацию
sudo nano /etc/nginx/sites-available/smart-soft-system
```

Добавьте:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:5051;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Активируйте
sudo ln -s /etc/nginx/sites-available/smart-soft-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Получите SSL сертификат
sudo certbot --nginx -d your-domain.com
```

---

## ✅ Проверка деплоя

```bash
# На сервере проверьте статус
docker ps | grep smart-soft-system

# Посмотрите логи
docker logs smart-soft-system

# Проверьте сайт
curl http://localhost:5051
```

---

## 📝 Полезные команды

```bash
# Ручной перезапуск на сервере
cd /root/smart_soft_system
docker-compose restart

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Очистка старых образов
docker system prune -a
```

---

## 🆘 Troubleshooting

**Ошибка: "Cannot connect to Docker daemon"**
```bash
sudo systemctl start docker
```

**Ошибка: "Port already in use"**
```bash
docker stop smart-soft-system
docker rm smart-soft-system
```

**Проверка GitHub Actions:**
- GitHub → Actions → выберите последний workflow run
- Проверьте логи каждого шага

---

Подробная документация: `.github/workflows/SETUP.md`
