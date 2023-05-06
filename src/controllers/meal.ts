import axios from 'axios';
import { cloneDeep, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  addScheduledMealRedux,
  clearScheduledMeals,
  deleteScheduledMealRedux,
  updateScheduledMealRedux,
  addScheduledMealsRedux,
  setMealsToResolve,
  setMealIndex,
  setPendingMeal,
  setIngredientsInGroceryList,
  addMeals,
  clearMeals,
  MealWheelDispatch,
  MealWheelVoidThunkAction,
  MealWheelVoidPromiseThunkAction
} from '../models';
import {
  getCurrentUser,
  getDishById,
  getDishes,
  getIngredientById,
  getIngredientIdsByDish,
  getMainById,
  // getSaladById,
  getScheduledMeal,
  getScheduledMealByDate,
  getScheduledMealsForDays,
  // getSideById,
  getUnassignedMeals,
  // getVeggieById
  getAccompanimentById,
} from '../selectors';

import {
  apiUrlFragment,
  DishEntity,
  // DishType,
  MealStatus,
  MealWheelState,
  // RequiredAccompanimentFlags,
  serverUrl,
  ScheduledMealEntity,
  MainDishEntity,
  BaseDishEntity,
  VerboseScheduledMeal,
  IngredientEntity,
  MealEntity
} from '../types';
import { updateDishLastProperty } from './dish';

const dateComparator = (scheduledMeal1: ScheduledMealEntity, scheduledMeal2: ScheduledMealEntity): number => {
  return scheduledMeal1.dateScheduled.getTime() - scheduledMeal2.dateScheduled.getTime();
};

export const loadScheduledMeals = (): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {

    dispatch(clearScheduledMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    const path = serverUrl + apiUrlFragment + 'scheduledMeals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {

        const scheduledMealEntities: ScheduledMealEntity[] = [];
        const rawScheduledMealEntities: any[] = (mealsResponse as any).data;
        for (const rawScheduledMealEntity of rawScheduledMealEntities) {
          const { id, userId, mainDishId, accompanimentIds, dateScheduled, status } = rawScheduledMealEntity;
          scheduledMealEntities.push({
            id,
            userId,
            mainDishId,
            accompanimentIds,
            dateScheduled: new Date(dateScheduled),
            status,
          });
        }

        scheduledMealEntities.sort(dateComparator);

        dispatch(addScheduledMealsRedux(scheduledMealEntities));

        // generate mealsToResolve
        const mealsToResolve: VerboseScheduledMeal[] = generateMealsToResolve(state, scheduledMealEntities);
        dispatch(setMealsToResolve(mealsToResolve));
        if (mealsToResolve.length > 0) {
          dispatch(setMealIndex(0));
          dispatch(setPendingMeal(mealsToResolve[0]));
        }
      });
  };
};

export const generateMeal = (mealId: string, mealDate: Date) => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    // const mealWheelState: MealWheelState = getState() as MealWheelState;
    // const meals: ScheduledMealEntity[] = generateRandomDishBasedMeals(mealWheelState, mealDate, 1, true);
    // const meal: ScheduledMealEntity = meals[0];
    // meal.id = mealId;
    // dispatch(updateScheduledMeal(mealId, meal));
  };
};

export const generateMenu = (startDate: Date, numberOfMealsToGenerate: number): MealWheelVoidThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    const mealWheelState: MealWheelState = getState() as MealWheelState;

    const randomDishBasedMeals: MealEntity[] =
      generateRandomDishBasedMeals(mealWheelState, numberOfMealsToGenerate, startDate);

    const allRandomMeals: MealEntity[] = cloneDeep(randomDishBasedMeals);
    dispatch(clearMeals());
    dispatch(addMeals(allRandomMeals));
  };
};

export const addRandomMeals = (numberOfMealsToGenerate: number, startDate: Date): MealWheelVoidThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;

    // const currentUnnassignedMeals: MealEntity[] = getUnassignedMeals(mealWheelState);

    const newUnassignedMeals: MealEntity[] =
      generateRandomDishBasedMeals(mealWheelState, numberOfMealsToGenerate, startDate);
    dispatch(addMeals(newUnassignedMeals));
  };
};

export const addToUniqueDishes = (uniqueDishes: any, dishId: string): void => {
  if (!isNil(dishId) && isNil(uniqueDishes[dishId])) {
    uniqueDishes[dishId] = dishId;
  }
};

