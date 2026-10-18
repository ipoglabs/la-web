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
  /** Van / minibus makes on the Van post form ("Other" is added after these). */
  vanMakes: string[];
  /** Truck makes on the Truck post form ("Other" is added after these). */
  truckMakes: string[];
  budgetPlaceholder: string;
}
