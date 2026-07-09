export type DBCategoryNode = {
  id: string;
  category_name: string;
  category_slug: string;
  parent_category_id: string | null;
  sort_order: number;
  status: string;
  children?: DBCategoryNode[];
};

export type CategoryNode = {
  id: string;
  category_name: string;
  category_slug: string;
  parent_category_id: string | null;
  children?: CategoryNode[];
};

export type SubCategory = {
  id: string;
  category_name: string;
  category_slug: string;
  parent_category_id: string;
  sort_order: number;
  status: string;
};

export type MainCategory = {
  id: string;
  category_name: string;
  category_slug: string;
  parent_order: number;
  status: string;
  children?: SubCategory[];
};

export type ArticleCategory = {
  id: string;
  category_name: string;
  parent_category_id?: string | null;
  category_slug?: string;
  status?: string;
  sort_order?: number;

  parentCategory?: {
    id: string;
    category_name: string;
  };
};

export interface Article {
  id: string;
  category_id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  thumbnail_path?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;

  summary?: string;
  category_name?: string;
  category?: ArticleCategory;
}

export type PaginatedResponse = {
  data: Article[];
  meta: {
    totalItems: number;
    currentPage: number;
  };
};

// Props Type to be used in Article Detail Component
export interface ArticleDetailProps {
  article: Article;
}
