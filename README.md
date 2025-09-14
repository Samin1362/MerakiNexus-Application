# MerakiNexus

**MerakiNexus** is a web application that combines AI-powered artwork classification with a user-friendly dashboard system. It allows artists, users, and admins to manage, showcase, and interact with digital artworks. The system currently supports artwork classification into different styles, user and artist management, and admin-level controls. Web3 integration is planned for future releases.  

---

## 🌟 Project Overview

MerakiNexus is designed as a platform for digital art enthusiasts, where AI classifies artworks into distinct styles. The application provides three main dashboards:  

1. **Admin Dashboard** – Full control over users, artworks, tokens, approvals, and system settings.  
2. **Artist Dashboard** – Artists can view and manage their uploaded artworks and profile.  
3. **User Dashboard** – Users can explore and interact with artworks.  

Currently, the frontend is fully developed and connected to MongoDB for data persistence.  

---

## 🎨 Features

- **Artwork Classification:** AI classifies artworks into different styles.  
- **Admin Panel:** Manage users, artworks, tokens, approvals, and platform settings.  
- **Artist Dashboard:** Manage uploaded artworks and profile overview.  
- **User Dashboard:** Browse and interact with artworks.  
- **Responsive Design:** Works seamlessly across mobile and desktop devices.  
- **Modern UI Theme:** Gradients, hover effects, and smooth transitions for a modern user experience.  

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS, Lucide-React icons  
- **Backend:** Node.js (Express)  
- **Database:** MongoDB  
- **Routing:** React Router  
- **State Management:** React useState, useEffect, useMemo  
- **Version Control:** Git & GitHub  

---

## 📂 Project Structure

```text
merakinexus/
├─ src/
│  ├─ components/
│  │  ├─ Navbar.jsx
│  │  ├─ Footer.jsx
│  │  ├─ DashboardLayout.jsx
│  │  ├─ ArtistDashboardLayout.jsx
│  │  └─ ...
│  ├─ pages/
│  │  ├─ HomePage.jsx
│  │  ├─ GalleryPage.jsx
│  │  ├─ UploadPage.jsx
│  │  ├─ AboutPage.jsx
│  │  ├─ ChatbotApp.jsx
│  │  ├─ LoginForm.jsx
│  │  ├─ DashboardHome.jsx
│  │  ├─ ArtistHome.jsx
│  │  ├─ DashboardArtworks.jsx
│  │  ├─ DashboardUsers.jsx
│  │  └─ ...
│  ├─ App.jsx
│  └─ index.jsx
├─ public/
├─ package.json
└─ README.md
