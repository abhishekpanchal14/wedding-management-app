# 💍 Wedding Management App

A full-stack wedding vendor management platform that allows users to explore, add, and manage wedding vendors with media (photos & videos). Built using modern technologies and deployed on cloud platforms.

---

## 🚀 Live Demo

- 🌐 Frontend (Vercel): https://wedding-management-app-coral.vercel.app  
- ⚙️ Backend (Railway): https://carefree-enthusiasm-production.up.railway.app  

---

## 🛠️ Tech Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- CSS / Responsive Design
- Fetch API

### Backend
- .NET Web API
- REST APIs
- File Upload Handling (Photo & Video)

### Deployment
- Vercel (Frontend)
- Railway (Backend)

---

## ✨ Features

- 📋 View all wedding vendors  
- ➕ Add new vendor  
- 🖼️ Upload vendor photos  
- 🎥 Upload vendor videos  
- 📱 Fully responsive UI  
- 🔍 Vendor detail modal  
- ⚡ Fast cloud deployment  

---

## 📂 Project Structure

wedding-management-app/
│
├── client/              # React Frontend
├── server/              # .NET Backend API
└── README.md

---

## ⚙️ Setup Instructions

### Clone Repository

git clone https://github.com/abhishekpanchal14/wedding-management-app.git
cd wedding-management-app

---

### Frontend Setup

cd client
npm install
npm run dev

---

### Backend Setup

cd server
dotnet run

---

## 🌐 Environment Variables

Create a .env file in frontend:

VITE_API_URL=https://carefree-enthusiasm-production.up.railway.app

---

## 📡 API Endpoints

GET /api/vendors - Get all vendors  
POST /api/vendors/upload - Add vendor with media  
GET /api/health - Health check  

---

## 👨‍💻 Author

Abhishek Panchal  
https://github.com/abhishekpanchal14
