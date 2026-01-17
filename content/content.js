// NaniKani Content Script
// Hides statistics elements on WaniKani lessons and reviews

(function() {
  'use strict';
  
  // Default settings
  let settings = {
    hideLessons: true,
    hideReviews: true,
    hideExtraStudy: true,
    hideProgress: true
  };
  
  // Check if current URL matches lessons route
  function isLessonsRoute() {
    return window.location.pathname.startsWith('/subject-lessons');
  }
  
  // Check if current URL matches reviews route
  function isReviewsRoute() {
    return window.location.pathname.startsWith('/subjects/review');
  }
  
  // Check if current URL matches extra study route
  function isExtraStudyRoute() {
    return window.location.pathname.startsWith('/recent-mistakes');
  }
  
  // Apply CSS classes to html element based on current route and settings
  function applyHidingClasses() {
    const html = document.documentElement;
    
    // Remove all nanikani classes first
    html.classList.remove('nanikani-hide-lessons', 'nanikani-hide-reviews', 'nanikani-hide-extra-study', 'nanikani-hide-progress');
    
    // Add appropriate class based on current route and settings
    if (isLessonsRoute() && settings.hideLessons) {
      html.classList.add('nanikani-hide-lessons');
    }
    if (isReviewsRoute() && settings.hideReviews) {
      html.classList.add('nanikani-hide-reviews');
    }
    if (isExtraStudyRoute() && settings.hideExtraStudy) {
      html.classList.add('nanikani-hide-extra-study');
    }
    if (settings.hideProgress) {
      html.classList.add('nanikani-hide-progress');
    }
    
    console.log('NaniKani: Classes applied', {
      path: window.location.pathname,
      classes: html.className,
      settings
    });
  }
  
  // Load settings from storage
  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.local.get(['settings'], (result) => {
        if (result.settings) {
          // Merge with defaults to handle missing keys from older versions
          settings = { ...settings, ...result.settings };
        }
        console.log('NaniKani: Settings loaded', settings);
        resolve(settings);
      });
    });
  }
  
  // Listen for settings changes from popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SETTINGS_CHANGED') {
      console.log('NaniKani: Settings changed via message', message.settings);
      settings = message.settings;
      applyHidingClasses();
      sendResponse({ success: true });
    }
  });
  
  // Also listen for storage changes (in case settings are changed from another tab)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.settings) {
      console.log('NaniKani: Settings changed via storage', changes.settings.newValue);
      settings = { ...settings, ...changes.settings.newValue };
      applyHidingClasses();
    }
  });
  
  // Initialize content script
  async function init() {
    console.log('NaniKani: Initializing...');
    
    // Apply classes immediately (before settings load, using defaults)
    applyHidingClasses();
    
    // Load settings
    await loadSettings();
    
    // Re-apply with loaded settings
    applyHidingClasses();
    
    // Listen for SPA navigation (History API changes)
    let lastUrl = location.href;
    
    // Override pushState and replaceState to detect navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(this, args);
      onUrlChange();
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      onUrlChange();
    };
    
    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', onUrlChange);
    
    // Also poll for URL changes as a fallback
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        onUrlChange();
      }
    }, 500);
    
    function onUrlChange() {
      lastUrl = location.href;
      console.log('NaniKani: URL changed to', location.pathname);
      // Apply classes immediately on URL change
      applyHidingClasses();
    }
  }
  
  // Run initialization
  init();
})();
