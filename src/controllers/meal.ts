import axios from 'axios';
import { cloneDeep, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  addScheduledMealRedux,
  addDefinedMealsRedux,
  clearDefinedMeals,
  clearScheduledMeals,
  deleteScheduledMealRedux,
  updateScheduledMealRedux,
  addScheduledMealsRedux,
  setMealsToResolve,
  setMealIndex,
  setPendingMeal,
  setIngredientsInGroceryList,
  addMeals,
  clearMeals
} from '../models';
import {
  getCurrentUser,
  getDefinedMeals,
  getDish,
  getIngredientById,
  getIngredientIdsByDish,
  getMainById,
  getSaladById,
  getScheduledMeal,
  getScheduledMealByDate,
  getScheduledMealsForDays,
  getSideById,
  getVeggieById
} from '../selectors';

import {
  apiUrlFragment,
  DishEntity,
  DishType,
  MealStatus,
  MealWheelState,
  RequiredAccompanimentFlags,
  DefinedMealEntity,
  serverUrl,
  ScheduledMealEntity,
  MainDishEntity,
  BaseDishEntity,
  VerboseScheduledMeal,
  IngredientEntity,
  MealEntity
} from '../types';

export const loadDefinedMeals = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearDefinedMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    const path = serverUrl + apiUrlFragment + 'definedMeals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {
        const definedMealEntities: DefinedMealEntity[] = (mealsResponse as any).data;
        dispatch(addDefinedMealsRedux(definedMealEntities));
      });
  };
};

const dateComparator = (scheduledMeal1: ScheduledMealEntity, scheduledMeal2: ScheduledMealEntity): number => {
  return scheduledMeal1.dateScheduled.getTime() - scheduledMeal2.dateScheduled.getTime();
};

