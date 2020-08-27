import { createContext } from 'react';

interface PopupContext {
  message: string;
}

const context = createContext<PopupContext>({ message: '' });
export const usePopupContext = () => {
  return {
    open() {
      // TODO
    },
    close() {
      // TODO
    },
  };
};
