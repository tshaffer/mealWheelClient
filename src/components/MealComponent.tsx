import { isNil } from 'lodash';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


import { DishEntity } from '../types';
import { getDish } from '../selectors';

export interface MealComponentPropsFromParent {
  mainDishId: string;
  accompanimentDishId: string;
}

export interface MealComponentProps extends MealComponentPropsFromParent {
  mainDish: DishEntity | null;
  accompanimentDish: DishEntity | null;
}

const MealComponent = (props: MealComponentProps) => {

  if (isNil(props.mainDish)) {
    return null;
  }
  
  debugger;
  
  let row = props.mainDish.name;
  if (!isNil(props.accompanimentDish)) {
    row += ' - ' + props.accompanimentDish.name;
  }

  return (
    <Grid item xs={12}>
      <Item>{row}</Item>
    </Grid>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    mainDish: getDish(state, ownProps.mainDishId),
    accompanimentDish: getDish(state, ownProps.accompanimentDishId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealComponent);

