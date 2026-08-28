# LeetCode Module - Production Setup

## Environment Variables

Add these to your `.env` file:

```env
# LeetCode API Configuration
LEETCODE_API_BASE_URL=https://alfa-leetcode-api.onrender.com
LEETCODE_API_TIMEOUT=15000          # Request timeout in milliseconds (default: 15s)
LEETCODE_API_RETRIES=3              # Number of retry attempts (default: 3)
LEETCODE_CACHE_TTL=3600             # Cache time-to-live in seconds (default: 1 hour)
LEETCODE_BATCH_SIZE=10              # Batch size for sync operations (default: 10)

# Redis Configuration (used for caching)
REDIS_URL=redis://localhost:6379    # Your Redis connection URL
```

## API Endpoints

### 1. Get LeetCode Stats
```
GET /api/leetcode/stats
```

**Headers:**
- Authorization: Bearer `<token>`

**Response:**
```json
{
  "success": true,
  "message": "LeetCode stats retrieved successfully",
  "data": {
    "profile": {
      "username": "username",
      "name": "Full Name",
      "ranking": 12345,
      "profileUrl": "https://...",
      "avatar": "https://...",
      "reputation": 500,
      "badge_count": 10
    },
    "stats": {
      "totalSolved": 500,
      "easySolved": 200,
      "mediumSolved": 250,
      "hardSolved": 50,
      "acceptanceRate": 45.5
    },
    "badges": [
      {
        "name": "badge_name",
        "displayName": "Badge Name",
        "rarity": "common",
        "icon": "https://..."
      }
    ]
  },
  "cached": false
}
```

### 2. Sync LeetCode Submissions
```
POST /api/leetcode/sync
```

**Headers:**
- Authorization: Bearer `<token>`

**Response:**
```json
{
  "success": true,
  "message": "LeetCode submissions synced successfully",
  "data": {
    "imported": 150,
    "skipped": 50,
    "errors": 5,
    "processed": 205,
    "durationMs": 3500
  }
}
```

### 3. Health Check
```
GET /api/leetcode/health
```

**Response:**
```json
{
  "success": true,
  "message": "LeetCode module is healthy",
  "timestamp": "2024-06-24T10:30:00.000Z"
}
```

## Features

### ✅ Production-Ready Features

- **Retry Logic**: Automatic retries with exponential backoff (1s, 2s, 4s)
- **Timeout Protection**: Configurable request timeout to prevent hanging
- **Caching**: Redis-based caching to reduce API calls (default: 1 hour TTL)
- **Error Handling**: Comprehensive error handling with proper HTTP status codes
- **Validation**: Input validation for usernames and user IDs
- **Logging**: Detailed logging for debugging and monitoring
- **Batch Processing**: Submission sync processes in configurable batches
- **Graceful Degradation**: Partial failures don't break the entire response
- **Rate Limiting**: Respects batch size limits

### 🔒 Error Handling

All errors return proper HTTP status codes:

- `200 OK`: Successful request
- `401 Unauthorized`: Missing authentication
- `422 Unprocessable Entity`: Validation error
- `502 Bad Gateway`: External API error
- `503 Service Unavailable`: LeetCode API unreachable
- `504 Gateway Timeout`: Request timeout

## Architecture

```
Routes (API endpoints)
    ↓
Controllers (Request handling)
    ↓
Services (Business logic)
    ↓
Validation & Error Handling
    ↓
API Client (External API calls)
    ↓
Redis Cache
    ↓
LeetCode API
```

## File Structure

```
leetcode/
├── leetcode.controller.js      # Request handlers
├── leetcode.routes.js          # Route definitions
├── leetcode.service.js         # Business logic
├── leetcode-api.client.js      # External API calls
├── leetcode.validation.js      # Input validation
├── leetcode.config.js          # Configuration & constants
├── leetcode.errors.js          # Custom error classes
├── leetcode.logger.js          # Logging utility
└── README.md                   # This file
```

## Development Tips

### Enable Debug Logging

Set `DEBUG=leetcode:*` in your environment to see detailed logs.

### Clear Cache Manually

```javascript
// In your code
import redis from "../../redis/redis.js";
await redis.del("leetcode:stats:username");
```

### Test Endpoints

```bash
# Get stats
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/leetcode/stats

# Sync submissions
curl -X POST -H "Authorization: Bearer <token>" http://localhost:5000/api/leetcode/sync

# Health check
curl http://localhost:5000/api/leetcode/health
```

## Performance Optimizations

1. **Caching**: Stats are cached for 1 hour by default
2. **Batch Processing**: Submissions are processed in batches to avoid memory issues
3. **Parallel Fetching**: Profile, stats, and badges are fetched in parallel
4. **Error Recovery**: Failed requests automatically retry with backoff

## Monitoring

Check logs for:
- Cache hits/misses
- API retry attempts
- Sync statistics (imported, skipped, errors)
- Request duration

## Troubleshooting

### Stats endpoint returns 502
- Check LeetCode API status
- Verify username is linked to user profile
- Check Redis connection

### Sync takes too long
- Reduce `LEETCODE_BATCH_SIZE` if memory is limited
- Increase `LEETCODE_API_TIMEOUT` if API is slow

### Cache not working
- Verify Redis connection
- Check `REDIS_URL` environment variable
- Ensure Redis server is running
