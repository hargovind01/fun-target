const jwt = require("jsonwebtoken");
const Player = require("../models/auth_model");

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: "Unauthorized HTTP, Token not provided" });
    }

    const jwtToken = token.replace("Bearer", "").trim();

    console.log("JWT Token:", jwtToken);

    try {
        // Verify the JWT token using the secret key
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

        // Find the user associated with the token, excluding the password
        const userData = await Player.findOne({ username: isVerified.username }).select();

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User Data:", userData);

        // Attach the user data and token to the request object
        req.user = userData;
        req.token = token;
        req.userID = userData._id;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Unauthorized HTTP, Token invalid or expired" });
    }
};

module.exports = authMiddleware;
