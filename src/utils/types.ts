export type DBCategoryNode = {
    id: string;
    category_name: string;
    category_slug: string;
    parent_category_id: string | null;
    sort_order: number;
    status: string;
    children?: DBCategoryNode[];
}

export type CategoryNode = {
    id: string;
    category_name: string;
    category_slug: string;
    parent_category_id: string | null;
}

export type SubCategory = {
    id: string;
    category_name: string;
    category_slug: string;
    parent_category_id: string;
    sort_order: number;
    status: string;
}

export type MainCategory = {
    id: string;
    category_name: string;
    category_slug: string;
    parent_category_id: string | null;
    sort_order: number;
    status: string;
    children?: SubCategory[];
}

export type Article = {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    thumbnailPath?: string;
}

export type PaginatedResponse = {
    data: Article[];
    meta: {
        totalItems: number;
        currentPage: number;
    };
}