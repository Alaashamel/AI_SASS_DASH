import { get } from "./api";
import { Todo } from "@/types";

export const todoService = {
  async getTodos(skip = 0, limit = 30): Promise<{ todos: Todo[]; total: number }> {
    return get<{ todos: Todo[]; total: number }>(`/todos?skip=${skip}&limit=${limit}`);
  },

  async getTodoById(id: number): Promise<Todo> {
    return get<Todo>(`/todos/${id}`);
  },

  async getTodosByUser(userId: number): Promise<{ todos: Todo[]; total: number }> {
    return get<{ todos: Todo[]; total: number }>(`/todos/user/${userId}`);
  },
};
