// NaniKani Content Script
// Hides statistics elements on WaniKani lessons and reviews

(function() {
  'use strict';
  
  // Elements to hide
  const HIDDEN_CLASSES = [
    'character-header__menu-statistics',
    'quiz-statistics',
    'quiz-statistics__item'
  ];
  
  // Default settings
  let settings = {
    hideLessons: true,
    hideReviews: true,
    hideExtraStudy: true
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
  
  // Check if we should hide on current route based on settings
  function shouldHide() {
    if (isLessonsRoute() && settings.hideLessons) return true;
    if (isReviewsRoute() && settings.hideReviews) return true;
    if (isExtraStudyRoute() && settings.hideExtraStudy) return true;
    return false;
  }
  
  // Hide elements by class name
  function hideElements() {
    const shouldHideNow = shouldHide();
    console.log('NaniKani: hideElements called', { 
      path: window.location.pathname,
      isLessons: isLessonsRoute(),
      isReviews: isReviewsRoute(),
      isExtraStudy: isExtraStudyRoute(),
      settings,
      shouldHide: shouldHideNow 
    });
    
    HIDDEN_CLASSES.forEach(className => {
      const elements = document.getElementsByClassName(className);
      console.log(`NaniKani: Found ${elements.length} elements with class "${className}"`);
      for (let i = 0; i < elements.length; i++) {
        if (shouldHideNow) {
          elements[i].style.setProperty('display', 'none', 'important');
          elements[i].style.setProperty('visibility', 'hidden', 'important');
        } else {
          elements[i].style.removeProperty('display');
          elements[i].style.removeProperty('visibility');
        }
      }
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
      hideElements();
      sendResponse({ success: true });
    }
  });
  
  // Also listen for storage changes (in case settings are changed from another tab)
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.settings) {
      console.log('NaniKani: Settings changed via storage', changes.settings.newValue);
      settings = { ...settings, ...changes.settings.newValue };
      hideElements();
    }
  });
  
  // Initialize content script
  async function init() {
    console.log('NaniKani: Initializing...');
    
    // Load settings first
    await loadSettings();
    
    // Hide elements immediately
    hideElements();
    
    // Also hide when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', hideElements);
    }
    
    // Use MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      hideElements();
    });
    
    // Start observing when body is available
    const startObserving = () => {
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      } else {
        requestAnimationFrame(startObserving);
      }
    };
    
    startObserving();
    
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
      // Small delay to let the DOM update
      setTimeout(hideElements, 100);
      setTimeout(hideElements, 500);
      setTimeout(hideElements, 1000);
    }
  }
  
  // Run initialization
  init();
})();