export const generateGroceryList = (startDate: Date, numberOfMealsToGenerate: number, showStaples: boolean): MealWheelVoidThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    const state: MealWheelState = getState();

    // get all the scheduled meals for the date range for the grocery list
    const scheduledMeals: ScheduledMealEntity[] = getScheduledMealsForDays(state, startDate, numberOfMealsToGenerate);

    // get the list of dish ids for the scheduled meals for this date range - dish ids are unique
    const uniqueDishes: any = {};
    scheduledMeals.forEach((scheduledMeal: ScheduledMealEntity) => {
      const { mainDishId, accompanimentIds } = scheduledMeal;
      addToUniqueDishes(uniqueDishes, mainDishId);
      accompanimentIds.forEach((accompanimentId: string) => {
        addToUniqueDishes(uniqueDishes, accompanimentId);
      });
    });

    // get list of ingredients ids given dish ids.

    // [id: string]: string;   // key is ingredientId, value is ingredientId
    const allIngredientIds: any = {};
    for (const dishId in uniqueDishes) {
      const ingredientIdsForDish: string[] = getIngredientIdsByDish(state, dishId);
      ingredientIdsForDish.forEach((ingredientIdInDish: string) => {
        allIngredientIds[ingredientIdInDish] = ingredientIdInDish;
      });
    }

    // get list of ingredients given ingredient ids.
    const allIngredients: IngredientEntity[] = [];
    for (const ingredientId in allIngredientIds) {
      const ingredient: IngredientEntity | null = getIngredientById(state, ingredientId);
      if (!isNil(ingredient) && (ingredient.showInGroceryList || showStaples)) {
        allIngredients.push(ingredient);
      }
    }

    dispatch(setIngredientsInGroceryList(allIngredients));
  };

};

// TEDTODO - DishesByDishType or DishIdsByDishType??
interface DishesByDishType {
  [id: string]: DishEntity[];   // key is dishType (string), value is array of dishIds for this dishType.
}
interface DishIndicesByDishType {
  [id: string]: number[];   // key is dishType (string), value is array of indices into another data structure
}

const generateDishesByDishType = (mealWheelState: MealWheelState): DishesByDishType => {

  const dishesByDishType: DishesByDishType = {};

  // populate data structure mapping each dish type to a list of dishes of that type
  const allDishes: DishEntity[] = getDishes(mealWheelState);
  allDishes.forEach((dish: DishEntity, index: number) => {
    if (!Object.prototype.hasOwnProperty.call(dishesByDishType, dish.type)) {
      dishesByDishType[dish.type] = [];
    }
    dishesByDishType[dish.type].push(dish);
  });

  return dishesByDishType;
};

const generateDishIndicesByDishType = (mealWheelState: MealWheelState): DishIndicesByDishType => {

  const dishIndicesByDishType: DishIndicesByDishType = {};

  // populate data structure mapping each dish type to a list of dishes of that type
  const allDishes: DishEntity[] = getDishes(mealWheelState);
  allDishes.forEach((dish: DishEntity, index: number) => {
    if (!Object.prototype.hasOwnProperty.call(dishIndicesByDishType, dish.type)) {
      dishIndicesByDishType[dish.type] = [];
    }
    dishIndicesByDishType[dish.type].push(index);
  });

  return dishIndicesByDishType;
};

const selectMainDishes = (
  mealWheelState: MealWheelState,
  startDate: Date,
  numMainDishes: number,
  dishIndicesByDishType: DishIndicesByDishType): number[] => {

  const allDishes: DishEntity[] = getDishes(mealWheelState);

  const allMainDishIndices: number[] = dishIndicesByDishType['main'];

  const selectedMainDishIndices: number[] = [];

  while (selectedMainDishIndices.length < numMainDishes) {

    const mainDishIndex = Math.floor(Math.random() * allMainDishIndices.length);

    // don't add this main dish if it has already been added
    if (!selectedMainDishIndices.includes(allMainDishIndices[mainDishIndex])) {

      // don't add this main dish if it was last suggested within a number of days < minimum days between assignments
      const mainDish: DishEntity | null = getMainById(mealWheelState, allDishes[allMainDishIndices[mainDishIndex]].id);

      if (!isNil(mainDish)) {
        selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
        // TEDTODO
        // if (!isNil(mainDish.last)) {
        //   const earliestTimeToRecommend: number = mainDish.last.getTime() + (mainDish.minimumInterval * (1000 * 3600 * 24));
        //   if (earliestTimeToRecommend < startDate.getTime()) {
        //     selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
        //   }
        // } else {
        //   selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
        // }
      }
    }
  }

  return selectedMainDishIndices;
};

