/* eslint-disable no-useless-escape */
import React from 'react';
import CodeBlock from '../../components/CodeBlock/CodeBlock';
import Navigation from '../../components/Navigation/Navigation';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiAward } from 'react-icons/fi';
import './QACI.css';

const sections = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'github-actions', label: 'GitHub Actions' },
  { id: 'gitlab-ci', label: 'GitLab CI' },
  { id: 'azure-devops', label: 'Azure DevOps' },
  { id: 'jenkins', label: 'Jenkins' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'handoff', label: 'Handing Off to DevOps' },
  { id: 'test-reports', label: 'Test Reports' },
  { id: 'full-pipeline', label: 'Full Pipeline Example' },
];

// ---------------------------------------------------------------------------
// Code snippets
// ---------------------------------------------------------------------------

const ghActionsBasicCode = `# .github/workflows/playwright.yml
name: Playwright E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    timeout-minutes: 30
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test
        env:
          CI: true
          BASE_URL: \${{ secrets.STAGING_URL }}

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-html-report
          path: playwright-report/
          retention-days: 14

      - name: Upload test results (screenshots, videos, traces)
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-test-results
          path: test-results/
          retention-days: 7`;

const ghActionsMatrixCode = `# .github/workflows/playwright-matrix.yml
name: Playwright Cross-Browser Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    timeout-minutes: 30
    runs-on: ubuntu-latest

    strategy:
      fail-fast: false
      matrix:
        project: [chromium, firefox, webkit]
        shard: [1/3, 2/3, 3/3]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps \${{ matrix.project }}

      - name: Run Playwright tests
        run: npx playwright test --project=\${{ matrix.project }} --shard=\${{ matrix.shard }}
        env:
          CI: true

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: results-\${{ matrix.project }}-\${{ strategy.job-index }}
          path: |
            playwright-report/
            test-results/
          retention-days: 14`;

const gitlabCICode = `# .gitlab-ci.yml
stages:
  - lint
  - test
  - e2e
  - report

variables:
  npm_config_cache: "\$CI_PROJECT_DIR/.npm"
  PLAYWRIGHT_BROWSERS_PATH: "\$CI_PROJECT_DIR/.cache/ms-playwright"

# Cache node_modules and Playwright browsers across pipelines
cache:
  key: \$CI_COMMIT_REF_SLUG
  paths:
    - .npm/
    - .cache/ms-playwright/
    - node_modules/

# ------------------------------------------------------------------
# Stage 1: Lint
# ------------------------------------------------------------------
lint:
  stage: lint
  image: node:20-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run lint
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
    - if: \$CI_COMMIT_BRANCH == "main"

# ------------------------------------------------------------------
# Stage 2: Unit Tests
# ------------------------------------------------------------------
unit-tests:
  stage: test
  image: node:20-alpine
  script:
    - npm ci --cache .npm --prefer-offline
    - npm run test:unit -- --coverage
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
    - if: \$CI_COMMIT_BRANCH == "main"

# ------------------------------------------------------------------
# Stage 3: E2E Tests with Playwright
# ------------------------------------------------------------------
e2e-tests:
  stage: e2e
  image: mcr.microsoft.com/playwright:v1.48.0-jammy
  parallel: 3
  script:
    - npm ci --cache .npm --prefer-offline
    - npx playwright test --shard=\$CI_NODE_INDEX/\$CI_NODE_TOTAL
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: results/junit.xml
    expire_in: 7 days
  rules:
    - if: \$CI_PIPELINE_SOURCE == "merge_request_event"
    - if: \$CI_COMMIT_BRANCH == "main"

# ------------------------------------------------------------------
# Stage 4: Publish Report
# ------------------------------------------------------------------
pages:
  stage: report
  dependencies:
    - e2e-tests
  script:
    - mkdir -p public
    - cp -r playwright-report/* public/
  artifacts:
    paths:
      - public
  rules:
    - if: \$CI_COMMIT_BRANCH == "main"`;

const azurePipelinesCode = `# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop

pr:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

variables:
  nodeVersion: '20.x'
  npm_config_cache: \$(Pipeline.Workspace)/.npm

stages:
  # ------------------------------------------------------------------
  # Stage 1: Install & Lint
  # ------------------------------------------------------------------
  - stage: Prepare
    displayName: 'Install & Lint'
    jobs:
      - job: LintJob
        displayName: 'Lint Code'
        steps:
          - task: UseNode@1
            inputs:
              version: \$(nodeVersion)
            displayName: 'Setup Node.js'

          - task: Cache@2
            inputs:
              key: 'npm | "\$(Agent.OS)" | package-lock.json'
              restoreKeys: |
                npm | "\$(Agent.OS)"
              path: \$(npm_config_cache)
            displayName: 'Cache npm'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npm run lint
            displayName: 'Run linter'

  # ------------------------------------------------------------------
  # Stage 2: Playwright E2E Tests
  # ------------------------------------------------------------------
  - stage: E2E
    displayName: 'E2E Tests'
    dependsOn: Prepare
    jobs:
      - job: PlaywrightTests
        displayName: 'Run Playwright Tests'
        timeoutInMinutes: 30
        steps:
          - task: UseNode@1
            inputs:
              version: \$(nodeVersion)
            displayName: 'Setup Node.js'

          - script: npm ci
            displayName: 'Install dependencies'

          - script: npx playwright install --with-deps
            displayName: 'Install Playwright browsers'

          - script: npx playwright test --reporter=junit,html
            displayName: 'Run E2E tests'
            env:
              CI: 'true'
              BASE_URL: \$(STAGING_URL)

          - task: PublishTestResults@2
            displayName: 'Publish test results'
            condition: always()
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: 'results/junit.xml'
              mergeTestResults: true
              testRunTitle: 'Playwright E2E Tests'

          - task: PublishPipelineArtifact@1
            displayName: 'Publish HTML report'
            condition: always()
            inputs:
              targetPath: 'playwright-report'
              artifact: 'playwright-report'
              publishLocation: 'pipeline'

          - task: PublishPipelineArtifact@1
            displayName: 'Publish traces and screenshots'
            condition: failed()
            inputs:
              targetPath: 'test-results'
              artifact: 'test-results'
              publishLocation: 'pipeline'

  # ------------------------------------------------------------------
  # Stage 3: Integration with Azure Test Plans (optional)
  # ------------------------------------------------------------------
  - stage: TestPlanSync
    displayName: 'Sync with Test Plans'
    dependsOn: E2E
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - job: SyncResults
        displayName: 'Sync Test Results to Azure Test Plans'
        steps:
          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: 'results/junit.xml'
              testRunTitle: 'E2E Regression - \$(Build.BuildNumber)'
              publishRunAttachments: true`;

