import React, { useRef, useEffect } from 'react';
import './App.scss';

import Toolbar from './components/Toolbar';

import Pager from './modules/Pager';
import SVGContext from './SVGContext';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = SVGContext.getInstance();
    ctx.init(canvas.current as HTMLElement);
    const modules = [new Pager(), new Pager(), new Pager()];
    modules.forEach((x) => ctx.registModule(x));
    const [m1, m2, m3] = modules;
    m1.connect(m2);
    m1.connect(m3);

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        ctx.connecting(false);
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
