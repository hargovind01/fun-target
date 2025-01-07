const validate = (schema) => async(req,res,next) =>{
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody

        // console.log("hit 2")
        next();
    } catch (error) {
        // console.log(error)
        // const message = error.errors[0].message;
        // console.log(message)
        // res.status(400).json({msg: message});
        next(error);
    }
};

module.exports = validate;