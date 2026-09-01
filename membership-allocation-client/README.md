# Membership Allocation Client

An Electron application built with React and TypeScript for managing membership allocation.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

## Project Setup

### Install

```bash
yarn
```

### Development

```bash
yarn dev
```

### Build

```bash
# For Windows
yarn build:win

# For macOS
yarn build:mac

# For Linux
yarn build:linux
```

### Build for Web (Vercel)

```bash
yarn build:vite
```

---

## Environment Variables

This project uses a single critical environment variable for the backend API connection:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://membership-backend-61hb.onrender.com/api/v1` |

### Local Development

Copy `.env.example` to `.env` and set your backend URL:

```bash
cp .env.example .env
```

Then edit `.env`:

```
VITE_API_URL=https://your-backend-url.com/api/v1
```

---

## 🔴 IMPORTANT: Changing Backend Environment on Vercel

> **This is critical for production deployments.** The `VITE_API_URL` environment variable determines which backend server your deployed frontend connects to. If this is wrong, the app will fail to communicate with the backend.

### Why This Matters

- The frontend (this app) is deployed on **Vercel**
- The backend is deployed separately (e.g., on Render, Railway, or your own server)
- `VITE_API_URL` tells the frontend **where to send API requests**
- If you change backend servers, you **MUST** update this variable on Vercel, otherwise the app breaks

### Method 1: Vercel Dashboard (Recommended)

This is the easiest and most common method.

#### Step-by-Step Instructions:

1. **Log in to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with your account (GitHub, GitLab, or email)

2. **Select Your Project**
   - From the dashboard, click on the **membership-allocation-client** project (or whatever your project is named on Vercel)

3. **Open Project Settings**
   - Click on the **"Settings"** tab at the top of the project page

4. **Navigate to Environment Variables**
   - In the left sidebar, click **"Environment Variables"**

5. **⚠️ IMPORTANT: Click on the "Production" Tab First!**
   - At the top of the Environment Variables section, you will see tabs: **Production**, **Preview**, and **Development**
   - **Click on "Production"** to view and edit the production environment variables — this is the one that matters for your live app
   - Make sure you are editing the **Production** tab, not Preview or Development

6. **Find or Add `VITE_API_URL`**
   - Look for `VITE_API_URL` in the list of variables under the Production tab
   - **If it exists:** Click the **pencil icon** (✏️) next to it to edit
   - **If it doesn't exist:** Click **"Add"** to create a new one

7. **Set the Value**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-new-backend-url.com/api/v1`
   - **Environments:** Make sure **Production** is checked ✅

8. **Save Changes**
   - Click **"Save"**

9. **Redeploy Your Application** ⚠️ **This step is mandatory!**
   - Environment variables are only picked up **during build time**
   - Go to the **"Deployments"** tab
   - Click the **"⋯"** (three dots) on the latest deployment
   - Click **"Redeploy"**
   - Select **"Redeploy"** (not "Redeploy with existing Build Cache")
   - Wait for the deployment to complete

> ⚠️ **If you skip the redeploy, your app will still use the OLD environment variable!**

### Method 2: Vercel CLI (For Advanced Users)

If you prefer using the command line:

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Log in to Vercel

```bash
vercel login
```

#### Step 3: Link Your Project (first time only)

```bash
vercel link
```

Follow the prompts to select your team/scope and project.

#### Step 4: Set the Environment Variable

```bash
vercel env add VITE_API_URL production
```

When prompted, enter the new backend URL:
```
https://your-new-backend-url.com/api/v1
```

#### Step 5: Also Set for Preview and Development (Optional but Recommended)

```bash
vercel env add VITE_API_URL preview
vercel env add VITE_API_URL development
```

#### Step 6: Redeploy

```bash
vercel --prod
```

### Method 3: Using Vercel API (For Automation/CI)

If you need to automate this process (e.g., in a CI/CD pipeline):

```bash
curl -X POST "https://api.vercel.com/v9/projects/{project-id}/env" \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "VITE_API_URL",
    "value": "https://your-new-backend-url.com/api/v1",
    "type": "encrypted",
    "target": ["production", "preview", "development"]
  }'
```

---

## Common Backend URL Scenarios

| Scenario | `VITE_API_URL` Value |
|----------|---------------------|
| Render (Production) | `https://membership-backend-xxxx.onrender.com/api/v1` |
| Local Backend | `http://localhost:3000/api/v1` |
| Railway | `https://your-app.up.railway.app/api/v1` |
| Custom Domain | `https://api.yourdomain.com/api/v1` |

---

## Troubleshooting

### "Network Error" or "Failed to Fetch" in Production

1. **Check the environment variable:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `VITE_API_URL` is set correctly
   - Make sure there are no trailing slashes or spaces

2. **Redeploy after changing:**
   - Environment variables are only picked up during build time
   - You **must** redeploy after any changes

3. **Check CORS on your backend:**
   - Your backend must allow requests from your Vercel domain
   - Add `https://your-vercel-app.vercel.app` to your backend's CORS whitelist

4. **Verify the URL format:**
   - Must include `https://` (not `http://` for production)
   - Must end with `/api/v1` (or whatever your API base path is)
   - No trailing slash: `https://example.com/api/v1` ✅ NOT `https://example.com/api/v1/` ❌

### Environment Variable Not Working After Update

1. Make sure you clicked **"Save"** after editing
2. Make sure you **redeployed** (not just saved)
3. Check that the variable is assigned to the correct environment (Production, Preview, Development)

### How to Verify Which Backend You're Connected To

1. Open your deployed app
2. Open browser DevTools (F12)
3. Go to the **Network** tab
4. Perform any action (login, fetch data, etc.)
5. Check the request URL — it should start with your `VITE_API_URL`

---

## Deployment Checklist

- [ ] Backend is deployed and running
- [ ] `VITE_API_URL` is set in Vercel with correct backend URL
- [ ] Backend CORS is configured to allow your Vercel domain
- [ ] Redeployed the frontend after setting the environment variable
- [ ] Tested the connection in production

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Desktop:** Electron
- **UI Components:** Shadcn/ui + Tailwind CSS
- **State Management:** TanStack Query + Zustand
- **Routing:** TanStack Router
- **Tables:** TanStack Table
- **Deployment:** Vercel (Web) / Electron Builder (Desktop)

---

## License

MIT
