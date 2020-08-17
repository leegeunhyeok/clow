import React, { useState } from 'react';
import './Toolbar.css';
import CanvasContext from '../CanvasContext';
import Pager from '../modules/Pager';

const App = () => {
  const canvasContext = CanvasContext.getInstance();
  const [connecting, setConnectingState] = useState(false);
  canvasContext.on('connectingstatechange', setConnectingState);

  const createModule = () => {
    const x = Math.floor(Math.random() * 500);
    const y = Math.floor(Math.random() * 500);
    canvasContext.registModule(new Pager(x, y, '#aaaaaa'));
  };

  const toggleConnection = () => canvasContext.connecting(!connecting);

  return (
    <div className="Toolbar">
      <button onClick={() => createModule()}>Add module</button>
      <button onClick={() => toggleConnection()}>{connecting ? 'Done' : 'Connect'}</button>
    </div>
  );
};

export default App;
