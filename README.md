# Flex Living Reviews Dashboard - Backend

Express.js backend API for managing and displaying guest reviews.

## Overview

The backend provides a RESTful API for managing reviews from various sources (Hostaway, Google Reviews). It includes data normalization, approval status management, and statistics calculation.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Data Persistence**: JSON file for approval statuses

## Project Structure

```
backend/
├── src/
│   ├── constants/
│   │   └── mockHostawayReviews.ts      # Mock data
│   ├── controllers/
│   │   └── review.controller.ts        # Route handlers
│   ├── interfaces/
│   │   ├── hostaway.interface.ts       # Type definitions
│   │   ├── review.interface.ts         # Review types
│   │   └── GooglePlaces.interface.ts   # Google types
│   ├── routes/
│   │   └── review.routes.ts            # Route definitions
│   ├── services/
│   │   ├── review.service.ts           # Business logic
│   │   ├── HostawayService.ts          # Hostaway integration
│   │   └── GooglePlacesService.ts      # Google integration
│   └── index.ts                         # Entry point
├── approved-reviews.json               # Auto-generated persistence
├── package.json
└── tsconfig.json
```

## Features

- **Review Management**: Fetch, filter, and manage reviews from multiple sources
- **Approval Workflow**: Approve/disapprove reviews with persistent storage
- **Real-time Statistics**: Calculate review statistics on-demand
- **Data Persistence**: JSON-based storage for approval statuses
- **CORS Enabled**: Ready for frontend integration
- **Type Safety**: Full TypeScript implementation

## API Endpoints

### Health Check

```
GET /
```

Returns: "Flex Living Reviews Dashboard Backend is running!"

### Get Hostaway Reviews

```
GET /api/reviews/hostaway?listingId={listingId}
```

Returns array of normalized reviews

### Get Google Reviews

```
GET /api/reviews/google?placeId={placeId}&listingName={name}
```

Returns array of normalized reviews from Google

### Get Review Statistics

```
GET /api/reviews/stats?listingId={listingId}
```

Returns review statistics including counts and averages

### Update Approval Status

```
PUT /api/reviews/:id/approve
Body: { "isApproved": boolean }
```

Updates and persists review approval status

### Search Google Places

```
GET /api/reviews/google/search?query={query}
```

Returns Google Places search results

### Get Properties

```
GET /api/reviews/properties
```

Returns unique list of properties

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- npm installed

### Installation

1. **Navigate to backend directory**:

   ```bash
   cd backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create environment file**:
   Create `.env` in the backend directory:

   ```env
   PORT=3001
   NODE_ENV=development
   ```

4. **Run development server**:

   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Environment Variables

| Variable   | Description      | Default     |
| ---------- | ---------------- | ----------- |
| `PORT`     | Server port      | 3001        |
| `NODE_ENV` | Environment mode | development |

## Data Persistence

Approval statuses are automatically saved to `approved-reviews.json` in the backend root directory.

File format:

```json
{
  "reviewId": true,
  "reviewId": false
}
```

This file is automatically created and updated when you approve or disapprove reviews.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm test` - Run tests (if configured)

### Adding New Review Sources

1. Create a service file in `src/services/`
2. Implement normalization to match `NormalizedReview` interface
3. Add route in `src/routes/review.routes.ts`
4. Add controller method in `src/controllers/review.controller.ts`
5. Update `review.service.ts` to handle new source

## Troubleshooting

**Issue**: Port already in use
**Solution**: Change PORT in `.env` or kill the process using port 3001

**Issue**: TypeScript errors
**Solution**: Run `npm run build` to check for compilation errors

**Issue**: Reviews not persisting
**Solution**: Check file permissions on `approved-reviews.json`

## Related Documentation

- [Frontend README](../frontend/README.md)
- [Frontend Deployment Guide](../frontend/DEPLOYMENT.md)
- [Backend Deployment Guide](./DEPLOYMENT.md)
- [Main README](../README.md)

## License

Proprietary software developed for Flex Living.
