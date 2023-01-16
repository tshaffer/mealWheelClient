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

import { DishEntity, DishType, RequiredAccompanimentFlags } from '../types';
import AssignIngredientsToDishDialog from './AssignIngredientsToDishDialog';
import { addDish, updateDish } from '../controllers';
import { getDishes } from '../selectors';

interface DishRow {
  dish: DishEntity;
  name: string
  type: DishType;
  requiresAccompaniment: boolean;
  requiresSalad: boolean;
  requiresSide: boolean;
  requiresVeggie: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: boolean | string | DishEntity },
  b: { [key in Key]: boolean | string | DishEntity },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof DishRow;
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
    id: 'type',
    numeric: false,
    disablePadding: true,
    label: 'Type',
  },
  {
    id: 'requiresAccompaniment',
    numeric: false,
    disablePadding: true,
    label: 'Requires accompaniment',
  },
  {
    id: 'requiresSalad',
    numeric: false,
    disablePadding: true,
    label: 'Salad',
  },
  {
    id: 'requiresSide',
    numeric: false,
    disablePadding: true,
    label: 'Side',
  },
  {
    id: 'requiresVeggie',
    numeric: false,
    disablePadding: true,
    label: 'Veggie',
  },
];

interface TableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DishRow) => void;
  order: Order;
  orderBy: string;
}

const initialRows: DishRow[] = [];

export interface NewDishesProps {
  dishes: DishEntity[];
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;
}

