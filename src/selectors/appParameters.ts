import {
  AppParameters,
  StartPage,
  MealWheelState
} from '../types';

export const getAppParameters = (state: MealWheelState): AppParameters => {
  return state.appParameters;
};

export const getStartPage = (state: MealWheelState): StartPage => {
  return getAppParameters(state).startPage;
};

