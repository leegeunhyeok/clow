import { useContext } from 'react';
import { PopupContext } from 'src/providers/popup';

export const usePopup = () => {
  const { show, message, open, close } = useContext(PopupContext);
  return { show, message, open, close };
};
