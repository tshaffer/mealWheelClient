import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { List, ListItem, ListItemText } from '@mui/material';

import { MealEntity } from '../types';
import { getUnassignedMeals } from '../selectors';

interface MealOnDate {
  id: number;
  date: Date;
  meal: MealEntity | null;
}

export interface AssignMealsToDatesDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface AssignMealsToDatesDialogProps extends AssignMealsToDatesDialogPropsFromParent {
  meals: MealEntity[];
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const [mealOnDates, setMealOnDates] = React.useState<MealOnDate[]>([]);
  const [selectedMeal, setSelectedMeal] = React.useState<MealEntity | null>(null);
  const [selectedMealOnDate, setSelectedMealOnDate] = React.useState<MealOnDate | null>(null);

  React.useEffect(() => {
    const initialMealOnDates: MealOnDate[] = [];
    const mealDate: Date = new Date();
    for (let i = 0; i < 7; i++) {
      const mealOnDate: MealOnDate = {
        id: i,
        date: mealDate,
        meal: null,
      };
      initialMealOnDates.push(mealOnDate);
    }
    setMealOnDates(initialMealOnDates);
  }, []);

  const handleClose = () => {
    props.onClose();
  };

  const handleClickMealItem = (meal: MealEntity) => {
    setSelectedMeal(meal);
  };

  const selectedMealStyle = {
    color: 'red'
  };

  const unselectedMealStyle = {
    color: 'black'
  };

  const handleClickMealOnDateItem = (mealOnDate: MealOnDate) => {
    setSelectedMealOnDate(mealOnDate)
  };

  const selectedMealOnDateStyle = {
    color: 'green'
  };

  const unselectedMealOnDateStyle = {
    color: 'black'
  };


  const getRenderedListOfMealsItems = () => {
    const renderedListOfMeals = props.meals.map((meal: MealEntity, index: number) => {
      let listItemStyle = unselectedMealStyle;
      if (!isNil(selectedMeal) && meal.id === selectedMeal.id) {
        listItemStyle = selectedMealStyle;
      }
      return (
        <ListItem
          key={index}
          style={listItemStyle}
          onClick={() => handleClickMealItem(meal)}
        >
          <ListItemText>
            {meal.mainDish.name}
          </ListItemText>
        </ListItem>
      );
    });

    return renderedListOfMeals;
  };

  const getRenderedListOfMeals = () => {
    const listOfMealsItems = getRenderedListOfMealsItems();
    return (
      <List>
        {listOfMealsItems}
      </List>
    );
  };

  const getRenderedListOfMealOnDateItems = () => {

    const renderedListOfMealOnDates = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {
      
      let listItemStyle = unselectedMealOnDateStyle;
      if (!isNil(selectedMealOnDate) && mealOnDate.id === selectedMealOnDate.id) {
        listItemStyle = selectedMealOnDateStyle;
      }

      return(
        <ListItem
          key={mealOnDateIndex}
          style={listItemStyle}
          onClick={() => handleClickMealOnDateItem(mealOnDate)}
        >
          <ListItemText>
            {mealOnDate.date.toDateString()}
          </ListItemText>
        </ListItem>
      );
    });

    return renderedListOfMealOnDates;
  };

  const getRenderedListOfDates = () => {
    const listOfDateItems = getRenderedListOfMealOnDateItems();
    return (
      <List>
        {listOfDateItems}
      </List>
    );
  };

  const listOfMeals = getRenderedListOfMeals();
  const listOfDates = getRenderedListOfDates();

  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Assign Meals to Dates</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            height: 500,
            width: '100%',
            '& .actions': {
              color: 'text.secondary',
            },
            '& .textPrimary': {
              color: 'text.primary',
            },
          }}
        >
          {listOfMeals}
          {listOfDates}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignMealsToDatesDialogPropsFromParent) {
  return {
    meals: getUnassignedMeals(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

