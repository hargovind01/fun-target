const bcrypt = require("bcrypt")
const Player = require("../models/auth_model");

const register = async (req, res, next) => {
    try {
        const { username, phone, password } = req.body;

        console.log("Register request body:", req.body);

        // Check if the username already exists
        const userExist = await Player.findOne({ username });
        if (userExist) {
            return res.status(400).json({ msg: "Username already exists" });
        }

        // Create new user
        const userCreated = await Player.create({ username, phone, password });

        res.status(201).json({
            msg: "Entry successful",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString(),
        });
    } catch (error) {
        console.error("Error in register:", error.message);
        next(error); // Pass the error to the error-handling middleware
    }
};

const login = async (req, res, next) => {
    try {
        console.log("Login request body:", req.body);

        const { username, password } = req.body;

        // Check if user exists
        const userExist = await Player.findOne({ username });
        if (!userExist) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Validate password
        const isPasswordValid = await userExist.comparePassword(password);
        if (isPasswordValid) {
            res.status(200).json({
                msg: "Login successful",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });
        } else {
            res.status(401).json({ msg: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Error in login:", error.message);
        next(error);
    }
};

const updatePoints = async (req, res, next) => {
    try {
        const { points } = req.body;

        // Validate points
        if (typeof points !== "number" || points < 0) {
            return res.status(400).json({ message: "Invalid points value" });
        }

        // Find the master user
        const user = await Player.findOne({ is_Master: true });
        console.log("FROM TRANSACTION:",user)
        if (!user) {
            return res.status(404).json({ error: "Master user not found" });
        }

        // Update points
        user.point += points; // Increment points
        await user.save();

        res.status(200).json({
            message: "Points updated successfully",
            updatedPoints: user.points,
        });
    } catch (error) {
        console.error("Error updating master user points:", error.message);
        next(error);
    }
};

const deduceUserPoints = async (req, res, next) => {
    try {
      const id = req.params.id;
      const { points, password } = req.body;  // Extract password and points from request body
        console.log("USER ID:",id)
      if (typeof points !== "number" || points < 0) {
        return res.status(400).json({ message: "Invalid points value" });
      }
  
      // Fetch the user from the database using the provided ID
      const user = await Player.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Verify password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect password" });
      }
  
      // Proceed with deducting points (assuming you want to set it to 0)
      const updatedUser = await Player.updateOne(
        { _id: id },
        { $set: { point: 0 } }  // Set points to 0
      );

      console.log("Updated User: ",updatedUser);
  
      if (updatedUser.modifiedCount === 0) {
        return res.status(404).json({ message: "Points not updated" });
      }
  
      return res.status(200).json({ message: "Points updated successfully" });
    } catch (error) {
      console.error("Error updating user points:", error.message);
      next(error);  // Pass the error to the error-handling middleware
    }
  };


const user = async (req, res, next) => {
    try {
        const userData = req.user;

        if (!userData) {
            return res.status(404).json({ msg: "User not found" });
        }

        console.log("User data:", userData);
        res.status(200).json({ userData });
    } catch (error) {
        console.error("Error in user route:", error.message);
        next(error);
    }
};

const updateUserPoints = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { points } = req.body;

        if (typeof points !== "number" || points < 0) {
            return res.status(400).json({ message: "Invalid points value" });
        }

        const updatedUser = await Player.updateOne(
            { _id: id },
            { $set: { point: points } }
        );

        if (updatedUser.modifiedCount === 0) {
            return res.status(404).json({ message: "User not found or points not updated" });
        }

        return res.status(200).json({ message: "Points updated successfully" });
    } catch (error) {
        console.error("Error updating user points:", error.message);
        next(error);
    }
};

module.exports = { register, login, updatePoints, user, deduceUserPoints,updateUserPoints };
