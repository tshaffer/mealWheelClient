import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { DishEntity, MealEntity, MealOnDate, ScheduledMealEntity, SuggestedAccompanimentTypeForMainSpec } from '../types';
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
  onSuggestMoreMeals: (numberOfMeals: number, startDate: Date) => void;
}

function AssignMealsToDatesDialog(props: AssignMealsToDatesDialogProps) {

  const [mealOnDates, setMealOnDateMongos] = React.useState<MealOnDate[]>([]);

  React.useEffect(() => {
    setMealOnDateMongos(props.mealOnDates);
  }, [props.startDate, props.mealOnDates]);

  const handleClose = () => {
    props.onClose();
  };

  const handleSuggestMoreMeals = () => {
    props.onSuggestMoreMeals(4, props.startDate);
  };

  const handleClearAssignedMealOnDateMongo = (mealOnDate: MealOnDate) => {
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

    const renderedListOfMealOnDateMongos = mealOnDates.map((mealOnDate: MealOnDate, mealOnDateIndex: number) => {
      return (
        <div
          key={mealOnDateIndex}
          style={{
            display: 'inline-block',
            // width: '190px',
          }}
        >
          <DroppableDateInSchedule
            key={mealOnDateIndex}
            mealOnDate={mealOnDate}
            accept={['draggableMeal']}
            onDrop={(item) => { handleDrop(item, mealOnDate); }}
            onClearAssignedMealOnDateMongo={(mealOnDate) => { handleClearAssignedMealOnDateMongo(mealOnDate); }}
          />
        </div>
      );
    });

    return renderedListOfMealOnDateMongos;
  };

  const areSuggestedAccompanimentTypeSpecsIdentical = (
    suggestedAccompanimentTypeSpecs0: SuggestedAccompanimentTypeForMainSpec[],
    suggestedAccompanimentTypeSpecs1: SuggestedAccompanimentTypeForMainSpec[]
  ): boolean => {

    if (suggestedAccompanimentTypeSpecs0.length !== suggestedAccompanimentTypeSpecs1.length) {
      return false;
    }

    for (const suggestedAccompanimentTypeSpec0 of suggestedAccompanimentTypeSpecs0) {
      const identical = suggestedAccompanimentTypeSpecs1.find(
        (suggestedAccompanimentTypeSpec1 => (suggestedAccompanimentTypeSpec1.suggestedAccompanimentTypeEntityId === suggestedAccompanimentTypeSpec0.suggestedAccompanimentTypeEntityId) &&
          (suggestedAccompanimentTypeSpec1.count === suggestedAccompanimentTypeSpec0.count)));
      if (!identical) {
        return false;
      }
    }

    return true;
  };

  const areMealsIdentical = (mealOnDate: MealOnDate, mealEntity: MealEntity): boolean => {

    if (isNil(mealOnDate.meal)) {
      return false;
    }
    const mealOnDateMeal: MealEntity = mealOnDate.meal;

    if (mealOnDateMeal.mainDish.id !== mealEntity.mainDish.id) {
      return false;
    }

    return areSuggestedAccompanimentTypeSpecsIdentical(mealOnDateMeal.mainDish.suggestedAccompanimentTypeSpecs, mealEntity.mainDish.suggestedAccompanimentTypeSpecs);
  };

  const getDraggableMeal = (mealEntity: MealEntity): JSX.Element => {
    // iterate through mealOnDates to determine if this mealEntity is already assigned to one of the dates in the dialog
    let isAlreadyAssigned = false;
    props.mealOnDates.forEach((mealOnDate: MealOnDate) => {
      if (areMealsIdentical(mealOnDate, mealEntity)) {
        console.log('meal ' + mealOnDate.meal!.mainDish.name + ' is already assigned on the dialog');
        isAlreadyAssigned = true;
      }
    });
    return (
      <DraggableMeal
        key={mealEntity.id}
        meal={mealEntity}
        isAlreadyAssigned={isAlreadyAssigned}
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
      PaperProps={{ sx: { width: '1800px', height: '750px' } }}
      fullScreen={true}
    >
      <DialogTitle>Assign Meals to Dates</DialogTitle>
      <DialogContent>
        <div>
          <DndProvider backend={HTML5Backend}>
            <div
              style={{
                display: 'inline-block',
                overflow: 'hidden',
                clear: 'both'
              }}>
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

