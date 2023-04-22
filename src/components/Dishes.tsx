import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertProps } from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';

import {
  AccompanimentTypeEntity,
  DishEntity,
  DishRow,
  Order,
  UiState
} from '../types';
import AssignIngredientsToDishDialog from './AssignIngredientsToDishDialog';
import { addDish, deleteDish, sortDishesAndSetRows, updateDish } from '../controllers';
import { getAccompanimentTypesByUser, getCurrentEditDish, getDishes, getDishRows, getSortBy, getSortOrder, getUiState } from '../selectors';
import { MealWheelDispatch, sortDishes } from '../models';
import { setCurrentEditDish, setRows, setSortBy, setSortOrder } from '../models/dishesUI';

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

interface TableProps {
  headCells: HeadCell[];
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}

export interface DishesProps {
  accompanimentTypes: AccompanimentTypeEntity[];
  currentEditDish: DishRow | null,
  dishes: DishEntity[];
  rows: DishRow[];
  uiState: UiState;
  sortOrder: Order;
  sortBy: string;
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;
  onDeleteDish: (id: string) => any;
  onSortDishesAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortDishes: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: DishRow[]) => any;
  onSetCurrentEditDish: (currentEditDish: DishRow | null) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;
}

const DishesTableHead = (props: TableProps) => {

  const { headCells, order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
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

const Dishes = (props: DishesProps) => {

  const [dishNameInRow, setDishNameInRow] = React.useState<any>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [showAssignIngredientsToDish, setShowAssignIngredientsToDish] = React.useState(false);
  const [dishId, setDishId] = React.useState('');

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  React.useEffect(() => {
    if (props.uiState === UiState.Dishes) {

      const newRows: DishRow[] = getRows();
      props.onSetRows(newRows);
    }
  }, [props.uiState]);


  React.useEffect(() => {
    if (!isNil(dishNameInRow)) {
      const byTagNameResults = dishNameInRow.getElementsByTagName('input');
      const nameField = byTagNameResults[0];
      nameField.focus();
    }
  }, [dishNameInRow]);


  interface IdToNumberMap {
    [id: string]: number;
  }

  let dishIdToDishRowIndex: IdToNumberMap = {};

  // Avoid a layout jump when reaching the last page with empty props.rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  const getHeadCells = (): HeadCell[] => {

    const headCells: HeadCell[] = [
      {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Main',
      },
      {
        id: 'type',
        numeric: false,
        disablePadding: true,
        label: 'Type',
      },
      {
        id: 'minimumInterval',
        numeric: true,
        disablePadding: true,
        label: 'Minimum interval in days (0 for no minimum)',
      },
      {
        id: 'numAccompanimentsRequired',
        numeric: false,
        disablePadding: true,
        label: 'Number of required accompaniments',
      },
    ];

    for (const accompanimentType of props.accompanimentTypes) {
      headCells.push({
        id: accompanimentType.name,
        numeric: false,
        disablePadding: true,
        label: accompanimentType.name,
      });
    }

    return headCells;
  };

  const getRows = (): DishRow[] => {

    const rows: DishRow[] = props.dishes.map((dish: DishEntity) => {
      const row: DishRow = {
        dish,
        name: dish.name,
        type: dish.type,
        last: dish.last,
        minimumInterval: dish.minimumInterval,
        numAccompanimentsRequired: !isNil(dish.numAccompanimentsRequired) ? dish.numAccompanimentsRequired : 0,
      };
      return row;
    });
    return rows;
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string,
  ) => {
    const isAsc = props.sortBy === property && props.sortOrder === 'asc';
    const sortOrder: Order = isAsc ? 'desc' : 'asc';
    props.onSetSortOrder(sortOrder);
    props.onSetSortBy(property);
    props.onSortDishesAndSetRows(sortOrder, property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getDefaultDishEntity = (): DishEntity => {
    const dish: DishEntity = {
      id: '',
      name: '',
      type: 'main',
      minimumInterval: 5,
      last: null,
      prepEffort: 5,
      prepTime: 15,
      cleanupEffort: 5,
    };
    return dish;
  };

  const getDefaultDishRow = (dish: DishEntity): DishRow => {

    const dishRow: DishRow = {
      dish,
      name: '',
      type: 'main',
      minimumInterval: 5,
      last: null,
      numAccompanimentsRequired: 0,
    };

    return dishRow;
  };

  const handleAddRow = () => {

    const dish: DishEntity = getDefaultDishEntity();
    const dishRow: DishRow = getDefaultDishRow(dish);

    const newRows = cloneDeep(props.rows);
    newRows.unshift(dishRow);
    props.onSetRows(newRows);

    props.onSetCurrentEditDish(dishRow);

  };

  const handleEditClick = (dishEntityData: DishRow) => {
    props.onSetCurrentEditDish(dishEntityData);
  };

  const handleAssignIngredientsToDish = (dishEntityData: DishRow) => {
    setDishId(dishEntityData.dish.id);
    setShowAssignIngredientsToDish(true);
  };

  const handleCloseAssignIngredientsToDish = () => {
    setShowAssignIngredientsToDish(false);
  };

  const handleDeleteClick = (dishEntityData: DishRow) => {
    props.onSetRows(props.rows.filter((row) => row.dish.id !== dishEntityData.dish.id));
    props.onDeleteDish(dishEntityData.dish.id);
    props.onSetCurrentEditDish(null);
  };

  const handleSaveClick = () => {

    if (!isNil(props.currentEditDish)) {

      // check for empty name
      if (props.currentEditDish.name === '') {
        setSnackbar({ children: 'Error while saving dish: name can\'t be empty.', severity: 'error' });
        return;
      }

      // check for duplicate dish names.
      const updatedDishName = props.currentEditDish.name;
      for (let dishIndex = 0; dishIndex < props.dishes.length; dishIndex++) {
        const existingDish: DishEntity = props.dishes[dishIndex];
        if (props.currentEditDish.dish.id !== existingDish.id && existingDish.name === updatedDishName) {
          setSnackbar({ children: 'Error while saving dish: duplicate dish name', severity: 'error' });
          return;
        }
      }

      if (props.currentEditDish.dish.id === '') {
        const newDish: DishEntity = {
          id: '',
          name: props.currentEditDish.name,
          type: props.currentEditDish.type,
          minimumInterval: props.currentEditDish.minimumInterval,
          last: null,
          prepEffort: 5,
          prepTime: 15,
          cleanupEffort: 5,
        };
        props.onAddDish(newDish)
          .then((newDishId: string) => {
            const selectedDishRowIndex = dishIdToDishRowIndex[''];
            if (selectedDishRowIndex !== -1) {
              const clonedRows = cloneDeep(props.rows);
              const selectedRow: DishRow = clonedRows[selectedDishRowIndex];
              selectedRow.dish.id = newDishId;

              // auto add new row
              const dish: DishEntity = getDefaultDishEntity();
              const dishRow: DishRow = getDefaultDishRow(dish);

              clonedRows.unshift(dishRow);
              // following call updates id in row that was just saved and adds a new row
              props.onSetRows(clonedRows);

              props.onSetCurrentEditDish(dishRow);
            }
          });
      } else {
        const updatedDish: DishEntity = cloneDeep(props.currentEditDish.dish);
        updatedDish.name = props.currentEditDish.name;
        updatedDish.type = props.currentEditDish.type;
        updatedDish.minimumInterval = props.currentEditDish.minimumInterval;
        updatedDish.numAccompanimentsRequired = props.currentEditDish.numAccompanimentsRequired;
        props.onUpdateDish(props.currentEditDish.dish.id, updatedDish);
      }
      props.onSetCurrentEditDish(null);
    }

  };

  const handleCancelClick = () => {

    if (!isNil(props.currentEditDish) && !isNil(props.currentEditDish.dish) && (props.currentEditDish.dish.id === '')) {
      // new dish - discard row

      const selectedIndex = dishIdToDishRowIndex[''];
      if (selectedIndex !== -1) {
        const newRows = cloneDeep(props.rows);
        newRows.splice(selectedIndex, 1);
        props.onSetRows(newRows);
      }

    } else {

      // revert to row before edits
      //    dishEntity hasn't been updated yet

      if (!isNil(props.currentEditDish)) {
        const selectedDishRowIndex = dishIdToDishRowIndex[props.currentEditDish.dish.id];
        const selectedDishRow: DishRow = props.rows[selectedDishRowIndex];
        const unmodifiedDishEntity: DishEntity = selectedDishRow.dish;
        selectedDishRow.name = unmodifiedDishEntity.name;
        selectedDishRow.type = unmodifiedDishEntity.type;
        selectedDishRow.minimumInterval = unmodifiedDishEntity.minimumInterval;
        selectedDishRow.last = unmodifiedDishEntity.last;
        // }
        // debugger;
        /* old code that I don't understand. understand, then convert....
          const clonedRows = cloneDeep(rows);
          rows[selectedDishRowIndex] = selectedDishRow;
          setRows(clonedRows);
        */
      }

    }

    props.onSetCurrentEditDish(null);
  };

  const handleUpdateDishName = (selectedDishRow: DishRow, dishName: string) => {
    selectedDishRow.name = dishName;
  };

  const updateSelectedRowProperty = (selectedDishRow: DishRow, propertyName: string, propertyValue: any): DishRow => {
    const clonedRows = cloneDeep(props.rows);
    const selectedDishRowIndex = dishIdToDishRowIndex[selectedDishRow.dish.id];
    const selectedRow: DishRow = clonedRows[selectedDishRowIndex];
    (selectedRow as any)[propertyName] = propertyValue;
    props.onSetRows(clonedRows);
    return selectedRow;
  };

  const handleUpdateDishType = (selectedDishRow: DishRow, updatedDishType: string) => {
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'type', updatedDishType);
    props.onSetCurrentEditDish(selectedRow);
  };

  const handleUpdateMinimumInterval = (selectedDishRow: DishRow, minimumIntervalInput: string) => {
    const minimumInterval = parseInt(minimumIntervalInput, 10);
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'minimumInterval', minimumInterval);
    props.onSetCurrentEditDish(selectedRow);
  };

  const handleUpdateNumAccompanimentsRequired = (selectedDishRow: DishRow, numAccompanimentsRequiredInput: string) => {
    const numAccompanimentsRequired = parseInt(numAccompanimentsRequiredInput, 10);
    const selectedRow: DishRow = updateSelectedRowProperty(selectedDishRow, 'numAccompanimentsRequired', numAccompanimentsRequired);
    props.onSetCurrentEditDish(selectedRow);
  };

  const handleToggleSetAllowableAccompaniment = (dish: DishEntity, accompanimentType: AccompanimentTypeEntity, checked: boolean) => {
    console.log('handleToggleSetAllowableAccompaniment');
    console.log(dish);
    console.log(accompanimentType);
    console.log(checked);
  };

  const getAccompanimentTypeOptions = (): any[] => {

    const accompanimentChoices = [
      {
        value: 'main',
        label: 'Main',
      }
    ];

    for (const accompanimentTypeEntity of props.accompanimentTypes) {
      accompanimentChoices.push({
        value: accompanimentTypeEntity.id,
        label: accompanimentTypeEntity.name,
      });
    }

    return accompanimentChoices;
  };

  const getReadOnlyAllowableAccompanimentColumn = (accompanimentType: AccompanimentTypeEntity): JSX.Element => {
    return (
      <TableCell align='center'>
        <Checkbox
          color="primary"
          disabled={true}
        />
      </TableCell>
    );
  };

  const getReadOnlyAllowableAccompanimentColumns = (): JSX.Element[] => {

    const allowableAccompanimentColumns: JSX.Element[] = props.accompanimentTypes.map((accompanimentType) => {
      return getReadOnlyAllowableAccompanimentColumn(accompanimentType);
    });

    return allowableAccompanimentColumns;
  };

  const getReadWriteAllowableAccompanimentColumn = (dish: DishEntity, accompanimentType: AccompanimentTypeEntity, isDisabled: boolean): JSX.Element => {
    return (
      <TableCell align='center'>
        <Checkbox
          color="primary"
          onChange={(event) => handleToggleSetAllowableAccompaniment(dish, accompanimentType, event.target.checked)}
          disabled={isDisabled}
        />
      </TableCell>
    );
  };

  const getReadWriteAllowableAccompanimentColumns = (dish: DishEntity, readOnly: boolean): JSX.Element[] => {

    const allowableAccompanimentColumns: JSX.Element[] = props.accompanimentTypes.map((accompanimentType) => {
      return getReadWriteAllowableAccompanimentColumn(dish, accompanimentType, readOnly);
    });

    return allowableAccompanimentColumns;
  };

  const renderEditingRow = (row: DishRow) => {

    const accompanimentTypeOptions: any[] = getAccompanimentTypeOptions();

    const isReadOnly: boolean = row.dish.type.toLowerCase() !== 'main';
    const allowableAccompanimentColumns = getReadWriteAllowableAccompanimentColumns(row.dish, isReadOnly);

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
            label='Dish name'
            defaultValue={row.name}
            variant='standard'
            onBlur={(event) => handleUpdateDishName(row, event.target.value)}
            ref={(input) => { setDishNameInRow(input); }}
          />
        </TableCell>
        <TableCell
          padding='none'
          align='center'
        >
          <TextField
            id="dishTypeTextField"
            select
            label="Dish Type"
            SelectProps={{
              native: true,
            }}
            helperText="Please select your dish type"
            onChange={(event) => handleUpdateDishType(row, event.target.value as string)}
            placeholder={'Dish Type'}
            value={row.type}
          >
            {accompanimentTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </TableCell>
        <TableCell>
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Min interval'
            defaultValue={row.minimumInterval}
            variant='standard'
            onBlur={(event) => handleUpdateMinimumInterval(row, event.target.value)}
            InputProps={{
              inputProps: {
                min: 0
              }
            }}
          />

        </TableCell>
        <TableCell align='center'>
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Num'
            defaultValue={row.numAccompanimentsRequired}
            variant='standard'
            onBlur={(event) => handleUpdateNumAccompanimentsRequired(row, event.target.value)}
            disabled={row.type !== 'main'}
            InputProps={{
              inputProps: {
                min: 0
              }
            }}
          />
        </TableCell>
        {allowableAccompanimentColumns}
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

  const renderInactiveRow = (row: DishRow) => {

    const allowableAccompanimentColumns = getReadOnlyAllowableAccompanimentColumns();

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
            label='Dish name'
            defaultValue={row.name}
            disabled
            variant='standard'
          />
        </TableCell>
        <TableCell
          padding='none'
          align='center'
        >
          <Select
            placeholder={'Dish Type'}
            value={row.type}
            disabled
          >
            <MenuItem value={'main'}>Main</MenuItem>
            <MenuItem value={'salad'}>Salad</MenuItem>
            <MenuItem value={'side'}>Side</MenuItem>
            <MenuItem value={'veggie'}>Veggie</MenuItem>
          </Select>
        </TableCell>

        <TableCell>
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Min interval'
            defaultValue={row.minimumInterval}
            disabled
            variant='standard'
          />
        </TableCell>

        <TableCell align='center'>
          <TextField
            sx={{ m: 1, maxHeight: '40px', marginTop: '12px' }}
            type='number'
            label='Num'
            defaultValue={row.numAccompanimentsRequired}
            disabled
            variant='standard'
          />
        </TableCell>
        {allowableAccompanimentColumns}
        <TableCell align='center'>
          <Tooltip title="Edit">
            <IconButton
              id={row.name}
              onClick={() => handleEditClick(row)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Assign Ingredients to Dish">
            <IconButton
              id={row.name}
              onClick={() => handleAssignIngredientsToDish(row)}
            >
              <LocalGroceryStoreIcon />
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

  // TEDTODO - only invoke this when necesssary
  const buildDishIdToDishRowIndex = () => {
    dishIdToDishRowIndex = {};
    for (let index = 0; index < props.rows.length; index++) {
      dishIdToDishRowIndex[props.rows[index].dish.id] = index;
    }
  };

  const renderSortedTableContents = () => {
    buildDishIdToDishRowIndex();
    const sortedDishes: DishRow[] = props.rows;
    // const sortedDishes: DishRow[] = rows.slice().sort(getComparator(order, orderBy));
    const pagedSortedDishes = sortedDishes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <React.Fragment>
        {pagedSortedDishes
          .map((row: DishRow, index: number) => {
            let renderedRow;
            if (!isNil(props.currentEditDish) && props.currentEditDish.dish.id === row.dish.id) {
              renderedRow = renderEditingRow(row);
            } else {
              renderedRow = renderInactiveRow(row);
            }
            return renderedRow;
          })}
      </React.Fragment>
    );
  };

  const headCells = getHeadCells();

  return (
    <div>
      <AssignIngredientsToDishDialog
        open={showAssignIngredientsToDish}
        dishId={dishId}
        onClose={handleCloseAssignIngredientsToDish}
      />
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <div>
            <Button color="primary" startIcon={<AddIcon />} onClick={handleAddRow}>
              Add dish
            </Button>
          </div>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              size={'small'}
            >
              <DishesTableHead
                headCells={headCells}
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
    </div>);
};

function mapStateToProps(state: any) {
  return {
    accompanimentTypes: getAccompanimentTypesByUser(state),
    dishes: getDishes(state),
    rows: getDishRows(state),
    currentEditDish: getCurrentEditDish(state),
    uiState: getUiState(state),
    sortOrder: getSortOrder(state),
    sortBy: getSortBy(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onAddDish: addDish,
    onUpdateDish: updateDish,
    onDeleteDish: deleteDish,
    onSortDishes: sortDishes,
    onSetRows: setRows,
    onSetCurrentEditDish: setCurrentEditDish,
    onSetSortOrder: setSortOrder,
    onSetSortBy: setSortBy,
    onSortDishesAndSetRows: sortDishesAndSetRows,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
