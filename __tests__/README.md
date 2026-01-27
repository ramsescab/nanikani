# NaniKani Tests

This directory contains unit tests for the NaniKani Chrome extension.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

- `__tests__/setup.js` - Test setup and Chrome API mocks
- `__tests__/background.test.js` - Tests for background service worker
- `__tests__/content.test.js` - Tests for content script functionality
- `__tests__/popup.test.js` - Tests for popup UI functionality

## Test Coverage

The tests cover:

### Background Script
- Message handling (GET_DATA, SAVE_DATA)
- Chrome storage operations
- Error handling

### Content Script
- Route detection (lessons, reviews, extra study)
- Settings management
- CSS class application based on routes and settings

### Popup Script
- Settings retrieval and storage
- Current page detection
- Settings persistence

## Framework

Tests are written using:
- **Jest** - Testing framework
- **jsdom** - DOM environment for testing
- Chrome API mocks for extension-specific functionality
