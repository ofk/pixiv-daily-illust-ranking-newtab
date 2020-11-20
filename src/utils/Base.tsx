import React from 'react';
import { ThemeProvider, CssBaseline, Container } from '@material-ui/core';

import { theme } from './theme';

export const Base: React.FC = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Container>
      <>{children}</>
    </Container>
  </ThemeProvider>
);
