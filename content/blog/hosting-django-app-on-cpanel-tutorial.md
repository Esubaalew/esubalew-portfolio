---
title: "Hosting a Django Website on cPanel: A Step-by-Step Guide"
date: "2025-09-26"
description: "Learn how to deploy a Django application on cPanel with Passenger WSGI, static and media file setup, database configuration, and HTTPS."
tags: ["Django", "cPanel", "Hosting", "Deployment", "Tutorial"]
---

Deploying a Django application on cPanel can seem daunting, but with the right steps, it can be straightforward. This guide will walk you through the process, from creating a cPanel account to configuring your Django settings. 

---

## 📑 Table of Contents
1. [Create a cPanel Account](#1-create-a-cpanel-account)  
2. [Set Up Your Domain](#2-set-up-your-domain)  
3. [Upload Your Django Project](#3-upload-your-django-project)  
4. [Set Up a Python Application](#4-set-up-a-python-application)  
5. [Configure Passenger WSGI](#5-configure-passenger-wsgi)  
6. [Install Required Packages](#6-install-required-packages)  
7. [Set Up a Database](#7-set-up-a-database)  
8. [Configure Database Settings](#8-configure-database-settings)  
9. [Set Up Static Files](#9-set-up-static-files)  
10. [Collect Static Files](#10-collect-static-files)  
11. [Set Up Allowed Hosts](#11-set-up-allowed-hosts)  
12. [Configure Middleware](#12-configure-middleware)  
13. [Set Up HTTPS](#13-set-up-https)  
14. [Test Your Application](#14-test-your-application)  
15. [Set Up Hosting for Media Files](#15-set-up-hosting-for-media-files)  

---

## 1. Create a cPanel Account
To begin, you'll need access to a cPanel hosting account. If you don't have one, choose a hosting provider that offers cPanel and sign up for a plan that supports Python applications.

---

## 2. Set Up Your Domain
Once you have your cPanel account, log in and navigate to the **Domains** section to set up your domain. Ensure that your domain is pointing to your cPanel server.

---

## 3. Upload Your Django Project
- Use **File Manager** or an FTP client to upload your Django project files to a subfolder of your choice.  
- Make sure to include all necessary files, including your `requirements.txt`, settings file, and other necessary configurations.

---

## 4. Set Up a Python Application
- In cPanel, locate the **Setup Python App** option.  
- Click on it and then select the Python version you want to use.  
- Create a new application, specifying the application root (where your project is located) and the application URL.  
- For **Application Startup File**, set it to `passenger_wsgi.py`.  
- For **Application Entry Point**, set it to `application`.

---

## 5. Configure Passenger WSGI
In the same section where you set up your Python application, you’ll need to configure the Passenger WSGI file.  

This file is usually named `passenger_wsgi.py` and should contain the following code:

```python
from yourprojectname.wsgi import application
````

---

## 6. Install Required Packages

* After setting up the application, install the required Python packages.
* Use the terminal or the cPanel interface to navigate to your application and run:

```bash
pip install -r requirements.txt
```

---

## 7. Set Up a Database

* In cPanel, navigate to **MySQL Databases** and create a new database.
* Create a new user and assign it to the database with all privileges.
* Note down the database name, username, and password.

---

## 8. Configure Database Settings

* Open your Django settings file (`settings.py`).
* Update the database settings section with your newly created database details:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'yourdbname',
        'USER': 'yourdbuser',
        'PASSWORD': 'yourdbpassword',
        'HOST': 'localhost',
        'PORT': '',
    }
}
```

Run migrations:

```bash
python manage.py migrate
```

---

## 9. Set Up Static Files

* In your Django project settings, specify the location for static files:

```python
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'
```

---

## 10. Collect Static Files

Run the following command to collect all static files into the specified directory:

```bash
python manage.py collectstatic
```

* Ensure that your web server can serve files from the `STATIC_ROOT` directory.

---

## 11. Set Up Allowed Hosts

In your `settings.py`, update the `ALLOWED_HOSTS` setting:

```python
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']
```

---

## 12. Configure Middleware

Make sure to include necessary middleware for handling sessions, authentication, and security features in your `MIDDLEWARE` settings.

---

## 13. Set Up HTTPS

* Ensure your site is accessible over HTTPS by enabling SSL in your cPanel settings.
* You can use **Let’s Encrypt** for a free SSL certificate.
* Update Django:

```python
SECURE_SSL_REDIRECT = True
```

---

## 14. Test Your Application

* Open your browser and navigate to your domain to see if your Django application is running correctly.
* If there are any issues, check the error logs in:

```
/home/username/logs/error_log
```

---

## 15. Set Up Hosting for Media Files

When hosting a Django website, you might need to serve media files, such as images, documents, or user uploads. To effectively manage these files, creating a dedicated subdomain is a good practice.

### Step-by-Step Guide

1. **Create a Subdomain**

   * Log in to your cPanel account.
   * Navigate to the **Subdomains** section.
   * In the **Subdomain** field, enter `media` (this will create `media.example.org`).
   * For **Document Root**, specify the directory as `~/media.example.org`.
   * Click **Create**.

2. **Set Up Access Control**
   Create a `.htaccess` file in the `~/media.example.org` directory:

   ```apache
   <IfModule mod_headers.c>
       Header set Access-Control-Allow-Origin "https://www.example.org"
       Header set Access-Control-Allow-Headers "X-Requested-With"
   </IfModule>
   ```

3. **Enable HTTPS**
   In the cPanel dashboard, navigate to the **Domains** section.
   Enable **Force HTTPS Redirect** for `media.example.org`.

4. **Update Django Settings**

   ```python
   MEDIA_ROOT = "/home/cpanelusername/media.example.org/"
   MEDIA_URL = "https://media.example.org/"
   ```

5. **Commit and Push Changes**

   ```bash
   git add .
   git commit -m "Set up media file hosting"
   git push production main
   ```

6. **Testing Media File Uploads**
   Upload a file in Django and check:

   ```
   https://media.example.org/your_uploaded_file_name
   ```

7. **Creating Subdirectories (if necessary)**
   Ensure that required subdirectories exist in `~/media.example.org/`.

---

## 🎯 Conclusion

By following this guide, you should now have your Django application successfully hosted on cPanel. You can manage your project, handle static and media files, and ensure your site runs smoothly.

✅ **Pro tips**:

* Always set `DEBUG = False` in production.
* Use environment variables for DB credentials and secrets.
* Regularly check logs and back up your data.

*Happy coding!* 🎉
