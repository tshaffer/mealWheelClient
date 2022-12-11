import axios from 'axios';

import { apiUrlFragment, IngredientEntity, IngredientsByDish, MealWheelState, serverUrl } from '../types';

import { getCurrentUser } from '../selectors';
import { addIngredientRedux, addIngredientsRedux, addIngredientToDishRedux, deleteIngredientFromDishRedux, replaceIngredientInDishRedux, setIngredientsByDishRedux, updateIngredientRedux } from '../models';

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
  return (dispatch: any, getState: any) => {

    // TODO - is this the right place to strip 'newIngredient'?
    const newIngredientMarker = 'newIngredient';
    if (ingredient.id.startsWith(newIngredientMarker)) {
      ingredient.id = ingredient.id.substring(newIngredientMarker.length);
    }

    const path = serverUrl + apiUrlFragment + 'addIngredient';

    const addIngredientBody = {
      id: ingredient.id,
      name: ingredient.name,
      ingredients: ingredient.ingredients,
      showInGroceryList: ingredient.showInGroceryList
    };

    return axios.post(
      path,
      addIngredientBody
    ).then((response) => {
      dispatch(addIngredientRedux(ingredient));
      return null;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

export const updateIngredient = (
  id: string,
  ingredient: IngredientEntity
): any => {
  return ((dispatch: any): any => {
    const path = serverUrl + apiUrlFragment + 'updateIngredient';

    const updateIngredientBody = {
      id: ingredient.id,
      name: ingredient.name,
      ingredients: ingredient.ingredients,
      showInGroceryList: ingredient.showInGroceryList
    };

    return axios.post(
      path,
      updateIngredientBody
    ).then((response) => {
      dispatch(updateIngredientRedux(ingredient));
      return null;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  });
};

export const addIngredientToDish = (
  dishId: string,
  ingredientEntity: IngredientEntity,
) => {

  return (dispatch: any, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'addIngredientToDish';

    const addIngredientToDishBody = {
      userId: getCurrentUser(getState()),
      dishId,
      ingredientId: ingredientEntity.id,
    };

    return axios.post(
      path,
      addIngredientToDishBody
    ).then((response) => {
      dispatch(addIngredientToDishRedux(dishId, ingredientEntity));
      return dishId;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

export const replaceIngredientInDish = (
  dishId: string, existingIngredientId: string, newIngredientId: string
) => {

  return (dispatch: any, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'replaceIngredientInDish';

    const replaceIngredientInDishBody = {
      dishId,
      existingIngredientId,
      newIngredientId,
    };

    return axios.post(
      path,
      replaceIngredientInDishBody
    ).then((response) => {
      dispatch(replaceIngredientInDishRedux(dishId, existingIngredientId, newIngredientId));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};

export const deleteIngredientFromDish = (
  dishId: string,
  ingredientId: string,
) => {

  return (dispatch: any, getState: any) => {

    const path = serverUrl + apiUrlFragment + 'deleteIngredientFromDish';

    const deleteIngredientFromDishBody = {
      dishId,
      ingredientId,
    };

    return axios.post(
      path,
      deleteIngredientFromDishBody
    ).then((response) => {
      dispatch(deleteIngredientFromDishRedux(dishId, ingredientId));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });
  };
};