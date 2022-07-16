import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { DataGrid, GridColumns, GridRowModel, GridRowsProp } from '@mui/x-data-grid';

import { DishEntity, RequiredAccompanimentFlags } from '../types';
import { getDishes } from '../selectors';

export interface DishesProps {
  dishes: DishEntity[];
}

const mainOption = { value: 'main', label: 'Main' };
const saladOption = { value: 'salad', label: 'Salad' };
const sideOption = { value: 'side', label: 'Side' };
const vegOption = { value: 'veg', label: 'Veg' };

const dishesColumns: GridColumns = [
  { field: 'name', headerName: 'Name', width: 240, editable: true },
  {
    field: 'type',
    type: 'singleSelect',
    valueOptions: [
      mainOption,
      saladOption,
      sideOption,
      vegOption,
    ],
    // https://github.com/mui/mui-x/issues/4437
    valueFormatter: ({ id: rowId, value, field, api }) => {
      const colDef = api.getColumn(field);
      const option = colDef.valueOptions.find(
        ({ value: optionValue }) => value === optionValue
      );
      return option.label;
    },
    headerName: 'Type',
    width: 180,
    editable: true,
  },
  {
    field: 'requiresAccompaniment',
    headerName: 'Requires accompaniment',
    width: 180,
    editable: true,
  }
];

const Dishes = (props: DishesProps) => {

  const getRows = () => {
    const rows: GridRowsProp = props.dishes.map((dish: DishEntity) => {
      const row: GridRowModel = {
        id: dish.id,
        name: dish.name,
        type: dish.type,
        requiresAccompaniment: dish.accompaniment !== RequiredAccompanimentFlags.None,
      };
      return row;
    });
    return rows;
  };

  const rows: GridRowsProp = getRows();

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={dishesColumns}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    dishes: getDishes(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Dishes);
