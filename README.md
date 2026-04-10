# Genderize API Processing Service

A TypeScript + Express API that classifies a name using the public Genderize API, then returns a processed response with confidence logic and consistent error formatting.

## What This Project Does

- Accepts a name through a query parameter.
- Calls https://api.genderize.io.
- Returns:
  - gender
  - probability
  - sample_size (renamed from count)
  - is_confident (based on your rule)
  - processed_at (UTC ISO 8601 timestamp generated per request)
- Provides consistent error responses in this format:

```json
{
  "status": "error",
  "message": "<error message>"
}
```

## Tech Stack

- Node.js
- TypeScript
- Express
- Pino + pino-http (logging)
- CORS

## Prerequisites

- Node.js 18+ (recommended)
- npm

## Installation

1. Install dependencies:

```bash
npm install
```

2. Optional: create a .env file in the project root:

```env
PORT=3000
```

If PORT is not set, the server defaults to 3000.

## Run Command

- Development:

```bash
npm run dev
```

## API Endpoints

### Health/Welcome

- Method: GET
- Path: /

Success response:

```json
{
  "status": "success",
  "message": "Welcome to the Genderize API Processing Service!"
}
```

### Classify Name

- Method: GET
- Path: /api/classify
- Query parameter:
  - name (required)

Example request:

```http
GET /api/classify?name=john
```

Success response (200):

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-10T15:10:00.000Z"
  }
}
```

## Processing Rules

When classification succeeds:

- sample_size is sourced from Genderize count.
- is_confident is computed as:

```text
probability >= 0.7 AND sample_size >= 100
```

- processed_at is generated at request time using:
  - UTC
  - ISO 8601 format

## Validation and Error Behavior

All errors use:

```json
{
  "status": "error",
  "message": "<error message>"
}
```

### Validation errors

- 400 Bad Request
  - Missing or empty name parameter

```json
{
  "status": "error",
  "message": "Missing or empty name parameter"
}
```

- 422 Unprocessable Entity
  - Name is not a valid string value for this API (for example numeric values)

```json
{
  "status": "error",
  "message": "name is not a string"
}
```

### Genderize edge cases

If upstream data contains gender: null or count: 0, the service returns:

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

### Upstream/server failure

- 502 Bad Gateway for upstream failures
- 500 Internal Server Error for unexpected internal failures

```json
{
  "status": "error",
  "message": "Upstream or server failure"
}
```

## CORS

This API enables CORS with wildcard origin:

```http
Access-Control-Allow-Origin: *
```

## Notes

- Response time depends mostly on external Genderize latency.
- The service is stateless and can handle multiple concurrent requests.
