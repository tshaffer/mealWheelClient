import axios from 'axios';
import { cloneDeep, isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import {
  addScheduledMealRedux,
  addDefinedMealsRedux,
  clearDefinedMeals,
  clearScheduledMeals,
  updateScheduledMealRedux,
  addScheduledMealsRedux
} from '../models';
import { getCurrentUser, getDefinedMeals, getDish, getScheduledMeal } from '../selectors';

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
  BaseDishEntity
} from '../types';


export const loadDefinedMeals = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearDefinedMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    console.log('loadDefinedMeals, user id: ', id);

    const path = serverUrl + apiUrlFragment + 'definedMeals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {
        const definedMealEntities: DefinedMealEntity[] = (mealsResponse as any).data;
        dispatch(addDefinedMealsRedux(definedMealEntities));
      });
  };
};

export const loadScheduledMeals = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearScheduledMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    console.log('loadMeals, user id: ', id);

    const path = serverUrl + apiUrlFragment + 'scheduledMeals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {
        const scheduledMealEntities: ScheduledMealEntity[] = (mealsResponse as any).data;
        dispatch(addScheduledMealsRedux(scheduledMealEntities));
      });
  };
};

export const generateMeal = (mealId: string, mealDate: Date) => {
  return (dispatch: any, getState: any) => {
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const meals: ScheduledMealEntity[] = generateRandomDishBasedMeals(mealWheelState, mealDate, 1);
    const meal: ScheduledMealEntity = meals[0];
    meal.id = mealId;
    dispatch(updateMeal(mealId, meal));    
  };
};

export const generateMenu = () => {
  return (dispatch: any, getState: any) => {

    // TEDTODO - this looks temporary
    dispatch(clearScheduledMeals());

    const mealWheelState: MealWheelState = getState() as MealWheelState;

    const generatedMeals: ScheduledMealEntity[] = [];

    const randomDishBasedMeals: ScheduledMealEntity[] = generateRandomDishBasedMeals(mealWheelState, new Date(), 5);
    const randomPredefinedMeals: ScheduledMealEntity[] = getRandomPredefinedMeals(mealWheelState, randomDishBasedMeals, 5);

    const allRandomMeals: ScheduledMealEntity[] = randomDishBasedMeals.concat(randomPredefinedMeals);

    const mealDate: Date = new Date();
    while (generatedMeals.length < 10) {
      const mealIndex = Math.floor(Math.random() * allRandomMeals.length);
      const scheduledMeal: ScheduledMealEntity = allRandomMeals[mealIndex];
      scheduledMeal.dateScheduled = mealDate;
      mealDate.setTime(mealDate.getTime() + (24 * 60 * 60 * 1000));
      generatedMeals.push(allRandomMeals[mealIndex]);
      dispatch(addScheduledMeal(allRandomMeals[mealIndex]));
      allRandomMeals.splice(mealIndex, 1);
    }
  };
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
      status: MealStatus.proposed
    };

    scheduledMealEntities.push(scheduledMeal);

  }

  return scheduledMealEntities;
};

const generateRandomDishBasedMeals = (mealWheelState: MealWheelState, startDate: Date, numMeals: number): ScheduledMealEntity[] => {

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
      status: MealStatus.proposed
    };

    scheduledMealEntities.push(scheduledMeal);

    mealDate = cloneDeep(mealDate);
    mealDate.setTime(mealDate.getTime() + (24 * 60 * 60 * 1000));
  }

  return scheduledMealEntities;
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

export const updateMeal = (
  id: string,
  meal: ScheduledMealEntity
): any => {
  return ((dispatch: any): any => {

    const path = serverUrl + apiUrlFragment + 'updateMeal';

    const updateMealBody: any = {
      id,
      meal,
    };

    return axios.post(
      path,
      updateMealBody
    ).then((response) => {
      dispatch(updateScheduledMealRedux(id, meal));
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
    console.log(mealId);
    console.log(newMainId);
    const mealWheelState: MealWheelState = getState() as MealWheelState;
    const newMain: MainDishEntity | null = getDish(mealWheelState, newMainId) as MainDishEntity;
    const meal: ScheduledMealEntity | null = getScheduledMeal(mealWheelState, mealId);
    if (!isNil(newMain) && !isNil(meal)) {
      meal.mainDishId = newMainId;
      dispatch(updateMeal(meal.id, meal));
      // const existingMain: DishEntity = getDish(mealWheelState, meal?.mainDishId) as DishEntity;
      // combinations
      //  0) existingMain requires accompaniment, newMain requires accompaniment
      //    no change to accompaniment required
      //  existingMain does not require accompaniment, newMain requires accompaniment
      //    update accompaniment in property - select random one?
      //  existingMain requires accompaniment, newMain does not require accompaniment
      //    no change to accompaniment required
      //  existingMain does not require accompaniment, newMain does not require accompaniment
      //    no change to accompaniment required
      // if (isNil(existingMain.accompaniment) || existingMain.accompaniment === RequiredAccompanimentFlags.None) {
      //   if (isNil(newMain.accompaniment) || newMain.accompaniment === RequiredAccompanimentFlags.None) {
      //     console.log('neither existing nor newMain require accompaniment');
      //     meal.mainDishId = newMainId;
      //     dispatch(updateMeal(meal.id, meal));
      //     return;
      //   } else {
      //     console.log('existing does not require accompaniment; newMain does');
      //   }
      // } else {
      //   if (isNil(newMain.accompaniment) || newMain.accompaniment === RequiredAccompanimentFlags.None) {
      //     console.log('existing requires accompaniment; newMain does not');
      //     meal.mainDishId = newMainId;
      //     dispatch(updateMeal(meal.id, meal));
      //     return;
      //   } else {
      //     console.log('both existing and newMain require accompaniment');
      //     meal.mainDishId = newMainId;
      //     dispatch(updateMeal(meal.id, meal));
      //     return;
      //   }
      // }
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
      dispatch(updateMeal(meal.id, meal));
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
      dispatch(updateMeal(meal.id, meal));
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
      dispatch(updateMeal(meal.id, meal));
    }
  };
};
