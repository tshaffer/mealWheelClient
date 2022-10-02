import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';

import { DishEntity, MealStatus, ScheduledMealEntity, VerboseScheduledMeal } from '../types';
import { isNil } from 'lodash';
import { getMainById, getSaladById, getSideById, getVeggieById } from '../selectors';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export interface ScheduledMealStatusResolverPropsFromParent {
  scheduledMeals: ScheduledMealEntity[];
  open: boolean;
  onClose: () => void;
}

export interface ScheduledMealStatusResolverProps extends ScheduledMealStatusResolverPropsFromParent {
  verboseScheduledMeals: VerboseScheduledMeal[];
}

const ScheduledMealStatusResolver = (props: ScheduledMealStatusResolverProps) => {
  console.log('ScheduledMealStatusResolver');
  console.log(props.verboseScheduledMeals);

  const { verboseScheduledMeals, open, onClose } = props;

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClose();
  };

  const getDayOfWeek = (day: number): string => {
    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekday[day];
  };

  const getMealDescription = (verboseScheduledMeal: VerboseScheduledMeal): string => {

    const dayOfWeek: string = getDayOfWeek(verboseScheduledMeal.dateScheduled.getDay());
    const shortDate: string = verboseScheduledMeal.dateScheduled.toLocaleDateString(
      'en-us',
      {
        month: '2-digit',
        day: '2-digit',
      }
    );
    return dayOfWeek + shortDate + verboseScheduledMeal.mainDish;
  };

  // <ListItemText primary={getMealDescription(verboseScheduledMeal)} />

  return (
    <Dialog onClose={handleClose} open={open} maxWidth={false}>
      <DialogTitle>About MealWheel</DialogTitle>
      <List sx={{ pt: 0 }}>
        {verboseScheduledMeals.map((verboseScheduledMeal: VerboseScheduledMeal) => (
          <ListItem key={verboseScheduledMeal.id}>
            <ListItemText>{getDayOfWeek(verboseScheduledMeal.dateScheduled.getDay())}</ListItemText>
            <ListItemText>
              {verboseScheduledMeal.dateScheduled.toLocaleDateString(
                'en-us',
                {
                  month: '2-digit',
                  day: '2-digit',
                }
              )}
            </ListItemText>
            <ListItemText>{verboseScheduledMeal.mainDish}</ListItemText>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="cooked" control={<Radio />} label="Cooked" />
                <FormControlLabel value="tbd" control={<Radio />} label="TBD" />
                <FormControlLabel value="different" control={<Radio />} label="Different" />
              </RadioGroup>
            </FormControl>
          </ListItem>
        ))}
      </List>
    </Dialog>
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
          isNil(getMainById(state, scheduledMeal.mainDishId)) ? '' : (getMainById(state, scheduledMeal.mainDishId) as DishEntity).name;
        const veggie: string = isNil(scheduledMeal.veggieId) ? '' :
          isNil(getVeggieById(state, scheduledMeal.veggieId)) ? '' : (getVeggieById(state, scheduledMeal.veggieId) as DishEntity).name;
        const side: string = isNil(scheduledMeal.sideId) ? '' :
          isNil(getSideById(state, scheduledMeal.sideId)) ? '' : (getSideById(state, scheduledMeal.sideId) as DishEntity).name;
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

/*
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';

export default function CheckboxListSecondary() {
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-secondary-label-${value}`;
        return (
          <ListItem
            key={value}
            secondaryAction={
              <Checkbox
                edge='end'
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
*/
