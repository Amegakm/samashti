# Samashti Portal 🌟

Samashti is the central governing student body of **JAIN (Deemed-to-be University)**. This web portal serves as a unified digital platform for our student community, providing real-time updates, event registrations, and management dashboards.

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

## 🚀 Getting Started & Git Commands

### 1. Clone & Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd samashti-main

# Install dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
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

### 3. Run the App
```bash
# Start local development server
npm run dev

# Build for production
npm run build
```

### 4. Basic Git Commands
```bash
# Check changes
git status

# Stage your edits
git add .

# Commit your changes
git commit -m "Update project features"

# Push to Github
git push origin main
```
