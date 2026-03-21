# Unlock Her Tech Website

The Unlock Her Tech website is a React-based application designed to support and showcase the initiative, providing a platform for podcasts, community resources, and more.

## Stack

- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [React 19](https://react.dev/) (using [SWC](https://swc.rs/))
- **Bundler:** [Vite 7](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Library:** [Radix UI](https://www.radix-ui.com/) (customized via [shadcn/ui](https://ui.shadcn.com/))
- **Package Manager:** npm
- **Testing:** [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting:** [ESLint 9](https://eslint.org/)

## Requirements

- [Node.js](https://nodejs.org/) (latest LTS recommended, v20+)
- npm (typically bundled with Node.js)

## Setup & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/unlockhertech/unlockhertech-fe.git
   cd unlockhertech-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## Scripts

- `npm run dev`: Starts the Vite development server with HMR.
- `npm run build`: Runs TypeScript type checking (`tsc -b`) and compiles the application for production using Vite.
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run preview`: Locally previews the production build.
- `npx vitest`: Runs the test suite using Vitest.
- `npx vitest --ui`: Runs Vitest with a graphical user interface.
- `npx vitest run --coverage`: Runs tests and generates a coverage report.

## Environment Variables

Currently, no specific environment variables are required for the project to run.
- TODO: Add instructions for `.env` if API keys or other secrets are added in the future.

## Tests

The project uses **Vitest** for unit and component testing.

- **Run tests:** `npx vitest`
- **Run tests in UI mode:** `npx vitest --ui`
- **Run tests with coverage:** `npx vitest run --coverage` (uses `v8` provider)

Tests are located in `src/test/` (e.g., `src/test/HomePage.test.tsx`).

## Project Structure

```text
unlockhertech-fe/
├── public/              # Static assets (favicons, etc.)
├── src/                 # Source code
│   ├── app/             # Application core
│   │   ├── components/  # React components (including /ui for shadcn)
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components (Home, About, etc.)
│   │   ├── App.tsx      # Main application component
│   │   ├── routes.ts    # Route definitions
│   │   └── data.tsx     # Static data/constants
│   ├── assets/          # Images and project-specific assets
│   ├── imports/         # SVG illustrations
│   ├── styles/          # CSS files (Tailwind, theme, etc.)
│   ├── test/            # Global test setup and test files
│   └── main.tsx         # React entry point
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template (Vite entry point)
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite and Vitest configuration
```

## License

- TODO: Specify the license (e.g., MIT, Apache 2.0).
