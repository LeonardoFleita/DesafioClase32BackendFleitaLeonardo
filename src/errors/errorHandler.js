const { ErrorCodes } = require("./errorCodes");

/**
 * @type {import("express").ErrorRequestHandler}
 */
const errorHandler = (error, req, res, next) => {
  if (!error.cause) {
    console.log(error);
  } else {
    console.log(error.cause);
  }
  switch (error.code) {
    case ErrorCodes.INVALID_PARAMETERS:
      res.status(400).send({ status: "error", error: error.name });
      break;
    case ErrorCodes.NOT_FOUND:
      res.status(404).send({ status: "error", error: error.name });
      break;
    case ErrorCodes.DATABASE_ERROR:
      res.status(500).send({ status: "error", error: error.name });
      break;
    default:
      res.status(500).send({ status: "error", error: "Unknown" });
  }
};

module.exports = { errorHandler };
