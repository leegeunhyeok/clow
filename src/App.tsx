import React, { useRef, useEffect } from 'react';
import './App.scss';
import Context from 'src/core/context';
import Toolbar from 'src/components/Toolbar';
import keyboard, { KeyCode } from 'src/services/KeyboardService';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = Context.getInstance();
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
