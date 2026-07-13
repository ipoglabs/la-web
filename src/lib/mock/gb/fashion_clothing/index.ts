import type { MockListing } from "../../mock-listing-schema";
export { FASHION_MENS } from './mens-clothing';
export { FASHION_WOMENS } from './womens-clothing';
export { FASHION_ETHNIC } from './ethnic-traditional';
export { FASHION_SHOES } from './shoes-footwear';
export { FASHION_BAGS } from './bags-accessories';
export { FASHION_JEWELLERY } from './jewellery-watches';
export { FASHION_DESIGNER } from './designer-luxury';
export { FASHION_VINTAGE } from './vintage-secondhand';

import { FASHION_MENS } from './mens-clothing';
import { FASHION_WOMENS } from './womens-clothing';
import { FASHION_ETHNIC } from './ethnic-traditional';
import { FASHION_SHOES } from './shoes-footwear';
import { FASHION_BAGS } from './bags-accessories';
import { FASHION_JEWELLERY } from './jewellery-watches';
import { FASHION_DESIGNER } from './designer-luxury';
import { FASHION_VINTAGE } from './vintage-secondhand';

export const ALL_FASHION_CLOTHING_LISTINGS: MockListing[] = [
  ...FASHION_MENS,
  ...FASHION_WOMENS,
  ...FASHION_ETHNIC,
  ...FASHION_SHOES,
  ...FASHION_BAGS,
  ...FASHION_JEWELLERY,
  ...FASHION_DESIGNER,
  ...FASHION_VINTAGE,
];

export const GB_ALL_FASHION_CLOTHING_LISTINGS: MockListing[] = ALL_FASHION_CLOTHING_LISTINGS;
export const GB_FASHION_CLOTHING_SUBCATEGORY_MAP: Record<string, MockListing[]> = {
  mens_clothing: FASHION_MENS,
  womens_clothing: FASHION_WOMENS,
  ethnic_traditional: FASHION_ETHNIC,
  shoes_footwear: FASHION_SHOES,
  bags_accessories: FASHION_BAGS,
  jewellery_watches: FASHION_JEWELLERY,
  designer_luxury: FASHION_DESIGNER,
  vintage_secondhand: FASHION_VINTAGE,
};

