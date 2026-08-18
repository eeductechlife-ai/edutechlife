# Backend Monitoring & Sentry Integration

Complete guide for setting up error tracking and performance monitoring on the Node.js backend.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Sentry Setup](#sentry-setup)
3. [Instrumentation](#instrumentation)
4. [Error Handling](#error-handling)
5. [Performance Monitoring](#performance-monitoring)
6. [Health Checks](#health-checks)
7. [Logging](#logging)
8. [Alerts](#alerts)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Install Dependencies (2 minutes)

```bash
cd edutechlife-backend
npm install @sentry/node @sentry/tracing
```

### 2. Initialize Sentry (5 minutes)

Create `src/config/sentry.js`:

```javascript
import * as Sentry from "@sentry/node";

export function initSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({
        request: true,
        serverName: false,
      }),
      new Sentry.Integrations.PostgreSQL(),
    ],
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE || 0.05),
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION || '1.0.0',
  });

  console.log('✅ Sentry initialized');
}

export default Sentry;
```

### 3. Add to Express App (5 minutes)

Update `src/index.js`:

```javascript
import express from 'express';
import { initSentry } from './config/sentry.js';
import Sentry from './config/sentry.js';

// Initialize Sentry FIRST
initSentry();

const app = express();

// Sentry middleware (BEFORE other middleware)
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Your routes and middleware
app.use(express.json());
app.use('/api', apiRoutes);

// Error handler (AFTER all routes)
app.use(Sentry.Handlers.errorHandler());

// Generic error handler
app.use((err, req, res, next) => {
  Sentry.captureException(err);
  
  res.status(err.status || 500).json({
    error: err.message,
    id: res.sentry, // Sentry transaction ID
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Test Setup

```bash
# Send test error to Sentry
node -e "
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
Sentry.captureException(new Error('Test error from backend'));
console.log('Check Sentry dashboard');
"
```

---

## Sentry Setup

### Create Backend Project

1. **Go to** https://sentry.io
2. **Create Project**:
   - Platform: Node.js
   - Alert Rule: Create new
3. **Copy DSN**: `https://[key]@[org].ingest.sentry.io/[project-id]`

### Environment Variables

Add to `.env` (backend):

```env
SENTRY_DSN=https://[key]@[org].ingest.sentry.io/[backend-project-id]
SENTRY_TRACES_SAMPLE_RATE=0.05
SENTRY_ENVIRONMENT=production
SENTRY_DEBUG=false
APP_VERSION=1.0.0
```

### Configuration Options

```javascript
// Full Sentry configuration
Sentry.init({
  // Required
  dsn: process.env.SENTRY_DSN,

  // Performance monitoring
  tracesSampleRate: 0.05,  // 5% of transactions
  
  // Environment
  environment: process.env.NODE_ENV,
  release: process.env.APP_VERSION,
  
  // Server identification
  serverName: 'api-production',
  
  // Integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express(),
    new Sentry.Integrations.PostgreSQL(),
    new Sentry.Integrations.OnUncaughtException(),
    new Sentry.Integrations.OnUnhandledRejection(),
  ],
  
  // Ignore certain errors
  ignoreErrors: [
    'NetworkError',
    'TimeoutError',
    'ECONNREFUSED',
    'ENOTFOUND',
  ],
  
  // Maximum attachment size (bytes)
  maxAttachmentSize: 5_000_000,
  
  // Request filtering
  beforeSend(event, hint) {
    // Filter out health check requests
    if (event.request?.url?.includes('/health')) {
      return null;
    }
    return event;
  },
  
  // Breadcrumb filtering
  beforeBreadcrumb(breadcrumb, hint) {
    // Filter sensitive data
    if (breadcrumb.message?.includes('password')) {
      return null;
    }
    return breadcrumb;
  },
});
```

---

## Instrumentation

### 1. Capture Exceptions

**Automatic (via middleware)**:
```javascript
// Errors caught by Express error handler
app.get('/api/users/:id', (req, res, next) => {
  try {
    // code that might throw
  } catch (error) {
    next(error);  // Caught by Sentry middleware
  }
});
```

**Manual capture**:
```javascript
import Sentry from '@/config/sentry.js';

try {
  const result = await complexOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      operation: 'complexOperation',
      severity: 'high',
    },
    contexts: {
      custom: {
        userId: req.user?.id,
        action: 'update_profile',
      },
    },
  });
}
```

### 2. Set User Context

```javascript
// Middleware to set user context
app.use((req, res, next) => {
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      tier: req.user.tier,
    });
  } else {
    Sentry.setUser(null);
  }
  next();
});
```

### 3. Add Context Data

```javascript
// Add custom context
Sentry.setContext('database', {
  host: process.env.DB_HOST,
  pool_size: 20,
  pool_idle: 5,
});

Sentry.setContext('api', {
  version: '1.0.0',
  region: 'us-east-1',
});

Sentry.setContext('request', {
  method: req.method,
  path: req.path,
  ip: req.ip,
});
```

### 4. Add Breadcrumbs

```javascript
// Manual breadcrumbs
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User login successful',
  level: 'info',
  data: {
    userId: user.id,
    method: 'oauth',
  },
});

// Database query breadcrumb
Sentry.addBreadcrumb({
  category: 'database',
  message: 'SELECT users WHERE id = $1',
  level: 'debug',
  data: {
    duration_ms: 45,
    rows_affected: 1,
  },
});
```

### 5. Capture Messages

```javascript
// For non-error messages
Sentry.captureMessage('Payment webhook received', 'info', {
  tags: {
    webhook: 'stripe',
    event_type: 'payment.success',
  },
});

// Performance warning
Sentry.captureMessage('Slow query detected', 'warning', {
  contexts: {
    database: {
      query: 'SELECT * FROM large_table',
      duration_ms: 5000,
    },
  },
});
```

---

## Error Handling

### Global Error Handler

```javascript
// Express error handling middleware
app.use((err, req, res, next) => {
  // Capture exception
  Sentry.captureException(err);
  
  // Determine status code
  const status = err.status || err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Send response
  res.status(status).json({
    error: {
      message: err.message,
      status: status,
      ...(isDevelopment && { stack: err.stack }),
      // Include Sentry transaction ID for error tracking
      sentry_id: res.sentry,
    },
  });
});
```

### Common Error Patterns

**Database Errors**:
```javascript
import pool from '@/db.js';

async function getUser(userId) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        error_type: 'database',
        operation: 'getUser',
      },
      contexts: {
        database: {
          userId,
          query: 'SELECT * FROM users WHERE id = $1',
        },
      },
    });
    throw new Error('Failed to fetch user');
  }
}
```

**API Errors**:
```javascript
import axios from 'axios';

async function callExternalAPI(endpoint) {
  try {
    const response = await axios.get(endpoint, {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        error_type: 'api',
        endpoint: endpoint,
      },
      contexts: {
        http: {
          status: error.response?.status,
          url: endpoint,
        },
      },
    });
    throw error;
  }
}
```

**Validation Errors**:
```javascript
function validateUserInput(data) {
  const errors = {};
  
  if (!data.email?.includes('@')) {
    errors.email = 'Invalid email';
  }
  
  if (data.password?.length < 8) {
    errors.password = 'Password too short';
  }
  
  if (Object.keys(errors).length > 0) {
    Sentry.captureMessage('Validation failed', 'warning', {
      contexts: {
        validation: {
          errors,
          fields_submitted: Object.keys(data),
        },
      },
    });
    throw new ValidationError(errors);
  }
  
  return data;
}
```

---

## Performance Monitoring

### 1. Transaction Tracing

Automatically enabled by Express integration:

```javascript
// All requests automatically create transactions
// Visible in Sentry → Performance
```

### 2. Custom Transactions

```javascript
const transaction = Sentry.startTransaction({
  op: 'task',
  name: 'send_email_campaign',
  tags: {
    campaign_id: campaignId,
  },
});

try {
  // Long-running task
  for (let user of users) {
    const span = transaction.startChild({
      op: 'email',
      description: `Send to ${user.email}`,
    });
    
    await sendEmail(user.email);
    
    span.finish();
  }
  
  transaction.finish();
} catch (error) {
  transaction.setStatus('failed');
  transaction.finish();
  throw error;
}
```

### 3. Database Query Monitoring

```javascript
// Wrapper for database queries
async function query(sql, params) {
  const span = Sentry.startActiveTransaction({
    op: 'db.query',
    name: sql.substring(0, 50), // First 50 chars
    tags: {
      database: 'postgres',
    },
  });
  
  try {
    const start = Date.now();
    const result = await pool.query(sql, params);
    const duration = Date.now() - start;
    
    span.setData('rows_affected', result.rowCount);
    span.setData('duration_ms', duration);
    
    // Alert on slow queries
    if (duration > 1000) {
      Sentry.captureMessage('Slow query detected', 'warning', {
        contexts: {
          database: {
            query: sql,
            duration_ms: duration,
            rows: result.rowCount,
          },
        },
      });
    }
    
    return result;
  } finally {
    span?.finish();
  }
}
```

### 4. Monitor Request Performance

```javascript
// Middleware to track response times
app.use((req, res, next) => {
  const start = Date.now();
  
  // Wrap res.json to capture response time
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    // Tag transaction
    Sentry.addBreadcrumb({
      category: 'http',
      message: `${req.method} ${req.path}`,
      data: {
        status: res.statusCode,
        duration_ms: duration,
        body_size: JSON.stringify(data).length,
      },
    });
    
    // Alert on slow endpoints
    if (duration > 2000) {
      Sentry.captureMessage('Slow endpoint', 'warning', {
        tags: {
          endpoint: req.path,
          method: req.method,
        },
        contexts: {
          performance: {
            duration_ms: duration,
            threshold_ms: 2000,
          },
        },
      });
    }
    
    return originalJson.call(this, data);
  };
  
  next();
});
```

---

## Health Checks

### Simple Health Endpoint

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.APP_VERSION,
  });
});
```

### Detailed Health Check

```javascript
import pool from '@/db.js';

app.get('/health/deep', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      external_api: 'unknown',
    },
  };

  try {
    // Check database
    const dbResult = await pool.query('SELECT 1');
    health.services.database = 'ok';
  } catch (error) {
    health.services.database = 'error';
    health.status = 'degraded';
    Sentry.captureException(error, {
      tags: { check: 'database_health' },
    });
  }

  // Check Redis (if used)
  try {
    const redisPing = await redisClient.ping();
    health.services.redis = redisPing ? 'ok' : 'error';
  } catch (error) {
    health.services.redis = 'error';
  }

  // Check external APIs
  try {
    await axios.get('https://api.external.com/health', { timeout: 2000 });
    health.services.external_api = 'ok';
  } catch (error) {
    health.services.external_api = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## Logging

### Structured Logging

```javascript
// Simple logger with Sentry integration
class Logger {
  info(message, context = {}) {
    console.log(`[INFO] ${message}`, context);
    Sentry.addBreadcrumb({
      category: 'log',
      message,
      level: 'info',
      data: context,
    });
  }

  warn(message, context = {}) {
    console.warn(`[WARN] ${message}`, context);
    Sentry.captureMessage(message, 'warning', {
      contexts: { log: context },
    });
  }

  error(message, error, context = {}) {
    console.error(`[ERROR] ${message}`, error, context);
    Sentry.captureException(error, {
      contexts: { log: context },
    });
  }

  debug(message, context = {}) {
    if (process.env.DEBUG) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }
}

export const logger = new Logger();
```

**Usage**:
```javascript
import { logger } from '@/utils/logger.js';

logger.info('User login', { userId: 123, provider: 'oauth' });
logger.warn('Rate limit approaching', { ip: '192.168.1.1', requests: 95 });
logger.error('Database error', error, { query: 'SELECT * FROM users' });
```

---

## Alerts

### Sentry Alert Rules

**Go to**: Sentry → Settings → Alerts → New Alert Rule

#### Alert 1: High Error Rate (P0)

```
IF error count > 100 AND timewindow >= 5 minutes
THEN notify @oncall on Slack
AND page PagerDuty oncall
```

#### Alert 2: Latency Spike (P1)

```
IF average transaction latency > 2s
THEN notify #monitoring on Slack
```

#### Alert 3: Database Errors (P1)

```
IF error count > 50 AND tag error_type = 'database'
THEN notify #devops on Slack
```

#### Alert 4: Auth Failures (P0)

```
IF error count > 20 AND tag error_type = 'authentication'
THEN notify #security on Slack
AND notify @oncall via SMS
```

---

## Troubleshooting

### Errors Not Appearing in Sentry

1. **Check DSN**:
   ```javascript
   console.log(Sentry.getCurrentHub()._client?.getOptions().dsn);
   ```

2. **Check Network**:
   - DevTools → Network tab
   - Filter: `sentry`
   - Look for POST to Sentry API

3. **Check beforeSend**:
   - Errors might be filtered out
   - Check `beforeSend` and `beforeBreadcrumb` functions

4. **Test manually**:
   ```javascript
   await Sentry.captureException(new Error('Test'));
   ```

### High False Positive Alerts

1. **Adjust thresholds**: Make thresholds less sensitive
2. **Add filters**: Use `beforeSend` to filter certain errors
3. **Ignore errors**: Add to `ignoreErrors` array
4. **Change sample rate**: Reduce `tracesSampleRate` if too noisy

### Performance Overhead

Sentry adds minimal overhead (~1-5ms per request):

1. **Reduce sample rate**:
   ```javascript
   tracesSampleRate: 0.01, // 1% instead of 5%
   ```

2. **Disable session replay**:
   ```javascript
   replaysSessionSampleRate: 0,
   ```

3. **Filter breadcrumbs**:
   - Only capture important events

---

## Best Practices

### Do's

✅ Capture exceptions with context
✅ Set user context for authenticated requests
✅ Use tags to organize errors
✅ Monitor database query performance
✅ Alert on business-critical errors
✅ Review Sentry dashboard weekly
✅ Test error handling in staging

### Don'ts

❌ Send personally identifiable information (PII)
❌ Send sensitive data (passwords, tokens)
❌ Ignore Sentry alerts
❌ Over-sample traces (too much data)
❌ Capture errors in tight loops
❌ Store large attachments
❌ Send duplicate errors

---

## Quick Reference

### Essential Configuration

```javascript
import Sentry from '@sentry/node';

// Initialize FIRST
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.05,
  environment: process.env.NODE_ENV,
});

// Add middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler LAST
app.use(Sentry.Handlers.errorHandler());
```

### Common Patterns

```javascript
// Capture exception
Sentry.captureException(error);

// Capture message
Sentry.captureMessage('Something happened');

// Set user
Sentry.setUser({ id: '123', email: 'user@example.com' });

// Add context
Sentry.setContext('request', { path: '/api/users' });

// Add breadcrumb
Sentry.addBreadcrumb({ message: 'User action' });
```

---

## Resources

- [Sentry Node.js Docs](https://docs.sentry.io/platforms/node/)
- [Sentry Express Integration](https://docs.sentry.io/platforms/node/guides/express/)
- [Sentry Configuration Reference](https://docs.sentry.io/platforms/node/configuration/)
- [Sentry Performance Monitoring](https://docs.sentry.io/platforms/node/performance/)

---

## Support

For questions:
1. Check Sentry documentation
2. Review backend logs
3. Open GitHub issue
4. Contact DevOps team
5. Ask in #backend Slack channel
