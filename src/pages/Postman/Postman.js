import React from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import './Postman.css';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'http-requests', label: 'HTTP Requests' },
  { id: 'environment-variables', label: 'Environment Variables' },
  { id: 'pre-request-scripts', label: 'Pre-request Scripts' },
  { id: 'test-scripts', label: 'Test Scripts' },
  { id: 'collection-runner', label: 'Collection Runner' },
  { id: 'newman-cli', label: 'Newman CLI' },
  { id: 'performance-testing', label: 'Performance Testing' },
  { id: 'full-example', label: 'Full Example' },
];

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const getRequestCode = `// GET request to fetch a list of users
// URL: {{baseUrl}}/api/users?page=1&limit=10
//
// Headers:
//   Content-Type: application/json
//   Authorization: Bearer {{authToken}}
//
// Response (200 OK):
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}`;

const postRequestCode = `// POST request to create a new user
// URL: {{baseUrl}}/api/users
//
// Headers:
//   Content-Type: application/json
//   Authorization: Bearer {{authToken}}
//
// Request Body (raw JSON):
{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass123!",
  "role": "user",
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "language": "en"
  }
}

// Response (201 Created):
{
  "id": 3,
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "role": "user",
  "createdAt": "2025-01-15T10:30:00Z"
}`;

const putDeleteCode = `// PUT request to update a user
// URL: {{baseUrl}}/api/users/3
//
// Request Body (raw JSON):
{
  "name": "Alice Johnson-Smith",
  "preferences": {
    "theme": "light",
    "notifications": false,
    "language": "en"
  }
}

// Response (200 OK):
{
  "id": 3,
  "name": "Alice Johnson-Smith",
  "email": "alice@example.com",
  "role": "user",
  "updatedAt": "2025-01-15T11:00:00Z"
}

// -----------------------------------------------

// DELETE request to remove a user
// URL: {{baseUrl}}/api/users/3
//
// Headers:
//   Authorization: Bearer {{authToken}}
//
// Response (204 No Content)
// Empty response body`;

const environmentVariablesCode = `// Environment: "Development"
{
  "baseUrl": "http://localhost:3000",
  "authToken": "",
  "testUserEmail": "dev-test@example.com",
  "testUserPassword": "devpass123",
  "apiVersion": "v1"
}

// Environment: "Staging"
{
  "baseUrl": "https://staging-api.example.com",
  "authToken": "",
  "testUserEmail": "staging-test@example.com",
  "testUserPassword": "stagingpass456",
  "apiVersion": "v1"
}

// Environment: "Production"
{
  "baseUrl": "https://api.example.com",
  "authToken": "",
  "testUserEmail": "readonly-test@example.com",
  "testUserPassword": "prodReadOnly789",
  "apiVersion": "v1"
}`;

const dynamicVariablesCode = `// Postman built-in dynamic variables (use directly in request fields):
//
// {{$guid}}          -> "d96d6bba-9e8c-4b7d-b5b7-0fcaa8e3c3a3"
// {{$timestamp}}     -> 1705312200
// {{$isoTimestamp}}  -> "2025-01-15T10:30:00.000Z"
// {{$randomInt}}     -> 742
// {{$randomUUID}}    -> "6929bb52-3ab2-448a-9796-d6480ecad36b"
//
// {{$randomFirstName}}  -> "Alice"
// {{$randomLastName}}   -> "Johnson"
// {{$randomEmail}}      -> "alice.johnson@example.com"
// {{$randomPhoneNumber}} -> "+1-555-0142"
// {{$randomCity}}       -> "San Francisco"
// {{$randomCountry}}    -> "United States"
//
// {{$randomColor}}   -> "blue"
// {{$randomBoolean}} -> true
// {{$randomPrice}}   -> "42.99"

// Using dynamic variables in a POST body:
{
  "orderId": "{{$guid}}",
  "customer": {
    "firstName": "{{$randomFirstName}}",
    "lastName": "{{$randomLastName}}",
    "email": "{{$randomEmail}}"
  },
  "amount": "{{$randomPrice}}",
  "createdAt": "{{$isoTimestamp}}"
}`;

const collectionVariablesCode = `// Setting variables at different scopes in scripts:

// --- Collection variables (shared across all requests in a collection) ---
pm.collectionVariables.set("apiKey", "abc-123-def-456");
pm.collectionVariables.get("apiKey");

// --- Environment variables (specific to selected environment) ---
pm.environment.set("authToken", "eyJhbGciOiJIUzI1NiIs...");
pm.environment.get("authToken");

// --- Global variables (available across ALL collections) ---
pm.globals.set("appVersion", "2.5.0");
pm.globals.get("appVersion");

// --- Local variables (only available in the current request/script) ---
pm.variables.set("tempValue", "only-for-this-request");
pm.variables.get("tempValue");

// Variable resolution order (highest to lowest priority):
// 1. Local (pm.variables)
// 2. Data (from Collection Runner CSV/JSON)
// 3. Environment (pm.environment)
// 4. Collection (pm.collectionVariables)
// 5. Global (pm.globals)`;

