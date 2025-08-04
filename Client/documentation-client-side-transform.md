# Project Documentation: Aligning Client and Server (Client-Side Transformation)

This document outlines the necessary steps to align the Next.js client with the NestJS server by performing all data transformations on the client side, without modifying the server's code.

## 1. Update Client Configuration to Point to the Correct Server

The first step is to ensure the client application is communicating with the NestJS backend.

- **File to Modify:** `Client/src/utils/const.ts`
- **Change:** The `BACKEND_LOCALHOST` constant must be updated to point to the NestJS server's port (e.g., `http://localhost:3000`) instead of the old Express server's port (`5000`).

## 2. Refactor the Data Fetching and Transformation Logic

The core of the work is to update the client's data fetching hook to understand the data structure of the NestJS API.

- **File to Modify:** `Client/src/hooks/useDataFetching.tsx`
- **Changes:**
    1. **Update Fetch URL:** The `fetch` call will be changed from `/data` to `/properties` to hit the correct endpoint on the NestJS server.
    2. **Implement New Transformation Logic:** The `sortData` function inside the hook will be completely rewritten. Its new responsibility is to map the array of `Property` objects received from the server to the `ICatalogData` interface that the client's components are built to work with. This involves:
        - Converting the `id` from a `string` to a `number` (or handling the mismatch).
        - Converting the `price` from a `number` to a `string`.
        - Deriving the `visibility` boolean from the server's `status` enum.
        - Mapping the server's `description`, `address`, `location`, and `specifications` fields to the client's expected nested object structure (`description`, `address`, `location`, `table`).
        - Providing placeholder or default values for fields that exist on the client but not the server (e.g., `contractType`, `propertyType`, `city`).

This approach isolates all the necessary changes within the client application, allowing it to work with the existing server API without requiring any backend modifications.