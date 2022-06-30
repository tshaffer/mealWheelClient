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

    for (const selectedMainDishIndex of selectedMainDishIndices) {
      const selectedDish: DishEntity = allDishes[selectedMainDishIndex];
      console.log(selectedDish);
      if (selectedDish.requiresOneOf.salad || selectedDish.requiresOneOf.side || selectedDish.requiresOneOf.veg) {
        const possibleAccompaniments: string[] = [];
        if (selectedDish.requiresOneOf.salad) {
          possibleAccompaniments.push('salad');
        }
        if (selectedDish.requiresOneOf.side) {
          possibleAccompaniments.push('side');
        }
        if (selectedDish.requiresOneOf.veg) {
          possibleAccompaniments.push('veg');
        }
        const numPossibleAccompaniments = possibleAccompaniments.length;
        const accompanimentIndex = Math.floor(Math.random() * numPossibleAccompaniments);
        const accompanentType: string = possibleAccompaniments[accompanimentIndex];
        console.log('accompaniment type: ', accompanentType);

      }
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