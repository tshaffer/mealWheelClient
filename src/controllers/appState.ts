import axios from 'axios';
import { isNil } from 'lodash';
import {
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

import { loadDishes } from './dish';
import { loadUsers, loginPersistentUser } from './user';
import { getVersions } from './versionInfo';
import { 
  addScheduledMeal, 
  loadDefinedMeals,
  loadScheduledMeals,
 } from './meal';

const getStartupParams = () => {

  return (dispatch: any) => {

    console.log(window.location.href);

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

export const initializeApp = () => {

  return (dispatch: any) => {

    dispatch(getVersions());

    const startupParams: StartupParams = dispatch(getStartupParams());
    dispatch(loadUsers())
      .then(() => {

        dispatch(setUiState(UiState.SelectUser));
        const loggedInUser = dispatch(loginPersistentUser());

        if (isNil(loggedInUser)) {
          dispatch(setUiState(UiState.SelectUser));
        } else {
          dispatch(loadDefinedMeals());
          dispatch(loadScheduledMeals());
          dispatch(loadDishes());
          dispatch(setUiState(UiState.Other));
        }

        dispatch(setAppInitialized());

      });
  };
};

export const setStartupAppState = () => {
  return (dispatch: any, getState: any) => {
    const state: MealWheelState = getState();
    const startPage: StartPage = getStartPage(state);
    dispatch(setUiState(UiState.Other));
  };
};

export const uploadFile = (formData: FormData): any => {
  return (dispatch: any, getState: any) => {
    // const path = serverUrl + apiUrlFragment + 'dishSpec';
    const path = serverUrl + apiUrlFragment + 'mealWheelSpec';
    axios.post(path, formData, {
    }).then((response) => {
      console.log(response);
      console.log(response.statusText);
    });
  };
};