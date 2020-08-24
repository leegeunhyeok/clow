import { combineReducers } from 'redux';
import notification, { NotificationState } from './notification';

export interface RootState {
  notification: NotificationState;
}

const rootReducer = combineReducers({
  notification,
});

export default rootReducer;
