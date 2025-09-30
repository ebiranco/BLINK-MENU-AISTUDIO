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

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **AI Integration:** Google Gemini API
  - `gemini-2.5-flash`: For AI text generation and in-context image generation.
  - `veo-2.0-generate-001`: For AI video generation.
- **Deployment:** Nginx (Web Server & Reverse Proxy), PM2 (Process Manager)

---

### ⚙️ Deployment Guide (Ubuntu 22.04)

This project includes a fully automated deployment script to simplify server setup.

#### Method 1: Automated Deployment (Recommended)

This script will install all prerequisites (Node, npm, PostgreSQL, Nginx, PM2), configure the database, set up the web server, and start the application.

1.  **Upload & Prepare:**
    Upload your entire project directory to your server (e.g., in the `/home/ubuntu` directory). SSH into your server and navigate into the project folder.

2.  **Make Script Executable:**
    ```bash
    chmod +x deploy.sh
    ```

3.  **Run the Script:**
    Execute the script with `sudo` and pass your domain name as the first argument. You will be prompted to create a secure password for the database user during the process.
    ```bash
    # Replace your_domain.com with your actual domain
    sudo bash deploy.sh your_domain.com
    ```

4.  **Final Configuration (Manual Step):**
    After the script finishes, you need to set your secret API key. The script will create a `.env` file at the deployment location (`/var/www/blink-menu/.env`).
    
    Edit this file:
    ```bash
    sudo nano /var/www/blink-menu/.env
    ```
    Add your Gemini API key:
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
    Save the file (Ctrl+X, then Y, then Enter).

5.  **Generate Frontend Config:**
    The frontend needs a public configuration file. Navigate to the deployment directory and run the `prepare` script.
    ```bash
    cd /var/www/blink-menu
    npm run prepare
    ```

Your application is now live! The script will provide final recommendations to set up a firewall and an SSL certificate with Certbot, which are highly advised.

#### Environment Variables
The application relies on these environment variables:
- **`API_KEY`**: (Required for AI features) Your Google Gemini API key. Must be set manually in `/var/www/blink-menu/.env` after running the deployment script.
- **`DATABASE_URL`**: (Handled by the script) The connection string for the PostgreSQL database. The `deploy.sh` script generates this and places it in `/var/www/blink-menu/backend/.env`.

---

### 📖 User Guide

#### Customer Menu
- **Navigation:** Access the demo menu via the landing page or by navigating to `/#/menu/blink-restaurant`.
- **Browsing:** Select a category to view items. Use the "Immersive" and "Grid" toggles to change the layout.
- **Ordering:** Click on an item to see details or add it directly to the cart. Open the cart, set your table number, and proceed with the order.
- **Gaming:** If logged in, click "Game Zone" in the header to play. You can play a single-player game or challenge another online user to "Esm Famil".

#### Restaurant Owner Dashboard
- **Access:** Log in from the landing page or navigate to `/#/dashboard`.
- **Orders:** View and manage incoming orders on a real-time Kanban board.
- **Menu Items / Categories:** Add new items/categories or edit existing ones.
- **Blink Creative Hub:**
  - **Photography:** Upload a basic food photo, choose a style, and let the AI generate a professional image. Copy the URL to use when editing a menu item.
  - **Video:** Upload a photo, select options, and generate a short video ad.
- **Customer Club:** Activate this feature in "Upgrades". Once active, you can view all registered customers and their game stats.

---
---

## فارسی (Persian)

### 🚀 معرفی پروژه

BLINK یک پلتفرم منوی دیجیتال مدرن و Full-Stack است که برای رستوران‌ها طراحی شده است. این پلتفرم فراتر از یک QR کد ساده عمل کرده و یک تجربه بصری خیره‌کننده، تعاملی و مبتنی بر بازی (Gamified) برای مشتریان فراهم می‌کند. برای صاحبان رستوران، یک داشبورد مدیریتی قدرتمند با "استودیو خلاق هوش مصنوعی" ارائه می‌دهد تا محتوای بازاریابی حرفه‌ای تولید کنند، سفارشات را به‌صورت لحظه‌ای مدیریت کرده و یک پایگاه مشتریان وفادار بسازند.

### ✨ امکانات و قابلیت‌ها

