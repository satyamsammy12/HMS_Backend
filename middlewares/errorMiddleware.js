class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal server error";
    err.statusCode = err.statusCode || 500;

    // Handle specific error codes
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "JSON web token is invalid.";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "TokenExpiredError") {
        const message = "JSON web token is expired.";
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}.`;
        err = new ErrorHandler(message, 400);
    }

    // Handle validation errors
    if (err.errors) {
        const errorMessage = Object.values(err.errors).map(error => error.message).join(", ");
        err = new ErrorHandler(errorMessage, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export default ErrorHandler;
