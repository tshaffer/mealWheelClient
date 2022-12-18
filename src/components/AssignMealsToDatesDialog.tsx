import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { cloneDeep, isNil } from 'lodash';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { List, ListItem, ListItemText } from '@mui/material';

import { MealEntity } from '../types';
import { getStartDate, getUnassignedMeals } from '../selectors';

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
  startDate: Date;
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const [mealOnDates, setMealOnDates] = React.useState<MealOnDate[]>([]);
  const [selectedMeal, setSelectedMeal] = React.useState<MealEntity | null>(null);
  const [selectedMealOnDate, setSelectedMealOnDate] = React.useState<MealOnDate | null>(null);

  React.useEffect(() => {
    const initialMealOnDates: MealOnDate[] = [];
    let mealDate: Date = cloneDeep(props.startDate);
    for (let i = 0; i < 7; i++) {
      const mealOnDate: MealOnDate = {
        id: i,
        date: mealDate,
        meal: null,
      };
      initialMealOnDates.push(mealOnDate);
      mealDate = cloneDeep(mealDate);
      mealDate.setTime(mealDate.getTime() + (24 * 60 * 60 * 1000));
    }
    setMealOnDates(initialMealOnDates);
  }, [props.startDate]);

  const inlineBlockStyle = {
    display: 'inline-block'
  };

  const selectedStyle = {
    backgroundColor: 'rgb(211, 211, 211)'
  };

  const unselectedStyle = {
    backgroundColor: 'white'
  };

  const handleClose = () => {
    props.onClose();
  };

  const getSelectedMeal = (): MealEntity | null => {
    for (const meal of props.meals) {
      if (!isNil(selectedMeal) && meal.id === selectedMeal.id) {
        return meal;
      }
    }
    return null;
  };

  const getSelectedMealOnDate = (): MealOnDate | null => {
    for (const mealOnDate of mealOnDates) {
      if (!isNil(selectedMealOnDate) && mealOnDate.id === selectedMealOnDate.id) {
        return mealOnDate;
      }
    }
    return null;
  };

  const handleAssignMealToDate = () => {
    const selectedMeal = getSelectedMeal();
    const selectedMealOnDate = getSelectedMealOnDate();
    if (isNil(selectedMeal) || isNil(selectedMealOnDate)) {
      return;
    }

    console.log('handleAssignMealToDate');
  };

  const handleClickMealItem = (meal: MealEntity) => {
    setSelectedMeal(meal);
  };

  const handleClickMealOnDateItem = (mealOnDate: MealOnDate) => {
    setSelectedMealOnDate(mealOnDate);
  };

  const getRenderedListOfMealsItems = () => {
    const renderedListOfMeals = props.meals.map((meal: MealEntity, index: number) => {
      let listItemStyle = unselectedStyle;
      if (!isNil(selectedMeal) && meal.id === selectedMeal.id) {
        listItemStyle = selectedStyle;
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
      <List
        style={inlineBlockStyle}
      >
        {listOfMealsItems}
      </List>
    );
  };

  const getRenderedListOfMealOnDateItems = () => {

    const renderedListOfMealOnDates = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {

      let listItemStyle = unselectedStyle;
      if (!isNil(selectedMealOnDate) && mealOnDate.id === selectedMealOnDate.id) {
        listItemStyle = selectedStyle;
      }

      return (
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
      <List
        style={inlineBlockStyle}
      >
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
          <Button
            style={inlineBlockStyle}
            onClick={handleAssignMealToDate}
          >
            Assign meal to date
          </Button>
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
    startDate: getStartDate(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

