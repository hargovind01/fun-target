const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    sendername:{
        type:String,
        required:true,
    },
    recievername:{
        type:String,
        required:true,
    },
    date:{
        type:String,
        require:true,
    },
    time:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
});


const Transaction = new mongoose.model("Transaction",transactionSchema);

module.exports = Transaction;
