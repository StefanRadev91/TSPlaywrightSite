import React from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import './POM.css';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'without-pom', label: 'Problems Without POM' },
  { id: 'structure', label: 'POM Structure' },
  { id: 'creating-po', label: 'Creating a Page Object' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'base-page', label: 'Base Page Pattern' },
  { id: 'real-example', label: 'Real-World Example' },
  { id: 'component-objects', label: 'Component Objects' },
  { id: 'advanced-pom', label: 'Advanced POM' },
  { id: 'enterprise', label: 'Enterprise Structure' },
];

function POM() {
  const { progress, markPageComplete } = useAuth();
  const isCompleted = progress.pom;

  return (
    <div className="pom-page">
      <div className="page-layout container">
        <article className="page-content">
          <span className="section-label section-label--purple">Complete Guide</span>
          <h1>Page Object Model (POM)</h1>
          <p className="page-subtitle">
            The industry-standard design pattern for organizing test automation code.
            Learn how to build maintainable, scalable, and reusable test suites.
          </p>

          {/* Introduction */}
          <section id="introduction">
            <h2>What is the Page Object Model?</h2>
            <p>
              The <strong>Page Object Model (POM)</strong> is a design pattern used in test automation
              that creates an object-oriented representation of your web application's pages. Each page
              (or significant component) of your application gets its own class that contains the
              locators and methods for interacting with that page.
            </p>
            <p>
              Instead of writing selectors and interactions directly in your test files, you
              encapsulate them in dedicated Page Object classes. Your tests then call clean, readable
              methods like <code>loginPage.login(username, password)</code> instead of dealing with
              raw selectors and clicks.
            </p>

            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-card__icon">&#128736;</div>
                <div className="benefit-card__title">Maintainability</div>
                <div className="benefit-card__desc">
                  When the UI changes, you only update the Page Object — not every test that uses it.
                </div>
              </div>
              <div className="benefit-card">
                <div className="benefit-card__icon">&#9851;</div>
                <div className="benefit-card__title">Reusability</div>
                <div className="benefit-card__desc">
                  Write interactions once, use them across dozens of tests. DRY principle applied to testing.
                </div>
              </div>
              <div className="benefit-card">
                <div className="benefit-card__icon">&#128214;</div>
                <div className="benefit-card__title">Readability</div>
                <div className="benefit-card__desc">
                  Tests read like business scenarios, not technical implementation details.
                </div>
              </div>
            </div>

            <div className="pom-diagram">
              <div className="pom-diagram__row">
                <div className="pom-diagram__box pom-diagram__box--green">Test Files (.spec.ts)</div>
              </div>
              <div className="pom-diagram__arrow">&#8595;</div>
              <div className="pom-diagram__row">
                <div className="pom-diagram__box pom-diagram__box--blue">Page Objects</div>
              </div>
              <div className="pom-diagram__arrow">&#8595;</div>
              <div className="pom-diagram__row">
                <div className="pom-diagram__box pom-diagram__box--purple">Web Application</div>
              </div>
              <div className="pom-diagram__label">
                Tests interact with Page Objects, which interact with the browser.
              </div>
            </div>
          </section>

          {/* Problems Without POM */}
          <section id="without-pom">
            <h2>Problems Without POM</h2>
            <p>
              Before learning POM, let's see what happens when you write tests <strong>without</strong> any
              design pattern. Here's a typical example of a test that logs in and checks the dashboard:
            </p>

            <CodeBlock
              code={`import { test, expect } from '@playwright/test';

// Test 1: Check dashboard after login
test('should show dashboard after login', async ({ page }) => {
  await page.goto('https://myapp.com/login');
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('secret123');
  await page.locator('button[type="submit"]').click();
  await expect(page.locator('.dashboard-title')).toHaveText('Welcome');
});

// Test 2: Check profile page after login
test('should show profile page', async ({ page }) => {
  // Duplicated login code!
  await page.goto('https://myapp.com/login');
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('secret123');
  await page.locator('button[type="submit"]').click();

  await page.locator('.nav-profile').click();
  await expect(page.locator('.profile-name')).toBeVisible();
});

// Test 3: Check settings after login
test('should access settings', async ({ page }) => {
  // Same login code AGAIN!
  await page.goto('https://myapp.com/login');
  await page.locator('#username').fill('admin');
  await page.locator('#password').fill('secret123');
  await page.locator('button[type="submit"]').click();

  await page.locator('.nav-settings').click();
  await expect(page.locator('.settings-panel')).toBeVisible();
});`}
              language="typescript"
              fileName="bad-example.spec.ts"
            />

            <div className="warning-box">
              <strong>What's wrong here?</strong>
              <ul>
                <li><strong>Code Duplication:</strong> The login logic is repeated in every test. If the login form changes (e.g., the selector changes from <code>#username</code> to <code>#email</code>), you must update every single test.</li>
                <li><strong>Hard to Maintain:</strong> With 50+ tests, changing one selector means modifying dozens of files.</li>
                <li><strong>Poor Readability:</strong> Tests are full of raw selectors and implementation details instead of business logic.</li>
                <li><strong>No Reusability:</strong> You can't share interactions between test files.</li>
              </ul>
            </div>
          </section>

          {/* POM Structure */}
          <section id="structure">
            <h2>POM Structure</h2>
            <p>
              A well-organized POM project follows a clear folder structure. Here's the recommended layout:
            </p>

            <div className="file-tree">
              <span className="folder">project-root/</span><br />
              ├── <span className="folder">tests/</span><br />
              │   ├── <span className="folder">pages/</span><br />
              │   │   ├── <span className="highlight-file">BasePage.ts</span>          &nbsp;&nbsp;# Abstract base class<br />
              │   │   ├── <span className="highlight-file">LoginPage.ts</span>         &nbsp;&nbsp;# Login page object<br />
              │   │   ├── <span className="highlight-file">DashboardPage.ts</span>     &nbsp;&nbsp;# Dashboard page object<br />
              │   │   └── <span className="highlight-file">ProfilePage.ts</span>       &nbsp;&nbsp;# Profile page object<br />
              │   ├── <span className="file">login.spec.ts</span>             &nbsp;&nbsp;# Login tests<br />
              │   ├── <span className="file">dashboard.spec.ts</span>         &nbsp;&nbsp;# Dashboard tests<br />
              │   └── <span className="file">profile.spec.ts</span>           &nbsp;&nbsp;# Profile tests<br />
              ├── <span className="file">playwright.config.ts</span><br />
              ├── <span className="file">tsconfig.json</span><br />
              └── <span className="file">package.json</span>
            </div>

            <h3>The Core Principles</h3>
            <ul>
              <li><strong>Locators</strong> are defined as class properties or getters — never hardcoded in tests</li>
              <li><strong>Actions</strong> are encapsulated as public methods (e.g., <code>login()</code>, <code>search()</code>)</li>
              <li><strong>Helper logic</strong> stays as private methods inside the Page Object</li>
              <li><strong>Tests</strong> only call Page Object methods — they never touch selectors directly</li>
            </ul>
          </section>

          {/* Creating a Page Object */}
          <section id="creating-po">
            <h2>Creating a Page Object</h2>
            <p>
              Let's build a proper Page Object step by step. We'll create a <code>LoginPage</code> that
              encapsulates all the login functionality:
            </p>

            <CodeBlock
              code={`import { Page, Locator } from '@playwright/test';

export class LoginPage {
  // The page instance from Playwright
  private readonly page: Page;

  // Locators defined as class properties
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;
  private readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize all locators in the constructor
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.error-message');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
  }

  // Public action methods
  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginWithRememberMe(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.rememberMeCheckbox.check();
    await this.submitButton.click();
  }

  // Methods that return data
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
}`}
              language="typescript"
              fileName="tests/pages/LoginPage.ts"
            />

            <p>Now look how clean the test becomes:</p>

            <CodeBlock
              code={`import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('successful login redirects to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('admin', 'password123');

  await expect(page).toHaveURL('/dashboard');
});

test('invalid credentials show error', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login('wrong', 'credentials');

  const error = await loginPage.getErrorMessage();
  expect(error).toContain('Invalid credentials');
});

test('remember me keeps user logged in', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginWithRememberMe('admin', 'password123');

  await expect(page).toHaveURL('/dashboard');
});`}
              language="typescript"
              fileName="tests/login.spec.ts"
            />

            <div className="tip-box">
              <strong>Key Takeaway</strong>
              Notice how the tests read like plain English: "go to login page, login with these credentials,
              expect to be on dashboard." No selectors, no implementation details — just clean business logic.
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices">
            <h2>Best Practices</h2>

            <div className="practices-list">
              <div className="practice-item">
                <div className="practice-item__icon practice-item__icon--do">&#10004;</div>
                <div className="practice-item__content">
                  <h4>One Page Object = One Page or Component</h4>
                  <p>
                    Each class should represent a single page or a significant UI component.
                    Don't create a "GodObject" that handles everything.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-item__icon practice-item__icon--do">&#10004;</div>
                <div className="practice-item__content">
                  <h4>No Assertions in Page Objects</h4>
                  <p>
                    Page Objects should only contain locators and actions. All assertions (<code>expect()</code>)
                    belong in test files. This keeps Page Objects reusable across different test scenarios.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-item__icon practice-item__icon--do">&#10004;</div>
                <div className="practice-item__content">
                  <h4>Use Descriptive Method Names</h4>
                  <p>
                    Methods should describe the business action: <code>addToCart()</code>, <code>searchForProduct()</code>,
                    not <code>clickButton()</code> or <code>fillInput()</code>.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-item__icon practice-item__icon--do">&#10004;</div>
                <div className="practice-item__content">
                  <h4>Return Promises from All Async Methods</h4>
                  <p>
                    Always type your return values. Use <code>Promise&lt;void&gt;</code> for actions
                    and <code>Promise&lt;string&gt;</code>, <code>Promise&lt;boolean&gt;</code>, etc. for data retrieval methods.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-item__icon practice-item__icon--dont">&#10008;</div>
                <div className="practice-item__content">
                  <h4>Don't Expose Raw Locators</h4>
                  <p>
                    Avoid making locators public. Instead, provide methods that use the locators internally.
                    If a test needs to check visibility, provide a method like <code>isErrorVisible()</code>.
                  </p>
                </div>
              </div>

              <div className="practice-item">
                <div className="practice-item__icon practice-item__icon--dont">&#10008;</div>
                <div className="practice-item__content">
                  <h4>Don't Use Hardcoded Waits</h4>
                  <p>
                    Avoid <code>page.waitForTimeout()</code> in production code. Use Playwright's built-in
                    auto-waiting or explicit wait conditions like <code>waitForLoadState()</code>.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Base Page Pattern */}
          <section id="base-page">
            <h2>Base Page Pattern</h2>
            <p>
              In enterprise projects, you'll notice many pages share common functionality: navigation,
              waiting for page load, handling cookies, etc. The <strong>Base Page</strong> pattern
              extracts this shared logic into an abstract parent class.
            </p>

            <CodeBlock
              code={`import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  // Common locators shared across all pages
  protected readonly header: Locator;
  protected readonly footer: Locator;
  protected readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.locator('header');
    this.footer = page.locator('footer');
    this.loadingSpinner = page.locator('.loading-spinner');
  }

  // Abstract method - each child MUST define its own URL
  abstract getUrl(): string;

  // Shared navigation
  async navigate(): Promise<void> {
    await this.page.goto(this.getUrl());
    await this.waitForPageLoad();
  }

  // Wait for the page to be fully loaded
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    // Wait for loading spinner to disappear
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 })
      .catch(() => {}); // Ignore if spinner doesn't exist
  }

  // Common: get page title
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  // Common: get current URL
  getCurrentUrl(): string {
    return this.page.url();
  }

  // Common: take screenshot
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: \`screenshots/\${name}.png\` });
  }
}`}
              language="typescript"
              fileName="tests/pages/BasePage.ts"
            />

            <p>Now every page object extends <code>BasePage</code> and inherits all shared functionality:</p>

            <CodeBlock
              code={`import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly welcomeMessage: Locator;
  private readonly statsCards: Locator;
  private readonly recentActivity: Locator;

  constructor(page: Page) {
    super(page);  // Call parent constructor
    this.welcomeMessage = page.locator('.welcome-msg');
    this.statsCards = page.locator('.stats-card');
    this.recentActivity = page.locator('.recent-activity');
  }

  // Implement the abstract method
  getUrl(): string {
    return '/dashboard';
  }

  async getWelcomeText(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }

  async getStatsCount(): Promise<number> {
    return await this.statsCards.count();
  }

  async isRecentActivityVisible(): Promise<boolean> {
    return await this.recentActivity.isVisible();
  }
}`}
              language="typescript"
              fileName="tests/pages/DashboardPage.ts"
            />

            <CodeBlock
              code={`import { test, expect } from '@playwright/test';
import { DashboardPage } from './pages/DashboardPage';

test('dashboard loads correctly', async ({ page }) => {
  const dashboard = new DashboardPage(page);

  // navigate() and waitForPageLoad() come from BasePage!
  await dashboard.navigate();

  const welcome = await dashboard.getWelcomeText();
  expect(welcome).toContain('Welcome');

  const statsCount = await dashboard.getStatsCount();
  expect(statsCount).toBeGreaterThan(0);
});`}
              language="typescript"
              fileName="tests/dashboard.spec.ts"
            />

            <div className="info-box">
              <strong>Inheritance Chain</strong>
              <code>DashboardPage</code> → extends <code>BasePage</code> → gives you
              <code>navigate()</code>, <code>waitForPageLoad()</code>, <code>getPageTitle()</code>,
              <code>takeScreenshot()</code> — all for free, without writing any extra code.
            </div>
          </section>

          {/* Real-World Example */}
          <section id="real-example">
            <h2>Real-World Example: FutbinPage</h2>
            <p>
              Let's look at a <strong>real Page Object</strong> from an actual project. This
              <code>FutbinPage</code> class interacts with the FUTBIN website to scrape popular
              player data. Pay attention to how it organizes locators, actions, and helpers.
            </p>

            <CodeBlock
              code={`import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class FutbinPage {
    // Store the page instance via constructor shorthand
    constructor(private page: Page) { }

    // Navigate to the site and handle cookies
    async goto(): Promise<void> {
        await this.page.goto('https://www.futbin.com');
        await this.page.waitForTimeout(2000);
        await this.acceptCookies();
    }

    // Private-like helper: handle cookie consent popups
    async acceptCookies(): Promise<void> {
        const selectors = [
            '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
            'button:has-text("Allow all")',
            '#CybotCookiebotDialogBodyButtonAccept',
            '.fc-cta-consent',
            'button:has-text("Accept")'
        ];

        for (const selector of selectors) {
            const btn = this.page.locator(selector).first();
            if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await btn.click();
                await this.page.waitForTimeout(1000);
                return;
            }
        }
    }

    // Navigate to the popular players section
    async goToPopularPlayers(): Promise<void> {
        await this.page.locator('a:has-text("Players")').first().hover();
        await this.page.waitForTimeout(500);
        await this.page.locator('a[href="/popular"]').first().click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    // Extract player data from the page
    async getPopularPlayers(): Promise<{ name: string; price: string }[]> {
        const players = await this.page.evaluate(() => {
            const results: { name: string; price: string }[] = [];
            const playerCards = document.querySelectorAll(
                'a.playercard-wrapper[href*="/player/"]'
            );

            playerCards.forEach((card: Element) => {
                const href = card.getAttribute('href') || '';
                const match = href.match(/\\/player\\/\\d+\\/([^/?]+)/);
                if (match) {
                    const nameFromUrl = match[1]
                        .replace(/-/g, ' ')
                        .replace(/\\b\\w/g, c => c.toUpperCase());

                    const priceEl = card.querySelector('.platform-pc-only');
                    let price = 'N/A';
                    if (priceEl) {
                        const priceText = priceEl.textContent?.trim() || '';
                        const priceMatch = priceText.match(/(\\d{1,3}(,\\d{3})*)/);
                        if (priceMatch) price = priceMatch[1];
                    }

                    if (!results.some(r => r.name === nameFromUrl)) {
                        results.push({ name: nameFromUrl, price });
                    }
                }
            });
            return results;
        });
        return players;
    }

    // Save data to a report file
    async saveReport(
        players: { name: string; price: string }[]
    ): Promise<string> {
        const reportsDir = path.join(__dirname, '..', '..', 'reports');
        if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filepath = path.join(reportsDir,
            \`popular-players-\${timestamp}.txt\`);

        const content = [
            '=== FUTBIN Popular Players Report ===',
            \`Date: \${new Date().toLocaleString()}\`,
            \`Total Players: \${players.length}\`,
            '',
            ...players.map((p, i) => \`\${i + 1}. \${p.name} - \${p.price}\`)
        ].join('\\n');

        fs.writeFileSync(filepath, content);
        return filepath;
    }
}`}
              language="typescript"
              fileName="tests/pages/FutbinPage.ts"
            />

            <h3>Method Breakdown</h3>
            <div className="method-breakdown">
              <div className="method-card">
                <div className="method-card__name">goto()</div>
                <div className="method-card__return">Returns: Promise&lt;void&gt;</div>
                <div className="method-card__desc">
                  Navigates to the site and handles the cookie consent popup. This is the entry point —
                  every test starts by calling this method.
                </div>
              </div>
              <div className="method-card">
                <div className="method-card__name">acceptCookies()</div>
                <div className="method-card__return">Returns: Promise&lt;void&gt;</div>
                <div className="method-card__desc">
                  A helper method that tries multiple selectors for the cookie banner. Uses a fallback
                  strategy — tries each selector and clicks the first visible one. Gracefully handles
                  cases where no banner appears.
                </div>
              </div>
              <div className="method-card">
                <div className="method-card__name">goToPopularPlayers()</div>
                <div className="method-card__return">Returns: Promise&lt;void&gt;</div>
                <div className="method-card__desc">
                  Navigates to the popular players page via the dropdown menu. Hovers over the "Players"
                  link, then clicks the "Popular" option. Waits for the page to load.
                </div>
              </div>
              <div className="method-card">
                <div className="method-card__name">getPopularPlayers()</div>
                <div className="method-card__return">Returns: Promise&lt;{'{ name: string; price: string }[]'}&gt;</div>
                <div className="method-card__desc">
                  Extracts player data directly from the DOM using <code>page.evaluate()</code>. Returns
                  a typed array of player objects with name and price. Avoids duplicates.
                </div>
              </div>
              <div className="method-card">
                <div className="method-card__name">saveReport()</div>
                <div className="method-card__return">Returns: Promise&lt;string&gt;</div>
                <div className="method-card__desc">
                  Saves the extracted data to a text file with a timestamp. Creates the reports directory
                  if it doesn't exist. Returns the file path.
                </div>
              </div>
            </div>

            <h3>The Test Using This Page Object</h3>

            <CodeBlock
              code={`import { test, expect } from '@playwright/test';
import { FutbinPage } from './pages/FutbinPage';

test('Get Popular Players List', async ({ page }) => {
    const futbin = new FutbinPage(page);

    // Navigate and handle cookies
    await futbin.goto();

    // Navigate to popular players
    await futbin.goToPopularPlayers();

    // Extract player data
    const players = await futbin.getPopularPlayers();

    // Log results
    console.log('\\n=== Popular Players ===');
    players.forEach((p, i) => {
        console.log(\`\${i + 1}. \${p.name} - \${p.price}\`);
    });

    // Save report
    const reportPath = await futbin.saveReport(players);
    console.log(\`\\nReport saved to: \${reportPath}\`);

    // Assert we found players
    expect(players.length).toBeGreaterThan(0);
});`}
              language="typescript"
              fileName="tests/stoichkov-pom.spec.ts"
            />

            <div className="tip-box">
              <strong>Notice the Simplicity</strong>
              The test is only ~15 lines of clean, readable code. All the complexity — cookie handling,
              DOM parsing, file I/O — is hidden inside the Page Object. If FUTBIN changes their UI,
              you only update <code>FutbinPage.ts</code>.
            </div>
          </section>

          {/* Component Objects */}
          <section id="component-objects">
            <h2>Component Objects</h2>
            <p>
              Sometimes a page has reusable UI components (header, navigation, modals, search bars)
              that appear on multiple pages. Instead of duplicating these in every Page Object,
              create <strong>Component Objects</strong> and compose them.
            </p>

            <CodeBlock
              code={`import { Page, Locator } from '@playwright/test';

// Component Object for the navigation bar
export class NavigationComponent {
  private readonly page: Page;
  private readonly homeLink: Locator;
  private readonly profileLink: Locator;
  private readonly settingsLink: Locator;
  private readonly logoutButton: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    const nav = page.locator('nav.main-nav');
    this.homeLink = nav.getByRole('link', { name: 'Home' });
    this.profileLink = nav.getByRole('link', { name: 'Profile' });
    this.settingsLink = nav.getByRole('link', { name: 'Settings' });
    this.logoutButton = nav.getByRole('button', { name: 'Logout' });
    this.searchInput = nav.getByPlaceholder('Search...');
  }

  async goToHome(): Promise<void> {
    await this.homeLink.click();
  }

  async goToProfile(): Promise<void> {
    await this.profileLink.click();
  }

  async goToSettings(): Promise<void> {
    await this.settingsLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }
}`}
              language="typescript"
              fileName="tests/components/NavigationComponent.ts"
            />

            <p>Then compose it into your Page Objects:</p>

            <CodeBlock
              code={`import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavigationComponent } from '../components/NavigationComponent';

export class DashboardPage extends BasePage {
  // Compose the navigation component
  public readonly navigation: NavigationComponent;

  constructor(page: Page) {
    super(page);
    this.navigation = new NavigationComponent(page);
  }

  getUrl(): string {
    return '/dashboard';
  }

  // ... dashboard-specific methods
}

// In your test:
// const dashboard = new DashboardPage(page);
// await dashboard.navigate();
// await dashboard.navigation.goToSettings(); // Use component!`}
              language="typescript"
              fileName="tests/pages/DashboardPage.ts"
            />

            <div className="info-box">
              <strong>Composition over Duplication</strong>
              The <code>NavigationComponent</code> is written once and used in every page that has a nav bar.
              If the navigation UI changes, update one file — not every page object.
            </div>
          </section>

          {/* Advanced POM */}
          <section id="advanced-pom">
            <h2>Advanced POM Patterns</h2>

            <h3>Fluent Interface (Method Chaining)</h3>
            <p>
              The fluent interface pattern lets you chain method calls for more expressive tests.
              Each method returns <code>this</code> (or another page object) instead of <code>void</code>:
            </p>

            <CodeBlock
              code={`import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
  private readonly page: Page;
  private readonly addressInput: Locator;
  private readonly cityInput: Locator;
  private readonly zipInput: Locator;
  private readonly cardNumberInput: Locator;
  private readonly placeOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addressInput = page.getByLabel('Address');
    this.cityInput = page.getByLabel('City');
    this.zipInput = page.getByLabel('ZIP Code');
    this.cardNumberInput = page.getByLabel('Card Number');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
  }

  // Each method returns 'this' for chaining
  async fillAddress(address: string): Promise<CheckoutPage> {
    await this.addressInput.fill(address);
    return this;
  }

  async fillCity(city: string): Promise<CheckoutPage> {
    await this.cityInput.fill(city);
    return this;
  }

  async fillZip(zip: string): Promise<CheckoutPage> {
    await this.zipInput.fill(zip);
    return this;
  }

  async fillCardNumber(card: string): Promise<CheckoutPage> {
    await this.cardNumberInput.fill(card);
    return this;
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}

// Usage in test — clean, chainable:
// const checkout = new CheckoutPage(page);
// await (await (await (await checkout
//   .fillAddress('123 Main St'))
//   .fillCity('New York'))
//   .fillZip('10001'))
//   .fillCardNumber('4111111111111111');
// await checkout.placeOrder();`}
              language="typescript"
              fileName="tests/pages/CheckoutPage.ts"
            />

            <h3>Data-Driven Page Objects</h3>
            <p>
              Use TypeScript interfaces to create typed test data that works seamlessly with your
              Page Objects:
            </p>

            <CodeBlock
              code={`// Define typed test data interfaces
interface UserCredentials {
  username: string;
  password: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Page Object with typed data methods
export class RegistrationPage {
  constructor(private page: Page) {}

  async fillRegistrationForm(user: UserCredentials & {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<void> {
    await this.page.getByLabel('First Name').fill(user.firstName);
    await this.page.getByLabel('Last Name').fill(user.lastName);
    await this.page.getByLabel('Email').fill(user.email);
    await this.page.getByLabel('Username').fill(user.username);
    await this.page.getByLabel('Password').fill(user.password);
  }

  async fillShippingInfo(shipping: ShippingInfo): Promise<void> {
    await this.page.getByLabel('Address').fill(shipping.address);
    await this.page.getByLabel('City').fill(shipping.city);
    await this.page.getByLabel('State').fill(shipping.state);
    await this.page.getByLabel('ZIP').fill(shipping.zip);
    await this.page.getByLabel('Country').fill(shipping.country);
  }
}

// Test with typed data
// const testUser = {
//   firstName: 'John', lastName: 'Doe',
//   email: 'john@test.com',
//   username: 'johndoe', password: 'Test@123'
// };
// await registrationPage.fillRegistrationForm(testUser);`}
              language="typescript"
              fileName="tests/pages/RegistrationPage.ts"
            />
          </section>

          {/* Enterprise Structure */}
          <section id="enterprise">
            <h2>Enterprise Project Structure</h2>
            <p>
              Here's what a fully-scaled enterprise test automation project looks like. This structure
              supports dozens of page objects, shared components, test data management, and custom utilities:
            </p>

            <div className="file-tree">
              <span className="folder">enterprise-test-project/</span><br />
              ├── <span className="folder">tests/</span><br />
              │   ├── <span className="folder">pages/</span><br />
              │   │   ├── <span className="highlight-file">BasePage.ts</span><br />
              │   │   ├── <span className="file">LoginPage.ts</span><br />
              │   │   ├── <span className="file">DashboardPage.ts</span><br />
              │   │   ├── <span className="file">ProductPage.ts</span><br />
              │   │   ├── <span className="file">CartPage.ts</span><br />
              │   │   ├── <span className="file">CheckoutPage.ts</span><br />
              │   │   └── <span className="file">ProfilePage.ts</span><br />
              │   ├── <span className="folder">components/</span><br />
              │   │   ├── <span className="file">NavigationComponent.ts</span><br />
              │   │   ├── <span className="file">HeaderComponent.ts</span><br />
              │   │   ├── <span className="file">FooterComponent.ts</span><br />
              │   │   ├── <span className="file">SearchComponent.ts</span><br />
              │   │   └── <span className="file">ModalComponent.ts</span><br />
              │   ├── <span className="folder">specs/</span><br />
              │   │   ├── <span className="folder">auth/</span><br />
              │   │   │   ├── <span className="file">login.spec.ts</span><br />
              │   │   │   ├── <span className="file">logout.spec.ts</span><br />
              │   │   │   └── <span className="file">registration.spec.ts</span><br />
              │   │   ├── <span className="folder">shopping/</span><br />
              │   │   │   ├── <span className="file">product-browse.spec.ts</span><br />
              │   │   │   ├── <span className="file">add-to-cart.spec.ts</span><br />
              │   │   │   └── <span className="file">checkout.spec.ts</span><br />
              │   │   └── <span className="folder">user/</span><br />
              │   │       ├── <span className="file">profile.spec.ts</span><br />
              │   │       └── <span className="file">settings.spec.ts</span><br />
              │   ├── <span className="folder">fixtures/</span><br />
              │   │   ├── <span className="highlight-file">test-data.ts</span>           &nbsp;&nbsp;# Typed test data<br />
              │   │   └── <span className="highlight-file">custom-fixtures.ts</span>     &nbsp;&nbsp;# Playwright fixtures<br />
              │   └── <span className="folder">utils/</span><br />
              │       ├── <span className="file">helpers.ts</span>              &nbsp;&nbsp;# Shared utilities<br />
              │       └── <span className="file">api-client.ts</span>           &nbsp;&nbsp;# API helpers<br />
              ├── <span className="file">playwright.config.ts</span><br />
              ├── <span className="file">tsconfig.json</span><br />
              └── <span className="file">package.json</span>
            </div>

            <h3>Using Playwright Fixtures for POM</h3>
            <p>
              For the cleanest test code, you can use Playwright's <strong>fixtures</strong> system
              to automatically create Page Objects and inject them into your tests:
            </p>

            <CodeBlock
              code={`import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductPage } from './pages/ProductPage';

// Declare your custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  productPage: ProductPage;
};

// Extend Playwright's test with your fixtures
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
});

export { expect } from '@playwright/test';`}
              language="typescript"
              fileName="tests/fixtures/custom-fixtures.ts"
            />

            <CodeBlock
              code={`// Import YOUR custom test, not Playwright's
import { test, expect } from '../fixtures/custom-fixtures';

// Page objects are automatically injected!
test('user can browse products', async ({ loginPage, dashboardPage, productPage }) => {
  await loginPage.goto();
  await loginPage.login('admin', 'password');

  // No need to create page objects manually
  await dashboardPage.navigate();
  const welcome = await dashboardPage.getWelcomeText();
  expect(welcome).toContain('Welcome');
});`}
              language="typescript"
              fileName="tests/specs/shopping/product-browse.spec.ts"
            />

            <div className="tip-box">
              <strong>This is Enterprise-Level</strong>
              Fixtures are the recommended way to use POM in Playwright. They handle instantiation,
              cleanup, and dependency injection automatically. This is the pattern used by major
              companies in their test suites.
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
              <button className="mark-complete-btn" onClick={() => markPageComplete('pom')}>
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

export default POM;
