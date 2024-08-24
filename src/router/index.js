import { Router } from "express";
import authRoutes from "../apis/auth/index.js";
import userRoutes from "../apis/user/index.js";
import blogRoutes from "../apis/blog/index.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/blogs", blogRoutes);

export default router;
