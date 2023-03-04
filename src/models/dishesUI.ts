import { DishRow, DishesUIState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_ROWS = 'SET_ROWS';

// ------------------------------------
// Actions
// ------------------------------------

interface SetRowsPayload {
  rows: DishRow[];
}

export const setRows = (
  rows: DishRow[]): any => {
  return {
    type: SET_ROWS,
    payload: {
      rows,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DishesUIState =
{
  rows: [],
};

export const dishesUIStateReducer = (
  state: DishesUIState = initialState,
  action: MealWheelModelBaseAction<SetRowsPayload>
): DishesUIState => {
  switch (action.type) {
    case SET_ROWS:
      return {
        ...state,
        rows: action.payload.rows,
      };
    default:
      return state;
  }
};
