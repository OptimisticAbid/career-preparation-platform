const errorMiddleware = (err, req, res, next) => {
    console.error(err)
    
    const statusCode = err.statusCode || (
        err.code === "LIMIT_FILE_SIZE" ? 413 :
        err.code === "LIMIT_UNEXPECTED_FILE" ? 400 :
        500
    );

    res.status(statusCode).json({
        success: false,
        message: err.message || "Server Error"
    })

}

export default errorMiddleware