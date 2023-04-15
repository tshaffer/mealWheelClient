import { cloneDeep } from 'lodash';
import { AccompanimentTypeEntity, AccompanimentTypesMap } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_ACCOMPANIMENT_TYPES = 'ADD_ACCOMPANIMENT_TYPES';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddAccompanimentTypePayload {
  id: string;
  accompanimentTypes: AccompanimentTypeEntity[];
}

export const addAccompanimentTypes = (
  id: string,
  accompanimentTypes: AccompanimentTypeEntity[]
): any => {
  return {
    type: ADD_ACCOMPANIMENT_TYPES,
    payload: {
      id,
      accompanimentTypes,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AccompanimentTypesMap = {};

export const accompanimentTypesReducer = (
  state: AccompanimentTypesMap = initialState,
  action: MealWheelModelBaseAction<AddAccompanimentTypePayload>
): AccompanimentTypesMap => {
  switch (action.type) {
    case ADD_ACCOMPANIMENT_TYPES: {
      const newState = cloneDeep(state);
      newState[action.payload.id] = action.payload.accompanimentTypes;
      return newState;
    }
    default:
      return state;
  }
};
