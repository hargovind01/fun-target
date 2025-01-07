const News = require("../models/news_model");

const createNews = async(req,res,next) => {
    try {
        const { time1, news, time2,code, date_of_post,time_of_post,news_editor } = req.body;

        console.log("News body:", req.body);


        // Create new News
        const NewsCreated = await News.create({ time1, news, time2,code, date_of_post,time_of_post,news_editor });

        res.status(201).json({
            msg: "News Added successful",
        });
    } catch (error) {
        console.error("Error in News Adding:", error.message);
        next(error); // Pass the error to the error-handling middleware
    }
};

const getNews = async (req, res, next) => {
    try {
        const news = await News.find({},{new_editor:0,time_of_post:0,date_of_post:0});
        console.log("Fetched news:",news);

        if(!news || news.length === 0)
        {
            console.log("User data:", news);
            return res.status(404).json({ message: "No News Found" });
        }
        
        console.log("Sending News")
        res.status(200).json({ news });
    } catch (error) {
        console.error("Error in user route:", error.message);
        next(error);
    }
};

const newsInfo = async (req, res, next) => {
    try {
        const news = await News.find();
        console.log("Fetched news:",news);

        if(!news || news.length === 0)
        {
            console.log("News data:", news);
            return res.status(404).json({ message: "No News Found" });
        }
        
        console.log("Sending News")
        res.status(200).json({ news });
    } catch (error) {
        console.error("Error occurred in sending news :", error.message);
        if (!res.headersSent) {
            return next(error); // Pass the error to the global error handler
        }
    }
};

const deleteNewsById = async(req,res,next) => {
    try {
        const id = req.params.id;
        await News.deleteOne({_id:id});
        return res.status(200).json({message:"News Deleted Successfully"})

    } catch (error) {
        next(error)
    }
}
1
module.exports = { createNews, getNews,newsInfo,deleteNewsById };
