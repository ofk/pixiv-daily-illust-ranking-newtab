import { storage } from './utils/storage';

const DEFAULT_OPTIONS = {
  enabled: true,
  color: 'blue',
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // eslint-disable-next-line default-case
  switch (message.action) {
    case `${process.env.PACKAGE_NAME}.getOptions`:
      sendResponse({ options: storage.get('options') || { ...DEFAULT_OPTIONS } });
      break;

    case `${process.env.PACKAGE_NAME}.setOptions`:
      storage.set('options', message.options);
      sendResponse({});
      break;
  }

  return true;
});
