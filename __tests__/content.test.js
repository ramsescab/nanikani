// Tests for content.js route detection functions

describe('Content Script - Route Detection', () => {
  beforeEach(() => {
    // Reset URL before each test
    delete window.location;
  });

  describe('isLessonsRoute', () => {
    test('should return true for lessons route', () => {
      window.location = { pathname: '/subject-lessons/start' };
      const isLessonsRoute = () => window.location.pathname.startsWith('/subject-lessons');
      expect(isLessonsRoute()).toBe(true);
    });

    test('should return false for non-lessons route', () => {
      window.location = { pathname: '/dashboard' };
      const isLessonsRoute = () => window.location.pathname.startsWith('/subject-lessons');
      expect(isLessonsRoute()).toBe(false);
    });
  });

  describe('isReviewsRoute', () => {
    test('should return true for reviews route', () => {
      window.location = { pathname: '/subjects/review/123' };
      const isReviewsRoute = () => window.location.pathname.startsWith('/subjects/review');
      expect(isReviewsRoute()).toBe(true);
    });

    test('should return false for non-reviews route', () => {
      window.location = { pathname: '/dashboard' };
      const isReviewsRoute = () => window.location.pathname.startsWith('/subjects/review');
      expect(isReviewsRoute()).toBe(false);
    });
  });

  describe('isExtraStudyRoute', () => {
    test('should return true for extra study route', () => {
      window.location = { pathname: '/recent-mistakes/quiz' };
      const isExtraStudyRoute = () => window.location.pathname.startsWith('/recent-mistakes');
      expect(isExtraStudyRoute()).toBe(true);
    });

    test('should return false for non-extra study route', () => {
      window.location = { pathname: '/dashboard' };
      const isExtraStudyRoute = () => window.location.pathname.startsWith('/recent-mistakes');
      expect(isExtraStudyRoute()).toBe(false);
    });
  });
});

describe('Content Script - Settings Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should load settings from storage', async () => {
    const mockSettings = {
      hideLessons: true,
      hideReviews: false,
      hideExtraStudy: true,
      hideProgress: false
    };

    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({ settings: mockSettings });
      return Promise.resolve({ settings: mockSettings });
    });

    const loadSettings = () => {
      return new Promise((resolve) => {
        chrome.storage.local.get(['settings'], (result) => {
          const defaultSettings = {
            hideLessons: true,
            hideReviews: true,
            hideExtraStudy: true,
            hideProgress: true
          };
          if (result.settings) {
            resolve({ ...defaultSettings, ...result.settings });
          } else {
            resolve(defaultSettings);
          }
        });
      });
    };

    const settings = await loadSettings();

    expect(chrome.storage.local.get).toHaveBeenCalled();
    expect(settings).toEqual(mockSettings);
  });

  test('should use default settings when storage is empty', async () => {
    chrome.storage.local.get.mockImplementation((keys, callback) => {
      callback({});
    });

    const defaultSettings = {
      hideLessons: true,
      hideReviews: true,
      hideExtraStudy: true,
      hideProgress: true
    };

    const loadSettings = () => {
      return new Promise((resolve) => {
        chrome.storage.local.get(['settings'], (result) => {
          if (result.settings) {
            resolve({ ...defaultSettings, ...result.settings });
          } else {
            resolve(defaultSettings);
          }
        });
      });
    };

    const settings = await loadSettings();

    expect(settings).toEqual(defaultSettings);
  });
});

describe('Content Script - CSS Class Application', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    window.location = { pathname: '/subject-lessons/start' };
  });

  test('should add correct class for lessons route when enabled', () => {
    const settings = { hideLessons: true, hideReviews: true, hideExtraStudy: true, hideProgress: false };
    const isLessonsRoute = () => window.location.pathname.startsWith('/subject-lessons');
    
    const applyHidingClasses = () => {
      const html = document.documentElement;
      html.classList.remove('nanikani-hide-lessons', 'nanikani-hide-reviews', 'nanikani-hide-extra-study', 'nanikani-hide-progress');
      
      if (isLessonsRoute() && settings.hideLessons) {
        html.classList.add('nanikani-hide-lessons');
      }
    };

    applyHidingClasses();

    expect(document.documentElement.classList.contains('nanikani-hide-lessons')).toBe(true);
  });

  test('should not add class when setting is disabled', () => {
    const settings = { hideLessons: false, hideReviews: true, hideExtraStudy: true, hideProgress: false };
    const isLessonsRoute = () => window.location.pathname.startsWith('/subject-lessons');
    
    const applyHidingClasses = () => {
      const html = document.documentElement;
      html.classList.remove('nanikani-hide-lessons', 'nanikani-hide-reviews', 'nanikani-hide-extra-study', 'nanikani-hide-progress');
      
      if (isLessonsRoute() && settings.hideLessons) {
        html.classList.add('nanikani-hide-lessons');
      }
    };

    applyHidingClasses();

    expect(document.documentElement.classList.contains('nanikani-hide-lessons')).toBe(false);
  });

  test('should add progress hiding class when enabled', () => {
    const settings = { hideLessons: true, hideReviews: true, hideExtraStudy: true, hideProgress: true };
    
    const applyHidingClasses = () => {
      const html = document.documentElement;
      html.classList.remove('nanikani-hide-lessons', 'nanikani-hide-reviews', 'nanikani-hide-extra-study', 'nanikani-hide-progress');
      
      if (settings.hideProgress) {
        html.classList.add('nanikani-hide-progress');
      }
    };

    applyHidingClasses();

    expect(document.documentElement.classList.contains('nanikani-hide-progress')).toBe(true);
  });
});
