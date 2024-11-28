class ErrorHandler extends Error {
    //custom error handler class
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorHandler;