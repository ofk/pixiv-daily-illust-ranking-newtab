chrome.runtime.sendMessage({ action: `${process.env.PACKAGE_NAME}.getOptions` }, ({ options }) => {
  {
    const p = document.body.appendChild(document.createElement('p'));
    const label = p.appendChild(document.createElement('label'));
    const input = label.appendChild(document.createElement('input'));
    input.type = 'checkbox';
    input.checked = options.enabled;
    input.addEventListener('change', (event) => {
      chrome.runtime.sendMessage({
        action: `${process.env.PACKAGE_NAME}.setOptions`,
        options: { ...options, enabled: (event.target as HTMLInputElement).checked },
      });
    });
    label.appendChild(document.createTextNode('Enabled'));
  }
  {
    const p = document.body.appendChild(document.createElement('p'));
    const label = p.appendChild(document.createElement('label'));
    label.appendChild(document.createTextNode('Color'));
    const input = label.appendChild(document.createElement('input'));
    input.value = options.color;
    input.addEventListener('change', (event) => {
      chrome.runtime.sendMessage({
        action: `${process.env.PACKAGE_NAME}.setOptions`,
        options: { ...options, color: (event.target as HTMLInputElement).value },
      });
    });
  }
});
