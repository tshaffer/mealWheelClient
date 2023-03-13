import axios from 'axios';

import { apiUrlFragment, IngredientEntity, IngredientRow, IngredientsByDish, MealWheelState, Order, RequiredAccompanimentFlags, serverUrl } from '../types';

import { getCurrentUser, getIngredients } from '../selectors';
import { addIngredientRedux, addIngredientsRedux, addIngredientToDishRedux, deleteIngredientFromDishRedux, MealWheelDispatch, MealWheelStringOrNullPromiseThunkAction, MealWheelStringPromiseThunkAction, MealWheelVoidPromiseThunkAction, replaceIngredientInDishRedux, setIngredientRows, setIngredientsByDishRedux, setRows, sortIngredients, updateIngredientRedux } from '../models';
import { isNil } from 'lodash';

export const loadIngredients = (): MealWheelVoidPromiseThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    const path = serverUrl + apiUrlFragment + 'ingredients?id=' + id;

    return axios.get(path)
      .then((ingredientsResponse: any) => {
        const ingredients: IngredientEntity[] = (ingredientsResponse as any).data;
        dispatch(addIngredientsRedux(ingredients));
      });
  };
};

export const loadIngredientsByDish = (): MealWheelVoidPromiseThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

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


// onGenerateMenu: (startDate: Date, numberOfMealsToGenerate: number) => any;
// type loadIngredientsByDishType = (dispatch: MealWheelDispatch, getState: any) => void;
// type foo = (path: string) => Promise<void>;

// export const loadIngredientsByDish = (): loadIngredientsByDishType  => {

//   return (dispatch: MealWheelDispatch, getState: any): foo => {

//     const state: MealWheelState = getState();
//     const id = getCurrentUser(state);

//     const path = serverUrl + apiUrlFragment + 'ingredientsByDish?id=' + id;

//     return axios.get(path)
//       .then((ingredientsByDishResponse: any) => {
//         const ingredientsByDish: IngredientsByDish = (ingredientsByDishResponse as any).data;
//         dispatch(setIngredientsByDishRedux(ingredientsByDish));
//       });
//   };
// };

export const addIngredient = (
  ingredient: IngredientEntity
): MealWheelStringOrNullPromiseThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {

    // TODO - is this the right place to strip 'newIngredient'?
    const newIngredientMarker = 'newIngredient';
    if (ingredient.id.startsWith(newIngredientMarker)) {
      ingredient.id = ingredient.id.substring(newIngredientMarker.length);
    }

    const path = serverUrl + apiUrlFragment + 'addIngredient';

    const addIngredientBody = {
      id: ingredient.id,
      userId: getCurrentUser(getState()),
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
): MealWheelStringOrNullPromiseThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any): any => {
    const path = serverUrl + apiUrlFragment + 'updateIngredient';

    const updateIngredientBody = {
      id: ingredient.id,
      userId: getCurrentUser(getState()),
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
  };
};

export const addIngredientToDish = (
  dishId: string,
  ingredientEntity: IngredientEntity,
): MealWheelStringPromiseThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

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
): MealWheelVoidPromiseThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

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
      return;
    });
  };
};

export const deleteIngredientFromDish = (
  dishId: string,
  ingredientId: string,
): MealWheelVoidPromiseThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

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
      return;
    });
  };
};


export const deleteIngredient = (ingredientId: string) => {
  debugger;
};

const getIngredientRows = (dishes: IngredientEntity[]): IngredientRow[] => {

  const rows: IngredientRow[] = dishes.map((ingredient: IngredientEntity) => {
    const row: IngredientRow = {
      ingredient,
      name: ingredient.name,
      showInGroceryList: ingredient.showInGroceryList,
    };
    return row;
  });
  return rows;
};



export const sortIngredientsAndSetRows = (
  sortOrder: Order,
  sortBy: string,
): any => {
  return (dispatch: MealWheelDispatch, getState: any): any => {
    dispatch(sortIngredients(sortOrder, sortBy));
    let state: MealWheelState = getState();
    const ingredients: IngredientEntity[] = getIngredients(state);
    const newRows: IngredientRow[] = getIngredientRows(ingredients);
    dispatch(setIngredientRows(newRows));
    state = getState();
  };
};