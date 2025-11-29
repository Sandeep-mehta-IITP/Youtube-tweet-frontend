# 🎥 YouTube-Tweet — Frontend (React + Redux)

YouTube-Tweet is a full-featured video-sharing and micro-posting platform inspired by YouTube, where users can **upload videos, create playlists, subscribe to channels, and post tweet-style updates** — all within one unified experience.

This repository contains the **frontend application**, built with **React** and **Redux Toolkit**, following scalable architecture and production-ready coding practices.

---

## 🚀 Live Demo

🔗 **Frontend:** [https://youtube-tweet-frontend.onrender.com/](https://youtube-tweet-frontend.onrender.com/)

---

## 🛠️ Tech Stack

* **React** — Component-based UI
* **Redux Toolkit** — Global state management
* **React Router** — Client-side routing
* **Axios** — API communication
* **Cloudinary** — Media handling (videos, thumbnails)
* **CSS / Tailwind (if used)** — Fully responsive layout
* **Toast Notifications** — User feedback system

---

## 📦 Features (Frontend)

### 🎬 Video Functionality

* Upload videos with title, description & thumbnails
* Watch video feed without login
* Individual video pages with views & engagement options
* Fully responsive YouTube-like layout

### 🔐 Authentication & User Flow

* Secure signup & login
* JWT-based auth (via backend)
* Protected routes based on auth state

### 📁 Playlists & Channel System

* Create & manage playlists
* Subscribe / Unsubscribe to channels
* Channel pages with profile, videos, and tweets

### 📝 Tweet-Style Post System

* Create micro-posts (tweets)
* Display tweets on channel pages
* Real-time UI updates through Redux

### 📊 Performance & UX

* Server-side pagination
* Loading states, skeleton screens
* Optimized API calls & Redux slices
* Clear error handling with toasts

---

## 🧩 Project Structure

```
src/
│── api/             # Axios instances & API services
│── components/      # Reusable UI components
│── features/        # Redux slices (auth, videos, playlists, tweets)
│── pages/           # Route-level pages
│── hooks/           # Custom hooks
│── utils/           # Helper functions
│── assets/          # Images, icons
│── App.js
│── main.jsx
```

This structure ensures the app stays scalable as new features are added.

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Sandeep-mehta-IITP/Youtube-tweet-frontend
cd Youtube-tweet-frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment file

Create a `.env` file at the project root:

```
VITE_BACKEND_URL=your_backend_api_url
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 4️⃣ Start the development server

```bash
npm run dev
```

App will run on:
👉 [http://localhost:5173](http://localhost:5173) (or Vite’s default port)

---

## 🧠 Architecture Decisions & Highlights

* **Redux Toolkit** used instead of raw Redux for cleaner, scalable slices
* Strict separation of **UI components**, **logic**, and **state**
* **Axios interceptor** for attaching JWT token automatically
* **API abstraction layer** for cleaner request management
* Optimized rendering to avoid unnecessary re-renders
* UI designed to mimic YouTube’s user experience

---

## 🐞 Error Handling & Edge Cases

The frontend gracefully handles:

* Invalid credentials
* Backend validation errors
* No internet scenarios
* Missing thumbnails or broken URLs
* Token expiration
* Video upload timeout

All errors are surfaced through clean toast notifications.

---

## 📦 Production-Ready Improvements

* Lazy loading of routes
* Code splitting for faster performance
* Cloud-friendly configurations
* Clean API layer with reusable services

---

## 🔗 Repositories

**Frontend Repo:**
[https://github.com/Sandeep-mehta-IITP/Youtube-tweet-frontend](https://github.com/Sandeep-mehta-IITP/Youtube-tweet-frontend)

**Backend Repo:**
[https://github.com/Sandeep-mehta-IITP/Youtube-tweet-Backend](https://github.com/Sandeep-mehta-IITP/Youtube-tweet-Backend)

---

## 🤝 Contributing

Contributions, suggestions, and feedback are welcome.
Please open an issue or submit a pull request!

---

## ⭐ Show Your Support

If you find this project helpful, consider starring the repository!
It motivates me to improve it further. 🚀

---

## 👨‍💻 Author

**Sandeep Mehta (Shiv)**
MERN Stack Developer | Software Engineering Student

