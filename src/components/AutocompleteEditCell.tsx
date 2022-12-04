import { UseAutocompleteProps, AutocompleteValue, Autocomplete, TextField } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

const myIsOptionEqualToValue = (option: any, value: any) => {
  // 'value' is the text contents, not the id
  // console.log('myIsOptionEqualToValue');
  // console.log(option);
  // console.log(value);
  return option.value === value;
};

export function AutocompleteEditCell<
  T extends { value: string; label: string },
  onInputChange,
  Multiple extends boolean = false,
  DisableClearable extends boolean = false,
  FreeSolo extends boolean = false
>({
  id,
  value,
  field,
  options,
  disableClearable,
  multiple,
  freeSolo,
  onInputChange,
}: GridRenderEditCellParams & {
  options: UseAutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['options'];
  onInputChange: any;
  disableClearable: DisableClearable;
  multiple: Multiple;
  freeSolo: FreeSolo;
}) {
  const apiRef = useGridApiContext();

  const handleValueChange = (
    _: any,
    newValue: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>
  ) => {
    apiRef.current.setEditCellValue({
      id,
      field,
      // @ts-expect-error i can't figure out how to use AutocompleteValue
      value: typeof newValue === 'string' ? value : newValue?.value || '',
    });
  };

  console.log('AutocompleteEditCell');
  console.log('id:');
  console.log(id);
  console.log('value');
  console.log(value);
  console.log('options');
  console.log(options);

  console.log('AutocompleteEditCell: perform match');
  for (const option of options) {
    console.log('comparison:');
    console.log(option.label);
    console.log(value);
    if (option.label === value) {
      console.log('match found:', option, value);
    }
  }
  console.log('AutocompleteEditCell: match completion complete');

  return (
    <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
      autoHighlight={true}
      fullWidth
      disableClearable={disableClearable}
      multiple={multiple}
      options={options}
      freeSolo={freeSolo}
      // @ts-expect-error i can't figure out how to use AutocompleteValue
      value={options.find((o) => o.label === value)?.label || ''}
      onChange={handleValueChange}
      onInputChange={(event, value, reason) => onInputChange(id, value)}
      renderInput={(params) => <TextField {...params} />}
      isOptionEqualToValue={myIsOptionEqualToValue}
    />
  );
}