import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactModal = require('react-modal');
import { DishEntity, MealStatus, ScheduledMealEntity, VerboseScheduledMeal } from '../types';
import { isNil } from 'lodash';
import { getMainById, getSaladById, getSideById, getVeggieById } from '../selectors';

export interface ScheduledMealStatusResolverPropsFromParent {
  scheduledMeals: ScheduledMealEntity[];
}

export interface ScheduledMealStatusResolverProps extends ScheduledMealStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
}

const ScheduledMealStatusResolver = (props: ScheduledMealStatusResolverProps) => {
  console.log('ScheduledMealStatusResolver');
  console.log(props.verboseScheduledMeals);
  return (
    <div>Pizza</div>
  );
};

function mapStateToProps(state: any, ownProps: ScheduledMealStatusResolverPropsFromParent) {

  const verboseScheduledMeals: VerboseScheduledMeal[] = [];
  const currentDate: Date = new Date();
  for (const scheduledMeal of ownProps.scheduledMeals) {
    const mealDateAsStr = scheduledMeal.dateScheduled;
    const mealDate: Date = new Date(mealDateAsStr);
    if ((mealDate.getTime() < currentDate.getTime()) && (mealDate.getDate() !== currentDate.getDate())) {
      if (scheduledMeal.status === MealStatus.pending) {
        const mainDish: string = isNil(scheduledMeal.mainDishId) ? '' :
          isNil(getMainById(state, scheduledMeal.mainDishId)) ? '' : (getVeggieById(state, scheduledMeal.mainDishId) as DishEntity).name;
        const veggie: string = isNil(scheduledMeal.veggieId) ? '' :
          isNil(getVeggieById(state, scheduledMeal.veggieId)) ? '' : (getVeggieById(state, scheduledMeal.veggieId) as DishEntity).name;
        const side: string = isNil(scheduledMeal.sideId) ? '' :
          isNil(getSideById(state, scheduledMeal.sideId)) ? '' : (getVeggieById(state, scheduledMeal.sideId) as DishEntity).name;
        const salad: string = isNil(scheduledMeal.saladId) ? '' :
          isNil(getSaladById(state, scheduledMeal.saladId)) ? '' : (getSaladById(state, scheduledMeal.saladId) as DishEntity).name;
        verboseScheduledMeals.push({
          ...scheduledMeal,
          mainDish,
          salad,
          veggie,
          side,
        });
      }
    }
  }

  return {
    verboseScheduledMeals,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledMealStatusResolver);

