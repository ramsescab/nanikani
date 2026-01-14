// NaniKani Content Script
// This script runs on web pages

(function() {
  'use strict';
  
  console.log('NaniKani content script loaded');
  
  // Initialize content script
  function init() {
    // Add your content script logic here
  }
  
  // Send message to background script
  function sendMessageToBackground(message) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }
  
  // Listen for messages from popup or background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Content script received message:', message);
    
    switch (message.type) {
      case 'PING':
        sendResponse({ success: true, message: 'pong' });
        break;
        
      default:
        sendResponse({ success: false, error: 'Unknown message type' });
    }
  });
  
  // Run initialization
  init();
})();
