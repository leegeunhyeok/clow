import React from 'react';
import './Popup.scss';

interface PopupProps {
  message?: string;
  onClose?: Function;
}

const Popup = ({ message, onClose }: PopupProps) => {
  return (
    <div className="Popup" onClick={() => typeof onClose === 'function' && onClose()}>
      {message}
    </div>
  );
};

export default Popup;
