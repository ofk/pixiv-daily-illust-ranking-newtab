// to content_script
chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id!, {});
});

const p = document.body.appendChild(document.createElement('p'));

// from content_script
chrome.runtime.onMessage.addListener((message) => {
  // eslint-disable-next-line default-case
  switch (message.action) {
    case `${process.env.PACKAGE_NAME}.setTitle`:
      p.textContent = message.title;
      break;
  }
});
