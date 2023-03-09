import { DishRow, DishesUIState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_ROWS = 'SET_ROWS';
const SET_CURRENT_EDIT_DISH = 'SET_CURRENT_EDIT_DISH';

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

interface SetCurrentEditDishPayload {
  currentEditDish: DishRow | null;
}

export const setCurrentEditDish = (
  currentEditDish: DishRow | null): any => {
  return {
    type: SET_CURRENT_EDIT_DISH,
    payload: {
      currentEditDish,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DishesUIState =
{
  sortOrder: 'asc',
  sortBy: 'name',
  rows: [],
  currentEditDish: null,
};

export const dishesUIStateReducer = (
  state: DishesUIState = initialState,
  action: MealWheelModelBaseAction<SetRowsPayload & SetCurrentEditDishPayload>
): DishesUIState => {
  switch (action.type) {
    case SET_ROWS:
      return {
        ...state,
        rows: action.payload.rows,
      };
    case SET_CURRENT_EDIT_DISH:
      return {
        ...state,
        currentEditDish: action.payload.currentEditDish,
      };
    default:
      return state;
  }
};
