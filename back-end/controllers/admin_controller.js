const User = require("../models/auth_model");

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, { password: 0 });
        console.log("Fetched users:", users);

        if (!users || users.length === 0) {
            console.log("No users found, sending 404 response");
            return res.status(404).json({ message: "No Users Found" });
        }

        console.log("Sending users data");
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error occurred:", error.message);
        if (!res.headersSent) {
            return next(error); // Pass the error to the global error handler
        }
    }
};

const updateUserById = async(req, res) =>{
    try {
        const id = req.params.id;
        const updatedUserData = req.body;

        const updatedData = await User.updateOne({_id:id}, {
            $set:updatedUserData,
        });
        console.log("updated")
        return res.status(200).json(updatedData);
    } catch (error) {
        console.log(error);
    }
}

const getUserById = async(req, res,next) =>{
    try{
        const id = req.params.id;
        const data = await User.findOne({_id: id} ,{ password:0});
        return res.status(200).json(data);
    }
    catch(error)
    {
        next(error);
    }
}

const deleteUserById = async(req, res, next) => {
    try{
        const id = req.params.id;
        await User.deleteOne({_id:id});
        return res.status(200).json({message:"User Deleted Successfully"})
    }
    catch{error}{
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

        const updatedUser = await User.updateOne(
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

module.exports = { getAllUsers , deleteUserById , getUserById, updateUserById,updateUserPoints };