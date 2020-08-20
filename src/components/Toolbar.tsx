import React, { useState } from 'react';
import './Toolbar.css';
import CanvasContext from '../CanvasContext';
import Pager from '../modules/Pager';

const Toolbar = () => {
  const canvasContext = CanvasContext.getInstance();
  const [connecting, setConnectingState] = useState(false);
  const [moving, setMovingState] = useState(false);
  canvasContext.on('connectingstatechange', setConnectingState);
  canvasContext.on('movingstatechange', setMovingState);

  const createModule = () => {
    const x = Math.floor(Math.random() * 500);
    const y = Math.floor(Math.random() * 500);
    canvasContext.registModule(new Pager(2, 3, '#aaaaaa'));
  };

  const toggleConnection = () => canvasContext.connecting(!connecting);
  const toggleMoving = () => canvasContext.moving(!connecting);

  return (
    <div className="Toolbar">
      <button onClick={() => createModule()}>Add module</button>
      <button onClick={() => toggleMoving()}>{moving ? 'Done' : 'Move'}</button>
      <button onClick={() => toggleConnection()}>{connecting ? 'Done' : 'Connect'}</button>
    </div>
  );
};

export default Toolbar;
