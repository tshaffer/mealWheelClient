import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { deleteScheduledMeal, resolveMeal, updateScheduledMeal } from '../controllers';
import { getPendingMeal, getMealsToResolve, getMealIndex } from '../selectors';
import { VerboseScheduledMeal, ScheduledMealEntity, MealStatus } from '../types';
import { clearMealsToResolve, MealWheelDispatch, setMealIndexAndPendingMeal } from '../models';

import MealStatusResolver from './MealStatusResolver';

export interface MealsStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface MealsStatusResolverProps extends MealsStatusResolverPropsFromParent {
  mealIndex: number;
  mealsToResolve: VerboseScheduledMeal[];
  pendingMeal: VerboseScheduledMeal | null;
  onUpdateMeal: (mealId: string, scheduledMeal: ScheduledMealEntity) => any;
  onSetMealIndexAndPendingMeal: (index: number, meal: VerboseScheduledMeal) => any;
  onResolveMeal: (meal: VerboseScheduledMeal) => any;
  onClearMealsToResolve: () => any;
  onDeleteMeal: (id: string) => any;
}

const MealsStatusResolver = (props: MealsStatusResolverProps) => {

  const { mealIndex, mealsToResolve, onSetMealIndexAndPendingMeal } = props;

  const handlePreviousDay = () => {
    if (mealIndex > 0) {
      const newMealIndex = mealIndex - 1;
      onSetMealIndexAndPendingMeal(newMealIndex, mealsToResolve[newMealIndex]);
    }
  };

  const handleNextDay = () => {
    if (mealIndex < (mealsToResolve.length - 1)) {
      const newMealIndex = mealIndex + 1;
      onSetMealIndexAndPendingMeal(newMealIndex, mealsToResolve[newMealIndex]);
    }
  };

  const handleCloseMealStatusResolver = () => {
    props.onClearMealsToResolve();
  };

  const handleDeleteMealStatusResolver = (meal: VerboseScheduledMeal) => {
    props.onResolveMeal(meal);
    props.onDeleteMeal(meal.id);
  };

  const handleSaveMealStatusResolver = (meal: VerboseScheduledMeal) => {

    const scheduledMeal: ScheduledMealEntity = {
      id: (meal as VerboseScheduledMeal).id,
      userId: (meal as VerboseScheduledMeal).userId,
      mainDishId: (meal as VerboseScheduledMeal).mainDishId,
      saladId: (meal as VerboseScheduledMeal).saladId,
      veggieId: (meal as VerboseScheduledMeal).veggieId,
      sideId: (meal as VerboseScheduledMeal).sideId,
      dateScheduled: (meal as VerboseScheduledMeal).dateScheduled,
      status: MealStatus.prepared,
    };

    // save current meal, update meal index as needed, and update pendingMeal
    props.onUpdateMeal(scheduledMeal.id, scheduledMeal);
    props.onResolveMeal(meal);
  };

  const handleSkipMealStatusResolver = (meal: VerboseScheduledMeal) => {
    props.onResolveMeal(meal);
  };

  if (mealsToResolve.length === 0) {
    return null;
  }

  if (isNil(props.pendingMeal)) {
    return null;
  }

  return (
    <div>
      <MealStatusResolver
        previousDayEnabled={mealIndex > 0}
        onPreviousDay={handlePreviousDay}
        nextDayEnabled={mealIndex < (mealsToResolve.length - 1)}
        onNextDay={handleNextDay}
        onClose={handleCloseMealStatusResolver}
        onDelete={handleDeleteMealStatusResolver}
        onSave={handleSaveMealStatusResolver}
        onSkip={handleSkipMealStatusResolver}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    mealIndex: getMealIndex(state),
    mealsToResolve: getMealsToResolve(state),
    pendingMeal: getPendingMeal(state),
  };
}


const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onSetMealIndexAndPendingMeal: setMealIndexAndPendingMeal,
    onUpdateMeal: updateScheduledMeal,
    onResolveMeal: resolveMeal,
    onClearMealsToResolve: clearMealsToResolve,
    onDeleteMeal: deleteScheduledMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsStatusResolver);
