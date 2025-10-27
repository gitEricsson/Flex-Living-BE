# Backend Deployment Guide

Complete guide for deploying the Flex Living Reviews Dashboard backend API.

## Quick Start

```bash
# Build
npm run build

# Start production server
npm start
```

## Deployment Platforms

### 1. Railway

**Recommended for beginners**

1. Install Railway CLI:

   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. Deploy:

   ```bash
   cd backend
   railway init
   railway up
   ```

3. Set environment variables:

   ```bash
   railway variables set PORT=3001
   railway variables set NODE_ENV=production
   ```

4. Get your URL:
   Railway provides a URL like `https://your-app.railway.app`

### 2. Render

1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: flex-living-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     ```
     PORT=3001
     NODE_ENV=production
     ```

### 3. Fly.io

1. Install Fly CLI:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login:

   ```bash
   fly auth login
   ```

3. Deploy:
   ```bash
   cd backend
   fly launch
   fly secrets set PORT=3001
   fly secrets set NODE_ENV=production
   fly deploy
   ```

### 4. Docker

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t flex-living-backend .
docker run -p 3001:3001 -e PORT=3001 -e NODE_ENV=production flex-living-backend
```

## Environment Configuration

Create `.env` file:

```env
PORT=3001
NODE_ENV=production
```

For production, also configure:

```env
FRONTEND_URL=https://your-frontend-domain.com
```

## Build Process

The backend uses TypeScript and must be compiled before running in production:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Compile TypeScript**:

   ```bash
   npm run build
   ```

   This creates the `dist/` directory with compiled JavaScript.

3. **Start server**:
   ```bash
   npm start
   ```

## Post-Deployment Checklist

- [ ] Server responds at deployed URL
- [ ] All API endpoints accessible
- [ ] CORS configured for frontend domain
- [ ] `approved-reviews.json` file is writable
- [ ] Environment variables set correctly
- [ ] Server logs accessible

### Test Endpoints

```bash
# Health check
curl https://your-backend-url.com/

# Get properties
curl https://your-backend-url.com/api/reviews/properties

# Get stats
curl https://your-backend-url.com/api/reviews/stats
```

## Production Optimizations

### 1. Enable Gzip Compression

Add to `package.json` dependencies:

```json
"compression": "^1.7.4"
```

Update `src/index.ts`:

```typescript
import compression from 'compression';
app.use(compression());
```

### 2. Add Rate Limiting

Add to `package.json` dependencies:

```json
"express-rate-limit": "^7.1.5"
```

Update `src/index.ts`:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
});

app.use('/api/', limiter);
```

### 3. Add Logging

Add to `package.json` dependencies:

```json
"morgan": "^1.10.0"
```

Update `src/index.ts`:

```typescript
import morgan from 'morgan';
app.use(morgan('combined'));
```

### 4. Update CORS for Production

Update `src/index.ts`:

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'https://your-frontend-domain.com',
    credentials: true,
  })
);
```

## Database Migration

For production, consider migrating from JSON file to a database:

### Option 1: PostgreSQL (Railway)

1. Add PostgreSQL service in Railway dashboard
2. Install dependencies:
   ```bash
   npm install pg @types/pg
   ```
3. Update `review.service.ts` to use database instead of JSON file

### Option 2: MongoDB Atlas

1. Create MongoDB Atlas account
2. Install dependencies:
   ```bash
   npm install mongoose
   ```
3. Update `review.service.ts` to use MongoDB

## Troubleshooting

**Problem**: Build fails
**Solution**: Ensure TypeScript is installed and all imports are correct

**Problem**: Port conflict
**Solution**: Use `process.env.PORT` (platform will assign automatically)

**Problem**: Reviews not persisting
**Solution**: Check file system permissions on deployment platform

**Problem**: CORS errors
**Solution**: Configure CORS to allow frontend domain

## Monitoring

- Check server logs in deployment platform dashboard
- Monitor API response times
- Track error rates
- Monitor `approved-reviews.json` file size

## Security

- Never commit `.env` file
- Use environment variables for secrets
- Enable HTTPS
- Configure CORS properly
- Implement rate limiting
- Validate all inputs

## Related Documentation

- [Backend README](./README.md)
- [Frontend Deployment](../frontend/DEPLOYMENT.md)
- [Main README](../README.md)
