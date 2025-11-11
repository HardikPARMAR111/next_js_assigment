 Next.js Recurring Events & Calendar App

A modern calendar web application built with **Next.js 13+ (App Router)** that allows users to **create, edit, delete, and view** both **one-time** and **recurring events** (Daily, Weekly, Monthly).  
Styled beautifully with **Tailwind CSS**, powered by **Prisma ORM**, and connected to a **PostgreSQL** database.

---

Features

 Event Management
- ➕ **Create**, ✏️ **Update**, ❌ **Delete**, and 📋 **List** Events  
- Supports both **one-time** and **recurring** events  
- **Recurrence Options:**
  - 🗓️ Daily  
  - 📅 Weekly (select specific weekdays)  
  - 📆 Monthly  
- Includes optional **recurrence end date**  
- Validates all form inputs before submission  

---

Calendar View
- Displays events on a **monthly grid**  
- Automatically highlights **recurring events**  
- Navigate between **previous / next** months  
- Built using **Tailwind CSS** for fully responsive design  

---

 Backend (API)
- Built using **Next.js Route Handlers**  
- RESTful endpoints under `/api/events`  
- Fully integrated with **Prisma ORM**

---

Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Next.js 13+ (App Router) |
| **Styling** | Tailwind CSS |
| **Database** | PostgreSQL (via Prisma ORM) |
| **API** | Next.js Route Handlers |
| **Language** | TypeScript |
| **Optional Utility** | date-fns |

---

Environment Setup

 Install dependencies  

 npm install
 npx prisma generate
 then create .env file
 DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5432/eventsdb" then add this variable inside the .env file make table name
 replace the username and password according to your database
