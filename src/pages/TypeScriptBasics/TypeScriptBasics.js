import React from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import './TypeScriptBasics.css';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation & Setup' },
  { id: 'basic-types', label: 'Basic Types' },
  { id: 'interfaces', label: 'Interfaces & Types' },
  { id: 'functions', label: 'Functions' },
  { id: 'classes', label: 'Classes' },
  { id: 'generics', label: 'Generics' },
  { id: 'ts-playwright', label: 'TypeScript for Playwright' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'full-example', label: 'Full Example' },
];

/* ── Code Snippets ───────────────────────────────────────── */

const tsVsJsCode = `// JavaScript - no type safety
function login(username, password) {
  // username could be anything: number, object, undefined...
  return api.post('/login', { username, password });
}

// TypeScript - catches mistakes at compile time
function login(username: string, password: string): Promise<AuthResponse> {
  // TypeScript ensures username and password are always strings.
  // If you pass a number by accident, the compiler will tell you
  // BEFORE you even run the code.
  return api.post('/login', { username, password });
}`;

const installCode = `# Create a new project directory
mkdir my-playwright-project
cd my-playwright-project

# Initialize a Node.js project
npm init -y

# Install TypeScript and Node type definitions
npm install --save-dev typescript @types/node

# Install Playwright with its test runner
npm install --save-dev @playwright/test

# Install browsers (Chromium, Firefox, WebKit)
npx playwright install`;

const tsconfigCode = `{
  "compilerOptions": {
    // Target modern JavaScript output
    "target": "ES2020",
    // Use Node-style module resolution
    "module": "commonjs",
    "moduleResolution": "node",
    // Enable all strict type-checking options
    "strict": true,
    // Allow default imports from modules with no default export
    "esModuleInterop": true,
    // Output compiled files to a dist/ folder
    "outDir": "./dist",
    // Root of your TypeScript source files
    "rootDir": "./src",
    // Generate source maps for debugging
    "sourceMap": true,
    // Skip type-checking declaration files for faster builds
    "skipLibCheck": true,
    // Ensure file name casing is consistent across platforms
    "forceConsistentCasingInFileNames": true,
    // Resolve JSON modules as imports
    "resolveJsonModule": true
  },
  "include": ["src/**/*", "tests/**/*"],
  "exclude": ["node_modules", "dist"]
}`;

const basicTypesCode = `// ─── Primitive Types ──────────────────────────────
let username: string = 'admin';
let age: number = 30;
let isLoggedIn: boolean = true;

// ─── Arrays ──────────────────────────────────────
let scores: number[] = [95, 87, 92];
let names: Array<string> = ['Alice', 'Bob', 'Charlie'];

// ─── Tuple ────────────────────────────────────────
// Fixed-length array where each position has a specific type
let user: [string, number] = ['admin', 1];
// user[0] is always string, user[1] is always number

// ─── Enum ─────────────────────────────────────────
enum TestStatus {
  Passed = 'PASSED',
  Failed = 'FAILED',
  Skipped = 'SKIPPED',
}
let result: TestStatus = TestStatus.Passed;

// ─── any vs unknown ──────────────────────────────
// "any" disables type checking entirely (avoid!)
let riskyValue: any = 42;
riskyValue.nonExistentMethod(); // No error - dangerous!

// "unknown" is the type-safe version of any
let safeValue: unknown = 42;
// safeValue.nonExistentMethod(); // Error! Must narrow first
if (typeof safeValue === 'number') {
  console.log(safeValue.toFixed(2)); // OK after type check
}

// ─── void and never ──────────────────────────────
// "void" means a function returns nothing
function logMessage(msg: string): void {
  console.log(msg);
}

// "never" means a function never returns (throws or infinite loop)
function throwError(message: string): never {
  throw new Error(message);
}`;

const typeInferenceCode = `// TypeScript infers the type from the assigned value.
// You do NOT always need explicit annotations.

let count = 10;             // inferred as number
let greeting = 'hello';     // inferred as string
let isActive = true;        // inferred as boolean

// Arrays are also inferred
let items = [1, 2, 3];     // inferred as number[]

// Function return types are inferred from the return statement
function double(n: number) {
  return n * 2;             // return type inferred as number
}

// When should you add explicit types?
// 1. Function parameters (always)
// 2. Complex objects or API responses
// 3. When the inferred type is too broad (e.g., "any")
// 4. Public interfaces for clarity`;

const interfaceCode = `// ─── Interfaces ──────────────────────────────────
// Interfaces describe the shape of an object.
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Now TypeScript enforces this shape everywhere:
const admin: User = {
  id: 1,
  name: 'Admin',
  email: 'admin@example.com',
  isActive: true,
};

// ─── Optional Properties ─────────────────────────
interface TestConfig {
  baseURL: string;
  timeout?: number;       // Optional - may or may not exist
  retries?: number;       // Optional
  headless: boolean;
}

const config: TestConfig = {
  baseURL: 'https://example.com',
  headless: true,
  // timeout and retries are optional, so we can omit them
};

// ─── Readonly Properties ─────────────────────────
interface Credentials {
  readonly username: string;
  readonly password: string;
}

const creds: Credentials = {
  username: 'testuser',
  password: 'secret123',
};
// creds.username = 'other'; // Error! Cannot reassign readonly

// ─── Extending Interfaces ────────────────────────
interface BasePage {
  url: string;
  title: string;
}

interface LoginPage extends BasePage {
  usernameField: string;
  passwordField: string;
  submitButton: string;
}

// LoginPage now has url, title, usernameField,
// passwordField, and submitButton`;

