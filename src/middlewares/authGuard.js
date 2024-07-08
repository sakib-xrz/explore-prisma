import jwt from "jsonwebtoken";
import config from "../config/index.js";
import prisma from "../db/db.config.js";
import ApiError from "../utils/ApiError.js";

const authGuard = (...requiredRoles) => {
  return async (req, _res, next) => {
    try {
      const bearerToken = req.headers.authorization;

      if (!bearerToken || !bearerToken.startsWith("Bearer")) {
        throw new ApiError(401, "Invalid or missing authorization header");
      }
      const token = bearerToken.split(" ")[1];
      const decoded = jwt.verify(token, config.jwtSecret);

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
        omit: {
          password: true,
        },
      });

      if (!user) {
        throw new ApiError(401, "You are not authorized to access this route");
      }

      req.user = user;

      if (requiredRoles.length && !requiredRoles.includes(user.role)) {
        throw new ApiError(403, "You are not authorized to access this route");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authGuard;
