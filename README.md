# Membership Allocation System

A comprehensive desktop application for managing church membership allocation and tracking, built with Electron, React, and TypeScript.

## 📋 Project Overview

The Membership Allocation System is designed to streamline the management of church members across different units, departments, and service groups. This application provides an intuitive interface for administrators to allocate members, track attendance, manage service assignments, and generate reports.

## ✨ Key Features

### Member Management

- **Member Registration**: Add and manage member profiles with detailed information
- **Member Directory**: Search, filter, and view member lists
- **Profile Management**: Update member information, contact details, and status

### Allocation System

- **Unit Allocation**: Assign members to specific church units
- **Department Assignment**: Allocate members to departments based on skills and interests
- **Service Group Management**: Organize members into service groups and teams
- **Dynamic Reallocation**: Transfer members between units and departments

### Attendance Tracking

- **Service Attendance**: Track member attendance at various church services
- **Meeting Records**: Monitor attendance at department and unit meetings
- **Attendance Reports**: Generate attendance statistics and reports

### Reporting & Analytics

- **Member Statistics**: View demographics and membership trends
- **Allocation Reports**: Generate reports on member distribution across units
- **Attendance Analysis**: Analyze attendance patterns and engagement levels
- **Export Functionality**: Export reports to PDF and Excel formats

### User Management

- **Role-Based Access**: Different access levels for administrators and staff
- **User Authentication**: Secure login and user management
- **Activity Logs**: Track system activities and changes

## 🛠️ Tech Stack

### Frontend

- **Electron** - Desktop application framework
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Build tool and development server

### Development Tools

- **Electron Vite** - Electron build tooling
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Electron Builder** - Application packaging and distribution

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

### Dashboard

- Quick overview of membership statistics
- Recent activities and updates
- Quick access to common tasks

### Member Management Module

- Add/Edit/Delete member records
- Advanced search and filtering
- Bulk operations support
- Member status management

### Allocation Module

- Visual allocation interface
- Drag-and-drop support
- Bulk allocation tools
- Allocation history tracking

### Reports Module

- Pre-defined report templates
- Custom report builder
- Export to multiple formats
- Scheduled report generation

## 🔐 Security Features

- Secure authentication system
- Role-based access control
- Data encryption at rest
- Activity audit logging
- Session management

## 🌐 Future Enhancements

- [ ] Cloud synchronization
- [ ] Mobile companion app
- [ ] SMS and email notifications
- [ ] Advanced analytics dashboard
- [ ] Integration with church management systems
- [ ] Multi-language support
- [ ] Offline mode with sync

## 📄 License

This project is part of an academic project proposal. Please refer to the project proposal document for more details.

## 👥 Contributors

- **Project ID**: 210805502
- **Repository**: [thecoder-co/Membership-Project](https://github.com/thecoder-co/Membership-Project)

## 📞 Support

For issues, questions, or contributions, please:

1. Check existing issues on GitHub
2. Create a new issue with detailed information
3. Follow the contribution guidelines

## 📝 Project Status

This project is currently in active development. The client application provides the foundation for the membership allocation system with plans for backend integration and additional features.

---

**Built with ❤️ for efficient church membership management**
