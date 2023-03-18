import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { cloneDeep, isNil } from 'lodash';
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

const IngredientsNew = (props: IngredientsProps) => {
  return (
    <div>pizza</div>
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
