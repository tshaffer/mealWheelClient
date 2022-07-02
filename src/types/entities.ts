export enum DishType {
  Main = 'main',
  Side = 'side',
  Salad = 'salad',
  Veg = 'veg',
}

export enum RequiredAccompanimentFlags {
  None = 0,
  Side = 1,
  Salad = 2,
  Veg = 4,
}

export interface DishEntity {
  id: string;
  name: string;
  type: DishType;
  accompaniment?: RequiredAccompanimentFlags;
}
