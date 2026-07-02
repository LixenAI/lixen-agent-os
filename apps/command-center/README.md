# LixenAI Launch Command Center

Internal launch command center for LixenAI — GHL agency launch playbook, tracker, and copy library.

**Tagline:** _You close. We build, deploy, and deliver._

---

## Deploy to Render

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Render deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/lixenai-launch-command-center.git
   git push -u origin main
   ```

2. **Create a new Web Service on Render**
   - Go to [dashboard.render.com](https://dashboard.render.com)
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Use these settings:
     - **Name:** `lixenai-launch-command-center`
     - **Runtime:** `Node`
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

3. **Deploy**
   - Render will automatically build and deploy on every push to `main`

### Option 2: Deploy from Render Blueprint

1. Push this repo to GitHub
2. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
3. Click **New Blueprint Instance**
4. Connect your repository and deploy

---

## Local Development

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

---

## Stack

- **Frontend:** React (built/bundled), Vite, TypeScript, Tailwind, shadcn/ui, wouter (hash routing)
- **Server:** Express (static file serving + SPA fallback)
- **Production backend (not included):** Next.js (App Router) on Vercel + Supabase (Postgres + Auth + RLS)

---

## Access

Demo operator token: `demo-lixen`

Enter this token on the login screen to unlock the app. This is a client-side only demo token — never paste real API keys or credentials into the login.

---

## File Structure

```
.
├── index.html          # Main HTML entry (production, no Perplexity editor script)
├── assets/             # Built JS and CSS bundles
│   ├── index-CPEC34A4.js
│   └── index-Cq1NEpB-.css
├── server.js           # Express server for Render
├── package.json        # Node dependencies
├── render.yaml         # Render Blueprint configuration
└── README.md           # This file
```
