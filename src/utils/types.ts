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

  // Custom dynamic fields
  summary?: string;
  category_name?: string;
  category?: {
    id: string;
    category_name: string;
    parentCategory?: {
      id: string;
      category_name: string;
    };
  };
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
