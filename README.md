# Online Library Website

> ⚠️ **Important Note:** This repository is a personal mirror of a collaborative team project originally developed during our internship.  
> The original team repository is hosted [here](https://github.com/Marria-m/LibraryProject).  
> All team members are fully acknowledged below, and this version showcases my personal contributions and setup.

---

## 🧑‍💻 Team Members:
- Mariam  
- Rahma (me)  
- Doha  
- Maya  
- Mazen  
- Zeyad

---

## ✨  My Contributions (Rahma)
Designed and implemented the User Homepage (HomePage-user.html, CSS)
Designed and implemented the Admin Dashboard (HomePage-admin.html, CSS, JS)
Updated the Borrowed Books List Page (BorrowedList.js)
Set up Book Carousel and later updated it to support dynamic Django data (Book-Carousel.js)
Worked on Book Management Page for Admins (Book-admin.js) – added book search & management logic
Integrated Favicon and UI identity (Favicon.html)
Handled User Authentication setup and login page flow
Configured Django backend framework and linked it with frontend pages
Implemented Search functionality for managing books (title, author, category)
Collaborated actively in connecting frontend components to Django templates and views

---

## 📚 Project Overview

The Online Library Website allows users to browse and borrow books online.  
It features two main roles: **Admin** and **User**.

- **Admins** can manage books (add, edit, delete)
- **Users** can search, view, and borrow available books

The website includes essential features like authentication, role-based navigation, and user feedback systems.

---

## 💡 Features

### 🔐 Admin Functionalities
- Sign up & Login
- Add new books (ID, title, author, category, description)
- View all books
- Edit book details
- Delete books

### 👤 User Functionalities
- Sign up & Login
- Search books by title, author, or category
- View book details
- Borrow available books
- View list of borrowed books

### 🧩 General Features
- Responsive Navigation Bar based on user roles
- User Profile Management
- Book Review System (Users can review books)

---

# 📦 Library Management System

A Django-based library management system with book management, user notifications, and admin features.

---

## ⚙️ Setup Instructions

### For Windows:

setup.bat
For Mac/Linux:
bash
Copy
Edit
chmod +x setup.sh
./setup.sh
Manual Setup:
bash
Copy
Edit
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
cd onlinelibrary
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
🏗️ Project Structure
onlinelibrary/ – Main Django project

books/ – Book management app

static/ – Static files (CSS, JS, images)

templates/ – HTML templates

media/ – User-uploaded files

💌 Contributing
Fork this repository

Create a feature branch

Commit your changes

Push to your fork

Create a Pull Request

🏁 Final Note
This repo mirrors our collaborative project for educational and portfolio purposes.
All rights, credits, and contributions are respected and acknowledged.
