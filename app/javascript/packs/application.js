import React from 'react';
import { createRoot } from 'react-dom/client';
import PoolsIndex from '../components/PoolsIndex';
import PoolShow from '../components/PoolShow';

document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('react-root');
  if (rootElement) {
    const props = JSON.parse(rootElement.getAttribute('data-props'));
    console.log("Props passed to React component:", props);
    const root = createRoot(rootElement);
    const path = window.location.pathname;

    if (path.match(/^\/pools\/\d+$/)) {
      root.render(<PoolShow {...props} />);
    } else {
      root.render(<PoolsIndex {...props} />);
    }
  }
});
