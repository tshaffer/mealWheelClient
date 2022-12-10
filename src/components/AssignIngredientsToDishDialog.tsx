import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { cloneDeep, isNil, isString } from 'lodash';

import { getDish, getIngredients, getIngredientsByDish } from '../selectors';
import { DishEntity, IngredientEntity, IngredientInDishRowModel } from '../types';

import Box from '@mui/material/Box';

import { DataGrid, GridCellParams, GridValueFormatterParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid-pro';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import { addIngredientToDish, replaceIngredientInDish } from '../models';
import { AutocompleteEditCell } from './AutocompleteEditCell';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AutocompleteValue } from '@mui/material/useAutocomplete';

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
  onReplaceIngredientInDish: (dishId: string, existingIngredientId: string, newIngredient: IngredientEntity) => any;
}

const initialRows: IngredientInDishRowModel[] = [];

const placeholderIngredientId = 'placeholderIngredientId';
const placeholderIngredientLabel = 'Select ingredient';

function AssignIngredientsToDishDialog(props: AssignIngredientsToDishDialogProps) {

  const { open, dishId, dish, allIngredients, ingredientsInDish, onClose } = props;

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState<IngredientInDishRowModel[]>(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);
  const [selectIngredientValue, setSelectIngredientValue] = React.useState<string>(placeholderIngredientLabel);

  React.useEffect(() => {

    if (isString(dishId) && dishId !== '') {
      setRows([]);

      const newRows: IngredientInDishRowModel[] = getRows();
      if (newRows.length > 0) {
        setRowsRead(true);
        setRows(newRows);
      }

      handleAddRow();
    }
  }, [dishId]);

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleAddRow = () => {
    const id = placeholderIngredientId;
    setRows((oldRows) => [...oldRows, {
      id: id,
      name: placeholderIngredientLabel,
      isNew: true
    }]);

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  const handleRowEditStart = (
    params: GridRowParams,
    event: MuiEvent<React.SyntheticEvent>,
  ) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleProcessRowUpdateError = React.useCallback((error: Error) => {
    console.log('handleProcessRowUpdateError: ', error.message);
    // setSnackbar({ children: error.message, severity: 'error' });
  }, []);

  const processRowUpdate = (updatedIngredient: GridRowModel) => {

    // check for empty name
    if (updatedIngredient.name === '') {
      setSnackbar({ children: 'Error: ingredient can\'t be empty.', severity: 'error' });
      return;
    }

    // find matching ingredient
    let matchingIngredient: IngredientEntity | null = null;
    const ingredientName: string = updatedIngredient.name;
    for (const ingredientEntity of allIngredients) {
      if (ingredientName === ingredientEntity.name) {
        matchingIngredient = ingredientEntity;
      }
    }
    if (isNil(matchingIngredient)) {
      setSnackbar({ children: 'Error: ingredient not found', severity: 'error' });
      return;
    }

    // check for duplicates
    const updatedIngredientName = updatedIngredient.name;
    for (let ingredientIndex = 0; ingredientIndex < rows.length; ingredientIndex++) {
      const existingIngredient: any = rows[ingredientIndex];
      if (existingIngredient.name === updatedIngredientName) {
        setSnackbar({ children: 'Error while saving user: duplicate ingredient name', severity: 'error' });
        return;
      }
    }

    const addRow: boolean = updatedIngredient.isNew;

    const updatedRow = { ...updatedIngredient, isNew: false };
    const updatedRowWithNewId = cloneDeep(updatedRow);
    updatedRowWithNewId.id = matchingIngredient.id;

    const newRows = [];
    for (const row of rows) {
      if (row.id === updatedIngredient.id) {
        newRows.push(updatedRowWithNewId);
      } else {
        newRows.push(row);
      }
    }

    if (addRow) {
      const newestRows = [...newRows, {
        id: placeholderIngredientId,
        name: placeholderIngredientLabel,
        isNew: true
      }];

      setRows(newestRows);
    }

    setRowModesModel((oldModel) => ({
      ...oldModel,
      [placeholderIngredientId]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));

    const ingredientEntity: IngredientEntity = {
      id: matchingIngredient.id,
      name: matchingIngredient.name,
      showInGroceryList: matchingIngredient.showInGroceryList,
      ingredients: matchingIngredient.ingredients,
    };

    if (addRow) {
      props.onAddIngredientToDish(dishId, ingredientEntity);
    } else {
      props.onReplaceIngredientInDish(dishId, updatedIngredient.id, ingredientEntity);
    }
    return updatedRow;
  };

  const ingredientOptions: IngredientOption[] = allIngredients.map((ingredientEntity: IngredientEntity) => {
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

  const handleInputChange = (
    id: any,
    value: any,
  ) => {
    if (id === placeholderIngredientId) {
      setSelectIngredientValue(value);
    }
  };

  const getRows = () => {
    const rows: IngredientInDishRowModel[] = ingredientsInDish.map((ingredient: IngredientEntity) => {
      const row: IngredientInDishRowModel = {
        id: ingredient.id,
        name: ingredient.name,
      };
      return row;
    });
    return rows;
  };

  const getIsCellEditable = (params: GridCellParams): boolean => {
    return true;
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
    existingIngredient: IngredientEntity,
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
      props.onReplaceIngredientInDish(props.dishId, existingIngredient.id, newIngredient);
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

  const myIsOptionEqualToValue = (option: any, value: any) => {
    if (isNil(option.value)) {
      return (option.label === value.label);
    }
    return option.value.id === value.value.id;
  };

  const getRenderedIngredientSelect = (ingredient: IngredientEntity) => {
    const ingredientOption: IngredientOption = { value: ingredient, label: ingredient.name };
    return (
      <ListItem key={ingredient.id}>
        <Autocomplete
          value={ingredientOption}
          autoHighlight={true}
          disablePortal
          id="combo-box-demo"
          options={ingredientOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Ingredient" />}
          onChange={(event: any, newValue: IngredientOption | null) => {
            handleAutoCompleteChange(newValue as IngredientOption, ingredient);
          }}
          onInputChange={(event, value, reason) => handleAutoCompleteInputChange(value)}
          onOpen={handleOpenAutoComplete}
          onClose={handleCloseAutoComplete}
          onKeyDown={handleAutoCompleteKeyDown}
          key={ingredient.id}
          isOptionEqualToValue={myIsOptionEqualToValue}
        />
        <Button>
          Delete
        </Button>
      </ListItem>
    );
  };

  const getRenderedListOfIngredients = () => {
    const listOfIngredients = ingredientsInDish.map((ingredient: IngredientEntity) => {
      return getRenderedIngredientSelect(ingredient);
    });
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
          {/* <DataGrid
            rows={rows}
            columns={ingredientsInDishColumns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            experimentalFeatures={{ newEditingApi: true }}
            isCellEditable={(params: GridCellParams) => { return getIsCellEditable(params); }}
          />
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )} */}
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
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignIngredientsToDishDialog);

