const quizQuestions = [
  // Playwright questions
  {
    id: 1,
    category: 'Playwright',
    question: 'Which method is recommended for locating elements in Playwright?',
    options: [
      'document.querySelector()',
      'page.getByRole()',
      'page.findElement()',
      'page.$()'
    ],
    correct: 1,
    explanation: 'page.getByRole() is the recommended locator strategy in Playwright because it queries elements by their ARIA role, making tests more resilient and accessible.'
  },
  {
    id: 2,
    category: 'Playwright',
    question: 'What does "auto-waiting" mean in Playwright?',
    options: [
      'Tests run automatically without user input',
      'Playwright automatically waits for elements to be actionable before performing actions',
      'Tests wait for a fixed timeout before each action',
      'The browser automatically refreshes the page'
    ],
    correct: 1,
    explanation: 'Playwright automatically waits for elements to be visible, enabled, and stable before performing actions like click() or fill(). This eliminates the need for manual sleep/wait calls.'
  },
  {
    id: 3,
    category: 'Playwright',
    question: 'Which command initializes a new Playwright project?',
    options: [
      'npm install playwright',
      'npx create-playwright',
      'npm init playwright@latest',
      'npx playwright init'
    ],
    correct: 2,
    explanation: 'npm init playwright@latest is the official command to scaffold a new Playwright project with all necessary configuration files and example tests.'
  },
  {
    id: 4,
    category: 'Playwright',
    question: 'What is the default test file extension in Playwright with TypeScript?',
    options: [
      '.test.ts',
      '.spec.ts',
      '.pw.ts',
      '.e2e.ts'
    ],
    correct: 1,
    explanation: 'Playwright uses .spec.ts as the default test file extension (e.g., login.spec.ts). This follows the BDD naming convention for specification files.'
  },
  {
    id: 5,
    category: 'Playwright',
    question: 'Which assertion checks that a page has a specific URL?',
    options: [
      'expect(page.url).toBe("/dashboard")',
      'expect(page).toHaveURL("/dashboard")',
      'expect(page.location).toEqual("/dashboard")',
      'assert.url(page, "/dashboard")'
    ],
    correct: 1,
    explanation: 'expect(page).toHaveURL() is a web-first assertion that automatically waits for the URL to match, making it reliable for testing navigation.'
  },
  {
    id: 6,
    category: 'Playwright',
    question: 'What does page.waitForLoadState("domcontentloaded") wait for?',
    options: [
      'All images and stylesheets to load',
      'The HTML document to be fully parsed',
      'All network requests to complete',
      'JavaScript execution to finish'
    ],
    correct: 1,
    explanation: 'domcontentloaded fires when the HTML document has been fully parsed. It does not wait for stylesheets, images, or subframes to finish loading.'
  },
  {
    id: 7,
    category: 'Playwright',
    question: 'How do you run Playwright tests in headed mode (visible browser)?',
    options: [
      'npx playwright test --visible',
      'npx playwright test --headed',
      'npx playwright test --show-browser',
      'npx playwright test --gui'
    ],
    correct: 1,
    explanation: 'The --headed flag runs tests with a visible browser window, useful for debugging. By default, Playwright runs in headless mode.'
  },
  {
    id: 8,
    category: 'Playwright',
    question: 'Which Playwright tool lets you visually debug test execution step by step?',
    options: [
      'Playwright Inspector',
      'Playwright Debugger',
      'Playwright DevTools',
      'Playwright Trace Viewer'
    ],
    correct: 3,
    explanation: 'The Trace Viewer allows you to step through test execution, view DOM snapshots, network requests, and console logs for each action. Use --trace on flag to capture traces.'
  },
  {
    id: 9,
    category: 'Playwright',
    question: 'What is the purpose of page.evaluate() in Playwright?',
    options: [
      'To evaluate test results',
      'To execute JavaScript code directly in the browser context',
      'To validate page performance',
      'To check element accessibility'
    ],
    correct: 1,
    explanation: 'page.evaluate() executes JavaScript in the browser context. It is useful for extracting data from the DOM or running scripts that interact with the page directly.'
  },
  {
    id: 10,
    category: 'Playwright',
    question: 'Which browser engines does Playwright support?',
    options: [
      'Only Chromium',
      'Chromium and Firefox',
      'Chromium, Firefox, and WebKit',
      'Chrome, Edge, and Safari'
    ],
    correct: 2,
    explanation: 'Playwright supports three browser engines: Chromium (Chrome, Edge), Firefox, and WebKit (Safari). This allows cross-browser testing with a single API.'
  },

  // TypeScript questions
  {
    id: 11,
    category: 'TypeScript',
    question: 'What is the main benefit of TypeScript over JavaScript?',
    options: [
      'Faster execution speed',
      'Static type checking at compile time',
      'Smaller bundle size',
      'Built-in testing framework'
    ],
    correct: 1,
    explanation: 'TypeScript adds static type checking, which catches type errors during development (compile time) rather than at runtime, leading to fewer bugs and better IDE support.'
  },
  {
    id: 12,
    category: 'TypeScript',
    question: 'What does the "?" symbol mean after a property name in an interface?',
    options: [
      'The property is nullable',
      'The property is optional',
      'The property is readonly',
      'The property is deprecated'
    ],
    correct: 1,
    explanation: 'The ? after a property name marks it as optional. For example: { name: string; age?: number } means age can be omitted when creating the object.'
  },
  {
    id: 13,
    category: 'TypeScript',
    question: 'Which TypeScript type should you avoid using in production code?',
    options: [
      'unknown',
      'never',
      'any',
      'void'
    ],
    correct: 2,
    explanation: 'The "any" type disables type checking entirely, defeating the purpose of TypeScript. Use "unknown" instead when you need to accept any value — it forces you to check the type before using it.'
  },
  {
    id: 14,
    category: 'TypeScript',
    question: 'What is the return type of an async function?',
    options: [
      'async<T>',
      'Awaitable<T>',
      'Promise<T>',
      'Future<T>'
    ],
    correct: 2,
    explanation: 'Async functions always return a Promise. In TypeScript, you annotate this as Promise<T>, where T is the resolved value type. For example: async function getData(): Promise<string[]>'
  },
  {
    id: 15,
    category: 'TypeScript',
    question: 'What does "readonly" do in TypeScript?',
    options: [
      'Makes a variable private',
      'Prevents a property from being reassigned after initialization',
      'Makes a function pure',
      'Prevents a class from being extended'
    ],
    correct: 1,
    explanation: 'The readonly modifier prevents a property from being changed after it is first assigned. It is similar to const but works for class properties and interface members.'
  },
  {
    id: 16,
    category: 'TypeScript',
    question: 'What is a generic type in TypeScript?',
    options: [
      'A type that works only with strings',
      'A type that is automatically inferred',
      'A reusable type that works with multiple types via a type parameter',
      'A type imported from another module'
    ],
    correct: 2,
    explanation: 'Generics let you create reusable components that work with various types. Example: function identity<T>(arg: T): T — the T is a type parameter that gets replaced with the actual type when used.'
  },
  {
    id: 17,
    category: 'TypeScript',
    question: 'What is the difference between "interface" and "type" in TypeScript?',
    options: [
      'They are exactly the same',
      'Interfaces can be extended and merged; types are more flexible with unions and intersections',
      'Types are faster than interfaces',
      'Interfaces only work with classes'
    ],
    correct: 1,
    explanation: 'Both can describe object shapes, but interfaces support declaration merging and extension with extends. Types are more flexible — they can represent unions, intersections, and primitive types.'
  },
  {
    id: 18,
    category: 'TypeScript',
    question: 'What does "strict: true" enable in tsconfig.json?',
    options: [
      'Strict linting rules',
      'All strict type-checking options (noImplicitAny, strictNullChecks, etc.)',
      'Strict module resolution',
      'Strict import ordering'
    ],
    correct: 1,
    explanation: 'strict: true is a shorthand that enables all strict type-checking flags: noImplicitAny, strictNullChecks, strictFunctionTypes, strictBindCallApply, and more.'
  },
  {
    id: 19,
    category: 'TypeScript',
    question: 'What is an enum in TypeScript?',
    options: [
      'A function type',
      'A set of named constants',
      'A loop construct',
      'An error handling mechanism'
    ],
    correct: 1,
    explanation: 'Enums define a set of named constants, making code more readable. Example: enum Direction { Up, Down, Left, Right }. They can be numeric or string-based.'
  },
  {
    id: 20,
    category: 'TypeScript',
    question: 'What access modifier makes a class member accessible only within the class?',
    options: [
      'public',
      'protected',
      'private',
      'internal'
    ],
    correct: 2,
    explanation: 'private members can only be accessed from within the class itself. protected allows access from the class and its subclasses. public (default) allows access from anywhere.'
  },

  // POM questions
  {
    id: 21,
    category: 'Page Object Model',
    question: 'What is the main purpose of the Page Object Model?',
    options: [
      'To make tests run faster',
      'To separate test logic from page interaction logic',
      'To generate test reports',
      'To manage test data'
    ],
    correct: 1,
    explanation: 'POM separates the "what to test" (test files) from the "how to interact" (page objects). This separation makes tests easier to maintain — when UI changes, you only update the page object.'
  },
  {
    id: 22,
    category: 'Page Object Model',
    question: 'Where should assertions (expect statements) be placed in POM?',
    options: [
      'Inside the Page Object class',
      'In the test file, not in the Page Object',
      'In a separate assertions file',
      'In the base page class'
    ],
    correct: 1,
    explanation: 'Assertions belong in test files, not in Page Objects. Page Objects should only contain locators and interaction methods. This keeps them reusable across different test scenarios.'
  },
  {
    id: 23,
    category: 'Page Object Model',
    question: 'What is a Base Page in POM?',
    options: [
      'The first page of the application',
      'An abstract parent class with shared methods for all page objects',
      'A page with no interactions',
      'The login page'
    ],
    correct: 1,
    explanation: 'A Base Page is an abstract class that contains common functionality (navigation, waiting, screenshots) shared across all page objects. Other pages extend it using "extends BasePage".'
  },
  {
    id: 24,
    category: 'Page Object Model',
    question: 'What is a Component Object?',
    options: [
      'A React component',
      'A reusable POM class representing a UI component that appears on multiple pages',
      'A testing framework plugin',
      'A configuration object'
    ],
    correct: 1,
    explanation: 'Component Objects represent reusable UI elements (header, navigation, modal) that appear across multiple pages. Instead of duplicating code, you compose Component Objects into Page Objects.'
  },
  {
    id: 25,
    category: 'Page Object Model',
    question: 'In Playwright, what is the recommended way to inject Page Objects into tests?',
    options: [
      'Global variables',
      'Import and instantiate manually',
      'Playwright Fixtures',
      'Dependency injection framework'
    ],
    correct: 2,
    explanation: 'Playwright Fixtures let you extend the test function with custom Page Objects that are automatically created and injected into your tests. This is the cleanest, most maintainable approach.'
  },
  {
    id: 26,
    category: 'Page Object Model',
    question: 'How should locators be defined in a Page Object?',
    options: [
      'As hardcoded strings in each method',
      'As class properties or getters initialized in the constructor',
      'In a separate JSON file',
      'As global constants'
    ],
    correct: 1,
    explanation: 'Locators should be defined as class properties (or getters) in the constructor. This centralizes all selectors in one place and makes them easy to update when the UI changes.'
  },
  {
    id: 27,
    category: 'Page Object Model',
    question: 'What does the constructor(private page: Page) shorthand do in TypeScript?',
    options: [
      'Makes the page variable global',
      'Creates a private property "page" and assigns the constructor parameter to it',
      'Creates a public page getter',
      'Imports the Page type'
    ],
    correct: 1,
    explanation: 'TypeScript parameter properties (private page: Page) is shorthand for declaring a private property and assigning the constructor argument to it in a single line.'
  },
  {
    id: 28,
    category: 'Page Object Model',
    question: 'What should a Page Object method name describe?',
    options: [
      'The HTML element being clicked (e.g., clickButton)',
      'The business action being performed (e.g., addToCart)',
      'The CSS selector used (e.g., clickBtnSubmit)',
      'The test case name (e.g., testLogin)'
    ],
    correct: 1,
    explanation: 'Method names should describe business actions (login, searchProduct, addToCart), not technical implementation details. This makes tests read like user stories.'
  },
  {
    id: 29,
    category: 'Page Object Model',
    question: 'What principle does POM help enforce?',
    options: [
      'SOLID principles',
      'DRY (Don\'t Repeat Yourself)',
      'YAGNI (You Aren\'t Gonna Need It)',
      'KISS (Keep It Simple, Stupid)'
    ],
    correct: 1,
    explanation: 'POM strongly enforces DRY — by centralizing page interactions, you write each selector and action once, then reuse them across all tests that need them.'
  },
  {
    id: 30,
    category: 'Page Object Model',
    question: 'What is the "fluent interface" pattern in POM?',
    options: [
      'Using CSS fluid layouts',
      'Methods return "this" to enable method chaining',
      'Using streaming data in tests',
      'Dynamic page loading'
    ],
    correct: 1,
    explanation: 'The fluent interface pattern has methods return "this" (or another page object), enabling chaining: await page.fillName("John").fillEmail("john@test.com").submit()'
  },

  // NEW QUESTIONS (31-100)

  // Playwright questions (31-40)
  {
    id: 31,
    category: 'Playwright',
    question: 'What is a BrowserContext in Playwright?',
    options: [
      'The browser window title',
      'An isolated browser session similar to an incognito profile',
      'The browser\'s developer console',
      'A reference to the browser executable path'
    ],
    correct: 1,
    explanation: 'A BrowserContext is an isolated browser session equivalent to an incognito profile. Each context has its own cookies, local storage, and cache, making it ideal for testing multi-user scenarios.'
  },
  {
    id: 32,
    category: 'Playwright',
    question: 'How do you capture a screenshot of a specific element in Playwright?',
    options: [
      'page.screenshot({ element: locator })',
      'locator.screenshot()',
      'page.captureElement(locator)',
      'element.takeScreenshot()'
    ],
    correct: 1,
    explanation: 'You can call .screenshot() directly on a locator to capture just that element. For example: await page.getByRole("button").screenshot({ path: "button.png" }).'
  },
  {
    id: 33,
    category: 'Playwright',
    question: 'Which configuration option enables video recording of test runs?',
    options: [
      'video: "on"',
      'record: true',
      'captureVideo: true',
      'enableRecording: "always"'
    ],
    correct: 0,
    explanation: 'Setting video: "on" in the Playwright config (or per-project use options) records a video for every test. Other options include "off", "on-first-retry", and "retain-on-failure".'
  },
  {
    id: 34,
    category: 'Playwright',
    question: 'How do you test an API endpoint directly in Playwright without a browser?',
    options: [
      'Use page.fetch()',
      'Use request.newContext() or the built-in APIRequestContext',
      'Use the axios library inside Playwright',
      'API testing is not supported in Playwright'
    ],
    correct: 1,
    explanation: 'Playwright has a built-in API testing feature using APIRequestContext (via playwright.request.newContext() or the request fixture). This lets you make HTTP requests and assert on responses without a browser.'
  },
  {
    id: 35,
    category: 'Playwright',
    question: 'What does the locator.filter() method do?',
    options: [
      'Applies CSS filters to the element',
      'Narrows down a locator by additional criteria like text or child locators',
      'Removes elements from the DOM',
      'Filters network requests on the page'
    ],
    correct: 1,
    explanation: 'locator.filter() narrows down a locator by additional conditions such as { hasText: "Submit" } or { has: childLocator }. This is useful for selecting a specific item from a list of similar elements.'
  },
  {
    id: 36,
    category: 'Playwright',
    question: 'What is the purpose of test.describe() in Playwright?',
    options: [
      'To describe the application under test',
      'To group related tests into a logical block',
      'To write documentation for tests',
      'To describe expected test outcomes'
    ],
    correct: 1,
    explanation: 'test.describe() groups related tests together, similar to describe() in Jest or Mocha. This helps organize tests and allows shared beforeEach/afterEach hooks within the group.'
  },
  {
    id: 37,
    category: 'Playwright',
    question: 'How can you open multiple pages (tabs) in a single test?',
    options: [
      'Call page.newTab()',
      'Create a new page from the same browser context with context.newPage()',
      'Use page.switchTo()',
      'Multiple pages per test are not supported'
    ],
    correct: 1,
    explanation: 'You can call context.newPage() to open additional pages within the same browser context. This is useful for testing multi-tab or multi-window workflows like popup handling.'
  },
  {
    id: 38,
    category: 'Playwright',
    question: 'What does the --trace on flag do when running Playwright tests?',
    options: [
      'Enables verbose logging to the console',
      'Records a trace file with DOM snapshots, network logs, and action details for each test',
      'Traces memory usage during tests',
      'Enables stack trace output for failed assertions'
    ],
    correct: 1,
    explanation: 'The --trace on flag captures a trace zip file for each test containing DOM snapshots, network requests, console logs, and action timing. These traces can be viewed in the Trace Viewer.'
  },
  {
    id: 39,
    category: 'Playwright',
    question: 'What is the purpose of Playwright fixtures?',
    options: [
      'To fix broken tests automatically',
      'To provide reusable setup and teardown logic that is injected into tests',
      'To create fixed test data in the database',
      'To set fixed viewport sizes for tests'
    ],
    correct: 1,
    explanation: 'Fixtures in Playwright provide isolated, reusable setup/teardown logic. Built-in fixtures include page, context, and browser. You can define custom fixtures for things like page objects, authenticated sessions, or test data.'
  },
  {
    id: 40,
    category: 'Playwright',
    question: 'Which Playwright config option specifies the maximum time a test can run before timing out?',
    options: [
      'maxTimeout',
      'testTimeout',
      'timeout',
      'maxRunTime'
    ],
    correct: 2,
    explanation: 'The timeout option in playwright.config.ts sets the maximum time (in milliseconds) a single test can run. The default is 30 seconds. You can also set per-test timeouts using test.setTimeout().'
  },

  // TypeScript questions (41-50)
  {
    id: 41,
    category: 'TypeScript',
    question: 'What is the purpose of the Partial<T> utility type?',
    options: [
      'Makes all properties of T required',
      'Makes all properties of T optional',
      'Removes all methods from T',
      'Selects only primitive properties from T'
    ],
    correct: 1,
    explanation: 'Partial<T> constructs a type with all properties of T set to optional. This is useful for update functions where you only want to pass the fields that changed.'
  },
  {
    id: 42,
    category: 'TypeScript',
    question: 'What is a type guard in TypeScript?',
    options: [
      'A security feature that prevents unauthorized type access',
      'A runtime check that narrows a type within a conditional block',
      'A compile-time annotation that locks a type',
      'A decorator that validates input types'
    ],
    correct: 1,
    explanation: 'A type guard is a runtime expression (like typeof, instanceof, or a custom function returning "value is Type") that narrows the type of a variable within a conditional block, giving you type safety.'
  },
  {
    id: 43,
    category: 'TypeScript',
    question: 'What does the Record<K, V> utility type create?',
    options: [
      'An array of key-value pairs',
      'An object type with keys of type K and values of type V',
      'A database record type',
      'A read-only tuple of K and V'
    ],
    correct: 1,
    explanation: 'Record<K, V> creates an object type whose keys are of type K and values are of type V. For example, Record<string, number> represents an object like { apples: 5, oranges: 3 }.'
  },
  {
    id: 44,
    category: 'TypeScript',
    question: 'What is a mapped type in TypeScript?',
    options: [
      'A type that maps to a database table',
      'A type created by iterating over the keys of another type and transforming them',
      'A type that represents a Map data structure',
      'A type alias for Array.map() return values'
    ],
    correct: 1,
    explanation: 'Mapped types iterate over keys of an existing type to create a new type. For example: type Readonly<T> = { readonly [P in keyof T]: T[P] } transforms each property to be readonly.'
  },
  {
    id: 45,
    category: 'TypeScript',
    question: 'What is a conditional type in TypeScript?',
    options: [
      'A type that only exists in if-else blocks',
      'A type that selects one of two types based on a condition using the extends keyword',
      'A type that changes at runtime based on user input',
      'A type that requires a boolean property'
    ],
    correct: 1,
    explanation: 'Conditional types use the syntax T extends U ? X : Y to choose between types based on a condition. For example: type IsString<T> = T extends string ? "yes" : "no".'
  },
  {
    id: 46,
    category: 'TypeScript',
    question: 'What is the difference between "unknown" and "any" in TypeScript?',
    options: [
      'They are identical in behavior',
      'unknown requires type checking before use; any bypasses all type checking',
      'any is for objects; unknown is for primitives',
      'unknown only works with functions; any works with everything'
    ],
    correct: 1,
    explanation: 'Both accept any value, but unknown is type-safe: you must narrow the type (e.g., with typeof or instanceof) before using the value. any completely disables type checking.'
  },
  {
    id: 47,
    category: 'TypeScript',
    question: 'How do you import and export modules in TypeScript using ES module syntax?',
    options: [
      'require() and module.exports',
      'import/export statements',
      'include() and provide()',
      'load() and expose()'
    ],
    correct: 1,
    explanation: 'TypeScript uses ES module syntax: export function foo() {} or export default class, and import { foo } from "./module" or import MyClass from "./module".'
  },
  {
    id: 48,
    category: 'TypeScript',
    question: 'What does the Omit<T, K> utility type do?',
    options: [
      'Picks only the specified keys from T',
      'Creates a type with all properties of T except those in K',
      'Makes the specified keys optional',
      'Removes null and undefined from T'
    ],
    correct: 1,
    explanation: 'Omit<T, K> creates a new type by removing the keys specified in K from type T. For example, Omit<User, "password"> creates a type with all User properties except password.'
  },
  {
    id: 49,
    category: 'TypeScript',
    question: 'What are decorators in TypeScript?',
    options: [
      'CSS styling utilities for TypeScript components',
      'Special declarations that attach metadata or modify classes, methods, and properties',
      'Functions that format console output',
      'Type aliases for complex objects'
    ],
    correct: 1,
    explanation: 'Decorators are special functions prefixed with @ that can modify or annotate classes, methods, properties, and parameters. They are commonly used in frameworks like Angular and NestJS.'
  },
  {
    id: 50,
    category: 'TypeScript',
    question: 'What does the "never" type represent in TypeScript?',
    options: [
      'A value that is always null',
      'A value that is always undefined',
      'A type for values that never occur (e.g., a function that always throws)',
      'A deprecated type that should never be used'
    ],
    correct: 2,
    explanation: 'The never type represents values that never occur. It is the return type of functions that always throw errors or have infinite loops. It is also used in exhaustive type checks.'
  },

  // Page Object Model questions (51-55)
  {
    id: 51,
    category: 'Page Object Model',
    question: 'What is data-driven testing in the context of POM?',
    options: [
      'Testing database-driven applications',
      'Running the same test logic with different sets of input data',
      'Using data attributes for locators',
      'Storing test results in a data warehouse'
    ],
    correct: 1,
    explanation: 'Data-driven testing runs the same test logic with different input data sets (e.g., from CSV, JSON, or arrays). Page Object methods accept parameters, making them reusable across data variations.'
  },
  {
    id: 52,
    category: 'Page Object Model',
    question: 'When should you create a new Page Object class?',
    options: [
      'For every single HTML page in the application',
      'When a page or distinct section of the UI has its own set of interactions and locators',
      'Only for the login page',
      'Only when the page has more than 10 elements'
    ],
    correct: 1,
    explanation: 'Create a new Page Object when a page or distinct UI section has its own set of locators and user interactions. Not every URL needs its own class, but each logical section of functionality should.'
  },
  {
    id: 53,
    category: 'Page Object Model',
    question: 'How should page navigation be handled in Page Object methods?',
    options: [
      'Always use hardcoded full URLs',
      'Use relative URLs and have a goto() or navigate() method that builds on a base URL',
      'Let the test file handle all navigation directly',
      'Use browser bookmarks'
    ],
    correct: 1,
    explanation: 'Page Objects should provide a navigate() or goto() method that uses relative paths built on a configurable base URL. This makes tests portable across environments (dev, staging, production).'
  },
  {
    id: 54,
    category: 'Page Object Model',
    question: 'What is the recommended way to wait for page transitions in POM methods?',
    options: [
      'Use fixed sleep/delay calls',
      'Use await page.waitForURL() or await page.waitForLoadState() inside the POM method',
      'Do not wait at all; let tests handle it',
      'Use setTimeout() in the Page Object'
    ],
    correct: 1,
    explanation: 'POM methods that trigger navigation should await the transition using waitForURL() or waitForLoadState(). This encapsulates the wait logic and prevents flaky tests.'
  },
  {
    id: 55,
    category: 'Page Object Model',
    question: 'What is the Single Responsibility Principle as applied to Page Objects?',
    options: [
      'Each Page Object should handle only one test case',
      'Each Page Object should represent one page or component and only expose interactions for that scope',
      'Each Page Object should have exactly one method',
      'Each test file should use only one Page Object'
    ],
    correct: 1,
    explanation: 'Following SRP, each Page Object should represent a single page or component, encapsulating only the locators and methods relevant to that scope. This keeps classes focused and maintainable.'
  },

  // K6 Performance Testing questions (56-70)
  {
    id: 56,
    category: 'K6',
    question: 'What is a virtual user (VU) in K6?',
    options: [
      'A fake user account in the database',
      'A simulated concurrent user that executes the test script in a loop',
      'A bot that creates test data',
      'An AI-powered test generator'
    ],
    correct: 1,
    explanation: 'A virtual user (VU) in K6 is a simulated user running your test script concurrently. Each VU executes the default function in a loop for the duration of the test, simulating real user load.'
  },
  {
    id: 57,
    category: 'K6',
    question: 'What is the purpose of the "options" export in a K6 script?',
    options: [
      'To define command-line arguments',
      'To configure test parameters like VUs, duration, thresholds, and scenarios',
      'To set environment variables',
      'To specify the output format for results'
    ],
    correct: 1,
    explanation: 'The options export in K6 defines test configuration: number of VUs, test duration, ramp-up stages, thresholds, and scenarios. For example: export const options = { vus: 10, duration: "30s" }.'
  },
  {
    id: 58,
    category: 'K6',
    question: 'What is a "check" in K6?',
    options: [
      'A test assertion that halts execution on failure',
      'A boolean validation that records pass/fail rates without stopping the test',
      'A health check for the server',
      'A syntax validator for the test script'
    ],
    correct: 1,
    explanation: 'Checks in K6 are boolean validations (like checking status === 200) that record pass/fail rates. Unlike assertions, failed checks do not stop test execution — they are tracked as metrics.'
  },
  {
    id: 59,
    category: 'K6',
    question: 'What is a "threshold" in K6?',
    options: [
      'The maximum number of VUs allowed',
      'A pass/fail criteria for a metric that determines if the test succeeds or fails',
      'The minimum server response time',
      'The network bandwidth limit'
    ],
    correct: 1,
    explanation: 'Thresholds are pass/fail criteria applied to metrics. For example: http_req_duration: ["p(95)<500"] means 95% of requests must complete under 500ms, or the test is considered failed.'
  },
  {
    id: 60,
    category: 'K6',
    question: 'What is the difference between a smoke test and a load test in K6?',
    options: [
      'Smoke tests use more VUs than load tests',
      'A smoke test uses minimal load to verify basic functionality; a load test simulates expected normal traffic',
      'Smoke tests test the UI; load tests test the API',
      'There is no difference; they are the same'
    ],
    correct: 1,
    explanation: 'A smoke test uses 1-2 VUs for a short duration to verify the system works at all. A load test simulates expected concurrent users over a longer period to validate performance under normal conditions.'
  },
  {
    id: 61,
    category: 'K6',
    question: 'What is a "stress test" in K6?',
    options: [
      'Testing the application under minimal load',
      'Testing beyond normal capacity to find the system\'s breaking point',
      'Testing network stress and latency',
      'Testing developer stress levels during deployment'
    ],
    correct: 1,
    explanation: 'A stress test pushes the system beyond its normal capacity by gradually increasing VUs to find breaking points, identify bottlenecks, and observe how the system degrades under extreme load.'
  },
  {
    id: 62,
    category: 'K6',
    question: 'How do you define ramp-up stages in K6?',
    options: [
      'Using the rampUp() function',
      'Using the stages array in options with duration and target VU counts',
      'Using the --ramp-up CLI flag',
      'K6 does not support ramp-up; all VUs start at once'
    ],
    correct: 1,
    explanation: 'Ramp-up is configured using stages: [{ duration: "2m", target: 50 }, { duration: "5m", target: 50 }, { duration: "2m", target: 0 }]. Each stage defines a duration and target VU count.'
  },
  {
    id: 63,
    category: 'K6',
    question: 'What is a "spike test" in K6?',
    options: [
      'A test that runs for exactly one second',
      'A test that suddenly increases VUs to a very high number and then drops back down',
      'A test that monitors CPU spikes on the server',
      'A test that verifies spike detection in logs'
    ],
    correct: 1,
    explanation: 'A spike test simulates a sudden surge in traffic by rapidly ramping up to a very high VU count and then dropping back to normal. It tests how the system handles sudden, unexpected load spikes.'
  },
  {
    id: 64,
    category: 'K6',
    question: 'What is the purpose of a "soak test" in K6?',
    options: [
      'To test the application under water-cooled servers',
      'To run a sustained load for an extended period to detect memory leaks and long-term degradation',
      'To soak up excess server capacity',
      'To test how long the application takes to start up'
    ],
    correct: 1,
    explanation: 'A soak test (endurance test) runs the system under expected load for an extended period (hours or days) to uncover issues like memory leaks, resource exhaustion, or gradual performance degradation.'
  },
  {
    id: 65,
    category: 'K6',
    question: 'How do you make an HTTP GET request in K6?',
    options: [
      'fetch("https://api.example.com")',
      'http.get("https://api.example.com")',
      'axios.get("https://api.example.com")',
      'request.get("https://api.example.com")'
    ],
    correct: 1,
    explanation: 'K6 uses its built-in http module: import http from "k6/http"; and then http.get("url"). K6 does not support Node.js modules like fetch or axios; it has its own optimized HTTP client.'
  },
  {
    id: 66,
    category: 'K6',
    question: 'What are K6 scenarios used for?',
    options: [
      'Writing test case descriptions',
      'Defining multiple, independent workload configurations that can run in parallel',
      'Creating user stories for BDD testing',
      'Generating test reports in different formats'
    ],
    correct: 1,
    explanation: 'Scenarios in K6 allow you to define multiple, independent workload configurations within a single script. Each scenario can have its own executor, VU count, duration, and function to run.'
  },
  {
    id: 67,
    category: 'K6',
    question: 'What is a custom metric in K6?',
    options: [
      'A metric created by the server under test',
      'A user-defined metric (Counter, Gauge, Rate, or Trend) for tracking application-specific measurements',
      'A metric that only appears in custom dashboards',
      'A built-in metric with a custom name'
    ],
    correct: 1,
    explanation: 'K6 supports four custom metric types: Counter (cumulative sum), Gauge (current value), Rate (percentage of true values), and Trend (statistical distribution). These track application-specific measurements beyond built-in HTTP metrics.'
  },
  {
    id: 68,
    category: 'K6',
    question: 'What does the K6 lifecycle function setup() do?',
    options: [
      'Runs once before each VU iteration',
      'Runs once before the test starts and its return value is passed to the default function',
      'Sets up the browser for UI testing',
      'Configures the K6 CLI environment'
    ],
    correct: 1,
    explanation: 'The setup() function runs once before the test begins (not per VU). Its return value is passed as an argument to the default function and teardown(). Use it for one-time tasks like fetching auth tokens or test data.'
  },
  {
    id: 69,
    category: 'K6',
    question: 'Which K6 metric tracks the total time for an HTTP request-response cycle?',
    options: [
      'http_req_waiting',
      'http_req_duration',
      'http_req_connecting',
      'http_req_total'
    ],
    correct: 1,
    explanation: 'http_req_duration measures the total time from sending the request to receiving the full response (including TLS handshake, sending, waiting, and receiving). It is the primary metric for response time analysis.'
  },
  {
    id: 70,
    category: 'K6',
    question: 'What is the purpose of K6 "groups"?',
    options: [
      'Organizing VUs into separate pools',
      'Logically grouping related requests together for better organization in results',
      'Grouping test scripts into test suites',
      'Splitting load across multiple servers'
    ],
    correct: 1,
    explanation: 'Groups (group() function) logically organize related requests together, such as all requests for a "user login" flow. This provides better structure in test results and makes it easier to analyze specific workflows.'
  },

  // Postman questions (71-85)
  {
    id: 71,
    category: 'Postman',
    question: 'What is a Postman Collection?',
    options: [
      'A database of API endpoints',
      'A group of saved API requests organized in folders that can be shared and run together',
      'A set of environment variables',
      'A collection of test reports'
    ],
    correct: 1,
    explanation: 'A Postman Collection is an organized group of API requests saved in folders. Collections can include documentation, tests, variables, and can be shared with team members or run via Newman CLI.'
  },
  {
    id: 72,
    category: 'Postman',
    question: 'What are environment variables used for in Postman?',
    options: [
      'To style the Postman interface',
      'To store values (like URLs, tokens, IDs) that change between environments (dev, staging, prod)',
      'To set the operating system environment',
      'To configure Postman settings'
    ],
    correct: 1,
    explanation: 'Environment variables store values like base URLs, API keys, and tokens that differ between environments. Reference them with {{variable_name}} syntax. Switch environments to test against dev, staging, or production.'
  },
  {
    id: 73,
    category: 'Postman',
    question: 'What is a pre-request script in Postman?',
    options: [
      'A script that runs before the collection is created',
      'A JavaScript snippet that executes before the request is sent',
      'A request that must be sent before the main request',
      'A validation script for request parameters'
    ],
    correct: 1,
    explanation: 'Pre-request scripts are JavaScript code that runs before a request is sent. Common uses include generating timestamps, creating dynamic data, computing authentication headers, or setting variables.'
  },
  {
    id: 74,
    category: 'Postman',
    question: 'Which function is used to write test assertions in Postman?',
    options: [
      'test.assert()',
      'pm.test()',
      'postman.verify()',
      'assert.equal()'
    ],
    correct: 1,
    explanation: 'pm.test("test name", function() { ... }) is the standard way to write tests in Postman. Inside the callback, you use pm.expect() (based on Chai.js) for assertions.'
  },
  {
    id: 75,
    category: 'Postman',
    question: 'How do you verify a response status code is 200 in Postman tests?',
    options: [
      'pm.test("Status 200", () => { pm.response.to.have.status(200); })',
      'assert(response.code === 200)',
      'expect(status).toBe(200)',
      'verify.statusCode(200)'
    ],
    correct: 0,
    explanation: 'In Postman, pm.response.to.have.status(200) is a Chai-BDD style assertion that checks the response status code. You can also use pm.expect(pm.response.code).to.eql(200).'
  },
  {
    id: 76,
    category: 'Postman',
    question: 'What is Newman in the Postman ecosystem?',
    options: [
      'A Postman team collaboration feature',
      'A command-line collection runner for Postman that enables CI/CD integration',
      'A Postman UI theme',
      'A Postman API documentation generator'
    ],
    correct: 1,
    explanation: 'Newman is a CLI tool that runs Postman collections from the command line. It enables integration with CI/CD pipelines, allowing automated API testing as part of the build process.'
  },
  {
    id: 77,
    category: 'Postman',
    question: 'How do you access the JSON response body in a Postman test script?',
    options: [
      'response.body.json()',
      'pm.response.json()',
      'JSON.parse(body)',
      'postman.getResponseBody()'
    ],
    correct: 1,
    explanation: 'pm.response.json() parses the response body as JSON and returns a JavaScript object. You can then assert on specific properties: pm.expect(pm.response.json().name).to.eql("John").'
  },
  {
    id: 78,
    category: 'Postman',
    question: 'What is a Postman Monitor?',
    options: [
      'A screen recording tool for API testing',
      'A scheduled runner that executes collections at defined intervals and alerts on failures',
      'A real-time API traffic analyzer',
      'A server monitoring dashboard'
    ],
    correct: 1,
    explanation: 'Postman Monitors run collections on a schedule (e.g., every hour) to continuously validate API health. They can send alerts via email, Slack, or webhooks when tests fail.'
  },
  {
    id: 79,
    category: 'Postman',
    question: 'What is a Mock Server in Postman?',
    options: [
      'A test double that simulates a real API server',
      'A simulated server that returns predefined responses based on saved examples in a collection',
      'A staging server for testing',
      'A server that only accepts mock data'
    ],
    correct: 1,
    explanation: 'Postman Mock Servers return predefined responses based on examples saved in your collection. They let front-end teams develop against APIs before the real back-end is ready.'
  },
  {
    id: 80,
    category: 'Postman',
    question: 'How do you set a variable from a test script in Postman?',
    options: [
      'var.set("key", "value")',
      'pm.environment.set("key", "value") or pm.collectionVariables.set("key", "value")',
      'postman.setVariable("key", "value")',
      'setenv("key", "value")'
    ],
    correct: 1,
    explanation: 'Use pm.environment.set() for environment variables or pm.collectionVariables.set() for collection-scoped variables. This is commonly used to extract tokens from login responses for subsequent requests.'
  },
  {
    id: 81,
    category: 'Postman',
    question: 'What is data-driven testing in Postman?',
    options: [
      'Testing with random data only',
      'Running a collection multiple times with different data from a CSV or JSON file using the Collection Runner',
      'Testing database queries',
      'Creating test data automatically'
    ],
    correct: 1,
    explanation: 'Postman supports data-driven testing by feeding a CSV or JSON data file into the Collection Runner or Newman. Each row of data runs the collection once, with variables replaced by the data values.'
  },
  {
    id: 82,
    category: 'Postman',
    question: 'What is the variable scope precedence in Postman (highest to lowest)?',
    options: [
      'Global > Collection > Environment > Local',
      'Local (Data) > Environment > Collection > Global',
      'Environment > Global > Collection > Local',
      'Collection > Environment > Global > Local'
    ],
    correct: 1,
    explanation: 'Postman resolves variables from narrowest to broadest scope: Local/Data variables override Environment, which override Collection, which override Global variables.'
  },
  {
    id: 83,
    category: 'Postman',
    question: 'How do you validate the structure of a JSON response in Postman?',
    options: [
      'Use pm.response.to.have.schema()',
      'Use tv4 or Ajv libraries with pm.expect() to validate against a JSON schema',
      'Use pm.validateJSON()',
      'JSON schema validation is not supported in Postman'
    ],
    correct: 1,
    explanation: 'Postman supports JSON schema validation using built-in libraries like tv4 (Tiny Validator) or Ajv. You define a JSON schema and validate the response body against it to ensure structural correctness.'
  },
  {
    id: 84,
    category: 'Postman',
    question: 'What does the pm.expect() function use under the hood?',
    options: [
      'Jest assertion library',
      'Chai.js BDD assertion library',
      'Node.js native assert module',
      'Custom Postman assertion engine'
    ],
    correct: 1,
    explanation: 'pm.expect() is built on top of the Chai.js BDD/expect assertion library. This is why you can chain assertions like .to.be.a("string"), .to.have.property(), and .to.eql().'
  },
  {
    id: 85,
    category: 'Postman',
    question: 'How do you chain requests in Postman so that one request uses data from a previous response?',
    options: [
      'Requests are automatically chained',
      'Save a value to a variable in a test script, then reference it with {{variable}} in the next request',
      'Use the pm.chain() method',
      'Copy and paste the response value manually'
    ],
    correct: 1,
    explanation: 'In the test script of the first request, extract a value and save it: pm.environment.set("token", pm.response.json().token). In the next request, reference it as {{token}} in headers, body, or URL.'
  },

  // CI/CD questions (86-100)
  {
    id: 86,
    category: 'CI/CD',
    question: 'What does CI/CD stand for?',
    options: [
      'Code Integration / Code Deployment',
      'Continuous Integration / Continuous Delivery (or Deployment)',
      'Continuous Inspection / Continuous Detection',
      'Code Inspection / Code Distribution'
    ],
    correct: 1,
    explanation: 'CI/CD stands for Continuous Integration (automatically building and testing code changes) and Continuous Delivery/Deployment (automatically deploying tested code to production or staging).'
  },
  {
    id: 87,
    category: 'CI/CD',
    question: 'What is a GitHub Actions workflow file written in?',
    options: [
      'JSON',
      'YAML',
      'TOML',
      'XML'
    ],
    correct: 1,
    explanation: 'GitHub Actions workflow files are written in YAML and stored in the .github/workflows/ directory. They define triggers, jobs, and steps for automated CI/CD pipelines.'
  },
  {
    id: 88,
    category: 'CI/CD',
    question: 'What is "test sharding" in CI/CD?',
    options: [
      'Breaking test files into encrypted shards for security',
      'Splitting the test suite across multiple parallel runners to reduce total execution time',
      'Storing test results in a shared database',
      'Creating backup copies of test files'
    ],
    correct: 1,
    explanation: 'Test sharding splits the test suite into parts that run on separate parallel runners. For example, Playwright supports --shard=1/3 to run the first third of tests. This significantly reduces total pipeline time.'
  },
  {
    id: 89,
    category: 'CI/CD',
    question: 'What are "artifacts" in CI/CD pipelines?',
    options: [
      'Old, deprecated test files',
      'Files produced during a build/test run (reports, screenshots, videos) that are saved for later use',
      'Configuration files for the CI server',
      'Source code files committed to the repository'
    ],
    correct: 1,
    explanation: 'Artifacts are files generated during pipeline execution — test reports, screenshots, trace files, build outputs — that are uploaded and stored for debugging, review, or deployment.'
  },
  {
    id: 90,
    category: 'CI/CD',
    question: 'How should sensitive values like API keys be stored in CI/CD?',
    options: [
      'Directly in the YAML pipeline file',
      'In the repository README',
      'Using the CI platform\'s secrets/variables management feature',
      'In a .env file committed to the repository'
    ],
    correct: 2,
    explanation: 'CI platforms provide secrets management (GitHub Secrets, GitLab CI Variables, Azure DevOps Variable Groups) that encrypt sensitive values. They are injected at runtime and never exposed in logs.'
  },
  {
    id: 91,
    category: 'CI/CD',
    question: 'What is the purpose of the "on" key in a GitHub Actions workflow?',
    options: [
      'To turn the workflow on or off',
      'To define which events trigger the workflow (push, pull_request, schedule, etc.)',
      'To specify which branch is the default',
      'To enable or disable specific jobs'
    ],
    correct: 1,
    explanation: 'The "on" key defines trigger events for the workflow: push, pull_request, schedule (cron), workflow_dispatch (manual), and more. For example: on: { push: { branches: [main] } }.'
  },
  {
    id: 92,
    category: 'CI/CD',
    question: 'What is the .gitlab-ci.yml file used for?',
    options: [
      'Storing GitLab user credentials',
      'Defining the CI/CD pipeline configuration for GitLab CI',
      'Configuring GitLab repository settings',
      'Defining merge request templates'
    ],
    correct: 1,
    explanation: 'The .gitlab-ci.yml file in the repository root defines the GitLab CI/CD pipeline: stages, jobs, scripts, rules, artifacts, and variables. GitLab automatically detects and runs it on each commit.'
  },
  {
    id: 93,
    category: 'CI/CD',
    question: 'What is a "pipeline" in CI/CD?',
    options: [
      'A network connection between servers',
      'An automated sequence of stages (build, test, deploy) triggered by code changes',
      'A data transfer protocol',
      'A queue for developer tasks'
    ],
    correct: 1,
    explanation: 'A pipeline is an automated series of stages that code changes pass through — typically build, test, and deploy. Each stage contains jobs that must succeed before the next stage runs.'
  },
  {
    id: 94,
    category: 'CI/CD',
    question: 'How do you run tests in parallel in GitHub Actions?',
    options: [
      'Use the parallel: true option',
      'Use a matrix strategy to create multiple jobs with different configurations',
      'Tests run in parallel by default',
      'Use the --parallel flag on the test command'
    ],
    correct: 1,
    explanation: 'GitHub Actions matrix strategy creates multiple jobs from variable combinations. For test sharding, you define a matrix with shard values and use them with the --shard flag.'
  },
  {
    id: 95,
    category: 'CI/CD',
    question: 'What is the purpose of a test reporter in CI/CD?',
    options: [
      'To report bugs to the development team',
      'To generate formatted test results (HTML, JUnit XML) that CI platforms can display and track',
      'To report server health metrics',
      'To send notifications to Slack'
    ],
    correct: 1,
    explanation: 'Test reporters generate structured output (JUnit XML, HTML, JSON) from test results. CI platforms parse these reports to display test summaries, track trends, and identify flaky tests.'
  },
  {
    id: 96,
    category: 'CI/CD',
    question: 'What is Azure DevOps Pipelines?',
    options: [
      'A cloud storage service',
      'A CI/CD service by Microsoft for building, testing, and deploying applications',
      'A project management tool',
      'A code review platform'
    ],
    correct: 1,
    explanation: 'Azure DevOps Pipelines is Microsoft\'s CI/CD service supporting YAML-based pipeline definitions. It integrates with Azure repos and GitHub, offering build agents, test tasks, and deployment stages.'
  },
  {
    id: 97,
    category: 'CI/CD',
    question: 'What is a Jenkinsfile?',
    options: [
      'A configuration file for Jenkins server settings',
      'A file that defines the Jenkins CI/CD pipeline as code using Groovy syntax',
      'A log file generated by Jenkins',
      'A Jenkins plugin manifest'
    ],
    correct: 1,
    explanation: 'A Jenkinsfile defines the pipeline as code using Groovy-based DSL. It supports declarative and scripted syntax, defining stages, steps, agents, and post-build actions within the repository.'
  },
  {
    id: 98,
    category: 'CI/CD',
    question: 'What does "container-based CI" mean?',
    options: [
      'Running the CI server inside a shipping container',
      'Running CI jobs inside Docker containers for consistent, isolated, and reproducible environments',
      'Storing build artifacts in containers',
      'Using container ships to transfer code between servers'
    ],
    correct: 1,
    explanation: 'Container-based CI runs each job inside a Docker container, ensuring a consistent environment regardless of the host. This eliminates "works on my machine" issues and makes environments reproducible.'
  },
  {
    id: 99,
    category: 'CI/CD',
    question: 'How do you install Playwright browsers in a CI environment?',
    options: [
      'Browsers are pre-installed on all CI runners',
      'npx playwright install --with-deps',
      'npm install browsers',
      'Download browser binaries manually'
    ],
    correct: 1,
    explanation: 'npx playwright install --with-deps downloads browser binaries AND their system dependencies (libs for rendering). The --with-deps flag is critical in CI where system libraries are not pre-installed.'
  },
  {
    id: 100,
    category: 'CI/CD',
    question: 'What is the benefit of uploading test artifacts (screenshots, videos, traces) in CI?',
    options: [
      'It makes the pipeline run faster',
      'It provides debugging evidence for failed tests that can be reviewed after the pipeline completes',
      'It is required for the pipeline to pass',
      'It reduces storage costs'
    ],
    correct: 1,
    explanation: 'Uploading artifacts like screenshots, videos, and trace files enables post-mortem debugging of failed tests. Without artifacts, diagnosing CI-only failures would require re-running tests locally.'
  },
];

export default quizQuestions;
