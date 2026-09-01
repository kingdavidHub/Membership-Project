# Role-Based Membership Allocation Application

A comprehensive desktop application for managing school membership with role-based access control, built with Electron, React, and TypeScript.

## 📋 Project Overview

The Role-Based Membership Allocation Application is a locally installed desktop system designed for schools requiring accurate record keeping, role control, and structured information access. The system operates completely offline without internet dependency, providing reliable and secure membership management.

**Project Title:** Design and Implementation of a Role-Based Membership Allocation Application

This application provides three distinct access levels:

- **Super Administrators** - Highest level of control with ability to assign/revoke administrative privileges
- **Administrators** - Moderate privileges to manage member records and operations
- **Members** - Limited access to view and edit their personal information only

## ✨ Key Features

### Role-Based Access Control

- **Three-Tier Access System**: Super Administrators, Administrators, and Members
- **Privilege Management**: Super admins can assign and revoke administrative privileges
- **Secure Authentication**: Role-based login system with session management
- **Separate Dashboards**: Custom interfaces for each user role

### Member Management

- **Member Registration**: Add and manage comprehensive member profiles
- **Biodata Management**: Members can edit their own biodata without deletion privileges
- **Dependants Management**: Track and manage member dependants
- **Membership Status**: Manage active, inactive, dormant, and deceased member records
- **Member Directory**: Advanced search, filter, and view capabilities

### Payment & Subscription Management

- **Payment Tracking**: Monitor member payments and financial records
- **Subscription Management**: Handle membership subscriptions and renewals
- **Payment History**: Detailed payment records and transaction logs
- **Financial Reports**: Generate payment-related reports and analytics

### Messaging System

- **Email Communication**: Send emails to members directly from the system
- **Birthday Notifications**: Automated birthday greetings to members
- **Bulk Messaging**: Send announcements to multiple members
- **Communication Logs**: Track all sent messages and notifications

### Reporting & Analytics

- **Member Statistics**: Comprehensive demographics and membership trends
- **Data Analytics**: Analyze membership patterns and engagement
- **Custom Reports**: Generate various reports on membership data
- **Export Functionality**: Export reports to PDF and Excel formats
- **Visual Dashboards**: Interactive charts and graphs for data visualization

### Administrative Tools

- **Record Management**: Full control over member records for administrators
- **Status Updates**: Update membership status (active, inactive, dormant, deceased)
- **Bulk Operations**: Perform operations on multiple records simultaneously
- **Activity Audit**: Track all system activities and changes

## 🛠️ Tech Stack

### Frontend

- **React** - User interface development
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Modern utility-first CSS framework for UI styling
- **Vite** - Fast build tool and development server

### Desktop Framework

- **Electron** - Cross-platform desktop application framework
- **Electron Builder** - Application packaging and distribution

### Backend & Database

- **Node.js** - JavaScript runtime environment
- **Local Database** - Embedded database for offline data storage

### Development Tools

- **Visual Studio Code** - Recommended IDE
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Git** - Version control system

## 📦 Project Structure

```
membership-allocation/
├── membership-allocation-client/     # Desktop client application
│   ├── src/
│   │   ├── main/                    # Electron main process
│   │   │   └── index.ts
│   │   ├── preload/                 # Electron preload scripts
│   │   │   ├── index.ts
│   │   │   └── index.d.ts
│   │   └── renderer/                # React UI application
│   │       ├── index.html
│   │       └── src/
│   │           ├── App.tsx
│   │           ├── main.tsx
│   │           ├── assets/
│   │           └── components/
│   ├── resources/                   # Application resources
│   ├── build/                       # Build configuration
│   ├── electron.vite.config.ts      # Vite configuration
│   ├── electron-builder.yml         # Build configuration
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   # Private repository
   git clone https://github.com/thecoder-co/Membership-Project.git
   cd membership-allocation
   ```

