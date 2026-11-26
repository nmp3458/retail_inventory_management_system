# retail_inventory_management_system




npm run dev -- --port 3000
npm run dev -- --port 3001
npm run dev -- --port 3002

## JWT authentication

The server stores users in MongoDB and signs JWTs in HttpOnly cookies. Copy
`server/.env.example` to `server/.env`, set `MONGODB_URI`, and replace
`JWT_SECRET` with a random secret of at least 32 characters. On the first server
startup, `AUTH_ADMIN_EMAIL` and `AUTH_ADMIN_PASSWORD` create the initial admin
account; use a unique password of at least 12 characters. These bootstrap
credentials are only needed while the user collection is empty.

Run the server from the `server` directory and the Angular app from `client`.
The configured `CLIENT_ORIGIN` must match the browser origin (by default
`http://localhost:4200`). In production, serve both apps over HTTPS.

Command	Purpose
nginx.exe	Start NGINX
nginx.exe -t	Test configuration
nginx.exe -s reload	Reload configuration
nginx.exe -s stop	Stop immediately
nginx.exe -s quit	Gracefully stop