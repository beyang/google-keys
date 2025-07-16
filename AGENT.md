# Agent Configuration

## Build/Test Commands
- No build system or test framework present
- This is a vanilla JavaScript Chrome extension
- To test: Load unpacked extension in Chrome extensions page
- **IMPORTANT:** Use `jj` instead of `git` for VCS operations. Do NOT use `git` in this repo.

## Architecture
- **Type**: Chrome extension (manifest v3)
- **Entry point**: `background.js` (service worker)
- **Content scripts**: 
  - `globalkeys.js`: Global keyboard shortcuts (Ctrl+v scrolling)
  - `searchkeys.js`: Google Search keyboard navigation (Tab/arrows/Enter)
  - `gmail.js`: Gmail shortcuts (auto-opens GitHub/Sourcegraph links)
  - `slack.js`: Slack redirect to messages

## Code Style
- **Format**: Vanilla JavaScript, no build tools
- **Style**: IIFEs for scoping, camelCase variables
- **DOM queries**: Use `document.querySelector/querySelectorAll`
- **Event handling**: `addEventListener` with explicit handlers
- **Chrome APIs**: Use `chrome.tabs`, `chrome.runtime` for extension features
- **Error handling**: `console.log/error` for debugging
- **Selectors**: CSS selectors stored in arrays for flexibility
