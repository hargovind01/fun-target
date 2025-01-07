const {z} = require("zod");

const signupSchema = z.object({
    username:z.string({required_error:"Username is Required"}).trim().min(3,{message: "Name must be at least of 3 characters"}).max(255,{message: "Name must be at most of 255 characters"}),
    phone :z.string({required_error:"Phone number is Required"}).trim().min(10,{message: "Phone no. must be at least of 10 characters"}).max(10,{message: "Phone must be at most of 10 characters"}),
    password:z.string({required_error:"Password is Required"}).trim().min(6,{message: "Password must be at least of 6 characters"}).max(1024,{message: "password must be at most of 1024 characters"}),
});

module.exports = signupSchema;