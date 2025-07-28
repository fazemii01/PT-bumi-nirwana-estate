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
### `src/modules/pages/catalog`

This module is responsible for displaying the list of properties available for sale or rent. It includes components for filtering, sorting, and paginating the catalog.

-   **`components/Catalog/index.tsx`**: The main component that assembles the entire catalog page.
    -   **`Catalog` function**: This is the primary functional component that renders the catalog page. It integrates the `Meta`, `CatalogHeader`, `Filter`, and `CatalogList` components to create the complete user interface for the catalog.

-   **`components/CatalogCard/index.tsx`**: Displays a single property item in the catalog list.
    -   **`CatalogCard` function**: This component receives property data (`props`) and renders it as a card. It displays key information such as the property's image, price, address, and other features. It also handles the display of default posters if no image is available.

-   **`components/CatalogHeader/index.tsx`**: The header section of the catalog page.
    -   **`CatalogHeader` function**: This component displays the main title for the catalog page and a background image. It uses the `useMediaQuery` hook to adjust the image based on the screen size.

-   **`components/CatalogList/index.tsx`**: Manages the filtering, sorting, and display of the property list.
    -   **`CatalogList` function**: This is a complex component that fetches property data, applies filters from `CatalogContext`, and sorts the data based on user selections. It then renders the list of `CatalogCard` components and integrates the `CatalogPagination` and `CatalogSort` components.
    -   **`handlePaginationSorting` function**: A callback function that receives the paginated data and updates the component's state.
    -   **`useMemo` for `sortedDataList`**: This hook is used to memoize the filtered and sorted list of properties, which improves performance by avoiding unnecessary recalculations.

-   **`components/CatalogPagination/index.tsx`**: Handles the pagination for the catalog list.
    -   **`CatalogPagination` function**: This component calculates the total number of pages and renders the pagination controls. It allows users to navigate between pages of the catalog.
    -   **`handlePageChange` function**: Sets the current page when a user clicks on a page number.
    -   **`handlePrevBtn` and `handleNextBtn` functions**: These functions handle the logic for navigating to the previous and next pages.

-   **`components/CatalogSort/index.tsx`**: Provides options for sorting the catalog list.
    -   **`CatalogSort` function**: This component renders the sorting controls, allowing users to sort properties by price or total area. It interacts with the `CatalogContext` to update the sorting preferences.

Contains global TypeScript type definitions and interfaces used across the application.

#### `src/utils`
### `src/modules/pages/catalogPage`

This module is responsible for displaying the detailed information of a single property. It includes a variety of components to showcase the property's features, such as a photo carousel, detailed information table, map, and more.

-   **`components/CatalogPage/index.tsx`**: The main component that assembles the entire property details page.
    -   **`CatalogPage` function**: This is the primary functional component that renders the property details page. It fetches the data for a specific property based on the ID from the URL, and then integrates various sub-components to display the information. It also handles the loading and 404 states.

-   **`components/CatalogPageCarousel/index.tsx`**: Displays a carousel of images for the property.
    -   **`CatalogPageCarousel` function**: This component uses the `react-image-gallery` library to create a carousel of property images. It also handles fullscreen mode and provides custom navigation buttons.

-   **`components/CatalogPageCrumbs/index.tsx`**: Displays the breadcrumb navigation for the property details page.
    -   **`CatalogPageCrumbs` function**: This component shows the navigation path from the main page to the current property. It adapts its display for different screen sizes, showing a simplified version on smaller devices.

-   **`components/CatalogPageHeader/index.tsx`**: The header section of the property details page.
    -   **`CatalogPageHeader` function**: This component displays the property's address, price, and tags. It formats the price based on the current currency rate.

-   **`components/CatalogPageInformation/index.tsx`**: Displays the detailed information about the property.
    -   **`CatalogPageInformation` function**: This component is responsible for rendering several sections of information, including a video player (if a video is available), a table with property specifications, a description, and a map. It also includes a notice section.

-   **`components/CatalogPageMap/index.tsx`**: Displays a map showing the property's location.
    -   **`CatalogPageMap` function**: This component integrates a map to show the geographical location of the property.

