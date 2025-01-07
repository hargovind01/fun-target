const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;

const connectDB = async ()=>{
    try{
        await mongoose.connect(URI);
        console.log('DB connected');
        console.log('Radha Krishna');
    }catch(err)
    {
        // next(err);
        console.error(err);
        console.error("database connection failed");
        process.exit();
    }
}

module.exports = connectDB;