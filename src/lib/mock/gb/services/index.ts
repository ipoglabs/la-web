import type { MockListing } from "../../mock-listing-schema";
export { SERVICES_HOME } from './home-services';
export { SERVICES_BUSINESS } from './business-services';
export { SERVICES_HEALTH_FITNESS } from './health-fitness';
export { SERVICES_TUTORING } from './tutoring';
export { SERVICES_EDUCATION } from './education-learning';
export { SERVICES_TRAVEL } from './travel-tourism';
export { SERVICES_FOOD } from './food-dining';
export { SERVICES_TECH } from './tech-gadgets';
export { SERVICES_OTHER } from './other-services';
export { SERVICES_WANTED } from './wanted';

import { SERVICES_HOME } from './home-services';
import { SERVICES_BUSINESS } from './business-services';
import { SERVICES_HEALTH_FITNESS } from './health-fitness';
import { SERVICES_TUTORING } from './tutoring';
import { SERVICES_EDUCATION } from './education-learning';
import { SERVICES_TRAVEL } from './travel-tourism';
import { SERVICES_FOOD } from './food-dining';
import { SERVICES_TECH } from './tech-gadgets';
import { SERVICES_OTHER } from './other-services';
import { SERVICES_WANTED } from './wanted';

export const ALL_SERVICES_LISTINGS: MockListing[] = [
  ...SERVICES_HOME,
  ...SERVICES_BUSINESS,
  ...SERVICES_HEALTH_FITNESS,
  ...SERVICES_TUTORING,
  ...SERVICES_EDUCATION,
  ...SERVICES_TRAVEL,
  ...SERVICES_FOOD,
  ...SERVICES_TECH,
  ...SERVICES_OTHER,
  ...SERVICES_WANTED,
];

export const GB_ALL_SERVICES_LISTINGS: MockListing[] = ALL_SERVICES_LISTINGS;
export const GB_SERVICES_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  home_services: SERVICES_HOME,
  business_services: SERVICES_BUSINESS,
  health_fitness: SERVICES_HEALTH_FITNESS,
  tutoring: SERVICES_TUTORING,
  education_learning: SERVICES_EDUCATION,
  travel_tourism: SERVICES_TRAVEL,
  food_dining: SERVICES_FOOD,
  tech_gadgets: SERVICES_TECH,
  other_services: SERVICES_OTHER,
  wanted: SERVICES_WANTED,
};

