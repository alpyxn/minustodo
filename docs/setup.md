# Setup

## Prerequisites

- Java 17
- Maven
- Docker
- Node.js and npm
- PostgreSQL

## Backend Setup

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd minustodo
   ```

2. Build the Spring Boot application:
   ```sh
   ./mvnw clean package -DskipTests
   ```

3. Run the application:
   ```sh
   ./mvnw spring-boot:run
   ```

## Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Docker Setup

1. Build and run the Docker containers:
   ```sh
   docker-compose up --build
   ```

## Deployment

Refer to the `deploy.sh` script for AWS deployment instructions.
