import axios from 'axios';
import { isNil } from 'lodash';
import {
  clearDefinedMeals,
  clearDishes,
  clearIngredients,
  clearIngredientsByDish,
  clearScheduledMeals,
  MealWheelAnyPromiseThunkAction,
  MealWheelAnyThunkAction,
  MealWheelDispatch,
  MealWheelVoidPromiseThunkAction,
  MealWheelVoidThunkAction,
  setAppInitialized,
  setUiState,
} from '../models';

import {
  apiUrlFragment,
  MealWheelState,
  serverUrl,
  StartPage,
  StartupParams,
  UiState
} from '../types';

import { getCurrentUser, getStartPage } from '../selectors';

import { getVersions } from './versionInfo';
import { loadDishes } from './dish';
import { loadUsers, loginPersistentUser } from './user';
import {
  loadDefinedMeals,
  loadScheduledMeals,
} from './meal';
import { loadIngredients, loadIngredientsByDish } from './ingredients';

const getStartupParams = (): MealWheelAnyThunkAction => {

  return (dispatch: MealWheelDispatch) => {

    // updated code based on new form of url
    // const urlParts: string[] = window.location.href.split('/');
    // const indexOfGame = urlParts.lastIndexOf('game');
    // if (indexOfGame >= 0) {
    //   const indexOfExisting = urlParts.lastIndexOf('existing');
    //   if (indexOfExisting > 0 && indexOfExisting === (indexOfGame + 1)) {
    //     if (urlParts.length > (indexOfExisting + 1)) {
    //       const boardId = urlParts[indexOfExisting + 1];

    //       console.log('join game with boardId', boardId);
    //       dispatch(setStartPage(StartPage.JoinGame));
    //       dispatch(setStartupBoardId(boardId as string));

    //       return {
    //         startPage: StartPage.JoinGame,
    //         startupBoardId: boardId,
    //       };
    //     }
    //   }
    // }

    return {
      startPage: StartPage.Standard,
    } as StartupParams;
  };
};

// TEDTODO - make sure it always returns a Promise
export const initializeApp = (): MealWheelAnyPromiseThunkAction => {

  return (dispatch: MealWheelDispatch) => {

    dispatch(getVersions());

    // const startupParams: StartupParams = dispatch(getStartupParams());
    return dispatch(loadUsers())
      .then(() => {

        dispatch(setUiState(UiState.SelectUser));
        const loggedInUser = dispatch(loginPersistentUser());

        if (isNil(loggedInUser)) {
          dispatch(setUiState(UiState.SelectUser));
          dispatch(setAppInitialized());
          return Promise.resolve();
        } else {
          return dispatch(loadUserData())
            .then(() => {
              dispatch(setUiState(UiState.Other));
              dispatch(setAppInitialized());
            });
        }
      });
  };
};

export const loadUserData = (): MealWheelAnyPromiseThunkAction => {
  return (dispatch: MealWheelDispatch) => {
    dispatch(clearDishes());
    dispatch(clearDefinedMeals());
    dispatch(clearScheduledMeals());
    dispatch(clearIngredients());
    dispatch(clearIngredientsByDish());
    return dispatch(loadDishes())
      .then(() => {
        dispatch(loadDefinedMeals());
      }).then(() => {
        dispatch(loadScheduledMeals());
      }).then(() => {
        dispatch(loadIngredients());
      }).then(() => {
        dispatch(loadIngredientsByDish());
      });
  };
};

export const setStartupAppState = (): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    // const state: MealWheelState = getState();
    // const startPage: StartPage = getStartPage(state);
    dispatch(setUiState(UiState.Other));
  };
};

export const uploadFile = (formData: FormData): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const state: MealWheelState = getState();
    const userId = getCurrentUser(state) as string;
    formData.set('userId', userId);
    const path = serverUrl + apiUrlFragment + 'mealWheelSpec';
    // return axios.post(path, formData, {
    // }).then((response) => {
    //   console.log(response);
    //   console.log(response.statusText);
    // }).catch((err) => {
    //   console.log('uploadFile returned error');
    //   console.log(err);
    //   const errorList: string[] = err.response.data;
    //   console.log('errorList:');
    //   console.log(errorList);
    // });
    return axios.post(path, formData);
  };
};