import React, { useState, useRef, ReactNode, useCallback, createContext } from 'react';

interface PopupContextProviderProps {
  children: ReactNode;
}

export interface PopupContext {
  show: boolean;
  message: string;
  open: Function;
  close: Function;
}

export const PopupContext = createContext<PopupContext>({
  show: false,
  message: '',
  open: () => {},
  close: () => {},
});

export const TIMEOUT = 200;

const PopupContextProvider = ({ children }: PopupContextProviderProps) => {
  let timer = useRef(0);
  const [show, setShowState] = useState(false);
  const [message, setMessage] = useState('');

  const open = useCallback((message: string) => {
    clearTimeout(timer.current);
    if (show) {
      close();
      timer.current = window.setTimeout(() => {
        open(message);
      }, TIMEOUT);
    } else {
      setShowState(true);
      setMessage(message);
    }
  }, []);

  const close = useCallback(() => {
    setShowState(false);
  }, []);

  const contextValue = {
    show,
    message,
    open,
    close,
  };

  return <PopupContext.Provider value={contextValue}>{children}</PopupContext.Provider>;
};

export default PopupContextProvider;
