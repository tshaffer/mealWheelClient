import axios from 'axios';
import { addMeal } from '../index';

import { apiUrlFragment, DishEntity, Meal, MealWheelState, serverUrl } from '../types';
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


    for (const selectedMainDishIndex of selectedMainDishIndices) {

      const selectedDish: DishEntity = allDishes[selectedMainDishIndex];
      console.log('main: ' + selectedDish.name);

      const meal: Meal = {
        mainDishId: selectedDish.name,
        nonMainDishIds: [],
      };

      // if accompaniment to main is required, select it.
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
        const accompanimentTypeIndex = Math.floor(Math.random() * numPossibleAccompaniments);
        const accompanimentType: string = possibleAccompaniments[accompanimentTypeIndex];
        console.log('accompaniment type: ', accompanimentType);

        let accompanimentIndex = -1;
        switch (accompanimentType) {
          case 'salad': {
            accompanimentIndex = allSaladIndices[Math.floor(Math.random() * allSaladIndices.length)];
            break;
          }
          case 'side': {
            accompanimentIndex = allSideIndices[Math.floor(Math.random() * allSideIndices.length)];
            break;
          }
          case 'veg': {
            accompanimentIndex = allVegIndices[Math.floor(Math.random() * allVegIndices.length)];
            break;
          }
        }

        console.log('accompaniment: ', allDishes[accompanimentIndex].name);
        meal.nonMainDishIds.push(allDishes[accompanimentIndex].name);
      }

      dispatch(addMeal(meal.mainDishId, meal.nonMainDishIds));
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