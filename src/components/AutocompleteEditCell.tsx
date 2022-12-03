import { UseAutocompleteProps, AutocompleteValue, Autocomplete, TextField } from '@mui/material';
import { GridRenderEditCellParams, useGridApiContext } from '@mui/x-data-grid';
import React from 'react';

export function AutocompleteEditCell<
  T extends { value: string; label: string },
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
}: GridRenderEditCellParams & {
  options: UseAutocompleteProps<
    T,
    Multiple,
    DisableClearable,
    FreeSolo
  >['options'];
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

  return (
    <Autocomplete<T, Multiple, DisableClearable, FreeSolo>
      autoHighlight={true}
      fullWidth
      disableClearable={disableClearable}
      multiple={multiple}
      options={options}
      freeSolo={freeSolo}
      // @ts-expect-error i can't figure out how to use AutocompleteValue
      value={options.find((o) => o.value === value)?.label || ''}
      onChange={handleValueChange}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}