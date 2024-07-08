import prisma from "../db/db.config.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const createBlog = catchAsync(async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user;

  const result = await prisma.blog.create({
    data: {
      title,
      content,
      userId: id,
    },
  });

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});

const blogController = { createBlog };

export default blogController;
