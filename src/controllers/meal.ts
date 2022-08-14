import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { addMealRedux, clearMeals } from '../models';
import { getCurrentUser } from '../selectors';

import {
  apiUrlFragment,
  MealEntity,
  MealWheelState,
  serverUrl
} from '../types';


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
        // // TEDTODO - add all in a single call
        for (const mealEntity of mealEntities) {
          dispatch(addMealRedux(mealEntity.id, mealEntity));
        }
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

