import { Router } from "express";
import authGuard from "../../middlewares/authGuard.js";
import blogController from "../../controllers/blog.controller.js";

const router = Router();

router.route("/").get(authGuard(), blogController.createBlog);

export default router;
