# Smart Soft System - Landing Page

Landing page for Smart Soft System - B2B SaaS company specializing in AI and RAG solutions.

## 🚀 Quick Start

### Local Development
Simply open `index.html` in your browser.

### Docker Deployment

#### Build and Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```

The site will be available at `http://localhost:8080`

#### Build and Run with Docker
```bash
# Build the image
docker build -t smart-soft-system .

# Run the container
docker run -d -p 8080:80 --name smart-soft-system smart-soft-system
```

#### Stop the container
```bash
docker-compose down
# or
docker stop smart-soft-system
```

## 🌐 Production Deployment

### Deploy to any server with Docker

1. **Copy files to server:**
```bash
scp -r . user@your-server:/path/to/deployment
```

2. **SSH to server and run:**
```bash
cd /path/to/deployment
docker-compose up -d
```

3. **Setup reverse proxy (nginx/caddy) for HTTPS:**

Example nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Deploy to Cloud Platforms

#### Vercel / Netlify (Static Hosting)
Simply connect your Git repository and deploy. No Docker needed.

#### AWS / Google Cloud / Azure
Use their container services (ECS, Cloud Run, Container Instances) with the Docker image.

## 📁 Project Structure

```
.
├── index.html              # Main landing page
├── about-v2.html          # About page
├── portfolio-list.html    # Portfolio page
├── assets/
│   ├── css/
│   │   ├── style.css      # Main template styles
│   │   └── custom.css     # Custom Smart Soft System styles
│   ├── js/               # JavaScript files
│   ├── images/           # Images and icons
│   └── vendor/           # Third-party libraries
├── Dockerfile            # Docker configuration
└── docker-compose.yml    # Docker Compose configuration
```

## 🎨 Customization

- **Colors**: Edit `assets/css/custom.css`
- **Content**: Edit HTML files
- **Fonts**: IBM Plex Mono for logo, Inter for body text

## 🔧 Technologies

- HTML5, CSS3, JavaScript
- Bootstrap 5
- IBM Plex Mono & Inter fonts
- Nginx (for Docker deployment)

## 📝 License

Copyright ©2026 Smart Soft System
# smatrt_soft_system
