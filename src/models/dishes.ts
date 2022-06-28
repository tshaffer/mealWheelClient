import { cloneDeep } from 'lodash';
import { DishEntity, DishesState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_DISH = 'ADD_DISH';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddDishPayload {
  id: string;
  dish: DishEntity;
}

export const addDish = (
  id: string,
  dish: DishEntity
): any => {
  return {
    type: ADD_DISH,
    payload: {
      id,
      dish,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DishesState =
{
  dishes: [],
};

export const dishesStateReducer = (
  state: DishesState = initialState,
  action: MealWheelModelBaseAction<AddDishPayload>
): DishesState => {
  switch (action.type) {
    case ADD_DISH: {
      const newState = cloneDeep(state) as DishesState;
      // newState.dishes[action.payload.id] = action.payload.dish;
      newState.dishes.push(action.payload.dish);
      return newState;
    }
    default:
      return state;
  }
};
