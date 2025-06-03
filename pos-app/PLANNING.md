# 🧭 PLANNING.md

## 📌 Project Overview

This is a **Point-of-Sale (POS) desktop application** built using:
- **Electron** for desktop app capabilities
- **React + TypeScript** for front-end development
- **Tailwind CSS** for styling
- **Express + MongoDB** for the backend (REST API)

---

## 📁 Folder Structure & Responsibilities

| Folder/File             | Description |
|-------------------------|-------------|
| `src/`                  | Main React frontend code (components, hooks, pages) |
| `server/`               | Backend Express server with MongoDB integration |
| `electron/`             | Electron main process logic (app initialization, IPC communication) |
| `dist-electron/`        | Auto-generated Electron build output |
| `public/`               | Static assets for the front end |
| `components.json`       | Configuration or metadata for components (if used) |
| `electron-builder.json5` | Configuration for packaging the app using electron-builder |
| `tailwind.config.js`    | Tailwind CSS configuration |
| `tsconfig.json`         | TypeScript config for frontend |
| `tsconfig.node.json`    | TypeScript config for backend |
| `vite.config.ts`        | Vite configuration for the frontend |
| `.eslintrc.cjs`         | ESLint configuration |
| `README.md`             | General project documentation |
| `yarn.lock`             | Dependency lock file |

---

## 🎯 Goals

- Offline-first POS system with local data persistence
- Seamless sync capability with cloud MongoDB (future scope)
- Barcode scanning (physical scanner and camera)
- Modular and scalable codebase
- Secure and robust data handling (transactions, inventory, customers)

---

## 📐 Architecture Guidelines

### Frontend (`src/`)
- Framework: React + TypeScript + Tailwind
- Routing: `react-router-dom` (if multi-page)
- State: React hooks (consider Zustand/Redux if needed)
- Component reusability is prioritized
- Custom hooks live in `src/hooks`
- Page views live in `src/pages`
- UI components in `src/components`
- Common types/interfaces in `src/types`
- API communication handled through `src/services`

### Backend (`server/`)
- Framework: Express.js
- Database: MongoDB (via Mongoose or native driver)
- API endpoints for:
  - Authentication
  - Products
  - Transactions
  - Users
- Folder structure (inside `server/`):
  ```
  server/
    ├── controllers/
    ├── routes/
    ├── models/
    ├── middleware/
    └── utils/
  ```

### Electron (`electron/`)
- Initializes the Electron window
- Handles IPC communication between main and renderer processes
- Auto-update and file system access handled here

---

## 🧱 Conventions

- **Max 500 lines per file**: Split into modules if longer
- **TypeScript** used project-wide
- **JSDoc-style comments** for all functions
- **Follow Prettier** formatting via `.eslintrc.cjs`
- **Use relative imports** within `src/`

---

## 📦 Services Overview

| Service     | Path                  | Notes |
|-------------|-----------------------|-------|
| Product API | `server/routes/products.ts` | CRUD for products |
| Orders API  | `server/routes/orders.ts` | POS transactions |
| Auth API    | `server/routes/auth.ts` | Optional JWT login |
| Barcode     | Custom logic in Electron or Camera SDK |

---

## 📑 TODOs and Planning Files

- All current and upcoming tasks listed in `TASK.md`
- Major architecture decisions and future roadmap updated here in `PLANNING.md`
- Discovered issues or features logged under “Discovered During Work” section in `TASK.md`
