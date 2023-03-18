import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';

import MWTable from './MWTable';

import { addIngredient, updateIngredient, deleteIngredient, sortIngredientsAndSetRows } from '../controllers';
import { MealWheelDispatch, sortIngredients, setIngredientRows, setCurrentEditIngredient, setIngredientSortOrder, setIngredientSortBy } from '../models';
import { getIngredients, getIngredientRows, getCurrentEditIngredient, getUiState, getIngredientSortOrder, getIngredientSortBy } from '../selectors';
import { IngredientRow, IngredientEntity, Order, UiState } from '../types';

export interface IngredientsNewProps {
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

const IngredientsNew = (props: IngredientsNewProps) => {

  const handleAddItem = (item: any) => {
    console.log('handleAddItem: ', item);
  };

  const handleUpdateItem = (id: string, item: any) => {
    console.log('handleUpdateItem: ', item);
  };

  const handleDeleteItem = (id: string) => {
    console.log('handleDeleteItem: ', id);
  };

  const handleSortItemsAndRows = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItemsAndRows: ', sortOrder, sortBy);
  };

  const handleSortItems = (sortOrder: Order, sortBy: string) => {
    console.log('handleSortItems: ', sortOrder, sortBy);
  };

  const handleSetRows = (rows: any[]) => {
    console.log('handleSetRows: ', rows);
  };

  const handleSetCurrentEditItem = (currentEditItem: any | null) => {
    console.log('handleSetCurrentEditItem: ', currentEditItem);
  };

  const handleSetSortOrder = (sortOrder: Order) => {
    console.log('handleSetSortOrder: ', sortOrder);
  };

  const handleSetSortBy = (sortBy: string) => {
    console.log('handleSetSortBy: ', sortBy);
  };

  const handleGetItems = () => {
    console.log('handleGetItems: ');
  };

  const handleGetDefaultItem = () => {
    console.log('handleUpdateItem: ');
  };

  const handleGetDefaultItemRow = (item: any) => {
    console.log('handleGetDefaultItemRow: ', item);
  };

  const handleSetCurrentEditItemRow = (item: any) => {
    console.log('handleSetCurrentEditItemRow: ', item);
  };

  const handleGetRows = () => {
    console.log('handleGetRows: ');
  };

  return (
    <MWTable
      currentEditItemRow={null}
      items={[]}
      rows={[]}
      myUIState={UiState.Ingredients}
      sortOrder={'asc'}
      sortBy={'name'}
      onAddItem={handleAddItem}
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
    />
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

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsNew);
