import { Router } from "express";
import authGuard from "../../middlewares/authGuard.js";
import blogController from "../../controllers/blog.controller.js";

const router = Router();

router
  .route("/")
  .post(authGuard(), blogController.createBlog)
  .get(authGuard(), blogController.getBlogs);

export default router;