-   **`components/CatalogPageNotice/index.tsx`**: A component to display a notice or alert.
    -   **`CatalogPageNotice` function**: This component is used to show important notices or disclaimers to the user.

-   **`components/CatalogPageTable/index.tsx`**: Displays a table of the property's specifications.
    -   **`CatalogPageTable` function**: This component renders a table with detailed information about the property, such as the number of rooms, total area, and other features.

-   **`components/CatalogPageVideo/index.tsx`**: Displays a video of the property.
    -   **`CatalogPageVideo` function**: This component is used to embed and play a video related to the property.

-   **`utils/formatters.ts`**: Contains utility functions for formatting data.
-   **`utils/units.ts`**: Contains units of measurement for use in the application.

A collection of utility functions that can be used anywhere in the application.
### `src/modules/pages/home`

This module contains all the components that make up the home page of the application. It is divided into several sections, each with a specific purpose.

-   **`components/Home/index.tsx`**: The main component that assembles the entire home page.
    -   **`Home` function**: This is the primary functional component that renders the home page. It integrates all the other `Home` sub-components to create the complete user interface for the home page.

-   **`components/HomeIntro/index.tsx`**: The introductory section of the home page.
    -   **`HomeIntro` function**: This component displays the main heading, a brief description, and some key statistics about the company. It also includes a set of images that are displayed differently on mobile and desktop devices.

-   **`components/HomeAdvantages/index.tsx`**: Displays the company's advantages.
    -   **`HomeAdvantages` function**: This component showcases the key benefits of working with the company. It displays a list of advantages with corresponding images and includes a "24/7" support block.

-   **`components/HomeObjectsInManagement/index.tsx`**: Displays a slider of property categories.
    -   **`HomeObjectsInManagement` function**: This component shows a carousel of different property types that the company manages. Each card in the slider links to the catalog page with the corresponding filter applied.

-   **`components/HomePartners/index.tsx`**: Displays a slider of the company's partners.
    -   **`Partners` function**: This component showcases the logos of the company's partners in a carousel. The number of logos displayed at once is adjusted based on the screen size.

-   **`components/HomeReviews/index.tsx`**: Displays customer reviews.
    -   **`HomeReviews` function**: This component shows a list of customer testimonials.

-   **`components/HomeTeam/index.tsx`**: A section dedicated to the company's team.
    -   **`HomeTeam` function**: This component introduces the team, likely with a picture and a brief description.

-   **`components/HomeWhoWeAre/index.tsx`**: A section that describes the company.
    -   **`HomeWhoWeAre` function**: This component provides a summary of the company's mission and values.
### `src/modules/common`

This module contains reusable components that are used throughout the application. These components are designed to be generic and adaptable to various contexts.

-   **`components/BlockTitle/index.tsx`**: A simple component for displaying a block-level title.
    -   **`BlockTitle` function**: This component takes a `title` and an optional `className` and renders an `h2` element with the appropriate styling.

-   **`components/Button/index.tsx`**: A versatile button component that can be rendered as a button or a link.
    -   **`Button` function**: This component can be configured with different colors, types (`button` or `link`), and an `onClick` handler. It can also include child elements, such as icons.

-   **`components/CardSlider/index.tsx`**: A flexible carousel component for displaying a series of cards.
    -   **`CardSlider` function**: This component is built on top of the `nuka-carousel` library and provides a highly customizable slider. It can be configured with different numbers of slides to show, autoplay, and custom navigation controls.

-   **`components/DefaultPoster/index.tsx`**: A placeholder component for when an image is not available.
    -   **`DefaultPoster` function**: This component displays a default poster image, which is used in places like the `CatalogCard` when a property has no images.

-   **`components/Dropdown/index.tsx`**: A dropdown menu component.
    -   **`Dropdown` function**: This component provides a customizable dropdown menu. It takes a list of options and a handler for when an option is selected. It also manages its own state, such as whether the dropdown is open or closed.

-   **`components/Filter/index.tsx`**: The main filter component used for searching and filtering properties.
    -   **`Filter` function**: This is a complex component that allows users to filter properties based on various criteria, such as contract type, city, and property type. It uses the `CatalogContext` to manage the filter state and interacts with the router to navigate to the catalog page when filters are applied.