const jenkinsfileCode = `// Jenkinsfile (Declarative Pipeline)
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
            args '-u root'
        }
    }

    environment {
        CI = 'true'
        HOME = '/root'
        npm_config_cache = '\${WORKSPACE}/.npm'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm run test:unit'
            }
        }

        stage('E2E Tests') {
            steps {
                sh 'npx playwright test --reporter=junit,html'
            }
        }
    }

    post {
        always {
            // Publish JUnit test results to Jenkins
            junit 'results/junit.xml'

            // Archive the HTML report
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])

            // Archive screenshots and traces
            archiveArtifacts artifacts: 'test-results/**/*',
                             allowEmptyArchive: true,
                             fingerprint: true
        }

        failure {
            // Send notification on failure
            slackSend(
                channel: '#qa-alerts',
                color: 'danger',
                message: """
                    E2E Tests Failed!
                    Job: \${env.JOB_NAME} #\${env.BUILD_NUMBER}
                    Branch: \${env.GIT_BRANCH}
                    <\${env.BUILD_URL}|View Build>
                """.stripIndent()
            )
        }

        success {
            slackSend(
                channel: '#qa-results',
                color: 'good',
                message: "E2E Tests Passed - \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }

        cleanup {
            cleanWs()
        }
    }
}`;

const jenkinsParallelCode = `// Jenkinsfile with Parallel Browser Testing
pipeline {
    agent none

    stages {
        stage('Install') {
            agent {
                docker {
                    image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
                    args '-u root'
                }
            }
            steps {
                sh 'npm ci'
                stash includes: 'node_modules/**', name: 'deps'
            }
        }

        stage('E2E Tests') {
            parallel {
                stage('Chromium') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
                            args '-u root'
                        }
                    }
                    steps {
                        unstash 'deps'
                        sh 'npx playwright test --project=chromium'
                    }
                    post {
                        always {
                            junit 'results/junit.xml'
                        }
                    }
                }

                stage('Firefox') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
                            args '-u root'
                        }
                    }
                    steps {
                        unstash 'deps'
                        sh 'npx playwright test --project=firefox'
                    }
                    post {
                        always {
                            junit 'results/junit.xml'
                        }
                    }
                }

                stage('WebKit') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/playwright:v1.48.0-jammy'
                            args '-u root'
                        }
                    }
                    steps {
                        unstash 'deps'
                        sh 'npx playwright test --project=webkit'
                    }
                    post {
                        always {
                            junit 'results/junit.xml'
                        }
                    }
                }
            }
        }
    }
}`;

const envVarsCode = `# Environment variables for test configuration
# playwright.config.ts reads these to adapt behavior per environment

# .env.ci (committed - non-sensitive defaults)
CI=true
BASE_URL=https://staging.example.com
TEST_TIMEOUT=60000
RETRIES=2
WORKERS=4

# .env.local (NOT committed - developer overrides)
BASE_URL=http://localhost:3000
TEST_TIMEOUT=30000
RETRIES=0
WORKERS=undefined`;

const envConfigCode = `// playwright.config.ts - Reading environment variables
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load the appropriate .env file based on CI flag
dotenv.config({
  path: path.resolve(__dirname, process.env.CI ? '.env.ci' : '.env.local'),
});

export default defineConfig({
  timeout: Number(process.env.TEST_TIMEOUT) || 30_000,
  retries: Number(process.env.RETRIES) || 0,
  workers: process.env.WORKERS === 'undefined'
    ? undefined
    : Number(process.env.WORKERS) || 1,

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
});`;

const secretsCode = `# GitHub Actions - Using secrets for sensitive values
# Secrets are configured in: Settings > Secrets and variables > Actions

- name: Run Playwright tests
  run: npx playwright test
  env:
    CI: true
    BASE_URL: \${{ secrets.STAGING_URL }}
    API_KEY: \${{ secrets.API_KEY }}
    TEST_USER_EMAIL: \${{ secrets.TEST_USER_EMAIL }}
    TEST_USER_PASSWORD: \${{ secrets.TEST_USER_PASSWORD }}

# GitLab CI - Using CI/CD variables
# Variables are configured in: Settings > CI/CD > Variables
e2e-tests:
  script:
    - npx playwright test
  variables:
    BASE_URL: \$STAGING_URL
    API_KEY: \$API_KEY

# Azure DevOps - Using pipeline variables and variable groups
# Variable groups are managed in: Pipelines > Library
- script: npx playwright test
  env:
    BASE_URL: \$(STAGING_URL)
    API_KEY: \$(API_KEY)`;