// TEDTODO - avoid infinite loops
const generateRandomDishBasedMeals = (mealWheelState: MealWheelState, numMeals: number, startDate: Date): MealEntity[] => {

  const mealEntities: MealEntity[] = [];

  const dishesByDishType: DishesByDishType = generateDishesByDishType(mealWheelState);
  const dishIndicesByDishType: DishIndicesByDishType = generateDishIndicesByDishType(mealWheelState);

  // TODO - refactor remaining code in this function - multiple functions

  const selectedMainDishIndices = selectMainDishes(mealWheelState, startDate, numMeals, dishIndicesByDishType);

  const allDishes: DishEntity[] = getDishes(mealWheelState);

  for (const selectedMainDishIndex of selectedMainDishIndices) {

    const mainDish: DishEntity = allDishes[selectedMainDishIndex];

    const numAccompanimentsRequired: number = mainDish.numAccompanimentsRequired as number;
    const allowableAccompanimentTypes: string[] = cloneDeep(mainDish.allowableAccompanimentTypes as string[]);
    // const selectedAccompanimentIds: string[] = [];
    const selectedAccompanimentDishes: DishEntity[] = [];

    let accompanimentsAcquired: number = 0;
    while (accompanimentsAcquired < numAccompanimentsRequired) {

      // select accompaniment type from allowable accompaniment types, ensuring that this accompaniment type has not already been selected for this main

      const accompanimentTypeIndex: number = Math.floor(Math.random() * allowableAccompanimentTypes.length);
      const accompanimentType: string = allowableAccompanimentTypes[accompanimentTypeIndex];

      // accompaniments of set accompanimentType
      const accompanimentDishes: DishEntity[] = dishesByDishType[accompanimentType];
      // const accompanimentDishIndicesForThisAccompanimentType: number[] = dishIndicesByDishType[accompanimentType];  // indices into allDishes

      // get one of the accompaniments from this list
      const numAccompanimentsOfThisType: number = accompanimentDishes.length;
      const accompanimentDishIndex = Math.floor(Math.random() * numAccompanimentsOfThisType);

      const selectedAccompanimentDish: DishEntity | null = accompanimentDishes[accompanimentDishIndex];

      if (!isNil(selectedAccompanimentDish)) {

        // add accompaniment
        selectedAccompanimentDishes.push(selectedAccompanimentDish);

        // remove this accompaniment type from allowableAccompanimentTypes
        allowableAccompanimentTypes.splice(accompanimentTypeIndex, 1);

        accompanimentsAcquired++;
      }

    }

    const mealId = uuidv4();
    const meal: MealEntity = {
      id: mealId,
      mainDish: getDishById(mealWheelState, mainDish.id) as DishEntity,
      accompanimentDishes: selectedAccompanimentDishes,
    };

    mealEntities.push(meal);

  }

  return mealEntities;
};

const getAccompanimentIndex = (
  mealWheelState: MealWheelState,
  accompanimentIndices: number[],
  startDate: Date
): string | null => {

  const allDishes: DishEntity[] = getDishes(mealWheelState);

  const accompanimentIndex = accompanimentIndices[Math.floor(Math.random() * accompanimentIndices.length)];
  const accompanimentId = allDishes[accompanimentIndex].id;
  const accompaniment: DishEntity | null = getDishById(mealWheelState, accompanimentId);
  if (!isNil(accompaniment)) {
    if (!isNil(accompaniment.last)) {
      const earliestTimeToRecommend: number = accompaniment.last.getTime() + (accompaniment.minimumInterval * (1000 * 3600 * 24));
      if (earliestTimeToRecommend < startDate.getTime()) {
        return accompanimentId;
      } else {
        return null;
      }
    } else {
      return accompanimentId;
    }
  }

  return null;
};

const updateMealDishesLastProperty = (
  meal: MealEntity,
  date: Date,
): any => {
  return (dispatch: MealWheelDispatch,) => {
    dispatch(updateDishLastProperty(meal.mainDish, date));
    if (!isNil(meal.accompanimentDishes)) {
      meal.accompanimentDishes.forEach((accompanimentDish: DishEntity) => {
        dispatch(updateDishLastProperty(accompanimentDish, date));
      });
    }
  };
};

