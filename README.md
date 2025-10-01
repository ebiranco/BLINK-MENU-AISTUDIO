# BLINK Digital Menu

---

## English

### 🚀 Project Overview

BLINK is a modern, full-stack digital menu platform designed for restaurants. It goes beyond a simple QR code, offering a visually stunning, interactive, and gamified experience for customers. For restaurant owners, it provides a powerful management dashboard equipped with an AI Creative Hub to generate professional marketing content, manage orders in real-time, and build a loyal customer base.

### ✨ Features & Capabilities

#### For Customers:
- **Interactive Bilingual Menu:** Seamlessly switch between English and Persian.
- **Dual Viewing Modes:** Choose between a cinematic "Immersive" view or a classic "Grid" layout.
- **Detailed Item Information:** View high-quality images, descriptions, prices, preparation times, and allergen information.
- **Seamless Ordering:** Add items to a shopping cart, specify a table number, and proceed to a simulated payment process.
- **Gamification & Social Hub:**
    - **Blink Bites:** A fun, single-player mini-game to play while waiting.
    - **Esm Famil:** Challenge other online users to a real-time, two-player game of "Esm Famil".
    - **Leaderboard:** Compete for the high score and see your rank among other players.
    - **User Profiles:** Register with a phone number to track game scores and progress.
- **Table Reservations:** A simple form to book a table in advance.

#### For Restaurant Owners (Dashboard):
- **Real-time Order Management:** A Kanban board view (`New`, `In Progress`, `Completed`) to track live orders.
- **Full Menu Control:** Easily add, edit, or delete menu items and categories.
- **🤖 AI Creative Hub:**
    - **AI Photography Studio:** Upload a simple photo of a dish and transform it into professional, high-quality images using various style presets and detailed controls (angle, lighting, background).
    - **AI Video Studio:** Generate short, engaging video ads for social media from a single product photo.
- **Customer Club:** View a list of registered customers, their contact information, and their game progress statistics.
- **Upgrades & Credits:** Use a credit system to activate advanced features like the Game Center and Customer Club. Purchase more credits as needed.
- **Financials:** View a history of transactions and configure payment gateway settings.

#### For Platform Admins:
- **SaaS Management Panel:** A separate dashboard to oversee the entire platform.
- **Restaurant Management:** View all registered restaurants, their status, and activate or deactivate them.
- **Platform Analytics:** Get a high-level overview of total revenue, orders, and active restaurants.

### 💻 Technology Stack

- **Frontend:** React, TypeScript, Tailwind CSS. A dynamic single-page application (SPA) that provides a fast and responsive user interface.
- **Backend:** Node.js, Express.js. A robust REST API server that handles business logic, database interactions, and secure communication with the Gemini API.
- **Database:** PostgreSQL. A powerful, open-source object-relational database system used to store all persistent data, including restaurant info, menus, customers, and orders.
- **AI Integration:** Google Gemini API
  - **`gemini-2.5-flash-image-preview`**: For AI-powered image editing and re-imagining in the Photography Studio.
  - **`veo-2.0-generate-001`**: For AI video generation.
  - **`gemini-2.5-flash`**: For advanced text generation (menu descriptions) and structured JSON output (AI game opponent).
- **Deployment:** Nginx (Web Server & Reverse Proxy), PM2 (Process Manager), Certbot (SSL).

---

## ⚙️ Deployment Guide (Ubuntu 22.04)

This guide provides two methods to deploy the application on a fresh Ubuntu 22.04 server.

#### Prerequisites
- A server running Ubuntu 22.04.
- A registered domain name (e.g., `your_domain.com`).
- A DNS **A record** pointing your domain to your server's public IP address.

---

### Method 1: Automated Deployment (🚀 Recommended)

This one-line command runs a script that handles everything: installing prerequisites, configuring the database, setting up the web server, and securing your site with a free SSL certificate.

#### 🏁 Deployment Command
Connect to your server via SSH, clone your project, navigate into the directory, and run the `deploy.sh` script. Replace `your_domain.com` with your actual domain.

```bash
# First, clone your project from its repository
git clone https://github.com/your-username/blink-menu.git
cd blink-menu

# Make the script executable
chmod +x deploy.sh

# Then, run the deployment script
sudo ./deploy.sh your_domain.com
```

The script will guide you, asking for a database password and an email for SSL registration.

#### ✅ Final Configuration
After the script finishes, you must manually set your API key.

1.  **Edit the main project `.env` file:**
    ```bash
    sudo nano /var/www/blink-menu/.env
    ```