#### برای مشتریان:
- **منوی تعاملی دوزبانه:** جابجایی آسان بین زبان‌های فارسی و انگلیسی.
- **دو حالت نمایش:** امکان انتخاب بین حالت سینمایی "Immersive" یا چیدمان کلاسیک "Grid".
- **اطلاعات کامل آیتم:** مشاهده تصاویر باکیفیت، توضیحات، قیمت، زمان آماده‌سازی و اطلاعات آلرژن‌ها.
- **سفارش‌دهی آسان:** افزودن آیتم‌ها به سبد خرید، وارد کردن شماره میز و طی کردن فرآیند پرداخت شبیه‌سازی‌شده.
- **بازی و سرگرمی:**
    - **Blink Bites:** یک مینی‌گیم تک‌نفره جذاب برای سرگرم شدن در زمان انتظار.
    - **اسم فامیل:** امکان به چالش کشیدن سایر کاربران آنلاین برای یک بازی دونفره و لحظه‌ای "اسم فامیل".
    - **جدول امتیازات (Leaderboard):** رقابت برای کسب بالاترین امتیاز و مشاهده رتبه خود در میان سایر بازیکنان.
    - **پروفایل کاربری:** ثبت‌نام با شماره تلفن برای ذخیره امتیازات و پیشرفت در بازی.
- **رزرو میز:** فرمی ساده برای رزرو میز از قبل.

#### برای صاحبان رستوران (داشبورد):
- **مدیریت لحظه‌ای سفارشات:** یک برد Kanban برای پیگیری سفارشات زنده (`جدید`، `در حال آماده‌سازی`، `تکمیل‌شده`).
- **کنترل کامل منو:** افزودن، ویرایش یا حذف آسان آیتم‌ها و دسته‌بندی‌های منو.
- **🤖 استودیو خلاق هوش مصنوعی:**
    - **استودیو عکاسی AI:** یک عکس ساده از غذا آپلود کرده و آن را با استفاده از استایل‌های از پیش‌آماده و کنترل‌های دقیق (زاویه، نورپردازی، پس‌زمینه) به تصاویر حرفه‌ای و باکیفیت تبدیل کنید.
    - **استودیو ویدیو AI:** از یک عکس محصول، یک ویدیوی تبلیغاتی کوتاه و جذاب برای شبکه‌های اجتماعی بسازید.
- **باشگاه مشتریان:** مشاهده لیست مشتریان ثبت‌نام کرده، اطلاعات تماس و آمار پیشرفت آن‌ها در بازی.
- **ارتقا و اعتبار:** استفاده از یک سیستم اعتباری برای فعال‌سازی قابلیت‌های پیشرفته مانند مرکز بازی و باشگاه مشتریان و خرید اعتبار در صورت نیاز.
- **بخش مالی:** مشاهده تاریخچه تراکنش‌ها و پیکربندی تنظیمات درگاه پرداخت.

#### برای ادمین پلتفرم:
- **پنل مدیریت SaaS:** یک داشبورد مجزا برای نظارت بر کل پلتفرم.
- **مدیریت رستوران‌ها:** مشاهده تمام رستوران‌های ثبت‌شده، وضعیت آن‌ها و فعال یا غیرفعال کردن آن‌ها.
- **تحلیل پلتفرم:** مشاهده کلی درآمد کل، تعداد سفارشات و رستوران‌های فعال.

### 💻 تکنولوژی‌های استفاده شده

- **فرانت‌اند:** React, TypeScript, Tailwind CSS
- **بک‌اند:** Node.js, Express.js
- **دیتابیس:** PostgreSQL
- **هوش مصنوعی:** Google Gemini API
  - `gemini-2.5-flash`: برای تولید متن و ویرایش تصاویر.
  - `veo-2.0-generate-001`: برای تولید ویدیو.
- **استقرار (Deployment):** Nginx (وب سرور و Reverse Proxy), PM2 (مدیریت پردازش)

---

### ⚙️ راهنمای استقرار (Ubuntu 22.04)

این پروژه شامل یک اسکریپت استقرار تمام خودکار برای ساده‌سازی فرآیند راه‌اندازی سرور است.

#### روش اول: استقرار خودکار (توصیه شده)

این اسکریپت تمام پیش‌نیازها را نصب کرده (Node, npm, PostgreSQL, Nginx, PM2)، دیتابیس را پیکربندی می‌کند، وب سرور را تنظیم کرده و اپلیکیشن را اجرا می‌کند.

۱. **آپلود و آماده‌سازی:**
   کل پوشه پروژه را روی سرور خود آپلود کنید (مثلاً در پوشه `/home/ubuntu`). با SSH به سرور متصل شده و وارد پوشه پروژه شوید.

۲. **اجرایی کردن اسکریپت:**
   ```bash
   chmod +x deploy.sh
   ```

