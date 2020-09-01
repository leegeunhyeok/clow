import React from 'react';
import styled from 'styled-components';

interface Area {
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
}

interface ButtonProps {
  children?: string;
  color?: string;
  textColor: string;
  bold?: boolean;
  margin?: Area | number;
  onClick?: Function;
}

const getArea = (area?: Area | number): string => {
  if (area === undefined) {
    return '';
  }

  if (typeof area === 'number') {
    return `${area}px`;
  }

  return `${area.top || 0}px ${area.left || 0}px ${area.bottom || 0}px ${area.right || 0}px`;
};

const ButtonComponent = ({ children, color, textColor, bold, margin, onClick }: ButtonProps) => {
  return (
    <Button
      color={color}
      textColor={textColor}
      bold={bold}
      margin={margin}
      onClick={() => typeof onClick === 'function' && onClick()}
    >
      {children}
    </Button>
  );
};

export default ButtonComponent;

const Button = styled('div')<ButtonProps>`
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 1rem;
  color: ${(props) => props.textColor || '#000'};
  background-color: ${(props) => props.color || '#ddd'};
  padding: 0.5rem 1rem;
  margin: ${(props) => getArea(props.margin)};
  font-weight: ${(props) => (props.bold ? 'bold' : 'initial')};
  transition: 0.2s;
  -moz-user-select: none;
  user-select: none;

  &:hover {
    opacity: 0.5;
  }
`;
