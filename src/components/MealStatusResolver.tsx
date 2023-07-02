import { cloneDeep, isNil } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Box,
  Dialog,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip
} from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import {
  getAccompaniments,
  getAccompanimentTypeEntitiessByUser,
  getAccompanimentTypeNamesById,
  getMains,
  getPendingMeal
} from '../selectors';
import { VerboseScheduledMeal, DishEntity, AccompanimentTypeEntity, AccompanimentTypeNameById, DishType } from '../types';
import { MealWheelDispatch, setPendingMeal } from '../models';

export interface MealStatusResolverPropsFromParent {
  previousDayEnabled: boolean;
  nextDayEnabled: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onClose: () => void;
  onSave: (meal: VerboseScheduledMeal) => void;
  onSkip: (meal: VerboseScheduledMeal) => void;
  onDelete: (meal: VerboseScheduledMeal) => void;
}

export interface MealStatusResolverProps extends MealStatusResolverPropsFromParent {
  meal: VerboseScheduledMeal;
  mains: DishEntity[];
  allAccompanimentTypeEntities: AccompanimentTypeEntity[];
  allAccompaniments: DishEntity[];
  accompanimentTypeNameById: AccompanimentTypeNameById;
  onSetPendingMeal: (meal: VerboseScheduledMeal) => any;
}

