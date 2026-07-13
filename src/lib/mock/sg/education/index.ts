import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  SG_EDU_TUTORS,
  SG_EDU_ONLINE_COURSES,
  SG_EDU_STUDY_MATERIALS,
  SG_EDU_SCHOOLS_COLLEGES,
  SG_EDU_LANGUAGE_CLASSES,
} from "./education-data";

export {
  SG_EDU_TUTORS,
  SG_EDU_ONLINE_COURSES,
  SG_EDU_STUDY_MATERIALS,
  SG_EDU_SCHOOLS_COLLEGES,
  SG_EDU_LANGUAGE_CLASSES,
};

export const SG_EDUCATION_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  tutors: SG_EDU_TUTORS,
  online_courses: SG_EDU_ONLINE_COURSES,
  study_materials: SG_EDU_STUDY_MATERIALS,
  schools_colleges: SG_EDU_SCHOOLS_COLLEGES,
  language_classes: SG_EDU_LANGUAGE_CLASSES,
};

export const SG_ALL_EDUCATION_LISTINGS: MockListing[] = [
  ...SG_EDU_TUTORS,
  ...SG_EDU_ONLINE_COURSES,
  ...SG_EDU_STUDY_MATERIALS,
  ...SG_EDU_SCHOOLS_COLLEGES,
  ...SG_EDU_LANGUAGE_CLASSES,
];
