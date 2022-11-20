import axios from 'axios';

import { apiUrlFragment, IngredientEntity, IngredientsByDish, MealWheelState, serverUrl } from '../types';

import { getCurrentUser } from '../selectors';
import { addIngredientsRedux, setIngredientsByDishRedux } from '../models';

export const loadIngredients = () => {

  return (dispatch: any, getState: any) => {
    
    const path = serverUrl + apiUrlFragment + 'ingredients';

    return axios.get(path)
      .then((ingredientsResponse: any) => {
        const ingredients: IngredientEntity[] = (ingredientsResponse as any).data;
        dispatch(addIngredientsRedux(ingredients));
      });
  };
};

export const loadIngredientsByDish = () => {

  return (dispatch: any, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);
    
    const path = serverUrl + apiUrlFragment + 'ingredientsByDish?id=' + id;

    return axios.get(path)
      .then((ingredientsByDishResponse: any) => {
        const ingredientsByDish: IngredientsByDish = (ingredientsByDishResponse as any).data;
        dispatch(setIngredientsByDishRedux(ingredientsByDish));
      });
  };
};

export const addIngredient = (
  ingredient: IngredientEntity
): any => {
  return ((dispatch: any, getState: any): Promise<string> => {
    return Promise.resolve('success');
  });
};

export const updateIngredient = (
  id: string,
  ingredient: IngredientEntity
): any => {
  return ((dispatch: any): any => {
  });
};

