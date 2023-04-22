import axios from 'axios';
import { getCurrentUser, getDishes } from '../selectors';
import { v4 as uuidv4 } from 'uuid';

import { addDishesRedux, addDishRedux, deleteDishRedux, MealWheelDispatch, MealWheelStringPromiseThunkAction, MealWheelVoidPromiseThunkAction, MealWheelVoidThunkAction, setRows, sortIngredients, updateDishRedux } from '../models';

import {
  apiUrlFragment,
  DishEntity,
  DishEntityFromServer,
  DishEntityRedux,
  DishesState,
  DishRow,
  MealWheelState,
  Order,
  // RequiredAccompanimentFlags,
  serverUrl
} from '../types';
import { isNil } from 'lodash';

export const loadDishes = (): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    const path = serverUrl + apiUrlFragment + 'dishes?id=' + id;

    return axios.get(path)
      .then((dishesResponse: any) => {
        const dishEntitiesFromServer: DishEntityFromServer[] = (dishesResponse as any).data;
        const dishEntities: DishEntity[] = dishEntitiesFromServer.map((dishEntityFromServer: DishEntityFromServer) => {
          const dishEntity: DishEntity = {
            id: dishEntityFromServer.id,
            name: dishEntityFromServer.name,
            type: dishEntityFromServer.type,
            minimumInterval: dishEntityFromServer.minimumInterval,
            last: isNil(dishEntityFromServer.last) ? null : new Date(dishEntityFromServer.last),
            numAccompanimentsRequired: !isNil(dishEntityFromServer.numAccompanimentsRequired) ? dishEntityFromServer.numAccompanimentsRequired : 0,
            allowableAccompanimentTypes: !isNil(dishEntityFromServer.allowableAccompanimentTypes) ? dishEntityFromServer.allowableAccompanimentTypes : [],
            // accompanimentRequired: isNil(mongoDish.accompanimentRequired) ? RequiredAccompanimentFlags.None : mongoDish.accompanimentRequired,
            prepEffort: dishEntityFromServer.prepEffort,
            prepTime: dishEntityFromServer.prepTime,
            cleanupEffort: dishEntityFromServer.cleanupEffort,
          };
          return dishEntity;
        });

        dispatch(addDishesRedux(dishEntities));
      });
  };
};

export const addDish = (
  dish: DishEntity
): MealWheelStringPromiseThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any): Promise<string> => {

    const path = serverUrl + apiUrlFragment + 'addDish';

    dish.id = uuidv4();

    const addDishBody: any = {
      userId: getCurrentUser(getState()),
      id: dish.id,
      dish,
    };

    return axios.post(
      path,
      addDishBody
    ).then((response) => {
      dispatch(addDishRedux(dish.id, dish));
      return dish.id;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return '';
    });

  };
};


export const updateDish = (
  id: string,
  dish: DishEntity
): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch): any => {

    const path = serverUrl + apiUrlFragment + 'updateDish';

    const updateDishBody: any = {
      id,
      dish,
    };

    return axios.post(
      path,
      updateDishBody
    ).then((response) => {
      dispatch(updateDishRedux(id, dish));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  };
};

export const updateDishLastProperty = (
  dishEntity: DishEntity,
  last: Date
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch): any => {
    dishEntity.last = last;
    dispatch(updateDish(dishEntity.id, dishEntity));
  };
};

export const deleteDish = (
  dishId: string,
): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch): any => {

    const path = serverUrl + apiUrlFragment + 'deleteDish';

    const deleteDishBody: any = {
      dishId,
    };

    return axios.post(
      path,
      deleteDishBody
    ).then((response) => {
      dispatch(deleteDishRedux(dishId));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });
  };
};

const getRows = (dishes: DishEntity[]): DishRow[] => {

  const rows: DishRow[] = dishes.map((dish: DishEntity) => {
    const row: DishRow = {
      dish,
      name: dish.name,
      type: dish.type,
      last: dish.last,
      minimumInterval: dish.minimumInterval,
      numAccompanimentsRequired: !isNil(dish.numAccompanimentsRequired) ? dish.numAccompanimentsRequired : 0,
      allowableAccompanimentTypes: !isNil(dish.allowableAccompanimentTypes) ? dish.allowableAccompanimentTypes : [],
    };
    return row;
  });
  return rows;
};


export const sortDishesAndSetRows = (
  sortOrder: Order,
  sortBy: string,
): any => {
  return (dispatch: MealWheelDispatch, getState: any): any => {
    dispatch(sortIngredients(sortOrder, sortBy));
    let state: MealWheelState = getState();
    const dishes: DishEntity[] = getDishes(state);
    const newRows: DishRow[] = getRows(dishes);
    dispatch(setRows(newRows));
    state = getState();
  };
};