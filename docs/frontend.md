# Frontend

## Overview

The frontend of the Todo Application is built using React and Vite. It uses Tailwind CSS and DaisyUI for styling and Keycloak for authentication.

## Key Components

- **App**: Main application component that sets up routes and authentication.
- **AuthContext**: Context for managing authentication state using Keycloak.
- **Dashboard**: Component for displaying task statistics.
- **TodoTable**: Component for displaying and managing tasks.
- **TodoInput**: Component for adding new tasks.
- **Todo**: Component for displaying individual tasks.

## Environment Variables

The frontend uses the following environment variables:

- `VITE_KEYCLOAK_URL`: URL of the Keycloak server.
- `VITE_API_URL`: URL of the backend API server.

## Scripts

- **Start Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Lint Code**: `npm run lint`
- **Preview Production Build**: `npm run preview`
