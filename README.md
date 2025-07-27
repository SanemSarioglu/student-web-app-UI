# 🎓 Student Web App UI

A modern, responsive, and feature-rich student portal built with React, TypeScript, Vite, and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Clone and Set Up the Project
```bash
# Clone the repository
 git clone <repository-url>
 cd student-web-app-UI

# Install dependencies
 npm install

# Start the development server
 npm run dev
```
- Open the provided URL in your browser (e.g., http://localhost:5173/)

### 2. Recommended VS Code Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Auto Import**
- **Bracket Pair Colorization Toggler**
- **Auto Rename Tag**
- **Auto Close Tag**

---

## ✨ Features

### 🎯 Core Capabilities
- **Dashboard:** Ongoing classes, previous semester grades, yearly performance chart
- **Course Catalog:** Filtering, search, and registration
- **My Registered Classes:** View and manage your registered classes
- **My Grades:** Grades grouped by semester, average calculation
- **Color-coded Grades:** Badges for grades 1-6
- **Yearly Grade Chart:** Interactive bar chart with Recharts
- **Confirmation Modals & Notifications:** Secure and informative popups for registration/unregistration

### 🎨 UI/UX
- **Responsive Design:** Works on mobile and desktop
- **Tailwind CSS:** Modern utility-first styling
- **Accessibility:** Full keyboard support and focus management
- **Quick Notifications:** Transient toast messages

### ⚙️ Technical Features
- **React 18 + TypeScript**
- **Fast development with Vite**
- **Testing with Jest + React Testing Library**
- **Code quality with ESLint + Prettier**

---

## 🖥️ Usage

1. **Browse Courses:** Use the "All Classes" tab to filter and register for courses.
2. **Manage Registrations:** Use "My Registered Classes" to manage your current enrollments.
3. **View Grades:** See your past and current grades in "My Grades."
4. **Dashboard:** Get an overview of your performance and ongoing classes.

---

## 🛠️ Development & Contribution

- Create your own branch, make changes, and submit a PR.
- Follow the code style and project conventions.
- If you encounter issues or want to contribute, use the Issues or Discussions tab.

---

## 🧑‍💻 Project Setup & Development Guide

### 1. Open in VS Code
- Open the project folder in VS Code (`File > Open Folder...`).
- Install the recommended extensions above.

### 2. Scaffold with Vite + React + TypeScript
```sh
npm create vite@latest .
# Select react and typescript
npm install
```

### 3. Install Tailwind CSS
```sh
npm install tailwindcss @tailwindcss/vite
```
- In your `vite.config.ts` file, add:
```ts
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```
- In your `src/index.css` file, add:
```css
@import "tailwindcss";
```

### 4. Customize the UI
- Replace the contents of `src/App.tsx` with your own UI code.
- Use Tailwind utility classes for styling.

### 5. Run the Project
```sh
npm run dev
```
- Open the provided URL in your browser.

### 6. Extra Tips
- For code formatting: `npm run format`
- For tests: `npm run test`
- For builds: `npm run build`

### 7. Troubleshooting
- If you see a blank page, check the browser console and terminal for errors.
- If Tailwind isn't working, check your import and config.
- **If your UI looks plain or lacks color:**
  - Make sure Tailwind CSS is properly configured and imported in your project.
  - Sometimes, styles may not be applied if the configuration is incorrect or the CSS is not loaded.
  - If you suspect a Tailwind setup issue, we recommend following the official [Tailwind CSS + Vite installation guide](https://tailwindcss.com/docs/guides/vite) from scratch to ensure everything is set up correctly.

---
