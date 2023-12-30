const asyncHandler = (requestHandler) => {

    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
        .catch((error) => next(error))
    }
}

export { asyncHandler };


// HOF (Higher Order Function):

// A higher-order function (HOF) is a function that takes one or more functions as arguments or returns a function as its result. In other words, a higher-order function either operates on functions by taking them as arguments or produces new functions.

// For Example: 

// const asyncHandler = () => {}
// const asyncHandler = () => { () => {} }
// const asyncHandler = async() => { () => {} }

// const asyncHandler = (fn) => async(req, res, next) => {

//     try {
//          await fn(req, res, next);            
//     } catch (error) {
        
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }