export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/$/, "");

export const apiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const getImageUrl = (
  path?: string | null,
  fallback = "/placeholder-image.jpg"
) => {
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith("/storage/")) {
    return apiUrl(`/files/image${normalizedPath}`);
  }

  if (normalizedPath.startsWith("/_tmp/")) {
    return apiUrl(`/files${normalizedPath}`);
  }

  if (normalizedPath.startsWith("/files/")) {
    return apiUrl(normalizedPath);
  }

  return apiUrl(normalizedPath);
};
