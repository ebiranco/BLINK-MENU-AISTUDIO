# BLINK Digital Menu - Deployment Guide

This guide provides instructions for deploying the BLINK Digital Menu application on a production server running Ubuntu 22.04.

## Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)
*   A web server like Nginx

## Deployment Steps

1.  **Clone the Repository**
    Clone the project files onto your VPS:
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install Dependencies**
    Install the necessary Node.js dependency for the configuration script.
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root of the project directory. This file will hold your Gemini API key.
    ```bash
    nano .env
    ```
    Add your API key to this file:
    ```
    API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
    ```
    Save the file (Ctrl+O, Enter) and exit (Ctrl+X).

    **Important:** Ensure the `.env` file is added to your `.gitignore` to prevent committing secrets to version control.

4.  **Prepare the Application Configuration**
    Run the preparation script. This will read the `API_KEY` from your `.env` file and create a `config.js` file that the frontend can safely use.
    ```bash
    npm run prepare
    ```
    This command generates `config.js` in the project root.

5.  **Configure Nginx to Serve the Application**
    The application is now ready to be served as a static site. We recommend using Nginx for this.

    a.  Install Nginx:
        ```bash
        sudo apt update
        sudo apt install nginx
        ```

    b.  Create an Nginx configuration file for your site:
        ```bash
        sudo nano /etc/nginx/sites-available/blink-menu
        ```

    c.  Paste the following configuration into the file. Replace `your_domain.com` with your actual domain and `/path/to/your/project` with the full path to the project directory on your server.
        ```nginx
        server {
            listen 80;
            server_name your_domain.com www.your_domain.com;

            root /path/to/your/project;
            index index.html;

            location / {
                try_files $uri $uri/ /index.html;
            }

            # Optional: Add headers for security and caching
            add_header X-Frame-Options "SAMEORIGIN";
            add_header X-XSS-Protection "1; mode=block";
            add_header X-Content-Type-Options "nosniff";

            # Cache static assets
            location ~* \.(?:css|js|jpg|jpeg|gif|png|ico|svg|woff|woff2)$ {
                expires 1M;
                access_log off;
                add_header Cache-Control "public";
            }
        }
        ```

    d.  Enable the site by creating a symbolic link:
        ```bash
        sudo ln -s /etc/nginx/sites-available/blink-menu /etc/nginx/sites-enabled/
        ```

    e.  Test your Nginx configuration and restart the service:
        ```bash
        sudo nginx -t
        sudo systemctl restart nginx
        ```

6.  **(Optional) Setup SSL with Let's Encrypt**
    For a production site, HTTPS is essential.
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your_domain.com -d www.your_domain.com
    ```
    Follow the on-screen instructions. Certbot will automatically update your Nginx configuration for SSL.

Your BLINK Digital Menu should now be live at your domain.
