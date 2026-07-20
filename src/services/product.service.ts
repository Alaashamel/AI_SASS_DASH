import { get } from "./api";
import { Product, PaginatedResponse } from "@/types";

export const productService = {
  async getProducts(skip = 0, limit = 30): Promise<PaginatedResponse<Product>> {
    return get<PaginatedResponse<Product>>(`/products?skip=${skip}&limit=${limit}`);
  },

  async getProductById(id: number): Promise<Product> {
    return get<Product>(`/products/${id}`);
  },

  async searchProducts(
    query: string,
    skip = 0,
    limit = 30
  ): Promise<PaginatedResponse<Product>> {
    return get<PaginatedResponse<Product>>(
      `/products/search?q=${query}&skip=${skip}&limit=${limit}`
    );
  },

  async getProductsByCategory(
    category: string,
    skip = 0,
    limit = 30
  ): Promise<PaginatedResponse<Product>> {
    return get<PaginatedResponse<Product>>(
      `/products/category/${category}?skip=${skip}&limit=${limit}`
    );
  },

  async getCategories(): Promise<string[]> {
    return get<string[]>("/products/category-list");
  },
};
