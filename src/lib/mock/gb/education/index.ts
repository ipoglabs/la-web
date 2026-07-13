import type { MockListing } from "../../mock-listing-schema";
export { EDUCATION_TUTORS } from './tutors';
export { EDUCATION_ONLINE_COURSES } from './online-courses';
export { EDUCATION_STUDY_MATERIALS } from './study-materials';
export { EDUCATION_SCHOOLS } from './schools-colleges';
export { EDUCATION_LANGUAGES } from './language-classes';

import { EDUCATION_TUTORS } from './tutors';
import { EDUCATION_ONLINE_COURSES } from './online-courses';
import { EDUCATION_STUDY_MATERIALS } from './study-materials';
import { EDUCATION_SCHOOLS } from './schools-colleges';
import { EDUCATION_LANGUAGES } from './language-classes';

export const ALL_EDUCATION_LISTINGS: MockListing[] = [
  ...EDUCATION_TUTORS,
  ...EDUCATION_ONLINE_COURSES,
  ...EDUCATION_STUDY_MATERIALS,
  ...EDUCATION_SCHOOLS,
  ...EDUCATION_LANGUAGES,
];

export const GB_ALL_EDUCATION_LISTINGS: MockListing[] = ALL_EDUCATION_LISTINGS;
export const GB_EDUCATION_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  tutors: EDUCATION_TUTORS,
  online_courses: EDUCATION_ONLINE_COURSES,
  study_materials: EDUCATION_STUDY_MATERIALS,
  schools_colleges: EDUCATION_SCHOOLS,
  language_classes: EDUCATION_LANGUAGES,
};

