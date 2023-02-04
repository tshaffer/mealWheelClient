import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { MealEntity, MealOnDate, ScheduledMealEntity } from '../types';
import { addRandomMeals, assignMealToDate, deleteScheduledMeal, updateMealAssignedToDate } from '../controllers';
import { getNumberOfMealsToGenerate, getStartDate, getUnassignedMeals, getScheduledMealsForDays, getMealsOnDatesForDays } from '../selectors';
import { MealWheelDispatch } from '../models';

import '../styles/MealWheel.css';

import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableMeal from './DraggableMeal';
import DroppableDateInSchedule from './DroppableDateInSchedule';

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

  const [mealOnDates, setMealOnDates] = React.useState<MealOnDate[]>([]);

  React.useEffect(() => {
    setMealOnDates(props.mealOnDates);
  }, [props.startDate, props.mealOnDates]);

  const handleClose = () => {
    props.onClose();
  };

  const handleSuggestMoreMeals = () => {
    props.onSuggestMoreMeals(4);
  };

  const handleClearAssignedMealOnDate = (mealOnDate: MealOnDate) => {
    console.log('clear assigned meal on: ', mealOnDate.date.toDateString());
    if (!isNil(mealOnDate.meal)) {

      // get scheduledMeal associated with this date
      for (const scheduledMeal of props.scheduledMeals) {
        if (getDatesEqual(scheduledMeal.dateScheduled, mealOnDate.date)) {
          props.onDeleteScheduledMeal(scheduledMeal.id);
        }
      }
    }
  };

  const getDatesEqual = (date1: Date, date2: Date): boolean => {
    return (date2.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate());
  };

  const assignMealToDate = (meal: MealEntity, mealOnDate: MealOnDate) => {
    if (isNil(mealOnDate.meal)) {
      props.onAssignMealToDate(meal, mealOnDate.date);
    } else {
      props.onUpdateMealAssignedToDate(meal, mealOnDate.date);
    }
  };

  const handleDrop = (meal: MealEntity, mealOnDate: MealOnDate) => {
    console.log('drop');
    console.log(meal);
    console.log(mealOnDate);
    assignMealToDate(meal, mealOnDate);
  };

  const getDroppableDatesInSchedule = (): JSX.Element[] => {

    const renderedListOfMealOnDates = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {
      return (
        <DroppableDateInSchedule
          key={mealOnDateIndex}
          mealOnDate={mealOnDate}
          accept={['draggableMeal']}
          onDrop={(item) => { handleDrop(item, mealOnDate); }}
          onClearAssignedMealOnDate={(mealOnDate) => { handleClearAssignedMealOnDate(mealOnDate) }}
        />
      );
    });

    return renderedListOfMealOnDates;
  };

  const getDraggableMeal = (mealEntity: MealEntity): JSX.Element => {
    return (
      <DraggableMeal
        key={mealEntity.id}
        meal={mealEntity}
      />
    );
  };

  const getDraggableMeals = (): JSX.Element[] => {
    const draggableMealsJsx = props.meals.map((mealEntity: MealEntity, index: number) => {
      return getDraggableMeal(mealEntity);
    });
    return draggableMealsJsx;
  };

  const droppableDatesInSchedule = getDroppableDatesInSchedule();
  const draggableMeals = getDraggableMeals();

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
          <DndProvider backend={HTML5Backend}>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {droppableDatesInSchedule}
            </div>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {draggableMeals}
            </div>
          </DndProvider>
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

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAssignMealToDate: assignMealToDate,
    onUpdateMealAssignedToDate: updateMealAssignedToDate,
    onDeleteScheduledMeal: deleteScheduledMeal,
    onSuggestMoreMeals: addRandomMeals,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignMealsToDatesDialog);

