export interface CategoryConfig {
  key: string; // Key in dict.dashboard.sections
  img: string; // Path to image in public folder
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  { key: "traffic", img: "/image/categories/traffic.png" },
  { key: "residency", img: "/image/categories/residency.png" },
  { key: "publicDecency", img: "/image/categories/publicDecency.png" },
  { key: "labor", img: "/image/categories/labor.png" },
  { key: "food", img: "/image/categories/food.png" },
];
