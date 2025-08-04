# Project Documentation: Aligning Client and Server

This document outlines the necessary steps to align the Next.js client with the NestJS server without modifying the existing database schema.

## 1. Create a Data Transfer Object (DTO)

A new DTO will be created in the `serve/src/properties` directory. This DTO will define the data structure that the client expects and will be used to transform the `Property` entity before it is sent over the API.

## 2. Create a New API Endpoint

A new endpoint, `/properties/client-formatted`, will be added to the `PropertiesController`. This endpoint will be responsible for:
- Fetching all properties from the database.
- Mapping the `Property` entities to the new DTO.
- Returning the data in a format that the client can consume directly.

## 3. Update the Client's Data Fetching

The `useDataFetching.tsx` hook in the client application will be updated to:
- Fetch data from the new `/properties/client-formatted` endpoint on the NestJS server.
- Remove the outdated data transformation logic, as the data will now be received in the correct format.

## 4. Update Client Configuration

The `BACKEND_LOCALHOST` constant in `Client/src/utils/const.ts` will be updated to point to the NestJS server's default port (`3000`) instead of the old Express server's port (`5000`).