# Client Application Documentation

This document provides a comprehensive overview of the client-side application's structure, modules, and key components.

## Project Structure

The client application is a Next.js project. The structure is organized to promote modularity and scalability.

```
/
├── .vscode/                  # VSCode settings
├── public/                   # Static assets (images, fonts, etc.)
│   ├── assets/
│   └── locales/              # Internationalization (i18n) files
├── server-side/              # Server-side scripts for data processing
├── src/                      # Application source code
│   ├── assets/               # Icons and global styles
│   ├── context/              # React Context API providers
│   ├── hooks/                # Custom React hooks
│   ├── modules/              # Core application modules
│   │   ├── common/           # Reusable components (Button, Input, etc.)
│   │   ├── feedback/         # Components for user feedback (forms, modals)
│   │   ├── layout/           # Layout components (Header, Footer, etc.)
│   │   ├── navigation/       # Navigation components (menu, breadcrumbs)
│   │   └── pages/            # Page-specific modules and components
│   ├── pages/                # Next.js pages (routes)
│   ├── types/                # Global TypeScript types and interfaces
│   └── utils/                # Utility functions
├── .eslintrc.json            # ESLint configuration
├── next.config.js            # Next.js configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # This file
```

## Folder and File Explanations

### Root Directory

-   **`.eslintrc.json`**: Configuration for ESLint, a tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
-   **`next.config.js`**: The configuration file for Next.js.
-   **`package.json`**: Lists the project's dependencies and defines scripts for running, building, and testing the application.
-   **`ni18n.config.ts`**: Configuration file for internationalization (i18n).
-   **`prettier.config.js`**: Configuration for Prettier, a code formatter.

### `public`

This directory contains static assets that are publicly accessible.

-   **`assets/`**: Contains images, icons, and other static resources.
-   **`locales/`**: Contains JSON files for different languages (en, ru, ua) to support internationalization.

### `server-side`

This directory contains Node.js scripts that are likely used for data processing or other server-related tasks that support the main application.

-   **`currencyRateParse.js`**: A script to parse currency rates.
-   **`database.js`**: Database-related configurations or utilities.
-   **`main.js`**: A main script, possibly an entry point for a server-side process.
-   **`processPropertyImages.js`**: Scripts for processing property images.
-   **`routes.js`**: Route definitions for the server-side scripts.

### `src`

This is the main directory for the application's source code.

#### `src/assets`

-   **`icons/`**: Contains SVG icons used throughout the application, organized as React components.
-   **`styles/`**: Global styles, variables, and mixins.

#### `src/context`

-   **`CatalogContext/`**: Manages state related to the property catalog, such as filters and sorting.
-   **`HeaderContext/`**: Manages state related to the header, such as its visibility or appearance.

#### `src/hooks`

This directory contains custom React hooks that encapsulate reusable logic.

#### `src/modules`

This is the core of the application, where the UI and business logic are organized into modules.

-   **`common/`**: Contains widely-used, generic components like `Button`, `InputField`, `Logo`, etc.
-   **`feedback/`**: Components related to gathering user feedback, such as contact forms and modals.
-   **`layout/`**: Components that define the overall structure of the application, including `Header`, `Footer`, and the main `Layout` component.
-   **`navigation/`**: Components for navigating the site, like the main `Navigation` bar and mobile navigation elements.
-   **`pages/`**: This directory contains modules that are specific to a particular page. Each subdirectory corresponds to a page and contains all the components that make up that page.
    -   **`home/`**: Components for the home page (`HomeIntro`, `HomeAdvantages`, etc.).
    -   **`catalog/`**: Components for the property listing page (`CatalogList`, `CatalogCard`, `Filter`, etc.).
    -   **`catalogPage/`**: Components for the individual property details page (`CatalogPageCarousel`, `CatalogPageInformation`, etc.).
    -   **`services/`**: Components for the services page.
    -   **`page404/`**: Components for the 404 Not Found page.

#### `src/pages`

This directory is used by Next.js to define the application's routes. Each file or directory here maps to a URL. For example, `src/pages/catalog/index.tsx` corresponds to the `/catalog` route.

#### `src/types`

Contains global TypeScript type definitions and interfaces used across the application.

#### `src/utils`

A collection of utility functions that can be used anywhere in the application.