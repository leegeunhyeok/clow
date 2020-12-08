import React, { useRef, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Transition } from 'react-transition-group';
import Context, { ClowEventType } from 'src/core/context';
import Popup from 'src/components/Popup';
import Toolbar from 'src/components/Toolbar';
import keyboard, { KeyCode } from 'src/services/KeyboardService';
import { usePopup } from 'src/hooks/usePopup';
import { TIMEOUT } from 'src/providers/popup';
import { getMessageFromEvent } from 'src/messages';
import { socket } from './core/socket';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'NanumSquareRound';
    src: local('NanumSquareRound'), url('./assets/fonts/NanumSquareRoundR.ttf');
  }
  @font-face {
    font-family: 'NanumSquareRound';
    src: local('NanumSquareRound'), url('./assets/fonts/NanumSquareRoundB.ttf');
    font-weight: bold;
  }

  html,
  body {
    padding: 0;
    margin: 0;
  }

  body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    box-sizing: border-box;
    font-family: 'NanumSquareRound', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }

  line.dash {
    animation: dash 2s linear infinite;
  }

  @keyframes dash {
    from {
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -100px;
    }
  }

  line.connector {
    cursor: pointer;

    &:hover {
      stroke: tomato;
    }
  }

  foreignObject {
    cursor: grab;
    overflow: visible;
    user-select: none;

    &.grap {
      cursor: grabbing;
    }

    button.close {
      top: 5px;
      left: 5px;
      width: 1.2rem;
      height: 1.2rem;
      font-size: 0.8rem;
      font-weight: bold;
      padding: 0;
      border-radius: 50%;
      background-color: transparent;
      text-align: center;
      line-height: 10px;

      &:hover {
        opacity: 1;
        background-color: rgba(255, 255, 255, 0.5);
      }
    }

    div.status {
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 4px;
    }

    * {
      position: absolute;
    }
  }

  input[type='text'],
  input[type='number'],
  input[type='password'],
  textarea {
    border: none;
    outline: none;
    border-radius: 100rem;
    padding: 0 0.5rem;
    margin: 0;
    background-color: #fff;
  }

  input[type='checkbox'] {
    cursor: pointer;
    outline: none;
    border: none;
    margin: 0;
    background-color: #fff;
  }

  button,
  input[type='button'] {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 1rem;
    color: #000;
    padding: 0.5rem 1rem;
    margin: 0;
    transition: 0.2s;
    -moz-user-select: none;
    user-select: none;

    &:hover {
      opacity: 0.5;
    }
  }
`;

const App = () => {
  const canvas = useRef<HTMLDivElement>(null);
  const { show, message, open, close } = usePopup();

  useEffect(() => {
    const ctx = Context.getInstance();
    ctx.init(canvas.current as HTMLElement);
    ctx.on(ClowEventType.NOT_CONNECTABLE, ({ type }) => {
      open(getMessageFromEvent(type));
    });
    const subscription = keyboard.on(KeyCode.Escape).subscribe(() => ctx.connecting(false));
    return () => subscription.unsubscribe();
  }, [open]);

  useEffect(() => {
    socket.connect();
    socket.send('test', { a: 1 });
  }, []);

  return (
    <div ref={canvas} className="App">
      <GlobalStyle />
      <Transition in={show} timeout={TIMEOUT}>
        {(state) => <Popup message={message} onClose={close} state={state} />}
      </Transition>
      <Toolbar />
    </div>
  );
};

export default App;