const preRequestAuthCode = `// Pre-request Script: Generate an auth token before the request runs
// This script runs BEFORE the main request is sent

const loginUrl = pm.environment.get("baseUrl") + "/api/auth/login";

const loginPayload = {
    email: pm.environment.get("testUserEmail"),
    password: pm.environment.get("testUserPassword")
};

pm.sendRequest({
    url: loginUrl,
    method: "POST",
    header: {
        "Content-Type": "application/json"
    },
    body: {
        mode: "raw",
        raw: JSON.stringify(loginPayload)
    }
}, function (err, response) {
    if (err) {
        console.error("Login failed:", err);
        return;
    }

    const jsonData = response.json();

    // Store the token in the environment for subsequent requests
    pm.environment.set("authToken", jsonData.token);
    pm.environment.set("refreshToken", jsonData.refreshToken);
    pm.environment.set("tokenExpiry", jsonData.expiresAt);

    console.log("Auth token refreshed successfully");
});`;

const preRequestDataSetupCode = `// Pre-request Script: Dynamic data generation and setup

// Generate a unique test user for this request
const timestamp = Date.now();
const uniqueEmail = \`test-user-\${timestamp}@example.com\`;

pm.environment.set("testEmail", uniqueEmail);
pm.environment.set("testName", "Test User " + timestamp);

// Generate a random product SKU
const sku = "SKU-" + Math.random().toString(36).substring(2, 10).toUpperCase();
pm.collectionVariables.set("productSku", sku);

// Conditional logic: skip token refresh if token is still valid
const tokenExpiry = pm.environment.get("tokenExpiry");
const now = Math.floor(Date.now() / 1000);

if (tokenExpiry && parseInt(tokenExpiry) > now + 60) {
    console.log("Token still valid, skipping refresh");
} else {
    console.log("Token expired or missing, refreshing...");
    // (call pm.sendRequest to refresh the token here)
}

// Set a request-level timeout header
pm.request.headers.add({
    key: "X-Request-ID",
    value: pm.variables.replaceIn("{{$guid}}")
});`;

const testScriptsBasicCode = `// Test Scripts: Written in the "Tests" tab, run AFTER the response is received

// --- Basic status code checks ---
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Status code is in 2xx range", function () {
    pm.expect(pm.response.code).to.be.within(200, 299);
});

// --- Response time ---
pm.test("Response time is under 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// --- Headers ---
pm.test("Content-Type is JSON", function () {
    pm.response.to.have.header("Content-Type", "application/json; charset=utf-8");
});

pm.test("Response has X-Request-ID header", function () {
    pm.expect(pm.response.headers.get("X-Request-ID")).to.not.be.empty;
});`;

const testScriptsBodyCode = `// --- Parse and validate response body ---
const jsonData = pm.response.json();

pm.test("Response has correct structure", function () {
    pm.expect(jsonData).to.have.property("data");
    pm.expect(jsonData).to.have.property("pagination");
    pm.expect(jsonData.data).to.be.an("array");
});

pm.test("Users have required fields", function () {
    jsonData.data.forEach(function (user) {
        pm.expect(user).to.have.all.keys("id", "name", "email", "role");
        pm.expect(user.id).to.be.a("number");
        pm.expect(user.name).to.be.a("string").and.not.empty;
        pm.expect(user.email).to.match(/^[^@]+@[^@]+\\.[^@]+$/);
        pm.expect(user.role).to.be.oneOf(["admin", "user", "moderator"]);
    });
});

pm.test("Pagination values are correct", function () {
    pm.expect(jsonData.pagination.page).to.equal(1);
    pm.expect(jsonData.pagination.limit).to.equal(10);
    pm.expect(jsonData.pagination.total).to.be.a("number");
    pm.expect(jsonData.pagination.pages).to.be.at.least(1);
});

// --- Store data for the next request ---
if (jsonData.data.length > 0) {
    pm.environment.set("firstUserId", jsonData.data[0].id);
    pm.environment.set("firstUserEmail", jsonData.data[0].email);
}

// --- Conditional test based on environment ---
if (pm.environment.get("env") === "production") {
    pm.test("Production: no test accounts in response", function () {
        jsonData.data.forEach(function (user) {
            pm.expect(user.email).to.not.contain("test");
        });
    });
}`;

const testScriptsSchemaCode = `// --- JSON Schema validation ---
const schema = {
    type: "object",
    required: ["data", "pagination"],
    properties: {
        data: {
            type: "array",
            items: {
                type: "object",
                required: ["id", "name", "email", "role"],
                properties: {
                    id: { type: "integer" },
                    name: { type: "string", minLength: 1 },
                    email: { type: "string", format: "email" },
                    role: {
                        type: "string",
                        enum: ["admin", "user", "moderator"]
                    }
                }
            }
        },
        pagination: {
            type: "object",
            required: ["page", "limit", "total", "pages"],
            properties: {
                page: { type: "integer", minimum: 1 },
                limit: { type: "integer", minimum: 1 },
                total: { type: "integer", minimum: 0 },
                pages: { type: "integer", minimum: 1 }
            }
        }
    }
};

pm.test("Response matches JSON schema", function () {
    pm.response.to.have.jsonSchema(schema);
});`;

const collectionRunnerCode = `// Data file for Collection Runner (users.csv):
// name,email,role,expectedStatus
// John Doe,john@example.com,admin,200
// Jane Smith,jane@example.com,user,200
// ,invalid-email,user,400
// Bob Wilson,bob@example.com,superadmin,400
//
// ----- OR as JSON (users.json): -----
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "expectedStatus": 200
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user",
    "expectedStatus": 200
  },
  {
    "name": "",
    "email": "invalid-email",
    "role": "user",
    "expectedStatus": 400
  },
  {
    "name": "Bob Wilson",
    "email": "bob@example.com",
    "role": "superadmin",
    "expectedStatus": 400
  }
]`;

