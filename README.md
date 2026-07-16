
# Portfolio Management System

A full-stack portfolio management system built with the MERN stack (MongoDB, Express, React, Node.js). Create, manage, and preview your professional portfolio from a clean admin dashboard. Share a public live preview link that anyone can view like a resume — no login required.

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Database | MongoDB (Atlas) | Stores users, projects, skills |
| Backend | Express.js | REST API with JWT authentication |
| Backend | Node.js | Server runtime |
| Frontend | React 18 + Vite | User interface with React Router |
| Styling | CSS Variables | Custom design system |
| File Uploads | Multer | Image handling with size limits |
| Authentication | JWT + bcrypt | Secure cookie-based auth |
| Icons | Font Awesome 6 | Professional iconography |

## Project Structure

```
portfolio/
├── README.md
├── server/
│   ├── package.json
│   ├── .env
│   ├── server.js
│   ├── render.yaml
│   ├── railway.json
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   ┃── Skill.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── projectController.js
│   │   ├── skillController.js
│   │   └── uploadController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── projectRoutes.js
│   ├── skillRoutes.js
│   │   └── uploadRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── jwt.js
│   └── uploads/
│       └── (images stored here locally)
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   ├── AuthContext.jsx
        │   ─── NotificationContext.jsx
        ├── components/
        │   ├── Layout.jsx
        │   ├── Sidebar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── LoadingSpinner.jsx
        │   ├── EmptyState.jsx
        │   ├── ConfirmDialog.jsx
        │   └── BackgroundAnimation.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            ├── Dashboard.jsx
            ├── Profile.jsx
            ├── Projects.jsx
            ├── ProjectForm.jsx
            ├── Skills.jsx
            ├── SkillForm.jsx
            ├── Preview.jsx
            └── PublicPreview.jsx

```


## Prerequisites

- **Node.js** v18+
- **npm** v9+
- **MongoDB Atlas** (free tier works)
- **Git** and a **GitHub** account
- **Vite** (installed automatically by npm)
- A code editor (VS Code recommended)



## Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/portfolio-management-system.git
cd portfolio
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `server/.env` with your configuration:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173


Make sure **MongoDB** is running locally:
```bash
mongod
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
npm run dev
```

The app runs at **http://localhost:5173**



## Environment Variables

| Variable | Local Value | Production Value |
|---------|------------|-----------------|
| `PORT` | `5000` | `5000` |
| `MONGO_URI` | `mongodb://localhost:27017/portfolio_db` | `mongodb+srv://user:pass@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority` |
| `JWT_SECRET` | Any string | A long random string |
| `JWT_EXPIRE` | `7d` | `7d` |
| `NODE_ENV` | `development` | `production` |
| `CLIENT_URL` | `http://localhost:5173` | `https://your-app.vercel.app` |

---

## API Documentation

### Authentication

| Method | Endpoint | Auth Required | Description |
|--------|----------|-------------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and get JWT cookie |
| GET | `/api/auth/me` | Yes | Get current user data |
| POST | `/api/auth/logout` | Yes | Clear JWT cookie |
| GET | `/api/health` | No | Health check endpoint |

### Profile

| Method | Endpoint | Auth Required | Description |
|--------|----------|-------------|-------------|
| GET | `/api/profile` | Yes | Get profile data |
| PUT | `/api/profile` | Yes | Update profile fields |
| PUT | `/api/profile/password` | Yes | Change password |
| DELETE | `/api/profile` | Yes | Delete account |

### Projects

| Method | Endpoint | Auth Required | Description |
|--------|----------|-------------|-------------|
| GET | `/api/projects` | Yes | List all projects (supports ?status, ?page, ?limit, ?sort) |
| GET | `/api/projects/stats` | Yes | Get project statistics (aggregate) |
| GET | `/api/projects/:id` | Yes | Get single project by ID |
| POST | `/api/projects` | Yes | Create a new project |
| PUT | `/api/projects/:id` | Yes | Update a project |
| DELETE | `/api/projects/:id` | Yes | Delete a project and its images |

### Skills

| Method | Endpoint | Auth Required | Description |
|--------|----------|-------------|-------------|
| GET | `/api/skills` | Yes | List all skills (supports ?category, ?sort) |
| GET | `/api/skills/categories` | Yes | Get all unique skill categories |
| GET | `/api/skills/:id` | Yes | Get single skill by ID |
| POST | `/api/skills` | Yes | Create a skill |
| PUT | `/api/skills/:id` | Yes | Update a skill |
| DELETE | `/api/skills/:id` | Yes | Delete a skill |
| DELETE | `/api/upload` | Yes | Delete a file from server |

### File Upload

| Method | Endpoint | Auth Required | Description |
|--------|----------|-------------|-------------|
| POST | `/api/upload/image` | Yes | Upload single image (max 5MB) |
| POST | `/api/upload/images` | Yes | Upload multiple images (max 5 files, max 5MB each) |

**Response format for image upload:**
```json
{ "url": "/uploads/abcdef1234567890-image.jpg", "filename": "abcdef1234567890-image.jpg" }
```