const shardingCode = `# Sharding distributes tests across multiple parallel workers
# This significantly reduces total execution time

# GitHub Actions - 4 shards running in parallel
strategy:
  fail-fast: false
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]

steps:
  - name: Run tests (shard \${{ matrix.shard }})
    run: npx playwright test --shard=\${{ matrix.shard }}

# Merge shard reports into a single HTML report
  - name: Merge reports
    if: always()
    run: npx playwright merge-reports --reporter=html ./blob-reports

# GitLab CI - Uses built-in parallel keyword
e2e-tests:
  parallel: 4
  script:
    - npx playwright test --shard=\$CI_NODE_INDEX/\$CI_NODE_TOTAL`;

const retryTagCode = `// playwright.config.ts - Retry and tagging strategies
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Retry failed tests 2 times in CI, 0 times locally
  retries: process.env.CI ? 2 : 0,

  // Projects can use grep to filter by tags
  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      retries: 0, // Smoke tests should never be flaky
    },
    {
      name: 'regression',
      grep: /@regression/,
      retries: 2,
    },
    {
      name: 'flaky-known',
      grep: /@flaky/,
      retries: 3,
    },
  ],
});`;

const testTagsCode = `// tests/checkout.spec.ts - Using tags in test names
import { test, expect } from '@playwright/test';

test('user can log in @smoke @regression', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveURL(/.*dashboard/);
});

test('user can add item to cart @regression', async ({ page }) => {
  // ... test implementation
});

test('payment gateway timeout handling @regression @flaky', async ({ page }) => {
  // This test is known to be flaky due to third-party gateway
  // ... test implementation
});`;

const conditionalCode = `# Run different test suites based on branch or event
# GitHub Actions - conditional execution

jobs:
  smoke-tests:
    # Smoke tests run on every push and PR
    if: always()
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --project=smoke

  regression-tests:
    # Full regression only on main branch or manual trigger
    if: github.ref == 'refs/heads/main' || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --project=regression

  # Only run visual tests when UI files change
  visual-tests:
    if: contains(github.event.head_commit.modified, 'src/components')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --grep @visual`;

const handoffChecklistCode = `# QA-to-DevOps Handoff Checklist
# Include this document alongside your YAML pipeline file

## Pipeline File
- [ ] YAML file location: .github/workflows/playwright.yml
- [ ] Tested locally with 'act' or equivalent tool
- [ ] All jobs complete successfully in isolation

## Required Secrets / Environment Variables
| Variable Name       | Description                   | Where to Get It        |
|---------------------|-------------------------------|------------------------|
| STAGING_URL         | Staging environment base URL  | DevOps / Infra team    |
| TEST_USER_EMAIL     | Test account email            | QA (shared vault)      |
| TEST_USER_PASSWORD  | Test account password         | QA (shared vault)      |
| API_KEY             | API key for test environment  | Backend team           |
| SLACK_WEBHOOK_URL   | Slack notification webhook    | Slack admin            |

## Infrastructure Requirements
- Node.js 20.x
- Ubuntu runner (ubuntu-latest)
- Playwright Docker image: mcr.microsoft.com/playwright:v1.48.0-jammy
- Minimum 7 GB RAM for parallel browser execution
- Estimated storage: ~500 MB for browser binaries

## Execution Details
- Expected run time: 8-12 minutes (with 4 shards)
- Test count: ~150 E2E tests
- Browsers: Chromium, Firefox, WebKit
- Artifacts generated: HTML report, JUnit XML, screenshots, traces

## Triggers
- Runs on: push to main, pull requests to main
- Manual trigger: workflow_dispatch enabled
- Schedule: nightly regression at 2:00 AM UTC (if configured)`;

const communicationTemplateCode = `# Sample Message to DevOps Engineer
# ---------------------------------

Subject: Ready for Integration - Playwright E2E Pipeline

Hi [DevOps Engineer],

I have prepared the CI/CD pipeline configuration for our Playwright E2E
test suite. Here is everything you need to integrate it:

1. PIPELINE FILE
   - File: .github/workflows/playwright-e2e.yml
   - Attached to this message / PR #XXX

2. REQUIRED SECRETS (please add to GitHub Actions secrets):
   - STAGING_URL: https://staging.ourapp.com
   - TEST_USER_EMAIL: (in shared vault, path: /qa/test-accounts)
   - TEST_USER_PASSWORD: (in shared vault, path: /qa/test-accounts)
   - SLACK_WEBHOOK_URL: (QA channel webhook)

3. INFRASTRUCTURE NEEDS
   - Standard GitHub-hosted runner (ubuntu-latest) is sufficient
   - No self-hosted runner required
   - No additional services (databases, etc.) needed
     (tests run against the existing staging environment)

4. EXPECTED BEHAVIOR
   - Triggers on push to main and PRs to main
   - Runs ~150 tests across 3 browsers in ~10 minutes
   - Produces an HTML report artifact (retained 14 days)
   - Sends Slack notification on failure

5. TESTING
   - I have validated the YAML syntax
   - Tests pass locally against staging
   - The pipeline has been tested with a dry run

Please let me know if you need any changes or have questions.

Thanks,
[QA Engineer Name]`;

