export const siteCategories = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `カテゴリー ${i + 1}`,
}));

export const salesCategories = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `カテゴリー ${i + 1}`,
}));

export const popularTopics = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: "建工管理とは ➔",
  description:
    "建工管理をはじめてご利用になる方、建工管理に招待を受けた方向けのガイドをまとめていま...",
  imageUrl: "https://via.placeholder.com/300x150/facc15/ffffff?text=Image",
}));