const collectionRunnerTestCode = `// Request Body (using data variables from CSV/JSON):
// POST {{baseUrl}}/api/users
{
    "name": "{{name}}",
    "email": "{{email}}",
    "role": "{{role}}"
}

// Test Script (validates against expected status from data file):
pm.test("Status code matches expected: " + pm.iterationData.get("expectedStatus"), function () {
    const expectedStatus = parseInt(pm.iterationData.get("expectedStatus"));
    pm.response.to.have.status(expectedStatus);
});

pm.test("Iteration " + pm.info.iteration + ": Response is valid", function () {
    if (pm.response.code === 200 || pm.response.code === 201) {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("id");
        pm.expect(jsonData.name).to.equal(pm.iterationData.get("name"));
    } else {
        const jsonData = pm.response.json();
        pm.expect(jsonData).to.have.property("error");
    }
});

// Log iteration details to console
console.log(
    "Iteration " + pm.info.iteration +
    " | User: " + pm.iterationData.get("name") +
    " | Status: " + pm.response.code
);`;

const newmanInstallCode = `# Install Newman globally
npm install -g newman

# Or as a project dev dependency
npm install --save-dev newman

# Install the HTML reporter for rich reports
npm install -g newman-reporter-htmlextra

# Run a collection from a file
newman run my-collection.json

# Run with an environment file
newman run my-collection.json -e staging-environment.json

# Run with a data file (CSV or JSON)
newman run my-collection.json -d test-data.csv

# Run with multiple iterations
newman run my-collection.json -n 10

# Run with a delay between requests (milliseconds)
newman run my-collection.json --delay-request 500

# Run with a specific folder from the collection
newman run my-collection.json --folder "User CRUD"

# Generate an HTML report
newman run my-collection.json \\
  -r htmlextra \\
  --reporter-htmlextra-export ./reports/api-report.html

# Combine multiple reporters
newman run my-collection.json \\
  -r cli,htmlextra,junit \\
  --reporter-htmlextra-export ./reports/report.html \\
  --reporter-junit-export ./reports/junit.xml`;

const newmanCiCdCode = `# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'  # Run every 6 hours

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Newman and reporters
        run: |
          npm install -g newman
          npm install -g newman-reporter-htmlextra

      - name: Run API smoke tests
        run: |
          newman run collections/smoke-tests.json \\
            -e environments/staging.json \\
            -r cli,htmlextra,junit \\
            --reporter-htmlextra-export reports/smoke-report.html \\
            --reporter-junit-export reports/smoke-junit.xml \\
            --bail    # Stop on first failure

      - name: Run full regression suite
        if: github.event_name == 'schedule'
        run: |
          newman run collections/regression.json \\
            -e environments/staging.json \\
            -d test-data/users.csv \\
            -n 3 \\
            --delay-request 100 \\
            -r cli,htmlextra \\
            --reporter-htmlextra-export reports/regression-report.html

      - name: Upload test reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: api-test-reports
          path: reports/
          retention-days: 14`;

const newmanScriptCode = `// package.json scripts for Newman
{
  "scripts": {
    "test:api": "newman run collections/api-tests.json -e environments/dev.json",
    "test:api:staging": "newman run collections/api-tests.json -e environments/staging.json",
    "test:api:prod": "newman run collections/api-tests.json -e environments/prod.json",
    "test:smoke": "newman run collections/smoke.json -e environments/staging.json --bail",
    "test:regression": "newman run collections/regression.json -e environments/staging.json -d data/users.csv -n 5",
    "test:report": "newman run collections/api-tests.json -e environments/dev.json -r htmlextra --reporter-htmlextra-export reports/report.html"
  }
}

// Running from npm:
// npm run test:api
// npm run test:api:staging
// npm run test:smoke`;

const performanceNewmanCode = `# ---- Load Testing with Newman + Parallel Execution ----

# Run 50 iterations sequentially (basic load test)
newman run collections/api-tests.json \\
  -e environments/staging.json \\
  -n 50 \\
  --delay-request 100

# Run with timeout per request (3 seconds)
newman run collections/api-tests.json \\
  -e environments/staging.json \\
  -n 100 \\
  --timeout-request 3000

# ---- Parallel execution using GNU Parallel ----
# Run 10 instances of Newman simultaneously (simulates 10 concurrent users)
seq 10 | parallel -j 10 \\
  newman run collections/api-tests.json \\
    -e environments/staging.json \\
    -n 20 \\
    --delay-request 50 \\
    -r cli

# ---- Using a shell script for parallel load ----
#!/bin/bash
COLLECTION="collections/api-tests.json"
ENVIRONMENT="environments/staging.json"
CONCURRENT_USERS=10
ITERATIONS_PER_USER=20

echo "Starting load test: $CONCURRENT_USERS users x $ITERATIONS_PER_USER iterations"

for i in $(seq 1 $CONCURRENT_USERS); do
  newman run "$COLLECTION" \\
    -e "$ENVIRONMENT" \\
    -n "$ITERATIONS_PER_USER" \\
    --delay-request 50 \\
    --reporter-cli-silent \\
    > "reports/user-$i.log" 2>&1 &
done

# Wait for all background processes to finish
wait
echo "Load test complete. Check reports/ for results."`;

