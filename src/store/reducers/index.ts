import { combineReducers } from 'redux';
import engineReducer, { EngineState } from './engine';

export interface RootState {
  engine: EngineState;
}

const rootReducer = combineReducers({
  engine: engineReducer,
});

export default rootReducer;