const DishesTableHead = (props: TableProps) => {

  const { order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    (property: keyof DishRow) => (event: React.MouseEvent<unknown>) => {
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

const NewDishes = (props: NewDishesProps) => {

  const [rowsRead, setRowsRead] = React.useState(false);
  const [rows, setRows] = React.useState<DishRow[]>(initialRows);
  const [currentEditDish, setCurrentEditDish] = React.useState<DishRow | null>(null);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof DishRow>('name');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [showAssignIngredientsToDish, setShowAssignIngredientsToDish] = React.useState(false);
  const [dishId, setDishId] = React.useState('');

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  interface IdToNumberMap {
    [id: string]: number;
  }

  let dishIdToDishRowIndex: IdToNumberMap = {};

  const getRows = (): DishRow[] => {
    const rows: DishRow[] = props.dishes.map((dish: DishEntity) => {
      const requiresSide: boolean = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
      const requiresSalad = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
      const requiresVeggie = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
      const row: DishRow = {
        dish,
        name: dish.name,
        type: dish.type,
        requiresAccompaniment: !isNil(dish.accompanimentRequired) && dish.accompanimentRequired !== RequiredAccompanimentFlags.None,
        requiresSide,
        requiresSalad,
        requiresVeggie,
      };
      return row;
    });
    return rows;
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof DishRow,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRow = () => {

    const dish: DishEntity = {
      id: '',
      name: '',
      type: DishType.Main,
      last: null,
    };

    const dishRow: DishRow = {
      dish,
      name: 'AAAA',
      type: DishType.Main,
      requiresAccompaniment: false,
      requiresSalad: false,
      requiresSide: false,
      requiresVeggie: false,
    };

    const newRows = cloneDeep(rows);
    newRows.push(dishRow);
    setRows(newRows);

    setCurrentEditDish(dishRow);

  };

  const handleEditClick = (dishEntityData: DishRow) => {
    setCurrentEditDish(dishEntityData);
  };

  const handleAssignIngredientsToDish = (dishEntityData: DishRow) => {
    setDishId(dishEntityData.dish.id);
    setShowAssignIngredientsToDish(true);
  };

  const handleCloseAssignIngredientsToDish = () => {
    setShowAssignIngredientsToDish(false);
  };

  const handleDeleteClick = (dishEntityData: DishRow) => {
    console.log('Delete ' + dishEntityData.dish.id);
    setCurrentEditDish(null);
  };

  const getAccompanimentRequired = (dishRow: DishRow): RequiredAccompanimentFlags => {
    switch (dishRow.type) {
      case DishType.Main: {
        let accompanimentValue: RequiredAccompanimentFlags = RequiredAccompanimentFlags.None;
        if (dishRow.requiresSalad) {
          accompanimentValue = RequiredAccompanimentFlags.Salad;
        }
        if (dishRow.requiresSide) {
          accompanimentValue += RequiredAccompanimentFlags.Side;
        }
        if (dishRow.requiresVeggie) {
          accompanimentValue += RequiredAccompanimentFlags.Veggie;
        }
        return accompanimentValue;
      }
      case DishType.Salad:
      case DishType.Side:
      case DishType.Veggie:
        return RequiredAccompanimentFlags.None;
    }
  };

  const handleSaveClick = () => {

    if (!isNil(currentEditDish)) {

      // check for empty name
      if (currentEditDish.name === '') {
        setSnackbar({ children: 'Error while saving dish: name can\'t be empty.', severity: 'error' });
        return;
      }

      // check for duplicate dish names.
      const updatedDishName = currentEditDish.name;
      for (let dishIndex = 0; dishIndex < props.dishes.length; dishIndex++) {
        const existingDish: DishEntity = props.dishes[dishIndex];
        if (currentEditDish.dish.id !== existingDish.id && existingDish.name === updatedDishName) {
          setSnackbar({ children: 'Error while saving dish: duplicate dish name', severity: 'error' });
          return;
        }
      }

      // if requiresAccompaniment, ensure that one is specified
      if (currentEditDish.requiresAccompaniment) {
        if (!currentEditDish.requiresSalad && !currentEditDish.requiresSide && !currentEditDish.requiresVeggie) {
          setSnackbar({ children: 'Error while saving dish: accompaniment required.', severity: 'error' });
          return;
        }
      }

      if (currentEditDish.dish.id === '') {
        const newDish: DishEntity = {
          id: '',
          name: currentEditDish.name,
          type: currentEditDish.type,
          accompanimentRequired: getAccompanimentRequired(currentEditDish),
          last: null,
        };
        props.onAddDish(newDish)
          .then((newDishId: string) => {

            // get index of row getting edited.
            let selectedIndex = -1;
            const id = '';
            rows.forEach((row, index) => {
              if (row.dish.id === id) {
                selectedIndex = index;
              }
            });

            if (selectedIndex !== -1) {
              const newRows = cloneDeep(rows);
              const selectedRow: DishRow = newRows[selectedIndex];
              selectedRow.dish.id = newDishId;
              setRows(newRows);
            }

          });
      } else {
        const updatedDish: DishEntity = cloneDeep(currentEditDish.dish);
        updatedDish.name = currentEditDish.name;
        updatedDish.type = currentEditDish.type;
        updatedDish.accompanimentRequired = getAccompanimentRequired(currentEditDish);
        props.onUpdateDish(currentEditDish.dish.id, updatedDish);
      }
      setCurrentEditDish(null);
    }
  };

  const handleCancelClick = () => {

    if (!isNil(currentEditDish) && !isNil(currentEditDish.dish) && (currentEditDish.dish.id === '')) {
      // new dish - discard row

      // get index of row getting edited.
      let selectedIndex = -1;
      const id = '';
      rows.forEach((row, index) => {
        if (row.dish.id === id) {
          selectedIndex = index;
        }
      });

      if (selectedIndex !== -1) {
        const newRows = cloneDeep(rows);
        newRows.splice(selectedIndex, 1);
        setRows(newRows);
      }

    }
    setCurrentEditDish(null);
  };

  const handleUpdateDishName = (selectedDishRow: DishRow, dishName: string) => {
    selectedDishRow.name = dishName;
  };

  const handleUpdateDishType = (selectedDishRow: DishRow, updatedDishType: DishType) => {

    const clonedRows = cloneDeep(rows);
    const selectedIndex = dishIdToDishRowIndex[selectedDishRow.dish.id];
    const selectedRow: DishRow = clonedRows[selectedIndex];
    selectedRow.type = updatedDishType;
    setRows(clonedRows);

    setCurrentEditDish(selectedRow);

  };

  const handleToggleRequiresAccompaniment = (selectedDishRow: DishRow, requiresAccompaniment: boolean) => {

    // get index of row getting edited.
    let selectedIndex = -1;
    const id = selectedDishRow.dish.id;
    rows.forEach((row, index) => {
      if (row.dish.id === id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex !== -1) {
      const newRows = cloneDeep(rows);
      const selectedRow: DishRow = newRows[selectedIndex];
      selectedRow.requiresAccompaniment = requiresAccompaniment;
      setRows(newRows);

      setCurrentEditDish(selectedRow);
    }

  };

  const handleToggleRequiresSalad = (selectedDishRow: DishRow, requiresSalad: boolean) => {

    // get index of row getting edited.
    let selectedIndex = -1;
    const id = selectedDishRow.dish.id;
    rows.forEach((row, index) => {
      if (row.dish.id === id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex !== -1) {
      const newRows = cloneDeep(rows);
      const selectedRow: DishRow = newRows[selectedIndex];
      selectedRow.requiresSalad = requiresSalad;
      setRows(newRows);

      setCurrentEditDish(selectedRow);
    }

  };

  const handleToggleRequiresSide = (selectedDishRow: DishRow, requiresSide: boolean) => {

    // get index of row getting edited.
    let selectedIndex = -1;
    const id = selectedDishRow.dish.id;
    rows.forEach((row, index) => {
      if (row.dish.id === id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex !== -1) {
      const newRows = cloneDeep(rows);
      const selectedRow: DishRow = newRows[selectedIndex];
      selectedRow.requiresSide = requiresSide;
      setRows(newRows);

      setCurrentEditDish(selectedRow);
    }

  };

  const handleToggleRequiresVeggie = (selectedDishRow: DishRow, requiresVeggie: boolean) => {

    // get index of row getting edited.
    let selectedIndex = -1;
    const id = selectedDishRow.dish.id;
    rows.forEach((row, index) => {
      if (row.dish.id === id) {
        selectedIndex = index;
      }
    });

    if (selectedIndex !== -1) {
      const newRows = cloneDeep(rows);
      const selectedRow: DishRow = newRows[selectedIndex];
      selectedRow.requiresVeggie = requiresVeggie;
      setRows(newRows);

      setCurrentEditDish(selectedRow);
    }

  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const newRows: DishRow[] = getRows();
  if (!rowsRead && newRows.length > 0) {
    setRowsRead(true);
    setRows(newRows);
  }

  const renderEditingRow = (row: DishRow) => {
    const isItemSelected = true;
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
            variant='standard'
            onBlur={(event) => handleUpdateDishName(row, event.target.value)}
          />
        </TableCell>
        <TableCell
          // component='th'
          // id={labelId}
          // scope='row'
          // padding='none'
          padding='none'
          align='center'
        >
          <Select
            onChange={(event) => handleUpdateDishType(row, event.target.value as DishType)}
            placeholder={'Dish Type'}
            value={row.type}
          >
            <MenuItem value={'main'}>Main</MenuItem>
            <MenuItem value={'salad'}>Salad</MenuItem>
            <MenuItem value={'side'}>Side</MenuItem>
            <MenuItem value={'veggie'}>Veggie</MenuItem>
          </Select>
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresAccompaniment}
            onChange={(event) => handleToggleRequiresAccompaniment(row, event.target.checked)}
            disabled={row.type !== DishType.Main}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSalad}
            onChange={(event) => handleToggleRequiresSalad(row, event.target.checked)}
            disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSide}
            onChange={(event) => handleToggleRequiresSide(row, event.target.checked)}
            disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresVeggie}
            onChange={(event) => handleToggleRequiresVeggie(row, event.target.checked)}
            disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
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

  const renderInactiveRow = (row: DishRow) => {
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
          // component='th'
          // id={labelId}
          // scope='row'
          // padding='none'
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
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresAccompaniment}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSalad}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresSide}
            disabled
          />
        </TableCell>
        <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.requiresVeggie}
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

  const renderSortedTableContents = () => {

    dishIdToDishRowIndex = {};
    const sortedDishes = stableSort(rows, getComparator(order, orderBy));
    const pagedSortedDishes = sortedDishes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <React.Fragment>
        {pagedSortedDishes
          .map((row: DishRow, index: number) => {
            let renderedRow;
            if (!isNil(currentEditDish) && currentEditDish.dish.id === row.dish.id) {
              renderedRow = renderEditingRow(row);
            } else {
              renderedRow = renderInactiveRow(row);
            }

            dishIdToDishRowIndex[row.dish.id] = page * rowsPerPage + index;
            return renderedRow;
          })}
      </React.Fragment>
    );
  };

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
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {renderSortedTableContents()}
                {/* {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: DishRow, index: number) => {
                    let renderedRow;
                    if (!isNil(currentEditDish) && currentEditDish.dish.id === row.dish.id) {
                      renderedRow = renderEditingRow(row, index);
                    } else {
                      renderedRow = renderInactiveRow(row);
                    }
                    console.log('id');
                    console.log(row.dish.id);
                    console.log('row');
                    console.log(row);
                    return renderedRow;
                  })} */}
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
            count={rows.length}
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
    dishes: getDishes(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddDish: addDish,
    onUpdateDish: updateDish,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewDishes);
