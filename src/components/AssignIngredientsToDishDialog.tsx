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
import { AlertProps } from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import { DishEntity, IngredientEntity } from '../types';
import { addIngredientToDish, deleteIngredientFromDish, replaceIngredientInDish } from '../controllers';
import { getDish, getIngredients, getIngredientsByDish } from '../selectors';

interface IngredientOption {
  value: IngredientEntity | null;
  label: string;
}

export interface AssignIngredientsToDishDialogPropsFromParent {
  open: boolean;
  dishId: string;
  onClose: () => void;
}

export interface AssignIngredientsToDishDialogProps extends AssignIngredientsToDishDialogPropsFromParent {
  dish: DishEntity | null;
  allIngredients: IngredientEntity[];
  ingredientsInDish: IngredientEntity[];
  onAddIngredientToDish: (dishId: string, ingredient: IngredientEntity) => any;
  onReplaceIngredientInDish: (dishId: string, existingIngredientId: string, newIngredientId: string) => any;
  onDeleteIngredientFromDish: (dishId: string, ingredientId: string) => any;
}

const placeholderIngredientId = 'placeholderIngredientId';
const placeholderIngredientLabel = 'Select ingredient';

function AssignIngredientsToDishDialog(props: AssignIngredientsToDishDialogProps) {

  const { open, dishId, dish, allIngredients, ingredientsInDish, onClose } = props;

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);
  const [selectIngredientValue, setSelectIngredientValue] = React.useState<string>(placeholderIngredientLabel);

  const handleCloseSnackbar = () => setSnackbar(null);

  let ingredientOptions: IngredientOption[] = [];

  if (open) {
    ingredientOptions = allIngredients.map((ingredientEntity: IngredientEntity) => {
      return {
        value: ingredientEntity,
        label: ingredientEntity.name,
      };
    });
    ingredientOptions.sort((a: any, b: any) => {
      const nameA = a.label.toUpperCase(); // ignore upper and lowercase
      const nameB = b.label.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // names must be equal
      return 0;
    });

    ingredientOptions.push({
      value: null,
      label: placeholderIngredientLabel,
    });
  }

  const handleInputChange = (
    id: any,
    value: any,
  ) => {
    if (id === placeholderIngredientId) {
      setSelectIngredientValue(value);
    }
  };

  if (isNil(dishId) || dishId === '') {
    return null;
  }

  const handleClose = () => {
    onClose();
  };

  const dishLabel: string = isNil(dish) ? 'Unknown dish' : dish.name;

  const handleOpenAutoComplete = () => {
    console.log('autocomplete open');
  };

  const handleAutoCompleteChange = (
    selectedIngredient: IngredientOption,
    existingIngredient: IngredientEntity | null,
  ) => {
    console.log('handleAutoCompleteChange');
    console.log(selectedIngredient);
    console.log(existingIngredient);

    if (isNil(selectedIngredient)) {
      return;
    }

    let newIngredient: IngredientEntity | null = null;
    for (const ingredient of allIngredients) {
      if (ingredient.id === (selectedIngredient.value as IngredientEntity).id) {
        newIngredient = ingredient;
        break;
      }
    }
    if (!isNil(newIngredient)) {
      if (!isNil(existingIngredient)) {
        props.onReplaceIngredientInDish(props.dishId, existingIngredient.id, newIngredient.id);
      } else {
        props.onAddIngredientToDish(props.dishId, newIngredient);
      }
    }
  };

  const handleAutoCompleteInputChange = (
    newValue: any,
  ) => {
    console.log('handleAutoCompleteInputChange open');
    console.log(newValue);
  };

  const handleCloseAutoComplete = () => {
    console.log('autocomplete close');
  };

  const handleAutoCompleteKeyDown = () => {
    console.log('handleAutoCompleteKeyDown');
  };

  const handleDeleteIngredient = (ingredient: IngredientEntity | null) => {
    console.log('handleDeleteIngredient');
    console.log(ingredient);

    if (!isNil(ingredient)) {
      props.onDeleteIngredientFromDish(props.dishId, ingredient.id);
    }
  };

  const myIsOptionEqualToValue = (option: any, value: any) => {
    if (isNil(option.value)) {
      return (option.label === value.label);
    }

    if (isNil(option.value.id)) {
      return false;
    }
    if (isNil(value) || isNil(value.value) || isNil(value.value.id)) {
      return false;
    }

    return option.value.id === value.value.id;
  };

  const getRenderedDeleteIcon = (ingredient: IngredientEntity | null) => {
    if (isNil(ingredient)) {
      return null;
    }
    return (
      <IconButton
        id={ingredient.id}
        onClick={() => handleDeleteIngredient(ingredient)}
      >
        <DeleteIcon />
      </IconButton>
    );
  };

  const getIngredientListItem = (ingredientOption: IngredientOption, id: string, ingredient: IngredientEntity | null) => {
    const renderedDeleteIcon = getRenderedDeleteIcon(ingredient);
    return (
      <ListItem key={id}>
        <Autocomplete
          options={ingredientOptions}
          value={ingredientOption}
          autoHighlight={true}
          disablePortal
          id="combo-box-demo"
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Ingredient" />}
          onChange={(event: any, newValue: IngredientOption | null) => {
            handleAutoCompleteChange(newValue as IngredientOption, ingredient);
          }}
          onInputChange={(event, value, reason) => handleAutoCompleteInputChange(value)}
          onOpen={handleOpenAutoComplete}
          onClose={handleCloseAutoComplete}
          onKeyDown={handleAutoCompleteKeyDown}
          key={id}
          isOptionEqualToValue={myIsOptionEqualToValue}
        />
        {renderedDeleteIcon}

      </ListItem>
    );
  };

  const getRenderedIngredientSelect = (ingredient: IngredientEntity): JSX.Element => {
    const ingredientOption: IngredientOption = { value: ingredient, label: ingredient.name };
    return getIngredientListItem(ingredientOption, ingredient.id, ingredient);
  };

  const getPlaceholderSelect = (): JSX.Element => {
    const ingredientOption: IngredientOption = { value: null, label: '' };
    return getIngredientListItem(ingredientOption, 'placeholder', null);
  };

  const getRenderedListOfIngredients = () => {

    const listOfIngredients: JSX.Element[] = ingredientsInDish.map((ingredient: IngredientEntity) => {
      return getRenderedIngredientSelect(ingredient);
    });

    const renderedPlaceholderSelect = getPlaceholderSelect();
    listOfIngredients.push(renderedPlaceholderSelect);

    return listOfIngredients;
  };

  const renderedListOfIngredients = getRenderedListOfIngredients();

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Assign Ingredients to {dishLabel}</DialogTitle>
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
          <List>
            {renderedListOfIngredients}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

function mapStateToProps(state: any, ownProps: AssignIngredientsToDishDialogPropsFromParent) {
  return {
    dish: getDish(state, ownProps.dishId),
    allIngredients: getIngredients(state),
    ingredientsInDish: getIngredientsByDish(state, ownProps.dishId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddIngredientToDish: addIngredientToDish,
    onReplaceIngredientInDish: replaceIngredientInDish,
    onDeleteIngredientFromDish: deleteIngredientFromDish,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignIngredientsToDishDialog);

