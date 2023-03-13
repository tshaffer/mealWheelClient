import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';
import { IngredientRow, IngredientEntity, Order, UiState } from '../types';

import { TableHead, TableRow, TableCell, TableSortLabel, Box, AlertProps, Alert, Button, Paper, Snackbar, Table, TableBody, TableContainer, TablePagination, Checkbox, TextField, IconButton, Tooltip } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';


import { visuallyHidden } from '@mui/utils';
import { MealWheelDispatch, setCurrentEditIngredient, setIngredientRows, setIngredientSortBy, setIngredientSortOrder, sortIngredients } from '../models';
import { addIngredient, deleteIngredient, sortIngredientsAndSetRows, updateIngredient } from '../controllers';
import { getCurrentEditIngredient, getIngredientRows, getIngredients, getIngredientSortBy, getIngredientSortOrder, getSortBy, getSortOrder, getUiState } from '../selectors';


interface HeadCell {
  disablePadding: boolean;
  id: keyof IngredientRow;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Main',
  },
  {
    id: 'showInGroceryList',
    numeric: false,
    disablePadding: true,
    label: 'Show In Grocery List',
  },
];

interface TableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof IngredientRow) => void;
  order: Order;
  orderBy: string;
}

export interface IngredientsProps {
  currentEditIngredient: IngredientRow | null,
  ingredients: IngredientEntity[];
  rows: IngredientRow[];
  onAddIngredient: (ingredient: IngredientEntity) => any;
  onUpdateIngredient: (id: string, ingredient: IngredientEntity) => any;
  sortOrder: Order;
  sortBy: string;
  uiState: UiState;
  onDeleteIngredient: (id: string) => any;
  onSortIngredientsAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortIngredients: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: IngredientRow[]) => any;
  onSetCurrentEditIngredient: (currentEditIngredient: IngredientRow | null) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;
}

