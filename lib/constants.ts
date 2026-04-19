export const DEFAULT_PAGE_SIZE = 20;

export const CATEGORY_COLORS = [
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-green-100 text-green-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
] as const;

export function getCategoryColor(categoryId: number): string {
  return CATEGORY_COLORS[categoryId % CATEGORY_COLORS.length];
}