2.  **Add your Gemini API Key:**
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
3.  **Apply Configuration and Restart:**
    ```bash
    cd /var/www/blink-menu
    npm run prepare
    pm2 restart blink-backend
    ```

Your application is now live and secure at **`https://your_domain.com`**.

---

### Method 2: Manual Step-by-Step Deployment

This guide provides detailed, step-by-step instructions for manual deployment.

#### Step 1: Server Setup & Cloning Project

1.  Connect to your server via SSH.
2.  Update your server's package list and install Git:
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y git
    ```
3.  Clone the project into a standard web directory:
    ```bash
    sudo git clone https://github.com/your-username/blink-menu.git /var/www/blink-menu
    cd /var/www/blink-menu
    ```

#### Step 2: Install Dependencies (Node.js, Nginx, PostgreSQL)

1.  Install Node.js (we recommend version 18.x):
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    ```
2.  Install Nginx web server and PostgreSQL database:
    ```bash
    sudo apt install -y nginx postgresql postgresql-contrib
    ```

#### Step 3: Configure PostgreSQL Database

1.  Start and enable PostgreSQL:
    ```bash
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```
2.  Log in to the PostgreSQL prompt:
    ```bash
    sudo -u postgres psql
    ```
3.  Inside the `psql` prompt, run the following commands. **Replace `your_secure_password` with a strong password.**
    ```sql
    CREATE DATABASE blinkdb;
    CREATE USER blinkuser WITH PASSWORD 'your_secure_password';
    GRANT ALL PRIVILEGES ON DATABASE blinkdb TO blinkuser;
    \q
    ```
4.  Run the `init.sql` script to create the database schema and add mock data:
    ```bash
    sudo -u blinkuser psql -d blinkdb -f /var/www/blink-menu/init.sql
    ```

#### Step 4: Install Project Dependencies

1.  Install dependencies for the root and the backend:
    ```bash
    sudo npm install
    sudo npm install --prefix backend
    ```

#### Step 5: Configure Environment Variables

1.  Create and edit the `.env` file for the backend. This file stores the database connection string.
    ```bash
    sudo nano /var/www/blink-menu/backend/.env
    ```
    Add the following line, replacing `your_secure_password` with the password you created in Step 3:
    ```
    DATABASE_URL="postgresql://blinkuser:your_secure_password@localhost:5432/blinkdb"
    ```
2.  Create and edit the main `.env` file for the frontend. This file stores the Gemini API key.
    ```bash
    sudo nano /var/www/blink-menu/.env
    ```
    Add your API key:
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
3.  Generate the frontend configuration file from the `.env` file:
    ```bash
    sudo npm run prepare
    ```
4.  Set correct permissions for the project directory:
    ```bash
    sudo chown -R www-data:www-data /var/www/blink-menu
    ```

#### Step 6: Start Backend with PM2

1.  Install PM2, a process manager for Node.js:
    ```bash
    sudo npm install pm2 -g
    ```
2.  Start the backend server with PM2:
    ```bash
    cd /var/www/blink-menu/backend
    sudo pm2 start server.js --name blink-backend
    ```
3.  Configure PM2 to start on server reboot:
    ```bash
    sudo pm2 startup systemd
    # Follow the on-screen instructions (copy/paste and run the command it provides)
    sudo pm2 save
    ```

#### Step 7: Configure Nginx as a Reverse Proxy

1.  Create a new Nginx configuration file for your site. Replace `your_domain.com` with your actual domain.
    ```bash
    sudo nano /etc/nginx/sites-available/your_domain.com
    ```
2.  Paste the following configuration into the file. **Remember to replace `your_domain.com` in both places.**
    ```nginx
    server {
        listen 80;
        server_name your_domain.com;
        root /var/www/blink-menu;

        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  Enable the site by creating a symbolic link:
    ```bash
    sudo ln -s /etc/nginx/sites-available/your_domain.com /etc/nginx/sites-enabled/
    ```
4.  Test your Nginx configuration for errors:
    ```bash
    sudo nginx -t
    ```
5.  If the test is successful, restart Nginx to apply the changes:
    ```bash
    sudo systemctl restart nginx
    ```

#### Step 8: Obtain SSL Certificate with Certbot

1.  Install Certbot, the tool for getting Let's Encrypt SSL certificates:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    ```
2.  Run Certbot to automatically obtain and install the SSL certificate. Replace `your_domain.com` with your domain and provide your email.
    ```bash
    sudo certbot --nginx -d your_domain.com --email your_email@example.com --agree-tos -n --redirect
    ```
    *   `--redirect` automatically redirects all HTTP traffic to HTTPS.
    *   `-n` runs it non-interactively.

