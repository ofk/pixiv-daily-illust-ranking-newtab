import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import type { Artwork } from './utils/types';

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: `${process.env.PACKAGE_NAME}.getArtworks`,
      },
      (message) => {
        setArtworks(message.artworks);
      }
    );
  }, []);

  return artworks.length ? <pre>{JSON.stringify(artworks, null, '  ')}</pre> : null;
};

ReactDOM.render(<App />, document.querySelector('#app'));
