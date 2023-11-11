// NightModeContext.js
import React from 'react';

const NightModeContext = React.createContext({
  isNightMode: false,
  toggleNightMode: () => {},
});

export default NightModeContext;