import { GenerateMealsState } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
const SET_START_DATE = 'SET_START_DATE';
const SET_NUMBER_OF_MEALS_TO_GENERATE = 'SET_NUMBER_OF_MEALS_TO_GENERATE';

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

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: GenerateMealsState =
{
  startDate: new Date(),
  numberOfMealsToGenerate: 7,
};

export const generateMealsStateReducer = (
  state: GenerateMealsState = initialState,
  action: MealWheelModelBaseAction<SetStartDatePayload & SetNumberOfMealsToGeneratePayload>
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
    default:
      return state;
  }
};
