import { cloneDeep, isNil } from 'lodash';
import { DishEntity, DishEntityRedux, DishesState, DishRow, RequiredAccompanimentFlags } from '../types';
import { MealWheelModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const CLEAR_DISHES = 'CLEAR_DISHES';
export const SORT_DISHES = 'SORT_DISHES';
export const ADD_DISH = 'ADD_DISH';
export const ADD_DISHES = 'ADD_DISHES';
export const UPDATE_DISH = 'UPDATE_DISH';
export const DELETE_DISH = 'DELETE_DISH';

// ------------------------------------
// Actions
// ------------------------------------

export const clearDishes = (): any => {
  return {
    type: CLEAR_DISHES,
  };
};

interface SortDishesPayload {
  sortOrder: string;
  sortBy: string;
}


export const sortDishes = (
  sortOrder: string,
  sortBy: string,
): any => {
  return {
    type: SORT_DISHES,
    payload: {
      sortOrder,
      sortBy,
    }
  };
};

export interface AddReduxDishPayload {
  id: string;
  reduxDish: DishEntityRedux;
}

export const addDishRedux = (
  id: string,
  mongoDish: DishEntity
): any => {
  const reduxDish: DishEntityRedux = {
    id: mongoDish.id,
    name: mongoDish.name,
    type: mongoDish.type,
    minimumInterval: mongoDish.minimumInterval,
    lastAsStr: isNil(mongoDish.last) ? null : mongoDish.last.toDateString(),
    accompanimentRequired: isNil(mongoDish.accompanimentRequired) ? RequiredAccompanimentFlags.None : mongoDish.accompanimentRequired,
    prepEffort: mongoDish.prepEffort,
    prepTime: mongoDish.prepTime,
    cleanupEffort: mongoDish.cleanupEffort,
  };
  return {
    type: ADD_DISH,
    payload: {
      id,
      reduxDish,
    }
  };
};

interface AddReduxDishesPayload {
  reduxDishes: DishEntityRedux[];
}

export const addDishesRedux = (
  dishes: DishEntity[]
): any => {
  const reduxDishes: DishEntityRedux[] = dishes.map((mongoDish: DishEntity) => {
    return {
      id: mongoDish.id,
      name: mongoDish.name,
      type: mongoDish.type,
      minimumInterval: mongoDish.minimumInterval,
      lastAsStr: isNil(mongoDish.last) ? null : mongoDish.last.toDateString(),
      accompanimentRequired: isNil(mongoDish.accompanimentRequired) ? RequiredAccompanimentFlags.None : mongoDish.accompanimentRequired,
      prepEffort: mongoDish.prepEffort,
      prepTime: mongoDish.prepTime,
      cleanupEffort: mongoDish.cleanupEffort,
    };
  });
  return {
    type: ADD_DISHES,
    payload: {
      reduxDishes,
    }
  };
};

interface DeleteDishReduxPayload {
  id: string;
}

export const deleteDishRedux = (id: string): any => {
  return {
    type: DELETE_DISH,
    payload: {
      id
    }
  };
};

export interface UpdateReduxDishPayload {
  id: string;
  reduxDish: DishEntityRedux;
}

export const updateDishRedux = (
  id: string,
  mongoDish: DishEntity
): any => {
  const reduxDish: DishEntityRedux = {
    id: mongoDish.id,
    name: mongoDish.name,
    type: mongoDish.type,
    minimumInterval: mongoDish.minimumInterval,
    lastAsStr: isNil(mongoDish.last) ? null : mongoDish.last.toDateString(),
    accompanimentRequired: isNil(mongoDish.accompanimentRequired) ? RequiredAccompanimentFlags.None : mongoDish.accompanimentRequired,
    prepEffort: mongoDish.prepEffort,
    prepTime: mongoDish.prepTime,
    cleanupEffort: mongoDish.cleanupEffort,
  };
  return {
    type: UPDATE_DISH,
    payload: {
      id,
      reduxDish,
    }
  };
};

// utilities

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof DishRow>(
  order: Order,
  orderBy: Key,
  // orderBy: any,
): (
    a: { [key in Key]: any },
    b: { [key in Key]: any },
  ) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DishesState =
{
  dishes: [],
};

export const dishesStateReducer = (
  state: DishesState = initialState,
  action: MealWheelModelBaseAction<AddReduxDishPayload & AddReduxDishesPayload & DeleteDishReduxPayload & SortDishesPayload>
): DishesState => {
  switch (action.type) {
    case ADD_DISH: {
      const newState = cloneDeep(state) as DishesState;
      // newState.dishes[action.payload.id] = action.payload.dish;
      newState.dishes.push(action.payload.reduxDish);
      return newState;
    }
    case ADD_DISHES: {
      const newState = cloneDeep(state) as DishesState;
      newState.dishes = newState.dishes.concat(action.payload.reduxDishes);
      return newState;
    }
    case UPDATE_DISH: {
      const newState = cloneDeep(state) as DishesState;
      const updatedDishes = newState.dishes.map((dish) => (dish.id === action.payload.id ? action.payload.reduxDish : dish));
      newState.dishes = updatedDishes;
      console.log('updatedDishes');
      console.log(updatedDishes);
      return newState;
    }
    case CLEAR_DISHES:
      return initialState;
    case DELETE_DISH: {
      const newState = cloneDeep(state) as DishesState;
      newState.dishes = newState.dishes.filter(e => e.id !== action.payload.id);
      return newState;
    }
    case SORT_DISHES: {
      const sortOrder: Order = action.payload.sortOrder === 'asc' ? 'asc' : 'desc';
      const newState = cloneDeep(state) as DishesState;
      const sortBy: string = action.payload.sortBy;

      console.log('sort reducer');
      console.log('sort order: ', sortOrder);
      console.log('sort by: ', sortBy);

      switch (sortBy) {
        case 'name':
        default:
          newState.dishes = newState.dishes.slice().sort(getComparator(sortOrder, 'name'));
          break;
        case 'type':
          newState.dishes = newState.dishes.slice().sort(getComparator(sortOrder, 'type'));
          break;
        case 'minimumInterval':
          newState.dishes = newState.dishes.slice().sort(getComparator(sortOrder, 'minimumInterval'));
          break;
        case 'requiresSalad':
          // newState.dishes = newState.dishes.slice().sort(getComparator(sortOrder, 'requiresSalad'));
          break;
        case 'requiresSide':
          // newState.dishes = newState.dishes.slice().sort(getComparator(sortOrder, 'requiresSide'));
          break;
        case 'requiresVeggie':
          // newState.dishes = newState.dishes.slice().sort(getComparator(sortOrder, 'requiresVeggie'));
          break;
      }
      console.log(newState);
      return newState;
      // return state.dishes.slice().sort(getComparator('asc', 'name'));;
    }
    default:
      return state;
  }
};
