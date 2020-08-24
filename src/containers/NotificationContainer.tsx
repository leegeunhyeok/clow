import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/reducers';
import Notification from '../components/Notification';

function NotificationContainer() {
  const notification = useSelector((state: RootState) => state.notification);
  return <Notification message={notification.message} level={notification.level} />;
}

export default NotificationContainer;
