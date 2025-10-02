
# BLINK Digital Menu - Deployment Guide (EN/FA)

![BLINK Hero](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200)

---

### 🚀 Project Overview (English)

BLINK is a modern, full-stack digital menu platform designed for restaurants. It goes beyond a simple QR code, offering a visually stunning, interactive, and gamified experience for customers. For restaurant owners, it provides a powerful management dashboard equipped with an AI Creative Hub to generate professional marketing content, manage orders in real-time, and build a loyal customer base.

This document provides a comprehensive guide for deploying the BLINK application on a production server running **Ubuntu 22.04**.

---

### 🚀 معرفی پروژه (فارسی)

BLINK یک پلتفرم منوی دیجیتال مدرن و فول-استک است که برای رستوران‌ها طراحی شده است. این پلتفرم فراتر از یک QR کد ساده عمل کرده و تجربه‌ای جذاب، تعاملی و مبتنی بر بازی برای مشتریان فراهم می‌کند. برای صاحبان رستوران، BLINK یک داشبورد مدیریتی قدرتمند با "مرکز خلاقیت هوش مصنوعی" ارائه می‌دهد که امکان تولید محتوای بازاریابی حرفه‌ای، مدیریت آنی سفارشات و ایجاد باشگاه مشتریان وفادار را فراهم می‌سازد.

این راهنما دستورالعمل‌های جامعی برای استقرار اپلیکیشن BLINK روی یک سرور پروداکشن با سیستم‌عامل **Ubuntu 22.04** ارائه می‌دهد.

---

### ✅ Prerequisites (English)

Before you begin, ensure your server has the following software installed. The provided `deploy.sh` script will check for these, but it will not install them for you.

-   **Node.js:** Version 18.x or higher.
-   **npm:** Node Package Manager (usually comes with Node.js).
-   **PostgreSQL:** The database for storing all application data.
-   **Nginx:** The web server and reverse proxy.
-   **PM2:** A process manager for Node.js applications (`sudo npm install pm2 -g`).
-   **Git:** For cloning the repository.
-   **Certbot:** For obtaining a free SSL certificate (`sudo apt install certbot python3-certbot-nginx`).

You will also need:
-   A registered domain name (e.g., `your-domain.com`).
-   DNS records pointing your domain to the server's IP address.

---

### ✅ پیش‌نیازها (فارسی)

قبل از شروع، اطمینان حاصل کنید که نرم‌افزارهای زیر روی سرور شما نصب شده باشند. اسکریپت `deploy.sh` وجود این موارد را بررسی می‌کند اما آن‌ها را برای شما نصب نخواهد کرد.

-   **Node.js:** نسخه ۱۸.x یا بالاتر.
-   **npm:** مدیر بسته Node (معمولاً همراه با Node.js نصب می‌شود).
-   **PostgreSQL:** پایگاه داده برای ذخیره‌سازی اطلاعات اپلیکیشن.
-   **Nginx:** وب‌سرور و پراکسی معکوس.
-   **PM2:** مدیر فرآیند برای اپلیکیشن‌های Node.js (با دستور `sudo npm install pm2 -g`).
-   **Git:** برای کلون کردن ریپازیتوری.
-   **Certbot:** برای دریافت گواهی SSL رایگان (با دستور `sudo apt install certbot python3-certbot-nginx`).

همچنین شما به موارد زیر نیاز خواهید داشت:
-   یک نام دامنه ثبت‌شده (مانند `your-domain.com`).
-   رکوردهای DNS که دامنه شما را به آدرس IP سرور متصل می‌کنند.

---

### ⚙️ Step-by-Step Deployment Guide (English)

This guide uses the automated `deploy.sh` script for a streamlined setup.

#### Step 1: Clone the Repository

Connect to your server via SSH and clone the project repository into a suitable directory. We recommend `/var/www/`.

```bash
sudo git clone https://github.com/your-username/blink-menu.git /var/www/blink-menu
cd /var/www/blink-menu
```

#### Step 2: Run the Deployment Script

The `deploy.sh` script will guide you through the configuration process. It will ask for your domain, email, a database password, and your API key.

Make the script executable and run it:

```bash
# This only needs to be done once
sudo chmod +x deploy.sh

# Run the deployment script
sudo ./deploy.sh
```

