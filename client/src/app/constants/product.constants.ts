export const PRODUCT_CATEGORIES = [
  { id: 1, name: 'Clothing' },
  { id: 2, name: 'Shoes' },
  { id: 3, name: 'Accessories' }
] as const;

export function getProductCategoryName(categoryId: string | number): string {
  const category = PRODUCT_CATEGORIES.find(({ id }) => id === Number(categoryId));
  return category?.name ?? String(categoryId);
}
