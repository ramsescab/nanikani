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
  
  // Routes where we should hide elements
  const TARGET_ROUTES = [
    '/subject-lessons',
    '/recent-mistakes'
  ];
  
  // Check if current URL matches target routes
  function isTargetRoute() {
    const path = window.location.pathname;
    return TARGET_ROUTES.some(route => path.startsWith(route));
  }
  
  // Hide elements by class name
  function hideElements() {
    if (!isTargetRoute()) return;
    
    HIDDEN_CLASSES.forEach(className => {
      const elements = document.getElementsByClassName(className);
      for (let i = 0; i < elements.length; i++) {
        elements[i].style.display = 'none';
        elements[i].style.visibility = 'hidden';
      }
    });
  }
  
  // Initialize content script
  function init() {
    console.log('NaniKani: Initializing...');
    
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
