import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { isNil } from 'lodash';

import { getDish, getIngredients, getIngredientsByDish } from '../selectors';
import { DishEntity, IngredientEntity } from '../types';

import Box from '@mui/material/Box';

import { DataGrid, GridCellParams, ValueOptions } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  GridColumns,
  GridRowParams,
  MuiEvent,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid-pro';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';

// table
interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleAddRow = () => {
    // const id = 'newIngredient' + uuidv4();
    const id = '53d8be67-3993-40d4-868e-0b0c0455362b';
    setRows((oldRows) => [...oldRows, {
      id,
      name: 'fresh basil',
      isNew: true
    }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
        Add ingredient
      </Button>
    </GridToolbarContainer>
  );
}







// dialog

export interface AssignIngredientsToDishDialogPropsFromParent {
  open: boolean;
  dishId: string;
  onClose: () => void;
}

export interface AssignIngredientsToDishDialogProps extends AssignIngredientsToDishDialogPropsFromParent {
  dish: DishEntity | null;
  allIngredients: IngredientEntity[];
  ingredientsInDish: IngredientEntity[];
}

const initialRows: GridRowsProp = [];

function AssignIngredientsToDishDialog(props: AssignIngredientsToDishDialogProps) {

  const { open, dish, allIngredients, ingredientsInDish, onClose } = props;

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState(initialRows);
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  const handleCloseSnackbar = () => setSnackbar(null);

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

    // check for duplicate ingredient names.
    const updatedIngredientName = updatedIngredient.name;
    for (let ingredientIndex = 0; ingredientIndex < rows.length; ingredientIndex++) {
      const existingIngredient: IngredientEntity = rows[ingredientIndex];
      if (updatedIngredient.id !== existingIngredient.id && existingIngredient.name === updatedIngredientName) {
        setSnackbar({ children: 'Error while saving user: duplicate ingredient name', severity: 'error' });
        return;
      }
    }

    const updatedRow = { ...updatedIngredient, isNew: false };
    setRows(rows.map((row) => (row.id === updatedIngredient.id ? updatedRow : row)));

    const ingredient: IngredientEntity = {
      id: updatedIngredient.id,
      name: updatedIngredient.name,
      showInGroceryList: updatedIngredient.showInGroceryList,
      ingredients: [],
    };
    // if (updatedIngredient.id.startsWith('newIngredient')) {
    //   props.onAddIngredient(ingredient);
    // } else {
    //   props.onUpdateIngredient(updatedRow.id, ingredient);
    // }

    return updatedRow;
  };

  console.log('generate ingredientOptions');

  const ingredientOptions: ValueOptions[] = allIngredients.map((ingredient: IngredientEntity) => {
    return {
      value: ingredient.id,
      label: ingredient.name,
    };
  });

  console.log(allIngredients);
  console.log(ingredientOptions);

  const ingredientsInDishColumns: GridColumns = [
    { field: 'name', headerName: 'Name', width: 240, editable: true },
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
    const rows: GridRowsProp = ingredientsInDish.map((ingredient: IngredientEntity) => {
      const row: GridRowModel = {
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

  const newRows: GridRowsProp = getRows();
  if (!rowsRead && newRows.length > 0) {
    setRowsRead(true);
    setRows(newRows);
  }

  const handleClose = () => {
    onClose();
  };

  const dishLabel: string = isNil(dish) ? 'Unknown dish' : dish.name;

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Assign ingredients to {dishLabel}</DialogTitle>
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
            initialState={{
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }} rows={rows}
            columns={ingredientsInDishColumns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            components={{
              Toolbar: EditToolbar,
            }}
            componentsProps={{
              toolbar: { setRows, setRowModesModel },
            }}
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
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(AssignIngredientsToDishDialog);

