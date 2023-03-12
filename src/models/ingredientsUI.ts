import { IngredientRow, IngredientsUIState, Order } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_INGREDIENT_ROWS = 'SET_INGREDIENT_ROWS';
const SET_CURRENT_EDIT_INGREDIENT = 'SET_CURRENT_EDIT_INGREDIENT';
const SET_INGREDIENT_SORT_ORDER = 'SET_INGREDIENT_SORT_ORDER';
const SET_INGREDIENT_SORT_BY = 'SET_INGREDIENT_SORT_BY';

// ------------------------------------
// Actions
// ------------------------------------

interface SetRowsPayload {
  rows: IngredientRow[];
}

export const setIngredientRows = (
  rows: IngredientRow[]): any => {
  return {
    type: SET_INGREDIENT_ROWS,
    payload: {
      rows,
    }
  };
};

interface SetCurrentEditIngredientPayload {
  currentEditIngredient: IngredientRow | null;
}

export const setCurrentEditIngredient = (
  currentEditIngredient: IngredientRow | null): any => {
  return {
    type: SET_CURRENT_EDIT_INGREDIENT,
    payload: {
      currentEditIngredient,
    }
  };
};

interface SetIngredientSortOrderPayload {
  sortOrder: Order;
}

export const setIngredientSortOrder = (
  sortOrder: Order): any => {
  return {
    type: SET_INGREDIENT_SORT_ORDER,
    payload: {
      sortOrder,
    }
  };
};

interface SetIngredientSortByPayload {
  sortBy: string;
}

export const setIngredientSortBy = (
  sortBy: string): any => {
  return {
    type: SET_INGREDIENT_SORT_BY,
    payload: {
      sortBy,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: IngredientsUIState =
{
  sortOrder: 'asc',
  sortBy: 'name',
  rows: [],
  currentEditIngredient: null,
};

export const ingredientsUIStateReducer = (
  state: IngredientsUIState = initialState,
  action: MealWheelModelBaseAction<SetRowsPayload & SetCurrentEditIngredientPayload & SetIngredientSortOrderPayload & SetIngredientSortByPayload>
): IngredientsUIState => {
  switch (action.type) {
    case SET_INGREDIENT_ROWS:
      return {
        ...state,
        rows: action.payload.rows,
      };
    case SET_CURRENT_EDIT_INGREDIENT:
      return {
        ...state,
        currentEditIngredient: action.payload.currentEditIngredient,
      };
    case SET_INGREDIENT_SORT_ORDER:
      return {
        ...state,
        sortOrder: action.payload.sortOrder,
      };
    case SET_INGREDIENT_SORT_BY:
      return {
        ...state,
        sortBy: action.payload.sortBy,
      };
    default:
      return state;
  }
};
