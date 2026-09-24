# Campus Event Management API

A REST API backend for managing technical, cultural, and student events in a college environment.

This project was developed for **WEBFORGE AI – RedefINING Web Development Through AI**, based on the **Campus Event Management** problem statement.

The system allows students to view published events, register for events, and manage their registrations, while administrators can create, update, publish, cancel events, and manage registrations.

## Features

### User Features

- User registration
- User login
- JWT-based authentication
- View published events
- Register for an event
- View personal registrations
- Cancel an event registration
- Prevent duplicate registrations
- Prevent registration when event capacity is full
- Prevent registration for cancelled or unpublished events

### Admin Features

- Admin authentication
- Create events
- View all events
- Update event details
- Publish events
- Cancel events
- View all registrations
- Update registration status

### Security

- Password hashing using bcrypt
- JWT authentication
- HTTP-only cookies
- Role-based authorization
- USER and ADMIN roles
- Protected API routes
- Input validation
- Appropriate HTTP status codes

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**
- **bcryptjs**
- **cookie-parser**
- **Postman**

## Project Structure

```text
campus-event-management/
│
├── APIs/
│   ├── userAPI.js
│   ├── eventAPI.js
│   └── registrationAPI.js
│
├── middlewares/
│   ├── verifyTokenMiddleware.js
│   └── allowedRolesMiddleware.js
│
├── models/
│   ├── UserModel.js
│   ├── EventModel.js
│   └── RegistrationModel.js
│
├── postman/
│   └── WebForge-Hackathon.postman_collection.json
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/campus-event-management.git
```

### 2. Move into the project directory

```bash
cd campus-event-management
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the environment file

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus_event_management
JWT_SECRET=your_secret_key
```

> Do not commit the `.env` file to GitHub.

### 5. Start the server

```bash
node server.js
```

The API will run at:

```text
http://localhost:3000
```

## API Endpoints

### Authentication

#### Register User

```http
POST /user-api/register
```

Example request:

```json
{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@1234"
}
```

#### Login

```http
POST /user-api/login
```

Example:

```json
{
    "email": "test@example.com",
    "password": "Test@1234"
}
```

A JWT is generated after successful login and stored in an HTTP-only cookie.

## Event APIs

### View Published Events

```http
GET /event-api/events
```

Requires authentication.

### Create Event

```http
POST /event-api/events
```

**ADMIN only**

Example:

```json
{
    "title": "Web Development Workshop",
    "description": "A hands-on workshop on modern web development",
    "date": "2026-09-30T10:00:00",
    "venue": "E-Block Seminar Hall",
    "capacity": 100,
    "status": "PUBLISHED"
}
```

### View All Events

```http
GET /event-api/admin/events
```

**ADMIN only**

### Update Event

```http
PUT /event-api/events/:eventId
```

**ADMIN only**

### Publish Event

```http
PUT /event-api/events/:eventId/publish
```

**ADMIN only**

### Cancel Event

```http
PUT /event-api/events/:eventId/cancel
```

**ADMIN only**

## Registration APIs

### Register for an Event

```http
POST /registration-api/events/:eventId/register
```

**USER only**

### View My Registrations

```http
GET /registration-api/my-registrations
```

**USER only**

### Cancel My Registration

```http
PUT /registration-api/events/:eventId/cancel
```

**USER only**

### View All Registrations

```http
GET /registration-api/all-registrations
```

**ADMIN only**

### Update Registration Status

```http
PUT /registration-api/registrations/:registrationId/status
```

**ADMIN only**

Example:

```json
{
    "status": "CANCELLED"
}
```

Allowed statuses:

```text
REGISTERED
CANCELLED
```

## Authentication and Authorization

The application uses JWT-based authentication.

After successful login:

1. The server verifies the user's email and password.
2. A JWT containing the user's ID and role is generated.
3. The token is stored in an HTTP-only cookie.
4. Protected routes verify the token using authentication middleware.
5. Role-based middleware restricts access to USER and ADMIN routes.

### Roles

| Role | Access |
|------|--------|
| USER | View events, register for events, view and cancel own registrations |
| ADMIN | Manage events and registrations |

## Event Rules

The API enforces the following rules:

- Only published events can be registered for.
- Cancelled events cannot accept registrations.
- A user cannot register for the same event more than once while the registration is active.
- Event capacity cannot be exceeded.
- Only administrators can create and manage events.
- Only administrators can view and manage all registrations.
- Users can only manage their own registrations.

## Validation and Error Handling

The API returns meaningful HTTP status codes for common failure cases.

Common status codes include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

Example error response:

```json
{
    "success": false,
    "message": "Access denied"
}
```

## Postman Testing

A Postman collection is included in the repository.

It contains requests for:

- User registration
- Login
- Viewing events
- Event registration
- Viewing registered events
- Cancelling registration
- Admin event creation
- Admin event update
- Publishing events
- Cancelling events
- Viewing all events
- Viewing all registrations
- Updating registration status

Failure cases include:

- Invalid login credentials
- Missing registration fields
- Short passwords
- Duplicate email
- Missing authentication token
- Unauthorized role access
- Duplicate event registration
- Registration for cancelled events
- Invalid registration status
- Non-existent events

Import the collection into Postman and run the requests against:

```text
http://localhost:3000
```

## Test Credentials

### User

```text
Email: test@example.com
Password: Test@1234
Role: USER
```

### Admin

```text
Email: admin@example.com
Password: Admin@1234
Role: ADMIN
```

> These credentials are provided for testing the sample/demo database. Change them for any real deployment.

## Database

The project uses MongoDB with Mongoose.

Main collections:

```text
users
events
registrations
```

### User

Stores:

- Name
- Email
- Hashed password
- Role
- Active status

### Event

Stores:

- Title
- Description
- Date
- Venue
- Capacity
- Status

### Registration

Stores:

- User ID
- Event ID
- Registration status

## Project Status

**Completed for WEBFORGE AI Hackathon.**

The backend implements the required Campus Event Management functionality with authentication, authorization, event management, registration management, validation, and Postman testing.