const typeAliasCode = `// ─── Type Aliases ────────────────────────────────
// Type aliases create a name for any type, not just objects.

type ID = string | number;        // Union type
type Status = 'pass' | 'fail' | 'skip';  // Literal type
type Coordinates = [number, number];      // Tuple alias

let userId: ID = 'abc-123';       // OK: string
userId = 42;                      // OK: number
// userId = true;                 // Error! boolean not allowed

let testResult: Status = 'pass';  // OK
// testResult = 'error';          // Error! Not in the union

// ─── Interface vs Type ───────────────────────────
// Interfaces can be extended and merged (declaration merging).
// Types can represent unions, intersections, and primitives.

// Use interface for objects you expect others to extend.
// Use type for unions, primitives, and utility types.

// ─── Intersection Types ──────────────────────────
type HasName = { name: string };
type HasAge = { age: number };
type Person = HasName & HasAge;

const person: Person = {
  name: 'Alice',
  age: 30,
};

// ─── Mapped / Utility Types ─────────────────────
interface FormFields {
  email: string;
  password: string;
  remember: boolean;
}

// Make all fields optional
type PartialForm = Partial<FormFields>;

// Make all fields required
type RequiredForm = Required<FormFields>;

// Pick specific fields
type LoginFields = Pick<FormFields, 'email' | 'password'>;

// Omit specific fields
type QuickLogin = Omit<FormFields, 'remember'>;`;

const functionsCode = `// ─── Typed Parameters and Return Types ───────────
function add(a: number, b: number): number {
  return a + b;
}

// ─── Optional Parameters ─────────────────────────
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? 'Hello'}, \${name}!\`;
}
greet('Alice');            // "Hello, Alice!"
greet('Alice', 'Hi');     // "Hi, Alice!"

// ─── Default Parameters ─────────────────────────
function createUser(
  name: string,
  role: string = 'viewer',
  isActive: boolean = true
): { name: string; role: string; isActive: boolean } {
  return { name, role, isActive };
}
createUser('Bob');                // { name: 'Bob', role: 'viewer', isActive: true }
createUser('Bob', 'admin');      // { name: 'Bob', role: 'admin', isActive: true }

// ─── Arrow Functions ─────────────────────────────
const multiply = (a: number, b: number): number => a * b;

// With an object return type
const buildUser = (name: string): User => ({
  id: Date.now(),
  name,
  email: \`\${name.toLowerCase()}@test.com\`,
  isActive: true,
});

// ─── Function Types (callbacks) ──────────────────
type ClickHandler = (element: string) => Promise<void>;

const handleClick: ClickHandler = async (element) => {
  console.log(\`Clicking \${element}...\`);
};

// ─── Async / Await ───────────────────────────────
async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  if (!response.ok) {
    throw new Error(\`HTTP error: \${response.status}\`);
  }
  const data: User = await response.json();
  return data;
}

// ─── Rest Parameters ─────────────────────────────
function logAll(prefix: string, ...messages: string[]): void {
  messages.forEach(msg => console.log(\`[\${prefix}] \${msg}\`));
}
logAll('TEST', 'Started', 'Running assertions', 'Done');`;

const classesCode = `// ─── Basic Class ─────────────────────────────────
class Animal {
  // Properties with access modifiers
  public name: string;
  private sound: string;
  protected speed: number;

  constructor(name: string, sound: string, speed: number) {
    this.name = name;
    this.sound = sound;
    this.speed = speed;
  }

  // Public method - accessible from anywhere
  public speak(): string {
    return \`\${this.name} says \${this.sound}\`;
  }

  // Private method - only accessible inside this class
  private getInternalId(): number {
    return Math.random();
  }

  // Protected method - accessible in this class and subclasses
  protected move(): string {
    return \`\${this.name} moves at \${this.speed} km/h\`;
  }
}

const dog = new Animal('Rex', 'Woof', 40);
dog.speak();       // OK
// dog.sound;      // Error! Private property
// dog.speed;      // Error! Protected property`;

const classShorthandCode = `// ─── Constructor Shorthand ────────────────────────
// TypeScript allows you to declare and initialize properties
// directly in the constructor parameters:

class UserAccount {
  constructor(
    public readonly id: number,
    public name: string,
    private password: string,
    public isActive: boolean = true
  ) {}

  // This is equivalent to declaring properties above
  // the constructor and assigning them manually.

  public validatePassword(input: string): boolean {
    return this.password === input;
  }
}

const account = new UserAccount(1, 'Alice', 'secret');
console.log(account.name);       // 'Alice'
console.log(account.isActive);   // true
// account.password              // Error! Private`;

