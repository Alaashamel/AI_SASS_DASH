import { SortConfig, SortDirection } from "@/types";

export function sortByKey<T>(data: T[], sortConfig: SortConfig<T>): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    let comparison = 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      comparison = aVal.localeCompare(bVal);
    } else if (typeof aVal === "number" && typeof bVal === "number") {
      comparison = aVal - bVal;
    } else {
      comparison = String(aVal).localeCompare(String(bVal));
    }

    return sortConfig.direction === "desc" ? -comparison : comparison;
  });
}

export function filterBySearch<T extends Record<string, unknown>>(
  data: T[],
  query: string,
  keys: (keyof T)[]
): T[] {
  if (!query.trim()) return data;
  const lower = query.toLowerCase();
  return data.filter((item) =>
    keys.some((key) => {
      const val = item[key];
      if (typeof val === "string") return val.toLowerCase().includes(lower);
      if (Array.isArray(val)) return val.some((v) => String(v).toLowerCase().includes(lower));
      return false;
    })
  );
}

export function paginate<T>(data: T[], page: number, pageSize: number): { items: T[]; total: number; totalPages: number; currentPage: number } {
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const currentPage = Math.min(Math.max(1, page), totalPages || 1);
  const start = (currentPage - 1) * pageSize;
  return {
    items: data.slice(start, start + pageSize),
    total,
    totalPages,
    currentPage,
  };
}