-   **`components/InnerLink/index.tsx`**: A component for internal navigation links.
    -   **`InnerLink` function**: This component is a wrapper around the Next.js `Link` component and is used for creating internal links with consistent styling.

-   **`components/InputField/index.tsx`**: A component for creating input fields with labels.
    -   **`InputField` function**: This component is a container for input elements, providing a label and consistent styling.

-   **`components/Loader/index.tsx`**: A component to indicate loading states.
    -   **`Loader` function**: This component displays a loading spinner and can be configured to show a fullscreen loader or a smaller, described loader.

-   **`components/Logo/index.tsx`**: A component for displaying the application's logo.
    -   **`Logo` function**: This component renders the logo and links to the home page.

-   **`components/Meta/index.tsx`**: A component for managing the page's metadata.
    -   **`Meta` function**: This component uses `next/head` to set the page's title and description, which is important for SEO.

-   **`components/SwitchLanguage/index.tsx`**: A component for switching the application's language.
    -   **`SwitchLanguage` function**: This component allows users to change the language of the application. It interacts with `react-i18next` to update the current language.
### `src/modules/layout`

This module defines the overall structure of the application, including the header, footer, and the main content area.

-   **`components/Layout/index.tsx`**: The main layout component that wraps around all pages.
    -   **`Layout` function**: This component provides the basic structure for every page in the application. It includes the `Header` and `Footer`, and it wraps the page content with the necessary context providers (`HeaderContextWrapper` and `CatalogContextWrapper`).

-   **`components/Header/index.tsx`**: The header component of the application.
    -   **`Header` function**: This component displays the application's `Logo` and the main `Navigation` menu.

-   **`components/Footer/index.tsx`**: The footer component of the application.
    -   **`Footer` function**: This component displays contact information, social media links, and the copyright notice. It also includes a link to the author's website.
### `src/modules/feedback`

This module contains components related to user feedback, such as contact forms and modals.

-   **`components/Feedback/index.tsx`**: A component that displays a feedback section with a form.
    -   **`Feedback` function**: This component can be configured with a `type` prop (`owner` or `cooperation`) to display different titles, descriptions, and background images. It integrates the `FeedbackForm` component.

-   **`components/FeedbackForm/index.tsx`**: A form for users to submit their contact information and a message.
    -   **`FeedbackForm` function**: This component handles the form state, input changes, and form submission. When the form is submitted, it sends the data to a Telegram bot. It also displays a success message after the form is successfully submitted.

-   **`components/FeedbackModal/index.tsx`**: A modal window that contains a feedback form.
    -   **`FeedbackModal` function**: This component displays a modal with a feedback form. It includes a close button and handles the closing of the modal.
### `src/modules/navigation`

This module contains components related to the application's navigation, including the main navigation menu and the mobile navigation.

-   **`components/Navigation/index.tsx`**: The main navigation component.
    -   **`Navigation` function**: This component renders the main navigation menu. It displays a list of links to the main pages of the application. It also handles the mobile navigation mode, which is activated on smaller screens.

-   **`components/NavigationBurgerButton/index.tsx`**: The burger button for opening and closing the mobile navigation.
    -   **`NavigationBurgerButton` function**: This component displays a burger icon that, when clicked, toggles the mobile navigation menu. It uses the `HeaderContext` to manage the state of the mobile navigation.

-   **`components/NavigationContacts/index.tsx`**: A component that displays contact information and action buttons in the navigation.
    -   **`NavigationContacts` function**: This component shows contact icons (phone, map), a language switcher, and buttons for finding real estate and leaving a request. It also handles the opening of the `FeedbackModal`.
### `src/context`

This directory contains the React Context API providers for managing global state in the application.

-   **`CatalogContext/index.tsx`**: Manages the state of the catalog filters.
    -   **`CatalogContext`**: This context provides the `filters` object and a `handleFilters` function to all components wrapped within its provider.
    -   **`CatalogContextWrapper` function**: This component is a wrapper that provides the `CatalogContext` to its children. It manages the state of the filters and provides the `handleFilters` function to update them.

