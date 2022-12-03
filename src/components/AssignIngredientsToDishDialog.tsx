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

const placeholderIngredientId = 'Select ingredient';

function AssignIngredientsToDishDialog(props: AssignIngredientsToDishDialogProps) {

  const { open, dishId, dish, allIngredients, ingredientsInDish, onClose } = props;

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState<IngredientInDishRowModel[]>(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

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
      name: id,
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
        name: placeholderIngredientId,
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

  const ingredientOptions: any[] = allIngredients.map((ingredientEntity: IngredientEntity) => {
    return {
      value: ingredientEntity.name,
      label: ingredientEntity.name,
    };
  });
  ingredientOptions.push({
    value: placeholderIngredientId,
    label: 'Select ingredient',
  });

  const ingredientsInDishColumns: GridColumns = [
    {
      field: 'name',
      headerName: 'Ingredient Name',
      width: 200,
      editable: true,
      valueFormatter: (params: GridValueFormatterParams<string>) => {
        if (params.value == null) {
          return '';
        }
        const valueFormatted = params.value.toString();
        return valueFormatted;
      },

      renderEditCell: (params) => {
        console.log('renderEditCell');
        console.log(params);
        console.log(ingredientOptions);
        return (
          <AutocompleteEditCell
            {...params}
            options={ingredientOptions}
            freeSolo={false}
            multiple={false}
            disableClearable
          />
        );
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
              key={0}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
              key={0}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
            key={0}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
            key={0}
          />,
        ];
      },
    },
  ];

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
          <DataGrid
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
          )}
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

