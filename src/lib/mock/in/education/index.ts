import type { MockListing } from "@/lib/mock/mock-listing-schema";
import {
  IN_EDU_TUTORS,
  IN_EDU_ONLINE_COURSES,
  IN_EDU_STUDY_MATERIALS,
  IN_EDU_SCHOOLS_COLLEGES,
  IN_EDU_LANGUAGE_CLASSES,
} from "./education-data";

export {
  IN_EDU_TUTORS,
  IN_EDU_ONLINE_COURSES,
  IN_EDU_STUDY_MATERIALS,
  IN_EDU_SCHOOLS_COLLEGES,
  IN_EDU_LANGUAGE_CLASSES,
};

export const IN_EDUCATION_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  tutors: IN_EDU_TUTORS,
  online_courses: IN_EDU_ONLINE_COURSES,
  study_materials: IN_EDU_STUDY_MATERIALS,
  schools_colleges: IN_EDU_SCHOOLS_COLLEGES,
  language_classes: IN_EDU_LANGUAGE_CLASSES,
};

export const IN_ALL_EDUCATION_LISTINGS: MockListing[] = [
  ...IN_EDU_TUTORS,
  ...IN_EDU_ONLINE_COURSES,
  ...IN_EDU_STUDY_MATERIALS,
  ...IN_EDU_SCHOOLS_COLLEGES,
  ...IN_EDU_LANGUAGE_CLASSES,
];
