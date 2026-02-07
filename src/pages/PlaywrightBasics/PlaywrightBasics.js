import React from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import './PlaywrightBasics.css';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'first-test', label: 'First Test' },
  { id: 'locators', label: 'Locators' },
  { id: 'interactions', label: 'Interactions' },
  { id: 'assertions', label: 'Assertions' },
  { id: 'screenshots', label: 'Screenshots & Videos' },
  { id: 'reporting', label: 'Reporting' },
  { id: 'full-example', label: 'Full Example' },
];

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const installCode = `# Create a new Playwright project from scratch
npm init playwright@latest

# You will be prompted:
#   Do you want to use TypeScript or JavaScript? -> TypeScript
#   Where to put your end-to-end tests? -> tests
#   Add a GitHub Actions workflow? -> true
#   Install Playwright browsers? -> true`;

const projectStructureCode = `my-playwright-project/
\u251C\u2500\u2500 node_modules/
\u251C\u2500\u2500 tests/
\u2502   \u2514\u2500\u2500 example.spec.ts        # Sample test
\u251C\u2500\u2500 tests-examples/
\u2502   \u2514\u2500\u2500 demo-todo-app.spec.ts  # Full demo test
\u251C\u2500\u2500 .github/
\u2502   \u2514\u2500\u2500 workflows/
\u2502       \u2514\u2500\u2500 playwright.yml     # CI workflow
\u251C\u2500\u2500 playwright.config.ts           # Main configuration
\u251C\u2500\u2500 package.json
\u2514\u2500\u2500 tsconfig.json`;

const configCode = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directory that contains your test files
  testDir: './tests',

  // Maximum time a single test can run before it is forcibly stopped
  timeout: 30_000,

  // Assertion-level timeout (how long expect() waits before failing)
  expect: {
    timeout: 5_000,
  },

  // Run tests in parallel across files
  fullyParallel: true,

  // Fail the entire suite immediately if any test fails (useful in CI)
  forbidOnly: !!process.env.CI,

  // Retry failed tests once in CI, never locally
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers in CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Which reporter to use
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
  ],

  // Shared settings applied to every test in every project
  use: {
    // Base URL lets you write relative paths: page.goto('/login')
    baseURL: 'http://localhost:3000',

    // Capture a trace on the first retry of a failed test
    trace: 'on-first-retry',

    // Capture a screenshot when a test fails
    screenshot: 'only-on-failure',

    // Record video only when retrying
    video: 'on-first-retry',
  },

  // Define browser projects to test against
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 13'] },
    },
  ],

  // Automatically start your dev server before running tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});`;

const firstTestCode = `import { test, expect } from '@playwright/test';

// A test block: "test" accepts a name and an async callback.
// The callback receives a "page" object that represents a browser tab.
test('homepage has correct title and link', async ({ page }) => {
  // Navigate to the application
  await page.goto('/');

  // Assert the page title
  await expect(page).toHaveTitle(/My Application/);

  // Find a link by its visible text and click it
  await page.getByRole('link', { name: 'Get Started' }).click();

  // Assert the URL changed after clicking
  await expect(page).toHaveURL(/.*getting-started/);
});`;

const testDescribeCode = `import { test, expect } from '@playwright/test';

test.describe('User Authentication', () => {
  // Runs once before all tests in this describe block
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('badpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('should redirect to dashboard on success', async ({ page }) => {
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('correctpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
});`;

const locatorsByRoleCode = `// ----- By Role (preferred - most resilient to DOM changes) -----
// Buttons
await page.getByRole('button', { name: 'Submit' });
await page.getByRole('button', { name: /submit/i }); // regex, case-insensitive

// Links
await page.getByRole('link', { name: 'Documentation' });

// Headings
await page.getByRole('heading', { name: 'Welcome', level: 1 });

// Form elements
await page.getByRole('textbox', { name: 'Email' });
await page.getByRole('checkbox', { name: 'Accept terms' });
await page.getByRole('combobox', { name: 'Country' });

// Navigation, dialog, etc.
await page.getByRole('navigation');
await page.getByRole('dialog');`;

const locatorsByTextCode = `// ----- By Text Content -----
await page.getByText('Welcome to the site');
await page.getByText(/welcome/i);             // partial, case-insensitive
await page.getByText('Welcome', { exact: true }); // exact match only

// ----- By Label (for form inputs) -----
await page.getByLabel('Email address');
await page.getByLabel('Password');

// ----- By Placeholder -----
await page.getByPlaceholder('Search...');

// ----- By Alt Text (images) -----
await page.getByAltText('Company logo');

// ----- By Title Attribute -----
await page.getByTitle('Close dialog');

// ----- By Test ID (escape hatch when nothing else works) -----
await page.getByTestId('submit-button');
// Matches: <button data-testid="submit-button">Send</button>`;

