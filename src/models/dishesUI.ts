import { DishRow, DishesUIState, Order } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_ROWS = 'SET_ROWS';
const SET_CURRENT_EDIT_DISH = 'SET_CURRENT_EDIT_DISH';
const SET_SORT_ORDER = 'SET_SORT_ORDER';
const SET_SORT_BY = 'SET_SORT_BY';

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

interface SetSortOrderPayload {
  sortOrder: Order;
}

export const setSortOrder = (
  sortOrder: Order): any => {
  return {
    type: SET_SORT_ORDER,
    payload: {
      sortOrder,
    }
  };
};

interface SetSortByPayload {
  sortBy: string;
}

export const setSortBy = (
  sortBy: string): any => {
  return {
    type: SET_SORT_BY,
    payload: {
      sortBy,
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
  action: MealWheelModelBaseAction<SetRowsPayload & SetCurrentEditDishPayload & SetSortOrderPayload & SetSortByPayload>
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
    case SET_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload.sortOrder,
      };
    case SET_SORT_BY:
      return {
        ...state,
        sortBy: action.payload.sortBy,
      };
    default:
      return state;
  }
};
