import React from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { CssBaseline, GeistProvider } from '@geist-ui/core';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <GeistProvider>
    <CssBaseline />
    <App />
  </GeistProvider>
);