const locatorsChainingCode = `// Chaining narrows the search scope to children of the parent locator
const productCard = page.locator('.product-card').filter({ hasText: 'Laptop' });
await productCard.getByRole('button', { name: 'Add to cart' }).click();

// .nth() selects by index (0-based)
await page.getByRole('listitem').nth(2).click();

// .first() and .last()
await page.getByRole('listitem').first().click();
await page.getByRole('listitem').last().click();

// Filter by another locator
await page
  .getByRole('listitem')
  .filter({ has: page.getByRole('heading', { name: 'Premium' }) })
  .getByRole('button', { name: 'Buy' })
  .click();

// CSS and XPath (use sparingly - they break more easily)
await page.locator('css=div.card >> text=Details').click();
await page.locator('xpath=//div[@class="card"]//button').click();`;

const interactionsClickCode = `// Standard click
await page.getByRole('button', { name: 'Submit' }).click();

// Double click
await page.getByText('Select this text').dblclick();

// Right click (context menu)
await page.getByText('Show options').click({ button: 'right' });

// Shift + Click (multi-select)
await page.getByText('Item 3').click({ modifiers: ['Shift'] });

// Click at specific position relative to the element center
await page.locator('#canvas').click({ position: { x: 100, y: 200 } });

// Force click (bypasses actionability checks - use as last resort)
await page.getByRole('button', { name: 'Hidden' }).click({ force: true });`;

const interactionsFormCode = `// Type into text fields
await page.getByLabel('Username').fill('john_doe');
await page.getByLabel('Bio').fill('Hello, I am a tester.');

// Clear a field first, then type character by character (simulates real typing)
await page.getByLabel('Search').clear();
await page.getByLabel('Search').pressSequentially('Playwright', { delay: 50 });

// Select from dropdown
await page.getByLabel('Country').selectOption('US');
await page.getByLabel('Country').selectOption({ label: 'United States' });
await page.getByLabel('Colors').selectOption(['red', 'green']); // multi-select

// Check / uncheck
await page.getByLabel('Accept terms').check();
await page.getByLabel('Notifications').uncheck();

// Upload a file
await page.getByLabel('Upload resume').setInputFiles('resume.pdf');
await page.getByLabel('Upload photos').setInputFiles(['photo1.png', 'photo2.png']);
// Clear file selection
await page.getByLabel('Upload resume').setInputFiles([]);`;

const interactionsKeyboardMouseCode = `// Press individual keys
await page.keyboard.press('Enter');
await page.keyboard.press('Escape');
await page.keyboard.press('Tab');

// Key combinations
await page.keyboard.press('Control+a');  // Select all
await page.keyboard.press('Control+c');  // Copy
await page.keyboard.press('Meta+v');     // Paste (Mac)

// Type a string as keyboard input
await page.keyboard.type('Hello World');

// Hold and release keys manually
await page.keyboard.down('Shift');
await page.keyboard.press('ArrowDown');
await page.keyboard.press('ArrowDown');
await page.keyboard.up('Shift');

// Hover
await page.getByText('Menu').hover();

// Drag and drop
await page.locator('#source').dragTo(page.locator('#target'));`;

const assertionsBasicCode = `import { test, expect } from '@playwright/test';

test('assertions showcase', async ({ page }) => {
  await page.goto('/products');

  // ----- Visibility -----
  await expect(page.getByText('Product Catalog')).toBeVisible();
  await expect(page.getByText('Loading...')).toBeHidden();

  // ----- Text Content -----
  await expect(page.getByRole('heading')).toHaveText('Product Catalog');
  await expect(page.getByRole('heading')).toContainText('Product');

  // ----- Page Title & URL -----
  await expect(page).toHaveTitle(/Products/);
  await expect(page).toHaveURL(/\\/products$/);

  // ----- Element Count -----
  await expect(page.getByRole('listitem')).toHaveCount(12);

  // ----- CSS Classes & Attributes -----
  await expect(page.locator('.nav-link.active')).toHaveClass(/active/);
  await expect(page.getByRole('link', { name: 'Docs' }))
    .toHaveAttribute('href', '/docs');

  // ----- Input Values -----
  await expect(page.getByLabel('Search')).toHaveValue('');
  await page.getByLabel('Search').fill('laptop');
  await expect(page.getByLabel('Search')).toHaveValue('laptop');

  // ----- Enabled / Disabled -----
  await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Delete' })).toBeDisabled();

  // ----- Checked State -----
  await expect(page.getByLabel('Remember me')).not.toBeChecked();
  await page.getByLabel('Remember me').check();
  await expect(page.getByLabel('Remember me')).toBeChecked();
});`;