Certbot will automatically renew your certificate before it expires.

That's it! Your application is now live and secure at **`https://your_domain.com`**.

---
---

## فارسی (Persian)

### 🚀 معرفی پروژه

BLINK یک پلتفرم منوی دیجیتال مدرن و Full-Stack است که برای رستوران‌ها طراحی شده است. این پلتفرم فراتر از یک QR کد ساده عمل کرده و یک تجربه بصری خیره‌کننده، تعاملی و مبتنی بر بازی (Gamified) برای مشتریان فراهم می‌کند.

### ⚙️ راهنمای استقرار (Ubuntu 22.04)

این راهنما دو روش برای استقرار اپلیکیشن بر روی یک سرور اوبونتو ۲۲.۰۴ ارائه می‌دهد.

#### پیش‌نیازها
- یک سرور با سیستم‌عامل Ubuntu 22.04.
- یک نام دامنه ثبت شده (مثال: `your_domain.com`).
- یک رکورد DNS از نوع **A** که دامنه شما را به IP عمومی سرور متصل می‌کند.

---

### روش اول: استقرار خودکار (🚀 پیشنهادی)

این دستور یک اسکریپت را اجرا می‌کند که همه کارها را انجام می‌دهد: نصب پیش‌نیازها، پیکربندی دیتابیس، راه‌اندازی وب‌سرور و امن‌سازی سایت با گواهی SSL رایگان.

#### 🏁 دستور استقرار
از طریق SSH به سرور متصل شوید، پروژه را کلون کرده، وارد پوشه آن شوید و اسکریپت `deploy.sh` را اجرا کنید. `your_domain.com` را با دامنه واقعی خود جایگزین کنید.

```bash
# پروژه را از ریپازیتوری خود کلون کنید
git clone https://github.com/your-username/blink-menu.git
cd blink-menu

# اسکریپت را قابل اجرا کنید
chmod +x deploy.sh

# اسکریپت استقرار را اجرا کنید
sudo ./deploy.sh your_domain.com
```
اسکریپت از شما یک رمز عبور برای دیتابیس و یک ایمیل برای گواهی SSL خواهد خواست.

#### ✅ تنظیمات نهایی
پس از اتمام اسکریپت، فقط کلید API خود را به صورت دستی تنظیم کنید.

1.  **فایل `.env` اصلی را ویرایش کنید:**
    ```bash
    sudo nano /var/www/blink-menu/.env
    ```
2.  **کلید Gemini API خود را اضافه کنید:**
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
3.  **اعمال تنظیمات و راه‌اندازی مجدد:**
    ```bash
    cd /var/www/blink-menu
    npm run prepare
    pm2 restart blink-backend
    ```

اپلیکیشن شما اکنون بر روی آدرس **`https://your_domain.com`** فعال است.

---

### روش دوم: استقرار دستی قدم‌به‌قدم

این راهنما شامل دستورالعمل‌های دقیق برای استقرار دستی است.

#### مرحله ۱: راه‌اندازی سرور و کلون کردن پروژه

