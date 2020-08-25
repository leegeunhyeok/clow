import React, { useRef, useEffect } from 'react';
import './App.scss';
import Toolbar from './components/Toolbar';
import ClowContext from './ClowContext';

import keyboard, { KeyCode } from './services/KeyboardService';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = ClowContext.getInstance();
    ctx.init(canvas.current as HTMLElement);
    const subscription = keyboard.on(KeyCode.Escape).subscribe(() => ctx.connecting(false));
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div ref={canvas} className="App">
      <Toolbar />
    </div>
  );
};

export default App;
