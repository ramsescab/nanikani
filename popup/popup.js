// NaniKani Popup Script

const DEFAULT_SETTINGS = {
  hideLessons: true,
  hideReviews: true,
  hideExtraStudy: true,
  hideProgress: true
};

const CALLOUT_DISMISSED_KEY = 'refreshCalloutDismissed';

document.addEventListener('DOMContentLoaded', () => {
  init();
  initCallout();
});

async function init() {
  // Load saved settings
  const settings = await getSettings();
  
  // Set checkbox states
  document.getElementById('hideLessons').checked = settings.hideLessons;
  document.getElementById('hideReviews').checked = settings.hideReviews;
  document.getElementById('hideExtraStudy').checked = settings.hideExtraStudy;
  document.getElementById('hideProgress').checked = settings.hideProgress;
  
  // Add event listeners
  document.getElementById('hideLessons').addEventListener('change', onSettingChange);
  document.getElementById('hideReviews').addEventListener('change', onSettingChange);
  document.getElementById('hideExtraStudy').addEventListener('change', onSettingChange);
  document.getElementById('hideProgress').addEventListener('change', onSettingChange);
  
  // Check current page and show "Current" tag
  await detectCurrentPage();
}

async function detectCurrentPage() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]?.url) {
      const url = new URL(tabs[0].url);
      const pathname = url.pathname;
      
      if (pathname.startsWith('/subject-lessons')) {
        document.getElementById('currentLessons').classList.add('visible');
      } else if (pathname.startsWith('/subjects/review')) {
        document.getElementById('currentReviews').classList.add('visible');
      } else if (pathname.startsWith('/recent-mistakes')) {
        document.getElementById('currentExtraStudy').classList.add('visible');
      }
    }
  } catch (error) {
    // Unable to detect current page
  }
}

async function onSettingChange() {
  const settings = {
    hideLessons: document.getElementById('hideLessons').checked,
    hideReviews: document.getElementById('hideReviews').checked,
    hideExtraStudy: document.getElementById('hideExtraStudy').checked,
    hideProgress: document.getElementById('hideProgress').checked
  };
  
  await saveSettings(settings);
  
  // Notify content script of settings change
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.id) {
    try {
      await chrome.tabs.sendMessage(tabs[0].id, { type: 'SETTINGS_CHANGED', settings });
    } catch (error) {
      // Content script not loaded on this tab (not a WaniKani page)
    }
  }
}

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['settings'], (result) => {
      // Merge with defaults to handle missing keys from older versions
      resolve({ ...DEFAULT_SETTINGS, ...result.settings });
    });
  });
}

async function saveSettings(settings) {
  return new Promise((resolve) => {
    chrome.storage.local.set({ settings }, resolve);
  });
}

async function initCallout() {
  const callout = document.getElementById('refreshCallout');
  const dismissBtn = document.getElementById('dismissCallout');
  
  // Check if callout was previously dismissed
  const result = await chrome.storage.local.get([CALLOUT_DISMISSED_KEY]);
  if (result[CALLOUT_DISMISSED_KEY]) {
    callout.classList.add('hidden');
  }
  
  // Add dismiss handler
  dismissBtn.addEventListener('click', async () => {
    callout.classList.add('hidden');
    await chrome.storage.local.set({ [CALLOUT_DISMISSED_KEY]: true });
  });
}
