import { GroceryListState, IngredientEntity } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_INGREDIENTS_IN_GROCERY_LIST = 'SET_INGREDIENTS_IN_GROCERY_LIST';

// ------------------------------------
// Actions
// ------------------------------------

interface SetIngredientsInGroceryListPayload {
  ingredients: IngredientEntity[];
}

export const setIngredientsInGroceryList = (
  ingredients: IngredientEntity[]): any => {
  return {
    type: SET_INGREDIENTS_IN_GROCERY_LIST,
    payload: {
      ingredients,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: GroceryListState =
{
  ingredients: [],
};

export const groceryListStateReducer = (
  state: GroceryListState = initialState,
  action: MealWheelModelBaseAction<SetIngredientsInGroceryListPayload>
): GroceryListState => {
  switch (action.type) {
    case SET_INGREDIENTS_IN_GROCERY_LIST:
      return {
        ...state,
        ingredients: action.payload.ingredients,
      };
    default:
      return state;
  }
};
