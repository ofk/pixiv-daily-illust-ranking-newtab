import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Button } from '@material-ui/core';

import { Base } from './utils/Base';

const App: React.FC = () => {
  return (
    <Base>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            onClick={(): void => {
              chrome.runtime.sendMessage({ action: `${process.env.PACKAGE_NAME}.clearCache` });
            }}
          >
            Clear cache
          </Button>
        </Grid>
      </Grid>
    </Base>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
