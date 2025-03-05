# Architecture

## Overview

The Todo Application is a full-stack application consisting of a Spring Boot backend and a React frontend. The application uses Keycloak for authentication and authorization.

## Backend

- **Framework**: Spring Boot
- **Database**: PostgreSQL
- **Authentication**: Keycloak
- **ORM**: Hibernate (JPA)
- **Migration**: Flyway

### Key Components

- `TodoAppApplication`: Main entry point of the Spring Boot application.
- `SecurityConfig`: Configures security settings, including JWT authentication.
- `TaskController`: REST controller for managing tasks.
- `TaskService`: Service layer for business logic.
- `TaskRepository`: JPA repository for database operations.

## Frontend

- **Framework**: React
- **State Management**: React hooks
- **Styling**: Tailwind CSS, DaisyUI
- **Authentication**: Keycloak

### Key Components

- `App`: Main application component.
- `AuthContext`: Context for managing authentication state.
- `Dashboard`: Component for displaying task statistics.
- `TodoTable`: Component for displaying and managing tasks.
