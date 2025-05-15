# Online Library Website
 
 ## Project Overview
 The Online Library Website allows users to browse and borrow books online. It features two user roles: Admin and User.
 
 Admins can manage books (add, edit, delete).
 
 Users can search, view, and borrow available books.
 
 The website includes essential features like authentication, book management, and a dynamic navigation bar based on user roles.
 
 ## Features
 ### Admin Functionalities
 - Sign up & Login
 - Add new books (ID, title, author, category, description)
 - View all available books
 - Edit book details
 - Delete books
 
 ### User Functionalities
 - Sign up & Login
 - Search books by title, author, or category
 - View book details
 - Borrow available books
 - View borrowed books list
 
 ### General Features
 - Responsive Navigation Bar (changes based on user role)
 - User Profile Management
 - Book Review System (Users can review books)
 
 ## Team Members:
 
 - Mariam
 
 - Rahma
 
 - Doha
 
 - Maya
 
 - Mazen 
 
 - Zeyad

# Library Management System

A Django-based library management system with book management, user notifications, and admin features.

## Setup Instructions

### Windows Users:
1. Clone the repository
2. Double-click `setup.bat` or run it from command prompt:
   ```cmd
   setup.bat
   ```

### Mac/Linux Users:
1. Clone the repository
2. Make the setup script executable and run it:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

### Manual Setup:
If the setup scripts don't work, follow these steps:

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

3. Navigate to the project directory:
   ```bash
   cd onlinelibrary
   ```

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```bash
   python manage.py runserver
   ```

## Features
- Book management (add, edit, delete)
- User notifications
- Admin dashboard
- Responsive design

## Project Structure
- `onlinelibrary/` - Main Django project directory
  - `books/` - Book management app
  - `static/` - Static files (CSS, JS, images)
  - `templates/` - HTML templates
  - `media/` - User-uploaded files

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
