// NaniKani Popup Script

document.addEventListener('DOMContentLoaded', () => {
  console.log('NaniKani popup loaded');
  init();
});

async function init() {
  // Initialize popup functionality
  console.log('Initializing NaniKani...');
}

// Example: Save data to Chrome storage
async function saveToStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key]: value }, resolve);
  });
}

// Example: Get data from Chrome storage
async function getFromStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key]);
    });
  });
}

// Example: Send message to background script
function sendMessageToBackground(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response);
    });
  });
}
