import { get, post } from "./api";
import { User, PaginatedResponse } from "@/types";

export const userService = {
  async getUsers(skip = 0, limit = 30): Promise<PaginatedResponse<User>> {
    return get<PaginatedResponse<User>>(`/users?skip=${skip}&limit=${limit}`);
  },

  async getUserById(id: number): Promise<User> {
    return get<User>(`/users/${id}`);
  },

  async searchUsers(query: string): Promise<{ users: User[]; total: number }> {
    return get<{ users: User[]; total: number }>(`/users/search?q=${query}`);
  },

  async getCurrentUser(): Promise<User> {
    return get<User>("/users/1");
  },

  async login(email: string, _password: string): Promise<{ user: User; token: string }> {
    const user = await get<User>("/users/1");
    return { user, token: "mock_jwt_token_" + Date.now() };
  },

  async register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const user = await post<User>("/users/add", {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    });
    return { user, token: "mock_jwt_token_" + Date.now() };
  },
};
