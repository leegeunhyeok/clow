import React, { createContext, useState, ReactNode, useCallback } from 'react';

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

export const ANIMATION_DURATION = 500;

const PopupContextProvider = ({ children }: PopupContextProviderProps) => {
  let timer = 0;
  const [show, setShowState] = useState(false);
  const [message, setMessage] = useState('');

  const open = (message: string) => {
    clearTimeout(timer);
    if (show) {
      close();
      timer = window.setTimeout(() => {
        open(message);
      }, ANIMATION_DURATION);
    } else {
      setShowState(true);
      setMessage(message);
    }
  };

  const close = () => setShowState(false);

  const contextValue = {
    show,
    message,
    open: useCallback((message: string) => open(message), []),
    close: useCallback(() => close(), []),
  };

  return <PopupContext.Provider value={contextValue}>{children}</PopupContext.Provider>;
};

export default PopupContextProvider;
