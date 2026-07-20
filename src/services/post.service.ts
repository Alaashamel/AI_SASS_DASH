import { get } from "./api";
import { Post } from "@/types";

export const postService = {
  async getPosts(skip = 0, limit = 30): Promise<{ posts: Post[]; total: number }> {
    return get<{ posts: Post[]; total: number }>(`/posts?skip=${skip}&limit=${limit}`);
  },

  async getPostById(id: number): Promise<Post> {
    return get<Post>(`/posts/${id}`);
  },

  async getPostsByUser(userId: number): Promise<{ posts: Post[]; total: number }> {
    return get<{ posts: Post[]; total: number }>(`/posts/user/${userId}`);
  },

  async searchPosts(query: string): Promise<{ posts: Post[]; total: number }> {
    return get<{ posts: Post[]; total: number }>(`/posts/search?q=${query}`);
  },
};