const reportersConfigCode = `// playwright.config.ts - Reporter configuration for CI pipelines
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    // Terminal output for live CI logs
    ['list'],

    // HTML report - self-contained, downloadable from artifacts
    ['html', {
      open: 'never',
      outputFolder: 'playwright-report',
    }],

    // JUnit XML - parsed by CI systems (Jenkins, GitLab, Azure DevOps)
    // Shows test results directly in the CI dashboard
    ['junit', {
      outputFile: 'results/junit.xml',
      embedAnnotationsAsProperties: true,
    }],

    // JSON - for custom dashboards or trend analysis
    ['json', {
      outputFile: 'results/results.json',
    }],
  ],
});`;

const allureConfigCode = `// For Allure reporting, install the adapter:
// npm install -D allure-playwright

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false,
    }],
  ],
});`;

const allureCICode = `# GitHub Actions - Generate and publish Allure report
- name: Run Playwright tests
  run: npx playwright test

- name: Generate Allure report
  if: always()
  run: |
    npm install -g allure-commandline
    allure generate allure-results --clean -o allure-report

- name: Upload Allure report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: allure-report
    path: allure-report/
    retention-days: 14

# GitLab CI - Allure with GitLab Pages
e2e-tests:
  script:
    - npx playwright test
  artifacts:
    paths:
      - allure-results/
    expire_in: 7 days

allure-report:
  stage: report
  script:
    - allure generate allure-results --clean -o public
  artifacts:
    paths:
      - public
  dependencies:
    - e2e-tests`;

