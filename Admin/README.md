# Admin Panel API Documentation

This document outlines the API endpoints provided by the `serve` application that the admin panel will interact with.

## API Endpoints

### App
- `GET /`

### Users (`/users`)
- `POST /` - Create a new user.
- `GET /` - Get all users.
- `GET /:id` - Get a user by ID.
- `PATCH /:id` - Update a user by ID.
- `DELETE /:id` - Delete a user by ID.

### User Favorites (`/user-favorites`)
- `POST /` - Create a new user favorite.
- `GET /` - Get all user favorites.
- `GET /:id` - Get a user favorite by ID.
- `PATCH /:id` - Update a user favorite by ID.
- `DELETE /:id` - Delete a user favorite by ID.

### Search (`/search`)
- `POST /` - Create a new search.
- `GET /` - Get all searches.
- `GET /:id` - Get a search by ID.
- `PATCH /:id` - Update a search by ID.
- `DELETE /:id` - Delete a search by ID.

### Properties (`/properties`)
- `POST /` - Create a new property.
- `GET /` - Get all properties.
- `GET /:slug` - Get a property by slug.
- `PATCH /:id` - Update a property by ID.
- `PATCH /property-image/:id` - Update a property image.
- `PATCH /property-floor-plan/:id` - Update a property floor plan.
- `DELETE /:id` - Delete a property by ID.

### Developers (`/developers`)
- `POST /` - Create a new developer.
- `GET /` - Get all developers.
- `GET /:id` - Get a developer by ID.
- `PATCH /:id` - Update a developer by ID.
- `DELETE /:id` - Delete a developer by ID.

### Chatbot (`/chatbot`)
- `POST /` - Create a new chatbot entry.
- `GET /` - Get all chatbot entries.
- `GET /:id` - Get a chatbot entry by ID.
- `PATCH /:id` - Update a chatbot entry by ID.
- `DELETE /:id` - Delete a chatbot entry by ID.

### Authentication (`/auths`)
- `POST /signin` - Sign in a user.
- `POST /signup` - Sign up a new user.

### Agents (`/agents`)
- `POST /` - Create a new agent.
- `GET /` - Get all agents.
- `GET /:id` - Get an agent by ID.
- `PATCH /:id` - Update an agent by ID.
- `DELETE /:id` - Delete an agent by ID.
