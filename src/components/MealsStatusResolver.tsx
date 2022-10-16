import { isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateMeal } from '../controllers';
import { getScheduledMealsToResolve, getMainById, getVeggieById, getSideById, getSaladById, getPendingMeal, getMealsToResolve } from '../selectors';
import { VerboseScheduledMeal, DishEntity, ScheduledMealEntity } from '../types';
import { setPendingMeal } from '../models';

import MealStatusResolver from './MealStatusResolver';

export interface MealsStatusResolverPropsFromParent {
  onClose: () => void;
}

export interface MealsStatusResolverProps extends MealsStatusResolverPropsFromParent {
  mealsToResolve: VerboseScheduledMeal[];
  pendingMeal: VerboseScheduledMeal | null;
  scheduledMealsToResolve: ScheduledMealEntity[];
  onUpdateMeal: (mealId: string, scheduledMeal: ScheduledMealEntity) => any;
  onSetPendingMeal: (meal: VerboseScheduledMeal) => any;
}

const MealsStatusResolver = (props: MealsStatusResolverProps) => {

  const { mealsToResolve, onClose, onSetPendingMeal } = props;

  const [mealIndex, setMealIndex] = React.useState(0);

  // React.useEffect(() => {
  //   if (mealsToResolve.length > 0) {
  //     onSetPendingMeal(mealsToResolve[mealIndex]);
  //   }
  // }, [mealIndex, mealsToResolve.length]);

  const handlePreviousDay = () => {
    if (mealIndex > 0) {
      const currentMealIndex = mealIndex;
      setMealIndex(currentMealIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (mealIndex < (mealsToResolve.length - 1)) {
      const currentMealIndex = mealIndex;
      setMealIndex(currentMealIndex + 1);
    }
  };

  const handleCloseMealStatusResolver = () => {
    console.log('handleCloseMealStatusResolver');
    // props.onClearScheduledMealsToResolve();
  };


  const handleSaveMealStatusResolver = (scheduledMeal: ScheduledMealEntity) => {
    console.log('handleCloseMealStatusResolver');
    // props.onClearScheduledMealsToResolve();
    props.onUpdateMeal(scheduledMeal.id, scheduledMeal);
    handleNextDay();
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
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  console.log('MealsStatusResolver mapStateToProps invoked');
  return {
    mealsToResolve: getMealsToResolve(state),
    pendingMeal: getPendingMeal(state),
    scheduledMealsToResolve: getScheduledMealsToResolve(state),
  };
}


const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPendingMeal: setPendingMeal,
    onUpdateMeal: updateMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealsStatusResolver);
