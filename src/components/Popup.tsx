import React from 'react';
import styled from 'styled-components';

interface PopupProps {
  message?: string;
  onClose?: Function;
  state?: string;
}

const PopupStyles: { [key: string]: string } = {
  exited: `
    transform: translate(-50%, -180px);
  `,
  entering: `
    transform: translate(-50%, 0px);
  `,
  entered: `
    transform: translate(-50%, 0px);
  `,
  exiting: `
    transform: translate(-50%, -180px);
  `,
};

const Popup = styled('div')<{ state?: string }>`
  cursor: pointer;
  position: fixed;
  top: 1rem;
  left: 50%;
  padding: 1rem;
  width: 100%;
  max-width: 400px;
  border-radius: 2rem;
  background-color: #fff;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
  transition: 0.2s;
  ${(props) => props.state && PopupStyles[props.state]}
`;

const PopupComponent = ({ message, onClose, state }: PopupProps) => {
  return (
    <Popup
      className="Popup"
      onClick={() => typeof onClose === 'function' && onClose()}
      state={state}
    >
      {message}
    </Popup>
  );
};

export default PopupComponent;