const MealStatusResolver = (props: MealStatusResolverProps) => {

  const [selectedAccompanimentTypeEntityId, setSelectedAccompanimentTypeEntityId] = React.useState('');

  const { previousDayEnabled, nextDayEnabled, onPreviousDay, onNextDay, onClose, onDelete, onSave, onSkip, onSetPendingMeal,
    mains, allAccompanimentTypeEntities, allAccompaniments } = props;
  const meal = props.meal;

  if (!isNil(allAccompanimentTypeEntities) && allAccompanimentTypeEntities.length > 0 && selectedAccompanimentTypeEntityId === '') {
    console.log('initialize setSelectedAccompanimentTypeEntityId');
    setSelectedAccompanimentTypeEntityId(allAccompanimentTypeEntities[0].id);
  }


  const getDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-us', options);
  };

  const getDayDate = (): string => {
    return (getDate((meal as VerboseScheduledMeal).dateScheduled));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    onSave(meal as VerboseScheduledMeal);
  };

  const handleSkip = () => {
    onSkip(meal as VerboseScheduledMeal);
  };

  const handleDelete = () => {
    onDelete(meal as VerboseScheduledMeal);
  };

  const handleNew = () => {
    console.log('handleNew invoked');
  };

  const handleUpdateMain = (event: any) => {
    const mainId = event.target.value;
    let selectedMain: DishEntity | null = null;
    for (const main of mains) {
      if (mainId === main.id) {
        selectedMain = main;
        break;
      }
    }

    const mainName: string = isNil(selectedMain) ? '' : selectedMain.name;

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;
    updatedMeal.main = selectedMain;
    updatedMeal.mainDishId = isNil(selectedMain) ? '' : selectedMain.id;
    updatedMeal.mainName = mainName;
    onSetPendingMeal(updatedMeal);
  };

  const handleUpdateAccompaniment = (existingAccompanimentDishId: string, selectedAccompanimentDishId: string) => {

    let matchingExistingAccompaniment: DishEntity | null = null;
    let matchingExistingAccompanimentIndexIntoAllAccompaniments = -1;
    props.allAccompaniments.forEach((accompanimentDishEntity: DishEntity, index: number) => {
      if (accompanimentDishEntity.id === existingAccompanimentDishId) {
        matchingExistingAccompaniment = accompanimentDishEntity;
        matchingExistingAccompanimentIndexIntoAllAccompaniments = index;
      }
    });

    let matchingExistingAccompanimentIndexIntoMealAccompaniments = -1;
    props.meal?.accompanimentDishIds.forEach((mealAccompanimentDishId: string, index: number) => {
      if (mealAccompanimentDishId === existingAccompanimentDishId) {
        matchingExistingAccompanimentIndexIntoMealAccompaniments = index;
      }
    });

    let matchingSelectedAccompaniment: DishEntity | null = null;
    let matchingSelectedAccompanimentIndexIntoAllAccompaniments = -1;
    props.allAccompaniments.forEach((accompanimentDishEntity: DishEntity, index: number) => {
      if (accompanimentDishEntity.id === selectedAccompanimentDishId) {
        matchingSelectedAccompaniment = accompanimentDishEntity;
        matchingSelectedAccompanimentIndexIntoAllAccompaniments = index;
      }
    });

    if (isNil(matchingExistingAccompaniment)) {
      return;
    }

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;

    updatedMeal.accompanimentDishIds[matchingExistingAccompanimentIndexIntoMealAccompaniments] = selectedAccompanimentDishId;
    updatedMeal.accompaniments![matchingExistingAccompanimentIndexIntoMealAccompaniments] = matchingSelectedAccompaniment!;
    updatedMeal.accompanimentNames![matchingExistingAccompanimentIndexIntoMealAccompaniments] = matchingSelectedAccompaniment!.name;

    onSetPendingMeal(updatedMeal);
  };

  const handleDeleteAccompanimentClick = (accompanimentId: string) => {

    // TEDTODO - copied code from handleUpdateAccompaniment
    let matchingExistingAccompaniment: DishEntity | null = null;
    let matchingExistingAccompanimentIndexIntoAllAccompaniments = -1;
    props.allAccompaniments.forEach((accompanimentDishEntity: DishEntity, index: number) => {
      if (accompanimentDishEntity.id === accompanimentId) {
        matchingExistingAccompaniment = accompanimentDishEntity;
        matchingExistingAccompanimentIndexIntoAllAccompaniments = index;
      }
    });

    let matchingExistingAccompanimentIndexIntoMealAccompaniments = -1;
    props.meal?.accompanimentDishIds.forEach((mealAccompanimentDishId: string, index: number) => {
      if (mealAccompanimentDishId === accompanimentId) {
        matchingExistingAccompanimentIndexIntoMealAccompaniments = index;
      }
    });

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;

    updatedMeal.accompanimentDishIds.splice(matchingExistingAccompanimentIndexIntoMealAccompaniments, 1);
    updatedMeal.accompaniments!.splice(matchingExistingAccompanimentIndexIntoMealAccompaniments, 1);
    updatedMeal.accompanimentNames!.splice(matchingExistingAccompanimentIndexIntoMealAccompaniments, 1);

    onSetPendingMeal(updatedMeal);

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

    const updatedMeal: VerboseScheduledMeal = cloneDeep(meal) as VerboseScheduledMeal;

    updatedMeal.accompanimentDishIds.push(accompanimentDishToAdd.id);
    updatedMeal.accompaniments!.push(accompanimentDishToAdd);
    updatedMeal.accompanimentNames!.push(accompanimentDishToAdd.name);

    onSetPendingMeal(updatedMeal);
  };

  const handleUpdateAccompanimentTypeEntityToAddToMeal = (accompanimentTypeEntityId: string) => {
    setSelectedAccompanimentTypeEntityId(accompanimentTypeEntityId);
  };

  const renderNewMenuItem = (): JSX.Element => {
    return (
      <Button color='inherit' onClick={handleNew} key={'new'}>New</Button>
    );
    // return (
    //   <MenuItem value={'new'} key={'new'}>New</MenuItem>
    // );

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
    const dishMenuItems: JSX.Element[] = dishes.map((dish: DishEntity) => {
      return renderDishMenuItem(dish);
    });
    if (includeNone) {
      dishMenuItems.unshift(renderNoneMenuItem());
    }
    dishMenuItems.unshift(renderNewMenuItem());
    return dishMenuItems;
  };

  const renderMealStatus = (): JSX.Element => {
    return (
      <div>
        <div>
          <IconButton
            className='menuButton'
            color='inherit'
            disabled={!previousDayEnabled}
            onClick={onPreviousDay}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          {getDayDate()}
          <IconButton
            className='menuButton'
            color='inherit'
            disabled={!nextDayEnabled}
            onClick={onNextDay}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </div>
      </div>
    );
  };

  const renderMains = (): JSX.Element => {

    let mainId = 'none';
    if (!isNil(meal) && !isNil(meal.main)) {
      mainId = meal.main.id;
    }

    const mainsMenuItems: JSX.Element[] = renderDishMenuItems(props.mains, false);
    return (
      <div>
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

  const renderAccompanimentsSelectForSpecificAccompanimentType = (accompanimentTypeEntityId: string, currentAccompanimentId: string): JSX.Element => {

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
              onChange={(event) => handleUpdateAccompaniment(currentAccompanimentId, event.target.value)}
            >
              {accompanimentMenuItems}
            </Select>
          </FormControl>
        </div>
      </div>
    );

  };

  const renderAccompanimentSelects = (): JSX.Element[] | null => {

    if (isNil(props.meal!.main?.suggestedAccompanimentTypeSpecs)) {
      return null;
    }

    const renderedAccompanimentsSelects: JSX.Element[] = [];

    for (const accompanimentDishId of props.meal!.accompanimentDishIds) {

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


  if (isNil(meal)) {
    return null;
  }

  const mealStatusElement = renderMealStatus();

  const mainDishElement = renderMains();
  const accompanimentElements = renderAccompanimentSelects();

  const addAccompanimentTypeEntityElement = renderAddAccompanimentTypeEntity();

  return (
    <Dialog onClose={handleClose} open={true} maxWidth='xl'>
      <DialogTitle>Welcome Back Fatso</DialogTitle>
      <Box
        sx={{
          height: 500,
          width: '800px',
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
        }}
      >
        {mealStatusElement}
        {mainDishElement}
        {accompanimentElements}
        {addAccompanimentTypeEntityElement}
        <div>
          <button
            type="button"
            onClick={handleClose}
          >
            Exit
          </button>
          <button
            type="button"
            onClick={handleSave}
          >
            Save and Continue
          </button>
          <button
            type="button"
            onClick={handleSkip}
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleDelete}
          >
            Delete
          </button>

        </div>
      </Box>
    </Dialog>
  );
};

function mapStateToProps(state: any, ownProps: MealStatusResolverPropsFromParent) {

  return {
    meal: getPendingMeal(state) as VerboseScheduledMeal,
    mains: getMains(state),
    allAccompanimentTypeEntities: getAccompanimentTypeEntitiessByUser(state),
    allAccompaniments: getAccompaniments(state),
    accompanimentTypeNameById: getAccompanimentTypeNamesById(state),
  };
}


const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onSetPendingMeal: setPendingMeal,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MealStatusResolver);