۳. **اجرای اسکریپت:**
   اسکریپت را با `sudo` اجرا کرده و نام دامنه خود را به عنوان آرگومان اول به آن بدهید. در حین اجرا، از شما خواسته می‌شود تا یک رمز عبور امن برای کاربر دیتابیس ایجاد کنید.
   ```bash
   # به جای your_domain.com دامنه واقعی خود را وارد کنید
   sudo bash deploy.sh your_domain.com
   ```

۴. **پیکربندی نهایی (مرحله دستی):**
   پس از اتمام اسکریپت، باید کلید API مخفی خود را تنظیم کنید. اسکریپت یک فایل `.env` در مسیر استقرار (`/var/www/blink-menu/.env`) ایجاد می‌کند.
   
   این فایل را ویرایش کنید:
   ```bash
   sudo nano /var/www/blink-menu/.env
   ```
   کلید Gemini API خود را اضافه کنید:
   ```
   API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
   ```
   فایل را ذخیره کنید (Ctrl+X, سپس Y, و در نهایت Enter).

۵. **تولید کانفیگ فرانت‌اند:**
   فرانت‌اند به یک فایل پیکربندی عمومی نیاز دارد. به پوشه استقرار رفته و اسکریپت `prepare` را اجرا کنید.
   ```bash
   cd /var/www/blink-menu
   npm run prepare
   ```

اپلیکیشن شما اکنون فعال است! اسکریپت در انتها توصیه‌هایی برای راه‌اندازی فایروال و گواهی SSL با Certbot ارائه می‌دهد که انجام آن‌ها به‌شدت پیشنهاد می‌شود.

#### متغیرهای محیطی (Environment Variables)
اپلیکیشن به این متغیرها وابسته است:
- **`API_KEY`**: (برای قابلیت‌های هوش مصنوعی ضروری است) کلید Gemini API شما. باید پس از اجرای اسکریپت، به‌صورت دستی در فایل `/var/www/blink-menu/.env` تنظیم شود.
- **`DATABASE_URL`**: (توسط اسکریپت مدیریت می‌شود) رشته اتصال به دیتابیس PostgreSQL. اسکریپت `deploy.sh` این متغیر را تولید کرده و در فایل `/var/www/blink-menu/backend/.env` قرار می‌دهد.

---

### 📖 راهنمای استفاده

#### منوی مشتری
- **ورود:** از طریق صفحه اصلی یا با مراجعه به آدرس `/#/menu/blink-restaurant` به منوی دمو دسترسی پیدا کنید.
- **مرور منو:** یک دسته‌بندی را برای مشاهده آیتم‌ها انتخاب کنید. از دکمه‌های "Immersive" و "Grid" برای تغییر چیدمان استفاده کنید.
- **سفارش‌دهی:** روی یک آیتم کلیک کنید تا جزئیات آن را ببینید یا مستقیماً آن را به سبد خرید اضافه کنید. سبد خرید را باز کرده، شماره میز خود را وارد کنید و سفارش را نهایی کنید.
- **بازی:** اگر وارد حساب کاربری خود شده‌اید، روی "گیم سنتر" در هدر کلیک کنید. می‌توانید بازی تک‌نفره انجام دهید یا یک کاربر آنلاین دیگر را به "اسم فامیل" دعوت کنید.

#### داشبورد صاحب رستوران
- **ورود:** از صفحه اصلی وارد شوید یا به آدرس `/#/dashboard` بروید.
- **سفارشات:** سفارشات ورودی را در یک برد Kanban به‌صورت لحظه‌ای مشاهده و مدیریت کنید.
- **آیتم‌ها / دسته‌بندی‌ها:** آیتم‌ها یا دسته‌بندی‌های جدید اضافه کنید یا موارد موجود را ویرایش کنید.
- **استودیو خلاق BLINK:**
  - **عکاسی:** یک عکس ساده از غذا آپلود کرده، یک استایل انتخاب کنید و به هوش مصنوعی اجازه دهید یک تصویر حرفه‌ای تولید کند. آدرس URL تصویر را برای استفاده در منو کپی کنید.
  - **ویدیو:** یک عکس آپلود کرده، گزینه‌ها را انتخاب کنید و یک ویدیوی تبلیغاتی کوتاه بسازید.
- **باشگاه مشتریان:** این قابلیت را از بخش "ارتقاها" فعال کنید. پس از فعال‌سازی، می‌توانید تمام مشتریان ثبت‌نام کرده و آمار بازی آن‌ها را مشاهده کنید.