const IngredientsTableHead = (props: TableProps) => {

  const { order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    (property: keyof IngredientRow) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component='span' sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          key={'actions'}
          align={'center'}
          padding={'none'}
        >
          Actions
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

const Ingredients = (props: IngredientsProps) => {

  const [ingredientNameInRow, setIngredientNameInRow] = React.useState<any>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [ingredientId, setIngredientId] = React.useState('');

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  React.useEffect(() => {
    if (props.uiState === UiState.Ingredients) {
      const newRows: IngredientRow[] = getRows();
      props.onSetRows(newRows);
    }
  }, [props.uiState]);

  React.useEffect(() => {
    if (!isNil(ingredientNameInRow)) {
      const byTagNameResults = ingredientNameInRow.getElementsByTagName('input');
      const nameField = byTagNameResults[0];
      nameField.focus();
    }
  }, [ingredientNameInRow]);

  interface IdToNumberMap {
    [id: string]: number;
  }

  let ingredientIdToIngredientRowIndex: IdToNumberMap = {};

  const getRows = (): IngredientRow[] => {
    const rows: IngredientRow[] = props.ingredients.map((ingredient: IngredientEntity) => {
      const row: IngredientRow = {
        ingredient,
        name: ingredient.name,
        showInGroceryList: ingredient.showInGroceryList,
      };
      return row;
    });
    return rows;
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IngredientRow,
  ) => {
    const isAsc = props.sortBy === property && props.sortOrder === 'asc';
    const sortOrder: Order = isAsc ? 'desc' : 'asc';
    props.onSetSortOrder(sortOrder);
    props.onSetSortBy(property);
    props.onSortIngredientsAndSetRows(sortOrder, property);
  };


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDefaultIngredientEntity = (): IngredientEntity => {
    const ingredient: IngredientEntity = {
      id: '',
      userId: '',
      name: '',
      showInGroceryList: true,
      ingredients: [],
    };
    return ingredient;
  };

  const getDefaultIngredientRow = (ingredient: IngredientEntity): IngredientRow => {

    const ingredientRow: IngredientRow = {
      ingredient,
      name: '',
      showInGroceryList: true,
    };

    return ingredientRow;
  };


  const handleAddRow = () => {
    const ingredient: IngredientEntity = getDefaultIngredientEntity();
    const ingredientRow: IngredientRow = getDefaultIngredientRow(ingredient);

    const newRows = cloneDeep(props.rows);
    newRows.unshift(ingredientRow);
    props.onSetRows(newRows);

    props.onSetCurrentEditIngredient(ingredientRow);
  };

  const handleEditClick = (ingredientRow: IngredientRow) => {
    props.onSetCurrentEditIngredient(ingredientRow);
  };

  const handleDeleteClick = (ingredientRow: IngredientRow) => {
    debugger;
    // props.onSetRows(props.rows.filter((row) => row.dish.id !== dishEntityData.dish.id));
    // props.onDeleteDish(dishEntityData.dish.id);
    // props.onSetCurrentEditDish(null);
  };

  const handleSaveClick = () => {
    if (!isNil(props.currentEditIngredient)) {

      // check for empty name
      if (props.currentEditIngredient.name === '') {
        setSnackbar({ children: 'Error while saving ingredient: name can\'t be empty.', severity: 'error' });
        return;
      }

      // check for duplicate ingredient names.
      const updatedIngredientName = props.currentEditIngredient.name;
      for (let ingredientIndex = 0; ingredientIndex < props.ingredients.length; ingredientIndex++) {
        const existingIngredient: IngredientEntity = props.ingredients[ingredientIndex];
        if (props.currentEditIngredient.ingredient.id !== existingIngredient.id && existingIngredient.name === updatedIngredientName) {
          setSnackbar({ children: 'Error while saving ingredient: duplicate ingredient name', severity: 'error' });
          return;
        }
      }

      if (props.currentEditIngredient.ingredient.id === '') {
        const newIngredient: IngredientEntity = {
          id: '',
          userId: '',
          name: props.currentEditIngredient.name,
          showInGroceryList: props.currentEditIngredient.showInGroceryList,
          ingredients: [],
        };
        props.onAddIngredient(newIngredient)
          .then((newIngredientId: string) => {
            const selectedIngredientRowIndex = ingredientIdToIngredientRowIndex[''];
            if (selectedIngredientRowIndex !== -1) {
              const clonedRows = cloneDeep(props.rows);
              const selectedRow: IngredientRow = clonedRows[selectedIngredientRowIndex];
              selectedRow.ingredient.id = newIngredientId;

              // auto add new row
              const ingredient: IngredientEntity = getDefaultIngredientEntity();
              const ingredientRow: IngredientRow = getDefaultIngredientRow(ingredient);
          
              clonedRows.unshift(ingredientRow);
              // following call updates id in row that was just saved and adds a new row
              props.onSetRows(clonedRows);
          
              props.onSetCurrentEditIngredient(ingredientRow);
            }
          });
      } else {
        const updatedIngredient: IngredientEntity = cloneDeep(props.currentEditIngredient.ingredient);
        updatedIngredient.name = props.currentEditIngredient.name;
        updatedIngredient.showInGroceryList = props.currentEditIngredient.showInGroceryList;
        props.onUpdateIngredient(props.currentEditIngredient.ingredient.id, updatedIngredient);
      }
      props.onSetCurrentEditIngredient(null);
    }
  };

  const handleCancelClick = () => {
    if (!isNil(props.currentEditIngredient) && !isNil(props.currentEditIngredient.ingredient) && (props.currentEditIngredient.ingredient.id === '')) {
      // new dish - discard row

      const selectedIndex = ingredientIdToIngredientRowIndex[''];
      if (selectedIndex !== -1) {
        const newRows = cloneDeep(props.rows);
        newRows.splice(selectedIndex, 1);
        props.onSetRows(newRows);
      }

    } else {

      // revert to row before edits
      //    ingredientEntity hasn't been updated yet

      if (!isNil(props.currentEditIngredient)) {
        const selectedIngredientRowIndex = ingredientIdToIngredientRowIndex[props.currentEditIngredient.ingredient.id];
        const selectedIngredientRow: IngredientRow = props.rows[selectedIngredientRowIndex];
        const unmodifiedIngredientEntity: IngredientEntity = selectedIngredientRow.ingredient;
        selectedIngredientRow.name = unmodifiedIngredientEntity.name;
        selectedIngredientRow.showInGroceryList = unmodifiedIngredientEntity.showInGroceryList;
      }

    }

    props.onSetCurrentEditIngredient(null);
  };

  const handleUpdateIngredientName = (selectedIngredientRow: IngredientRow, ingredientName: string) => {
    selectedIngredientRow.name = ingredientName;
  };

  const updateSelectedRowProperty = (selectedIngredientRow: IngredientRow, propertyName: string, propertyValue: any): IngredientRow => {
    const clonedRows = cloneDeep(props.rows);
    const selectedIngredientRowIndex = ingredientIdToIngredientRowIndex[selectedIngredientRow.ingredient.id];
    const selectedRow: IngredientRow = clonedRows[selectedIngredientRowIndex];
    (selectedRow as any)[propertyName] = propertyValue;
    props.onSetRows(clonedRows);
    return selectedRow;
  };

  const handleToggleShowInGroceryList = (selectedIngredientRow: IngredientRow, showInGroceryList: boolean) => {
    const selectedRow: IngredientRow = updateSelectedRowProperty(selectedIngredientRow, 'showInGroceryList', showInGroceryList);
    props.onSetCurrentEditIngredient(selectedRow);
  };

  // Avoid a layout jump when reaching the last page with empty props.rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  const renderEditingRow = (row: IngredientRow) => {
    const isItemSelected = true;
    return (
      <TableRow
        hover
        role='checkbox'
        tabIndex={-1}
        // key={row.name}
        selected={isItemSelected}
      >
        <TableCell
          component='th'
          scope='row'
          padding='none'
          align='center'
        >
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='string'
            label='Ingredient name'
            defaultValue={row.name}
            variant='standard'
            onBlur={(event) => handleUpdateIngredientName(row, event.target.value)}
            ref={(input) => { setIngredientNameInRow(input); }}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.showInGroceryList}
            onChange={(event) => handleToggleShowInGroceryList(row, event.target.checked)}
          />
        </TableCell>
        <TableCell align='center'>
          <Tooltip title="Save">
            <IconButton
              id={row.name}
              onClick={() => handleSaveClick()}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              id={row.name}
              onClick={() => handleCancelClick()}
            >
              <CancelIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  const renderInactiveRow = (row: IngredientRow) => {
    const isItemSelected = false;
    return (
      <TableRow
        hover
        role='checkbox'
        tabIndex={-1}
        key={row.name}
        selected={isItemSelected}
      >
        <TableCell
          component='th'
          // id={labelId}
          scope='row'
          padding='none'
          align='center'
        >
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='string'
            label='Ingredient name'
            defaultValue={row.name}
            disabled
            variant='standard'
          />
        </TableCell>

        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.showInGroceryList}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Tooltip title="Edit">
            <IconButton
              id={row.name}
              onClick={() => handleEditClick(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              id={row.name}
              onClick={() => handleDeleteClick(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  const buildIngredientIdToIngredientRowIndex = () => {
    ingredientIdToIngredientRowIndex = {};
    for (let index = 0; index < props.rows.length; index++) {
      ingredientIdToIngredientRowIndex[props.rows[index].ingredient.id] = index;
    }
  };

  const renderSortedTableContents = () => {
    buildIngredientIdToIngredientRowIndex();
    const sortedIngredients: IngredientRow[] = props.rows;
    const pagedSortedIngredients = sortedIngredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <React.Fragment>
        {pagedSortedIngredients
          .map((row: IngredientRow, index: number) => {
            let renderedRow;
            if (!isNil(props.currentEditIngredient) && props.currentEditIngredient.ingredient.id === row.ingredient.id) {
              renderedRow = renderEditingRow(row);
            } else {
              renderedRow = renderInactiveRow(row);
            }
            return renderedRow;
          })}
      </React.Fragment>
    );
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <div>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
              Add ingredient
            </Button>
          </div>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              size={'small'}
            >
              <IngredientsTableHead
                order={props.sortOrder}
                orderBy={props.sortBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {renderSortedTableContents()}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (33) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={props.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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

        </Paper>
      </Box>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    ingredients: getIngredients(state),
    rows: getIngredientRows(state),
    currentEditIngredient: getCurrentEditIngredient(state),
    uiState: getUiState(state),
    sortOrder: getIngredientSortOrder(state),
    sortBy: getIngredientSortBy(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddIngredient: addIngredient,
    onUpdateIngredient: updateIngredient,
    onDeleteIngredient: deleteIngredient,
    onSortIngredients: sortIngredients,
    onSetRows: setIngredientRows,
    onSetCurrentEditIngredient: setCurrentEditIngredient,
    onSetSortOrder: setIngredientSortOrder,
    onSetSortBy: setIngredientSortBy,
    onSortIngredientsAndSetRows: sortIngredientsAndSetRows,

  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Ingredients);

