import React, { useRef, useEffect } from 'react';
import '@svgdotjs/svg.draggable.js';
import './App.css';

import Pager from './modules/Pager';
import CanvasContext from './CanvasContext';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasContext = CanvasContext.getInstance();
    canvasContext.init(canvas.current as HTMLElement);
    const modules = [
      new Pager(350, 200, '#e91e63'),
      new Pager(100, 250, '#1e90ff'),
      new Pager(250, 50, '#ffe577'),
    ];
    const [m1, m2, m3] = modules;
    m1.connect(m2);
    m1.connect(m3);
  }, []);

  return <div ref={canvas} className="App"></div>;
};

export default App;
