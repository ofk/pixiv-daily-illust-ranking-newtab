import { storage } from './utils/storage';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // eslint-disable-next-line default-case
  switch (message.action) {
    case `${process.env.PACKAGE_NAME}.clearCache`:
      storage.clear('artworks');
      sendResponse({});
      break;
  }

  return true;
});
