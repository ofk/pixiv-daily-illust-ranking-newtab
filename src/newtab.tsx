import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline, makeStyles } from '@material-ui/core';

import type { Artwork } from './utils/types';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    '&:hover': {
      '& $aside': {
        opacity: 1,
      },
    },
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backdropFilter: 'blur(5px)',
  },
  aside: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    padding: '20px',
    color: '#b8b8b8',
    backgroundImage:
      'linear-gradient(to bottom,rgba(0,0,0,0) 0%,rgba(0,0,0,0.33) 33%,rgba(0,0,0,0.66) 100%)',
    opacity: 0,
    transition: 'opacity .2s ease-out',
  },
  artwork: {
    fontSize: '24px',
    color: '#fff',
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  artist: {
    '& a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
});

const Frame: React.FC<{ artwork: Artwork }> = ({ artwork }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ backgroundImage: `url(${artwork.imageUrl})` }}>
      <div className={classes.image} style={{ backgroundImage: `url(${artwork.imageUrl})` }} />
      <div className={classes.aside}>
        <div className={classes.artwork}>
          <a href={artwork.url}>{artwork.title}</a>
        </div>
        <div className={classes.artist}>
          <a href={artwork.userUrl}>{artwork.userName}</a>
        </div>
      </div>
    </div>
  );
};

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

  return (
    <>
      <CssBaseline />
      {artworks.length ? (
        <Frame artwork={artworks[Math.floor(Math.random() * artworks.length)]} />
      ) : null}
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
