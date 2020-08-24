import React from 'react';

export enum LEVEL {
  DEBUG,
  INFO,
  SUCCESS,
  WARNING,
  ERROR,
  CRITICAL,
}

type NotificationProps = {
  message: string;
  level?: LEVEL;
};

const Notification = (props: NotificationProps) => {
  return <div className="Notification">{props.message}</div>;
};

export default Notification;
