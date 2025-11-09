# How to Run the Delivery Management System

## 🚨 Important: CORS Error Fix

If you're seeing a CORS error, follow these steps:

## ✅ Solution: Run a Local Web Server

**You CANNOT open the HTML files directly** (double-clicking them). You must serve them through a web server.

### Option 1: Using the Included Script (Easiest)

1. Open Terminal
2. Navigate to the project folder:
   ```bash
   cd "/Users/mohammedsehweil/Desktop/Delivery Management System"
   ```
3. Run the server script:
   ```bash
   ./start-server.sh
   ```
4. Open your browser and go to:
   - http://localhost:8000/add-shipping-certificate.html
   - http://localhost:8000/add-customer.html
   - http://localhost:8000/add-project.html
   - http://localhost:8000/add-item.html

### Option 2: Using Python Directly

```bash
cd "/Users/mohammedsehweil/Desktop/Delivery Management System"
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

### Option 3: Using Node.js (if installed)

```bash
cd "/Users/mohammedsehweil/Desktop/Delivery Management System"
npx http-server -p 8000
```

Then open http://localhost:8000 in your browser.

---

## 🔧 What Was Fixed

1. ✅ Updated all API URLs from `localhost:5129` to the remote server
2. ✅ Added `mode: "cors"` to all fetch requests
3. ✅ Created a server startup script
4. ✅ **Added CORS proxy workaround** to bypass backend CORS restrictions

---

## ⚙️ Configuration (config.js)

All application settings are now centralized in the `config.js` file. You only need to edit this one file to configure the entire application!

### Current Settings:

```javascript
// API Base URL
window.__API_BASE = "https://instant-puerto-spread-cds.trycloudflare.com/Constructioncompany/api/ShipmentCertificate";

// CORS Proxy (disabled by default)
window.__USE_CORS_PROXY = false;
```

### To Change API URL:
Edit the `__API_BASE` value in `config.js`

### To Enable CORS Proxy (if you encounter CORS issues):
Change `__USE_CORS_PROXY` to `true` in `config.js`

---

## 🛡️ CORS Proxy Information

The CORS proxy workaround is **currently DISABLED** (connects directly to your API).

### When to Enable the CORS Proxy:

If you see CORS errors in the browser console, enable the proxy by setting `window.__USE_CORS_PROXY = true` in `config.js`.

### How It Works:
- When enabled, all API requests go through: `https://corsproxy.io/?https://your-api-url`
- The proxy adds the necessary CORS headers
- Your requests reach the backend successfully

---

## ⚠️ Important Notes

- **The API server must have CORS headers enabled** to work without a proxy
- The CORS proxy is a temporary workaround for development
- For production, the backend MUST be configured properly with these headers:
  ```
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Accept
  ```
- Contact the backend developer to enable CORS on the server

