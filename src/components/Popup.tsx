import React from 'react';
import './Popup.scss';
import { usePopup } from 'src/hooks/usePopup';

const Popup = () => {
  const { message, close } = usePopup();
  return (
    <div className="Popup" onClick={() => close()}>
      {message}
    </div>
  );
};

export default Popup;
