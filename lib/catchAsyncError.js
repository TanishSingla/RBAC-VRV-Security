const catchAsyncError = (fun) => (req, res, next) => {
    //creating this so that i dont have to write try catch block in every controller function.
    Promise.resolve(fun(req, res, next)).catch(next);
}

module.exports = catchAsyncError;