// types/article.ts
export interface Article {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    thumbnailPath?: string;
}

export interface PaginatedResponse {
    data: Article[];
    meta: {
        totalItems: number;
        currentPage: number;
    };
}