import React from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import './K6.css';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'first-test', label: 'First Test' },
  { id: 'http-requests', label: 'HTTP Requests' },
  { id: 'checks-thresholds', label: 'Checks & Thresholds' },
  { id: 'load-test-types', label: 'Load Test Types' },
  { id: 'custom-metrics', label: 'Custom Metrics' },
  { id: 'test-lifecycle', label: 'Test Lifecycle' },
  { id: 'groups-tags', label: 'Groups & Tags' },
  { id: 'full-example', label: 'Full Example' },
];

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const installBrewCode = `# macOS / Linux via Homebrew
brew install k6

# Windows via Chocolatey
choco install k6

# Windows via winget
winget install k6 --source winget

# Docker (no installation needed)
docker run --rm -i grafana/k6 run - <script.js

# Download the official binary manually
# https://github.com/grafana/k6/releases`;

const firstTestCode = `import http from 'k6/http';
import { sleep } from 'k6';

// Options configure how the test runs
export const options = {
  // Simulate 10 virtual users
  vus: 10,
  // Run for 30 seconds
  duration: '30s',
};

// The default function is the entry point for each virtual user.
// Every VU executes this function in a loop for the entire duration.
export default function () {
  // Make a GET request
  http.get('https://test-api.k6.io/public/crocodiles/');

  // Pause for 1 second between iterations (simulates user think time)
  sleep(1);
}`;

const runTestCode = `# Run the test
k6 run script.js

# Run with more virtual users (override options)
k6 run --vus 50 --duration 1m script.js

# Run and output results to a JSON file
k6 run --out json=results.json script.js

# Run inside Docker
docker run --rm -i grafana/k6 run - <script.js`;

const httpGetCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  // Simple GET request
  const res = http.get('https://test-api.k6.io/public/crocodiles/');

  // GET with custom headers
  const params = {
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer my-token-here',
    },
    tags: { name: 'GetCrocodiles' },
  };
  const resWithHeaders = http.get('https://test-api.k6.io/public/crocodiles/', params);

  // GET with query parameters
  const resFiltered = http.get('https://test-api.k6.io/public/crocodiles/?format=json');

  sleep(1);
}`;

const httpPostCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  const url = 'https://test-api.k6.io/auth/token/login/';

  // POST with JSON body
  const payload = JSON.stringify({
    username: 'testuser',
    password: 'superSecure123!',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'login succeeded': (r) => r.status === 200,
    'received access token': (r) => r.json('access') !== undefined,
  });

  sleep(1);
}`;

const httpPutDeleteCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const baseUrl = 'https://test-api.k6.io/my/crocodiles/';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer <token>',
  };

  // PUT - Full update of a resource
  const putPayload = JSON.stringify({
    name: 'Updated Croc',
    sex: 'M',
    date_of_birth: '1990-01-01',
  });

  const putRes = http.put(\`\${baseUrl}1/\`, putPayload, { headers });

  check(putRes, {
    'PUT status is 200': (r) => r.status === 200,
    'name was updated': (r) => r.json('name') === 'Updated Croc',
  });

  // PATCH - Partial update of a resource
  const patchPayload = JSON.stringify({ name: 'Patched Croc' });
  const patchRes = http.patch(\`\${baseUrl}1/\`, patchPayload, { headers });

  check(patchRes, {
    'PATCH status is 200': (r) => r.status === 200,
  });

  // DELETE - Remove a resource
  const delRes = http.del(\`\${baseUrl}1/\`, null, { headers });

  check(delRes, {
    'DELETE status is 204': (r) => r.status === 204,
  });

  sleep(1);
}`;

const checksCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');

  // Checks validate response properties.
  // They do NOT abort the test on failure -- they simply track pass/fail rates.
  check(res, {
    // Status code check
    'status is 200': (r) => r.status === 200,

    // Response time check
    'response time < 500ms': (r) => r.timings.duration < 500,

    // Body content checks
    'body is not empty': (r) => r.body.length > 0,
    'body contains crocodile data': (r) => {
      const body = r.json();
      return Array.isArray(body) && body.length > 0;
    },

    // Header checks
    'content-type is JSON': (r) =>
      r.headers['Content-Type'].includes('application/json'),
  });

  sleep(1);
}`;

const thresholdsCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '1m',

  // Thresholds define pass/fail criteria for the entire test.
  // If any threshold is breached, k6 exits with a non-zero code (great for CI/CD).
  thresholds: {
    // 95% of requests must complete below 500ms
    http_req_duration: ['p(95)<500'],

    // 99% of requests must complete below 1500ms
    'http_req_duration': ['p(95)<500', 'p(99)<1500'],

    // Request failure rate must be below 1%
    http_req_failed: ['rate<0.01'],

    // At least 95% of checks must pass
    checks: ['rate>0.95'],

    // Custom threshold on a specific request using tags
    'http_req_duration{name:GetCrocodiles}': ['p(95)<400'],
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/', {
    tags: { name: 'GetCrocodiles' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);
}`;

const smokeTestCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

