<p align="center">
  <img src="assets/user.png" alt="Store It Logo" width="120" />
</p>

# Store It — File Management System

A full-stack cloud file management web application that lets users securely upload, organize, preview, share, and delete files. Built with Next.js on the frontend and Express.js on the backend, with Cloudinary as the cloud storage layer and real-time updates powered by Socket.IO.

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based access/refresh token strategy with HttpOnly cookies and automatic token rotation
- 📤 **File Upload** — Upload any file type (documents, images, audio, video, and more) up to 50 MB
- ☁️ **Cloud Storage** — Files are stored and served via Cloudinary with automatic resource type detection
- 🗂️ **File Organization** — Files are automatically categorized into Documents, Images, Media, and Others tabs
- ⚡ **Real-time Updates** — MongoDB Change Streams + Socket.IO broadcast instant file changes to all connected clients
- 🔗 **File Sharing** — Generate shareable public links for individual files without requiring login
- ✏️ **File Management** — Rename or delete files with immediate UI feedback via toast notifications
- 📊 **Storage Analytics** — Per-category storage usage stats with interactive charts (Recharts)
- 🌐 **Public Landing Page** — Browse all public files without signing in
- 🛡️ **Route Protection** — Next.js middleware guards private routes; redirects unauthenticated users to login

## 🛠️ Tech Stack

### Frontend

| Technology                                                     | Purpose                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------- |
| [Next.js 15](https://nextjs.org)                                  | React framework with App Router                               |
| [Tailwind CSS v4](https://tailwindcss.com)                        | Utility-first styling                                         |
| [Radix UI](https://radix-ui.com)                                  | Accessible UI primitives (dialogs, dropdowns, tabs, tooltips) |
| [Recharts](https://recharts.org)                                  | Storage usage charts                                          |
| [Socket.IO Client](https://socket.io)                             | Real-time file update subscriptions                           |
| [Lucide React](https://lucide.dev)                                | Icon library                                                  |
| [Sonner](https://sonner.emilkowal.ski)                            | Toast notifications                                           |
| [jose](https://github.com/panva/jose)                             | JWT verification in Next.js middleware (Edge-compatible)      |
| [react-file-icon](https://github.com/corygibbons/react-file-icon) | File type icons                                               |

### Backend

| Technology                                              | Purpose                        |
| ------------------------------------------------------- | ------------------------------ |
| [Express.js 5](https://expressjs.com)                      | HTTP API server                |
| [MongoDB + Mongoose](https://mongoosejs.com)               | Database & ODM                 |
| [Cloudinary](https://cloudinary.com)                       | Cloud file storage             |
| [Socket.IO](https://socket.io)                             | Real-time WebSocket server     |
| [Multer](https://github.com/expressjs/multer)              | Multipart file upload handling |
| [bcrypt](https://github.com/kelektiv/node.bcrypt.js)       | Password hashing               |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | JWT signing & verification     |

## 📁 Project Structure

```
File Management System/
├── BackEnd/
│   ├── config/          # Database & Cloudinary configuration
│   ├── controllers/     # Route handler logic (files, upload, user)
│   ├── middleware/      # JWT auth middleware with token rotation
│   ├── models/          # Mongoose schemas (File, User, Socket)
│   ├── routes/          # API route definitions
│   ├── utils/           # Token generation helpers
│   └── server.js        # App entry point, Socket.IO + Change Stream setup
└── Frontend/
    ├── app/
    │   ├── page.js      # Public landing page (browse all files)
    │   ├── login/       # Login page
    │   ├── signup/      # Signup page
    │   ├── user/        # Protected dashboard (upload, manage, share)
    │   └── share/       # Public file share view
    ├── components/      # Reusable UI components
    ├── hooks/           # Custom React hooks
    ├── lib/             # Utility functions
    └── middleware.js    # Next.js route protection middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [MongoDB](https://www.mongodb.com) database (Atlas or local)
- A [Cloudinary](https://cloudinary.com) account

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd BackEnd
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file based on the following variables:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ORIGINS=['http://localhost:3000']
   ```
4. Start the server:

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd Frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env.local` file:

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```
4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## 📡 API Reference

### Auth — `/api/user`

| Method   | Endpoint        | Auth      | Description                   |
| -------- | --------------- | --------- | ----------------------------- |
| `POST` | `/createuser` | Public    | Register a new user           |
| `POST` | `/login`      | Public    | Login and receive JWT cookies |
| `POST` | `/logout`     | Protected | Logout and clear cookies      |

### Files — `/api/files`

| Method     | Endpoint       | Auth      | Description                          |
| ---------- | -------------- | --------- | ------------------------------------ |
| `GET`    | `/all`       | Public    | Get all files                        |
| `GET`    | `/`          | Protected | Get files owned by the current user  |
| `PATCH`  | `/:id`       | Protected | Rename a file                        |
| `DELETE` | `/:id`       | Protected | Delete a file from Cloudinary and DB |
| `GET`    | `/share/:id` | Public    | Get a single file by ID for sharing  |

### Upload — `/api/upload`

| Method   | Endpoint | Auth      | Description                                    |
| -------- | -------- | --------- | ---------------------------------------------- |
| `POST` | `/`    | Protected | Upload a file (multipart/form-data, max 50 MB) |

## 🌍 Deployment

The frontend is configured for deployment on **Netlify** using the `@netlify/plugin-nextjs` adapter.

```toml
# Frontend/netlify.toml
[build]
command = "npm run build"
publish = ".next"
```

The backend can be deployed to any Node.js hosting platform (Render, Railway, Fly.io, etc.). Ensure your `ORIGINS` environment variable includes your deployed frontend URL.

1. **📤 Upload**: A file is POSTed to the backend as `multipart/form-data`. Multer parses it in memory, and the controller uploads it to Cloudinary with `resource_type: "auto"`, then saves metadata to MongoDB.
2. **⚡ Real-time Sync**: The backend opens a MongoDB Change Stream on the `files` collection. On any insert, update, or delete, it emits a `filesUpdated` event via Socket.IO. All connected frontend clients re-fetch their file list upon receiving this event.
3. **🔐 Auth**: On login, the server issues a short-lived access token (15 min) and a long-lived refresh token (7 days) as HttpOnly cookies. The auth middleware on the backend automatically rotates the access token when it expires, as long as the refresh token is valid.
4. **🔗 Sharing**: Each file has a unique MongoDB `_id`. The share link (`/share/:id`) calls a public API endpoint that returns the file metadata, including the Cloudinary URL, without requiring authentication.
