import React, { useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './App.scss';
import Context, { ClowEvent } from 'src/core/context';
import Popup from 'src/components/Popup';
import Toolbar from 'src/components/Toolbar';
import keyboard, { KeyCode } from 'src/services/KeyboardService';
import { usePopup } from 'src/hooks/usePopup';
import { TIMEOUT } from 'src/providers/popup';

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);
  const { show, message, open, close } = usePopup();

  useEffect(() => {
    const ctx = Context.getInstance();
    ctx.init(canvas.current as HTMLElement);
    ctx.on(ClowEvent.NOT_CONNECTABLE, () => {
      open('Already!');
    });
    const subscription = keyboard.on(KeyCode.Escape).subscribe(() => ctx.connecting(false));
    return () => subscription.unsubscribe();
  }, [open]);

  return (
    <div ref={canvas} className="App">
      <CSSTransition in={show} classNames="popup" timeout={TIMEOUT} unmountOnExit appear>
        <Popup message={message} onClose={() => close()} />
      </CSSTransition>
      <Toolbar />
    </div>
  );
};

export default App;
