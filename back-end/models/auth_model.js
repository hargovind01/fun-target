const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const playerSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    point:{
        type:Number,
        default:0,
    },
    winning_history:{
        type:Number,
        default:0,
    },
    amount:{
        type:Number,
        default:0,
    },
    is_Admin:{
        type:Boolean,
        default:false,
    },
    is_Master:{
        type:Boolean,
        default:false,
    },
});

playerSchema.pre('save',async function(next){
    const user = this;

    if(!user.isModified("password")){
        next();
    }

    try{
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password,saltRound)
        user.password = hash_password;
    }
    catch(error)
    {
        next(error);
    }
});

playerSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)   
};

playerSchema.methods.generateToken= async function(){
    try {
        return jwt.sign({
            userId: this._id.toString(),
            username: this.username,
            is_Admin:this.is_Admin,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn:"1d",
        }
        
    );
    } catch (error) {
        // console.error(error)
        next(error);
    }
}

const Player = new mongoose.model("Player",playerSchema);

module.exports = Player;
