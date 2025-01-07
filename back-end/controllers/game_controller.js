const History = require("../models/game_model");

const game_history = async (req, res, next) => {
    try {
        const gameHistories = await History.find({});

        if (!gameHistories || gameHistories.lengh === 0) {
            console.log("No Games Found");
            return res.status(404).json({ message: "No Games Found" });
        }

        // console.log("Games:", gameHistories);
        return res.status(200).json(gameHistories);
    } catch (error) {
        console.log(error);
    }
}

const game_update = async (req, res, next) => {
    try {
        const {username, mode, bet_amount, bet_on0, bet_on1, bet_on2, bet_on3, bet_on4, bet_on5, bet_on6, bet_on7, bet_on8, bet_on9, bet_status, actual_no,win_amount, lose_amount, date, time } = req.body;

        console.log(req.body)

        const gameStored = await History.create({ username, mode, bet_amount, bet_on0, bet_on1, bet_on2, bet_on3, bet_on4, bet_on5, bet_on6, bet_on7, bet_on8, bet_on9, bet_status,actual_no, win_amount, lose_amount, date, time });

        res.status(201).json({ msg: "Game Stored Succeed" });
    }
    catch (error) {
        res.status(500).json("Internal server error")
        console.log(error);
        next(error);
    }

}


module.exports = { game_history, game_update };