const fullPipelineCode = `# .github/workflows/playwright-full-pipeline.yml
# Complete production-ready pipeline:
# lint -> unit tests -> E2E (sharded, multi-browser) -> report -> notify

name: Full Test Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      test_suite:
        description: 'Test suite to run'
        required: false
        default: 'all'
        type: choice
        options:
          - all
          - smoke
          - regression
  schedule:
    # Nightly regression at 2:00 AM UTC
    - cron: '0 2 * * *'

env:
  NODE_VERSION: '20'
  PLAYWRIGHT_VERSION: '1.48.0'

jobs:
  # ================================================================
  # Job 1: Lint
  # ================================================================
  lint:
    name: Lint
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit

  # ================================================================
  # Job 2: Unit Tests
  # ================================================================
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci
      - run: npm run test:unit -- --coverage

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/

  # ================================================================
  # Job 3: E2E Tests (sharded across browsers)
  # ================================================================
  e2e-tests:
    name: E2E (\${{ matrix.project }}, shard \${{ matrix.shard }})
    needs: [lint, unit-tests]
    runs-on: ubuntu-latest
    timeout-minutes: 30

    strategy:
      fail-fast: false
      matrix:
        project: [chromium, firefox, webkit]
        shard: [1/2, 2/2]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browser
        run: npx playwright install --with-deps \${{ matrix.project }}

      - name: Determine test grep
        id: grep
        run: |
          if [ "\${{ github.event.inputs.test_suite }}" = "smoke" ]; then
            echo "grep=--grep @smoke" >> \$GITHUB_OUTPUT
          elif [ "\${{ github.event.inputs.test_suite }}" = "regression" ]; then
            echo "grep=--grep @regression" >> \$GITHUB_OUTPUT
          else
            echo "grep=" >> \$GITHUB_OUTPUT
          fi

      - name: Run Playwright tests
        run: >
          npx playwright test
          --project=\${{ matrix.project }}
          --shard=\${{ matrix.shard }}
          \${{ steps.grep.outputs.grep }}
        env:
          CI: true
          BASE_URL: \${{ secrets.STAGING_URL }}
          API_KEY: \${{ secrets.API_KEY }}
          TEST_USER_EMAIL: \${{ secrets.TEST_USER_EMAIL }}
          TEST_USER_PASSWORD: \${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload blob report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: blob-report-\${{ matrix.project }}-\${{ strategy.job-index }}
          path: blob-report/
          retention-days: 3

  # ================================================================
  # Job 4: Merge Reports
  # ================================================================
  merge-reports:
    name: Merge Test Reports
    needs: e2e-tests
    if: always()
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'

      - run: npm ci

      - name: Download all blob reports
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge into HTML report
        run: npx playwright merge-reports --reporter=html ./all-blob-reports

      - name: Upload final HTML report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-html-report
          path: playwright-report/
          retention-days: 14

  # ================================================================
  # Job 5: Slack Notification
  # ================================================================
  notify:
    name: Notify
    needs: [lint, unit-tests, e2e-tests, merge-reports]
    if: always()
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Determine status
        id: status
        run: |
          if [ "\${{ needs.e2e-tests.result }}" = "success" ]; then
            echo "color=good" >> \$GITHUB_OUTPUT
            echo "status=PASSED" >> \$GITHUB_OUTPUT
            echo "emoji=white_check_mark" >> \$GITHUB_OUTPUT
          else
            echo "color=danger" >> \$GITHUB_OUTPUT
            echo "status=FAILED" >> \$GITHUB_OUTPUT
            echo "emoji=x" >> \$GITHUB_OUTPUT
          fi

      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": ":\${{ steps.status.outputs.emoji }}: E2E Tests \${{ steps.status.outputs.status }}",
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": ":\${{ steps.status.outputs.emoji }}: E2E Tests \${{ steps.status.outputs.status }}"
                  }
                },
                {
                  "type": "section",
                  "fields": [
                    { "type": "mrkdwn", "text": "*Repository:*\\n\${{ github.repository }}" },
                    { "type": "mrkdwn", "text": "*Branch:*\\n\${{ github.ref_name }}" },
                    { "type": "mrkdwn", "text": "*Triggered by:*\\n\${{ github.actor }}" },
                    { "type": "mrkdwn", "text": "*Run:*\\n<\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|View>" }
                  ]
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK`;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function QACI() {
  const { currentUser, progress, markPageComplete } = useAuth();

  return (
    <div className="qaci-page">
      <div className="page-layout container">
        <article className="page-content">

          {/* ---------- Hero / Intro ---------- */}
          <h1>QA in CI/CD Pipelines</h1>
          <p className="page-subtitle">
            Learn how to write production-ready CI/CD pipeline configurations for Playwright tests.
            As a QA engineer, your role is to create the YAML files, configure test stages, and hand
            them off to DevOps engineers for integration into the organization's main pipeline
            infrastructure.
          </p>

          {/* ========== 1. Introduction ========== */}
          <section id="introduction">
            <span className="section-label section-label--green">Overview</span>
            <h2>QA's Role in CI/CD</h2>

            <h3>Why Automated Testing in Pipelines Matters</h3>
            <p>
              Continuous Integration and Continuous Delivery (CI/CD) pipelines are the backbone of
              modern software delivery. As a QA engineer, your automated Playwright tests are only
              valuable if they run automatically on every code change. Running tests manually defeats
              the purpose of automation &mdash; the pipeline ensures tests execute consistently,
              reliably, and without human intervention.
            </p>

            <h3>The Pipeline Lifecycle from a QA Perspective</h3>
            <ul>
              <li>
                <strong>Code Push / PR</strong> &mdash; A developer pushes code or opens a pull request.
                This triggers the pipeline automatically.
              </li>
              <li>
                <strong>Lint and Build</strong> &mdash; The code is checked for style issues and compiled.
                QA tests should only run if this stage passes.
              </li>
              <li>
                <strong>Unit Tests</strong> &mdash; Fast, isolated tests run first. If they fail, there is
                no point running slower E2E tests.
              </li>
              <li>
                <strong>E2E Tests</strong> &mdash; Your Playwright tests run against a deployed staging
                environment. This is where QA's pipeline work lives.
              </li>
              <li>
                <strong>Reporting</strong> &mdash; Test results, screenshots, videos, and traces are
                collected as artifacts for debugging and review.
              </li>
              <li>
                <strong>Notification</strong> &mdash; The team is notified of results via Slack, email,
                or the CI platform's dashboard.
              </li>
              <li>
                <strong>Deployment</strong> &mdash; If all tests pass, the code is deployed to production
                (or promoted to the next environment).
              </li>
            </ul>

            <h3>What Does a QA Engineer Actually Write?</h3>
            <p>
              As a QA engineer, you write the YAML pipeline configuration that defines how your tests
              run in CI. You do not need to manage the infrastructure, runners, or deployment
              pipelines &mdash; that is the DevOps engineer's responsibility. Your job is to:
            </p>
            <ol>
              <li>Write the YAML file that installs dependencies and runs your tests</li>
              <li>Configure reporters, artifacts, and test sharding</li>
              <li>Define which tests run on which triggers (smoke on every PR, full regression nightly)</li>
              <li>Document the required secrets and environment variables</li>
              <li>Hand the YAML file to DevOps with clear instructions for integration</li>
            </ol>

            <div className="info-box">
              <strong>Key Takeaway</strong>
              You do not need to be a DevOps expert. You need to understand enough YAML and CI/CD
              concepts to write a pipeline file that runs your tests correctly. DevOps engineers
              will handle the infrastructure, runner management, and integration with deployment
              workflows.
            </div>
          </section>

          {/* ========== 2. GitHub Actions ========== */}
          <section id="github-actions">
            <span className="section-label section-label--blue">CI Platform</span>
            <h2>GitHub Actions</h2>

            <p>
              GitHub Actions is the most common CI/CD platform for projects hosted on GitHub.
              Workflows are defined in YAML files placed in the <code>.github/workflows/</code>
              directory. Each workflow file defines one or more jobs that run on GitHub-hosted
              runners.
            </p>

            <h3>Production-Ready Workflow</h3>
            <p>
              This workflow triggers on every push and pull request, installs dependencies,
              runs Playwright tests, and uploads all artifacts (reports, screenshots, videos,
              traces) for debugging:
            </p>
            <CodeBlock code={ghActionsBasicCode} language="yaml" fileName=".github/workflows/playwright.yml" />

            <div className="tip-box">
              <strong>Tip</strong>
              The <code>if: always()</code> condition on the report upload step ensures the HTML
              report is uploaded even when tests fail. Without it, the upload step is skipped on
              failure, and you lose the most important debugging information.
            </div>

            <h3>Matrix Strategy: Multi-Browser and Sharding</h3>
            <p>
              For larger test suites, use a matrix strategy to run tests across browsers and shards
              in parallel. This can reduce a 30-minute test suite to under 10 minutes:
            </p>
            <CodeBlock code={ghActionsMatrixCode} language="yaml" fileName=".github/workflows/playwright-matrix.yml" />

            <div className="info-box">
              <strong>How Sharding Works</strong>
              Sharding splits your test files across multiple parallel workers. With{' '}
              <code>--shard=1/3</code>, each worker runs approximately one-third of the test
              files. Combined with the browser matrix (3 browsers x 3 shards = 9 parallel jobs),
              you get significant speed improvements.
            </div>
          </section>

          {/* ========== 3. GitLab CI ========== */}
          <section id="gitlab-ci">
            <span className="section-label section-label--blue">CI Platform</span>
            <h2>GitLab CI</h2>

            <p>
              GitLab CI/CD is configured through a single <code>.gitlab-ci.yml</code> file at
              the root of your repository. It supports stages, parallel execution, Docker-based
              runners, and built-in artifact management with GitLab Pages for report hosting.
            </p>

            <h3>Complete Pipeline with Stages</h3>
            <p>
              This configuration defines four stages: lint, unit tests, E2E tests (with parallel
              sharding), and report publishing via GitLab Pages:
            </p>
            <CodeBlock code={gitlabCICode} language="yaml" fileName=".gitlab-ci.yml" />

            <h3>Key GitLab CI Features for QA</h3>
            <ul>
              <li>
                <strong>Playwright Docker Image</strong> &mdash; Using{' '}
                <code>mcr.microsoft.com/playwright:v1.48.0-jammy</code> ensures all browser
                dependencies are pre-installed, eliminating setup issues.
              </li>
              <li>
                <strong>parallel keyword</strong> &mdash; GitLab natively supports parallel job
                execution. Setting <code>parallel: 3</code> creates three copies of the job, and
                Playwright's <code>--shard</code> flag distributes tests across them.
              </li>
              <li>
                <strong>JUnit reports</strong> &mdash; The <code>reports: junit</code> directive
                tells GitLab to parse the XML file and display test results directly in merge
                request widgets.
              </li>
              <li>
                <strong>GitLab Pages</strong> &mdash; The <code>pages</code> job publishes the
                HTML report to a URL like <code>https://your-group.gitlab.io/your-project</code>.
              </li>
            </ul>

            <div className="warning-box">
              <strong>Warning</strong>
              Keep the Playwright Docker image version in sync with your <code>package.json</code>
              version. A mismatch (e.g., Docker image v1.48 but npm package v1.45) will cause
              browser binary compatibility errors.
            </div>
          </section>

          {/* ========== 4. Azure DevOps ========== */}
          <section id="azure-devops">
            <span className="section-label section-label--blue">CI Platform</span>
            <h2>Azure DevOps</h2>

            <p>
              Azure DevOps Pipelines use YAML files (typically <code>azure-pipelines.yml</code>)
              and provide tight integration with Azure Test Plans, making it popular in enterprise
              environments. Pipelines are organized into stages, jobs, and steps.
            </p>

            <h3>Complete Azure Pipeline</h3>
            <CodeBlock code={azurePipelinesCode} language="yaml" fileName="azure-pipelines.yml" />

            <h3>Azure DevOps Highlights for QA</h3>
            <ul>
              <li>
                <strong>PublishTestResults task</strong> &mdash; This built-in task parses JUnit XML
                and displays results in the Azure DevOps test tab. You can see pass/fail counts,
                test duration trends, and failure details without downloading artifacts.
              </li>
              <li>
                <strong>Pipeline Artifacts</strong> &mdash; The <code>PublishPipelineArtifact</code>
                task stores the HTML report and traces. Team members can download and view them
                directly from the pipeline run page.
              </li>
              <li>
                <strong>Azure Test Plans Integration</strong> &mdash; The optional third stage
                syncs test results with Azure Test Plans, enabling traceability between automated
                tests and manual test cases.
              </li>
              <li>
                <strong>Variable Groups</strong> &mdash; Sensitive values like API keys are stored
                in Variable Groups (Pipelines &gt; Library) and referenced with{' '}
                <code>$(VARIABLE_NAME)</code> syntax.
              </li>
            </ul>

            <div className="tip-box">
              <strong>Tip</strong>
              Use <code>condition: always()</code> on the PublishTestResults task to ensure test
              results are published even when the test step fails. The default behavior skips
              subsequent steps on failure, which means you lose visibility into what went wrong.
            </div>
          </section>

          {/* ========== 5. Jenkins ========== */}
          <section id="jenkins">
            <span className="section-label section-label--blue">CI Platform</span>
            <h2>Jenkins</h2>

            <p>
              Jenkins uses Groovy-based <code>Jenkinsfile</code> definitions for pipeline-as-code.
              The declarative pipeline syntax is the most common approach. Playwright tests run
              inside Docker agents that have all browser dependencies pre-installed.
            </p>

            <h3>Declarative Pipeline</h3>
            <p>
              A complete Jenkinsfile that installs dependencies, lints, runs unit tests, executes
              Playwright E2E tests, and publishes results:
            </p>
            <CodeBlock code={jenkinsfileCode} language="groovy" fileName="Jenkinsfile" />

            <h3>Parallel Browser Testing</h3>
            <p>
              For faster execution, run each browser project as a parallel stage. Jenkins executes
              them simultaneously on separate Docker agents:
            </p>
            <CodeBlock code={jenkinsParallelCode} language="groovy" fileName="Jenkinsfile" />

            <h3>Jenkins Plugin Requirements</h3>
            <p>
              When handing off a Jenkinsfile to DevOps, include a list of required Jenkins plugins.
              Common plugins needed for Playwright test reporting:
            </p>
            <ul>
              <li><strong>HTML Publisher Plugin</strong> &mdash; For hosting the Playwright HTML report</li>
              <li><strong>JUnit Plugin</strong> &mdash; For parsing and displaying test results (usually pre-installed)</li>
              <li><strong>Docker Pipeline Plugin</strong> &mdash; For running stages inside Docker containers</li>
              <li><strong>Slack Notification Plugin</strong> &mdash; For sending Slack alerts on failure</li>
              <li><strong>Pipeline Utility Steps</strong> &mdash; For archive and stash operations</li>
            </ul>

            <div className="warning-box">
              <strong>Warning</strong>
              Playwright requires the container to run as root (or a user with sufficient
              permissions) due to browser sandbox requirements. The <code>args '-u root'</code>
              flag in the Docker agent configuration is necessary. Inform your DevOps engineer
              about this requirement, as some organizations restrict root container usage.
            </div>
          </section>

          {/* ========== 6. Pipeline Best Practices ========== */}
          <section id="best-practices">
            <span className="section-label section-label--purple">Best Practices</span>
            <h2>Pipeline Best Practices</h2>

            <p>
              Writing the YAML file is only part of the job. These best practices ensure your
              pipeline is maintainable, reliable, and efficient.
            </p>

            <h3>Environment Variables for Test Configuration</h3>
            <p>
              Never hardcode URLs, timeouts, or credentials in your test code or YAML files. Use
              environment variables to make your pipeline adaptable to different environments:
            </p>
            <CodeBlock code={envVarsCode} language="bash" fileName=".env files" />
            <CodeBlock code={envConfigCode} language="typescript" fileName="playwright.config.ts" />

            <h3>Secrets Management</h3>
            <p>
              API keys, passwords, and tokens must never appear in YAML files or be committed to
              version control. Each CI platform has its own secrets management system:
            </p>
            <CodeBlock code={secretsCode} language="yaml" fileName="secrets-examples.yml" />

            <div className="warning-box">
              <strong>Warning</strong>
              Never log secrets in pipeline output. Avoid commands like{' '}
              <code>echo $API_KEY</code> for debugging. CI platforms mask known secrets in logs,
              but custom logging can accidentally expose them.
            </div>

            <h3>Test Parallelization and Sharding</h3>
            <p>
              Sharding is the most effective way to reduce pipeline execution time. Playwright's
              built-in <code>--shard</code> flag distributes test files across multiple parallel
              CI jobs:
            </p>
            <CodeBlock code={shardingCode} language="yaml" fileName="sharding-examples.yml" />

            <h3>Retry Strategies and Test Tagging</h3>
            <p>
              Retries handle transient failures (network issues, timing problems) without hiding
              real bugs. Tags let you create different test suites for different pipeline triggers:
            </p>
            <CodeBlock code={retryTagCode} language="typescript" fileName="playwright.config.ts" />

            <p>
              Apply tags directly in your test names using the <code>@tag</code> convention:
            </p>
            <CodeBlock code={testTagsCode} language="typescript" fileName="tests/checkout.spec.ts" />

            <div className="tip-box">
              <strong>Tip</strong>
              Keep smoke tests under 5 minutes. These run on every PR and should provide fast
              feedback. Reserve full regression (all browsers, all tests) for nightly runs or
              merges to main.
            </div>

            <h3>Conditional Execution</h3>
            <p>
              Run different test suites based on the branch, trigger event, or changed files. This
              prevents unnecessary resource usage and speeds up developer feedback:
            </p>
            <CodeBlock code={conditionalCode} language="yaml" fileName="conditional-examples.yml" />
          </section>

          {/* ========== 7. Handing Off to DevOps ========== */}
          <section id="handoff">
            <span className="section-label section-label--green">Collaboration</span>
            <h2>Handing Off to DevOps</h2>

            <p>
              Writing the YAML is only half the work. The other half is clearly communicating
              everything the DevOps engineer needs to integrate your pipeline into the
              organization's CI/CD infrastructure. A good handoff reduces back-and-forth and
              gets your tests running in CI faster.
            </p>

            <h3>Documentation Checklist</h3>
            <p>
              Prepare a concise document that covers all integration requirements. Here is a
              template you can fill out and attach alongside your YAML file:
            </p>
            <CodeBlock code={handoffChecklistCode} language="text" fileName="qa-handoff-checklist.md" />

            <h3>Communication Template</h3>
            <p>
              Here is a sample message you can adapt when sending your pipeline file to the
              DevOps team:
            </p>
            <CodeBlock code={communicationTemplateCode} language="text" fileName="handoff-message.txt" />

            <h3>What to Expect After Handoff</h3>
            <ul>
              <li>
                <strong>Infrastructure Review</strong> &mdash; DevOps may adjust runner types,
                resource limits, or caching strategies based on organizational standards.
              </li>
              <li>
                <strong>Secrets Configuration</strong> &mdash; DevOps will add the required secrets
                to the CI platform. They may use a vault integration instead of platform-native
                secrets.
              </li>
              <li>
                <strong>Integration with Main Pipeline</strong> &mdash; Your test stage will likely
                be incorporated into a larger deployment pipeline rather than running as a
                standalone workflow.
              </li>
              <li>
                <strong>Monitoring and Alerts</strong> &mdash; DevOps may add additional monitoring,
                custom dashboards, or escalation policies for test failures.
              </li>
              <li>
                <strong>Feedback Loop</strong> &mdash; Expect questions about timeout values, retry
                counts, and resource requirements. Be prepared to iterate on the configuration.
              </li>
            </ul>

            <div className="info-box">
              <strong>Pro Tip</strong>
              Establish a regular sync with the DevOps team (even 15 minutes weekly) to discuss
              pipeline performance, flaky test trends, and infrastructure needs. This proactive
              communication prevents pipeline issues from becoming blockers.
            </div>
          </section>

          {/* ========== 8. Integration with Test Reports ========== */}
          <section id="test-reports">
            <span className="section-label section-label--purple">Reporting</span>
            <h2>Integration with Test Reports</h2>

            <p>
              Test reports are the primary way your team consumes test results. In a CI/CD context,
              reports must be generated, stored as artifacts, and made accessible to developers,
              QA leads, and project managers.
            </p>

            <h3>Reporter Configuration for Pipelines</h3>
            <p>
              Configure multiple reporters simultaneously to serve different purposes: terminal
              output for live CI logs, HTML for detailed interactive reports, JUnit XML for CI
              dashboard integration, and JSON for custom tooling:
            </p>
            <CodeBlock code={reportersConfigCode} language="typescript" fileName="playwright.config.ts" />

            <h3>Allure Reporter</h3>
            <p>
              Allure is a popular open-source reporting framework that provides rich, interactive
              reports with trends, categories, and environment information. It integrates with
              all major CI platforms:
            </p>
            <CodeBlock code={allureConfigCode} language="typescript" fileName="playwright.config.ts" />

            <h3>Allure in CI Pipelines</h3>
            <CodeBlock code={allureCICode} language="yaml" fileName="allure-ci-examples.yml" />

            <h3>Where Artifacts Go</h3>
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>CI Platform</th>
                    <th>How to View Reports</th>
                    <th>Retention</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GitHub Actions</td>
                    <td>Download from the Actions tab &gt; Artifacts section</td>
                    <td>Configurable (default 90 days)</td>
                  </tr>
                  <tr>
                    <td>GitLab CI</td>
                    <td>Browse in job artifacts or publish via GitLab Pages</td>
                    <td>Configurable via <code>expire_in</code></td>
                  </tr>
                  <tr>
                    <td>Azure DevOps</td>
                    <td>Download from pipeline run &gt; Published artifacts</td>
                    <td>Follows org retention policy</td>
                  </tr>
                  <tr>
                    <td>Jenkins</td>
                    <td>HTML Publisher Plugin sidebar link on build page</td>
                    <td>Until build is deleted</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tip-box">
              <strong>Tip</strong>
              For the best debugging experience, always enable traces in CI. Configure{' '}
              <code>trace: 'on-first-retry'</code> in your Playwright config. When a test
              fails and retries, the trace captures a complete timeline of DOM snapshots, network
              requests, and console logs that make root cause analysis dramatically faster.
            </div>
          </section>

          {/* ========== 9. Full Pipeline Example ========== */}
          <section id="full-pipeline">
            <span className="section-label section-label--green">Complete Example</span>
            <h2>Full Pipeline Example</h2>

            <p>
              Below is a complete, production-ready GitHub Actions workflow that you can copy and
              adapt for your project. It implements the full pipeline lifecycle: lint, unit tests,
              E2E tests (sharded across browsers), report merging, and Slack notification.
            </p>

            <h3>Features of This Pipeline</h3>
            <ul>
              <li>
                <strong>Multi-trigger</strong> &mdash; Runs on push, PR, manual dispatch (with
                test suite selection), and nightly schedule.
              </li>
              <li>
                <strong>Gated execution</strong> &mdash; E2E tests only run after lint and unit
                tests pass.
              </li>
              <li>
                <strong>Full browser matrix</strong> &mdash; Tests run across Chromium, Firefox,
                and WebKit with 2 shards each (6 parallel jobs).
              </li>
              <li>
                <strong>Dynamic test suite selection</strong> &mdash; Manual triggers let you
                choose between smoke, regression, or all tests.
              </li>
              <li>
                <strong>Report merging</strong> &mdash; All shard reports are merged into a
                single HTML report for easy review.
              </li>
              <li>
                <strong>Slack notification</strong> &mdash; The team receives a structured Slack
                message with pass/fail status, branch info, and a direct link to the pipeline
                run.
              </li>
            </ul>

            <CodeBlock code={fullPipelineCode} language="yaml" fileName=".github/workflows/playwright-full-pipeline.yml" />

            <div className="info-box">
              <strong>Customization Guide</strong>
              To adapt this pipeline for your project: (1) Update the <code>NODE_VERSION</code>{' '}
              and <code>PLAYWRIGHT_VERSION</code> environment variables, (2) Add your required
              secrets in GitHub repository settings, (3) Adjust the <code>shard</code> matrix
              based on your test count (more shards = faster, but more CI minutes), (4) Modify
              the Slack payload to match your team's notification preferences.
            </div>

            <div className="warning-box">
              <strong>Warning</strong>
              This pipeline uses <code>fail-fast: false</code> in the matrix strategy. This
              means all browser/shard combinations run to completion even if one fails. Change
              to <code>fail-fast: true</code> if you want to cancel remaining jobs on the first
              failure (saves CI minutes but provides less complete results).
            </div>
          </section>

          {/* Mark as Complete */}
          {currentUser && (
            <section className="mark-complete-section">
              <button
                className={`mark-complete-btn ${progress?.qaci ? 'mark-complete-btn--done' : ''}`}
                onClick={() => markPageComplete('qaci')}
                disabled={progress?.qaci}
              >
                {progress?.qaci ? (
                  <><FiCheckCircle size={18} /> Completed</>
                ) : (
                  <><FiAward size={18} /> Mark as Complete</>
                )}
              </button>
            </section>
          )}

        </article>

        <aside className="page-sidebar">
          <Navigation sections={sections} />
        </aside>
      </div>
    </div>
  );
}

export default QACI;