const inheritanceCode = `// ─── Inheritance ─────────────────────────────────
class BasePage {
  constructor(protected page: any) {}

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }
}

class LoginPage extends BasePage {
  private selectors = {
    username: '#username',
    password: '#password',
    submit: 'button[type="submit"]',
    error: '.error-message',
  };

  async login(user: string, pass: string): Promise<void> {
    await this.page.fill(this.selectors.username, user);
    await this.page.fill(this.selectors.password, pass);
    await this.page.click(this.selectors.submit);
  }

  async getErrorMessage(): Promise<string> {
    return await this.page.textContent(this.selectors.error);
  }
}

// ─── Abstract Classes ────────────────────────────
// Abstract classes CANNOT be instantiated directly.
// They define a contract that subclasses must follow.

abstract class BaseApiClient {
  constructor(protected baseURL: string) {}

  // Concrete method - shared logic
  protected buildUrl(path: string): string {
    return \`\${this.baseURL}\${path}\`;
  }

  // Abstract methods - MUST be implemented by subclasses
  abstract get(path: string): Promise<any>;
  abstract post(path: string, body: object): Promise<any>;
}

class RestApiClient extends BaseApiClient {
  async get(path: string): Promise<any> {
    const response = await fetch(this.buildUrl(path));
    return response.json();
  }

  async post(path: string, body: object): Promise<any> {
    const response = await fetch(this.buildUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return response.json();
  }
}`;

const genericsCode = `// ─── Generic Functions ───────────────────────────
// Generics let you write code that works with ANY type
// while still maintaining type safety.

function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

// TypeScript infers the type from the argument:
const firstNum = getFirst([10, 20, 30]);      // type: number | undefined
const firstStr = getFirst(['a', 'b', 'c']);   // type: string | undefined

// ─── Generic Interfaces ─────────────────────────
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Usage with specific types
type UserResponse = ApiResponse<User>;
type UserListResponse = ApiResponse<User[]>;

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

// ─── Generic Constraints ─────────────────────────
// You can restrict what types a generic accepts.

interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(\`Length: \${item.length}\`);
}

logLength('hello');              // OK: strings have length
logLength([1, 2, 3]);           // OK: arrays have length
logLength({ length: 10 });      // OK: object has length
// logLength(42);               // Error! numbers have no length

// ─── Multiple Generic Parameters ────────────────
function createPair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

const pair = createPair('name', 'Alice');  // [string, string]
const pair2 = createPair(1, true);         // [number, boolean]`;

const genericsRealWorldCode = `// ─── Real-World Example: Test Data Factory ──────
interface TestDataFactory<T> {
  create(overrides?: Partial<T>): T;
  createMany(count: number, overrides?: Partial<T>): T[];
}

interface UserData {
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

class UserFactory implements TestDataFactory<UserData> {
  private counter = 0;

  create(overrides?: Partial<UserData>): UserData {
    this.counter++;
    return {
      username: \`user_\${this.counter}\`,
      email: \`user\${this.counter}@test.com\`,
      role: 'viewer',
      ...overrides,  // Override any default values
    };
  }

  createMany(count: number, overrides?: Partial<UserData>): UserData[] {
    return Array.from({ length: count }, () => this.create(overrides));
  }
}

// Usage
const factory = new UserFactory();
const viewer = factory.create();
const admin = factory.create({ role: 'admin', username: 'superadmin' });
const bulkUsers = factory.createMany(5, { role: 'editor' });`;

const playwrightTypesCode = `import { test, expect, type Page, type Locator, type Browser } from '@playwright/test';

// ─── Page, Locator, and Browser Types ────────────
// Playwright exports precise TypeScript types for every object.

async function clickButton(page: Page, label: string): Promise<void> {
  // page is fully typed - autocomplete shows all methods
  const button: Locator = page.getByRole('button', { name: label });
  await button.click();
}

async function getInputValue(page: Page, selector: string): Promise<string> {
  const input: Locator = page.locator(selector);
  const value = await input.inputValue(); // TypeScript knows this returns string
  return value;
}

// ─── Test and Expect Typing ─────────────────────
test('user can log in successfully', async ({ page }) => {
  // "page" is automatically typed as Page by Playwright
  await page.goto('https://example.com/login');

  // Locators are typed - autocomplete shows fill, click, etc.
  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();

  // expect() is fully typed - shows relevant matchers
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Welcome')).toBeVisible();
});`;

