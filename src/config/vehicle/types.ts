export interface Option {
  value: string;
  label: string;
}

export interface VehicleFormConfig {
  carFuelTypes: Option[];
  motorcycleFuelTypes: Option[];
  budgetPlaceholder: string;
}
