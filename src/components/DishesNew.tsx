import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';

import MWTable from './MWTable';
import { DishEntity, DishRow, DishType, Order, RequiredAccompanimentFlags, UiState } from '../types';
import { MealWheelDispatch, setCurrentEditDish, setRows, setSortBy, setSortOrder, sortDishes } from '../models';
import { addDish, updateDish, deleteDish, sortDishesAndSetRows } from '../controllers';
import { getDishes, getDishRows, getCurrentEditDish, getUiState, getSortBy, getSortOrder } from '../selectors';
import { nlNL } from '@mui/material/locale';

interface HeadCell {
  disablePadding: boolean;
  id: keyof DishRow;
  label: string;
  numeric: boolean;
}

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

/*
  columnElement
    Dish Type
      elementType: 'TextDropDown'
      label: 'Dish Type'
      helperText: 'Please select your dish type'
      onChange={(event) => handleUpdateDishType(row, event.target.value as DishType)}
      placeHolder: 'Dish Type'
      value: ?
      options: array<key, value>: label
    Minimum Interval
      elementType: 'TextNumber'
      label: 'Min interval'
      defaultValue: ?
      onBlur={(event) => handleUpdateMinimumInterval(row, event.target.value)}
      min: 0
    Requires Accompaniment
      elementType: checkbox
      checked={row.requiresAccompaniment}
      onChange={(event) => handleToggleRequiresAccompaniment(row, event.target.checked)}
      disabled={row.type !== DishType.Main}
    Requires Salad
      elementType: checkbox
      checked={row.requiresSalad}
      onChange={(event) => handleToggleRequiresSalad(row, event.target.checked)}
      disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
    Requires Side
      elementType: checkbox
      checked={row.requiresSide}
      onChange={(event) => handleToggleRequiresSide(row, event.target.checked)}
      disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
    Requires Veggie
      elementType: checkbox
      checked={row.requiresVeggie}
      onChange={(event) => handleToggleRequiresVeggie(row, event.target.checked)}
      disabled={row.type !== DishType.Main || !row.requiresAccompaniment}
    
    Actions
      Save
        elementType: IconButton
        Tooltip: 'Save'
        Id: row.name
        onClick={() => handleSaveClick()}
      Cancel
        elementType: IconButton
        Tooltip: 'Cancel'
        Id: row.name
        onClick={() => handleCancelClick()}
*/


interface ActionElement {
  toolTip: string;
  getId: any;
  onClick: any;
}

interface ColumnElement {
  elementType: string;
  label?: string;
  helperText?: string;
  onChange?: any;
  placeHolder?: string;
  getValue?: any;
  getOptions?: any;
  getDefaultValue?: any;
  onBlur?: any;
  min?: number;
  getChecked?: any;
  getDisabled?: any;
}

export interface DishesNewProps {
  currentEditDish: DishRow | null,
  dishes: DishEntity[];
  rows: DishRow[];
  onAddDish: (dish: DishEntity) => any;
  onUpdateDish: (id: string, dish: DishEntity) => any;
  sortOrder: Order;
  sortBy: string;
  uiState: UiState;
  onDeleteDish: (id: string) => any;
  onSortDishesAndSetRows: (sortOrder: Order, sortBy: string) => any;
  onSortDishes: (sortOrder: Order, sortBy: string) => any;
  onSetRows: (rows: DishRow[]) => any;
  onSetCurrentEditDish: (currentEditDish: DishRow | null) => any;
  onSetSortOrder: (sortOrder: Order) => any;
  onSetSortBy: (sortBy: string) => any;


}

