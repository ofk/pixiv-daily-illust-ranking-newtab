import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Grid, FormControlLabel, Checkbox, TextField } from '@material-ui/core';

import { Base } from './utils/Base';

const App: React.FC = () => {
  const [options, setOptions] = useState<{ enabled: boolean; color: string } | null>(null);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: `${process.env.PACKAGE_NAME}.getOptions` }, (message) => {
      setOptions(message.options);
    });
  }, []);

  const updateOptions = (nextOptions: { enabled: boolean; color: string }): void => {
    setOptions(nextOptions);
    chrome.runtime.sendMessage({
      action: `${process.env.PACKAGE_NAME}.setOptions`,
      options: nextOptions,
    });
  };

  return (
    <Base>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {options ? (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={options.enabled}
                    onChange={(event): void => {
                      updateOptions({ ...options, enabled: event.target.checked });
                    }}
                    name="enabled"
                    color="primary"
                  />
                }
                label="Enabled"
              />
              <TextField
                id="color"
                name="color"
                label="Color"
                fullWidth
                margin="dense"
                size="small"
                value={options.color}
                onChange={(event): void => {
                  updateOptions({ ...options, color: event.target.value });
                }}
              />
            </>
          ) : null}
        </Grid>
      </Grid>
    </Base>
  );
};

ReactDOM.render(<App />, document.querySelector('#app'));
