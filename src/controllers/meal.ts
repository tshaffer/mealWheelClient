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
            // saladId,
            // veggieId,
            // sideId,
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
      // const { mainDishId, saladId, veggieId, sideId } = scheduledMeal;
      const { mainDishId } = scheduledMeal;
      addToUniqueDishes(uniqueDishes, mainDishId);
      // addToUniqueDishes(uniqueDishes, saladId);
      // addToUniqueDishes(uniqueDishes, veggieId);
      // addToUniqueDishes(uniqueDishes, sideId);
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

const generateRandomDishBasedMeals = (mealWheelState: MealWheelState, numMeals: number, startDate: Date): MealEntity[] => {

  const mealEntities: MealEntity[] = [];

  const allMainDishIndices: number[] = [];
  const allSaladIndices: number[] = [];
  const allSideIndices: number[] = [];
  const allVegIndices: number[] = [];

  const selectedMainDishIndices: number[] = [];

  const allDishes: DishEntity[] = getDishes(mealWheelState);
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
      case 'veggie':
        allVegIndices.push(index);
        break;
    }
  });

  // select random main dish items
  while (selectedMainDishIndices.length < numMeals) {
    const mainDishIndex = Math.floor(Math.random() * allMainDishIndices.length);

    // don't add this main dish if it has already been added
    if (!selectedMainDishIndices.includes(allMainDishIndices[mainDishIndex])) {

      // selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
      // }

      // don't add this main dish if it was last suggested within a number of days < minimum days between assignments
      const mainDish: DishEntity | null = getMainById(mealWheelState, allDishes[allMainDishIndices[mainDishIndex]].id);
      if (!isNil(mainDish)) {
        if (!isNil(mainDish.last)) {
          const earliestTimeToRecommend: number = mainDish.last.getTime() + (mainDish.minimumInterval * (1000 * 3600 * 24));
          if (earliestTimeToRecommend < startDate.getTime()) {
            selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
          }
        } else {
          selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
        }
      }
    }
  }

  for (const selectedMainDishIndex of selectedMainDishIndices) {

    const mainDish: DishEntity = allDishes[selectedMainDishIndex];

    // let saladId: string | null = null;
    // let veggieId: string | null = null;
    // let sideId: string | null = null;

    // if accompaniment to main is required, procure it.

    // get list of possible accompaniment types for this main dish
    // if (!isNil(mainDish.accompanimentRequired) && mainDish.accompanimentRequired !== RequiredAccompanimentFlags.None) {
    //   const possibleAccompaniments: DishType[] = [];
    //   if (mainDish.accompanimentRequired & RequiredAccompanimentFlags.Salad) {
    //     possibleAccompaniments.push(DishType.Salad);
    //   }
    //   if (mainDish.accompanimentRequired & RequiredAccompanimentFlags.Side) {
    //     possibleAccompaniments.push(DishType.Side);
    //   }
    //   if (mainDish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) {
    //     possibleAccompaniments.push(DishType.Veggie);
    //   }
    //   const numPossibleAccompaniments = possibleAccompaniments.length;

    //   // select accompaniment from the possible accompaniments
    //   // don't select one that has been used within the minimum time between uses
    //   let accompanimentSelected = false;
    //   let noPossibleAccompaniments = false;
    //   // TEDTODO - ensure no infinite loop
    //   // Infinite loop occurs if
    //   //    mainDish requires an accompaniment (of only one type) and no accompaniments are available
    //   while (!accompanimentSelected && !noPossibleAccompaniments) {
    //     const accompanimentTypeIndex = Math.floor(Math.random() * numPossibleAccompaniments);
    //     const accompanimentType: DishType = possibleAccompaniments[accompanimentTypeIndex];
    //     switch (accompanimentType) {
    //       case DishType.Salad: {
    //         if (allSaladIndices.length > 0) {
    //           saladId = getAccompanimentIndex(mealWheelState, allSaladIndices, startDate);
    //           if (!isNil(saladId)) {
    //             accompanimentSelected = true;
    //           }
    //         } else {
    //           // TEDTODO temporary - other types might be possible??
    //           noPossibleAccompaniments = true;
    //         }
    //         break;
    //       }
    //       case DishType.Side: {
    //         if (allSideIndices.length > 0) {
    //           sideId = getAccompanimentIndex(mealWheelState, allSideIndices, startDate);
    //           if (!isNil(sideId)) {
    //             accompanimentSelected = true;
    //           }
    //         } else {
    //           // TEDTODO temporary - other types might be possible??
    //           noPossibleAccompaniments = true;
    //         }
    //         break;
    //       }
    //       case DishType.Veggie: {
    //         if (allVegIndices.length > 0) {
    //           veggieId = getAccompanimentIndex(mealWheelState, allVegIndices, startDate);
    //           if (!isNil(veggieId)) {
    //             accompanimentSelected = true;
    //           }
    //         } else {
    //           // TEDTODO temporary - other types might be possible??
    //           noPossibleAccompaniments = true;
    //         }
    //       }
    //         break;
    //     }
    //   }
    // }


    const mealId = uuidv4();
    const meal: MealEntity = {
      id: mealId,
      mainDish: getDishById(mealWheelState, mainDish.id) as DishEntity,
      // salad: !isNil(saladId) ? getDishById(mealWheelState, saladId) as DishEntity : undefined,
      // veggie: !isNil(veggieId) ? getDishById(mealWheelState, veggieId) as DishEntity : undefined,
      // side: !isNil(sideId) ? getDishById(mealWheelState, sideId) as DishEntity : undefined,
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
    // if (!isNil(meal.salad)) {
    //   dispatch(updateDishLastProperty(meal.salad, date));
    // }
    // if (!isNil(meal.veggie)) {
    //   dispatch(updateDishLastProperty(meal.veggie, date));
    // }
    // if (!isNil(meal.side)) {
    //   dispatch(updateDishLastProperty(meal.side, date));
    // }
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
    const scheduledMeal: ScheduledMealEntity = {
      id: mealId,
      userId: getCurrentUser(mealWheelState) as string,
      mainDishId: meal.mainDish.id,
      accompanimentIds: [],
      // saladId: isNil(meal.salad) ? '' : meal.salad.id,
      // veggieId: isNil(meal.veggie) ? '' : meal.veggie.id,
      // sideId: isNil(meal.side) ? '' : meal.side.id,
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
    if (!isNil(scheduledMeal)) {
      scheduledMeal.mainDishId = meal.mainDish.id;
      // scheduledMeal.saladId = isNil(meal.salad) ? '' : meal.salad.id;
      // scheduledMeal.sideId = isNil(meal.side) ? '' : meal.side.id;
      // scheduledMeal.veggieId = isNil(meal.veggie) ? '' : meal.veggie.id;
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
