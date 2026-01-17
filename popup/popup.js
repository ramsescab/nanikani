// NaniKani Popup Script

const DEFAULT_SETTINGS = {
  hideLessons: true,
  hideReviews: true,
  hideExtraStudy: true,
  hideProgress: true
};

document.addEventListener('DOMContentLoaded', () => {
  init();
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
    chrome.tabs.sendMessage(tabs[0].id, { type: 'SETTINGS_CHANGED', settings });
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