const DishesNew = (props: DishesNewProps) => {

  const handleGetRequiresAccompaniment = (row: any) => {
    return row.requiresAccompaniment;
  };

  const handleToggleRequiresAccompaniment = (row: any, isChecked: boolean) => {
    console.log('handleToggleRequiresAccompaniment: ', isChecked);
  };

  const handleGetRequiresAccompanimentDisabled = (row: any) => {
    return row.type !== DishType.Main;
  };

  const columnElements: ColumnElement[] = [
    {
      elementType: 'textTypeSelect',
      label: 'Dish Type',
      helperText: 'Please select your dish type',
      onChange: null,
      placeHolder: 'Dish Type',
      getValue: null,
      getOptions: null,
    },
    {
      elementType: 'textTypeNumber',
      label: 'Min interval',
      getDefaultValue: null,
      onBlur: null,
      min: 0,
    },
    {
      elementType: 'checkbox',
      getChecked: handleGetRequiresAccompaniment,
      onChange: handleToggleRequiresAccompaniment,
      getDisabled: handleGetRequiresAccompanimentDisabled,
    },
    {
      elementType: 'checkbox',
      getChecked: null,
      onChange: null,
      getDisabled: null,
    },
    {
      elementType: 'checkbox',
      getChecked: null,
      onChange: null,
      getDisabled: null,
    },
    {
      elementType: 'checkbox',
      getChecked: null,
      onChange: null,
      getDisabled: null,
    },
  ];



  const handleUpdateItem = (id: string, item: any) => {
    console.log('handleUpdateItem: ', item);
  };

  interface IdToNumberMap {
    [id: string]: number;
  }

  const handleSave = (DishIdToDishRowIndex: IdToNumberMap) => {
    debugger;
    console.log('handleSave');
  };

  const handleDeleteItem = (id: string) => {
    console.log('handleDeleteItem: ', id);
  };

  const handleSortItemsAndRows = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItemsAndRows: ', sortOrder, sortBy);
    props.onSortDishesAndSetRows(sortOrder, sortBy);
  };

  const handleSortItems = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItems: ', sortOrder, sortBy);
    props.onSortDishes(sortOrder, sortBy);
  };

  const handleSetRows = (rows: DishRow[]) => {
    console.log('handleSetRows: ', rows);
    props.onSetRows(rows);
  };

  const handleSetCurrentEditItem = (currentEditItem: DishRow | null) => {
    console.log('handleSetCurrentEditItem: ', currentEditItem);
    props.onSetCurrentEditDish(currentEditItem);
  };

  const handleSetSortOrder = (sortOrder: Order) => {
    console.log('handleSetSortOrder: ', sortOrder);
    props.onSetSortOrder(sortOrder);
  };

  const handleSetSortBy = (sortBy: string) => {
    console.log('handleSetSortBy: ', sortBy);
    props.onSetSortBy(sortBy);
  };

  const handleGetItems = (): DishEntity[] => {
    console.log('handleGetItems: ');
    return props.dishes;
  };

  const handleGetDefaultItem = (): DishEntity => {
    const dish: DishEntity = {
      id: '',
      name: '',
      type: DishType.Main,
      minimumInterval: 5,
      last: null,
      prepEffort: 5,
      prepTime: 15,
      cleanupEffort: 5,
    };
    return dish;
  };

  const handleGetDefaultItemRow = (dish: DishEntity): DishRow => {

    const dishRow: DishRow = {
      dish,
      id: dish.id,
      name: '',
      type: DishType.Main,
      minimumInterval: 5,
      last: null,
      requiresAccompaniment: false,
      requiresSalad: false,
      requiresSide: false,
      requiresVeggie: false,
    };

    return dishRow;
  };

  const handleSetCurrentEditItemRow = (item: DishRow) => {
    console.log('handleSetCurrentEditItemRow: ', item);
    props.onSetCurrentEditDish(item);
  };

  const getRows = (): DishRow[] => {

    const rows: DishRow[] = props.dishes.map((dish: DishEntity) => {
      const requiresSide: boolean = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Side) !== 0;
      const requiresSalad = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Salad) !== 0;
      const requiresVeggie = isNil(dish.accompanimentRequired) ? false : (dish.accompanimentRequired & RequiredAccompanimentFlags.Veggie) !== 0;
      const row: DishRow = {
        dish,
        id: dish.id,
        name: dish.name,
        type: dish.type,
        last: dish.last,
        minimumInterval: dish.minimumInterval,
        requiresAccompaniment: !isNil(dish.accompanimentRequired) && dish.accompanimentRequired !== RequiredAccompanimentFlags.None,
        requiresSide,
        requiresSalad,
        requiresVeggie,
      };
      return row;
    });
    return rows;
  };

  const handleGetRows = () => {
    console.log('handleGetRows: ');
    const rows: DishRow[] = getRows();
    return rows;
  };

  const rowIds: string[] = props.rows.map((row: DishRow) => {
    return row.dish.id;
  });


  return (
    <MWTable
      headCells={headCells}
      currentEditItemRow={props.currentEditDish}
      items={props.dishes}
      rows={props.rows}
      rowIds={rowIds}
      myUIState={UiState.Dishes}
      sortOrder={'asc'}
      sortBy={'name'}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      onSortItemsAndSetRows={handleSortItemsAndRows}
      onSortItems={handleSortItems}
      onSetRows={handleSetRows}
      onSetCurrentEditItem={handleSetCurrentEditItem}
      onSetSortOrder={handleSetSortOrder}
      onSetSortBy={handleSetSortBy}
      onGetItems={handleGetItems}
      onGetDefaultItem={handleGetDefaultItem}
      onGetDefaultItemRow={handleGetDefaultItemRow}
      onSetCurrentEditItemRow={handleSetCurrentEditItemRow}
      onGetRows={handleGetRows}
      onSave={handleSave}
    />
  );
};

function mapStateToProps(state: any) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(DishesNew);

