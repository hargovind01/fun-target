const mongoose = require("mongoose");

const gameHistorySchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
    },
    mode:{
        type:Number,
        require:true,
    },
    bet_on0:{
        type:Number,
        require:true,
    },
    bet_on1:{
        type:Number,
        require:true,
    },
    bet_on2:{
        type:Number,
        require:true,
    },
    bet_on3:{
        type:Number,
        require:true,
    },
    bet_on4:{
        type:Number,
        require:true,
    },
    bet_on5:{
        type:Number,
        require:true,
    },
    bet_on6:{
        type:Number,
        require:true,
    },
    bet_on7:{
        type:Number,
        require:true,
    },
    bet_on8:{
        type:Number,
        require:true,
    },
    bet_on9:{
        type:Number,
        require:true,
    },
    actual_no:{
        type:Number,
        require:true,
    },
    bet_status:{
        type:String,
        require:true,
    },
    win_amount:{
        type:Number,
        default: 0,
    },
    lose_amount:{
        type:Number,
        default: 0,
    },
    date:{
        type:String,
        require:true,
    },
    time:{
        type:String,
        required:true,
    }
});

const History = new mongoose.model("History",gameHistorySchema);

module.exports = History;