const assertionsWaitingCode = `// Playwright assertions auto-retry by default (up to expect.timeout).
// You can also configure the timeout per assertion:
await expect(page.getByText('Data loaded'))
  .toBeVisible({ timeout: 10_000 }); // wait up to 10 seconds

// Wait for a specific condition using page.waitForSelector
await page.waitForSelector('.results-table', { state: 'visible' });

// Wait for a network response
const responsePromise = page.waitForResponse('**/api/products');
await page.getByRole('button', { name: 'Load Products' }).click();
const response = await responsePromise;
expect(response.status()).toBe(200);

// Wait for navigation
await Promise.all([
  page.waitForURL('**/dashboard'),
  page.getByRole('button', { name: 'Login' }).click(),
]);

// Wait for element to be detached from DOM
await expect(page.locator('.spinner')).toHaveCount(0);

// Soft assertions - don't stop the test on failure
await expect.soft(page.getByText('Beta')).toBeVisible();
await expect.soft(page.getByText('v2.0')).toBeVisible();
// Test continues even if the above fail; failures are collected at the end`;

const screenshotCode = `import { test, expect } from '@playwright/test';

test('capture screenshots', async ({ page }) => {
  await page.goto('/dashboard');

  // Full page screenshot
  await page.screenshot({ path: 'screenshots/dashboard-full.png', fullPage: true });

  // Viewport only (what the user sees)
  await page.screenshot({ path: 'screenshots/dashboard-viewport.png' });

  // Screenshot of a specific element
  const chart = page.locator('.revenue-chart');
  await chart.screenshot({ path: 'screenshots/revenue-chart.png' });

  // Visual comparison (golden file testing)
  // First run creates the reference image, subsequent runs compare against it
  await expect(page).toHaveScreenshot('dashboard.png', {
    maxDiffPixelRatio: 0.01,  // Allow 1% pixel difference
  });

  // Element-level visual comparison
  await expect(page.locator('.sidebar')).toHaveScreenshot('sidebar.png');
});`;

const videoConfigCode = `// In playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    // Record video for every test (generates large files)
    // video: 'on',

    // Record only when retrying a failed test (recommended)
    video: 'on-first-retry',

    // Record only for failed tests
    // video: 'retain-on-failure',

    // Video resolution
    video: {
      mode: 'on-first-retry',
      size: { width: 1280, height: 720 },
    },

    // Screenshot options
    screenshot: 'only-on-failure',
  },
});`;

const reportingCode = `// playwright.config.ts - Reporter configuration
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    // Built-in terminal reporter for live output
    ['list'],

    // HTML report with full details, screenshots, traces
    ['html', {
      open: 'never',           // 'always' | 'never' | 'on-failure'
      outputFolder: 'playwright-report',
    }],

    // JUnit XML for CI/CD systems (Jenkins, GitLab, etc.)
    ['junit', { outputFile: 'results/junit.xml' }],

    // JSON reporter for custom processing
    ['json', { outputFile: 'results/results.json' }],
  ],

  use: {
    // Trace captures a timeline of every action, network request, and DOM snapshot
    trace: 'on-first-retry',
    // Options: 'on' | 'off' | 'on-first-retry' | 'retain-on-failure'
  },
});`;

const reportingCommandsCode = `# Run tests
npx playwright test

# Open the HTML report after running tests
npx playwright show-report

# View a trace file (download from HTML report or CI artifacts)
npx playwright show-trace trace.zip

# Run with specific reporter override
npx playwright test --reporter=dot

# Run tests in headed mode (see the browser)
npx playwright test --headed

# Run a single test file
npx playwright test tests/login.spec.ts

# Run tests matching a name pattern
npx playwright test -g "should display error"`;

const ciWorkflowCode = `# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    timeout-minutes: 15
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - name: Upload test traces
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-traces
          path: test-results/
          retention-days: 7`;

