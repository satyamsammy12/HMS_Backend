export const catchAsyncError= (thefunction)=>{
    return async (req, res, next) => {
        Promise.resolve(thefunction(req, res, next)).catch(next);
    };
}