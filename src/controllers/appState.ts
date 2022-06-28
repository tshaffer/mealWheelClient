import axios from 'axios';

import { apiUrlFragment, DishEntity, MealWheelState, serverUrl } from '../index';
import { loadDishes } from './dish';
import { getVersions } from './versionInfo';

export const initializeApp = () => {
  return (dispatch: any) => {
    dispatch(getVersions());
    dispatch(loadDishes());
  };
};

export const generateMenu = () => {
  return (dispatch: any, getState: any) => {

    const allMainDishIndices: number[] = [];
    const selectedMainDishIndices: number[] = [];

    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const allDishes: DishEntity[] = mealWheelState.dishesState.dishes;
    allDishes.forEach((dish: DishEntity, index: number) => {
      if (dish.type === 'main') {
        allMainDishIndices.push(index);
      }
    });

    // select 10 random menu items
    while (selectedMainDishIndices.length <= 10) {
      const mainDishIndex = Math.floor(Math.random() * allMainDishIndices.length);
      if (!selectedMainDishIndices.includes(mainDishIndex)) {
        selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
      }
    }

    console.log('selected main dishes');
    for (const selectedMainDishIndex of selectedMainDishIndices) {
      const selectedDish: DishEntity = allDishes[selectedMainDishIndex];
      console.log(selectedDish);
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