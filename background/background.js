// NaniKani Background Service Worker

// Extension installed event
chrome.runtime.onInstalled.addListener((details) => {
  console.log('NaniKani extension installed', details);
  
  if (details.reason === 'install') {
    // First time installation
    console.log('Welcome to NaniKani!');
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('NaniKani has been updated');
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  
  // Handle different message types
  switch (message.type) {
    case 'GET_DATA':
      handleGetData(message, sendResponse);
      return true; // Keep the message channel open for async response
      
    case 'SAVE_DATA':
      handleSaveData(message, sendResponse);
      return true;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
});

// Handle GET_DATA message
async function handleGetData(message, sendResponse) {
  try {
    const result = await chrome.storage.local.get([message.key]);
    sendResponse({ success: true, data: result[message.key] });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle SAVE_DATA message
async function handleSaveData(message, sendResponse) {
  try {
    await chrome.storage.local.set({ [message.key]: message.value });
    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}
