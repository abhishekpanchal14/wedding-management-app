# 🚀 Backend Deployment Options (Free)

## Option 1: Railway (Recommended - Easiest)

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 2. Create Project
- Click "New Project"
- Choose "Deploy from GitHub repo"
- Connect your wedding-management-app repository

### 3. Configure Environment
Railway will auto-detect your .NET app and use the `railway.toml` config.

### 4. Add Environment Variables
In Railway dashboard → Variables:
```
DATABASE_PATH=/app/data/wedding.db
ASPNETCORE_ENVIRONMENT=Production
```

### 5. Deploy
Railway will build and deploy automatically. You'll get a URL like:
`https://wedding-api-production.up.railway.app`

---

## Option 2: Render (Alternative)

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up (free tier available)

### 2. Create Web Service
- Click "New" → "Web Service"
- Connect your GitHub repo

### 3. Configure Build
```
Build Command: dotnet publish -c Release -o out
Start Command: dotnet out/WeddingApi.dll --urls=http://0.0.0.0:$PORT
```

### 4. Add Environment Variables
```
DATABASE_PATH=/app/data/wedding.db
ASPNETCORE_ENVIRONMENT=Production
```

---

## Option 3: Fly.io (Docker-based)

### 1. Install Fly CLI
```bash
brew install flyctl
fly auth login
```

### 2. Initialize App
```bash
cd WeddingApi
fly launch
```

### 3. Configure Database Path
```bash
fly secrets set DATABASE_PATH=/data/wedding.db
```

### 4. Deploy
```bash
fly deploy
```

---

## Option 4: Azure App Service (Free Tier)

### 1. Create Azure Account
- Go to [portal.azure.com](https://portal.azure.com)
- Free $200 credit for new accounts

### 2. Create App Service
- Search for "App Services"
- Create new Web App
- Runtime: .NET 9
- Publish: Code

### 3. Deploy from GitHub
- Connect your repository
- Build will happen automatically

---

## 🔗 Connect to Frontend

Once deployed, update your Vercel environment variable:

1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Set: `VITE_API_URL=https://your-backend-url.com`

---

## 🗄️ Database Persistence

- **Railway**: Uses persistent volumes
- **Render**: Uses persistent disks
- **Fly.io**: Uses persistent volumes
- **Azure**: Uses Azure SQL or file storage

Your SQLite database will persist between deployments!

---

## 🧪 Testing Your Deployment

Test these endpoints:
- `GET https://your-api-url/api/health` → `{"status":"ok"}`
- `GET https://your-api-url/api/vendors` → Your vendor list
- `POST https://your-api-url/api/vendors/upload` → Add new vendor

---

## 💡 Pro Tips

- **Railway**: Best for beginners, great .NET support
- **Render**: Good alternative, reliable free tier
- **Fly.io**: Best performance, but steeper learning curve
- **Azure**: Most enterprise-ready, but requires credit card

Start with **Railway** - it's the easiest! 🎯