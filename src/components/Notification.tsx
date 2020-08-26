import React, { useEffect } from 'react';
import './Notification.scss';

export enum LEVEL {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

type NotificationProps = {
  message: string;
  level?: LEVEL;
  keep?: number;
  onClose: Function;
};

const Notification = (props: NotificationProps) => {
  let timer = 0;
  useEffect(() => {
    timer = window.setTimeout(() => {
      props.onClose();
    }, (props.keep ?? 3) * 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={props.level ? 'Notification--' + props.level : 'Notification'}
      onClick={() => {
        clearTimeout(timer);
        props.onClose();
      }}
    >
      {props.message}
    </div>
  );
};

export default Notification;
