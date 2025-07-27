# Student Portal UI

A modern, responsive web-based Student Portal interface built with React 18, TypeScript, and Tailwind CSS. This application allows students to browse courses, register/unregister for classes, and track their academic performance with an intuitive and accessible user interface.

## Features

### 🎯 Core Capabilities

- **Dashboard**: Overview of ongoing classes, previous semester grades, and yearly performance charts
- **Course Catalogue**: Browse and filter available courses with registration functionality
- **My Registered Classes**: View enrolled courses with detailed information and unregister options
- **My Grades**: Track academic performance with semester grouping and grade analysis

### 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes
- **Custom Cursor**: Interactive cursor with scaling and color changes (desktop only)
- **Toast Notifications**: Auto-dismissing notifications for user feedback
- **Confirmation Modals**: Secure registration/unregistration workflows
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and ARIA labels

### 📊 Data Visualization

- **Yearly Grade Chart**: Bar chart showing average grades per academic year
- **Color-coded Grades**: Visual grade indicators using a 1-6 scale
- **Semester Grouping**: Organized grade display by academic terms

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Testing**: Jest + React Testing Library
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd student-web-app-UI
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── CustomCursor.tsx
│   ├── Modal.tsx
│   ├── Navigation.tsx
│   ├── Toast.tsx
│   └── ToastContainer.tsx
├── contexts/           # React contexts for state management
│   └── AppContext.tsx
├── pages/             # Main application pages
│   ├── Dashboard.tsx
│   ├── CourseCatalogue.tsx
│   ├── MyRegisteredClasses.tsx
│   └── MyGrades.tsx
├── types/             # TypeScript type definitions
│   └── index.ts
├── utils/             # Utility functions and mock data
│   ├── helpers.ts
│   └── mockData.ts
└── __tests__/         # Test files
```

## Key Components

### Dashboard
- Displays ongoing classes for the current semester
- Shows previous semester grades with color-coded badges
- Features a yearly grade chart using Recharts

### Course Catalogue
- Comprehensive course listing with search and filters
- Department and level-based filtering
- Registration workflow with confirmation modals

### My Registered Classes
- List view of enrolled courses
- Course details modal with comprehensive information
- Unregister functionality with confirmation

### My Grades
- Overall average calculation and display
- Semester-grouped grade organization
- Grade scale legend for reference

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Visible focus states and logical tab order
- **Color Contrast**: WCAG 2.1 AA compliant color combinations
- **Touch Device Support**: Custom cursor disabled on touch devices

## Performance Optimizations

- **React.memo**: Prevents unnecessary re-renders
- **useMemo**: Optimized calculations for expensive operations
- **Debounced Search**: Efficient search input handling
- **Lazy Loading**: Components loaded on demand
- **Optimized Bundles**: Vite for fast development and optimized builds

## Testing

The application includes comprehensive unit tests using Jest and React Testing Library:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

- **ESLint**: Code linting with React-specific rules
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and better developer experience
- **JSDoc**: Comprehensive documentation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with modern React patterns and best practices
- Designed with accessibility and user experience in mind
- Optimized for performance and maintainability