const performanceScriptCode = `// Performance monitoring in Postman Test Scripts

// Track response times and store them
const responseTime = pm.response.responseTime;
const requestName = pm.info.requestName;

pm.test("Response time is acceptable (< 1000ms)", function () {
    pm.expect(responseTime).to.be.below(1000);
});

// Categorize response time
let performanceGrade;
if (responseTime < 200) {
    performanceGrade = "EXCELLENT";
} else if (responseTime < 500) {
    performanceGrade = "GOOD";
} else if (responseTime < 1000) {
    performanceGrade = "ACCEPTABLE";
} else {
    performanceGrade = "SLOW";
}

console.log(
    requestName + " | " +
    responseTime + "ms | " +
    performanceGrade
);

// Store metrics for aggregation across iterations
let metrics = JSON.parse(pm.environment.get("perfMetrics") || "[]");
metrics.push({
    request: requestName,
    time: responseTime,
    status: pm.response.code,
    iteration: pm.info.iteration,
    timestamp: new Date().toISOString()
});
pm.environment.set("perfMetrics", JSON.stringify(metrics));

// After the final iteration, calculate averages (in collection-level test)
if (pm.info.iteration === pm.info.iterationCount - 1) {
    const allMetrics = JSON.parse(pm.environment.get("perfMetrics") || "[]");
    const times = allMetrics.map(m => m.time);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const max = Math.max(...times);
    const min = Math.min(...times);
    const p95 = times.sort((a, b) => a - b)[Math.floor(times.length * 0.95)];

    console.log("=== Performance Summary ===");
    console.log("Requests: " + times.length);
    console.log("Average: " + avg.toFixed(2) + "ms");
    console.log("Min: " + min + "ms");
    console.log("Max: " + max + "ms");
    console.log("P95: " + p95 + "ms");
}`;

const fullExampleAuthCode = `// ===== STEP 1: Authenticate =====
// POST {{baseUrl}}/api/auth/login
//
// Request Body:
{
  "email": "{{testUserEmail}}",
  "password": "{{testUserPassword}}"
}

// Tests tab:
pm.test("Login successful", function () {
    pm.response.to.have.status(200);

    const jsonData = pm.response.json();

    pm.expect(jsonData).to.have.property("token");
    pm.expect(jsonData).to.have.property("user");
    pm.expect(jsonData.user.email).to.equal(pm.environment.get("testUserEmail"));

    // Store token for all subsequent requests
    pm.environment.set("authToken", jsonData.token);
    pm.environment.set("currentUserId", jsonData.user.id);

    console.log("Authenticated as: " + jsonData.user.email);
});

pm.test("Response time under 1s", function () {
    pm.expect(pm.response.responseTime).to.be.below(1000);
});`;

const fullExampleCrudCode = `// ===== STEP 2: CREATE a resource =====
// POST {{baseUrl}}/api/products
// Headers: Authorization: Bearer {{authToken}}
//
// Request Body:
{
  "name": "Wireless Headphones Pro",
  "sku": "{{$guid}}",
  "price": 79.99,
  "category": "electronics",
  "stock": 150,
  "description": "Premium noise-canceling wireless headphones"
}

// Tests tab:
pm.test("Product created (201)", function () {
    pm.response.to.have.status(201);
    const product = pm.response.json();

    pm.expect(product).to.have.property("id");
    pm.expect(product.name).to.equal("Wireless Headphones Pro");
    pm.expect(product.price).to.equal(79.99);

    // Store product ID for subsequent CRUD operations
    pm.environment.set("createdProductId", product.id);
    console.log("Created product ID: " + product.id);
});

// ===== STEP 3: READ the resource =====
// GET {{baseUrl}}/api/products/{{createdProductId}}
// Headers: Authorization: Bearer {{authToken}}

// Tests tab:
pm.test("Product retrieved (200)", function () {
    pm.response.to.have.status(200);
    const product = pm.response.json();

    pm.expect(product.id).to.equal(
        parseInt(pm.environment.get("createdProductId"))
    );
    pm.expect(product.name).to.equal("Wireless Headphones Pro");
    pm.expect(product.stock).to.equal(150);
});

// ===== STEP 4: UPDATE the resource =====
// PUT {{baseUrl}}/api/products/{{createdProductId}}
// Headers: Authorization: Bearer {{authToken}}
//
// Request Body:
{
  "price": 69.99,
  "stock": 200,
  "description": "Premium noise-canceling wireless headphones - SALE"
}

// Tests tab:
pm.test("Product updated (200)", function () {
    pm.response.to.have.status(200);
    const product = pm.response.json();

    pm.expect(product.price).to.equal(69.99);
    pm.expect(product.stock).to.equal(200);
    pm.expect(product.description).to.contain("SALE");
});`;

const fullExampleCleanupCode = `// ===== STEP 5: DELETE the resource (cleanup) =====
// DELETE {{baseUrl}}/api/products/{{createdProductId}}
// Headers: Authorization: Bearer {{authToken}}

// Tests tab:
pm.test("Product deleted (204)", function () {
    pm.response.to.have.status(204);
});

// ===== STEP 6: VERIFY deletion =====
// GET {{baseUrl}}/api/products/{{createdProductId}}
// Headers: Authorization: Bearer {{authToken}}

// Tests tab:
pm.test("Product no longer exists (404)", function () {
    pm.response.to.have.status(404);
});

pm.test("Error message is appropriate", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData.error).to.contain("not found");
});

// ===== STEP 7: Cleanup environment variables =====
// (In the last request's Tests tab)
pm.environment.unset("createdProductId");
pm.environment.unset("authToken");
pm.environment.unset("currentUserId");

console.log("=== Test Complete: All CRUD operations verified ===");
console.log("Environment variables cleaned up.");`;

