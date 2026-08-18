#!/usr/bin/env node

/**
 * Load Testing Script for Heartbeat Endpoint
 *
 * Simulates concurrent heartbeat requests from 10,000 students
 * to measure throughput, latency, and resource usage.
 *
 * Usage:
 *   npm run load-test:heartbeat
 *   npm run load-test:heartbeat -- --students 5000 --interval 90 --duration 600
 *
 * Options:
 *   --students N     Number of concurrent students (default: 10000)
 *   --interval MS    Heartbeat interval in seconds (default: 90)
 *   --duration MS    Test duration in seconds (default: 300)
 *   --url URL        Base API URL (default: http://localhost:3000)
 */

const http = require('http');
const https = require('https');
const url = require('url');

// Parse command-line arguments
const args = process.argv.slice(2);
let config = {
  students: 10000,
  interval: 90, // seconds
  duration: 300, // seconds (5 minutes)
  url: process.env.API_URL || 'http://localhost:3000',
};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i].replace(/^--/, '');
  const value = args[i + 1];
  if (key === 'students') config.students = parseInt(value);
  if (key === 'interval') config.interval = parseInt(value);
  if (key === 'duration') config.duration = parseInt(value);
  if (key === 'url') config.url = value;
}

// Metrics tracking
const metrics = {
  startTime: Date.now(),
  requestsSent: 0,
  responsesReceived: 0,
  errors: 0,
  latencies: [],
  statusCodes: {},
  errorMessages: {},
};

// Mock JWT token (should be replaced with real token in production)
// Format: header.payload.signature
const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE2OTI3MDAwMDB9.signature';

/**
 * Make a heartbeat request to the API
 */
function makeHeartbeatRequest(studentId, token) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(`${config.url}/api/smartboard/heartbeat`);
    const client = parsedUrl.protocol === 'https:' ? https : http;

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      timeout: 5000,
    };

    const startTime = Date.now();
    let responseData = '';

    const req = client.request(options, (res) => {
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        const latency = Date.now() - startTime;
        metrics.latencies.push(latency);
        metrics.responsesReceived++;

        const statusCode = res.statusCode;
        metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;

        if (statusCode >= 400) {
          metrics.errors++;
          const errorMsg = `${statusCode}: ${responseData.substring(0, 100)}`;
          metrics.errorMessages[errorMsg] = (metrics.errorMessages[errorMsg] || 0) + 1;
        }

        resolve({ statusCode, latency });
      });
    });

    req.on('error', (error) => {
      metrics.errors++;
      const errorMsg = `${error.code || error.message}`;
      metrics.errorMessages[errorMsg] = (metrics.errorMessages[errorMsg] || 0) + 1;
      metrics.responsesReceived++;
      resolve({ error: error.message, latency: -1 });
    });

    req.on('timeout', () => {
      metrics.errors++;
      metrics.errorMessages['Timeout'] = (metrics.errorMessages['Timeout'] || 0) + 1;
      metrics.responsesReceived++;
      req.destroy();
      resolve({ error: 'Timeout', latency: -1 });
    });

    req.write(JSON.stringify({ studentId }));
    req.end();
  });
}

/**
 * Simulate students sending heartbeats
 */
async function simulateHeartbeats() {
  console.log('=========================================');
  console.log('Load Testing: Heartbeat Endpoint');
  console.log('=========================================');
  console.log(`API URL: ${config.url}`);
  console.log(`Concurrent Students: ${config.students}`);
  console.log(`Heartbeat Interval: ${config.interval}s`);
  console.log(`Test Duration: ${config.duration}s`);
  console.log('');

  const endTime = metrics.startTime + config.duration * 1000;

  // Distribute heartbeats across all students
  const heartbeatPromises = [];
  const intervalMs = (config.interval * 1000) / config.students;

  console.log(`Sending ${config.students} heartbeats at intervals...`);
  console.log('');

  let studentIdCounter = 0;

  const sendHeartbeatBatch = async () => {
    for (let i = 0; i < config.students; i++) {
      if (Date.now() > endTime) break;

      const studentId = `test-student-${i}`;

      // Send request with slight delay between them
      setTimeout(() => {
        metrics.requestsSent++;
        makeHeartbeatRequest(studentId, mockToken);
      }, i * intervalMs);

      // Check if we've exceeded test duration
      if (Date.now() > endTime) break;
    }
  };

  // Keep sending heartbeats until duration expires
  while (Date.now() < endTime) {
    await sendHeartbeatBatch();

    // Wait before next batch
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Wait for all responses to complete
  console.log('Waiting for remaining responses...');
  let waitCount = 0;
  while (metrics.responsesReceived < metrics.requestsSent && waitCount < 30) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    waitCount++;
  }

  printMetrics();
}

/**
 * Calculate percentile from sorted array
 */
function getPercentile(arr, percentile) {
  if (arr.length === 0) return 0;
  const sorted = arr.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Print test results
 */
function printMetrics() {
  const duration = (Date.now() - metrics.startTime) / 1000;
  const successfulRequests = metrics.responsesReceived - metrics.errors;
  const successRate = ((successfulRequests / metrics.requestsSent) * 100).toFixed(2);

  const avgLatency = metrics.latencies.length > 0
    ? (metrics.latencies.reduce((a, b) => a + b, 0) / metrics.latencies.length).toFixed(2)
    : 'N/A';

  const p95Latency = getPercentile(metrics.latencies, 95);
  const p99Latency = getPercentile(metrics.latencies, 99);
  const maxLatency = Math.max(...metrics.latencies);

  const throughput = (metrics.requestsSent / duration).toFixed(2);

  console.log('');
  console.log('=========================================');
  console.log('LOAD TEST RESULTS');
  console.log('=========================================');
  console.log('');

  console.log('Performance Metrics:');
  console.log(`  Requests Sent:      ${metrics.requestsSent}`);
  console.log(`  Responses Received: ${metrics.responsesReceived}`);
  console.log(`  Successful:         ${successfulRequests} (${successRate}%)`);
  console.log(`  Errors:             ${metrics.errors}`);
  console.log(`  Test Duration:      ${duration.toFixed(2)}s`);
  console.log(`  Throughput:         ${throughput} req/s`);
  console.log('');

  console.log('Latency (ms):');
  console.log(`  Average:            ${avgLatency}`);
  console.log(`  P95:                ${p95Latency}`);
  console.log(`  P99:                ${p99Latency}`);
  console.log(`  Max:                ${maxLatency}`);
  console.log('');

  console.log('Response Status Codes:');
  Object.entries(metrics.statusCodes)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .forEach(([code, count]) => {
      console.log(`  ${code}: ${count}`);
    });

  if (Object.keys(metrics.errorMessages).length > 0) {
    console.log('');
    console.log('Error Messages:');
    Object.entries(metrics.errorMessages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10) // Top 10 errors
      .forEach(([msg, count]) => {
        console.log(`  ${msg}: ${count}x`);
      });
  }

  console.log('');
  console.log('=========================================');

  // Exit with code 0 if success rate is high, 1 otherwise
  process.exit(parseFloat(successRate) > 95 ? 0 : 1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nInterrupted by user');
  printMetrics();
});

// Run the load test
simulateHeartbeats().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
