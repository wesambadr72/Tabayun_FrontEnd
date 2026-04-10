import { api } from './api';
import { Law, Category, Comparison, ComparisonDetail, Bookmark, SearchResult } from '@/types/law';

export const lawService = {
  getCategories: () => api.get<Category[]>('/laws/categories'),

  search: (query: string) => 
    api.get<SearchResult[]>(`/search/query?q=${encodeURIComponent(query)}`),

  getLawsByCategory: (categoryId: number) => 
    api.get<Comparison[]>(`/laws/by-category/${categoryId}`),

  getComparisonById: (comparisonId: number) => 
    api.get<ComparisonDetail>(`/comparison/${comparisonId}`),

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
