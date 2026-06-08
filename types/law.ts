export interface Law {
  id: number;
  title: string;
  simplified_text?: string;
  simplified_description?: string;
  text?: string;
  country: string;
  category_id: number;
  source_url: string;
  article_number: string;
  saudi_reference_id?: number;
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
}

export interface Comparison {
  id: number;
  title: string;
  simplified_description: string;
  summary?: string;
  saudi_law?: Law;
  foreign_law?: Law;
  comparison_text?: string;
  category_id: number;
}

export interface ComparisonDetail extends Comparison {
  saudi_law: Law;
  foreign_law: Law;
  comparison_text: string;
}

export interface Bookmark {
  id: number;
  user_id: number;
  law_id?: number;
  comparison_id?: number;
  law?: Law;
  comparison?: Comparison;
  created_at: string;
}

export interface SearchResult {
  id: number;
  title: string;
  description: string;
  country: string;
  type: 'comparison' | 'law';
}
