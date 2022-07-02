import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from '@mui/material/Grid';

import { getMeal } from '../selectors';
import { Meal } from '../types';

export interface MealComponentPropsFromParent {
  mealId: string;
}

export interface MealComponentProps extends MealComponentPropsFromParent {
  meal: Meal;
}

const MealComponent = (props: MealComponentProps) => {

  // <p>{props.meal.mainDishId}</p>

  return (
    <div>
      <Grid item xs='auto'>
        <p>{props.mealId}</p>
      </Grid>
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    meal: getMeal(state, ownProps.mealId)
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealComponent);

