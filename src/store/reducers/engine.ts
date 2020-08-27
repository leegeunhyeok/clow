import { EngineActions } from 'src/store/actions';
import * as types from 'src/store/actions/types';

export interface EngineState {
  loading: boolean;
}

const initialState: EngineState = {
  loading: false,
};

const engineReducer = (state = initialState, action: EngineActions): EngineState => {
  switch (action.type) {
    case types.START_ENGINE:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

export default engineReducer;
