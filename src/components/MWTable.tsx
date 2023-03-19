import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

import { MealWheelDispatch } from '../models';
import { IngredientRow, Order, UiState } from '../types';
import { getUiState } from '../selectors';
import { cloneDeep, isNil } from 'lodash';

interface HeadCell {
  disablePadding: boolean;
  id: any;
  label: string;
  numeric: boolean;
}

interface MWTableHeadProps {
  headCells: HeadCell[];
  order: Order;
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
}

const MWTableHead = (props: MWTableHeadProps) => {

  const { headCells, order, orderBy, onRequestSort } =
    props;

  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
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

export interface MWTablePropsFromParent {
  headCells: HeadCell[],
  currentEditItemRow: any | null,
  items: any[];
  rows: any[];
  rowIds: string[],
  onAddItem: (item: any) => any;
  onUpdateItem: (id: string, item: any) => any;
  sortOrder: Order;
  sortBy: string;
  onDeleteItem: (id: string) => any;
  onSortItemsAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortItems: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: any[]) => any;
  onSetCurrentEditItem: (currentEditItem: any | null) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;
  onSave: () => any;

  myUIState: UiState;
  onGetItems: () => void;
  onGetDefaultItem: () => any;
  onGetDefaultItemRow: (item: any) => any;
  onSetCurrentEditItemRow: (itemRow: any) => any;
  onGetRows: () => any;
}

export interface MWTableProps extends MWTablePropsFromParent {
  uiState: UiState;
}

const MWTable = (props: MWTableProps) => {

  const [itemNameInRow, setItemNameInRow] = React.useState<any>(null);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [snackbar, setSnackbar] = React.useState<Pick<AlertProps, 'children' | 'severity'> | null>(null);

  React.useEffect(() => {
    if (props.uiState === props.myUIState) {
      const newRows: any[] = props.onGetRows();
      props.onSetRows(newRows);
    }
  }, [props.uiState]);

  React.useEffect(() => {
    if (!isNil(itemNameInRow)) {
      const byTagNameResults = itemNameInRow.getElementsByTagName('input');
      const nameField = byTagNameResults[0];
      nameField.focus();
    }
  }, [itemNameInRow]);

  interface IdToNumberMap {
    [id: string]: number;
  }

  let itemIdToItemRowIndex: IdToNumberMap = {};

  const handleCloseSnackbar = () => setSnackbar(null);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any,
  ) => {
    const isAsc = props.sortBy === property && props.sortOrder === 'asc';
    const sortOrder: Order = isAsc ? 'desc' : 'asc';
    props.onSetSortOrder(sortOrder);
    props.onSetSortBy(property);
    props.onSortItemsAndSetRows(sortOrder, property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddRow = () => {
    const item: any = props.onGetDefaultItem();
    const itemRow: any = props.onGetDefaultItemRow(item);

    const newRows = cloneDeep(props.rows);
    newRows.unshift(itemRow);
    props.onSetRows(newRows);

    props.onSetCurrentEditItemRow(itemRow);
  };

  const handleEditClick = (itemRow: any) => {
    props.onSetCurrentEditItemRow(itemRow);
  };

  const handleDeleteClick = (itemRow: any) => {
    debugger;
    // props.onSetRows(props.rows.filter((row) => row.dish.id !== dishEntityData.dish.id));
    // props.onDeleteDish(dishEntityData.dish.id);
    // props.onSetCurrentEditDish(null);
  };

  const handleSaveClick = () => {
    if (!isNil(props.currentEditItemRow)) {

      // check for empty name
      if (props.currentEditItemRow.name === '') {
        setSnackbar({ children: 'Error while saving ingredient: name can\'t be empty.', severity: 'error' });
        return;
      }

      // check for item specific errors
      // for ingredients, check for duplicate ingredient names.
      
      props.onSave();
    }
  };

  const handleCancelClick = () => {
    debugger;
  };

  const handleUpdateItemName = (selectedItemRow: any, itemName: string) => {
    selectedItemRow.name = itemName;
  };

  const updateSelectedRowProperty = (selectedItemRow: any, propertyName: string, propertyValue: any): any => {
    const clonedRows = cloneDeep(props.rows);
    const selectedItemRowIndex = itemIdToItemRowIndex[selectedItemRow.id];
    const selectedRow: any = clonedRows[selectedItemRowIndex];
    (selectedRow as any)[propertyName] = propertyValue;
    props.onSetRows(clonedRows);
    return selectedRow;
  };

  // Avoid a layout jump when reaching the last page with empty props.rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.rows.length) : 0;

  const renderEditingRow = (row: any) => {
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
            label='Name'
            defaultValue={row.name}
            variant='standard'
            onBlur={(event) => handleUpdateItemName(row, event.target.value)}
            ref={(input) => { setItemNameInRow(input); }}
          />
        </TableCell>
        {/* <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.showInGroceryList}
            onChange={(event) => handleToggleShowInGroceryList(row, event.target.checked)}
          />
        </TableCell> */}
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

  const renderInactiveRow = (row: any) => {
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
            label='Name'
            defaultValue={row.name}
            disabled
            variant='standard'
          />
        </TableCell>

        {/* <TableCell align='center'>
          <Checkbox
            color="primary"
            checked={row.showInGroceryList}
            disabled
          />
        </TableCell> */}
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

  const buildItemIdToItemRowIndex = () => {
    itemIdToItemRowIndex = {};
    for (let index = 0; index < props.rows.length; index++) {
      const itemId: string = props.rowIds[index];
      itemIdToItemRowIndex[itemId] = index;
    }
  };

  const renderSortedTableContents = () => {
    buildItemIdToItemRowIndex();
    const sortedIngredients: any[] = props.rows;
    const pagedSortedIngredients = sortedIngredients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
      <React.Fragment>
        {pagedSortedIngredients
          .map((row: any, index: number) => {
            let renderedRow;
            if (!isNil(props.currentEditItemRow) && props.currentEditItemRow.id === row.id) {
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
              Add
            </Button>
          </div>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              size={'small'}
            >
              <MWTableHead
                headCells={props.headCells}
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
    uiState: getUiState(state),
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(MWTable);