### Public (No auth required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/portfolio/:userId` | Get full portfolio data for live preview |



## Features

### Authentication
- Register / Login with JWT stored in httpOnly cookies
- Auto-redirect to login when token expires
- Password hashed with bcryptjs (12 salt rounds)
- Protected routes with middleware

### Dashboard
- 4 animated stat cards (Total, Completed, In Progress, Featured) with gradient backgrounds
- SVG donut chart (project status breakdown)
- Bar chart (skills by category)
- Recent activity feed
- Quick action buttons
- Top 5 skills with progress bars
- Projects table with status badges and tech tags

### Profile Management
- Avatar upload / replace / delete from server
- General: name, title, location, bio
- Social links: GitHub, LinkedIn, Twitter, Website
- Change password with current password verification
- Delete account permanently

### Project Management
- Full CRUD operations
- Multi-image upload with preview grid
- Tech stack tags with brand colors (React=cyan, Node=green, MongoDB=green, etc.)
- Status filter: All, Completed, In Progress, Planned
- Featured toggle
- Grid and List view toggle
- GitHub and Live Demo link buttons
- Edit and delete with confirmation dialog

### Skills Management
- Create / Edit / Delete skills
- Categorized with color-coded proficiency bars
- Draggable proficiency slider
- Color picker with presets and custom color input
- Display order control
- Category grouping

### Live Preview
- **Admin preview** (requires login) — `/preview`
- **Public preview** (no login needed) — `/p/:userId`
- Clean resume-style layout
- Hero section with avatar, name, title, bio, location, email
- Skills grouped by category with gradient progress bars
- Project cards with images, status badges, tech tags, live/code buttons
- Print / PDF button that opens a clean print-friendly window
- Empty state if no data

### Background Animation
- Canvas-based particle system with mouse interaction
- Floating geometric shapes (circles, rings, triangles, squares, crosses)
- Gradient color orbs
- Particle connection lines near cursor
- Mouse repel effect
- Works on every page

### UX / UI
- Toast notifications (success, error, warning, info) with auto-dismiss
- Loading spinners on every data fetch
- Empty states for tables and sections
- Confirmation dialogs for destructive actions (light frosted glass overlay, no black background)
- Form validation with inline error messages
- Responsive design with mobile sidebar drawer
- Smooth animations and hover effects throughout



## Deployment

### Database — MongoDB Atlas (Free Tier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create a database user (remember the password)
4. Add your IP address (or "Allow Access from Anywhere" for production)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority`

### Backend — Fly.io (Free, no credit card)

1. Go to https://fly.io
2. Sign up with GitHub (no credit card needed)
3. Create new app → "Clone existing repository"
4. Select your repo → set Root Directory to `server`
5. Set environment variables (PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRE, NODE_ENV, CLIENT_URL)
6. Deploy and copy the URL (like `https://portfolio-api.fly.dev`)
```
### Frontend — Vercel (Free)

1. Go to https://vercel.com
2. Import your GitHub repo
3. Set Root Directory to `client`
4. Framework preset: Vite
5. Add rewrites (proxy /api and /uploads to backend URL)
6. Deploy and copy the URL (like `https://portfolio-xxxx.vercel.app`)

### Vercel `vercel.json`:
json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://portfolio-api.fly.dev/api/$1" },
    { "source": "/uploads/(.*)", "destination": "https://portfolio-api.fly.dev/uploads/$1" },
    { "source": "/p/:path*", "destination": "/index.html" },
    { "source": "/((?!api|uploads|assets|p).*)", "destination": "/index.html" }
  ]
}
```
### Important Notes

- **MongoDB Atlas**: Keep set to "Allow Access from Anywhere" so both local and Fly.io can connect
- **Environment Variables**: CLIENT_URL must match your Vercel URL exactly (no trailing slash)
- **Images**: Free tier services have ephemeral storage — uploaded images are lost on redeploy. For persistent storage, upgrade the backend service or use Cloudinary
- **CORS**: The backend handles CORS based on CLIENT_URL environment variable
- **Cookies**: JWT is stored in httpOnly cookies for security
- **Production**: NODE_ENV must be set to `production` on the backend


## Common Issues & Solutions

### "SyntaxError: Identifier 'path' has already declared"
You have `import path from 'path'` duplicated in `server.js`. There must be only ONE line with this import at the top. Delete the duplicate.

### "Login failed" on Vercel
The CLIENT_URL in Vercel env vars should be `/api` (not the full backend URL). Vite proxy handles routing.

### "Invalid credentials"
Make sure you're using the correct password and that bcrypt is working in production.

### Images not loading on deployed version
Free hosting services use ephemeral storage. Images are lost on every redeploy. For persistent storage, use Cloudinary for images.

### Port 5000 already in use
Something else is using port 5000. Kill that process or use a different port.


## Development

### Run backend locally:
bash
cd server
npm run dev

### Run frontend locally:
bash
cd client
npm run dev

```
### Run both at once (2 terminals):
bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

## License

MIT License — free to use for personal and educational purpose.


