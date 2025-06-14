# 🚀 ManageX – Engineering Project & Resource Management Platform

**ManageX** is a full-stack project and resource management platform designed for engineering teams. Built with a modern tech stack, it enables managers to create projects, assign engineers, monitor capacity, and streamline collaboration — all through a clean, responsive interface.

---

## 🛠 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)

---

## ✨ Key Features

### 🔐 Role-Based Dashboards
- **Manager Dashboard**
  - Create and manage projects
  - Assign engineers with percentage-based capacity allocation
  - View and track all assignments
  - Monitor engineer capacity using visual progress bars
- **Engineer Dashboard**
  - View assigned projects and related details

### 💻 Responsive & Intuitive UI
- Built with Tailwind CSS for a modern, mobile-friendly experience
- Smooth modals and transitions for enhanced usability

### 🔒 Secure Authentication
- JWT-based authentication system
- Role-based route protection for secure access

---

## 👤 Demo Access

Use the following credentials to try out the **Manager**  and **Engineer** dashboards:

- **Name:** Gourav  
- **Email:** gourav@gmail.com
- **Password: gourav123
- **Role:** Manager

- **Name:** sourav  
- **Email:** sourav@gmail.com
- **Password: sourav123
- **Role:** Engineer


---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git](https://github.com/Abhi9824/ManageX.git)
cd your-repo

### 2. Clone the Repository
cd client
npm install

3. Start the Development Server
npm run dev

📁 Project Structure
client/
  ├── src/
  │   ├── components/     # Reusable UI components (Navbar, Modals, etc.)
  │   ├── pages/          # Dashboard pages (ManagerDashboard, EngineerDashboard)
  │   ├── features/       # Redux Toolkit slices (engineers, projects, assignments)
  │   ├── utils/          # Axios instance, ProtectedRoute, helpers
  │   ├── App.jsx         # Application routing and layout
  │   └── index.js        # Entry point

server/
  ├── models/             # Mongoose schemas for User, Project, Assignment
  ├── routes/             # Express routes for auth, projects, users
  ├── middleware/         # Role-based authorization, error handling
  └── server.js           # Main server entry


You can find the backend source code here:
👉 https://github.com/Abhi9824/engineering-resources-backend

### ⚡ ManageX — Simplifying project and resource management for engineering teams.
