import axios from 'axios';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { addMealRedux, addMealsRedux, clearMeals, updateMealRedux } from '../models';
import { getCurrentUser } from '../selectors';

import {
  apiUrlFragment,
  DishEntity,
  DishType,
  MealEntity,
  MealStatus,
  MealWheelState,
  RequiredAccompanimentFlags,
  serverUrl
} from '../types';


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
        status: MealStatus.proposed
      };

      dispatch(addMeal(meal));

      mealDate.setTime(mealDate.getTime() + (24 * 60 * 60 * 1000));
    }
  };
};


export const loadMeals = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    console.log('loadMeals, user id: ', id);

    const path = serverUrl + apiUrlFragment + 'meals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {
        const mealEntities: MealEntity[] = (mealsResponse as any).data;
        dispatch(addMealsRedux(mealEntities));
      });
  };
};


export const addMeal = (
  meal: MealEntity
): any => {
  return ((dispatch: any): any => {

    const path = serverUrl + apiUrlFragment + 'addMeal';

    meal.id = uuidv4();

    const addMealBody: any = {
      id: meal.id,
      meal,
    };

    return axios.post(
      path,
      addMealBody
    ).then((response) => {
      dispatch(addMealRedux(meal.id, meal));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};

export const updateMeal = (
  id: string,
  meal: MealEntity
): any => {
  return ((dispatch: any): any => {

    const path = serverUrl + apiUrlFragment + 'updateMeal';

    const updateMealBody: any = {
      id,
      meal,
    };

    return axios.post(
      path,
      updateMealBody
    ).then((response) => {
      dispatch(updateMealRedux(id, meal));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};