export const loadScheduledMeals = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearScheduledMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    const path = serverUrl + apiUrlFragment + 'scheduledMeals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {

        const scheduledMealEntities: ScheduledMealEntity[] = [];
        const rawScheduledMealEntities: any[] = (mealsResponse as any).data;
        for (const rawScheduledMealEntity of rawScheduledMealEntities) {
          const { id, userId, mainDishId, saladId, veggieId, sideId, dateScheduled, status } = rawScheduledMealEntity;
          scheduledMealEntities.push({
            id,
            userId,
            mainDishId,
            saladId,
            veggieId,
            sideId,
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
  return (dispatch: any, getState: any) => {
    // const mealWheelState: MealWheelState = getState() as MealWheelState;
    // const meals: ScheduledMealEntity[] = generateRandomDishBasedMeals(mealWheelState, mealDate, 1, true);
    // const meal: ScheduledMealEntity = meals[0];
    // meal.id = mealId;
    // dispatch(updateScheduledMeal(mealId, meal));
  };
};

export const generateMenu = (startDate: Date, numberOfMealsToGenerate: number, overwriteExistingMeals: boolean) => {

  return (dispatch: any, getState: any) => {

    const mealWheelState: MealWheelState = getState() as MealWheelState;

    const randomDishBasedMeals: MealEntity[] =
      generateRandomDishBasedMeals(mealWheelState, numberOfMealsToGenerate);

    const allRandomMeals: MealEntity[] = cloneDeep(randomDishBasedMeals);
    dispatch(clearMeals());
    dispatch(addMeals(allRandomMeals));
  };
};

export const addToUniqueDishes = (uniqueDishes: any, dishId: string): void => {
  if (!isNil(dishId) && isNil(uniqueDishes[dishId])) {
    uniqueDishes[dishId] = dishId;
  }
};

export const generateGroceryList = (startDate: Date, numberOfMealsToGenerate: number, showStaples: boolean) => {

  return (dispatch: any, getState: any) => {

    const state: MealWheelState = getState();

    // get all the scheduled meals for the date range for the grocery list
    const scheduledMeals: ScheduledMealEntity[] = getScheduledMealsForDays(state, startDate, numberOfMealsToGenerate);

    // get the list of dish ids for the scheduled meals for this date range - dish ids are unique
    const uniqueDishes: any = {};
    scheduledMeals.forEach((scheduledMeal: ScheduledMealEntity) => {
      const { mainDishId, saladId, veggieId, sideId } = scheduledMeal;
      addToUniqueDishes(uniqueDishes, mainDishId);
      addToUniqueDishes(uniqueDishes, saladId);
      addToUniqueDishes(uniqueDishes, veggieId);
      addToUniqueDishes(uniqueDishes, sideId);
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

const generateRandomDishBasedMeals = (mealWheelState: MealWheelState, numMeals: number): MealEntity[] => {

  const mealEntities: MealEntity[] = [];

  const allMainDishIndices: number[] = [];
  const allSaladIndices: number[] = [];
  const allSideIndices: number[] = [];
  const allVegIndices: number[] = [];

  const selectedMainDishIndices: number[] = [];

  const allDishes: DishEntity[] = mealWheelState.dishesState.dishes;
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
    if (!selectedMainDishIndices.includes(allMainDishIndices[mainDishIndex])) {
      selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
    }
  }

  for (const selectedMainDishIndex of selectedMainDishIndices) {

    const selectedDish: DishEntity = allDishes[selectedMainDishIndex];

    let saladId: string = '';
    let veggieId: string = '';
    let sideId: string = '';

    // if accompaniment to main is required, select it.
    if (!isNil(selectedDish.accompanimentRequired) && selectedDish.accompanimentRequired !== RequiredAccompanimentFlags.None) {
      const possibleAccompaniments: DishType[] = [];
      if (selectedDish.accompanimentRequired & RequiredAccompanimentFlags.Salad) {
        possibleAccompaniments.push(DishType.Salad);
      }
      if (selectedDish.accompanimentRequired & RequiredAccompanimentFlags.Side) {
        possibleAccompaniments.push(DishType.Side);
      }
      if (selectedDish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) {
        possibleAccompaniments.push(DishType.Veggie);
      }
      const numPossibleAccompaniments = possibleAccompaniments.length;
      const accompanimentTypeIndex = Math.floor(Math.random() * numPossibleAccompaniments);
      const accompanimentType: DishType = possibleAccompaniments[accompanimentTypeIndex];

      let accompanimentIndex = -1;
      switch (accompanimentType) {
        case DishType.Salad: {
          accompanimentIndex = allSaladIndices[Math.floor(Math.random() * allSaladIndices.length)];
          saladId = allDishes[accompanimentIndex].id;
          break;
        }
        case DishType.Side: {
          accompanimentIndex = allSideIndices[Math.floor(Math.random() * allSideIndices.length)];
          sideId = allDishes[accompanimentIndex].id;
          break;
        }
        case DishType.Veggie: {
          accompanimentIndex = allVegIndices[Math.floor(Math.random() * allVegIndices.length)];
          veggieId = allDishes[accompanimentIndex].id;
          break;
        }
      }
    }

    const mealId = uuidv4();
    const meal: MealEntity = {
      id: mealId,
      mainDish: getDish(mealWheelState, selectedDish.id) as DishEntity,
      salad: saladId !== '' ? getDish(mealWheelState, saladId) as DishEntity : undefined,
      veggie: veggieId !== '' ? getDish(mealWheelState, veggieId) as DishEntity : undefined,
      side: sideId !== '' ? getDish(mealWheelState, sideId) as DishEntity : undefined,
    };

    mealEntities.push(meal);
  }

  return mealEntities;
};


const getRandomPredefinedMeals = (mealWheelState: MealWheelState, alreadyScheduledMeals: ScheduledMealEntity[], numMeals: number): ScheduledMealEntity[] => {

  const allDefinedMeals: DefinedMealEntity[] = getDefinedMeals(mealWheelState);

  const selectedMainDishIds: string[] = [];

  for (const alreadyScheduledMeal of alreadyScheduledMeals) {
    selectedMainDishIds.push(alreadyScheduledMeal.mainDishId);
  }

  const selectedDefinedMeals: DefinedMealEntity[] = [];

  while (selectedDefinedMeals.length < numMeals) {
    const definedMealIndex = Math.floor(Math.random() * allDefinedMeals.length);
    const selectedDefinedMeal: DefinedMealEntity = allDefinedMeals[definedMealIndex];
    const selectedDefinedMealMainDishId = selectedDefinedMeal.mainDishId;
    if (!selectedMainDishIds.includes(selectedDefinedMealMainDishId)) {
      selectedDefinedMeals.push(selectedDefinedMeal);
      selectedMainDishIds.push(selectedDefinedMealMainDishId);
    }
  }

  const scheduledMealEntities: ScheduledMealEntity[] = [];

  const mealDate: Date = new Date();

  for (const selectedDefinedMeal of selectedDefinedMeals) {

    const { mainDishId, saladId, veggieId, sideId } = selectedDefinedMeal;
    const mealId = uuidv4();
    const scheduledMeal: ScheduledMealEntity = {
      id: mealId,
      userId: getCurrentUser(mealWheelState) as string,
      mainDishId,
      saladId,
      veggieId,
      sideId,
      dateScheduled: mealDate,        // placeholder
      status: MealStatus.pending
    };

    scheduledMealEntities.push(scheduledMeal);

  }

  return scheduledMealEntities;
};

const oldgenerateRandomDishBasedMeals = (mealWheelState: MealWheelState, startDate: Date, numMeals: number, overwriteExistingMeals: boolean): ScheduledMealEntity[] => {

  const scheduledMealEntities: ScheduledMealEntity[] = [];

  const allMainDishIndices: number[] = [];
  const allSaladIndices: number[] = [];
  const allSideIndices: number[] = [];
  const allVegIndices: number[] = [];

  const selectedMainDishIndices: number[] = [];

  const allDishes: DishEntity[] = mealWheelState.dishesState.dishes;
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
    if (!selectedMainDishIndices.includes(allMainDishIndices[mainDishIndex])) {
      selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
    }
  }

  let mealDate: Date = cloneDeep(startDate);

  for (const selectedMainDishIndex of selectedMainDishIndices) {

    const selectedDish: DishEntity = allDishes[selectedMainDishIndex];

    let saladId: string = '';
    let veggieId: string = '';
    let sideId: string = '';

    // if accompaniment to main is required, select it.
    if (!isNil(selectedDish.accompanimentRequired) && selectedDish.accompanimentRequired !== RequiredAccompanimentFlags.None) {
      const possibleAccompaniments: DishType[] = [];
      if (selectedDish.accompanimentRequired & RequiredAccompanimentFlags.Salad) {
        possibleAccompaniments.push(DishType.Salad);
      }
      if (selectedDish.accompanimentRequired & RequiredAccompanimentFlags.Side) {
        possibleAccompaniments.push(DishType.Side);
      }
      if (selectedDish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) {
        possibleAccompaniments.push(DishType.Veggie);
      }
      const numPossibleAccompaniments = possibleAccompaniments.length;
      const accompanimentTypeIndex = Math.floor(Math.random() * numPossibleAccompaniments);
      const accompanimentType: DishType = possibleAccompaniments[accompanimentTypeIndex];

      let accompanimentIndex = -1;
      switch (accompanimentType) {
        case DishType.Salad: {
          accompanimentIndex = allSaladIndices[Math.floor(Math.random() * allSaladIndices.length)];
          saladId = allDishes[accompanimentIndex].id;
          break;
        }
        case DishType.Side: {
          accompanimentIndex = allSideIndices[Math.floor(Math.random() * allSideIndices.length)];
          sideId = allDishes[accompanimentIndex].id;
          break;
        }
        case DishType.Veggie: {
          accompanimentIndex = allVegIndices[Math.floor(Math.random() * allVegIndices.length)];
          veggieId = allDishes[accompanimentIndex].id;
          break;
        }
      }
    }

    const mealId = uuidv4();
    const scheduledMeal: ScheduledMealEntity = {
      id: mealId,
      userId: getCurrentUser(mealWheelState) as string,
      mainDishId: selectedDish.id,
      saladId,
      veggieId,
      sideId,
      dateScheduled: mealDate,
      status: MealStatus.pending
    };

    scheduledMealEntities.push(scheduledMeal);

    // update property 'last' for all dishes in meal

    mealDate = cloneDeep(mealDate);
    mealDate.setTime(mealDate.getTime() + (24 * 60 * 60 * 1000));
  }

  return scheduledMealEntities;
};

export const assignMealToDate = (
  meal: MealEntity,
  date: Date,
) => {

  return (dispatch: any, getState: any) => {

    const mealWheelState: MealWheelState = getState();

    const mealId = uuidv4();
    const scheduledMeal: ScheduledMealEntity = {
      id: mealId,
      userId: getCurrentUser(mealWheelState) as string,
      mainDishId: meal.mainDish.id,
      saladId: isNil(meal.salad) ? '' : meal.salad.id,
      veggieId: isNil(meal.veggie) ? '' : meal.veggie.id,
      sideId: isNil(meal.side) ? '' : meal.side.id,
      dateScheduled: date,
      status: MealStatus.pending
    };

    dispatch(addScheduledMeal(scheduledMeal));
  };
};

export const updateMealAssignedToDate = (
  meal: MealEntity,
  date: Date,
) => {

  return (dispatch: any, getState: any) => {

    const mealWheelState: MealWheelState = getState();

    const scheduledMeal: ScheduledMealEntity | null = getScheduledMealByDate(mealWheelState, date);
    if (!isNil(scheduledMeal)) {
      scheduledMeal.mainDishId = meal.mainDish.id;
      scheduledMeal.saladId = isNil(meal.salad) ? '' : meal.salad.id;
      scheduledMeal.sideId = isNil(meal.side) ? '' : meal.side.id;
      scheduledMeal.veggieId = isNil(meal.veggie) ? '' : meal.veggie.id;
      dispatch(updateScheduledMeal(scheduledMeal.id, scheduledMeal));
    }
  };
};

export const addScheduledMeal = (
  scheduledMeal: ScheduledMealEntity
): any => {
  return ((dispatch: any): any => {

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

  });
};

export const updateScheduledMeal = (
  id: string,
  meal: ScheduledMealEntity
): any => {
  return ((dispatch: any): any => {

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

  });
};

export const deleteScheduledMeal = (
  id: string,
) => {
  return ((dispatch: any): any => {

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

  });
};

export const updateMainInMeal = (
  mealId: string,
  newMainId: string,
): any => {
  return (dispatch: any, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newMain: MainDishEntity | null = getDish(mealWheelState, newMainId) as MainDishEntity;
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
): any => {
  return (dispatch: any, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newSide: BaseDishEntity | null = getDish(mealWheelState, newSideId) as BaseDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      if (!isNil(newSide)) {
        meal.sideId = newSideId;
      } else {
        meal.sideId = '';
      }
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateSaladInMeal = (
  mealId: string,
  newSaladId: string,
): any => {
  return (dispatch: any, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newSalad: BaseDishEntity | null = getDish(mealWheelState, newSaladId) as BaseDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      if (!isNil(newSalad)) {
        meal.saladId = newSaladId;
      } else {
        meal.saladId = '';
      }
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateVeggieInMeal = (
  mealId: string,
  newVeggieId: string,
): any => {
  return (dispatch: any, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newVeggie: BaseDishEntity | null = getDish(mealWheelState, newVeggieId) as BaseDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(meal)) {
      if (!isNil(newVeggie)) {
        meal.veggieId = newVeggieId;
      } else {
        meal.veggieId = '';
      }
      dispatch(updateScheduledMeal(meal.id, meal));
    }
  };
};

export const updateMealStatus = (
  mealId: string,
  mealStatus: MealStatus,
): any => {
  return (dispatch: any, getState: any) => {
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

        const veggie: DishEntity | null = isNil(scheduledMeal.veggieId) ? null : getVeggieById(state, scheduledMeal.veggieId);
        const veggieName: string = isNil(scheduledMeal.veggieId) ? '' :
          isNil(getVeggieById(state, scheduledMeal.veggieId)) ? '' : (getVeggieById(state, scheduledMeal.veggieId) as DishEntity).name;

        const side: DishEntity | null = isNil(scheduledMeal.sideId) ? null : getSideById(state, scheduledMeal.sideId);
        const sideName: string = isNil(scheduledMeal.sideId) ? '' :
          isNil(getSideById(state, scheduledMeal.sideId)) ? '' : (getSideById(state, scheduledMeal.sideId) as DishEntity).name;

        const salad: DishEntity | null = isNil(scheduledMeal.saladId) ? null : getSaladById(state, scheduledMeal.saladId);
        const saladName: string = isNil(scheduledMeal.saladId) ? '' :
          isNil(getSaladById(state, scheduledMeal.saladId)) ? '' : (getSaladById(state, scheduledMeal.saladId) as DishEntity).name;

        const verboseScheduledMeal: VerboseScheduledMeal = {
          ...scheduledMeal,
          main,
          mainName: mainDishName,
          salad,
          saladName,
          veggie,
          veggieName,
          side,
          sideName,
        };

        verboseScheduledMealsToResolve.push(verboseScheduledMeal);
      }
    }
  }

  return verboseScheduledMealsToResolve;
};
