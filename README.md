# Unlock Her Tech Website

The Unlock Her Tech website is a React-based application designed to support and showcase the initiative, providing a platform for podcasts, community resources, and more.

## Stack

- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [React](https://react.dev/) (using [SWC](https://swc.rs/))
- **Bundler:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
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
- `npm run build`: Compiles the application for production using Vite (`--target es2022`).
- `npm run build:local`: Local production build variant (same as `build`).
- `npm run lint`: Runs ESLint to check for code quality and style issues.
- `npm run preview`: Locally previews the production build.
- `npm run postinstall`: Applies local dependency patches via `patch-package`.
- `npx vitest`: Runs the test suite using Vitest.
- `npx vitest --ui`: Runs Vitest with a graphical user interface.
- `npx vitest run --coverage`: Runs tests and generates a coverage report.

## Environment Variables

For TinaCMS (content management), you need to set up the following environment variables. You can find these in your [TinaCloud Dashboard](https://app.tina.io).

1.  **Local Development**: Create a `.env` file in the root directory (based on `.env.example`) and add your keys:
    ```bash
    TINA_CLIENT_ID=your_client_id
    TINA_TOKEN=your_read_only_token
    ```
2.  **Production (Netlify)**: Add these same variables in the Netlify UI (Site configuration > Environment variables).

- `TINA_CLIENT_ID`: Your TinaCloud project Client ID.
- `TINA_TOKEN`: Your TinaCloud project Content (Read-only) Token.

### Feature Flags

Feature flags are defined in `.env` (see `.env.example`):

- `VITE_ENABLE_BLOG`: Enables/disables blog routes and blog navigation.
- `VITE_ENABLE_EVENTS`: Enables/disables events routes, events navigation, and homepage event highlights.

## Terraform State Security

If Terraform is used for infrastructure around this project, never commit Terraform state to git.

- Terraform state often contains sensitive values (tokens, passwords, provider credentials).
- This repository ignores common Terraform state and local override files via `.gitignore`.
- If a state file was ever committed, treat secrets as exposed: rotate credentials immediately and clean git history.
- Prefer an encrypted remote backend (for example, Terraform Cloud or cloud object storage with encryption + strict access controls).

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
