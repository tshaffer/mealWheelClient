import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { resolveMeal, updateMeal } from '../controllers';
import { getScheduledMealsToResolve, getPendingMeal, getMealsToResolve, getMealIndex } from '../selectors';
import { VerboseScheduledMeal, ScheduledMealEntity, MealStatus } from '../types';
import { clearMealsToResolve, setMealIndexAndPendingMeal } from '../models';

import MealStatusResolver from './MealStatusResolver';

export interface MealsStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface MealsStatusResolverProps extends MealsStatusResolverPropsFromParent {
  mealIndex: number;
  mealsToResolve: VerboseScheduledMeal[];
  pendingMeal: VerboseScheduledMeal | null;
  scheduledMealsToResolve: ScheduledMealEntity[];
  onUpdateMeal: (mealId: string, scheduledMeal: ScheduledMealEntity) => any;
  onSetMealIndexAndPendingMeal: (index: number, meal: VerboseScheduledMeal) => any;
  onResolveMeal: (meal: VerboseScheduledMeal) => any;
  onClearMealsToResolve: () => any;
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
    console.log('handleCloseMealStatusResolver');
    props.onClearMealsToResolve();
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

  console.log('MealsStatusResolver - check array lengths');

  if (mealsToResolve.length === 0) {
    return null;
  }

  console.log('MealsStatusResolver - mealsToResolve.length > 0');

  if (isNil(props.pendingMeal)) {
    return null;
  }

  console.log('MealsStatusResolver - pendingMeal non null');

  return (
    <div>
      <MealStatusResolver
        scheduledMealId={mealsToResolve[mealIndex].id}
        previousDayEnabled={mealIndex > 0}
        onPreviousDay={handlePreviousDay}
        nextDayEnabled={mealIndex < (mealsToResolve.length - 1)}
        onNextDay={handleNextDay}
        onClose={handleCloseMealStatusResolver}
        onSave={handleSaveMealStatusResolver}
        onSkip={handleSkipMealStatusResolver}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  console.log('MealsStatusResolver mapStateToProps invoked');
  return {
    mealIndex: getMealIndex(state),
    mealsToResolve: getMealsToResolve(state),
    pendingMeal: getPendingMeal(state),
    scheduledMealsToResolve: getScheduledMealsToResolve(state),
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetMealIndexAndPendingMeal: setMealIndexAndPendingMeal,
    onUpdateMeal: updateMeal,
    onResolveMeal: resolveMeal,
    onClearMealsToResolve: clearMealsToResolve,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsStatusResolver);
