import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { cloneDeep, isNil } from 'lodash';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { MealEntity, MealOnDate, ScheduledMealEntity } from '../types';
import { addRandomMeals, assignMealToDate, deleteScheduledMeal, updateMealAssignedToDate } from '../controllers';
import { getNumberOfMealsToGenerate, getStartDate, getUnassignedMeals, getScheduledMealsForDays, getMealsOnDatesForDays } from '../selectors';

import '../styles/MealWheel.css';

import MealAssignmentSchedule from './MealAssignmentSchedule';

const formatName = (name: any) => `${name}`;

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
  onDeleteScheduledMeal: (id: string) => void;
  onSuggestMoreMeals: (numberOfMeals: number) => void;
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const [draggedMeal, setDraggedMeal] = React.useState<MealEntity>();
  const [mealOnDates, setMealOnDates] = React.useState<MealOnDate[]>([]);

  React.useEffect(() => {
    setMealOnDates(props.mealOnDates);
  }, [props.startDate, props.mealOnDates]);

  const handleClose = () => {
    props.onClose();
  };

  const handleSuggestMoreMeals = () => {
    console.log('handleSuggestMoreMeals');
    props.onSuggestMoreMeals(4);
  };

  // const handleClearAssignedMealOnDate = (mealOnDate: MealOnDate) => {
  //   if (!isNil(mealOnDate.meal)) {

  //     // get scheduledMeal associated with this date
  //     for (const scheduledMeal of props.scheduledMeals) {
  //       if (getDatesEqual(scheduledMeal.dateScheduled, mealOnDate.date)) {
  //         props.onDeleteScheduledMeal(scheduledMeal.id);
  //       }
  //     }
  //   }
  // };

  // const getDatesEqual = (date1: Date, date2: Date): boolean => {
  //   return (date2.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
  // };

  const assignMealToDate = (meal: MealEntity, mealOnDate: MealOnDate) => {
    if (isNil(mealOnDate.meal)) {
      props.onAssignMealToDate(meal, mealOnDate.date);
    } else {
      props.onUpdateMealAssignedToDate(meal, mealOnDate.date);
    }
  };

  const getDraggableMeals = (): any => {
    const draggableMealsJsx = props.meals.map((mealEntity: MealEntity, index: number) => {
      return (
        <div
          draggable="true"
          key={mealEntity.id}
          onDragStart={() =>
            handleDragStart(mealEntity)
          }
        >
          {formatName(mealEntity.mainDish.name)}
        </div>
      );
    });
    return draggableMealsJsx;
  };

  const handleDragStart = (mealEntity: MealEntity) => {
    console.log('handleDragStart');
    console.log(mealEntity);
    setDraggedMeal(mealEntity);
  };

  const getMealOnDate = (date: Date): MealOnDate | null => {
    
    let matchedMealOnDate: MealOnDate | null = null;

    mealOnDates.forEach((mealOnDate: MealOnDate) => {
      const mDate: Date = mealOnDate.date;
      if (mDate.getMonth() === date.getMonth() && mDate.getDate() == date.getDate()) {
        matchedMealOnDate = mealOnDate;
      }
    });
    return matchedMealOnDate;
  };

  const handleDropMealOnDate = (date: Date) => {
    let mealOnDate: MealOnDate | null = getMealOnDate(date);
    if (isNil(mealOnDate)) {
      mealOnDate = {
        meal: null,
        date: cloneDeep(date),
      };
    }
    if (!isNil(draggedMeal)) {
      assignMealToDate(draggedMeal, mealOnDate);
    }
  };

  const renderDraggableMealsContainer = (): any => {
    const draggableMeals = getDraggableMeals();
    return (
      <div className='inner'>
        {draggableMeals}
      </div>
    );
  };

  const draggableMealsContainer = renderDraggableMealsContainer();

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      PaperProps={{ sx: { width: '1200px', height: '750px' } }}
      fullScreen={true}
    >
      <DialogTitle>Assign Meals to Dates</DialogTitle>
      <DialogContent>
        <div>
          <MealAssignmentSchedule
            onDropMealOnDate = {handleDropMealOnDate}
          />
          <div style={{ overflow: 'hidden', clear: 'both' }}>
            {draggableMealsContainer}
          </div>
          <br />
          <Button onClick={handleSuggestMoreMeals}>
            Suggest more meals
          </Button>

        </div>
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
    onDeleteScheduledMeal: deleteScheduledMeal,
    onSuggestMoreMeals: addRandomMeals,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

