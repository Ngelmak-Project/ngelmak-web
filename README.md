# NgelmakWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, we can navigate to `http://localhost:4200/`. The application will automatically reload whenever modification is made on any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile the project and store the build artifacts in the `dist/` directory. By default, the production build optimizes the application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

Perfect — now that you want:

- **Angular served at** `https://ngelmak.org`
- **Gateway served at** `https://api.ngelmak.org`
- **Nginx itself terminating HTTPS**
- **Cloudflare still in front (Full or Full Strict)**

…we can build a clean, production‑grade setup.

Below is a fully documented Nginx configuration and the reasoning behind every part. This will give you a secure, maintainable architecture.

---

# 🌐 Final Architecture Overview

```
Browser (HTTPS)
   ↓
Cloudflare (proxy + SSL Full/Strict)
   ↓
Nginx (HTTPS termination)
   ↓
Spring Gateway (HTTP or HTTPS)
```

### Why this is good

- Angular and API are cleanly separated by subdomains.
- No mixed content.
- No need for Angular to proxy through the same Nginx.
- Nginx handles HTTPS directly using a certificate (Let’s Encrypt or Cloudflare Origin Cert).
- Cloudflare adds DDoS protection, caching, and hides the server IP.

---

# 📁 File Structure

```
/nginx
   ├── nginx.conf
   ├── ssl/
   │     ├── ngelmak.org.pem
   │     └── ngelmak.org.key
   ├── Dockerfile
```

You can use **Cloudflare Origin Certificates** (recommended) or **Let’s Encrypt**.

---

# 🛠️ Nginx Configuration (Fully Documented)

This config assumes:

- Angular served at `ngelmak.org`
- API served at `api.ngelmak.org`
- Gateway reachable at `http://gateway:8080` inside Docker

Create `nginx.conf`:

```nginx
# -------------------------------------------------------
# 🌐 HTTPS Server for Angular Frontend (ngelmak.org)
# -------------------------------------------------------
server {
    listen 443 ssl http2;
    server_name ngelmak.org;

    # SSL certificates (Cloudflare Origin Cert or Let's Encrypt)
    ssl_certificate     /etc/nginx/ssl/ngelmak.org.pem;
    ssl_certificate_key /etc/nginx/ssl/ngelmak.org.key;

    # Recommended security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Root folder for Angular build
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback — Angular handles routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# -------------------------------------------------------
# 🔌 HTTPS Server for API (api.ngelmak.org)
# -------------------------------------------------------
server {
    listen 443 ssl http2;
    server_name api.ngelmak.org;

    ssl_certificate     /etc/nginx/ssl/api.ngelmak.org.pem;
    ssl_certificate_key /etc/nginx/ssl/api.ngelmak.org.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # Proxy all requests to Spring Cloud Gateway
    location / {
        proxy_pass http://gateway:8080;

        # Forward client info
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}

# -------------------------------------------------------
# 🔁 Redirect all HTTP traffic to HTTPS
# -------------------------------------------------------
server {
    listen 80;
    server_name ngelmak.org api.ngelmak.org;
    return 301 https://$host$request_uri;
}
```

---

# 🧱 Dockerfile (Updated for HTTPS)

```dockerfile
FROM nginx:alpine AS runner

# Copy Angular build
COPY --from=builder /app/dist/ngelmak-web/browser /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates
COPY ssl /etc/nginx/ssl

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```
