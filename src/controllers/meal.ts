import axios from 'axios';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { addMealRedux, addMealsRedux, clearMeals, updateMealRedux } from '../models';
import { getCurrentUser, getDish, getMeal } from '../selectors';

import {
  apiUrlFragment,
  DishEntity,
  DishType,
  MealStatus,
  MealWheelState,
  RequiredAccompanimentFlags,
  ScheduledMealEntity,
  serverUrl
} from '../types';


export const loadMeals = () => {
  return (dispatch: any, getState: any) => {

    dispatch(clearMeals());

    const state: MealWheelState = getState();
    const id = getCurrentUser(state);

    console.log('loadMeals, user id: ', id);

    const path = serverUrl + apiUrlFragment + 'meals?id=' + id;

    return axios.get(path)
      .then((mealsResponse: any) => {
        const mealEntities: ScheduledMealEntity[] = (mealsResponse as any).data;
        dispatch(addMealsRedux(mealEntities));
      });
  };
};


export const generateMenu = () => {
  return (dispatch: any, getState: any) => {

    debugger;

    dispatch(clearMeals());
    const allMainDishIndices: number[] = [];
    const allSaladIndices: number[] = [];
    const allSideIndices: number[] = [];
    const allVegIndices: number[] = [];

    const selectedMainDishIndices: number[] = [];

    const mealWheelState: MealWheelState = getState() as MealWheelState;

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

    // select 10 random main dish items
    while (selectedMainDishIndices.length <= 10) {
      const mainDishIndex = Math.floor(Math.random() * allMainDishIndices.length);
      if (!selectedMainDishIndices.includes(allMainDishIndices[mainDishIndex])) {
        selectedMainDishIndices.push(allMainDishIndices[mainDishIndex]);
      }
    }

    const mealDate: Date = new Date();

    for (const selectedMainDishIndex of selectedMainDishIndices) {

      const selectedDish: DishEntity = allDishes[selectedMainDishIndex];

      let accompanimentDishId: string | null = null;

      // if accompaniment to main is required, select it.
      if (!isNil(selectedDish.accompaniment) && selectedDish.accompaniment !== RequiredAccompanimentFlags.None) {
        const possibleAccompaniments: DishType[] = [];
        if (selectedDish.accompaniment & RequiredAccompanimentFlags.Salad) {
          possibleAccompaniments.push(DishType.Salad);
        }
        if (selectedDish.accompaniment & RequiredAccompanimentFlags.Side) {
          possibleAccompaniments.push(DishType.Side);
        }
        if (selectedDish.accompaniment & RequiredAccompanimentFlags.Veggie) {
          possibleAccompaniments.push(DishType.Veggie);
        }
        const numPossibleAccompaniments = possibleAccompaniments.length;
        const accompanimentTypeIndex = Math.floor(Math.random() * numPossibleAccompaniments);
        const accompanimentType: DishType = possibleAccompaniments[accompanimentTypeIndex];

        let accompanimentIndex = -1;
        switch (accompanimentType) {
          case DishType.Salad: {
            accompanimentIndex = allSaladIndices[Math.floor(Math.random() * allSaladIndices.length)];
            break;
          }
          case DishType.Side: {
            accompanimentIndex = allSideIndices[Math.floor(Math.random() * allSideIndices.length)];
            break;
          }
          case DishType.Veggie: {
            accompanimentIndex = allVegIndices[Math.floor(Math.random() * allVegIndices.length)];
            break;
          }
        }

        accompanimentDishId = allDishes[accompanimentIndex].id;
      }

      const accompanimentDishIds: any[] = isNil(accompanimentDishId) ? [] : [accompanimentDishId];
      const mealId = uuidv4();
      const scheduledMeal: ScheduledMealEntity = {
        id: mealId,
        userId: getCurrentUser(mealWheelState) as string,
        // name: '',
        mainDishId: selectedDish.id,
        accompanimentDishIds,
        // mainName: '',
        // veggieName: '',
        // saladName: '',
        // sideName: '',
        dateScheduled: mealDate,
        status: MealStatus.proposed
      };

      dispatch(addMeal(scheduledMeal));

      mealDate.setTime(mealDate.getTime() + (24 * 60 * 60 * 1000));
    }
  };
};


export const addMeal = (
  scheduledMeal: ScheduledMealEntity
): any => {
  return ((dispatch: any): any => {

    const path = serverUrl + apiUrlFragment + 'addMeal';

    scheduledMeal.id = uuidv4();

    const addMealBody: any = {
      id: scheduledMeal.id,
      meal: scheduledMeal,
    };

    return axios.post(
      path,
      addMealBody
    ).then((response) => {
      dispatch(addMealRedux(scheduledMeal.id, scheduledMeal));
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
      dispatch(updateMealRedux(id, meal));
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
    const newMain: DishEntity | null = getDish(mealWheelState, newMainId);
    const meal: ScheduledMealEntity | null = getMeal(mealWheelState, mealId);
    if (!isNil(newMain) && !isNil(meal)) {
      const existingMain: DishEntity = getDish(mealWheelState, meal?.mainDishId) as DishEntity;
      // combinations
      //  0) existingMain requires accompaniment, newMain requires accompaniment
      //    no change to accompaniment required
      //  existingMain does not require accompaniment, newMain requires accompaniment
      //    update accompaniment in property - select random one?
      //  existingMain requires accompaniment, newMain does not require accompaniment
      //    no change to accompaniment required
      //  existingMain does not require accompaniment, newMain does not require accompaniment
      //    no change to accompaniment required
      if (isNil(existingMain.accompaniment) || existingMain.accompaniment === RequiredAccompanimentFlags.None) {
        if (isNil(newMain.accompaniment) || newMain.accompaniment === RequiredAccompanimentFlags.None) {
          console.log('neither existing nor newMain require accompaniment');
          meal.mainDishId = newMainId;
          dispatch(updateMeal(meal.id, meal));
          return;
        } else {
          console.log('existing does not require accompaniment; newMain does');
        }
      } else {
        if (isNil(newMain.accompaniment) || newMain.accompaniment === RequiredAccompanimentFlags.None) {
          console.log('existing requires accompaniment; newMain does not');
          meal.mainDishId = newMainId;
          dispatch(updateMeal(meal.id, meal));
          return;
        } else {
          console.log('both existing and newMain require accompaniment');
          meal.mainDishId = newMainId;
          dispatch(updateMeal(meal.id, meal));
          return;
        }
      }
    }
  };
};

