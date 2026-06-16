# B0626 - Fatima Tahir - Innovaxel - Backend

A REST API for an Event Registration System built with Node.js, Express, and SQLite.

## Tech Stack
- Node.js + Express
- better-sqlite3 (SQLite)

## Setup & Run

1. Clone the repo
2. Install dependencies:
   npm install
3. Start the server:
   node src/app.js
4. Server runs at: http://localhost:3000

## API Endpoints

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /events | Create a new event |
| GET | /events | Get all events |
| GET | /events?upcoming=true | Get upcoming events only |
| GET | /events?sort=true | Get events sorted by date |
| GET | /events?upcoming=true&sort=true | Upcoming events sorted by date |
| POST | /events/:id/register | Register a user for an event |
| GET | /events/:id/registrations | View active registrations for an event |

### Registrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | /registrations/:id | Cancel a registration |

## Request & Response Examples

### Create Event
POST /events
Content-Type: application/json
{
  "name": "Tech Conference",
  "total_seats": 100,
  "event_date": "2026-12-01T10:00:00.000Z"
}
Response: { "message": "Event created successfully" }

### Register User
POST /events/1/register
Content-Type: application/json
{ "user_name": "Fatima" }
Response: { "message": "Registration successful" }

### Cancel Registration
DELETE /registrations/1
Response: { "message": "Registration cancelled" }

## Key Features
- Unique event names enforced
- Future date validation
- Seat availability tracking
- Duplicate registration prevention
- Race condition protection via SQLite transactions
- Soft-delete cancellations (status: cancelled)
- Proper error messages for all edge cases