const playwrightCustomTypesCode = `// ─── Custom Types for Test Data ──────────────────
interface LoginCredentials {
  username: string;
  password: string;
}

interface Product {
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface CheckoutData {
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  items: Product[];
}

// ─── Using Custom Types in Tests ─────────────────
const validUser: LoginCredentials = {
  username: 'john_doe',
  password: 'P@ssw0rd!',
};

const invalidUser: LoginCredentials = {
  username: '',
  password: 'short',
};

// ─── Typed Test Fixtures ─────────────────────────
// Extend Playwright's test fixtures with your own types
import { test as base } from '@playwright/test';

interface TestFixtures {
  validCredentials: LoginCredentials;
  testProduct: Product;
}

const test = base.extend<TestFixtures>({
  validCredentials: async ({}, use) => {
    await use({
      username: 'testuser',
      password: 'Test1234!',
    });
  },
  testProduct: async ({}, use) => {
    await use({
      name: 'Wireless Mouse',
      price: 29.99,
      category: 'Electronics',
      inStock: true,
    });
  },
});

// Now your tests have access to typed fixtures
test('add product to cart', async ({ page, testProduct }) => {
  // testProduct is typed as Product - full autocomplete
  await page.goto('/products');
  await page.getByText(testProduct.name).click();
  await expect(page.getByText(\`$\${testProduct.price}\`)).toBeVisible();
});`;

const bestPracticesStrictCode = `// tsconfig.json - always enable strict mode
{
  "compilerOptions": {
    "strict": true,
    // "strict" is shorthand for ALL of these:
    // "noImplicitAny": true,        - error on implicit any
    // "strictNullChecks": true,     - null/undefined must be handled
    // "strictFunctionTypes": true,  - stricter function type checking
    // "strictBindCallApply": true,  - check bind/call/apply arguments
    // "noImplicitThis": true,       - error on implicit this
    // "alwaysStrict": true          - emit "use strict" in output
  }
}`;

const bestPracticesAvoidAnyCode = `// BAD: Using "any" defeats the purpose of TypeScript
function processData(data: any) {
  return data.results.map((r: any) => r.name); // No safety at all
}

// GOOD: Define the shape of your data
interface ApiResult {
  name: string;
  score: number;
}

interface ApiData {
  results: ApiResult[];
  total: number;
}

function processData(data: ApiData): string[] {
  return data.results.map(r => r.name); // Full type safety
}

// GOOD: Use "unknown" when type is truly uncertain
function parseJson(raw: string): unknown {
  return JSON.parse(raw);
}

// Then narrow the type before using it
const parsed = parseJson('{"name": "test"}');
if (typeof parsed === 'object' && parsed !== null && 'name' in parsed) {
  console.log((parsed as { name: string }).name);
}`;

const fullExamplePageObjectCode = `// ─── src/pages/LoginPage.ts ──────────────────────
import { type Page, type Locator, expect } from '@playwright/test';

/** Represents the login page of the application. */
export class LoginPage {
  // Locators defined as readonly class properties
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('[data-testid="error-message"]');
    this.welcomeMessage = page.getByRole('heading', { name: /welcome/i });
  }

  /** Navigate to the login page. */
  async goto(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.page).toHaveTitle(/Login/);
  }

  /** Fill in credentials and submit the login form. */
  async login(credentials: LoginCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.submitButton.click();
  }

  /** Assert that login succeeded and the dashboard is visible. */
  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).toHaveURL(/\\/dashboard/);
    await expect(this.welcomeMessage).toBeVisible();
  }

  /** Assert that an error message is displayed. */
  async expectLoginError(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expectedText);
  }
}

// ─── src/types/test-data.ts ─────────────────────
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: string;
}`;

const fullExampleTestCode = `// ─── tests/login.spec.ts ─────────────────────────
import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import type { LoginCredentials } from '../src/types/test-data';

// ─── Test Data ───────────────────────────────────
const validAdmin: LoginCredentials = {
  username: 'admin@example.com',
  password: 'Admin1234!',
};

const invalidUser: LoginCredentials = {
  username: 'nobody@example.com',
  password: 'wrongpassword',
};

const emptyCredentials: LoginCredentials = {
  username: '',
  password: '',
};

// ─── Test Suite ──────────────────────────────────
test.describe('Login Page', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in with valid admin credentials', async () => {
    await loginPage.login(validAdmin);
    await loginPage.expectLoginSuccess();
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login(invalidUser);
    await loginPage.expectLoginError('Invalid username or password');
  });

  test('should show error for empty credentials', async () => {
    await loginPage.login(emptyCredentials);
    await loginPage.expectLoginError('Username is required');
  });

  test('should have a visible submit button', async () => {
    await expect(loginPage.submitButton).toBeEnabled();
    await expect(loginPage.submitButton).toHaveText('Sign In');
  });

  test('password field should mask input', async ({ page }) => {
    const passwordType = await loginPage.passwordInput.getAttribute('type');
    expect(passwordType).toBe('password');
  });
});`;

/* ── Component ──────────────────────────────────── */

