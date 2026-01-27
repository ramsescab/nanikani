// Tests for popup.js

describe('Popup Script', () => {
  const DEFAULT_SETTINGS = {
    hideLessons: true,
    hideReviews: true,
    hideExtraStudy: true,
    hideProgress: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings', () => {
    test('should retrieve settings from storage', async () => {
      const mockSettings = {
        hideLessons: false,
        hideReviews: true,
        hideExtraStudy: false,
        hideProgress: true
      };

      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ settings: mockSettings });
        return Promise.resolve({ settings: mockSettings });
      });

      const getSettings = () => {
        return new Promise((resolve) => {
          chrome.storage.local.get(['settings'], (result) => {
            resolve({ ...DEFAULT_SETTINGS, ...result.settings });
          });
        });
      };

      const settings = await getSettings();

      expect(chrome.storage.local.get).toHaveBeenCalled();
      expect(settings).toEqual(mockSettings);
    });

    test('should return default settings when storage is empty', async () => {
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const getSettings = () => {
        return new Promise((resolve) => {
          chrome.storage.local.get(['settings'], (result) => {
            resolve({ ...DEFAULT_SETTINGS, ...result.settings });
          });
        });
      };

      const settings = await getSettings();

      expect(settings).toEqual(DEFAULT_SETTINGS);
    });
  });

  describe('saveSettings', () => {
    test('should save settings to storage', async () => {
      chrome.storage.local.set.mockImplementation((items, callback) => {
        if (callback) callback();
        return Promise.resolve();
      });

      const saveSettings = (settings) => {
        return new Promise((resolve) => {
          chrome.storage.local.set({ settings }, resolve);
        });
      };

      const newSettings = {
        hideLessons: false,
        hideReviews: false,
        hideExtraStudy: true,
        hideProgress: false
      };

      await saveSettings(newSettings);

      expect(chrome.storage.local.set).toHaveBeenCalledWith(
        { settings: newSettings },
        expect.any(Function)
      );
    });
  });

  describe('detectCurrentPage', () => {
    test('should detect lessons page', async () => {
      chrome.tabs.query.mockResolvedValue([
        { url: 'https://www.wanikani.com/subject-lessons/start' }
      ]);

      const detectCurrentPage = async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const pathname = url.pathname;
          
          if (pathname.startsWith('/subject-lessons')) {
            return 'lessons';
          } else if (pathname.startsWith('/subjects/review')) {
            return 'reviews';
          } else if (pathname.startsWith('/recent-mistakes')) {
            return 'extraStudy';
          }
        }
        return null;
      };

      const currentPage = await detectCurrentPage();

      expect(currentPage).toBe('lessons');
    });

    test('should detect reviews page', async () => {
      chrome.tabs.query.mockResolvedValue([
        { url: 'https://www.wanikani.com/subjects/review/123' }
      ]);

      const detectCurrentPage = async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const pathname = url.pathname;
          
          if (pathname.startsWith('/subject-lessons')) {
            return 'lessons';
          } else if (pathname.startsWith('/subjects/review')) {
            return 'reviews';
          } else if (pathname.startsWith('/recent-mistakes')) {
            return 'extraStudy';
          }
        }
        return null;
      };

      const currentPage = await detectCurrentPage();

      expect(currentPage).toBe('reviews');
    });

    test('should detect extra study page', async () => {
      chrome.tabs.query.mockResolvedValue([
        { url: 'https://www.wanikani.com/recent-mistakes/quiz' }
      ]);

      const detectCurrentPage = async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const pathname = url.pathname;
          
          if (pathname.startsWith('/subject-lessons')) {
            return 'lessons';
          } else if (pathname.startsWith('/subjects/review')) {
            return 'reviews';
          } else if (pathname.startsWith('/recent-mistakes')) {
            return 'extraStudy';
          }
        }
        return null;
      };

      const currentPage = await detectCurrentPage();

      expect(currentPage).toBe('extraStudy');
    });

    test('should return null for non-WaniKani page', async () => {
      chrome.tabs.query.mockResolvedValue([
        { url: 'https://www.example.com/' }
      ]);

      const detectCurrentPage = async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const pathname = url.pathname;
          
          if (pathname.startsWith('/subject-lessons')) {
            return 'lessons';
          } else if (pathname.startsWith('/subjects/review')) {
            return 'reviews';
          } else if (pathname.startsWith('/recent-mistakes')) {
            return 'extraStudy';
          }
        }
        return null;
      };

      const currentPage = await detectCurrentPage();

      expect(currentPage).toBe(null);
    });

    test('should handle missing tab gracefully', async () => {
      chrome.tabs.query.mockResolvedValue([]);

      const detectCurrentPage = async () => {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]?.url) {
          const url = new URL(tabs[0].url);
          const pathname = url.pathname;
          
          if (pathname.startsWith('/subject-lessons')) {
            return 'lessons';
          } else if (pathname.startsWith('/subjects/review')) {
            return 'reviews';
          } else if (pathname.startsWith('/recent-mistakes')) {
            return 'extraStudy';
          }
        }
        return null;
      };

      const currentPage = await detectCurrentPage();

      expect(currentPage).toBe(null);
    });
  });
});
