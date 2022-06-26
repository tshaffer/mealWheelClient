export interface DishEntity {
  name: string;
  type: string;
  requiresOneOf: {
    side: boolean;
    salad: boolean;
    veg: boolean;
  }
}
