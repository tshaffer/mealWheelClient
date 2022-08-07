import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { addMealRedux } from '../models';

import {
  apiUrlFragment,
  MealEntity,
  serverUrl
} from '../types';


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

