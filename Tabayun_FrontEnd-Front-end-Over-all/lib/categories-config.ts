export interface CategoryConfig {
  key: string; // Key in dict.dashboard.sections
  img: string; // Path to image in public folder
}

export const CATEGORIES_CONFIG: CategoryConfig[] = [
  { key: "traffic", img: "/image/categories/traffic.png" },
  { key: "food", img: "/image/categories/food.png" },
  { key: "commerce", img: "/image/categories/commerce.png" },
  { key: "environment", img: "/image/categories/environment.png" },
  { key: "publicDecency", img: "/image/categories/publicDecency.png" },
  { key: "health", img: "/image/categories/health.png" },
];
