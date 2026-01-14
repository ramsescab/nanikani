# NaniKani

A Google Chrome Extension.

## Project Structure

```
nanikani/
├── manifest.json          # Extension configuration
├── background/
│   └── background.js      # Background service worker
├── content/
│   ├── content.js         # Content script (runs on web pages)
│   └── content.css        # Content styles
├── popup/
│   ├── popup.html         # Popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── icons/
│   ├── icon16.png         # 16x16 icon
│   ├── icon32.png         # 32x32 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md
```

## Installation

### Development Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `nanikani` folder
5. The extension should now appear in your extensions list

### Adding Icons

Before loading the extension, add your icon files to the `icons/` folder:
- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Development

### Manifest V3

This extension uses Manifest V3, the latest version of Chrome's extension platform.

### Key Files

- **manifest.json**: Defines the extension's metadata, permissions, and structure
- **background.js**: Service worker that handles background tasks and messaging
- **content.js/css**: Scripts and styles injected into web pages
- **popup.html/js/css**: The popup UI shown when clicking the extension icon

### Permissions

Current permissions:
- `storage`: For storing extension data
- `activeTab`: For accessing the current tab

### Debugging

1. Open `chrome://extensions/`
2. Find NaniKani and click "Inspect views: service worker" to debug background script
3. Right-click the extension icon and select "Inspect popup" to debug popup
4. Use browser DevTools on any page to debug content scripts

## License

MIT License