// Smoke Test: Verify the system works with minimal load.
// Run 1 user for 1 minute to catch basic failures.
export const options = {
  vus: 1,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<600'],
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}`;

const loadTestCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

// Load Test: Assess performance under expected normal load.
// Ramp up to 100 users, sustain, then ramp down.
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users over 2 min
    { duration: '5m', target: 50 },   // Stay at 50 users for 5 min
    { duration: '2m', target: 100 },  // Ramp up to 100 users over 2 min
    { duration: '5m', target: 100 },  // Stay at 100 users for 5 min
    { duration: '2m', target: 0 },    // Ramp down to 0 over 2 min
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}`;

const stressTestCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

// Stress Test: Push the system beyond normal load to find its breaking point.
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // Normal load
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },   // Above normal
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },   // Pushing limits
    { duration: '5m', target: 300 },
    { duration: '2m', target: 400 },   // Breaking point?
    { duration: '5m', target: 400 },
    { duration: '5m', target: 0 },     // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'],  // More lenient under stress
    http_req_failed: ['rate<0.05'],     // Allow up to 5% failure
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}`;

const spikeTestCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

// Spike Test: Simulate a sudden, massive surge in traffic.
// Tests how the system recovers after an extreme burst.
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up
    { duration: '1m',  target: 10 },   // Normal traffic
    { duration: '10s', target: 500 },  // SPIKE! 500 users in 10 seconds
    { duration: '3m',  target: 500 },  // Stay at peak
    { duration: '10s', target: 10 },   // Spike ends abruptly
    { duration: '3m',  target: 10 },   // Recovery period
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],  // Very lenient during spike
    http_req_failed: ['rate<0.10'],     // Allow up to 10% failure
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}`;

const soakTestCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

