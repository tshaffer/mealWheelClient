import { GenerateMealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

/*
  startDate: Date;
  numberOfMealsToGenerate: number;
  overwriteExistingMeals: boolean;
*/

// ------------------------------------
// Constants
// ------------------------------------
const SET_START_DATE = 'SET_START_DATE';
const SET_NUMBER_OF_MEALS_TO_GENERATE = 'SET_NUMBER_OF_MEALS_TO_GENERATE';
const SET_OVERWRITE_EXISTING_MEALS = 'SET_OVERWRITE_EXISTING_MEALS';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetStartDatePayload {
  startDate: Date;
}

export const setStartDate = (
  startDate: Date): any => {
  return {
    type: SET_START_DATE,
    payload: {
      startDate,
    }
  };
};

export interface SetNumberOfMealsToGeneratePayload {
  numberOfMealsToGenerate: number;
}

export const setNumberOfMealsToGenerate = (
  numberOfMealsToGenerate: number): any => {
  return {
    type: SET_NUMBER_OF_MEALS_TO_GENERATE,
    payload: {
      numberOfMealsToGenerate,
    }
  };
};

export interface SetOverwriteExistingMealsPayload {
  overwriteExistingMeals: boolean;
}

export const setOverwriteExistingMeals = (
  overwriteExistingMeals: boolean): any => {
  return {
    type: SET_OVERWRITE_EXISTING_MEALS,
    payload: {
      overwriteExistingMeals,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: GenerateMealsState =
{
  startDate: new Date(),
  numberOfMealsToGenerate: 7,
  overwriteExistingMeals: true,
};

export const generateMealsStateReducer = (
  state: GenerateMealsState = initialState,
  action: MealWheelModelBaseAction<SetStartDatePayload & SetNumberOfMealsToGeneratePayload & SetOverwriteExistingMealsPayload>
): GenerateMealsState => {
  switch (action.type) {
    case SET_START_DATE:
      return {
        ...state,
        startDate: action.payload.startDate,
      };
    case SET_NUMBER_OF_MEALS_TO_GENERATE:
      return {
        ...state,
        numberOfMealsToGenerate: action.payload.numberOfMealsToGenerate,
      };
    case SET_OVERWRITE_EXISTING_MEALS: {
      return {
        ...state,
        overwriteExistingMeals: action.payload.overwriteExistingMeals
      };
    }
    default:
      return state;
  }
};
