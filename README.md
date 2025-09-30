# BLINK Digital Menu - Full-Stack Deployment Guide

This guide provides instructions for deploying the BLINK Digital Menu full-stack application on a production server running Ubuntu 22.04.

## Architecture Overview

The application consists of two main parts:
1.  **Frontend:** A static React application that serves the user interface.
2.  **Backend:** A Node.js/Express API server that connects to a PostgreSQL database to manage all data.

Both parts will be served by Nginx, which will also act as a reverse proxy for the backend API.

## Prerequisites

*   A VPS running Ubuntu 22.04.
*   A domain name pointed to your server's IP address.
*   Node.js (v18 or later) and npm.
*   PostgreSQL.
*   PM2 (a process manager for Node.js).
*   Nginx.

---

## Part 1: Backend Setup & Database Configuration

1.  **Install PostgreSQL**
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib -y
    ```

2.  **Create Database and User**
    Log in to the PostgreSQL interactive terminal.
    ```bash
    sudo -u postgres psql
    ```
    Execute the following SQL commands to create a database and a dedicated user. Replace `'your_secure_password'` with a strong password.
    ```sql
    CREATE DATABASE blinkdb;
    CREATE USER blinkuser WITH PASSWORD 'your_secure_password';
    GRANT ALL PRIVILEGES ON DATABASE blinkdb TO blinkuser;
    \q
    ```

3.  **Clone and Setup Backend Code**
    Clone the project and navigate into the `backend` directory.
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>/backend
    ```
    Install backend dependencies.
    ```bash
    npm install
    ```

4.  **Configure Backend Environment**
    Create a `.env` file in the `backend` directory.
    ```bash
    nano .env
    ```
    Add the database connection string and server port. **Use the password you created in step 2.**
    ```
    # Port for the backend server
    PORT=5000

    # PostgreSQL connection string
    DATABASE_URL="postgresql://blinkuser:your_secure_password@localhost:5432/blinkdb"
    ```

5.  **Initialize the Database Schema and Data**
    Run the `init.sql` script to create all necessary tables and populate them with the initial demo data.
    ```bash
    # Run this command from the root of the project directory, not the backend directory
    psql -U blinkuser -d blinkdb -h localhost -f ./backend/init.sql
    ```
    You will be prompted for the `blinkuser` password.

6.  **Run Backend with PM2**
    Install PM2, a process manager that will keep your backend running permanently.
    ```bash
    sudo npm install pm2 -g
    ```
    Start the backend server using PM2.
    ```bash
    # Run from the 'backend' directory
    pm2 start server.js --name blink-backend
    ```
    Ensure it's running:
    ```bash
    pm2 list
    ```
    To have PM2 automatically restart on server reboots:
    ```bash
    pm2 startup
    # Follow the on-screen instructions (copy/paste the command it gives you)
    pm2 save
    ```

---

## Part 2: Frontend Setup

1.  **Navigate to Project Root**
    Go to the root directory of your cloned project.

2.  **Prepare the Frontend Configuration**
    Create a `.env` file in the project root (if it doesn't exist). This is for the frontend build script.
    ```bash
    nano .env
    ```
    Add your Gemini API key:
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
    Now, run the preparation script to generate the `config.js` file for the browser.
    ```bash
    npm install # Installs dotenv for the script
    npm run prepare
    ```

---

## Part 3: Nginx Configuration

1.  **Install and Configure Nginx**
    If you don't have Nginx installed:
    ```bash
    sudo apt install nginx -y
    ```
    Create a new Nginx configuration file.
    ```bash
    sudo nano /etc/nginx/sites-available/blink-menu
    ```

2.  **Paste Nginx Configuration**
    This configuration serves the static frontend files and acts as a reverse proxy for API calls to the backend server.
    
    **Replace `your_domain.com` and `/path/to/your/project`**.
    ```nginx
    server {
        listen 80;
        server_name your_domain.com www.your_domain.com;

        # Path to the root of your frontend files
        root /path/to/your/project;
        index index.html;

        # Serve static files directly
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Reverse proxy for API calls
        # All requests to your_domain.com/api/... will be forwarded to the backend
        location /api/ {
            proxy_pass http://localhost:5000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Security and caching headers (optional but recommended)
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";

        location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2)$ {
            expires 1M;
            access_log off;
            add_header Cache-Control "public";
        }
    }
    ```

3.  **Enable the Site and Restart Nginx**
    ```bash
    sudo ln -s /etc/nginx/sites-available/blink-menu /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

4.  **(Recommended) Setup SSL with Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx -y
    sudo certbot --nginx -d your_domain.com -d www.your_domain.com
    ```
    Follow the on-screen instructions. Certbot will automatically enable HTTPS.

Your BLINK Digital Menu is now fully deployed!
