# Database Monitoring & Performance Tuning

Complete guide for monitoring PostgreSQL database performance and optimizing queries.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Slow Query Logging](#slow-query-logging)
3. [Query Analysis](#query-analysis)
4. [Index Management](#index-management)
5. [Connection Pooling](#connection-pooling)
6. [Performance Metrics](#performance-metrics)
7. [Backup & Recovery](#backup--recovery)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Enable Slow Query Logging (5 minutes)

1. **Access Supabase Dashboard**:
   - Go to https://app.supabase.com
   - Select your project
   - Go to SQL Editor

2. **Run Setup Queries**:
   ```sql
   -- Enable slow query logging
   ALTER SYSTEM SET log_min_duration_statement = 100; -- 100ms threshold
   ALTER SYSTEM SET log_statement = 'mod'; -- Log DML + DDL
   ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
   SELECT pg_reload_conf();
   ```

3. **Verify Setup**:
   ```sql
   -- Check settings
   SHOW log_min_duration_statement;
   SHOW log_statement;
   ```

### View Slow Queries (Real-Time)

```sql
-- Top 10 slowest queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 100 -- 100ms
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Slow Query Logging

### Configuration

**Supabase Dashboard Method**:

1. Go to Database → Settings
2. Click "Logs" tab
3. Filter by "Slow queries (> 100ms)"
4. View in real-time

**Environment Variables** (if self-hosted):

```bash
# .env
POSTGRES_LOG_MIN_DURATION_STATEMENT=100
POSTGRES_LOG_STATEMENT=mod
POSTGRES_LOG_CONNECTIONS=on
POSTGRES_LOG_DISCONNECTIONS=on
```

### Log Analysis

**Sample Slow Query Log**:
```
2026-08-15 10:45:32.123 UTC [1234]: [1-1] user=postgres,db=edutechlife,app=api,client=127.0.0.1
  LOG:  duration: 245.231 ms  statement: SELECT * FROM courses WHERE category = 'AI' AND published = true
```

**Parse Query Time**:
- Query: `SELECT * FROM courses ...`
- Duration: 245.231 ms (slow!)
- Time threshold: 100 ms

**Action**: Add index on `(category, published)`

---

## Query Analysis

### Tools

#### 1. EXPLAIN ANALYZE

Run before and after optimization:

```sql
-- BEFORE optimization
EXPLAIN ANALYZE
SELECT * FROM courses 
WHERE category = 'AI' AND published = true
ORDER BY created_at DESC
LIMIT 10;
```

**Output Interpretation**:
```
Seq Scan on courses  (cost=0.00..1234.00 rows=150)
  Filter: (category = 'AI' AND published = true)
  Planning Time: 0.123 ms
  Execution Time: 245.231 ms  ← TOO SLOW!
```

**Add Index**:
```sql
CREATE INDEX idx_courses_category_published 
ON courses(category, published) 
WHERE published = true;
```

**After Index**:
```
Index Scan using idx_courses_category_published
  (cost=0.29..45.12 rows=150)
  Planning Time: 0.089 ms
  Execution Time: 12.456 ms  ← MUCH BETTER!
```

#### 2. EXPLAIN without ANALYZE (Plan Only)

No performance hit:

```sql
EXPLAIN (FORMAT JSON)
SELECT u.id, u.email, COUNT(c.id) as course_count
FROM users u
LEFT JOIN enrollments c ON u.id = c.user_id
GROUP BY u.id
LIMIT 100;
```

#### 3. pg_stat_statements

Track all queries:

```sql
-- Install extension (one-time)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Top 20 slowest queries
SELECT 
  query,
  calls,
  mean_time,
  max_time,
  total_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- Top 10 most frequently called queries
SELECT 
  query,
  calls,
  mean_time
FROM pg_stat_statements
ORDER BY calls DESC
LIMIT 10;
```

---

## Index Management

### Common Indexes to Create

#### 1. User & Auth Indexes

```sql
-- User email lookups
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Clerk user IDs
CREATE UNIQUE INDEX idx_users_clerk_id ON users(clerk_id);

-- User searches
CREATE INDEX idx_users_last_name ON users(last_name);
CREATE INDEX idx_users_created_at ON users(created_at);
```

#### 2. Course & Module Indexes

```sql
-- Course category & status
CREATE INDEX idx_courses_category_published 
ON courses(category, published) 
WHERE published = true;

-- Module progress tracking
CREATE INDEX idx_modules_course_id ON modules(course_id);
CREATE INDEX idx_modules_created_at ON modules(created_at DESC);

-- Lesson lookup
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
```

#### 3. User Progress Indexes

```sql
-- User course progress
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_user_course 
ON enrollments(user_id, course_id);

-- Progress tracking
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_module_id ON progress(module_id);
CREATE INDEX idx_progress_user_module 
ON progress(user_id, module_id);

-- Time-series queries
CREATE INDEX idx_progress_completed_at 
ON progress(completed_at DESC) 
WHERE completed_at IS NOT NULL;
```

#### 4. Quiz & Assessment Indexes

```sql
-- Quiz attempts
CREATE INDEX idx_quiz_attempts_user_id 
ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id 
ON quiz_attempts(quiz_id);

-- Quiz results
CREATE INDEX idx_quiz_results_attempt_id 
ON quiz_results(attempt_id);

-- Question tracking
CREATE INDEX idx_questions_quiz_id 
ON questions(quiz_id);
```

#### 5. Performance Indexes (Conditional)

```sql
-- Only active users
CREATE INDEX idx_users_active 
ON users(id) 
WHERE deleted_at IS NULL 
AND is_active = true;

-- Recent activity
CREATE INDEX idx_activities_recent 
ON activities(created_at DESC) 
WHERE created_at > CURRENT_DATE - INTERVAL '30 days';

-- Completed courses
CREATE INDEX idx_progress_completed 
ON progress(user_id) 
WHERE completed_at IS NOT NULL 
AND status = 'completed';
```

### Index Maintenance

**Check Unused Indexes**:
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

**Drop Unused Indexes**:
```sql
-- Find indexes with 0 scans
SELECT indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_toast%';

-- Drop if safe (check first!)
DROP INDEX idx_old_unused_index;
```

**Reindex (Maintenance)**:
```sql
-- Rebuild index (locks table temporarily)
REINDEX INDEX idx_users_email;

-- Or reindex entire table
REINDEX TABLE users;
```

**Check Index Size**:
```sql
SELECT 
  indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Connection Pooling

### Backend Configuration

```javascript
// edutechlife-backend/src/db.js
const { Pool } = require('pg');

const pool = new Pool({
  // Connection details
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  
  // Pool settings
  max: 20,                    // Max connections
  min: 2,                     // Min connections
  idleTimeoutMillis: 30000,  // 30s idle timeout
  connectionTimeoutMillis: 5000,  // 5s connect timeout
  
  // SSL (required for Supabase)
  ssl: {
    rejectUnauthorized: false,
  },
});

// Monitor pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  Sentry.captureException(err);
});

pool.on('connect', () => {
  console.debug('New connection created');
});

pool.on('remove', () => {
  console.debug('Connection removed from pool');
});

// Log pool stats every minute
setInterval(() => {
  console.log(`Pool stats: ${pool.totalCount} total, ${pool.idleCount} idle, ${pool.totalCount - pool.idleCount} active`);
}, 60000);

module.exports = pool;
```

### Monitoring Pool Health

```javascript
// Middleware to track pool status
app.use((req, res, next) => {
  const totalCount = pool.totalCount;
  const idleCount = pool.idleCount;
  const activeCount = totalCount - idleCount;
  const poolUsage = Math.round((activeCount / totalCount) * 100);
  
  // Set headers for monitoring
  res.set('X-DB-Pool-Usage', `${poolUsage}%`);
  res.set('X-DB-Active-Connections', activeCount);
  
  // Alert if pool is 80%+ full
  if (poolUsage > 80) {
    console.warn(`⚠️  Pool usage high: ${poolUsage}%`);
    Sentry.captureMessage('Pool usage high', 'warning', {
      tags: { pool_usage: poolUsage },
    });
  }
  
  next();
});
```

### Connection Pool Sizing

**Formula**:
```
connections = (cores × 2) + memory_gb
```

**Examples**:
- Small (2 cores, 1GB): 2×2 + 1 = 5 connections
- Medium (4 cores, 4GB): 4×2 + 4 = 12 connections
- Large (8 cores, 8GB): 8×2 + 8 = 24 connections

**For EdutechLife**:
- Recommendation: 20 max connections
- Minimum: 2 idle connections
- Timeout: 30 seconds

---

## Performance Metrics

### Key Metrics to Track

#### 1. Query Performance

```sql
-- Average query time by query type
SELECT 
  LEFT(query, 60) as query_short,
  COUNT(*) as executions,
  ROUND(AVG(mean_time), 2) as avg_ms,
  ROUND(MAX(max_time), 2) as max_ms
FROM pg_stat_statements
GROUP BY query
ORDER BY COUNT(*) DESC
LIMIT 20;
```

#### 2. Table Sizes

```sql
-- Largest tables
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### 3. Index Effectiveness

```sql
-- Indexes used in last week
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan > 0
  AND pg_stat_get_vacuum_count(indexrelid) = 0
ORDER BY idx_scan DESC;
```

#### 4. Replication Lag (if applicable)

```sql
-- Check replication status
SELECT 
  now() - pg_last_xact_replay_timestamp() as replication_lag;
```

**Alert if lag > 10 seconds**

### Metrics Dashboard

Create dashboard in Grafana/DataDog:

```
┌─────────────────────────────────────┐
│ Database Metrics Dashboard          │
├─────────────────────────────────────┤
│                                     │
│ Connections: ████░░░░░ 12/20       │
│ Queries/sec: ╱╲╱╲╱╲ ~50 q/s        │
│ Slow Queries: ▁▂▃▅ 3 queries       │
│ Replication Lag: 0.23s              │
│ Table Size: 245 MB                  │
│ Index Size: 89 MB                   │
│                                     │
└─────────────────────────────────────┘
```

---

## Backup & Recovery

### Automated Backups (Supabase)

**Configuration**:
1. Go to Database → Backups
2. Set daily backup schedule
3. Set retention: 7 days (free) or 30 days (paid)
4. Enable backups

**Backup Points**:
- Daily automated (1:00 AM UTC)
- Retention: 7 days
- RTO: < 1 hour
- RPO: < 24 hours

### Manual Backup

```bash
# Create backup (local)
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup.sql

# Restore from backup
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup.sql
```

### Test Recovery

**Monthly disaster recovery drill**:

1. Create test database
2. Restore latest backup
3. Run smoke tests
4. Verify data integrity
5. Document recovery time
6. Drop test database

---

## Troubleshooting

### High CPU Usage

1. **Check long-running queries**:
   ```sql
   SELECT pid, usename, query, state, query_start
   FROM pg_stat_activity
   WHERE state != 'idle'
   ORDER BY query_start;
   ```

2. **Kill long-running query** (if needed):
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE pid <> pg_backend_pid()
     AND query_start < NOW() - INTERVAL '30 minutes';
   ```

3. **Check for full table scans**:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM large_table WHERE unconditioned_column = 'value';
   ```

### High Memory Usage

1. **Check buffer cache**:
   ```sql
   SELECT 
     (heap_blks_read + heap_blks_hit) as total_blocks,
     100 * heap_blks_hit / (heap_blks_read + heap_blks_hit) as cache_hit_ratio
   FROM pg_statio_user_tables;
   ```

2. **Target**: Cache hit ratio > 99%

3. **If low**: Increase `shared_buffers` parameter

### Connection Pool Exhaustion

1. **Find query causing hang**:
   ```sql
   SELECT pid, query, state, query_start
   FROM pg_stat_activity
   ORDER BY query_start;
   ```

2. **Kill idle connections**:
   ```sql
   SELECT pg_terminate_backend(pid)
   FROM pg_stat_activity
   WHERE state = 'idle'
     AND query_start < NOW() - INTERVAL '1 hour';
   ```

3. **Check for connection leaks in app**

### Replication Lag

1. **Check lag**:
   ```sql
   SELECT NOW() - pg_last_xact_replay_timestamp() as lag;
   ```

2. **If > 10s**: Check network between servers
3. **Check WAL archiving**: `SHOW wal_level;`

---

## Optimization Checklist

- [ ] Enable slow query logging (100ms threshold)
- [ ] Create indexes for foreign keys
- [ ] Create indexes for WHERE clause columns
- [ ] Create composite indexes for JOINs
- [ ] Remove unused indexes
- [ ] Set appropriate VACUUM settings
- [ ] Set up monitoring for slow queries
- [ ] Configure connection pooling
- [ ] Enable REPLICATION if needed
- [ ] Test backup & recovery
- [ ] Monitor query patterns weekly
- [ ] Review index effectiveness monthly
- [ ] Run ANALYZE to update statistics

---

## Quick Commands

```bash
# View active connections
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
  "SELECT pid, usename, application_name, state FROM pg_stat_activity;"

# Find locks
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
  "SELECT * FROM pg_locks WHERE NOT granted;"

# Vacuum and analyze
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "VACUUM ANALYZE;"

# Check database size
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c \
  "SELECT pg_size_pretty(pg_database_size('edutechlife'));"
```

---

## References

- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance.html)
- [EXPLAIN Documentation](https://www.postgresql.org/docs/current/sql-explain.html)
- [Index Best Practices](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
