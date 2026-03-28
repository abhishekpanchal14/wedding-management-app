# Wedding Management App - Deployment Guide

## 🚀 Frontend Deployment (Vercel)

### 1. Install Vercel CLI
```bash
npm install -g vercel
# OR use npx for one-time use
```

### 2. Login to Vercel
```bash
cd WeddingClient
npx vercel login
```
Follow the browser link to authenticate.

### 3. Deploy Frontend
```bash
npx vercel --prod
```
This will:
- Upload your React app
- Provide a production URL (e.g., `https://wedding-app.vercel.app`)

### 4. Configure Environment Variables
In Vercel dashboard:
1. Go to your project settings
2. Add environment variable: `VITE_API_URL=https://your-api-domain.com`

---

## 🔧 Backend Deployment Options

### Option A: Azure App Service (Recommended)
```bash
# Install Azure CLI
brew install azure-cli

# Login and deploy
az login
az webapp up --name wedding-api --resource-group myResourceGroup --plan myPlan --location "East US" --runtime "DOTNET|8.0"
```

### Option B: DigitalOcean App Platform
1. Connect your GitHub repo
2. Choose "App Spec" deployment
3. Use this app spec:
```yaml
name: wedding-api
services:
- name: api
  source_dir: WeddingApi
  github:
    repo: yourusername/WeddingEventManagement
    branch: main
  run_command: dotnet run --urls=http://0.0.0.0:$PORT
  environment_slug: dotnet
  instance_count: 1
  instance_size_slug: basic-xxs
  health_check:
    http_path: /api/health
```

### Option C: Railway
1. Connect GitHub repo
2. Set build command: `dotnet publish -c Release -o out`
3. Set start command: `dotnet out/WeddingApi.dll --urls=http://0.0.0.0:$PORT`

---

## 🔗 Connect Frontend to Backend

1. **Get your API URL** from your backend deployment
2. **Update Vercel environment variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-api-domain.com`
3. **Redeploy frontend**: `npx vercel --prod`

---

## 📁 File Structure After Deployment

```
/ (Vercel - Frontend)
├── index.html
├── assets/
└── ...

/api (Your Backend)
├── /api/vendors (GET/POST)
├── /api/health
└── /uploads/ (Static files)
```

## ✅ Testing Deployment

1. **Frontend**: Visit Vercel URL
2. **API Health**: `https://your-api-domain.com/api/health`
3. **Vendors**: `https://your-api-domain.com/api/vendors`

## 🔒 Security Notes

- ✅ CORS configured for your frontend domain
- ✅ File upload validation in place
- ✅ SQLite database is file-based (persists with app)

## 💡 Pro Tips

- **Custom Domain**: Add your domain in Vercel settings
- **CDN**: Vercel automatically provides global CDN
- **Analytics**: Enable Vercel Analytics for insights
- **Monitoring**: Set up health checks and alerts