The script will perform the following actions:
1.  Check for required software.
2.  Prompt you for necessary configuration details.
3.  Create the `.env` files for the frontend and backend.
4.  Install all `npm` dependencies.
5.  Build the static frontend assets.
6.  Start the backend server with PM2 and configure it to run on startup.
7.  Generate a custom Nginx configuration file for your domain.

#### Step 3: Configure DNS

Before you can get an SSL certificate, your domain must point to your server's IP address. Go to your DNS provider (e.g., Cloudflare, GoDaddy) and create the following **A records**:

| Type | Name        | Content (Value)          |
| :--- | :---------- | :----------------------- |
| A    | `@`         | `YOUR_SERVER_IP_ADDRESS` |
| A    | `www`       | `YOUR_SERVER_IP_ADDRESS` |

*Note: DNS changes can take some time to propagate.*

#### Step 4: Finalize Server Configuration

After the `deploy.sh` script finishes, it will output a final set of commands you need to run. These commands will:
1.  Enable your new Nginx site.
2.  Test the Nginx configuration.
3.  Restart Nginx to apply the changes.
4.  Run Certbot to secure your site with a free SSL certificate.

Copy and paste these commands into your terminal to complete the setup.

**Congratulations! Your BLINK Digital Menu is now live and secure at `https://your-domain.com`.**

---

### ⚙️ راهنمای گام‌به‌گام استقرار (فارسی)

این راهنما از اسکریپت خودکار `deploy.sh` برای یک راه‌اندازی سریع و ساده استفاده می‌کند.

#### مرحله ۱: کلون کردن ریپازیتوری

از طریق SSH به سرور خود متصل شوید و ریپازیتوری پروژه را در یک مسیر مناسب کلون کنید. ما مسیر `/var/www/` را پیشنهاد می‌کنیم.

```bash
sudo git clone https://github.com/your-username/blink-menu.git /var/www/blink-menu
cd /var/www/blink-menu
```

#### مرحله ۲: اجرای اسکریپت استقرار

اسکریپت `deploy.sh` شما را در فرآیند پیکربندی راهنمایی خواهد کرد. این اسکریپت اطلاعاتی مانند دامنه، ایمیل، رمز عبور پایگاه داده و کلید API شما را درخواست می‌کند.

اسکریپت را قابل اجرا کرده و آن را اجرا کنید:

```bash
# این دستور فقط یک بار نیاز به اجرا دارد
sudo chmod +x deploy.sh

# اسکریپت استقرار را اجرا کنید
sudo ./deploy.sh
```

این اسکریپت اقدامات زیر را انجام خواهد داد:
۱. بررسی نرم‌افزارهای مورد نیاز.
۲. درخواست اطلاعات لازم برای پیکربندی.
۳. ایجاد فایل‌های `.env` برای فرانت‌اند و بک‌اند.
۴. نصب تمام وابستگی‌های `npm`.
۵. ساخت فایل‌های استاتیک فرانت‌اند.
۶. راه‌اندازی سرور بک‌اند با PM2 و تنظیم آن برای اجرا در هنگام بوت شدن سرور.
۷. ایجاد یک فایل پیکربندی Nginx سفارشی برای دامنه شما.

#### مرحله ۳: پیکربندی DNS

قبل از اینکه بتوانید گواهی SSL دریافت کنید، دامنه شما باید به آدرس IP سرور اشاره کند. به پنل ارائه‌دهنده DNS خود (مانند Cloudflare) بروید و رکوردهای **A** زیر را ایجاد کنید:

| نوع  | نام         | محتوا (مقدار)            |
| :--- | :---------- | :----------------------- |
| A    | `@`         | `YOUR_SERVER_IP_ADDRESS` |
| A    | `www`       | `YOUR_SERVER_IP_ADDRESS` |

*توجه: اعمال تغییرات DNS ممکن است مدتی طول بکشد.*

#### مرحله ۴: نهایی‌سازی پیکربندی سرور

پس از اتمام کار اسکریپت `deploy.sh`، مجموعه‌ای از دستورات نهایی به شما نمایش داده می‌شود که باید اجرا کنید. این دستورات:
۱. سایت جدید Nginx شما را فعال می‌کنند.
۲. پیکربندی Nginx را آزمایش می‌کنند.
۳. Nginx را برای اعمال تغییرات ری‌استارت می‌کنند.
۴. Certbot را برای امن‌سازی سایت شما با گواهی SSL رایگان اجرا می‌کنند.