2. **Navigate to client directory**

   ```bash
   cd membership-allocation-client
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

**Start the development server:**

```bash
npm run dev
# or
yarn dev
```

The application will launch in development mode with hot-reload enabled.

### Building for Production

**Build for Windows:**

```bash
npm run build:win
# or
yarn build:win
```

**Build for macOS:**

```bash
npm run build:mac
# or
yarn build:mac
```

**Build for Linux:**

```bash
npm run build:linux
# or
yarn build:linux
```

The built application will be available in the `dist` directory.

## 🧪 Development Scripts

| Command               | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start development server     |
| `npm run build`       | Build the application        |
| `npm run build:win`   | Build for Windows            |
| `npm run build:mac`   | Build for macOS              |
| `npm run build:linux` | Build for Linux              |
| `npm run lint`        | Run ESLint                   |
| `npm run format`      | Format code with Prettier    |
| `npm run typecheck`   | Run TypeScript type checking |

## 💻 Recommended IDE Setup

- [Visual Studio Code](https://code.visualstudio.com/)
- [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## 🔧 Configuration

### Electron Configuration

The main Electron configuration is in `electron.vite.config.ts`. Modify this file to:

- Add custom Vite plugins
- Configure build aliases
- Adjust development server settings

### Build Configuration

Application build settings are in `electron-builder.yml`. Configure:

- Application metadata
- Platform-specific settings
- Code signing and notarization
- Auto-update configuration

## 📱 Application Features

### Super Administrator Dashboard

- Complete system control and oversight
- User role assignment and privilege management
- System-wide analytics and reports
- Administrator account management
- Global settings and configurations

### Administrator Dashboard

- Member record management (add/edit/delete)
- Membership status updates
- Payment and subscription tracking
- Report generation and analytics
- Messaging and notification system
- Dependants management
- Access to all member records

### Member Dashboard

- Personal biodata viewing and editing
- Dependants information management
- Payment history and subscription status
- Personal profile updates
- Limited to own information only (no deletion rights)

### Record Management

- **Active Members**: Current participating members
- **Inactive Members**: Temporarily inactive member records
- **Dormant Members**: Long-term inactive members
- **Deceased Members**: Memorial records management

## 🌐 Web Deployment (Vercel)

The frontend can also be deployed as a web application on **Vercel**. When deploying, the critical environment variable is `VITE_API_URL`, which tells the frontend where to send API requests.

### Building for Vercel

```bash
cd membership-allocation-client
yarn build:vite
```

---

## 🔴 IMPORTANT: Changing Backend Environment on Vercel

> **This is critical for production deployments.** The `VITE_API_URL` environment variable determines which backend server your deployed frontend connects to. If this is wrong, the app will fail to communicate with the backend.

### Why This Matters

- The frontend is deployed on **Vercel**
- The backend is deployed separately (e.g., on Render, Railway, or your own server)
- `VITE_API_URL` tells the frontend **where to send API requests**
- If you change backend servers, you **MUST** update this variable on Vercel, otherwise the app breaks

### How to Change `VITE_API_URL` on Vercel

#### Step-by-Step Instructions (Vercel Dashboard):

1. **Log in to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign in with your account (GitHub, GitLab, or email)

2. **Select Your Project**
   - From the dashboard, click on your **Membership Allocation** project

3. **Open Project Settings**
   - Click on the **"Settings"** tab at the top of the project page

4. **Navigate to Environment Variables**
   - In the left sidebar, click **"Environment Variables"**

5. **⚠️ Click on "Production" to See the Environment Variables**
   - At the top of the Environment Variables section, you will see tabs: **Production**, **Preview**, and **Development**
   - **Click on "Production"** to view and edit the production environment variables — this is the one that matters for your live app
   - Make sure you are editing the **Production** tab, not Preview or Development

6. **Find or Add `VITE_API_URL`**
   - Look for `VITE_API_URL` in the list of variables
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

### Common Backend URL Values

| Scenario | `VITE_API_URL` Value |
|----------|---------------------|
| Render (Production) | `https://membership-backend-xxxx.onrender.com/api/v1` |
| Local Backend | `http://localhost:3000/api/v1` |
| Railway | `https://your-app.up.railway.app/api/v1` |
| Custom Domain | `https://api.yourdomain.com/api/v1` |

### Troubleshooting

- **"Network Error" in production?** Check Vercel → Settings → Environment Variables → make sure `VITE_API_URL` is correct and assigned to **Production**
- **Changed the URL but nothing happened?** You **must redeploy** after changing environment variables
- **CORS errors?** Make sure your backend allows requests from your Vercel domain (e.g., `https://your-app.vercel.app`)
- **How to verify which backend you're connected to?** Open your deployed app → DevTools (F12) → Network tab → perform an action → check the request URL

### Deployment Checklist

- [ ] Backend is deployed and running
- [ ] `VITE_API_URL` is set in Vercel with correct backend URL
- [ ] Backend CORS is configured to allow your Vercel domain
- [ ] Redeployed the frontend after setting the environment variable
- [ ] Tested the connection in production

---

## 🔐 Security Features

- **Role-Based Access Control (RBAC)**: Three-tier permission system
- **Secure Authentication**: Protected login system for all user roles
- **Data Encryption**: Local data encryption at rest
- **Privilege Management**: Controlled administrative privilege assignment
- **Activity Audit Logging**: Complete tracking of all system activities
- **Session Management**: Secure session handling and timeout
- **Access Restrictions**: Members cannot delete records or access others' data
- **Offline Security**: No internet dependency eliminates online vulnerabilities


## 📝 Project Status

This project is currently in active development. The desktop application is being built to provide:

- Reliable offline operation without internet dependency
- Secure role-based membership management
- Efficient data organization and administration
- Practical demonstration of modern web technologies adapted for desktop use

## 🎯 Significance

This project demonstrates the practical application of role-based access control in a real-world school administrative system. It provides:

- A reliable membership management solution without internet dependency
- Enhanced data organization, security, and administration processes
- A scholarly example of converting modern web technologies into secure offline desktop applications
- Efficient tools for schools to manage their membership data locally

## 📚 Methodology

The development follow's a structured software development approach:

1. Requirements analysis and system specification
2. System design (database and user interface)
3. Frontend development using React
4. Role-based access control and business logic implementation
5. Electron integration for desktop packaging
6. Reporting, analytics, and messaging features implementation
7. Comprehensive testing, debugging, and validation
8. Complete system documentation
