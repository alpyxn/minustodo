# API

## Base URL

```
http://localhost:8081
```

## Endpoints

### Task Endpoints

- **Add Task**
  - **URL**: `/task/addTask`
  - **Method**: `POST`
  - **Request Body**: `String` (task title)
  - **Response**: `Task` object

- **Get Tasks by Owner**
  - **URL**: `/task/get`
  - **Method**: `GET`
  - **Response**: List of `TaskRequest` objects

- **Complete Task**
  - **URL**: `/task/completed`
  - **Method**: `PUT`
  - **Request Body**: `String` (task ID)
  - **Response**: `String` (success message)

- **Uncomplete Task**
  - **URL**: `/task/uncompleted`
  - **Method**: `PUT`
  - **Request Body**: `String` (task ID)
  - **Response**: `String` (success message)

- **Delete All Tasks**
  - **URL**: `/task/deleteAll`
  - **Method**: `DELETE`
  - **Response**: List of `TaskRequest` objects

- **Delete Task by ID**
  - **URL**: `/task/delete/{taskId}`
  - **Method**: `DELETE`
  - **Response**: `BigInteger` (deleted task ID)
