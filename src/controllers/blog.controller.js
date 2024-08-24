import prisma from "../db/db.config.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const createBlog = catchAsync(async (req, res) => {
  const { title, content } = req.body;
  const { id } = req.user;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required");
  }

  const tags = req.body.tags || [];

  if (tags.length > 0) {
    const tagObjects = tags.map((tag) => {
      return {
        name: tag,
      };
    });

    console.log(tagObjects);
  }

  // const result = await prisma.blog.create({
  //   data: {
  //     title,
  //     content,
  //     userId: id,
  //   },
  // });

  // return sendResponse(res, {
  //   statusCode: 201,
  //   success: true,
  //   message: "Blog created successfully",
  //   data: result,
  // });
});

const getBlogs = catchAsync(async (req, res) => {
  const blogs = await prisma.blog.findMany({
    include: {
      user: true,
    },
  });

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully",
    data: blogs,
  });
});

const blogController = { createBlog, getBlogs };

export default blogController;
