const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    time1:{
        type:String,
        require:true,
    },
    news:{
        type:String,
        require:true,
    },
    time2:{
        type:String,
        require:true,
    },
    code:{
        type:String,
        require:true,
    },
    date_of_post:{
        type:String,
        require:true,
    },
    time_of_post:{
        type:String,
        require:true,
    },
    news_editor:{
        type:String,
        require:true,
    }
})

const News = new mongoose.model("News",newsSchema);

module.exports = News;