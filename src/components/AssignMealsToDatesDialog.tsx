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

import { MealEntity, MealOnDate, ScheduledMealEntity } from '../types';
import { assignMealToDate, updateMealAssignedToDate } from '../controllers';
import { getNumberOfMealsToGenerate, getStartDate, getUnassignedMeals, getScheduledMealsForDays, getMealsOnDatesForDays } from '../selectors';

export interface AssignMealsToDatesDialogPropsFromParent {
  open: boolean;
  onClose: () => void;
}

export interface AssignMealsToDatesDialogProps extends AssignMealsToDatesDialogPropsFromParent {
  meals: MealEntity[];
  startDate: Date;
  numberOfMealsToGenerate: number,
  scheduledMeals: ScheduledMealEntity[];
  mealOnDates: MealOnDate[];
  onAssignMealToDate: (meal: MealEntity, date: Date) => void;
  onUpdateMealAssignedToDate: (meal: MealEntity, date: Date) => void;
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const [mealOnDates, setMealOnDates] = React.useState<MealOnDate[]>([]);
  const [selectedMeal, setSelectedMeal] = React.useState<MealEntity | null>(null);
  const [selectedMealOnDate, setSelectedMealOnDate] = React.useState<MealOnDate | null>(null);

  React.useEffect(() => {
    setMealOnDates(props.mealOnDates);
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
      if (!isNil(selectedMealOnDate) && getDatesEqual(mealOnDate.date, selectedMealOnDate.date)) {
        return mealOnDate;
      }
    }
    return null;
  };

  const handleAssignMealToDate = () => {

    console.log('handleAssignMealToDate');

    const selectedMeal = getSelectedMeal();
    const selectedMealOnDate = getSelectedMealOnDate();
    if (isNil(selectedMeal) || isNil(selectedMealOnDate)) {
      return;
    }

    if (isNil(selectedMealOnDate.meal)) {
      props.onAssignMealToDate(selectedMeal, selectedMealOnDate.date);
    } else {
      props.onUpdateMealAssignedToDate(selectedMeal, selectedMealOnDate.date);
    }
  };

  const handleClickMealItem = (meal: MealEntity) => {
    setSelectedMeal(meal);
  };

  const handleClickMealOnDateItem = (mealOnDate: MealOnDate) => {
    setSelectedMealOnDate(mealOnDate);
  };

  const getDatesEqual = (date1: Date, date2: Date): boolean => {
    return (date2.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
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

  const getFormattedMealOnDate = (mealOnDate: MealOnDate): string => {
    
    let formattedMealOnDate = mealOnDate.date.toDateString();
    if (!isNil(mealOnDate.meal)) {
      formattedMealOnDate += ' : ' + mealOnDate.meal.mainDish.name;
      if (!isNil(mealOnDate.meal.salad)) {
        formattedMealOnDate += ', ' + mealOnDate.meal.salad.name;
      }
      if (!isNil(mealOnDate.meal.side)) {
        formattedMealOnDate += ', ' + mealOnDate.meal.side.name;
      }
      if (!isNil(mealOnDate.meal.veggie)) {
        formattedMealOnDate += ', ' + mealOnDate.meal.veggie.name;
      }
    } else {
      formattedMealOnDate += ' : unassigned';
    }
    return formattedMealOnDate;
  };

  const getRenderedListOfMealOnDateItems = () => {

    const renderedListOfMealOnDates = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {

      let listItemStyle = unselectedStyle;
      if (!isNil(selectedMealOnDate) && getDatesEqual(mealOnDate.date, selectedMealOnDate.date)) {
        listItemStyle = selectedStyle;
      }

      return (
        <ListItem
          key={mealOnDateIndex}
          style={listItemStyle}
          onClick={() => handleClickMealOnDateItem(mealOnDate)}
        >
          <ListItemText>
            {getFormattedMealOnDate(mealOnDate)}
          </ListItemText>
        </ListItem>
      );
    });

    return renderedListOfMealOnDates;
  };

  const getRenderedListOfMealOnDates = () => {
    const listOfMealOnDateItems = getRenderedListOfMealOnDateItems();
    return (
      <List
        style={inlineBlockStyle}
      >
        {listOfMealOnDateItems}
      </List>
    );
  };

  const listOfMeals = getRenderedListOfMeals();
  const listOfMealOnDates = getRenderedListOfMealOnDates();

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '1000px', height: '750px' } }}
      fullScreen={true}
    >
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
          {listOfMealOnDates}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignMealsToDatesDialogPropsFromParent) {

  const startDate: Date = getStartDate(state);
  const numberOfMealsToGenerate: number = getNumberOfMealsToGenerate(state);
  return {
    meals: getUnassignedMeals(state),
    startDate,
    numberOfMealsToGenerate,
    scheduledMeals: getScheduledMealsForDays(state, startDate, numberOfMealsToGenerate),
    mealOnDates: getMealsOnDatesForDays(state, startDate, numberOfMealsToGenerate),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAssignMealToDate: assignMealToDate,
    onUpdateMealAssignedToDate: updateMealAssignedToDate,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

