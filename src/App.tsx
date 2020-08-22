import React, { useRef, useEffect } from 'react';
import './App.css';

import Toolbar from './components/Toolbar';

import Pager from './modules/Pager';
import CanvasContext from './CanvasContext';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvasContext = CanvasContext.getInstance();
    canvasContext.init(canvas.current as HTMLElement);
    const modules = [
      new Pager(6, 10, '#e91e63'),
      new Pager(4, 12, '#1e90ff'),
      new Pager(4, 10, '#ffe577'),
    ];
    modules.forEach((x) => canvasContext.registModule(x));
    const [m1, m2, m3] = modules;
    m1.connect(m2);
    m1.connect(m3);

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        canvasContext.connecting(false);
      }
    });
  }, []);

  return (
    <div ref={canvas} className="App">
      <Toolbar />
    </div>
  );
};

export default App;
