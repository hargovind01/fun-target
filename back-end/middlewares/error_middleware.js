const errorMiddleware  = (err, rep, res, next) =>{
    
    if (res.headersSent) {
        // If headers are already sent, delegate to the default Express error handler
        return next(err);
    }
    
    const status = err.status || 500;
    const  message = err.message || "Backend Error";
    const extraDetails = err.extraDetails || "Error from Backend ";


    return res.status(status).json({message, extraDetails});

};

module.exports = errorMiddleware