const fullExampleCollectionStructureCode = `// Collection structure for the full workflow:
//
// API Testing Workflow/
// ├── Auth/
// │   └── POST Login
// ├── Products CRUD/
// │   ├── POST Create Product
// │   ├── GET  Read Product
// │   ├── PUT  Update Product
// │   ├── DEL  Delete Product
// │   └── GET  Verify Deletion
// └── Cleanup/
//     └── POST Logout
//
// Run order: Requests execute top-to-bottom when using Collection Runner
// Each request's Tests tab stores data for the next request via variables
//
// Newman command to run the full workflow:
// newman run api-workflow.json \\
//   -e staging.json \\
//   -r cli,htmlextra \\
//   --reporter-htmlextra-export report.html`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function Postman() {
  const { progress, markPageComplete } = useAuth();
  const isCompleted = progress.postman;

  return (
    <div className="postman-page">
      <div className="page-layout container">
        <article className="page-content">

          {/* ---------- Hero / Intro ---------- */}
          <h1>Postman: API &amp; Performance Testing</h1>
          <p className="page-subtitle">
            A comprehensive guide to API testing and performance testing with Postman.
            From building requests to running automated test suites in CI/CD pipelines,
            learn everything you need to validate, monitor, and load-test your APIs.
          </p>

          {/* ========== 1. Introduction ========== */}
          <section id="introduction">
            <span className="section-label section-label--green">Getting Started</span>
            <h2>Introduction</h2>

            <h3>What is Postman?</h3>
            <p>
              Postman is the world's most popular API development and testing platform. Originally
              created as a simple Chrome extension for sending HTTP requests, it has evolved into
              a full-featured ecosystem for designing, documenting, testing, and monitoring APIs.
              Millions of developers and QA engineers rely on Postman to validate API behavior,
              automate test suites, and ensure API reliability.
            </p>

            <h3>Why Use Postman for API Testing?</h3>
            <ul>
              <li>
                <strong>Intuitive GUI</strong> &mdash; Build and send HTTP requests without writing
                code. Perfect for exploratory testing and debugging API issues quickly.
              </li>
              <li>
                <strong>Powerful scripting</strong> &mdash; Write JavaScript-based pre-request scripts
                and test assertions using a built-in sandbox with the <code>pm</code> API.
              </li>
              <li>
                <strong>Collections</strong> &mdash; Organize requests into collections that can be
                shared, versioned, and executed as automated test suites.
              </li>
              <li>
                <strong>Environment management</strong> &mdash; Switch between development, staging,
                and production environments with a single click using variable scoping.
              </li>
              <li>
                <strong>Data-driven testing</strong> &mdash; Run the same collection with different
                data sets using CSV or JSON files, covering edge cases systematically.
              </li>
              <li>
                <strong>CI/CD integration</strong> &mdash; Export collections and run them via Newman
                (Postman's CLI) in any CI/CD pipeline &mdash; GitHub Actions, Jenkins, GitLab CI, etc.
              </li>
            </ul>

            <h3>API Testing vs Performance Testing</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Aspect</th>
                    <th>API Testing</th>
                    <th>Performance Testing</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Goal</td>
                    <td>Verify correctness, data integrity, error handling</td>
                    <td>Measure speed, throughput, stability under load</td>
                  </tr>
                  <tr>
                    <td>Scope</td>
                    <td>Individual endpoints, workflows, edge cases</td>
                    <td>System-wide behavior under concurrent load</td>
                  </tr>
                  <tr>
                    <td>Key metrics</td>
                    <td>Status codes, response body, schema validation</td>
                    <td>Response time, throughput (req/s), error rate, P95/P99</td>
                  </tr>
                  <tr>
                    <td>Tools in Postman</td>
                    <td>Test Scripts, Collection Runner, Newman</td>
                    <td>Collection Runner iterations, Newman parallel, Monitors</td>
                  </tr>
                  <tr>
                    <td>When to run</td>
                    <td>Every commit, PR, deployment</td>
                    <td>Before releases, after infrastructure changes</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Key Takeaway</strong>
              Postman bridges the gap between manual exploratory testing and fully automated API
              validation. You can start by manually crafting requests, then progressively add
              scripts and automation until you have a complete test suite running in CI/CD.
            </div>
          </section>

          {/* ========== 2. Getting Started ========== */}
          <section id="getting-started">
            <span className="section-label section-label--green">Setup</span>
            <h2>Getting Started</h2>

            <h3>Download and Install</h3>
            <p>
              Postman is available as a desktop application for Windows, macOS, and Linux. You can
              also use the web version at <code>web.postman.co</code>, though the desktop app
              provides a better experience for local development.
            </p>
            <ol>
              <li>Visit <code>postman.com/downloads</code> and download the app for your OS</li>
              <li>Install and launch Postman</li>
              <li>Create a free account or sign in (required for syncing and collaboration)</li>
              <li>You are ready to send your first request</li>
            </ol>

            <h3>Workspace Setup</h3>
            <p>
              Workspaces are containers that hold your collections, environments, and other
              Postman resources. Use them to organize your work by project or team.
            </p>
            <ul>
              <li><strong>Personal Workspace</strong> &mdash; Private to you. Great for learning and personal projects.</li>
              <li><strong>Team Workspace</strong> &mdash; Shared with your team. All members can view and edit collections.</li>
              <li><strong>Public Workspace</strong> &mdash; Visible to anyone. Used for open-source API documentation.</li>
            </ul>

            <h3>Creating Collections</h3>
            <p>
              A <strong>collection</strong> is a group of related API requests. Think of it as a
              test suite &mdash; it contains requests organized in folders, along with shared scripts,
              variables, and documentation.
            </p>
            <ol>
              <li>Click <strong>New</strong> in the sidebar, then select <strong>Collection</strong></li>
              <li>Name your collection (e.g., "User API Tests")</li>
              <li>Add folders to organize by feature (e.g., "Auth", "Users", "Products")</li>
              <li>Add requests to each folder</li>
              <li>Set collection-level variables and scripts that apply to all requests</li>
            </ol>

            <div className="tip-box">
              <strong>Tip</strong>
              Use a naming convention for your collections: <code>ProjectName - FeatureArea</code>.
              For example: "E-Commerce API - User Management", "E-Commerce API - Orders". This
              makes it easy to find and manage collections as your project grows.
            </div>
          </section>

          {/* ========== 3. HTTP Requests ========== */}
          <section id="http-requests">
            <span className="section-label section-label--blue">Core</span>
            <h2>HTTP Requests</h2>

            <p>
              The foundation of API testing is sending HTTP requests and inspecting responses.
              Postman supports all standard HTTP methods and provides a rich interface for
              configuring headers, query parameters, request bodies, and authentication.
            </p>

            <h3>GET Request</h3>
            <p>
              GET requests retrieve data from the server. They should never modify server state.
              Use query parameters to filter, paginate, or search.
            </p>
            <CodeBlock code={getRequestCode} language="json" fileName="GET /api/users" />

            <h3>POST Request</h3>
            <p>
              POST requests create new resources. The request body contains the data for the new
              resource, typically sent as JSON.
            </p>
            <CodeBlock code={postRequestCode} language="json" fileName="POST /api/users" />

            <h3>PUT and DELETE Requests</h3>
            <p>
              PUT updates an existing resource (full or partial replacement), while DELETE removes
              it. These complete the CRUD cycle.
            </p>
            <CodeBlock code={putDeleteCode} language="json" fileName="PUT & DELETE /api/users/:id" />

            <div className="info-box">
              <strong>HTTP Methods at a Glance</strong>
              <ul>
                <li><strong>GET</strong> &mdash; Read/retrieve data. Idempotent, no side effects.</li>
                <li><strong>POST</strong> &mdash; Create a resource. Not idempotent.</li>
                <li><strong>PUT</strong> &mdash; Replace/update a resource. Idempotent.</li>
                <li><strong>PATCH</strong> &mdash; Partial update. May or may not be idempotent.</li>
                <li><strong>DELETE</strong> &mdash; Remove a resource. Idempotent.</li>
              </ul>
            </div>
          </section>

          {/* ========== 4. Environment Variables ========== */}
          <section id="environment-variables">
            <span className="section-label section-label--blue">Config</span>
            <h2>Environment Variables</h2>

            <p>
              Environment variables let you switch between different configurations (dev, staging,
              production) without modifying your requests. Variables are referenced
              using <code>{'{{variableName}}'}</code> syntax in URLs, headers, and bodies.
            </p>

            <h3>Setting Up Environments</h3>
            <CodeBlock code={environmentVariablesCode} language="json" fileName="Environments" />

            <h3>Variable Scopes</h3>
            <p>
              Postman has multiple variable scopes with a clear precedence order. Understanding
              scopes is essential for managing complex test suites.
            </p>
            <CodeBlock code={collectionVariablesCode} language="javascript" fileName="Variable Scopes" />

            <h3>Dynamic Variables</h3>
            <p>
              Postman provides built-in dynamic variables that generate random data on the fly.
              These are invaluable for creating unique test data without scripts.
            </p>
            <CodeBlock code={dynamicVariablesCode} language="json" fileName="Dynamic Variables" />

            <div className="warning-box">
              <strong>Warning</strong>
              Never store real credentials or secrets in Postman environments that are synced to
              the cloud. Use <strong>Current Value</strong> (local only) instead of <strong>Initial
              Value</strong> (synced) for sensitive data like passwords and API keys.
            </div>
          </section>

          {/* ========== 5. Pre-request Scripts ========== */}
          <section id="pre-request-scripts">
            <span className="section-label section-label--purple">Scripting</span>
            <h2>Pre-request Scripts</h2>

            <p>
              Pre-request scripts run <strong>before</strong> a request is sent. They are written
              in JavaScript and have access to the full <code>pm</code> API. Common use cases
              include generating authentication tokens, setting up dynamic data, and configuring
              request headers.
            </p>

            <h3>Token Generation</h3>
            <p>
              The most common pre-request script pattern is automatically refreshing an
              authentication token before each request:
            </p>
            <CodeBlock code={preRequestAuthCode} language="javascript" fileName="Pre-request Script: Auth" />

            <h3>Dynamic Data Setup</h3>
            <p>
              Generate unique test data, conditional logic, and request modifications:
            </p>
            <CodeBlock code={preRequestDataSetupCode} language="javascript" fileName="Pre-request Script: Data Setup" />

            <div className="tip-box">
              <strong>Tip</strong>
              Pre-request scripts can also be set at the <strong>collection level</strong> or
              <strong>folder level</strong>. A collection-level pre-request script runs before
              every request in the collection, making it the ideal place for shared auth logic.
            </div>
          </section>

          {/* ========== 6. Test Scripts ========== */}
          <section id="test-scripts">
            <span className="section-label section-label--purple">Scripting</span>
            <h2>Test Scripts</h2>

            <p>
              Test scripts run <strong>after</strong> a response is received. This is where you
              write assertions to validate status codes, response bodies, headers, and response
              times. Postman uses the Chai assertion library via <code>pm.test()</code> and{' '}
              <code>pm.expect()</code>.
            </p>

            <h3>Basic Assertions</h3>
            <CodeBlock code={testScriptsBasicCode} language="javascript" fileName="Tests: Basic Assertions" />

            <h3>Response Body Validation</h3>
            <CodeBlock code={testScriptsBodyCode} language="javascript" fileName="Tests: Body Validation" />

            <h3>JSON Schema Validation</h3>
            <p>
              Schema validation ensures the API response structure matches a contract. This catches
              breaking changes early &mdash; missing fields, wrong types, or unexpected values.
            </p>
            <CodeBlock code={testScriptsSchemaCode} language="javascript" fileName="Tests: Schema Validation" />

            <div className="info-box">
              <strong>The pm Object Reference</strong>
              <ul>
                <li><code>pm.test(name, fn)</code> &mdash; Define a named test assertion</li>
                <li><code>pm.expect(value)</code> &mdash; Chai-style assertion</li>
                <li><code>pm.response.json()</code> &mdash; Parse response body as JSON</li>
                <li><code>pm.response.text()</code> &mdash; Get response body as string</li>
                <li><code>pm.response.code</code> &mdash; HTTP status code (number)</li>
                <li><code>pm.response.responseTime</code> &mdash; Response time in ms</li>
                <li><code>pm.response.headers</code> &mdash; Response headers</li>
                <li><code>pm.info.iteration</code> &mdash; Current iteration index</li>
                <li><code>pm.info.requestName</code> &mdash; Name of the current request</li>
              </ul>
            </div>
          </section>

          {/* ========== 7. Collection Runner ========== */}
          <section id="collection-runner">
            <span className="section-label section-label--blue">Automation</span>
            <h2>Collection Runner</h2>

            <p>
              The Collection Runner executes all requests in a collection sequentially. It is
              Postman's built-in test runner &mdash; think of it as the "play" button for your
              entire test suite. Combined with data files, it enables powerful data-driven testing.
            </p>

            <h3>Running a Collection</h3>
            <ol>
              <li>Open your collection and click <strong>Run</strong> (or use the Runner tab)</li>
              <li>Select the environment to use</li>
              <li>Set the number of iterations (how many times to run the full collection)</li>
              <li>Optionally set a delay between requests (in milliseconds)</li>
              <li>Optionally upload a data file (CSV or JSON) for data-driven testing</li>
              <li>Click <strong>Run Collection</strong></li>
            </ol>

            <h3>Data-Driven Testing</h3>
            <p>
              Data-driven testing runs the same requests multiple times with different input data.
              Each row in a CSV or each object in a JSON array becomes one iteration.
            </p>
            <CodeBlock code={collectionRunnerCode} language="json" fileName="test-data (CSV or JSON)" />

            <h3>Using Data Variables in Tests</h3>
            <CodeBlock code={collectionRunnerTestCode} language="javascript" fileName="Data-Driven Tests" />

            <div className="tip-box">
              <strong>Tip</strong>
              Data-driven testing is excellent for testing boundary conditions, invalid inputs, and
              permission levels. Create a data file with both valid and invalid entries, and assert
              different expected status codes for each row.
            </div>
          </section>

          {/* ========== 8. Newman CLI ========== */}
          <section id="newman-cli">
            <span className="section-label section-label--green">CI/CD</span>
            <h2>Newman CLI</h2>

            <p>
              Newman is Postman's command-line collection runner. It lets you run Postman
              collections from the terminal, making it perfect for CI/CD integration. Newman
              supports all Postman features including environments, data files, and reporters.
            </p>

            <h3>Installation and Basic Usage</h3>
            <CodeBlock code={newmanInstallCode} language="bash" fileName="terminal" />

            <h3>CI/CD Integration (GitHub Actions)</h3>
            <CodeBlock code={newmanCiCdCode} language="yaml" fileName=".github/workflows/api-tests.yml" />

            <h3>NPM Scripts for Easy Execution</h3>
            <CodeBlock code={newmanScriptCode} language="json" fileName="package.json" />

            <div className="warning-box">
              <strong>Warning</strong>
              When running Newman in CI/CD, always export your collection and environment files
              from Postman and commit them to your repository. Do not rely on Postman's cloud
              API to fetch collections at runtime &mdash; it adds a dependency on Postman's
              servers and can cause flaky pipelines.
            </div>
          </section>

          {/* ========== 9. Performance Testing ========== */}
          <section id="performance-testing">
            <span className="section-label section-label--purple">Performance</span>
            <h2>Performance Testing</h2>

            <p>
              While Postman is primarily an API functional testing tool, it can be used for basic
              performance and load testing. For lightweight performance validation, you can use
              Newman with multiple iterations and parallel execution. For heavy load testing,
              consider dedicated tools like k6, JMeter, or Gatling alongside Postman.
            </p>

            <h3>Load Testing with Newman</h3>
            <p>
              Newman supports running collections with many iterations and can be parallelized
              using shell scripts or tools like GNU Parallel to simulate concurrent users.
            </p>
            <CodeBlock code={performanceNewmanCode} language="bash" fileName="Load Testing with Newman" />

            <h3>Performance Monitoring in Test Scripts</h3>
            <p>
              Add response time assertions and metrics collection directly in your Postman test
              scripts to track API performance over time:
            </p>
            <CodeBlock code={performanceScriptCode} language="javascript" fileName="Performance Metrics Script" />

            <h3>Postman Monitors</h3>
            <p>
              Postman Monitors run collections on a schedule (e.g., every 5 minutes) from
              Postman's cloud infrastructure. They are useful for:
            </p>
            <ul>
              <li><strong>Uptime monitoring</strong> &mdash; Detect when APIs go down</li>
              <li><strong>Performance regression</strong> &mdash; Track response time trends over days/weeks</li>
              <li><strong>SLA validation</strong> &mdash; Verify APIs meet response time commitments</li>
              <li><strong>Multi-region testing</strong> &mdash; Run from different geographic locations</li>
            </ul>

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Approach</th>
                    <th>Concurrent Users</th>
                    <th>Best For</th>
                    <th>Limitations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Collection Runner</td>
                    <td>1 (sequential)</td>
                    <td>Functional smoke tests</td>
                    <td>No concurrency, GUI only</td>
                  </tr>
                  <tr>
                    <td>Newman (single)</td>
                    <td>1 (sequential)</td>
                    <td>CI/CD functional tests</td>
                    <td>No concurrency</td>
                  </tr>
                  <tr>
                    <td>Newman (parallel)</td>
                    <td>10-50+</td>
                    <td>Basic load testing</td>
                    <td>Manual setup, limited metrics</td>
                  </tr>
                  <tr>
                    <td>Postman Monitors</td>
                    <td>1 per location</td>
                    <td>Uptime and SLA monitoring</td>
                    <td>Limited iterations, cloud only</td>
                  </tr>
                  <tr>
                    <td>k6 / JMeter / Gatling</td>
                    <td>1000s+</td>
                    <td>Heavy load and stress testing</td>
                    <td>Separate tool, different scripting</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>When to Use What</strong>
              Use Postman/Newman for functional API tests and lightweight performance baselines.
              For serious load testing (hundreds or thousands of concurrent users), use a dedicated
              performance testing tool. Many teams maintain both: Postman collections for
              correctness and k6 scripts for load &mdash; often sharing the same test scenarios.
            </div>
          </section>

          {/* ========== 10. Full Example ========== */}
          <section id="full-example">
            <span className="section-label section-label--green">Practice</span>
            <h2>Full Example: Complete API Testing Workflow</h2>

            <p>
              Let us put everything together with a complete API testing workflow that
              authenticates, performs CRUD operations, validates responses, and cleans up
              after itself. This mirrors a real-world test suite you would run in CI/CD.
            </p>

            <h3>Collection Structure</h3>
            <CodeBlock code={fullExampleCollectionStructureCode} language="text" fileName="Collection Overview" />

            <h3>Step 1: Authenticate</h3>
            <p>
              The first request logs in and stores the auth token in an environment variable.
              All subsequent requests use this token via the <code>{'{{authToken}}'}</code> variable.
            </p>
            <CodeBlock code={fullExampleAuthCode} language="javascript" fileName="POST /api/auth/login" />

            <h3>Steps 2-4: CRUD Operations</h3>
            <p>
              Create a product, read it back, then update it. Each step validates the response
              and stores data needed by the next step.
            </p>
            <CodeBlock code={fullExampleCrudCode} language="javascript" fileName="CRUD Operations" />

            <h3>Steps 5-7: Cleanup and Verification</h3>
            <p>
              Delete the created resource, verify it no longer exists, and clean up environment
              variables. A proper test always cleans up after itself.
            </p>
            <CodeBlock code={fullExampleCleanupCode} language="javascript" fileName="Cleanup & Verification" />

            <h3>What This Example Demonstrates</h3>
            <ul>
              <li>
                <strong>Request chaining</strong> &mdash; Each request passes data to the next via
                environment variables (<code>authToken</code>, <code>createdProductId</code>).
              </li>
              <li>
                <strong>Complete CRUD coverage</strong> &mdash; Create, Read, Update, Delete, and
                verify deletion &mdash; the fundamental API test pattern.
              </li>
              <li>
                <strong>Status code validation</strong> &mdash; Each operation asserts the correct
                HTTP status (201 for create, 200 for read/update, 204 for delete, 404 for missing).
              </li>
              <li>
                <strong>Body validation</strong> &mdash; Responses are parsed and individual fields
                are checked for correct values and types.
              </li>
              <li>
                <strong>Test isolation</strong> &mdash; The suite creates its own data, tests it,
                and removes it. It does not depend on pre-existing data in the database.
              </li>
              <li>
                <strong>Environment cleanup</strong> &mdash; Variables are unset at the end to
                prevent stale data from affecting future runs.
              </li>
            </ul>

            <div className="tip-box">
              <strong>Tip</strong>
              Export this collection and run it with Newman in your CI/CD pipeline:
              <br />
              <code>newman run api-workflow.json -e staging.json -r cli,htmlextra</code>
              <br />
              This gives you automated API regression testing on every deployment.
            </div>

            <div className="info-box">
              <strong>Next Steps</strong>
              Now that you understand the full Postman workflow, explore these advanced topics:
              API mocking with Postman Mock Server, contract testing with schemas, Postman Flows
              for visual API workflows, and integrating Newman results with monitoring
              dashboards like Grafana or Datadog.
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
              <button className="mark-complete-btn" onClick={() => markPageComplete('postman')}>
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

export default Postman;
