chrome.runtime.sendMessage({ action: `${process.env.PACKAGE_NAME}.getOptions` }, ({ options }) => {
  if (options.enabled) {
    document.body.style.color = options.color;
  }
});

// from popup
chrome.runtime.onMessage.addListener(() => {
  chrome.runtime.sendMessage({
    action: `${process.env.PACKAGE_NAME}.setTitle`,
    title: document.title,
  });
});
