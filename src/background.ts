const DEFAULT_OPTIONS = {
  enabled: true,
  color: 'blue',
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // eslint-disable-next-line default-case
  switch (message.action) {
    case `${process.env.PACKAGE_NAME}.getOptions`:
      {
        const value = localStorage.getItem('options');
        const options = value ? JSON.parse(value) : { ...DEFAULT_OPTIONS };
        sendResponse({ options });
      }
      break;

    case `${process.env.PACKAGE_NAME}.setOptions`:
      localStorage.setItem('options', JSON.stringify(message.options));
      sendResponse({});
      break;
  }

  return true;
});
