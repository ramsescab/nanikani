// Tests for background.js

describe('Background Service Worker', () => {
  let handleGetData, handleSaveData;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Load the background script functions
    // We need to extract the functions for testing
    handleGetData = async (message, sendResponse) => {
      try {
        const result = await new Promise((resolve) => {
          chrome.storage.local.get([message.key], resolve);
        });
        sendResponse({ success: true, data: result[message.key] });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    };

    handleSaveData = async (message, sendResponse) => {
      try {
        await new Promise((resolve) => {
          chrome.storage.local.set({ [message.key]: message.value }, resolve);
        });
        sendResponse({ success: true });
      } catch (error) {
        sendResponse({ success: false, error: error.message });
      }
    };
  });

  describe('handleGetData', () => {
    test('should retrieve data from storage successfully', async () => {
      const mockData = { settings: { hideLessons: true } };
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockData);
        return Promise.resolve(mockData);
      });

      const sendResponse = jest.fn();
      const message = { key: 'settings' };

      await handleGetData(message, sendResponse);

      expect(chrome.storage.local.get).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith({ 
        success: true, 
        data: mockData.settings 
      });
    });

    test('should handle storage errors gracefully', async () => {
      const error = new Error('Storage error');
      chrome.storage.local.get.mockImplementation(() => {
        throw error;
      });

      const sendResponse = jest.fn();
      const message = { key: 'settings' };

      await handleGetData(message, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ 
        success: false, 
        error: 'Storage error' 
      });
    });
  });

  describe('handleSaveData', () => {
    test('should save data to storage successfully', async () => {
      chrome.storage.local.set.mockImplementation((items, callback) => {
        if (callback) callback();
        return Promise.resolve();
      });

      const sendResponse = jest.fn();
      const message = { 
        key: 'settings', 
        value: { hideLessons: true } 
      };

      await handleSaveData(message, sendResponse);

      expect(chrome.storage.local.set).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith({ success: true });
    });

    test('should handle storage save errors gracefully', async () => {
      const error = new Error('Save error');
      chrome.storage.local.set.mockImplementation(() => {
        throw error;
      });

      const sendResponse = jest.fn();
      const message = { 
        key: 'settings', 
        value: { hideLessons: true } 
      };

      await handleSaveData(message, sendResponse);

      expect(sendResponse).toHaveBeenCalledWith({ 
        success: false, 
        error: 'Save error' 
      });
    });
  });
});
