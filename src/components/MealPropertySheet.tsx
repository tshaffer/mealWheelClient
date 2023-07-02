import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Button from '@mui/material/Button';
import { CalendarEvent } from './MealSchedule';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import '../styles/MealWheel.css';

import {
  AccompanimentTypeEntity,
  AccompanimentTypeNameById,
  DishEntity,
  DishType,
  ScheduledMealEntity,
  SuggestedAccompanimentTypeForMainSpec
} from '../types';
import {
  getMains,
  getScheduledMeal,
  getMainById,
  getAccompanimentById,
  getAccompaniments,
  getAccompanimentTypeNamesById,
  getAccompanimentTypeEntitiessByUser
} from '../selectors';
import {
  addAccompanimentToMeal,
  addDish,
  deleteAccompanimentFromMeal,
  deleteScheduledMeal,
  generateMeal,
  updateAccompanimentInMeal,
  updateMainInMeal,
} from '../controllers';

import NewDishDialog from './NewDishDialog';
import { MealWheelDispatch } from '../models';
import { IconButton, Tooltip } from '@mui/material';

export interface MealPropertySheetPropsFromParent {
  scheduledMealId: string;
  selectedMealInCalendar: CalendarEvent | null;
  handleClose: () => any;
  onUpdateCalendarEvent: (calendarEvent: CalendarEvent) => any;
}

export interface MealPropertySheetProps extends MealPropertySheetPropsFromParent {
  scheduledMeal: ScheduledMealEntity | null,
  currentMain: DishEntity | null;
  allAccompanimentTypeEntities: AccompanimentTypeEntity[];
  currentAccompaniments: DishEntity[],
  allMains: DishEntity[];
  allAccompaniments: DishEntity[];
  accompanimentTypeNameById: AccompanimentTypeNameById;
  onUpdateMainInMeal: (mealId: string, newMainId: string) => any;
  onGenerateMeal: (mealId: string, date: Date) => any;
  onDeleteMeal: (mealId: string) => any;
  onAddDish: (dish: DishEntity) => any;
  onUpdateAccompanimentInMeal: (
    mealId: string,
    existingAccompanimentDishId: string,
    selectedAccompanimentDishId: string,
  ) => any;
  onAddAccompanimentToMeal: (
    mealId: string,
    accompanimentId: string,
  ) => any;
  onDeleteAccompanimentFromMeal: (
    mealId: string,
    accompanimentId: string,
  ) => any;
  state: any;
}