// Soak Test: Run at normal load for an extended period.
// Identifies memory leaks, connection pool exhaustion, and degradation over time.
export const options = {
  stages: [
    { duration: '5m',  target: 100 },  // Ramp up
    { duration: '4h',  target: 100 },  // Sustain for 4 hours
    { duration: '5m',  target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://test-api.k6.io/public/crocodiles/');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}`;

const customMetricsCode = `import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

// Counter: Cumulative total that only goes up
const totalRequests = new Counter('total_requests');
const errorCount = new Counter('error_count');

// Gauge: A value that can go up and down (current state)
const activeItems = new Gauge('active_items');

// Rate: Percentage of non-zero values (pass/fail ratio)
const successRate = new Rate('success_rate');

// Trend: Collects values and calculates statistics (min, max, avg, percentiles)
const loginDuration = new Trend('login_duration');

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    // You can set thresholds on custom metrics too
    success_rate: ['rate>0.95'],
    login_duration: ['p(95)<800', 'avg<400'],
    error_count: ['count<10'],
  },
};

export default function () {
  // Track a counter
  totalRequests.add(1);

  const res = http.get('https://test-api.k6.io/public/crocodiles/');

  // Track success/failure rate
  const isSuccess = res.status === 200;
  successRate.add(isSuccess);

  if (!isSuccess) {
    errorCount.add(1);
  }

  // Track a gauge (snapshot value)
  const body = res.json();
  if (Array.isArray(body)) {
    activeItems.add(body.length);
  }

  // Track a trend (timing data)
  loginDuration.add(res.timings.duration);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}`;

const lifecycleCode = `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

// ----- setup() -----
// Runs ONCE before the test starts (before any VU code).
// Use it for: creating test data, authenticating, seeding a database.
// Whatever this function returns is passed to default() and teardown().
export function setup() {
  console.log('--- SETUP: Preparing test data ---');

  // Authenticate and get a token
  const loginRes = http.post(
    'https://test-api.k6.io/auth/token/login/',
    JSON.stringify({
      username: 'testuser',
      password: 'superSecure123!',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  const token = loginRes.json('access');
  console.log('Setup complete. Token acquired.');

  // Return data to be shared with default() and teardown()
  return { token: token };
}

// ----- default function -----
// Runs for EVERY virtual user, in a loop, for the test duration.
// Receives the data returned by setup() as its argument.
export default function (data) {
  const params = {
    headers: {
      Authorization: \`Bearer \${data.token}\`,
      'Content-Type': 'application/json',
    },
  };

  const res = http.get('https://test-api.k6.io/my/crocodiles/', params);

  check(res, {
    'authenticated request succeeded': (r) => r.status === 200,
  });

  sleep(1);
}

// ----- teardown() -----
// Runs ONCE after all VUs have finished.
// Use it for: cleaning up test data, logging summary info, sending notifications.
// Also receives the data returned by setup().
export function teardown(data) {
  console.log('--- TEARDOWN: Cleaning up ---');
  console.log(\`Token used during test: \${data.token ? 'Yes' : 'No'}\`);

  // Example: delete test data created during the test
  // http.del('https://test-api.k6.io/my/crocodiles/cleanup/', null, {
  //   headers: { Authorization: \`Bearer \${data.token}\` },
  // });

  console.log('Teardown complete.');
}`;

const groupsTagsCode = `import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    // Threshold on a specific group's requests using tags
    'http_req_duration{group:::Authentication}': ['p(95)<600'],
    'http_req_duration{group:::Browse Products}': ['p(95)<400'],
  },
};

export default function () {
  // Groups organize your test logic into named sections.
  // They appear in the output summary and can be used for targeted thresholds.

  group('Authentication', function () {
    const loginRes = http.post(
      'https://test-api.k6.io/auth/token/login/',
      JSON.stringify({
        username: 'testuser',
        password: 'superSecure123!',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { name: 'Login' },  // Custom tag for this request
      }
    );

    check(loginRes, {
      'login status is 200': (r) => r.status === 200,
    });
  });

  group('Browse Products', function () {
    // Tags let you filter and organize metrics.
    // You can add custom tags to any request.
    const listRes = http.get('https://test-api.k6.io/public/crocodiles/', {
      tags: { name: 'ListProducts', page: 'catalog' },
    });

    check(listRes, {
      'list status is 200': (r) => r.status === 200,
    });

    // Nested group
    group('View Product Detail', function () {
      const detailRes = http.get('https://test-api.k6.io/public/crocodiles/1/', {
        tags: { name: 'ProductDetail', page: 'detail' },
      });

      check(detailRes, {
        'detail status is 200': (r) => r.status === 200,
        'has product name': (r) => r.json('name') !== undefined,
      });
    });
  });

  sleep(1);
}`;

const fullExampleCode = `import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// ---------------------------------------------------------------------------
// Custom metrics
// ---------------------------------------------------------------------------
const loginDuration = new Trend('login_duration_ms');
const orderSuccessRate = new Rate('order_success_rate');
const totalOrders = new Counter('total_orders_placed');

// ---------------------------------------------------------------------------
// Test configuration
// ---------------------------------------------------------------------------
export const options = {
  scenarios: {
    // Scenario 1: Browsing users (high volume, read-only)
    browsers: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 50 },
        { duration: '3m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      exec: 'browseProducts',
      tags: { scenario: 'browse' },
    },

    // Scenario 2: Purchasing users (lower volume, write operations)
    buyers: {
      executor: 'constant-arrival-rate',
      rate: 10,             // 10 iterations per timeUnit
      timeUnit: '1s',       // = 10 requests per second
      duration: '3m',
      preAllocatedVUs: 20,
      maxVUs: 50,
      exec: 'purchaseFlow',
      tags: { scenario: 'purchase' },
      startTime: '30s',     // Start 30 seconds after test begins
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.05'],
    login_duration_ms: ['p(95)<1000', 'avg<500'],
    order_success_rate: ['rate>0.90'],
    checks: ['rate>0.95'],
  },
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
const BASE_URL = 'https://test-api.k6.io';

function authenticate() {
  const loginStart = Date.now();

  const res = http.post(
    \`\${BASE_URL}/auth/token/login/\`,
    JSON.stringify({
      username: \`testuser\${__VU}\`,
      password: 'superSecure123!',
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  loginDuration.add(Date.now() - loginStart);

  check(res, {
    'auth: login succeeded': (r) => r.status === 200,
    'auth: received token': (r) => r.json('access') !== undefined,
  });

  return res.json('access');
}

function getAuthHeaders(token) {
  return {
    headers: {
      Authorization: \`Bearer \${token}\`,
      'Content-Type': 'application/json',
    },
  };
}

// ---------------------------------------------------------------------------
// setup() - Runs once before the test
// ---------------------------------------------------------------------------
export function setup() {
  console.log('Setting up test environment...');

  // Verify the API is healthy before starting
  const healthCheck = http.get(\`\${BASE_URL}/public/crocodiles/\`);
  if (healthCheck.status !== 200) {
    throw new Error(\`API health check failed: \${healthCheck.status}\`);
  }

  console.log('API is healthy. Starting test.');
  return { startTime: Date.now() };
}

// ---------------------------------------------------------------------------
// Scenario 1: Browse products (read-only traffic)
// ---------------------------------------------------------------------------
export function browseProducts() {
  group('Browse - List All', function () {
    const res = http.get(\`\${BASE_URL}/public/crocodiles/\`, {
      tags: { name: 'ListAllProducts' },
    });

    check(res, {
      'browse: list status 200': (r) => r.status === 200,
      'browse: has items': (r) => r.json().length > 0,
    });
  });

  group('Browse - View Details', function () {
    // Randomly pick a product ID (1-8)
    const id = Math.floor(Math.random() * 8) + 1;

    const res = http.get(\`\${BASE_URL}/public/crocodiles/\${id}/\`, {
      tags: { name: 'ViewProductDetail' },
    });

    check(res, {
      'browse: detail status 200': (r) => r.status === 200,
      'browse: has name field': (r) => r.json('name') !== undefined,
      'browse: has valid age': (r) => r.json('age') >= 0,
    });
  });

  sleep(Math.random() * 3 + 1); // 1-4 second think time
}

// ---------------------------------------------------------------------------
// Scenario 2: Full purchase flow (authenticated, write operations)
// ---------------------------------------------------------------------------
export function purchaseFlow() {
  let token;

  group('Purchase - Login', function () {
    token = authenticate();
  });

  if (!token) {
    orderSuccessRate.add(false);
    return; // Cannot continue without authentication
  }

  const authParams = getAuthHeaders(token);

  group('Purchase - Browse', function () {
    const res = http.get(\`\${BASE_URL}/my/crocodiles/\`, authParams);

    check(res, {
      'purchase: my items status 200': (r) => r.status === 200,
    });
  });

  group('Purchase - Create Order', function () {
    const orderPayload = JSON.stringify({
      name: \`Croc-\${Date.now()}\`,
      sex: Math.random() > 0.5 ? 'M' : 'F',
      date_of_birth: '2000-05-15',
    });

    const res = http.post(
      \`\${BASE_URL}/my/crocodiles/\`,
      orderPayload,
      authParams
    );

    const success = res.status === 201;
    orderSuccessRate.add(success);

    if (success) {
      totalOrders.add(1);
    }

    check(res, {
      'purchase: create status 201': (r) => r.status === 201,
      'purchase: has id': (r) => r.json('id') !== undefined,
    });

    // Clean up: delete the created resource
    if (success && res.json('id')) {
      const delRes = http.del(
        \`\${BASE_URL}/my/crocodiles/\${res.json('id')}/\`,
        null,
        authParams
      );

      check(delRes, {
        'purchase: cleanup succeeded': (r) => r.status === 204,
      });
    }
  });

  sleep(Math.random() * 2 + 1); // 1-3 second think time
}

// ---------------------------------------------------------------------------
// teardown() - Runs once after the test
// ---------------------------------------------------------------------------
export function teardown(data) {
  const durationMs = Date.now() - data.startTime;
  const durationMin = (durationMs / 60000).toFixed(1);
  console.log(\`Test completed in \${durationMin} minutes.\`);
  console.log('Check the k6 summary output above for detailed results.');
}`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function K6() {
  const { progress, markPageComplete } = useAuth();
  const isCompleted = progress.k6;

  return (
    <div className="k6-page">
      <div className="page-layout container">
        <article className="page-content">

          {/* ---------- Hero / Intro ---------- */}
          <h1>K6 Performance Testing</h1>
          <p className="page-subtitle">
            A comprehensive guide to load testing and performance testing with Grafana K6.
            Learn how to write, run, and analyze performance tests for your APIs and services
            using K6's developer-friendly JavaScript scripting engine.
          </p>

          {/* ========== 1. Introduction ========== */}
          <section id="introduction">
            <span className="section-label section-label--green">Getting Started</span>
            <h2>Introduction</h2>

            <h3>What is K6?</h3>
            <p>
              K6 is an open-source load testing tool built by Grafana Labs. It lets you write
              performance tests in JavaScript, execute them from the command line, and analyze
              results with built-in metrics, thresholds, and integrations. K6 is designed for
              developers and QA engineers who want to shift performance testing left &mdash;
              making it part of the development workflow rather than an afterthought.
            </p>

            <h3>Why Use K6 for Performance Testing?</h3>
            <ul>
              <li>
                <strong>Developer-friendly</strong> &mdash; Write tests in JavaScript (ES6 modules).
                If you can write JS, you can write K6 tests. No XML, no GUIs, no proprietary languages.
              </li>
              <li>
                <strong>CLI-first</strong> &mdash; K6 runs entirely from the command line, making it
                trivial to integrate into CI/CD pipelines (GitHub Actions, GitLab CI, Jenkins, etc.).
              </li>
              <li>
                <strong>Powerful metrics engine</strong> &mdash; Built-in metrics for HTTP timings,
                throughput, error rates, and more. Create custom metrics for business-specific KPIs.
              </li>
              <li>
                <strong>Thresholds as code</strong> &mdash; Define pass/fail criteria directly in your
                test script. If thresholds are breached, K6 exits with a non-zero code &mdash; perfect
                for automated quality gates.
              </li>
              <li>
                <strong>Multiple load patterns</strong> &mdash; Constant VUs, ramping VUs, constant
                arrival rate, externally controlled &mdash; model any real-world traffic pattern.
              </li>
              <li>
                <strong>Lightweight and fast</strong> &mdash; Written in Go, K6 can generate massive
                load from a single machine. No JVM overhead, no heavy resource consumption.
              </li>
            </ul>

            <h3>How Does K6 Compare?</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>K6</th>
                    <th>JMeter</th>
                    <th>Gatling</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Scripting Language</td>
                    <td>JavaScript (ES6)</td>
                    <td>XML / GUI</td>
                    <td>Scala / Java</td>
                  </tr>
                  <tr>
                    <td>Learning Curve</td>
                    <td>Low (JS knowledge)</td>
                    <td>Medium (GUI-based)</td>
                    <td>Medium (Scala DSL)</td>
                  </tr>
                  <tr>
                    <td>CI/CD Integration</td>
                    <td>Native CLI, easy</td>
                    <td>Possible with plugins</td>
                    <td>Good (Maven/Gradle)</td>
                  </tr>
                  <tr>
                    <td>Resource Usage</td>
                    <td>Lightweight (Go-based)</td>
                    <td>Heavy (JVM)</td>
                    <td>Moderate (JVM)</td>
                  </tr>
                  <tr>
                    <td>Protocol Support</td>
                    <td>HTTP, WebSocket, gRPC</td>
                    <td>HTTP, JDBC, JMS, LDAP, FTP</td>
                    <td>HTTP, WebSocket, JMS</td>
                  </tr>
                  <tr>
                    <td>Real-time Results</td>
                    <td>CLI output + streaming to dashboards</td>
                    <td>GUI + listeners</td>
                    <td>HTML report after run</td>
                  </tr>
                  <tr>
                    <td>Browser Testing</td>
                    <td>K6 browser module (Chromium)</td>
                    <td>Not natively</td>
                    <td>Not natively</td>
                  </tr>
                  <tr>
                    <td>Cloud Option</td>
                    <td>Grafana Cloud K6</td>
                    <td>BlazeMeter</td>
                    <td>Gatling Enterprise</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Key Takeaway</strong>
              K6 excels when your team already writes JavaScript or TypeScript. Its code-first
              approach, lightweight execution, and native CI/CD friendliness make it the go-to
              choice for modern dev teams who want performance testing as part of their daily workflow.
            </div>
          </section>

          {/* ========== 2. Installation ========== */}
          <section id="installation">
            <span className="section-label section-label--green">Setup</span>
            <h2>Installation</h2>

            <p>
              K6 is a standalone binary &mdash; no runtime dependencies, no JVM, no Node.js required.
              You can install it via package managers, Docker, or by downloading the binary directly.
            </p>

            <CodeBlock code={installBrewCode} language="bash" fileName="terminal" />

            <h3>Verify Installation</h3>
            <p>
              After installation, verify K6 is working by checking its version:
            </p>

            <CodeBlock
              code={`# Check K6 version
k6 version

# Expected output:
# k6 v0.49.0 (go1.22.0, linux/amd64)`}
              language="bash"
              fileName="terminal"
            />

            <div className="tip-box">
              <strong>Tip</strong>
              For CI/CD pipelines, Docker is often the easiest approach. The official{' '}
              <code>grafana/k6</code> image contains everything needed. Mount your test scripts
              as a volume: <code>docker run --rm -v $(pwd):/scripts grafana/k6 run /scripts/test.js</code>
            </div>
          </section>

          {/* ========== 3. First Test ========== */}
          <section id="first-test">
            <span className="section-label section-label--green">Core</span>
            <h2>Writing Your First Test</h2>

            <p>
              A K6 test script is a standard JavaScript ES6 module. It must export a{' '}
              <code>default</code> function, which is the entry point that each virtual user (VU)
              executes in a loop. The <code>options</code> export configures how the test runs.
            </p>

            <CodeBlock code={firstTestCode} language="javascript" fileName="script.js" />

            <h3>Running the Test</h3>
            <p>
              Use the <code>k6 run</code> command to execute your script. You can override options
              via CLI flags, which is convenient for quick experiments.
            </p>

            <CodeBlock code={runTestCode} language="bash" fileName="terminal" />

            <h3>Understanding the Output</h3>
            <p>
              After a test completes, K6 prints a summary of all collected metrics. Here are the
              most important built-in metrics:
            </p>
            <ul>
              <li>
                <strong>http_req_duration</strong> &mdash; Total time for the request (DNS + connect
                + TLS + sending + waiting + receiving). This is the primary latency metric.
              </li>
              <li>
                <strong>http_req_failed</strong> &mdash; The rate of requests that returned a
                non-2xx/3xx status code.
              </li>
              <li>
                <strong>http_reqs</strong> &mdash; Total number of HTTP requests generated.
              </li>
              <li>
                <strong>iterations</strong> &mdash; How many times the default function completed
                across all VUs.
              </li>
              <li>
                <strong>vus</strong> &mdash; Current number of active virtual users.
              </li>
              <li>
                <strong>data_received / data_sent</strong> &mdash; Total amount of network data
                transferred.
              </li>
            </ul>

            <div className="info-box">
              <strong>Virtual Users vs. Requests</strong>
              A virtual user (VU) is a concurrent user executing your script. Each VU runs the
              default function in a loop. If you have 10 VUs and each iteration takes 2 seconds
              (including sleep), you will generate roughly 5 requests per second per VU, or about
              50 requests per second total.
            </div>
          </section>

          {/* ========== 4. HTTP Requests ========== */}
          <section id="http-requests">
            <span className="section-label section-label--blue">API</span>
            <h2>HTTP Requests</h2>

            <p>
              K6 provides the <code>http</code> module for making HTTP requests. It supports all
              standard methods (GET, POST, PUT, PATCH, DELETE) along with custom headers,
              authentication, and request tagging for granular metric analysis.
            </p>

            <h3>GET Requests</h3>
            <CodeBlock code={httpGetCode} language="javascript" fileName="get-example.js" />

            <h3>POST Requests</h3>
            <CodeBlock code={httpPostCode} language="javascript" fileName="post-example.js" />

            <h3>PUT, PATCH, and DELETE</h3>
            <CodeBlock code={httpPutDeleteCode} language="javascript" fileName="put-delete-example.js" />

            <div className="tip-box">
              <strong>Tip</strong>
              Always use <code>JSON.stringify()</code> for request bodies and set the{' '}
              <code>Content-Type</code> header to <code>application/json</code>. K6 does not
              automatically serialize objects like Axios or Fetch do in Node.js.
            </div>

            <div className="warning-box">
              <strong>Warning</strong>
              K6 uses its own JavaScript runtime (not Node.js), so you cannot use <code>require()</code>,
              npm packages, or Node.js built-in modules. Use K6's built-in modules (<code>k6/http</code>,{' '}
              <code>k6/crypto</code>, <code>k6/encoding</code>, etc.) instead. If you need external
              libraries, use K6 extensions or bundle them with webpack/esbuild.
            </div>
          </section>

          {/* ========== 5. Checks & Thresholds ========== */}
          <section id="checks-thresholds">
            <span className="section-label section-label--blue">Validation</span>
            <h2>Checks and Thresholds</h2>

            <p>
              <strong>Checks</strong> are assertions that validate individual response properties.
              They do not stop the test on failure &mdash; they record pass/fail rates.{' '}
              <strong>Thresholds</strong> are pass/fail criteria for the entire test run. If a
              threshold is breached, K6 exits with code 99, making it ideal for CI/CD quality gates.
            </p>

            <h3>Checks</h3>
            <p>
              Use <code>check()</code> to validate response status codes, body content, headers,
              and response times. Checks appear in the output summary as a pass/fail percentage.
            </p>
            <CodeBlock code={checksCode} language="javascript" fileName="checks-example.js" />

            <h3>Thresholds</h3>
            <p>
              Thresholds define the performance criteria your system must meet. If any threshold
              is breached, the test is considered a failure. This is the primary mechanism for
              automated performance gates in CI/CD.
            </p>
            <CodeBlock code={thresholdsCode} language="javascript" fileName="thresholds-example.js" />

            <h3>Threshold Syntax Reference</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Expression</th>
                    <th>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>p(95)&lt;500</code></td>
                    <td>95th percentile must be under 500ms</td>
                  </tr>
                  <tr>
                    <td><code>p(99)&lt;1500</code></td>
                    <td>99th percentile must be under 1500ms</td>
                  </tr>
                  <tr>
                    <td><code>avg&lt;200</code></td>
                    <td>Average value must be under 200ms</td>
                  </tr>
                  <tr>
                    <td><code>max&lt;3000</code></td>
                    <td>Maximum value must be under 3000ms</td>
                  </tr>
                  <tr>
                    <td><code>med&lt;300</code></td>
                    <td>Median (50th percentile) under 300ms</td>
                  </tr>
                  <tr>
                    <td><code>rate&lt;0.01</code></td>
                    <td>Rate metric must be under 1%</td>
                  </tr>
                  <tr>
                    <td><code>rate&gt;0.95</code></td>
                    <td>Rate metric must be above 95%</td>
                  </tr>
                  <tr>
                    <td><code>count&lt;100</code></td>
                    <td>Counter must be under 100</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Checks vs. Thresholds</strong>
              Checks are per-request validations that track pass rates. Thresholds are test-level
              pass/fail criteria. Use checks to validate responses, then use thresholds on the{' '}
              <code>checks</code> metric (e.g., <code>{'checks: [\'rate>0.95\']'}</code>) to
              fail the test if too many checks fail.
            </div>
          </section>

          {/* ========== 6. Load Test Types ========== */}
          <section id="load-test-types">
            <span className="section-label section-label--purple">Patterns</span>
            <h2>Load Test Types</h2>

            <p>
              Different testing scenarios require different load profiles. K6's <code>stages</code>{' '}
              option lets you define how virtual users ramp up, sustain, and ramp down over time.
              Here are the five fundamental load test types every performance engineer should know.
            </p>

            <h3>Smoke Test</h3>
            <p>
              A minimal test with 1 user to verify the system works correctly under zero load.
              Run this first before any heavier tests. If the smoke test fails, there is no point
              running larger tests.
            </p>
            <CodeBlock code={smokeTestCode} language="javascript" fileName="smoke-test.js" />

            <h3>Load Test</h3>
            <p>
              Simulates expected normal traffic. Use <code>stages</code> to gradually ramp up users,
              sustain the target load, and ramp down. This validates that the system meets SLAs
              under typical conditions.
            </p>
            <CodeBlock code={loadTestCode} language="javascript" fileName="load-test.js" />

            <h3>Stress Test</h3>
            <p>
              Gradually increases load beyond normal capacity to find the system's breaking point.
              The goal is to identify which component fails first (database, API, network) and how
              the system behaves under extreme pressure.
            </p>
            <CodeBlock code={stressTestCode} language="javascript" fileName="stress-test.js" />

            <h3>Spike Test</h3>
            <p>
              Simulates a sudden, massive surge in traffic &mdash; like a flash sale, viral social
              media post, or DDoS attack. Tests both the system's ability to handle the spike and
              its recovery behavior afterward.
            </p>
            <CodeBlock code={spikeTestCode} language="javascript" fileName="spike-test.js" />

            <h3>Soak Test</h3>
            <p>
              Runs at normal load for an extended period (hours). The goal is to uncover issues
              that only appear over time: memory leaks, connection pool exhaustion, disk space
              filling up, database slow queries accumulating, or garbage collection pauses.
            </p>
            <CodeBlock code={soakTestCode} language="javascript" fileName="soak-test.js" />

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Test Type</th>
                    <th>VUs</th>
                    <th>Duration</th>
                    <th>Goal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Smoke</td>
                    <td>1</td>
                    <td>1 minute</td>
                    <td>Verify basic functionality</td>
                  </tr>
                  <tr>
                    <td>Load</td>
                    <td>50-100</td>
                    <td>15-30 minutes</td>
                    <td>Validate normal traffic SLAs</td>
                  </tr>
                  <tr>
                    <td>Stress</td>
                    <td>100-400+</td>
                    <td>30-60 minutes</td>
                    <td>Find the breaking point</td>
                  </tr>
                  <tr>
                    <td>Spike</td>
                    <td>500+ (burst)</td>
                    <td>10-15 minutes</td>
                    <td>Test sudden traffic surges</td>
                  </tr>
                  <tr>
                    <td>Soak</td>
                    <td>50-100</td>
                    <td>4-12 hours</td>
                    <td>Find memory leaks and degradation</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tip-box">
              <strong>Tip</strong>
              Always run tests in this order: Smoke first, then Load, then Stress, then Spike, and
              finally Soak. Each test builds confidence before moving to the next level. If an
              earlier test fails, fix those issues before proceeding.
            </div>
          </section>

          {/* ========== 7. Custom Metrics ========== */}
          <section id="custom-metrics">
            <span className="section-label section-label--purple">Advanced</span>
            <h2>Custom Metrics</h2>

            <p>
              K6 provides four types of custom metrics that let you track business-specific KPIs
              beyond the built-in HTTP metrics. Custom metrics can also have thresholds applied
              to them, enabling precise performance gates.
            </p>

            <CodeBlock code={customMetricsCode} language="javascript" fileName="custom-metrics.js" />

            <h3>Metric Types</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Use Case</th>
                    <th>Aggregations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>Counter</code></td>
                    <td>Cumulative sum, only goes up</td>
                    <td>Total orders placed, total errors</td>
                    <td>count, rate</td>
                  </tr>
                  <tr>
                    <td><code>Gauge</code></td>
                    <td>Current value, can go up or down</td>
                    <td>Active connections, queue size</td>
                    <td>min, max, value</td>
                  </tr>
                  <tr>
                    <td><code>Rate</code></td>
                    <td>Percentage of non-zero values</td>
                    <td>Success rate, cache hit ratio</td>
                    <td>rate</td>
                  </tr>
                  <tr>
                    <td><code>Trend</code></td>
                    <td>Collects values and computes stats</td>
                    <td>Response times, processing durations</td>
                    <td>min, max, avg, med, p(90), p(95), p(99)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Custom Metrics in Thresholds</strong>
              Custom metrics work exactly like built-in metrics in thresholds. For example,{' '}
              <code>{'login_duration: [\'p(95)<800\']'}</code> will fail the test if 95% of
              login durations exceed 800ms. This lets you enforce SLAs on specific business operations,
              not just generic HTTP stats.
            </div>
          </section>

          {/* ========== 8. Test Lifecycle ========== */}
          <section id="test-lifecycle">
            <span className="section-label section-label--blue">Lifecycle</span>
            <h2>Test Lifecycle</h2>

            <p>
              K6 scripts have a well-defined lifecycle with three phases: <code>setup()</code>,
              the <code>default</code> function, and <code>teardown()</code>. Understanding this
              lifecycle is essential for properly initializing test data, sharing state, and
              cleaning up after tests.
            </p>

            <CodeBlock code={lifecycleCode} language="javascript" fileName="lifecycle-example.js" />

            <h3>Lifecycle Phases</h3>
            <ul>
              <li>
                <strong>Init code</strong> (module-level) &mdash; Executes once per VU when the script
                is loaded. Use this for importing modules and defining options. Do not make HTTP
                requests here.
              </li>
              <li>
                <strong>setup()</strong> &mdash; Runs once, before any VU code. Use it for
                authentication, creating test data, or verifying preconditions. Returns data that
                is passed to the default function and teardown.
              </li>
              <li>
                <strong>default function</strong> &mdash; Runs for every VU in a loop for the
                entire test duration. This is where your actual test logic goes.
              </li>
              <li>
                <strong>teardown()</strong> &mdash; Runs once, after all VUs finish. Use it for
                cleanup: deleting test data, sending notifications, or logging summary information.
              </li>
            </ul>

            <div className="warning-box">
              <strong>Warning</strong>
              The data returned by <code>setup()</code> is serialized to JSON and deserialized
              in each VU. This means you cannot pass complex objects like functions, classes, or
              circular references. Stick to simple data types: strings, numbers, arrays, and
              plain objects.
            </div>

            <div className="tip-box">
              <strong>Tip</strong>
              If <code>setup()</code> fails (throws an error), the entire test is aborted. Use
              this to your advantage &mdash; check preconditions in setup and fail fast if the
              environment is not ready, rather than running thousands of failing requests.
            </div>
          </section>

          {/* ========== 9. Groups & Tags ========== */}
          <section id="groups-tags">
            <span className="section-label section-label--blue">Organization</span>
            <h2>Groups and Tags</h2>

            <p>
              <strong>Groups</strong> let you organize your test logic into named sections, similar
              to test suites. <strong>Tags</strong> let you add custom key-value metadata to requests
              and metrics, enabling granular filtering and targeted thresholds.
            </p>

            <CodeBlock code={groupsTagsCode} language="javascript" fileName="groups-tags-example.js" />

            <h3>When to Use Groups vs. Tags</h3>
            <ul>
              <li>
                <strong>Groups</strong> &mdash; Use to organize logical sections of a user journey
                (e.g., "Login", "Browse", "Checkout"). Groups appear in the output summary as a
                hierarchy and automatically tag all requests inside them.
              </li>
              <li>
                <strong>Tags</strong> &mdash; Use to add metadata to individual requests for
                filtering in output and thresholds. Tags are more granular than groups and can
                be applied to any request independently.
              </li>
            </ul>

            <div className="info-box">
              <strong>Groups in Thresholds</strong>
              K6 automatically adds a <code>group</code> tag to all requests made inside a group.
              The format uses <code>::</code> as a separator:{' '}
              <code>{'\'http_req_duration{group:::Authentication}\': [\'p(95)<600\']'}</code>.
              This lets you set different performance criteria for different parts of the user journey.
            </div>
          </section>

          {/* ========== 10. Full Example ========== */}
          <section id="full-example">
            <span className="section-label section-label--green">Practice</span>
            <h2>Full Example: Real-World Scenario Test</h2>

            <p>
              Let us bring everything together with a comprehensive, production-ready K6 test. This
              example uses scenarios to simulate two different types of users simultaneously, custom
              metrics for business KPIs, groups for organization, the full test lifecycle, and
              thresholds for automated pass/fail criteria.
            </p>

            <CodeBlock code={fullExampleCode} language="javascript" fileName="full-scenario-test.js" />

            <h3>What This Example Demonstrates</h3>
            <ul>
              <li>
                <strong>Scenarios</strong> &mdash; Two independent workloads run simultaneously:{' '}
                <code>browsers</code> (read-only traffic with ramping VUs) and <code>buyers</code>{' '}
                (write operations at a constant arrival rate). This models realistic traffic where
                most users browse but only some purchase.
              </li>
              <li>
                <strong>Custom metrics</strong> &mdash; <code>loginDuration</code> (Trend),{' '}
                <code>orderSuccessRate</code> (Rate), and <code>totalOrders</code> (Counter) track
                business-specific KPIs alongside standard HTTP metrics.
              </li>
              <li>
                <strong>Lifecycle hooks</strong> &mdash; <code>setup()</code> validates the API
                is healthy before starting, and <code>teardown()</code> logs test duration.
              </li>
              <li>
                <strong>Groups</strong> &mdash; Each logical phase of the user journey is wrapped in
                a group for organized output and targeted thresholds.
              </li>
              <li>
                <strong>Shared helper functions</strong> &mdash; <code>authenticate()</code> and{' '}
                <code>getAuthHeaders()</code> are reused across scenarios, keeping the code DRY.
              </li>
              <li>
                <strong>Thresholds on custom metrics</strong> &mdash; The test fails if login
                duration exceeds targets, if order success rate drops below 90%, or if generic
                HTTP metrics breach their limits.
              </li>
              <li>
                <strong>Cleanup logic</strong> &mdash; The purchase flow deletes test data it
                creates, preventing test pollution in shared environments.
              </li>
            </ul>

            <div className="tip-box">
              <strong>Tip</strong>
              For larger projects, split your test into multiple files using ES6 module imports.
              Keep helpers, scenarios, and configuration in separate files. K6 supports standard{' '}
              <code>import/export</code> syntax for organizing complex test suites.
            </div>

            <div className="info-box">
              <strong>Next Steps</strong>
              Now that you have the fundamentals of K6, explore these advanced topics:
              browser-level testing with the K6 browser module, distributed testing with Grafana
              Cloud K6, streaming results to Grafana/InfluxDB/Prometheus, writing custom K6
              extensions in Go, and integrating K6 into your CI/CD pipeline as an automated
              quality gate.
            </div>
          </section>

          {/* Mark as Complete */}
          <div className="mark-complete-section">
            {isCompleted ? (
              <div className="mark-complete-done">
                <FiAward size={24} />
                <span>You've completed this module!</span>
              </div>
            ) : (
              <button className="mark-complete-btn" onClick={() => markPageComplete('k6')}>
                <FiCheckCircle size={20} />
                Mark as Complete
              </button>
            )}
          </div>

        </article>

        <aside className="page-sidebar">
          <Navigation sections={sections} />
        </aside>
      </div>
    </div>
  );
}

export default K6;
