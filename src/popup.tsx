import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { Base } from './utils/Base';

const App: React.FC = () => {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    // to content_script
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id!, {});
    });

    // from content_script
    chrome.runtime.onMessage.addListener((message) => {
      // eslint-disable-next-line default-case
      switch (message.action) {
        case `${process.env.PACKAGE_NAME}.setTitle`:
          setTitle(message.title);
          break;
      }
    });
  }, []);

  return <Base>{title ? <p>{title}</p> : null}</Base>;
};

ReactDOM.render(<App />, document.querySelector('#app'));
