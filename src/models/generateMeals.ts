import { GenerateMealsStateRedux } from '../types';
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
  startDateAsStr: string;
}

export const setStartDate = (
  startDate: Date): any => {
  return {
    type: SET_START_DATE,
    payload: {
      startDateAsStr: startDate.toDateString(),
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

const initialState: GenerateMealsStateRedux =
{
  startDateAsStr: (new Date()).toDateString(),
  numberOfMealsToGenerate: 7,
};

export const generateMealsStateReducer = (
  state: GenerateMealsStateRedux = initialState,
  action: MealWheelModelBaseAction<SetStartDatePayload & SetNumberOfMealsToGeneratePayload>
): GenerateMealsStateRedux => {
  switch (action.type) {
    case SET_START_DATE:
      return {
        ...state,
        startDateAsStr: action.payload.startDateAsStr,
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
