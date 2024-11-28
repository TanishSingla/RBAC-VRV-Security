const errorMiddleware = (err, req, res, next) => {
    //custom middleware for error handling.
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;
    console.log(err);

    //we can do multiple error handling here based on the error code 
    // like if (err.code === 11000)
    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    }

    res.status(err.statusCode).json(
        {
            success: false,
            message: err.message
        });
}

module.exports = errorMiddleware;