const fullExampleCode = `import { test, expect, type Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Real-world E2E test: Online store checkout flow
// ---------------------------------------------------------------------------

// Helper function to log in before tests that need authentication
async function loginAsCustomer(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill('customer@example.com');
  await page.getByLabel('Password').fill('SecurePass123!');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/.*account/);
}

test.describe('E-commerce Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsCustomer(page);
  });

  test('should search for a product and add it to cart', async ({ page }) => {
    // Use the search bar
    await page.getByPlaceholder('Search products...').fill('Wireless Headphones');
    await page.getByPlaceholder('Search products...').press('Enter');

    // Verify search results appeared
    await expect(page.getByRole('heading', { name: 'Search Results' })).toBeVisible();
    await expect(page.getByRole('listitem')).toHaveCount(3);

    // Click the first product
    await page
      .getByRole('listitem')
      .first()
      .getByRole('link', { name: /Wireless Headphones/i })
      .click();

    // Verify product detail page
    await expect(page).toHaveURL(/.*\\/products\\/\\d+/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Wireless Headphones');

    // Select options and add to cart
    await page.getByLabel('Color').selectOption('Black');
    await page.getByRole('button', { name: 'Add to Cart' }).click();

    // Verify cart badge updated
    await expect(page.getByTestId('cart-count')).toHaveText('1');
  });

  test('should complete checkout with valid payment', async ({ page }) => {
    // Assume the product is already in the cart (from a previous action or fixture)
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Verify cart has items
    const cartItems = page.getByRole('listitem').filter({
      has: page.locator('[data-testid="cart-item"]'),
    });
    await expect(cartItems).toHaveCount(1);

    // Proceed to checkout
    await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
    await expect(page).toHaveURL(/.*\\/checkout/);

    // Fill shipping information
    await page.getByLabel('Full Name').fill('Jane Doe');
    await page.getByLabel('Address').fill('123 Test Street');
    await page.getByLabel('City').fill('San Francisco');
    await page.getByLabel('State').selectOption('CA');
    await page.getByLabel('ZIP Code').fill('94102');
    await page.getByRole('button', { name: 'Continue to Payment' }).click();

    // Fill payment information
    await page.getByLabel('Card Number').fill('4242424242424242');
    await page.getByLabel('Expiration').fill('12/28');
    await page.getByLabel('CVC').fill('123');

    // Place order and wait for API response
    const orderPromise = page.waitForResponse(
      (resp) => resp.url().includes('/api/orders') && resp.status() === 201
    );
    await page.getByRole('button', { name: 'Place Order' }).click();
    const orderResponse = await orderPromise;
    const orderData = await orderResponse.json();

    // Verify confirmation page
    await expect(page).toHaveURL(/.*\\/order-confirmation/);
    await expect(page.getByRole('heading', { name: 'Order Confirmed' })).toBeVisible();
    await expect(page.getByText(orderData.orderId)).toBeVisible();

    // Screenshot the confirmation for records
    await page.screenshot({
      path: \`screenshots/order-\${orderData.orderId}.png\`,
      fullPage: true,
    });
  });

  test('should show validation errors for empty checkout form', async ({ page }) => {
    await page.goto('/checkout');

    // Click submit without filling anything
    await page.getByRole('button', { name: 'Continue to Payment' }).click();

    // Verify all required field errors appear
    const requiredFields = ['Full Name', 'Address', 'City', 'ZIP Code'];
    for (const fieldName of requiredFields) {
      await expect(
        page.getByText(\`\${fieldName} is required\`)
      ).toBeVisible();
    }

    // The URL should NOT have changed
    await expect(page).toHaveURL(/.*\\/checkout/);
  });
});`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function PlaywrightBasics() {
  const { progress, markPageComplete } = useAuth();
  const isCompleted = progress.playwright;

  return (
    <div className="pw-page">
      <div className="page-layout container">
        <article className="page-content">

          {/* ---------- Hero / Intro ---------- */}
          <h1>Playwright Basics</h1>
          <p className="page-subtitle">
            A comprehensive, hands-on guide to end-to-end testing with Playwright and TypeScript.
            From installation to CI/CD, learn everything you need to write reliable browser tests
            for modern web applications.
          </p>

          {/* ========== 1. Introduction ========== */}
          <section id="introduction">
            <span className="section-label section-label--green">Getting Started</span>
            <h2>Introduction</h2>

            <h3>What is Playwright?</h3>
            <p>
              Playwright is an open-source end-to-end testing framework developed by Microsoft. It
              allows you to automate Chromium, Firefox, and WebKit browsers with a single API.
              Unlike older tools, Playwright was built from the ground up for the modern web &mdash;
              it handles single-page applications, iframes, shadow DOM, and multiple tabs natively.
            </p>

            <h3>Why Choose Playwright?</h3>
            <ul>
              <li>
                <strong>Cross-browser</strong> &mdash; One API works with Chromium (Chrome, Edge),
                Firefox, and WebKit (Safari) on Windows, macOS, and Linux.
              </li>
              <li>
                <strong>Auto-waiting</strong> &mdash; Playwright automatically waits for elements to
                be actionable before performing operations. No more manual sleep calls or flaky
                waits.
              </li>
              <li>
                <strong>Web-first assertions</strong> &mdash; Assertions retry until the condition
                is met or a timeout is reached, eliminating most race-condition flakiness.
              </li>
              <li>
                <strong>Test isolation</strong> &mdash; Every test gets a fresh browser context
                (cookies, storage, cache) out of the box. Tests cannot interfere with each other.
              </li>
              <li>
                <strong>Powerful tooling</strong> &mdash; Built-in test generator (Codegen), Trace
                Viewer for post-mortem debugging, and an HTML reporter for rich test reports.
              </li>
              <li>
                <strong>TypeScript first</strong> &mdash; Full TypeScript support with auto-complete,
                type checking, and excellent IDE integration.
              </li>
            </ul>

            <h3>How Does Playwright Compare?</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Playwright</th>
                    <th>Cypress</th>
                    <th>Selenium</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Cross-browser</td>
                    <td>Chromium, Firefox, WebKit</td>
                    <td>Chromium, Firefox, WebKit (limited)</td>
                    <td>All major browsers</td>
                  </tr>
                  <tr>
                    <td>Language support</td>
                    <td>TypeScript, JavaScript, Python, Java, C#</td>
                    <td>JavaScript / TypeScript only</td>
                    <td>Java, Python, C#, Ruby, JS</td>
                  </tr>
                  <tr>
                    <td>Auto-waiting</td>
                    <td>Built-in, comprehensive</td>
                    <td>Built-in</td>
                    <td>Manual waits required</td>
                  </tr>
                  <tr>
                    <td>Multi-tab / multi-origin</td>
                    <td>Full support</td>
                    <td>Limited / workarounds</td>
                    <td>Supported</td>
                  </tr>
                  <tr>
                    <td>iframes</td>
                    <td>First-class API</td>
                    <td>Supported (some limitations)</td>
                    <td>Supported</td>
                  </tr>
                  <tr>
                    <td>Parallel execution</td>
                    <td>Built-in, file-level &amp; test-level</td>
                    <td>Via Cypress Cloud or plugins</td>
                    <td>Via Selenium Grid</td>
                  </tr>
                  <tr>
                    <td>Trace viewer</td>
                    <td>Built-in with DOM snapshots</td>
                    <td>Video only (screenshots in Cloud)</td>
                    <td>Not built-in</td>
                  </tr>
                  <tr>
                    <td>Network interception</td>
                    <td>Full API mocking &amp; modification</td>
                    <td>cy.intercept()</td>
                    <td>Limited</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Key Takeaway</strong>
              Playwright combines the developer experience of Cypress with the cross-browser
              capabilities of Selenium, while adding powerful modern features like Trace Viewer
              and auto-waiting that neither competitor offers out of the box.
            </div>
          </section>

          {/* ========== 2. Installation ========== */}
          <section id="installation">
            <span className="section-label section-label--green">Setup</span>
            <h2>Installation</h2>

            <p>
              The fastest way to get started is the official init command, which scaffolds an
              entire project with configuration, example tests, and optionally a CI workflow.
            </p>

            <CodeBlock code={installCode} language="bash" fileName="terminal" />

            <p>
              The command installs <code>@playwright/test</code> (the test runner) and downloads
              browser binaries for Chromium, Firefox, and WebKit. After it finishes you will have
              a project structure like this:
            </p>

            <CodeBlock code={projectStructureCode} language="text" fileName="project structure" />

            <div className="tip-box">
              <strong>Tip</strong>
              If you already have a project and want to add Playwright to it, simply install the
              package: <code>npm install -D @playwright/test</code> and then run{' '}
              <code>npx playwright install</code> to download the browsers.
            </div>

            <h3>Installing Specific Browsers</h3>
            <p>
              By default all three browsers are installed, which takes some disk space. If you only
              need Chromium, you can install selectively:
            </p>

            <CodeBlock
              code={`# Install only Chromium
npx playwright install chromium

# Install Chromium and Firefox, skip WebKit
npx playwright install chromium firefox

# Install browsers along with OS-level dependencies (useful in Docker / CI)
npx playwright install --with-deps chromium`}
              language="bash"
              fileName="terminal"
            />
          </section>

          {/* ========== 3. Configuration ========== */}
          <section id="configuration">
            <span className="section-label section-label--blue">Config</span>
            <h2>Configuration</h2>

            <p>
              The heart of every Playwright project is <code>playwright.config.ts</code>. This file
              controls which browsers to test, timeouts, retries, reporters, and much more. Here is
              a thoroughly annotated example:
            </p>

            <CodeBlock code={configCode} language="typescript" fileName="playwright.config.ts" />

            <h3>Key Configuration Options Explained</h3>

            <ul>
              <li>
                <strong>testDir</strong> &mdash; The directory where Playwright looks for{' '}
                <code>*.spec.ts</code> files. Defaults to the project root if omitted.
              </li>
              <li>
                <strong>timeout</strong> &mdash; Maximum time per test. If a test exceeds this,
                Playwright terminates it and marks it failed. Default is 30 seconds.
              </li>
              <li>
                <strong>fullyParallel</strong> &mdash; When true, tests inside a single file can
                run in parallel (not just across files).
              </li>
              <li>
                <strong>retries</strong> &mdash; How many times to retry a failed test. Great for CI
                where transient failures may occur. Keep it at 0 locally so you catch real bugs.
              </li>
              <li>
                <strong>projects</strong> &mdash; Each project represents a browser configuration.
                You can also use projects for different environments (staging vs production) or
                test suites (smoke vs full regression).
              </li>
              <li>
                <strong>webServer</strong> &mdash; Tells Playwright to start your development server
                before running tests. It waits for the URL to respond before proceeding.
              </li>
            </ul>

            <div className="warning-box">
              <strong>Warning</strong>
              Do not set <code>forbidOnly: true</code> locally. This option is designed for CI and
              will cause any test with <code>test.only()</code> to fail the entire suite, which is
              disruptive during development.
            </div>
          </section>

          {/* ========== 4. First Test ========== */}
          <section id="first-test">
            <span className="section-label section-label--green">Core</span>
            <h2>Writing Your First Test</h2>

            <p>
              Playwright test files use the <code>.spec.ts</code> extension by convention. Each file
              imports <code>test</code> and <code>expect</code> from <code>@playwright/test</code>.
              The <code>test</code> function receives a destructured <code>page</code> object, which
              represents a single browser tab.
            </p>

            <CodeBlock code={firstTestCode} language="typescript" fileName="tests/homepage.spec.ts" />

            <h3>Grouping Tests with describe</h3>
            <p>
              Use <code>test.describe()</code> to group related tests and share setup logic with{' '}
              <code>test.beforeEach()</code>. This is similar to describe/beforeEach in Jest or
              Mocha.
            </p>

            <CodeBlock code={testDescribeCode} language="typescript" fileName="tests/auth.spec.ts" />

            <div className="tip-box">
              <strong>Tip</strong>
              Each test runs in a completely isolated browser context. Cookies, localStorage, and
              session data are not shared between tests, even within the same file. This eliminates
              an entire class of flaky test issues.
            </div>

            <h3>Running Your Tests</h3>
            <p>
              Use the CLI to run tests. Playwright provides many useful flags:
            </p>
            <CodeBlock
              code={`# Run all tests
npx playwright test

# Run in headed mode (see the browser)
npx playwright test --headed

# Run a single file
npx playwright test tests/auth.spec.ts

# Run tests matching a name
npx playwright test -g "should redirect"

# Run only Chromium
npx playwright test --project=chromium

# Debug mode: steps through each action with Inspector
npx playwright test --debug`}
              language="bash"
              fileName="terminal"
            />
          </section>

          {/* ========== 5. Locators ========== */}
          <section id="locators">
            <span className="section-label section-label--purple">Selectors</span>
            <h2>Locators</h2>

            <p>
              Locators are the way you find elements on the page. Playwright provides multiple
              locator strategies, but the recommended approach is to use <strong>role-based
              locators</strong> whenever possible. These mirror how users and assistive technology
              interact with your app, making tests more resilient and accessible.
            </p>

            <h3>Role-based Locators (Recommended)</h3>
            <CodeBlock code={locatorsByRoleCode} language="typescript" fileName="locators-role.ts" />

            <h3>Text, Label, Placeholder, and TestID</h3>
            <CodeBlock code={locatorsByTextCode} language="typescript" fileName="locators-text.ts" />

            <h3>Chaining and Filtering</h3>
            <p>
              Real-world pages often have multiple elements with the same role or text. Chaining
              and filtering let you narrow your search scope to find exactly the right element.
            </p>
            <CodeBlock code={locatorsChainingCode} language="typescript" fileName="locators-chain.ts" />

            <div className="info-box">
              <strong>Locator Priority Guide</strong>
              Use locators in this order of preference:
              (1) <code>getByRole</code> &mdash;
              (2) <code>getByLabel</code> / <code>getByPlaceholder</code> &mdash;
              (3) <code>getByText</code> &mdash;
              (4) <code>getByTestId</code> &mdash;
              (5) CSS / XPath as a last resort.
              The higher the priority, the more resilient the locator is to DOM refactoring.
            </div>
          </section>

          {/* ========== 6. Interactions ========== */}
          <section id="interactions">
            <span className="section-label section-label--purple">Actions</span>
            <h2>Interactions</h2>

            <p>
              Once you have located an element, you need to interact with it. Playwright provides
              methods for clicking, typing, selecting, dragging, and more. All interactions
              auto-wait for the element to be visible, enabled, and stable before acting.
            </p>

            <h3>Click Actions</h3>
            <CodeBlock code={interactionsClickCode} language="typescript" fileName="interactions-click.ts" />

            <h3>Form Interactions</h3>
            <CodeBlock code={interactionsFormCode} language="typescript" fileName="interactions-form.ts" />

            <h3>Keyboard and Mouse</h3>
            <CodeBlock code={interactionsKeyboardMouseCode} language="typescript" fileName="interactions-kb.ts" />

            <div className="warning-box">
              <strong>Warning</strong>
              Avoid using <code>{'{ force: true }'}</code> unless you have a very specific reason.
              Forcing clicks bypasses Playwright&apos;s actionability checks, which means your test
              might interact with elements a real user could never reach. If you find yourself
              needing <code>force</code> frequently, the application likely has accessibility
              issues worth fixing.
            </div>
          </section>

          {/* ========== 7. Assertions ========== */}
          <section id="assertions">
            <span className="section-label section-label--blue">Verification</span>
            <h2>Assertions</h2>

            <p>
              Assertions verify that the application is in the expected state. Playwright uses
              <strong> web-first assertions</strong> that automatically retry until the condition is
              satisfied or a timeout is reached. This is fundamentally different from immediate
              assertions in unit testing frameworks and is key to eliminating flakiness.
            </p>

            <h3>Common Assertions</h3>
            <CodeBlock code={assertionsBasicCode} language="typescript" fileName="tests/assertions.spec.ts" />

            <h3>Waiting and Advanced Assertions</h3>
            <p>
              While Playwright auto-waits for most operations, there are scenarios where you need
              explicit waiting &mdash; for example, waiting for a network response or for an
              element to disappear.
            </p>
            <CodeBlock code={assertionsWaitingCode} language="typescript" fileName="tests/waiting.spec.ts" />

            <div className="tip-box">
              <strong>Tip</strong>
              Use <code>expect.soft()</code> when you want to check multiple independent conditions
              without stopping the test at the first failure. All soft assertion failures are
              reported at the end. This is great for verifying a dashboard where multiple widgets
              should all render correctly.
            </div>
          </section>

          {/* ========== 8. Screenshots & Videos ========== */}
          <section id="screenshots">
            <span className="section-label section-label--blue">Debugging</span>
            <h2>Screenshots and Videos</h2>

            <p>
              Visual evidence is invaluable for debugging test failures, especially in CI
              environments where you cannot watch the browser in real time. Playwright supports
              on-demand screenshots, visual comparison testing, and automatic video recording.
            </p>

            <h3>Taking Screenshots</h3>
            <CodeBlock code={screenshotCode} language="typescript" fileName="tests/visual.spec.ts" />

            <h3>Video Recording Configuration</h3>
            <p>
              Configure video recording in your <code>playwright.config.ts</code> file. The
              recommended approach is to record only on failure or first retry to save disk space.
            </p>
            <CodeBlock code={videoConfigCode} language="typescript" fileName="playwright.config.ts" />

            <div className="info-box">
              <strong>Visual Regression Testing</strong>
              The <code>toHaveScreenshot()</code> method compares against a golden reference image.
              On the first run it creates the reference. On subsequent runs it compares pixel by
              pixel. Use <code>npx playwright test --update-snapshots</code> to refresh reference
              images after intentional visual changes.
            </div>

            <div className="tip-box">
              <strong>Tip</strong>
              Store screenshot baselines in your Git repository. This way, pull request reviews
              can show visual diffs alongside code changes. Set <code>maxDiffPixelRatio</code> or{' '}
              <code>maxDiffPixels</code> to account for minor rendering differences across
              platforms.
            </div>
          </section>

          {/* ========== 9. Reporting ========== */}
          <section id="reporting">
            <span className="section-label section-label--purple">CI/CD</span>
            <h2>Reporting</h2>

            <p>
              Playwright ships with several built-in reporters and supports custom reporters.
              The HTML reporter and Trace Viewer are particularly powerful for diagnosing failures.
            </p>

            <h3>Reporter Configuration</h3>
            <CodeBlock code={reportingCode} language="typescript" fileName="playwright.config.ts" />

            <h3>Useful CLI Commands</h3>
            <CodeBlock code={reportingCommandsCode} language="bash" fileName="terminal" />

            <h3>Trace Viewer</h3>
            <p>
              The Trace Viewer is one of Playwright&apos;s most powerful debugging tools. It
              records a complete timeline of your test including:
            </p>
            <ul>
              <li>Every action performed (clicks, fills, navigations)</li>
              <li>DOM snapshots before and after each action</li>
              <li>Network requests and responses</li>
              <li>Console logs and errors</li>
              <li>Screenshots at each step</li>
            </ul>
            <p>
              You can open traces in the browser at{' '}
              <code>trace.playwright.dev</code> by dragging and dropping the trace zip file,
              or use the CLI command <code>npx playwright show-trace trace.zip</code>.
            </p>

            <h3>CI/CD Integration</h3>
            <p>
              Playwright works with all major CI/CD platforms. Below is a complete GitHub Actions
              workflow that runs tests, uploads the HTML report, and preserves trace files for
              failed tests:
            </p>
            <CodeBlock code={ciWorkflowCode} language="yaml" fileName=".github/workflows/playwright.yml" />

            <div className="warning-box">
              <strong>Warning</strong>
              In CI environments, always use <code>npx playwright install --with-deps</code> to
              install OS-level dependencies (fonts, libraries) that browsers need. Without these,
              you will get cryptic browser launch errors.
            </div>
          </section>

          {/* ========== 10. Full Example ========== */}
          <section id="full-example">
            <span className="section-label section-label--green">Practice</span>
            <h2>Full Example: E-commerce Checkout Test</h2>

            <p>
              Let us put everything together with a realistic test suite for an e-commerce
              application. This example demonstrates login helpers, search, form filling, API
              response interception, visual verification, and grouped tests with shared setup.
            </p>

            <CodeBlock code={fullExampleCode} language="typescript" fileName="tests/checkout.spec.ts" />

            <h3>What This Example Demonstrates</h3>
            <ul>
              <li>
                <strong>Reusable helper functions</strong> &mdash; The <code>loginAsCustomer</code>{' '}
                function is extracted so multiple test suites can share it.
              </li>
              <li>
                <strong>test.beforeEach</strong> &mdash; Every test starts logged in, reducing
                duplication.
              </li>
              <li>
                <strong>Diverse locator strategies</strong> &mdash; The tests use{' '}
                <code>getByPlaceholder</code>, <code>getByRole</code>, <code>getByLabel</code>,{' '}
                <code>getByText</code>, and <code>getByTestId</code> depending on context.
              </li>
              <li>
                <strong>Network response interception</strong> &mdash; The checkout test waits for
                the actual API response and uses the returned order ID in assertions.
              </li>
              <li>
                <strong>Chaining and filtering</strong> &mdash; Cart items are located by filtering
                list items that contain a specific test ID.
              </li>
              <li>
                <strong>Dynamic screenshots</strong> &mdash; The confirmation screenshot uses the
                order ID in the file name for traceability.
              </li>
              <li>
                <strong>Form validation testing</strong> &mdash; The third test verifies client-side
                validation without needing any backend interaction.
              </li>
            </ul>

            <div className="tip-box">
              <strong>Tip</strong>
              For larger projects, consider using Playwright fixtures to encapsulate login,
              database seeding, and other reusable setup. Fixtures compose better than helper
              functions and provide automatic cleanup.
            </div>

            <div className="info-box">
              <strong>Next Steps</strong>
              Now that you have the fundamentals, explore these advanced topics:
              API testing with <code>request</code> context, component testing, authentication
              state reuse via <code>storageState</code>, page object model patterns, and
              parameterized tests with <code>test.describe.configure</code>.
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
              <button className="mark-complete-btn" onClick={() => markPageComplete('playwright')}>
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

export default PlaywrightBasics;
