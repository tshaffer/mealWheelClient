import { GenerateGroceryListState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_GROCERY_LIST_START_DATE = 'SET_GROCERY_LIST_START_DATE';
const SET_NUMBER_OF_MEALS_IN_GROCERY_LIST = 'SET_NUMBER_OF_MEALS_IN_GROCERY_LIST';

// ------------------------------------
// Actions
// ------------------------------------

interface SetGroceryListStartDatePayload {
  startDate: Date;
}

export const setGroceryListStartDate = (
  startDate: Date): any => {
  return {
    type: SET_GROCERY_LIST_START_DATE,
    payload: {
      startDate,
    }
  };
};

export interface SetNumberOfMealsInGroceryListPayload {
  numberOfMealsInGroceryList: number;
}

export const setNumberOfMealsInGroceryList = (
  numberOfMealsInGroceryList: number): any => {
  return {
    type: SET_NUMBER_OF_MEALS_IN_GROCERY_LIST,
    payload: {
      numberOfMealsInGroceryList,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: GenerateGroceryListState =
{
  startDate: new Date(),
  numberOfMealsInGroceryList: 7,
};

export const generateGroceryListStateReducer = (
  state: GenerateGroceryListState = initialState,
  action: MealWheelModelBaseAction<SetGroceryListStartDatePayload & SetNumberOfMealsInGroceryListPayload>
): GenerateGroceryListState => {
  switch (action.type) {
    case SET_GROCERY_LIST_START_DATE:
      return {
        ...state,
        startDate: action.payload.startDate,
      };
    case SET_NUMBER_OF_MEALS_IN_GROCERY_LIST:
      return {
        ...state,
        numberOfMealsInGroceryList: action.payload.numberOfMealsInGroceryList,
      };
    default:
      return state;
  }
};