این دستورات را کپی و در ترمینال خود اجرا کنید تا راه‌اندازی تکمیل شود.

**تبریک! منوی دیجیتال BLINK شما اکنون روی دامنه `https://your-domain.com` فعال و امن است.**

---

### 🔧 Environment Configuration Details (English)

The deployment script creates two `.env` files from your input. It's useful to know what they contain.

| Variable       | Location        | Description                                                                                             |
| :------------- | :-------------- | :------------------------------------------------------------------------------------------------------ |
| `API_KEY`      | `.` & `backend` | **Required.** Your API key for the Google Gemini AI models. Get this from [Google AI Studio](https://aistudio.google.com/app/apikey). |
| `DATABASE_URL` | `backend`       | **Required.** The full connection string for your PostgreSQL database. The script generates this for you. |
| `PORT`         | `backend`       | *Optional.* The port for the backend server. Defaults to `5000`.                                        |

---

### 🔧 جزئیات پیکربندی محیط (فارسی)

اسکریپت استقرار دو فایل `.env` را بر اساس ورودی شما ایجاد می‌کند. بهتر است با محتوای این فایل‌ها آشنا باشید.

| متغیر          | مسیر             | توضیحات                                                                                                       |
| :------------- | :-------------- | :------------------------------------------------------------------------------------------------------------- |
| `API_KEY`      | `.` و `backend` | **ضروری.** کلید API شما برای مدل‌های هوش مصنوعی Google Gemini. این کلید را از [Google AI Studio](https://aistudio.google.com/app/apikey) دریافت کنید. |
| `DATABASE_URL` | `backend`       | **ضروری.** رشته اتصال کامل پایگاه داده PostgreSQL. این مقدار توسط اسکریپت برای شما ایجاد می‌شود.                |
| `PORT`         | `backend`       | *اختیاری.* پورتی که سرور بک‌اند روی آن اجرا می‌شود. مقدار پیش‌فرض `5000` است.                                       |

---

### 💡 Troubleshooting Common Issues (English)

-   **Nginx Test Failed:**
    -   Check if another service is using port 80.
    -   Verify the syntax in `/etc/nginx/sites-available/your-domain.com`.
-   **502 Bad Gateway Error:**
    -   This usually means the backend server is not running or has crashed.
    -   Check the status with `pm2 status`.
    -   Check the logs for errors with `pm2 logs blink-backend`. Ensure your `backend/.env` file is correct.
-   **Certbot Fails:**
    -   This is almost always a DNS issue. Ensure your domain is correctly pointing to your server's IP and that the changes have propagated. Use a tool like `dnschecker.org` to verify.
-   **`npm install` Fails:**
    -   Ensure you have a compatible version of Node.js (v18+) and that you have sufficient permissions in the project directory. Running the deploy script with `sudo` is recommended.

---

### 💡 عیب‌یابی مشکلات رایج (فارسی)

-   **خطای تست Nginx (Nginx Test Failed):**
    -   بررسی کنید که سرویس دیگری از پورت ۸۰ استفاده نمی‌کند.
    -   سینتکس فایل پیکربندی در مسیر `/etc/nginx/sites-available/your-domain.com` را بررسی کنید.
-   **خطای 502 Bad Gateway:**
    -   این خطا معمولاً به این معنی است که سرور بک‌اند اجرا نشده یا کرش کرده است.
    -   وضعیت را با دستور `pm2 status` بررسی کنید.
    -   لاگ‌ها را برای یافتن خطا با دستور `pm2 logs blink-backend` مشاهده کنید. مطمئن شوید فایل `backend/.env` صحیح است.
-   **خطای Certbot:**
    -   این مشکل تقریباً همیشه به DNS مربوط می‌شود. اطمینان حاصل کنید که دامنه شما به درستی به IP سرور اشاره می‌کند و تغییرات اعمال شده است. برای بررسی از ابزاری مانند `dnschecker.org` استفاده کنید.
-   **خطای `npm install`:**
    -   مطمئن شوید که نسخه سازگاری از Node.js (نسخه ۱۸ به بالا) دارید و دسترسی‌های لازم در پوشه پروژه را دارید. اجرای اسکریپت استقرار با `sudo` توصیه می‌شود.