const MealPropertySheet = (props: MealPropertySheetProps) => {

  const [comments, setComments] = React.useState('');

  const [showNewDishDialog, setShowNewDishDialog] = React.useState(false);
  const [selectedAccompanimentTypeEntityId, setSelectedAccompanimentTypeEntityId] = React.useState('');

  const [dishType, setDishType] = React.useState<DishType>('main');

  const getScheduledMealId = (): string => {
    if (!isNil(props.scheduledMeal)) {
      return props.scheduledMeal.id;
    } else {
      return '';
    }
  };

  if (getScheduledMealId() === '') {
    return null;
  }

  if (isNil(props.selectedMealInCalendar) || isNil(props.selectedMealInCalendar.scheduledMealId) || props.selectedMealInCalendar.scheduledMealId === '') {
    return null;
  }

  if (!isNil(props.allAccompanimentTypeEntities) && props.allAccompanimentTypeEntities.length > 0 && selectedAccompanimentTypeEntityId === '') {
    console.log('initialize setSelectedAccompanimentTypeEntityId');
    setSelectedAccompanimentTypeEntityId(props.allAccompanimentTypeEntities[0].id);
  }

  const handleUpdateMain = (event: any) => {
    if (event.target.value === 'new') {
      setDishType('main');
      setShowNewDishDialog(true);
    } else {
      props.onUpdateMainInMeal(getScheduledMealId(), event.target.value);
    }
  };

  const handleUpdateAccompaniment = (accompanimentTypeId: DishType, existingAccompanimentDishId: string, selectedAccompanimentDishId: string) => {
    console.log('handleUpdateAccompaniment');
    if (selectedAccompanimentDishId === 'new') {
      setDishType(accompanimentTypeId);
      setShowNewDishDialog(true);
    } else {
      props.onUpdateAccompanimentInMeal(
        getScheduledMealId(),
        existingAccompanimentDishId,
        selectedAccompanimentDishId,
      );
    }
  };

  const handleDelete = () => {
    console.log('handleDelete');
    props.onDeleteMeal(getScheduledMealId());
    props.handleClose();
  };

  const handleSuggestAnother = () => {
    console.log('handleSuggestAnother');
    if (!isNil(props.scheduledMeal)) {
      props.onGenerateMeal(props.scheduledMeal.id, new Date(props.scheduledMeal.dateScheduled));
    }
  };

  const handleAddDish = (
    dishName: string,
    dishType: DishType,
    minimumInterval: number,
    suggestedAccompanimentTypeSpecs?: SuggestedAccompanimentTypeForMainSpec[]
  ) => {
    console.log('handleAddDish: ', dishType);
    console.log(dishName);
    // // console.log(requiredAccompanimentFlags);
    // // TODO - I don't think the 'addedDish' is necessary.
    const dishId: string = 'addedDish' + uuidv4();
    const dishEntity: DishEntity = {
      id: dishId,
      name: dishName,
      dishType: dishType,
      minimumInterval,
      last: null,
      suggestedAccompanimentTypeSpecs: isNil(suggestedAccompanimentTypeSpecs) ? [] : suggestedAccompanimentTypeSpecs,
      prepEffort: 5,
      prepTime: 15,
      cleanupEffort: 5,
    };
    const addDishPromise = props.onAddDish(dishEntity);
    addDishPromise
      .then((updatedDishId: string) => {
        const scheduledMealId = getScheduledMealId();
        switch (dishType) {
          case 'main':
            props.onUpdateMainInMeal(scheduledMealId, updatedDishId);
            break;
        }
        setShowNewDishDialog(false);
      });
  };

  const handleCloseNewDishDialog = () => {
    setShowNewDishDialog(false);
  };

  const renderNewMenuItem = (): JSX.Element => {
    return (
      <MenuItem value={'new'} key={'new'}>New</MenuItem>
    );
  };

  const renderNoneMenuItem = (): JSX.Element => {
    return (
      <MenuItem value={'none'} key={'none'}>None</MenuItem>
    );
  };

  const renderDishMenuItem = (dishEntity: DishEntity): JSX.Element => {
    return (
      <MenuItem value={dishEntity.id} key={dishEntity.id}>{dishEntity.name}</MenuItem>
    );
  };

  const renderDishMenuItems = (dishes: DishEntity[], includeNone: boolean) => {
    const dishMenuItems: JSX.Element[] = dishes.map((mainDish: DishEntity) => {
      return renderDishMenuItem(mainDish);
    });
    if (includeNone) {
      dishMenuItems.unshift(renderNoneMenuItem());
    }
    dishMenuItems.unshift(renderNewMenuItem());
    return dishMenuItems;
  };

  const renderMains = () => {
    let mainId = 'none';
    if (!isNil(props.currentMain)) {
      mainId = props.currentMain.id;
    }
    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.allMains, false);
    return (
      <div key={mainId}>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="mainLabel">Main</InputLabel>
          <Select
            labelId="mainLabel"
            id="demo-simple-select-filled"
            value={mainId}
            onChange={(event) => handleUpdateMain(event)}
          >
            {mainsMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const handleDeleteAccompanimentClick = (accompanimentId: any) => {
    console.log('Delete accompaniment ' + accompanimentId);
    props.onDeleteAccompanimentFromMeal(getScheduledMealId(), accompanimentId);
  };

  const handleAddAccompanimentTypeEntityClick = () => {

    console.log('Add accompaniment type entity');

    // get accompanimentTypeEntity for selectedAccompanimentTypeEntityId
    // TEDTODOUSELUT
    let selectedAccompanimentTypeEntity: AccompanimentTypeEntity | null = null;
    for (const accompanimentTypeEntity of props.allAccompanimentTypeEntities) {
      if (accompanimentTypeEntity.id === selectedAccompanimentTypeEntityId) {
        selectedAccompanimentTypeEntity = accompanimentTypeEntity;
        break;
      }
    }

    if (isNil(selectedAccompanimentTypeEntity)) {
      return;
    }

    // get list of accompaniments for this accompanimentTypeEntity
    // TEDTODOUSELUT
    const accompanimentDishes: DishEntity[] = [];
    for (const dishEntity of props.allAccompaniments) {
      if (dishEntity.dishType === selectedAccompanimentTypeEntity.id) {
        accompanimentDishes.push(dishEntity);
      }
    }

    if (accompanimentDishes.length === 0) {
      return;
    }

    // add accompaniment of this type to meal.
    const accompanimentDishToAdd: DishEntity = accompanimentDishes[0];
    props.onAddAccompanimentToMeal(
      getScheduledMealId(),
      accompanimentDishToAdd.id
    );
  };

  const handleUpdateAccompanimentTypeEntityToAddToMeal = (accompanimentTypeEntityId: string) => {
    console.log('handleUpdateAccompanimentTypeEntityToAddToMeal');
    console.log(accompanimentTypeEntityId);
    setSelectedAccompanimentTypeEntityId(accompanimentTypeEntityId);
  };

  const renderAccompanimentsSelectForSpecificAccompanimentType = (accompanimentTypeEntityId: DishType, currentAccompanimentId: string): JSX.Element => {

    const dishEntitiesForThisAccompanimentType: DishEntity[] = [];
    props.allAccompaniments.forEach((accompanimentDish: DishEntity) => {
      if (accompanimentDish.dishType === accompanimentTypeEntityId) {
        dishEntitiesForThisAccompanimentType.push(accompanimentDish);
      }
    });

    // TEDTODO - key might not be unique??
    const accompanimentMenuItems: JSX.Element[] = renderDishMenuItems(dishEntitiesForThisAccompanimentType, false);
    return (
      <div key={accompanimentTypeEntityId}>
        <div>
          <Tooltip title="Delete">
            <IconButton
              id={currentAccompanimentId}
              onClick={() => handleDeleteAccompanimentClick(currentAccompanimentId)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="mainLabel">{props.accompanimentTypeNameById[accompanimentTypeEntityId]}</InputLabel>
            <Select
              labelId="mainLabel"
              id="demo-simple-select-filled"
              value={currentAccompanimentId}
              onChange={(event) => handleUpdateAccompaniment(accompanimentTypeEntityId, currentAccompanimentId, event.target.value)}
            >
              {accompanimentMenuItems}
            </Select>
          </FormControl>
        </div>
      </div>
    );

  };

  const renderAccompanimentSelects = (): JSX.Element[] | null => {

    if (isNil(props.currentMain?.suggestedAccompanimentTypeSpecs)) {
      return null;
    }

    const renderedAccompanimentsSelects: JSX.Element[] = [];

    for (const accompanimentDishId of props.scheduledMeal!.accompanimentDishIds) {

      // get AccompanimentDish given id.
      // TEDTODO refactor
      let foundAccompaniment: DishEntity | null = null;
      for (const accompaniment of props.allAccompaniments) {
        if (accompaniment.id === accompanimentDishId) {
          foundAccompaniment = accompaniment;
          break;
        }
      }
      if (isNil(foundAccompaniment)) {
        return null;
      }

      const accompanimentTypeEntityId = (foundAccompaniment as DishEntity).dishType;

      // render select that includes all the accompaniments of this type
      const renderedAccompanimentSelect = renderAccompanimentsSelectForSpecificAccompanimentType(accompanimentTypeEntityId, accompanimentDishId);
      renderedAccompanimentsSelects.push(renderedAccompanimentSelect);
    }

    return renderedAccompanimentsSelects;
  };

  const renderAccompanimentTypeEntityMenuItem = (accompanimentTypeEntity: AccompanimentTypeEntity): JSX.Element => {
    return (
      <MenuItem value={accompanimentTypeEntity.id} key={accompanimentTypeEntity.id}>{accompanimentTypeEntity.name}</MenuItem>
    );
  };

  const renderAccompanimentTypeEntityMenuItems = (): JSX.Element[] => {
    const accompanimentTypeEntityMenuItems: any[] = props.allAccompanimentTypeEntities.map((accompanimentTypeEntityMenuItem: AccompanimentTypeEntity) => {
      return renderAccompanimentTypeEntityMenuItem(accompanimentTypeEntityMenuItem);
    });
    return accompanimentTypeEntityMenuItems;
  };

  const renderAddAccompanimentTypeEntity = (): JSX.Element => {

    const accompanimentTypeEntityMenuItems: any[] = renderAccompanimentTypeEntityMenuItems();
    return (
      <div key={'add'}>
        <Tooltip title="Add">
          <IconButton
            id={'fred'}
            onClick={() => handleAddAccompanimentTypeEntityClick()}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="accompanimentTypeEntityLabel">Type to add</InputLabel>
          <Select
            labelId="accompanimentTypeEntityLabel"
            id="demo-simple-select-filled"
            value={selectedAccompanimentTypeEntityId}
            onChange={(event) => handleUpdateAccompanimentTypeEntityToAddToMeal(event.target.value)}
          >
            {accompanimentTypeEntityMenuItems}
          </Select>
        </FormControl>
      </div>
    );
  };

  const renderLinkToRecipe = (): JSX.Element => {
    return (
      <div>
        <TextField
          id="filled-helperText"
          label="Link to recipe"
          defaultValue=""
          helperText="Enter the URL, if available to the online recipe."
          variant="filled"
        />
      </div>
    );
  };

  const renderComments = (): JSX.Element => {
    return (
      <div>
        <TextField
          id="filled-multiline-flexible"
          label="Comments"
          multiline
          maxRows={4}
          value={comments}
          onChange={(event) => setComments(event?.target.value)}
          variant="filled"
        />
      </div>
    );
  };

  const renderActionButtons = (): JSX.Element => {
    return (
      <div>
        <Button className='buttonMarginLeft' color='inherit' variant='contained' onClick={handleDelete}>Delete</Button>
        <Button className='buttonMarginLeft buttonMarginRight' color='inherit' variant='contained' onClick={handleSuggestAnother}>Suggest another</Button>
      </div>
    );
  };

  const mainDishElement = renderMains();
  const accompanimentElements = renderAccompanimentSelects();

  const addAccompanimentTypeEntityElement = renderAddAccompanimentTypeEntity();

  const linkToRecipeElement = renderLinkToRecipe();
  const commentsElement = renderComments();

  const actionButtons = renderActionButtons();

  return (
    <div>
      <div>
        <NewDishDialog
          open={showNewDishDialog}
          onAddDish={handleAddDish}
          onClose={handleCloseNewDishDialog}
          dishType={dishType}
        />
      </div>
      <div className='mealPropertySheet'>
        <p className='shortParagraph'>{'Main: ' + (props.currentMain as DishEntity).name}</p>
        {mainDishElement}
        {accompanimentElements}
        {addAccompanimentTypeEntityElement}
        {linkToRecipeElement}
        {commentsElement}
        {actionButtons}
        <Button color='inherit' onClick={props.handleClose}>Close</Button>
      </div>

    </div>
  );
};

function mapStateToProps(state: any, ownProps: MealPropertySheetPropsFromParent) {
  let scheduledMeal: ScheduledMealEntity | null = null;
  let currentMain: DishEntity | null = null;
  const currentAccompaniments: DishEntity[] = [];

  if (!isNil(ownProps.selectedMealInCalendar) && !isNil(ownProps.selectedMealInCalendar.scheduledMealId) && ownProps.selectedMealInCalendar.scheduledMealId !== '') {
    scheduledMeal = getScheduledMeal(state, ownProps.scheduledMealId);
    if (!isNil(scheduledMeal)) {
      currentMain = getMainById(state, scheduledMeal.mainDishId);
      if (!isNil(scheduledMeal.accompanimentDishIds)) {
        scheduledMeal.accompanimentDishIds.forEach((accompanimentId: string) => {
          const accompanimentValue = getAccompanimentById(state, accompanimentId);
          if (!isNil(accompanimentValue)) {
            currentAccompaniments.push(accompanimentValue);
          }
        });
      }
    }
  }

  return {
    scheduledMeal,
    currentMain,
    currentAccompaniments,
    allMains: getMains(state),
    allAccompanimentTypeEntities: getAccompanimentTypeEntitiessByUser(state),
    allAccompaniments: getAccompaniments(state),
    state,
    accompanimentTypeNameById: getAccompanimentTypeNamesById(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onUpdateMainInMeal: updateMainInMeal,
    onGenerateMeal: generateMeal,
    onDeleteMeal: deleteScheduledMeal,
    onAddDish: addDish,
    onAddAccompanimentToMeal: addAccompanimentToMeal,
    onDeleteAccompanimentFromMeal: deleteAccompanimentFromMeal,
    onUpdateAccompanimentInMeal: updateAccompanimentInMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealPropertySheet);
