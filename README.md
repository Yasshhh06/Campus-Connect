# 🎒✨ Campus Connect – Lost & Found Management System

<p align="center">
  <b>A smart platform to reconnect people with their lost belongings</b><br>
  <i>Report • Match • Recover</i>
</p>

---

## 🚀 Overview

**Campus Connect** is a modern web-based platform designed for college campuses to streamline the process of reporting, discovering, and recovering lost items.

It uses an **intelligent matching system** to connect lost and found items efficiently, reducing manual effort and increasing recovery success.

---

## 🌟 Key Features

🔐 **Secure Authentication (JWT)**

* User registration, login, and protected routes

🎒 **Lost & Found Reporting**

* Report lost or found items with images, categories, and descriptions

🤖 **Intelligent Auto-Matching**

* Smart backend logic to match similar items using scoring algorithms

🔔 **Real-Time Notifications**

* Instant alerts using Socket.io when matches are found

📊 **User Dashboard**

* Track reported items and matching results

🎨 **Modern Responsive UI**

* Built with TailwindCSS for smooth and clean experience

---

## 🧱 Tech Stack

<p align="center">

| 💻 Layer     | ⚙️ Technology            |
| ------------ | ------------------------ |
| 🎨 Frontend  | React, Vite, TailwindCSS |
| 🧠 Backend   | Node.js, Express         |
| 🗄️ Database | MySQL                    |
| 🔌 Realtime  | Socket.io                |

</p>

---

## 📂 Project Structure

```id="structure01"
Campus-Connect/
│── backend/        # Express server & APIs
│── frontend/       # React application
│── database.sql    # Database schema
```

---

## ⚙️ Setup & Installation

### 🔹 1. Clone Repository

```bash
git clone https://github.com/Yasshhh06/Campus-Connect.git
cd Campus-Connect
```

---

### 🔹 2. Database Setup

* Open MySQL (Workbench / phpMyAdmin / CLI)
* Run the SQL file:

```sql
source database.sql;
```

---

### 🔹 3. Backend Setup

```bash
cd backend
npm install
```

Create/Update `.env` file:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campus_connect
JWT_SECRET=your_secret_key
```

Start server:

```bash
npm run dev
```

📍 Backend runs on: `http://localhost:5000`

---

### 🔹 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

📍 Open in browser: `http://localhost:5173`

---

## 🧠 How It Works

1. User reports a lost/found item
2. Data is stored in the database
3. Matching algorithm compares items
4. Similar items are identified
5. Users receive real-time notifications

---

## 🎯 Future Enhancements

* 📱 Mobile App Integration
* 🧠 AI-based image recognition
* 📍 Location-based tracking (GPS)
* 📩 Email/SMS notifications
* 🛡️ Admin moderation panel

---

## 🔐 Admin Access

* Register a user
* Set role as `admin` in database
* OR select Admin during registration

---

## 🤝 Contributing

Contributions are welcome! 🚀

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push and open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**

---

## 👨‍💻 Author

**Yash Mohite**
🔗 GitHub: https://github.com/Yasshhh06

---

## ⭐ Support

If you like this project, don’t forget to ⭐ the repository!

<p align="center">
  ❤️ Made with passion by Yash
</p>