export const assignMealToDate = (
  meal: MealEntity,
  date: Date,
): MealWheelVoidThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    dispatch(updateMealDishesLastProperty(meal, date));

    const mealWheelState: MealWheelState = getState();

    const mealId = uuidv4();

    const accompanimentIds: string[] = [];
    if (!isNil(meal.accompanimentDishes)) {
      meal.accompanimentDishes.forEach((accompanimentDish: DishEntity) => {
        accompanimentIds.push(accompanimentDish.id);
      });
    }

    const scheduledMeal: ScheduledMealEntity = {
      id: mealId,
      userId: getCurrentUser(mealWheelState) as string,
      mainDishId: meal.mainDish.id,
      accompanimentIds,
      dateScheduled: date,
      status: MealStatus.pending
    };

    dispatch(addScheduledMeal(scheduledMeal));
  };
};

export const updateMealAssignedToDate = (
  meal: MealEntity,
  date: Date,
): MealWheelVoidThunkAction => {

  return (dispatch: MealWheelDispatch, getState: any) => {

    dispatch(updateMealDishesLastProperty(meal, date));

    const mealWheelState: MealWheelState = getState();

    const scheduledMeal: ScheduledMealEntity | null = getScheduledMealByDate(mealWheelState, date);

    const accompanimentIds: string[] = [];
    if (!isNil(scheduledMeal)) {
      scheduledMeal.accompanimentIds
      scheduledMeal.accompanimentIds.forEach((accompanimentDishId: string) => {
        accompanimentIds.push(accompanimentDishId);
      });
    }


    if (!isNil(scheduledMeal)) {
      scheduledMeal.mainDishId = meal.mainDish.id;
      scheduledMeal.accompanimentIds = accompanimentIds;
      dispatch(updateScheduledMeal(scheduledMeal.id, scheduledMeal));
    }
  };
};

