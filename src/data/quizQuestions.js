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
];

export default quizQuestions;
