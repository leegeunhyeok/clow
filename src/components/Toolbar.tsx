import React, { useState } from 'react';
import './Toolbar.css';
import CanvasContext from '../CanvasContext';
import Pager from '../modules/Pager';

const Toolbar = () => {
  const canvasContext = CanvasContext.getInstance();
  const [connecting, setConnectingState] = useState(false);
  canvasContext.on('connectingstatechange', setConnectingState);

  const createModule = () => {
    canvasContext.registModule(new Pager(2, 3, '#aaaaaa'));
  };

  const toggleConnection = () => canvasContext.connecting(!connecting);

  return (
    <div className="Toolbar">
      <button onClick={() => createModule()}>Add module</button>
      <button onClick={() => toggleConnection()}>{connecting ? 'Done' : 'Connect'}</button>
    </div>
  );
};

export default Toolbar;
