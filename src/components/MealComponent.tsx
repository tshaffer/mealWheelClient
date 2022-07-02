import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Grid from '@mui/material/Grid';

import { DishEntity } from '../types';
import { getDish } from '../selectors';
import { isNil } from 'lodash';

export interface MealComponentPropsFromParent {
  mainDishId: string;
  accompanimentDishId: string;
}

export interface MealComponentProps extends MealComponentPropsFromParent {
  mainDish: DishEntity;
  accompanimentDish: DishEntity;
}

const MealComponent = (props: MealComponentProps) => {

  // <p>{props.meal.mainDishId}</p>
  // <Grid item xs='auto'>

  let row = props.mainDish.name;
  if (!isNil(props.accompanimentDish)) {
    row += ' - ' + props.accompanimentDish.name;
  }

  return (
    <div>
      <Grid item xs={12}>
        <p>{row}</p>
      </Grid>
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    // meal: getMeal(state, ownProps.mealId)
    mainDish: getDish(state, ownProps.mainDishId),
    accompanimentDish: getDish(state, ownProps.accompanimentDishId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealComponent);