function TypeScriptBasics() {
  const { progress, markPageComplete } = useAuth();
  const isCompleted = progress.typescript;

  return (
    <div className="ts-page">
      <div className="page-layout container">
        <article className="page-content">

          {/* ────── Header ────── */}
          <header>
            <span className="section-label section-label--blue">Chapter 1</span>
            <h1>TypeScript Basics</h1>
            <p className="page-subtitle">
              A comprehensive guide to TypeScript for test automation engineers.
              Learn the type system, interfaces, classes, and how TypeScript
              integrates with Playwright to produce reliable, maintainable tests.
            </p>
          </header>

          {/* ────── 1. Introduction ────── */}
          <section id="introduction">
            <h2>Introduction</h2>

            <h3>What Is TypeScript?</h3>
            <p>
              TypeScript is an open-source programming language developed and maintained by
              Microsoft. It is a <strong>strict syntactical superset of JavaScript</strong>,
              which means every valid JavaScript file is also valid TypeScript. TypeScript
              adds optional static type annotations that are checked at compile time and
              then stripped away, producing plain JavaScript that runs anywhere JavaScript
              runs: in browsers, in Node.js, and in test runners like Playwright.
            </p>

            <h3>Why TypeScript for Test Automation?</h3>
            <p>
              When you write test automation code, you deal with complex objects like
              pages, locators, API responses, and test data. Without types, bugs slip
              through silently until your tests fail at runtime, often with cryptic error
              messages. TypeScript catches these problems before you even run the code:
            </p>
            <ul>
              <li>
                <strong>Compile-time error detection</strong> &mdash; misspelled property names,
                wrong argument types, and missing fields are flagged instantly in your editor.
              </li>
              <li>
                <strong>Intelligent autocomplete</strong> &mdash; your editor knows every method on
                a <code>Page</code>, every property on a <code>Locator</code>, and every matcher
                on <code>expect()</code>.
              </li>
              <li>
                <strong>Self-documenting code</strong> &mdash; type annotations act as living
                documentation. A function signature tells you exactly what it accepts and returns.
              </li>
              <li>
                <strong>Safer refactoring</strong> &mdash; rename a property or change a function
                signature, and TypeScript shows every file that needs updating.
              </li>
            </ul>

            <h3>TypeScript vs JavaScript</h3>
            <p>
              The following example shows the same function written in both languages.
              Notice how the TypeScript version catches potential bugs at compile time
              rather than at runtime:
            </p>
            <CodeBlock code={tsVsJsCode} language="typescript" fileName="comparison.ts" />

            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>JavaScript</th>
                    <th>TypeScript</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Type Safety</td>
                    <td>None (dynamic typing)</td>
                    <td>Full static type checking</td>
                  </tr>
                  <tr>
                    <td>Error Detection</td>
                    <td>At runtime only</td>
                    <td>At compile time + runtime</td>
                  </tr>
                  <tr>
                    <td>Editor Support</td>
                    <td>Basic autocomplete</td>
                    <td>Rich autocomplete, refactoring, hover info</td>
                  </tr>
                  <tr>
                    <td>Learning Curve</td>
                    <td>Lower</td>
                    <td>Slightly higher (worth it)</td>
                  </tr>
                  <tr>
                    <td>Community Adoption</td>
                    <td>Universal</td>
                    <td>Rapidly growing, standard in large projects</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="info-box">
              <strong>Key Takeaway</strong>
              TypeScript does not run in the browser or Node.js directly. It is compiled
              (transpiled) to JavaScript first. This means there is zero runtime overhead
              &mdash; types exist only during development and compilation.
            </div>
          </section>

          {/* ────── 2. Installation & Setup ────── */}
          <section id="installation">
            <h2>Installation &amp; Setup</h2>

            <h3>Installing TypeScript and Playwright</h3>
            <p>
              Getting started is straightforward. You need Node.js installed on your
              machine (version 16 or higher is recommended). Then run the following
              commands in your terminal:
            </p>
            <CodeBlock code={installCode} language="bash" fileName="terminal" />

            <div className="tip-box">
              <strong>Tip</strong>
              If you are starting a brand-new Playwright project, you can use{' '}
              <code>npm init playwright@latest</code> which scaffolds a complete project
              with TypeScript configured automatically.
            </div>

            <h3>Understanding tsconfig.json</h3>
            <p>
              The <code>tsconfig.json</code> file is the TypeScript configuration for your
              project. It tells the TypeScript compiler how to process your files. Here is
              a well-commented configuration suitable for a Playwright project:
            </p>
            <CodeBlock code={tsconfigCode} language="json" fileName="tsconfig.json" />

            <p>Key settings explained:</p>
            <ul>
              <li>
                <strong>target</strong> &mdash; which version of JavaScript to output. ES2020 is
                safe for modern Node.js and supports optional chaining, nullish coalescing, etc.
              </li>
              <li>
                <strong>strict</strong> &mdash; enables all strict type-checking options. This is
                the single most important setting. Always keep it <code>true</code>.
              </li>
              <li>
                <strong>moduleResolution</strong> &mdash; set to <code>"node"</code> so TypeScript
                resolves imports the same way Node.js does.
              </li>
              <li>
                <strong>outDir / rootDir</strong> &mdash; keep compiled output separate from your
                source files. Playwright usually runs TypeScript directly via its own loader, but
                these are useful for non-test code.
              </li>
              <li>
                <strong>sourceMap</strong> &mdash; generates <code>.map</code> files that map
                compiled JavaScript back to your TypeScript, making debugging much easier.
              </li>
            </ul>

            <div className="warning-box">
              <strong>Important</strong>
              Playwright's test runner has its own TypeScript loader built in, so you do
              not need to manually compile <code>.ts</code> test files. However, you still
              need a <code>tsconfig.json</code> for your editor to provide proper
              IntelliSense and type checking.
            </div>
          </section>

          {/* ────── 3. Basic Types ────── */}
          <section id="basic-types">
            <h2>Basic Types</h2>

            <p>
              TypeScript provides a rich set of built-in types. Understanding these is the
              foundation for everything else. Let us walk through each one:
            </p>

            <CodeBlock code={basicTypesCode} language="typescript" fileName="basic-types.ts" />

            <h3>Type Reference Table</h3>
            <div className="type-table-wrapper">
              <table className="type-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>string</code></td>
                    <td>Text values</td>
                    <td><code>let name: string = 'Alice'</code></td>
                  </tr>
                  <tr>
                    <td><code>number</code></td>
                    <td>All numbers (integer and float)</td>
                    <td><code>let age: number = 30</code></td>
                  </tr>
                  <tr>
                    <td><code>boolean</code></td>
                    <td>True or false</td>
                    <td><code>let active: boolean = true</code></td>
                  </tr>
                  <tr>
                    <td><code>string[]</code></td>
                    <td>Array of strings</td>
                    <td><code>let tags: string[] = ['a', 'b']</code></td>
                  </tr>
                  <tr>
                    <td><code>[string, number]</code></td>
                    <td>Tuple (fixed-length typed array)</td>
                    <td><code>let pair: [string, number] = ['age', 30]</code></td>
                  </tr>
                  <tr>
                    <td><code>any</code></td>
                    <td>Disables type checking (avoid)</td>
                    <td><code>let x: any = 'anything'</code></td>
                  </tr>
                  <tr>
                    <td><code>unknown</code></td>
                    <td>Type-safe alternative to any</td>
                    <td><code>let x: unknown = getData()</code></td>
                  </tr>
                  <tr>
                    <td><code>void</code></td>
                    <td>Function returns nothing</td>
                    <td><code>function log(): void {'{ }'}</code></td>
                  </tr>
                  <tr>
                    <td><code>never</code></td>
                    <td>Function never returns (throws)</td>
                    <td><code>function fail(): never {'{ }'}</code></td>
                  </tr>
                  <tr>
                    <td><code>null / undefined</code></td>
                    <td>Absence of value</td>
                    <td><code>let x: string | null = null</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Type Inference</h3>
            <p>
              One of TypeScript's best features is <strong>type inference</strong>. You do
              not need to annotate every single variable. When TypeScript can determine the
              type from context, it does so automatically:
            </p>
            <CodeBlock code={typeInferenceCode} language="typescript" fileName="inference.ts" />

            <div className="tip-box">
              <strong>Tip</strong>
              Hover over any variable in VS Code to see what type TypeScript has inferred.
              This is a great way to learn how inference works. If the inferred type looks
              correct, you can safely omit the explicit annotation.
            </div>
          </section>

          {/* ────── 4. Interfaces & Types ────── */}
          <section id="interfaces">
            <h2>Interfaces &amp; Types</h2>

            <p>
              Interfaces and type aliases are the two main ways to describe the shape of
              objects in TypeScript. They are essential for test automation because you
              constantly work with structured data: page configurations, test credentials,
              API responses, and more.
            </p>

            <h3>Interfaces</h3>
            <p>
              An interface defines a contract for the structure of an object. It specifies
              what properties an object must have and what types those properties must be:
            </p>
            <CodeBlock code={interfaceCode} language="typescript" fileName="interfaces.ts" />

            <h3>Type Aliases</h3>
            <p>
              Type aliases give a name to any type, not just objects. They are especially
              useful for union types, literal types, and utility types:
            </p>
            <CodeBlock code={typeAliasCode} language="typescript" fileName="type-aliases.ts" />

            <div className="info-box">
              <strong>Interface vs Type &mdash; When to Use Which?</strong>
              Use <code>interface</code> when defining the shape of objects, especially
              those that may be extended or implemented by classes. Use <code>type</code>{' '}
              when you need union types, intersection types, mapped types, or when naming
              primitive type combinations. In practice, both work for object shapes, so
              pick one convention and stay consistent within your project.
            </div>
          </section>

          {/* ────── 5. Functions ────── */}
          <section id="functions">
            <h2>Functions</h2>

            <p>
              Functions are the building blocks of any test automation project. TypeScript
              allows you to type function parameters, return values, and even the function
              itself as a type. This means the compiler can verify that every function is
              called correctly and returns the expected data.
            </p>

            <CodeBlock code={functionsCode} language="typescript" fileName="functions.ts" />

            <div className="tip-box">
              <strong>Tip</strong>
              In Playwright tests, almost every interaction with the page is asynchronous.
              Always use <code>async/await</code> and type your return values
              as <code>Promise&lt;T&gt;</code>. This makes it clear to both TypeScript and
              other developers that the function is asynchronous.
            </div>

            <div className="warning-box">
              <strong>Common Mistake</strong>
              Forgetting to <code>await</code> an asynchronous function is one of the most
              common bugs in Playwright tests. TypeScript helps here: if you accidentally
              assign a <code>Promise&lt;string&gt;</code> to a <code>string</code> variable,
              the compiler will flag the type mismatch.
            </div>
          </section>

          {/* ────── 6. Classes ────── */}
          <section id="classes">
            <h2>Classes</h2>

            <p>
              Classes are fundamental to the Page Object Model pattern, which is the
              standard approach for organizing Playwright test code. TypeScript enhances
              JavaScript classes with access modifiers, abstract classes, and richer type
              checking.
            </p>

            <h3>Class Definition and Access Modifiers</h3>
            <p>
              TypeScript provides three access modifiers that control where a property or
              method can be used:
            </p>
            <ul>
              <li><strong>public</strong> &mdash; accessible from anywhere (default if omitted)</li>
              <li><strong>private</strong> &mdash; accessible only inside the class itself</li>
              <li><strong>protected</strong> &mdash; accessible inside the class and its subclasses</li>
            </ul>
            <CodeBlock code={classesCode} language="typescript" fileName="classes.ts" />

            <h3>Constructor Shorthand</h3>
            <p>
              TypeScript has a convenient shorthand for declaring and initializing class
              properties directly in the constructor parameters. This is widely used in
              Playwright Page Object classes:
            </p>
            <CodeBlock code={classShorthandCode} language="typescript" fileName="constructor-shorthand.ts" />

            <h3>Inheritance and Abstract Classes</h3>
            <p>
              Inheritance lets you create a base class with shared functionality, then
              extend it for specific pages or components. Abstract classes go one step
              further by defining a contract that all subclasses must follow:
            </p>
            <CodeBlock code={inheritanceCode} language="typescript" fileName="inheritance.ts" />

            <div className="info-box">
              <strong>Why This Matters for Playwright</strong>
              In the Page Object Model pattern, you typically create a{' '}
              <code>BasePage</code> class with common methods like <code>navigate()</code>,{' '}
              <code>waitForPageLoad()</code>, and <code>getTitle()</code>. Then each
              specific page (LoginPage, DashboardPage, etc.) extends BasePage and adds its
              own locators and methods. This is inheritance in action.
            </div>
          </section>

          {/* ────── 7. Generics ────── */}
          <section id="generics">
            <h2>Generics</h2>

            <p>
              Generics allow you to write flexible, reusable code that works with multiple
              types while still maintaining type safety. Think of a generic as a
              "type variable" &mdash; a placeholder for a type that is filled in when the
              function or class is used.
            </p>

            <CodeBlock code={genericsCode} language="typescript" fileName="generics.ts" />

            <h3>Real-World Example: Test Data Factory</h3>
            <p>
              Generics are especially useful in test automation for creating reusable
              patterns like data factories, API clients, and response wrappers:
            </p>
            <CodeBlock code={genericsRealWorldCode} language="typescript" fileName="test-data-factory.ts" />

            <div className="tip-box">
              <strong>Tip</strong>
              You do not need to master generics before starting with Playwright. Many
              Playwright APIs use generics internally (like{' '}
              <code>page.evaluate&lt;T&gt;()</code>), and TypeScript often infers the
              generic type automatically. Start by understanding the basics, and you will
              naturally encounter more advanced patterns as your projects grow.
            </div>
          </section>

          {/* ────── 8. TypeScript for Playwright ────── */}
          <section id="ts-playwright">
            <h2>TypeScript for Playwright</h2>

            <p>
              Playwright was built with first-class TypeScript support. Every API in
              Playwright ships with complete type definitions, so you get autocomplete,
              error checking, and documentation right in your editor. Let us look at how
              TypeScript and Playwright work together in practice.
            </p>

            <h3>Built-in Types: Page, Locator, Browser</h3>
            <p>
              Playwright exports TypeScript types for all its core objects. The three you
              will use most often are:
            </p>
            <ul>
              <li>
                <strong>Page</strong> &mdash; represents a single browser tab. Has methods like{' '}
                <code>goto()</code>, <code>fill()</code>, <code>click()</code>,{' '}
                <code>locator()</code>, and many more.
              </li>
              <li>
                <strong>Locator</strong> &mdash; represents a way to find elements on the page.
                Locators are lazy (they do not search until you perform an action) and auto-retry.
              </li>
              <li>
                <strong>Browser</strong> &mdash; represents a browser instance (Chromium, Firefox,
                or WebKit). You rarely interact with it directly in tests.
              </li>
            </ul>
            <CodeBlock code={playwrightTypesCode} language="typescript" fileName="playwright-types.ts" />

            <h3>Custom Types and Typed Fixtures</h3>
            <p>
              Beyond Playwright's built-in types, you should define your own types for test
              data, configurations, and fixtures. This ensures consistency across your
              entire test suite:
            </p>
            <CodeBlock code={playwrightCustomTypesCode} language="typescript" fileName="custom-types.ts" />

            <div className="info-box">
              <strong>Why Typed Fixtures Matter</strong>
              Playwright fixtures are a powerful dependency injection system. By adding
              TypeScript types to your custom fixtures, every test that uses them gets full
              autocomplete and type checking. If you change the shape of a fixture, the
              compiler tells you exactly which tests need updating.
            </div>
          </section>

          {/* ────── 9. Best Practices ────── */}
          <section id="best-practices">
            <h2>Best Practices</h2>

            <h3>1. Always Enable Strict Mode</h3>
            <p>
              The single most impactful thing you can do is set <code>"strict": true</code>{' '}
              in your <code>tsconfig.json</code>. This enables all strict type-checking
              options, catching entire categories of bugs:
            </p>
            <CodeBlock code={bestPracticesStrictCode} language="json" fileName="tsconfig.json" />

            <h3>2. Avoid <code>any</code> at All Costs</h3>
            <p>
              Using <code>any</code> tells TypeScript to stop checking a value entirely. It
              defeats the purpose of using TypeScript in the first place. If you do not
              know the type, use <code>unknown</code> and narrow it:
            </p>
            <CodeBlock code={bestPracticesAvoidAnyCode} language="typescript" fileName="avoid-any.ts" />

            <h3>3. Let TypeScript Infer When Possible</h3>
            <p>
              You do not need to annotate every variable. TypeScript's type inference is
              powerful and correct in most cases. Explicit annotations are most valuable
              on:
            </p>
            <ul>
              <li>Function parameters (TypeScript cannot infer these from usage)</li>
              <li>Function return types on public APIs (for documentation and safety)</li>
              <li>Complex object literals where the shape is not obvious</li>
              <li>Variables initialized to <code>null</code> or <code>undefined</code></li>
            </ul>

            <h3>4. Document Complex Types</h3>
            <p>
              For interfaces and types that represent complex domain concepts, add JSDoc
              comments. These appear in editor tooltips and make your codebase easier to
              navigate:
            </p>

            <h3>5. Use Readonly Where Appropriate</h3>
            <p>
              Mark properties as <code>readonly</code> when they should not change after
              initialization. This is especially useful for Page Object locators, which are
              typically set once in the constructor and never reassigned.
            </p>

            <h3>6. Prefer Specific Types Over Broad Ones</h3>
            <p>
              Instead of <code>string</code>, use literal unions like{' '}
              <code>'admin' | 'editor' | 'viewer'</code>. Instead of <code>number</code>,
              consider a branded type or enum if the value has a specific meaning. The more
              specific your types, the more bugs the compiler catches.
            </p>

            <div className="tip-box">
              <strong>Summary</strong>
              The best TypeScript code reads almost like documentation. When someone opens
              your Page Object or test file, the types tell them exactly what data flows
              in, what comes out, and what can go wrong. Invest time in good types early,
              and your test suite will be dramatically easier to maintain.
            </div>
          </section>

          {/* ────── 10. Full Example ────── */}
          <section id="full-example">
            <h2>Full Example</h2>

            <p>
              Let us put everything together in a complete, real-world example. We will
              create a typed Page Object class for a login page, a shared types file, and
              a test file that uses both. This is the pattern you will use in every
              Playwright project.
            </p>

            <h3>Page Object + Types</h3>
            <p>
              The Page Object encapsulates all locators and interactions for a single page.
              Notice how every property is typed, every method has typed parameters and
              return values, and the class uses <code>readonly</code> for locators that
              never change:
            </p>
            <CodeBlock code={fullExamplePageObjectCode} language="typescript" fileName="LoginPage.ts + test-data.ts" />

            <h3>Test File</h3>
            <p>
              The test file imports the Page Object and typed test data. Each test is
              focused, readable, and fully type-safe. If you rename a property in{' '}
              <code>LoginCredentials</code> or change a method signature on{' '}
              <code>LoginPage</code>, TypeScript will immediately highlight every test that
              needs updating:
            </p>
            <CodeBlock code={fullExampleTestCode} language="typescript" fileName="login.spec.ts" />

            <div className="tip-box">
              <strong>What You Have Learned</strong>
              This example demonstrates every TypeScript concept covered in this guide:
              interfaces for data shapes, classes with access modifiers for page objects,
              async/await for Playwright interactions, <code>readonly</code> for immutable
              locators, and type imports to share types across files. This is production-ready
              code that you can adapt directly for your own projects.
            </div>

            <div className="info-box">
              <strong>Next Steps</strong>
              Now that you understand TypeScript fundamentals, head over to the{' '}
              <strong>Playwright Essentials</strong> chapter to learn about locators,
              assertions, and test configuration. Then bring it all together in the{' '}
              <strong>Page Object Model</strong> chapter where you will build a complete
              test architecture.
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
              <button className="mark-complete-btn" onClick={() => markPageComplete('typescript')}>
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

export default TypeScriptBasics;
