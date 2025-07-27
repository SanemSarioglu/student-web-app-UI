Phase 1 – Student Portal UI

The primary goal of this phase is to build a responsive, web‑based Student Portal interface where users can browse courses, register/unregister classes, and track/view their grades with intuitive interactions (toasts, modals, and a custom cursor).

Core Capabilities and Requirements

### 1.1 Dashboard

Ongoing Classes

List courses for the current semester (e.g. Fall 2025).

Show “Grades Pending” status for courses without numerical grades.

Previous Semester Grades

Display courses from the last completed term (Spring 2025).

Color‑coded badges reflecting average grade (1–6 scale).

Yearly Grade Chart

Bar chart of average grade per academic year.

### 1.2 Course Catalogue

List & Filters

Show all available courses.

Filters: Department, Year, Semester Level (BA1, BA2, …), Course Code.

Registration Workflow

“Register” button with confirmation modal.

Prevent duplicate registration and show a toast notification.

“Registered” state disables the button.

### 1.3 My Registered Classes

List View

Table or card list of courses the user is enrolled in.

Click on a course name to view details.

Unregister

Unregister button opens confirmation modal.

Successful removal triggers a toast notification.

### 1.4 My Grades

Overall Average

Calculate and display the user’s cumulative average across all completed courses.

Grouped by Semester

Group courses by Year Semester (e.g. 2025 Spring).

Show each course’s overall grade with a colored badge.

Sorting & Presentation

Semesters sorted most‑recent first.

Courses sorted alphabetically within each group.

### 1.5 Class Details

Metadata Display

Course ID, name, description, professor, credits, department, semester, and level.

Navigation

“Back” button returns to My Registered Classes view.

### 1.6 UI Interactions

Confirmation Modal

Generic component for register/unregister actions.

Transient Toast Notifications

Top‑center toasts that auto‑dismiss after 3 seconds.

Custom Cursor

Small circle follows pointer; scaling on hover; color change on click.

Fallback to native cursor on touch devices.

### 1.7 Technical & Non‑Functional Requirements

Tech Stack: React 18 + TypeScript, Vite, Tailwind CSS, Recharts.

Performance: <100 ms UI response, minimize unnecessary re‑renders (use React.memo or useMemo).

Accessibility: WCAG 2.1 AA compliance, keyboard navigation, ARIA labels, visible focus states.

Code Quality: ESLint, Prettier, JSDoc comments, unit tests with Jest + React Testing Library.

Responsiveness: Mobile‑first design, optimized layouts for all screen sizes.

### 1.8 Architecture & File Structure
STUDENT-WEB-APP-UI/
├─ node_modules/
├─ public/
│  └─ vite.svg
├─ src/
│  ├─ assets/
│  │  └─ react.svg
│  ├─ App.css
│  ├─ App.tsx
│  ├─ index.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
├─ package-lock.json
├─ README.md
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ tsconfig.json
└─ vite.config.ts