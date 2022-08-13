import axios from 'axios';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import {
  clearMeals,
  setAppInitialized,
  setUiState,
} from '../models';

import {
  apiUrlFragment,
  DishEntity,
  DishType,
  MealEntity,
  MealStatus,
  MealWheelState,
  RequiredAccompanimentFlags,
  serverUrl,
  StartPage,
  StartupParams,
  UiState
} from '../types';

import { getCurrentUser, getStartPage } from '../selectors';

import { loadDishes } from './dish';
import { loadUsers, loginPersistentUser } from './user';
import { getVersions } from './versionInfo';
import { addMeal } from './meal';

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

export const generateMenu = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearMeals());
    const allMainDishIndices: number[] = [];
    const allSaladIndices: number[] = [];
    const allSideIndices: number[] = [];
    const allVegIndices: number[] = [];

    const selectedMainDishIndices: number[] = [];

    const mealWheelState: MealWheelState = getState() as MealWheelState;

    const allDishes: DishEntity[] = mealWheelState.dishesState.dishes;
    allDishes.forEach((dish: DishEntity, index: number) => {
      switch (dish.type) {
        case 'main':
          allMainDishIndices.push(index);
          break;
        case 'salad':
          allSaladIndices.push(index);
          break;
        case 'side':
          allSideIndices.push(index);
          break;
        case 'veg':
          allVegIndices.push(index);
          break;
      }
    });

    // select 10 random main dish items
    while (selectedMainDishIndices.length <= 10) {
      const mainDishIndex = Math.floor(Math.random() * allMainDishIndices.length);
      if (!selectedMainDishIndices.includes(allMainDishIndices[mainDishIndex])) {
        selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
      }
    }

    const mealDate: Date = new Date();

    for (const selectedMainDishIndex of selectedMainDishIndices) {

      const selectedDish: DishEntity = allDishes[selectedMainDishIndex];

      let accompanimentDishId: string | null = null;

      // if accompaniment to main is required, select it.
      if (!isNil(selectedDish.accompaniment) && selectedDish.accompaniment !== RequiredAccompanimentFlags.None) {
        const possibleAccompaniments: DishType[] = [];
        if (selectedDish.accompaniment & RequiredAccompanimentFlags.Salad) {
          possibleAccompaniments.push(DishType.Salad);
        }
        if (selectedDish.accompaniment & RequiredAccompanimentFlags.Side) {
          possibleAccompaniments.push(DishType.Side);
        }
        if (selectedDish.accompaniment & RequiredAccompanimentFlags.Veg) {
          possibleAccompaniments.push(DishType.Veg);
        }
        const numPossibleAccompaniments = possibleAccompaniments.length;
        const accompanimentTypeIndex = Math.floor(Math.random() * numPossibleAccompaniments);
        const accompanimentType: DishType = possibleAccompaniments[accompanimentTypeIndex];

        let accompanimentIndex = -1;
        switch (accompanimentType) {
          case DishType.Salad: {
            accompanimentIndex = allSaladIndices[Math.floor(Math.random() * allSaladIndices.length)];
            break;
          }
          case DishType.Side: {
            accompanimentIndex = allSideIndices[Math.floor(Math.random() * allSideIndices.length)];
            break;
          }
          case DishType.Veg: {
            accompanimentIndex = allVegIndices[Math.floor(Math.random() * allVegIndices.length)];
            break;
          }
        }

        accompanimentDishId = allDishes[accompanimentIndex].id;
      }

      const mealId = uuidv4();
      const meal: MealEntity = {
        id: mealId,
        userId: getCurrentUser(mealWheelState) as string,
        mainDishId: selectedDish.id,
        accompanimentDishId,
        dateScheduled: mealDate,
        status: MealStatus.pending
      };

      dispatch(addMeal(meal));

      mealDate.setTime(mealDate.getTime() + (24*60*60*1000));
    }
  };
};

export const uploadFile = (formData: FormData): any => {
  return (dispatch: any, getState: any) => {
    const path = serverUrl + apiUrlFragment + 'dishSpec';
    axios.post(path, formData, {
    }).then((response) => {
      console.log(response);
      console.log(response.statusText);
    });
  };
};