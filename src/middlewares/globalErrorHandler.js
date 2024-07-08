import ApiError from "../utils/ApiError.js";
import config from "../config/index.js";
import { Prisma } from "@prisma/client";

const globalErrorHandler = (err, _req, res, _next) => {
  console.log(`💀 Global Error Handler ~`, err);
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages = [];

  if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err.message;
    errorMessages = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  } else if (err?.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired. Please login again!";
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err?.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please provide a valid token.";
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma known request errors
    switch (err.code) {
      case "P2000":
        message = "The provided value for the column is too long.";
        break;
      case "P2001":
        message = "Record not found.";
        break;
      case "P2002":
        message = "Unique constraint failed on the field.";
        break;
      case "P2003":
        message = "Foreign key constraint failed.";
        break;
      case "P2004":
        message = "A constraint failed on the database.";
        break;
      case "P2005":
        message = "Invalid value provided for the column.";
        break;
      case "P2006":
        message = "The provided value for the model field is not valid.";
        break;
      case "P2007":
        message = "Data validation error.";
        break;
      case "P2008":
        message = "Failed to perform the query operation.";
        break;
      case "P2009":
        message = "Failed to perform the query operation.";
        break;
      case "P2010":
        message = "Raw query failed.";
        break;
      case "P2011":
        message = "Unique constraint failed on the columns.";
        break;
      case "P2012":
        message = "Missing required value.";
        break;
      case "P2013":
        message = "Missing the required argument.";
        break;
      case "P2014":
        message = "Relational constraint violation.";
        break;
      case "P2015":
        message = "Related record not found.";
        break;
      case "P2016":
        message = "Query was not able to resolve.";
        break;
      case "P2017":
        message = "Records not found.";
        break;
      case "P2018":
        message = "Required parameter missing.";
        break;
      case "P2019":
        message = "Input value too large.";
        break;
      case "P2020":
        message = "Input value too small.";
        break;
      case "P2021":
        message = "Table not found in the database.";
        break;
      case "P2022":
        message = "Column not found in the table.";
        break;
      case "P2023":
        message = "Inconsistent column data.";
        break;
      default:
        message = "Database request error.";
    }
    statusCode = 400;
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    // Handle Prisma validation errors
    statusCode = 400;
    message = "Database validation error.";
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    // Handle Prisma Rust panic errors
    statusCode = 500;
    message = "Unexpected error occurred.";
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    // Handle Prisma initialization errors
    statusCode = 500;
    message = "Failed to initialize Prisma Client.";
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    // Handle Prisma unknown request errors
    statusCode = 500;
    message = "An unknown error occurred.";
    errorMessages = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
