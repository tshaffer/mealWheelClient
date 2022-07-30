import { AppParameters, StartPage } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_START_PAGE = 'SET_START_PAGE';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetStartPagePayload {
  startPage: StartPage;
}

export const setStartPage = (
  startPage: StartPage,
): any => {
  return {
    type: SET_START_PAGE,
    payload: {
      startPage,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppParameters = {
  startPage: StartPage.Standard,
};

export const appParametersReducer = (
  state: AppParameters = initialState,
  action: MealWheelModelBaseAction<SetStartPagePayload>
): AppParameters => {
  switch (action.type) {
    case SET_START_PAGE: {
      return { ...state, startPage: action.payload.startPage };
    }
    default:
      return state;
  }
};
