import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';

import { Meal } from '../types';
import MealComponent from './MealComponent';
import { getMeals } from '../selectors';
import { generateMenu } from '../controllers';
import { isNil } from 'lodash';

export interface MealScheduleProps {
  meals: Meal[];
  onGenerateMenu: () => any;
}
const MealSchedule = (props: MealScheduleProps) => {

  const handleGenerateMenu = () => {
    props.onGenerateMenu();
  };

  const renderMealRow = (meal: Meal) => {
    return (
      <MealComponent
        mainDishId={meal.mainDishId}
        accompanimentDishId={meal.accompanimentDishId}
        key={meal.mainDishId}
      />
    );
  };


  const renderMealRows = () => {

    if (props.meals.length === 0) {
      return null;
    }

    const mealRows = props.meals.map((meal: Meal) => {
      return renderMealRow(meal);
    });

    return mealRows;
  };

  const renderMeals = () => {

    if (props.meals.length === 0) {
      return null;
    }

    const mealRows = renderMealRows();

    if (isNil(mealRows)) {
      return null;
    }

    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {mealRows}
        </Grid>
      </Box>
    );
  };

  const meals = renderMeals();

  return (
    <div style={{ height: 300, width: '100%' }}>
      <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
      <br />
      {meals}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    meals: getMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onGenerateMenu: generateMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealSchedule);
