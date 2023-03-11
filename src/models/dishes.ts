import { cloneDeep, isNil } from 'lodash';
import { DishEntity, DishEntityRedux, DishesState, RequiredAccompanimentFlags } from '../types';
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

type Order = 'asc' | 'desc';

const compareValues = (aValue: any, bValue: any, order: Order): number => {
  let val = 0;
  if (aValue < bValue) {
    val = -1;
  }
  if (bValue < aValue) {
    val = 1;
  }
  if (order === 'desc') {
    val *= -val;
  }
  return val;
};

// DishEntityRedux
const sortDishesByProperty = (dishes: DishEntityRedux[], order: Order, orderBy: string): any => {
  dishes.sort((a, b) => {
    switch (orderBy) {
      case 'name':
      case 'type':
      case 'minimumInterval': {
        let val = 0;
        if (a[orderBy] < b[orderBy]) {
          val = -1;
        }
        if (b[orderBy] < a[orderBy]) {
          val = 1;
        }
        if (order === 'desc') {
          val *= -val;
        }
        return val;
      }
      case 'requiresAccompaniment': {
        const aValue = a.accompanimentRequired !== RequiredAccompanimentFlags.None;
        const bValue = b.accompanimentRequired !== RequiredAccompanimentFlags.None;
        return compareValues(aValue, bValue, order);
      }
      case 'requiresSalad': {
        if (!isNil(a.accompanimentRequired) && !isNil(b.accompanimentRequired)) {
          const aValue = (a.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
          const bValue = (b.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
          return compareValues(aValue, bValue, order);
        }
        return 0;
      }
      case 'requiresSide': {
        if (!isNil(a.accompanimentRequired) && !isNil(b.accompanimentRequired)) {
          const aValue = (a.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
          const bValue = (b.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
          return compareValues(aValue, bValue, order);
        }
        return 0;
      }
      case 'requiresVeggie': {
        if (!isNil(a.accompanimentRequired) && !isNil(b.accompanimentRequired)) {
          const aValue = (a.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
          const bValue = (b.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
          return compareValues(aValue, bValue, order);
        }
        return 0;
      }
      default:
        debugger;
        return 0;
    }
  });
};

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
      sortDishesByProperty(newState.dishes, sortOrder, sortBy);
      return newState;
    }
    default:
      return state;
  }
};
