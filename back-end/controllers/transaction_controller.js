const Transaction = require("../models/transaction_model");


const transaction_entry = async(req,res,next)=>{
    try{
        const {sendername,recievername,date,time,amount} = req.body;
        console.log(req.body);

        const transactionCreated = await Transaction.create({sendername,recievername,date,time,amount});

        res.status(201).json({msg:"Entry successful"});
    }catch(error)
    {
        res.status(500).json("Internal server error")
        console.log(error);
        next(error);
    }
};

const transaction_enquiry = async(req,res,next)=>{
    try {
        const transactions = await Transaction.find({});

        if (!transactions || transactions.length === 0) {
            console.log("No transactions found, sending 404 response");
            return res.status(404).json({ message: "No transactions Found" });
        }
        
        console.log("Transactions:", transactions);
        return res.status(200).json(transactions);
    } 
    catch (error) {
        console.error("Error occurred:", error.message);
        if (!res.headersSent) {
            return next(error); // Pass the error to the global error handler
        }
    }
}

module.exports =  {transaction_entry, transaction_enquiry};