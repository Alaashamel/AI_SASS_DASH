import { userService } from "./user.service";
import { productService } from "./product.service";
import { postService } from "./post.service";
import { todoService } from "./todo.service";
import chatService from "./chat.service";

export const services = {
  user: userService,
  product: productService,
  post: postService,
  todo: todoService,
  chat: chatService,
};

export { userService } from "./user.service";
export { productService } from "./product.service";
export { postService } from "./post.service";
export { todoService } from "./todo.service";
export { default as chatService } from "./chat.service";
