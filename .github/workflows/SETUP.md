# GitHub Actions Deployment Setup

## Необходимые GitHub Secrets

Для работы автоматического деплоя нужно настроить следующие секреты в вашем GitHub репозитории:

### Как добавить секреты:
1. Перейдите в ваш репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. Нажмите "New repository secret"
4. Добавьте каждый из следующих секретов:

### Список секретов:

#### `SERVER_IP`
- **Описание**: IP-адрес вашего сервера
- **Пример**: `123.45.67.89`

#### `SERVER_USER`
- **Описание**: Имя пользователя для SSH подключения
- **Пример**: `root` или `ubuntu`

#### `SUDO_PASSWORD`
- **Описание**: Пароль для SSH подключения
- **Важно**: Это не самый безопасный метод. Рекомендуется использовать SSH ключи (см. ниже)

---

## Альтернатива: Использование SSH ключей (Рекомендуется)

### Более безопасный вариант с SSH ключами:

1. **Создайте SSH ключ на вашем компьютере:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
   ```

2. **Скопируйте публичный ключ на сервер:**
   ```bash
   ssh-copy-id -i ~/.ssh/github_actions.pub user@your-server-ip
   ```

3. **Добавьте приватный ключ в GitHub Secrets:**
   - Имя секрета: `SSH_PRIVATE_KEY`
   - Значение: содержимое файла `~/.ssh/github_actions` (приватный ключ)

4. **Обновите workflow файл** (замените шаги с sshpass):

```yaml
# Вместо установки sshpass используйте:
- name: Setup SSH
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
    chmod 600 ~/.ssh/id_ed25519
    ssh-keyscan -H ${{ secrets.SERVER_IP }} >> ~/.ssh/known_hosts

# Затем используйте обычные ssh/scp команды без sshpass:
- name: Copy files to server
  run: |
    scp docker-compose.yml ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }}:$DEPLOY_DIR
    scp $DOCKER_IMAGE.tar ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_IP }}:$DEPLOY_DIR
```

---

## Настройка сервера

### 1. Установите Docker на сервере:
```bash
# Для Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавьте пользователя в группу docker
sudo usermod -aG docker $USER
```

### 2. Установите Docker Compose:
```bash
sudo apt-get update
sudo apt-get install docker-compose-plugin
```

### 3. Создайте директорию для деплоя:
```bash
mkdir -p /root/smart_soft_system
```

### 4. Настройте файрвол (если используется):
```bash
# Откройте порт 5051
sudo ufw allow 5051/tcp
```

---

## Настройка Nginx Reverse Proxy (Опционально)

Если вы хотите использовать доменное имя и HTTPS:

### 1. Установите Nginx:
```bash
sudo apt-get install nginx
```

### 2. Создайте конфигурацию:
```bash
sudo nano /etc/nginx/sites-available/smart-soft-system
```

### 3. Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:5051;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4. Активируйте конфигурацию:
```bash
sudo ln -s /etc/nginx/sites-available/smart-soft-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Установите SSL сертификат (Let's Encrypt):
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Тестирование деплоя

### Локальное тестирование workflow:
Используйте [act](https://github.com/nektos/act) для локального запуска GitHub Actions:

```bash
# Установка act
brew install act  # macOS
# или
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Запуск workflow локально
act push --secret-file .secrets
```

### Проверка деплоя на сервере:
```bash
# Подключитесь к серверу
ssh user@your-server-ip

# Проверьте статус контейнера
docker ps | grep smart-soft-system

# Посмотрите логи
docker logs smart-soft-system

# Проверьте, что сайт отвечает
curl http://localhost:5051
```

---

## Переменные окружения в workflow

Текущие настройки в `.github/workflows/docker-image.yml`:

```yaml
env:
  DOCKER_IMAGE: "smart_soft_system"        # Имя Docker образа
  DEPLOY_DIR: "/root/smart_soft_system/"   # Директория на сервере
  CONTAINER_NAME: "smart-soft-system"      # Имя контейнера
  HOST_PORT: "5051"                        # Порт на сервере
  CONTAINER_PORT: "80"                     # Порт внутри контейнера
```

Измените эти значения при необходимости.

---

## Troubleshooting

### Проблема: "Permission denied"
```bash
# На сервере добавьте пользователя в группу docker
sudo usermod -aG docker $USER
# Перелогиньтесь
```

### Проблема: "Port already in use"
```bash
# Найдите процесс на порту 5051
sudo lsof -i :5051
# Остановите старый контейнер
docker stop smart-soft-system
docker rm smart-soft-system
```

### Проблема: "Cannot connect to Docker daemon"
```bash
# Запустите Docker
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Полезные команды

```bash
# Просмотр логов деплоя в GitHub Actions
# GitHub → Actions → выберите workflow run

# Ручной деплой на сервере
cd /root/smart_soft_system
docker-compose down
docker-compose up -d

# Обновление образа
docker pull smart_soft_system:latest
docker-compose up -d

# Очистка старых образов
docker system prune -a
```
