import prisma from "../db/db.config.js";
import catchAsync from "../utils/catchAsync.js";
import sendResponse from "../utils/sendResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import ApiError from "../utils/ApiError.js";

const createUser = catchAsync(async (req, res) => {
  const { ...registerData } = req.body;

  let { name, email, password } = registerData;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const userAlreadyExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userAlreadyExists) {
    throw new ApiError(400, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  password = hashedPassword;

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password,
      role: registerData.role || "USER",
    },
    omit: {
      password: true,
    },
  });

  const payload = {
    id: newUser.id,
    role: newUser.role,
  };

  const secret = config.jwtSecret;
  const expiresIn = config.jwtExpiresIn;

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User created successful",
    data: {
      access: token,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(400, "Invalid email or password");
  }

  const payload = {
    id: user.id,
    role: user.role,
  };

  const secret = config.jwtSecret;
  const expiresIn = config.jwtExpiresIn;

  const token = jwt.sign(payload, secret, {
    expiresIn,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: {
      access: token,
    },
  });
});

const authController = { createUser, login };

export default authController;
