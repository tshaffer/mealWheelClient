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

import '../styles/MealWheel.css';

import { DndProvider, DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableMeal from './DraggableMeal';
import DroppableDateInSchedule from './DroppableDateInSchedule';
import MealAssignmentSchedule from './MealAssignmentSchedule';

const formatName = (name: any, count: any) => `${name} ID ${count}`;


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

  const [counters, setCounters] = React.useState({ item1: 0, item2: 0 });
  const [draggedEvent, setDraggedEvent] = React.useState();
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
          onClearAssignedMealOnDate={(mealOnDate) => { handleClearAssignedMealOnDate(mealOnDate); }}
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

  const handleDragStart = React.useCallback((event: any) => setDraggedEvent(event), []);

  /*
    <div className="height600">
      <DragAndDropCalendar
        defaultDate={defaultDate}
        defaultView={Views.MONTH}
        dragFromOutsideItem={
          displayDragItemInCell ? dragFromOutsideItem : null
        }
        draggableAccessor="isDraggable"
        eventPropGetter={eventPropGetter}
        events={myEvents}
        localizer={localizer}
        onDropFromOutside={onDropFromOutside}
        onDragOver={customOnDragOver}
        onEventDrop={moveEvent}
        onEventResize={resizeEvent}
        onSelectSlot={newEvent}
        resizable
        selectable
      />
    </div>
  */

  const renderDraggableMealsContainer = (): any => {
    return (
      <div className="inner">
        <h4>Outside Drag Sources</h4>
        <p>
          Lighter colored events, in the Calendar, have an `isDraggable` key
          of `false`.
        </p>
        {Object.entries(counters).map(([name, count]) => (
          <div
            draggable="true"
            key={name}
            onDragStart={() =>
              handleDragStart({ title: formatName(name, count), name })
            }
          >
            {formatName(name, count)}
          </div>
        ))}
        <div
          draggable="true"
          onDragStart={() => handleDragStart('undroppable')}
        >
          Draggable but not for calendar.
        </div>
      </div>);
  };

  // const droppableDatesInSchedule = getDroppableDatesInSchedule();
  const draggableMeals = getDraggableMeals();

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
          <MealAssignmentSchedule />
          <div style={{ overflow: 'hidden', clear: 'both' }}>
            {draggableMealsContainer}
          </div>
          <MealAssignmentSchedule />
          {/* <DndProvider backend={HTML5Backend}>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {droppableDatesInSchedule}
            </div>
            <div style={{ overflow: 'hidden', clear: 'both' }}>
              {draggableMealsContainer}
            </div>
          </DndProvider> */}
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

