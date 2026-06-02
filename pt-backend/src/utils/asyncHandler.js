const asyncHandler = (fn) => {      //gets a function as a parameter/arg
    return async(req,res,next) => {        // returns an async fn
        try {                           // async karako function execute karta as async fn
            await fn(req,res,next)      // executes the passed function
        } catch (error) {
            next(error)
        }
    }
}
export default asyncHandler