-   **`HeaderContext/index.tsx`**: Manages the state of the mobile navigation.
    -   **`HeaderContext`**: This context provides the `isMobileNavMode` boolean and a `handleMobileNavMode` function to all components wrapped within its provider.
    -   **`HeaderContextWrapper` function**: This component is a wrapper that provides the `HeaderContext` to its children. It manages the state of the mobile navigation and provides the `handleMobileNavMode` function to toggle it.
### `src/hooks`

This directory contains custom React hooks that encapsulate reusable logic.

-   **`useCatalogItemFullAddress.tsx`**: A hook for creating a full address string for a catalog item.
    -   **`useCatalogItemFullAddress` function**: This hook takes the real estate type, location, and address, and it returns a formatted string that combines this information into a full address.

-   **`useCurrencyFetching.tsx`**: A hook for fetching and managing currency exchange rates.
    -   **`useCurrencyFetching` function**: This hook fetches currency exchange rate data from the backend, parses the data to find the current rate and date, and returns these values.

-   **`useDataFetching.tsx`**: A hook for fetching and processing the main application data.
    -   **`useDataFetching` function**: This hook fetches the property data from the backend, processes it to create a structured data format, and returns the data, loading state, and initial data object.

-   **`useMediaQuery.tsx`**: A hook for detecting whether the screen size matches a given media query.
    -   **`useMediaQuery` function**: This hook takes a width in pixels and returns a boolean indicating whether the current screen width is less than or equal to the specified width.

-   **`usePropertyPhoto.tsx`**: A hook for fetching and processing property photos.
    -   **`usePropertyPhoto` function**: This hook fetches the list of photo filenames for a given property ID, sorts them, and returns a list of objects with the original and thumbnail image paths. It also identifies and includes video files.
### `src/utils`

This directory contains a collection of utility functions, constants, and other helper modules that are used across the application.

-   **`const.ts`**: This file contains a set of constant values that are used throughout the application, such as breakpoints for responsive design, the production link, and author information.

-   **`credentials.ts`**: This file stores credentials for various services, such as Google Analytics and the Telegram bot. It retrieves these values from environment variables.

-   **`data.ts`**: This file contains static data used in the application, such as company information and default currency information.

-   **`filters.ts`**: This file defines the initial state for the catalog filters.

-   **`formatters.ts`**: This file provides a set of functions for formatting data, such as translating city names and other catalog-related values.

-   **`gtag.ts`**: This file contains helper functions for interacting with Google Analytics, allowing for the tracking of pageviews and events.

-   **`meta.ts`**: This file contains metadata for the application, such as descriptions and keywords for SEO purposes.

-   **`translations.ts`**: This file contains translation maps for various parts of the application, such as city names and object information.
### `server-side`

This directory contains a simple Express.js server that provides a backend for the client application. It handles tasks such as fetching data from the database, parsing currency rates, and processing images.

-   **`main.js`**: The entry point for the server.
    -   This file initializes the Express application, sets up CORS headers, and starts the server on port 5000. It also registers the routes defined in `routes.js`.

-   **`database.js`**: Handles the database connection.
    -   **`databaseConnection` function**: This function establishes a connection to the MySQL database using a connection pool, executes a query to fetch all data from the `real_estate` table, and returns the results as a JSON response.

-   **`routes.js`**: Defines the API routes.
    -   This file sets up the routes for the server. It includes routes for fetching the list of image filenames, the main application data, and the currency exchange rates.

-   **`currencyRateParse.js`**: A script for parsing currency exchange rates.
    -   **`currencyRateParse` function**: This script uses `axios` and `cheerio` to scrape a website for currency exchange rates. It then returns the parsed data as a JSON response.

-   **`processPropertyImages.js`**: A script for processing property images.
    -   **`processPropertyFiles` function**: This script recursively reads through the `source` directory, and for each image file, it calls the `processEachImageFile` function.
    -   **`processEachImageFile` function**: This function uses the `sharp` library to add a watermark to each image and saves the processed image to the `production` directory.

-   **`processPropertyImagesList.js`**: A script for getting the list of property images.
    -   **`processPropertyImagesList` function**: This script reads the contents of a specified property folder and returns the list of filenames as a JSON response.