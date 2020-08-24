import React, { useRef, useEffect } from 'react';
import './App.scss';
import NotificationContainer from './containers/NotificationContainer';
import Toolbar from './components/Toolbar';
import SVGContext from './SVGContext';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = SVGContext.getInstance();
    ctx.init(canvas.current as HTMLElement);
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        ctx.connecting(false);
      }
    });
  }, []);

  return (
    <div ref={canvas} className="App">
      <NotificationContainer />
      <Toolbar />
    </div>
  );
};

export default App;