1.  از طریق SSH به سرور خود متصل شوید.
2.  لیست پکیج‌های سرور را به‌روز کرده و Git را نصب کنید:
    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y git
    ```
3.  پروژه را در یک مسیر استاندارد وب کلون کنید:
    ```bash
    sudo git clone https://github.com/your-username/blink-menu.git /var/www/blink-menu
    cd /var/www/blink-menu
    ```

#### مرحله ۲: نصب نیازمندی‌ها (Node.js, Nginx, PostgreSQL)

1.  Node.js (نسخه ۱۸.x) را نصب کنید:
    ```bash
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    ```
2.  وب سرور Nginx و دیتابیس PostgreSQL را نصب کنید:
    ```bash
    sudo apt install -y nginx postgresql postgresql-contrib
    ```

#### مرحله ۳: پیکربندی دیتابیس PostgreSQL

1.  PostgreSQL را فعال و اجرا کنید:
    ```bash
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    ```
2.  وارد محیط خط فرمان PostgreSQL شوید:
    ```bash
    sudo -u postgres psql
    ```
3.  در محیط `psql`، دستورات زیر را اجرا کنید. **رمز عبور `your_secure_password` را با یک رمز قوی جایگزین کنید.**
    ```sql
    CREATE DATABASE blinkdb;
    CREATE USER blinkuser WITH PASSWORD 'your_secure_password';
    GRANT ALL PRIVILEGES ON DATABASE blinkdb TO blinkuser;
    \q
    ```
4.  اسکریپت `init.sql` را برای ساخت جداول و افزودن داده‌های اولیه اجرا کنید:
    ```bash
    sudo -u blinkuser psql -d blinkdb -f /var/www/blink-menu/init.sql
    ```

#### مرحله ۴: نصب وابستگی‌های پروژه

1.  وابستگی‌های لازم برای ریشه پروژه و بک‌اند را نصب کنید:
    ```bash
    sudo npm install
    sudo npm install --prefix backend
    ```

#### مرحله ۵: تنظیم متغیرهای محیطی

1.  فایل `.env` بک‌اند را برای ذخیره اطلاعات اتصال به دیتابیس ایجاد و ویرایش کنید:
    ```bash
    sudo nano /var/www/blink-menu/backend/.env
    ```
    خط زیر را اضافه کرده و `your_secure_password` را با رمز عبوری که در مرحله ۳ ساختید جایگزین کنید:
    ```
    DATABASE_URL="postgresql://blinkuser:your_secure_password@localhost:5432/blinkdb"
    ```
2.  فایل `.env` اصلی را برای کلید Gemini API ایجاد کنید:
    ```bash
    sudo nano /var/www/blink-menu/.env
    ```
    کلید API خود را اضافه کنید:
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
3.  فایل کانفیگ فرانت‌اند را تولید کنید:
    ```bash
    sudo npm run prepare
    ```
4.  سطح دسترسی صحیح را برای پوشه پروژه تنظیم کنید:
    ```bash
    sudo chown -R www-data:www-data /var/www/blink-menu
    ```

#### مرحله ۶: اجرای بک‌اند با PM2

1.  PM2 (مدیر فرآیند برای Node.js) را نصب کنید:
    ```bash
    sudo npm install pm2 -g
    ```
2.  سرور بک‌اند را با PM2 اجرا کنید:
    ```bash
    cd /var/www/blink-menu/backend
    sudo pm2 start server.js --name blink-backend
    ```
3.  PM2 را طوری تنظیم کنید که با ریبوت شدن سرور، به طور خودکار اجرا شود:
    ```bash
    sudo pm2 startup systemd
    # دستوری که نمایش داده می‌شود را کپی و اجرا کنید
    sudo pm2 save
    ```

#### مرحله ۷: پیکربندی Nginx به عنوان Reverse Proxy

1.  یک فایل پیکربندی جدید برای سایت خود در Nginx ایجاد کنید. `your_domain.com` را با دامنه خود جایگزین کنید.
    ```bash
    sudo nano /etc/nginx/sites-available/your_domain.com
    ```
2.  پیکربندی زیر را در فایل کپی کنید. **فراموش نکنید که `your_domain.com` را در دو جا با دامنه خود جایگزین کنید.**
    ```nginx
    server {
        listen 80;
        server_name your_domain.com;
        root /var/www/blink-menu;

        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://localhost:5000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
3.  این سایت را با ایجاد یک لینک سیمبولیک فعال کنید:
    ```bash
    sudo ln -s /etc/nginx/sites-available/your_domain.com /etc/nginx/sites-enabled/
    ```
4.  پیکربندی Nginx را برای یافتن خطاها تست کنید:
    ```bash
    sudo nginx -t
    ```
5.  اگر تست موفقیت‌آمیز بود، Nginx را برای اعمال تغییرات ری‌استارت کنید:
    ```bash
    sudo systemctl restart nginx
    ```

#### مرحله ۸: دریافت گواهی SSL با Certbot

1.  ابزار Certbot را برای دریافت گواهی SSL رایگان نصب کنید:
    ```bash
    sudo apt install -y certbot python3-certbot-nginx
    ```
2.  Certbot را برای دریافت و نصب خودکار گواهی اجرا کنید. `your_domain.com` را با دامنه و `your_email@example.com` را با ایمیل خود جایگزین کنید.
    ```bash
    sudo certbot --nginx -d your_domain.com --email your_email@example.com --agree-tos -n --redirect
    ```
    *   گزینه `--redirect` تمام ترافیک HTTP را به HTTPS منتقل می‌کند.

Certbot گواهی شما را به طور خودکار تمدید خواهد کرد.

تمام شد! اپلیکیشن شما اکنون به صورت امن بر روی آدرس **`https://your_domain.com`** در دسترس است.
