# Samashti Portal 🌟

Samashti is the central governing student body of **JAIN (Deemed-to-be University)**. This portal is organized into a clean folder structure separating the frontend and backend files to make it user-friendly and easy to manage.

---

## 📂 Repository Directory Structure

```text
samashti/
├── README.md               # This file
├── frontend/               # React Vite Frontend App
│   ├── src/                # Components, Pages & CSS
│   ├── public/             # Static Assets
│   ├── package.json        # Frontend Dependencies
│   └── .env                # App Environment Config
└── backend/                # Firebase Rules & Scripts
    ├── firestore.rules     # Database Security Rules
    ├── storage.rules       # Cloud Storage Rules
    ├── cors.json           # Storage CORS configurations
    ├── createAdmin.mjs     # Admin User Seed Script
    └── package.json        # Backend Dependencies
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19 (Vite), React Router DOM v7, Framer Motion (Animations), Lucide React (Icons), Vanilla CSS
- **Backend & Database:** Google Firebase (Cloud Firestore & Authentication)
- **Media Uploads:** ImgBB API (images/gallery), Cloudinary API (brochures/PDFs)

---

## ✨ Key Features

- **📢 Live Announcements:** Notices & updates broadcasted in real time.
- **🏆 Hall of Fame & Gallery:** Spotlighting student achievements and event photos.
- **✍️ Recruitment Portal:** Dynamic student council recruitment applications.
- **🎪 Fest & JUYF Hub:** Schedules, event details, brochures, and rulebooks.
- **📊 Event Results:** Real-time publication of contest winners.
- **💬 Feedback Form:** Direct channel for students to reach out.
- **🛡️ Admin Dashboard:** Complete CMS to manage content, fests, results, announcements, and recruitment.

---

## 🚀 Getting Started

### 1. Frontend Setup (React Application)

```bash
# Go to the frontend folder
cd frontend

# Install dependencies
npm install

# Create/Configure your environment variables in frontend/.env
```

Define the following environment configurations in `frontend/.env`:
```ini
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_DATABASE_URL=your_database_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_IMGBB_API_KEY=your_imgbb_api_key
```

To run the development server locally:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

---

### 2. Backend Setup & Admin Seeding (Firebase & Admin Scripts)

```bash
# Go to the backend folder
cd backend

# Install dependencies
npm install

# Run the script to seed your admin credentials
npm run create-admin
```

---

## 💻 Git Commands

When working with this repository, use the following standard commands from the root directory:

```bash
# Check status of changed files
git status

# Stage your changes
git add .

# Commit your changes
git commit -m "      "

# Push to your GitHub repository
git push origin main
```