export const addScheduledMeal = (
  scheduledMeal: ScheduledMealEntity
): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch): any => {

    const path = serverUrl + apiUrlFragment + 'addScheduledMeal';

    scheduledMeal.id = uuidv4();

    const addMealBody: any = {
      id: scheduledMeal.id,
      scheduledMeal,
    };

    return axios.post(
      path,
      addMealBody
    ).then((response) => {
      dispatch(addScheduledMealRedux(scheduledMeal.id, scheduledMeal));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  };
};

export const updateScheduledMeal = (
  id: string,
  meal: ScheduledMealEntity
): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch): any => {

    dispatch(updateScheduledMealRedux(id, meal));
    // dispatch(setScheduledMealsToResolve());

    const path = serverUrl + apiUrlFragment + 'updateMeal';

    // TODO - better way to do the following?
    const mealWithRightId: ScheduledMealEntity = cloneDeep(meal);
    mealWithRightId.id = id;

    const updateMealBody: any = {
      id,
      meal: mealWithRightId,
    };

    return axios.post(
      path,
      updateMealBody
    ).then((response) => {
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  };
};

export const deleteScheduledMeal = (
  id: string,
): MealWheelVoidPromiseThunkAction => {
  return (dispatch: MealWheelDispatch): any => {

    dispatch(deleteScheduledMealRedux(id));

    const path = serverUrl + apiUrlFragment + 'deleteScheduledMeal';

    const deleteMealBody: any = {
      id,
    };

    return axios.post(
      path,
      deleteMealBody
    ).then((response) => {
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  };
};

export const updateMainInMeal = (
  mealId: string,
  newMainId: string,
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newMain: MainDishEntity | null = getDishById(mealWheelState, newMainId) as MainDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(newMain) && !isNil(meal)) {
      meal.mainDishId = newMainId;
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateAccompanimentInMeal = (
  mealId: string,
  accompanimentTypeId: string,
  accompanimentId: string
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);

    const accompaniment: BaseDishEntity | null = getDishById(mealWheelState, accompanimentId) as BaseDishEntity;
    if (!isNil(meal)) {
      const newMeal: ScheduledMealEntity = cloneDeep(meal);
      if (!isNil(accompaniment)) {
        for (let accompanimentIndex = 0; accompanimentIndex < meal.accompanimentIds.length; accompanimentIndex++) {
          const mealAccompanimentId = meal.accompanimentIds[accompanimentIndex];
          const existingAccompaniment = getDishById(mealWheelState, mealAccompanimentId);
          if (!isNil(existingAccompaniment) && existingAccompaniment.type === accompaniment.type) {
            // replace
            newMeal.accompanimentIds[accompanimentIndex] = accompanimentId;
            dispatch(updateScheduledMeal(meal.id, newMeal));
            return;
          }
        }
      }
    }
  };
};


export const updateSideInMeal = (
  mealId: string,
  newSideId: string,
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newSide: BaseDishEntity | null = getDishById(mealWheelState, newSideId) as BaseDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      // if (!isNil(newSide)) {
      //   meal.sideId = newSideId;
      // } else {
      //   meal.sideId = '';
      // }
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateSaladInMeal = (
  mealId: string,
  newSaladId: string,
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newSalad: BaseDishEntity | null = getDishById(mealWheelState, newSaladId) as BaseDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      // if (!isNil(newSalad)) {
      //   meal.saladId = newSaladId;
      // } else {
      //   meal.saladId = '';
      // }
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateVeggieInMeal = (
  mealId: string,
  newVeggieId: string,
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newVeggie: BaseDishEntity | null = getDishById(mealWheelState, newVeggieId) as BaseDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      // if (!isNil(newVeggie)) {
      //   meal.veggieId = newVeggieId;
      // } else {
      //   meal.veggieId = '';
      // }
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateMealStatus = (
  mealId: string,
  mealStatus: MealStatus,
): MealWheelVoidThunkAction => {
  return (dispatch: MealWheelDispatch, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      const newMeal = cloneDeep(meal);
      newMeal.status = mealStatus;
      dispatch(updateScheduledMeal(meal.id, newMeal));
    }
  };
};

const generateMealsToResolve = (state: MealWheelState, scheduledMeals: ScheduledMealEntity[]): VerboseScheduledMeal[] => {

  const verboseScheduledMealsToResolve: VerboseScheduledMeal[] = [];

  const currentDate: Date = new Date();
  const scheduledMealsToResolve: ScheduledMealEntity[] = [];
  for (const scheduledMeal of scheduledMeals) {
    const mealDateAsStr = scheduledMeal.dateScheduled;
    const mealDate: Date = new Date(mealDateAsStr);
    if ((mealDate.getTime() < currentDate.getTime()) && (mealDate.getDate() !== currentDate.getDate())) {
      if (scheduledMeal.status === MealStatus.pending) {
        scheduledMealsToResolve.push(scheduledMeal);

        const main: DishEntity | null = isNil(scheduledMeal.mainDishId) ? null : getMainById(state, scheduledMeal.mainDishId);
        const mainDishName: string = isNil(scheduledMeal.mainDishId) ? '' :
          isNil(getMainById(state, scheduledMeal.mainDishId)) ? '' : (getMainById(state, scheduledMeal.mainDishId) as DishEntity).name;

        // const veggie: DishEntity | null = isNil(scheduledMeal.veggieId) ? null : getVeggieById(state, scheduledMeal.veggieId);
        // const veggieName: string = isNil(scheduledMeal.veggieId) ? '' :
        //   isNil(getVeggieById(state, scheduledMeal.veggieId)) ? '' : (getVeggieById(state, scheduledMeal.veggieId) as DishEntity).name;

        // const side: DishEntity | null = isNil(scheduledMeal.sideId) ? null : getSideById(state, scheduledMeal.sideId);
        // const sideName: string = isNil(scheduledMeal.sideId) ? '' :
        //   isNil(getSideById(state, scheduledMeal.sideId)) ? '' : (getSideById(state, scheduledMeal.sideId) as DishEntity).name;

        // const salad: DishEntity | null = isNil(scheduledMeal.saladId) ? null : getSaladById(state, scheduledMeal.saladId);
        // const saladName: string = isNil(scheduledMeal.saladId) ? '' :
        //   isNil(getSaladById(state, scheduledMeal.saladId)) ? '' : (getSaladById(state, scheduledMeal.saladId) as DishEntity).name;

        const verboseScheduledMeal: VerboseScheduledMeal = {
          ...scheduledMeal,
          main,
          mainName: mainDishName,
          accompaniments: [],
          accompanimentNames: [],
          // salad,
          // saladName,
          // veggie,
          // veggieName,
          // side,
          // sideName,
        };

        verboseScheduledMealsToResolve.push(verboseScheduledMeal);
      }
    }
  }

  return verboseScheduledMealsToResolve;
};
