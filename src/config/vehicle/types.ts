export interface Option {
  value: string;
  label: string;
}

export interface VehicleFormConfig {
  carFuelTypes: Option[];
  motorcycleFuelTypes: Option[];
  /** Car makes offered on the Cars post form (an "Other" option is added after these). */
  carMakes: string[];
  /** Motorcycle / scooter makes on the Motorcycle post form ("Other" is added after these). */
  motorcycleMakes: string[];
  budgetPlaceholder: string;
}
