import prisma from "../db/db.config.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";

const getUsers = catchAsync(async (_req, res) => {
  const result = await prisma.user.findMany({
    omit: {
      password: true,
    },
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieve successful",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { id } = req.user;

  const result = await prisma.user.findUnique({
    where: { id },
    omit: { password: true },
  });

  if (!result) {
    throw new ApiError(404, "User not found");
  }

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieve successful",
    data: result,
  });
});

const userController = { getUsers, getMe };

export default userController;
