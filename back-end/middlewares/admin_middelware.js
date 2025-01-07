const adminMiddleware = async (req, res, next) => {
    try {
        console.log(req.user);
        const adminRole = req.user.is_Admin
        if (!adminRole) {
            return res
                .status(403)
                .json({ message: "Access denied, User is not an admin" });
        }
        // res.status(200).json({msg: req.user.is_Admin});
        next();
    } catch (error) {
        console.log(error)
        next(error);
    }
}

module.exports = adminMiddleware;