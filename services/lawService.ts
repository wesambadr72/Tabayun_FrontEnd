import { api } from './api';
import { Law, Category, Comparison, Bookmark } from '@/types/law';

export const lawService = {
  getCategories: () => api.get<Category[]>('/laws/categories'),

  getLawsByCategory: (categoryId: number) => 
    api.get<Comparison[]>(`/laws/by-category/${categoryId}`),

  getComparisonById: (comparisonId: number) => 
    api.get<Comparison>(`/comparison/${comparisonId}`),

  subscribeToCategory: (categoryId: number) => 
    api.post<{ message: string }>(`/laws/subscribe/${categoryId}`),

  getPriorityComparisons: () => 
    api.get<Comparison[]>('/comparison/priority'),

  addBookmark: (comparisonId: number) => 
    api.post<Bookmark>('/comparison/bookmark', { comparison_id: comparisonId }),

  getMyBookmarks: () => 
    api.get<Bookmark[]>('/comparison/bookmarks'),

  getAvailableCountries: () => 
    api.get<string[]>('/laws/countries'),
};
