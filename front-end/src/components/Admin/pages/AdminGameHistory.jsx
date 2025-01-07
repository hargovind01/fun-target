import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/auth";

const AdminGameHistory = () => {
  const [gameHistory, setGameHistory] = useState([]);

  const { authorizationToken } = useAuth();
  const getGameHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/game/history", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setGameHistory(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGameHistory();
  }, []);
  return (
    <section className="admin-user-section py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Game History
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Player Name</th>
                <th className="py-3 px-6">Mode</th>
                <th className="py-3 px-6">0</th>
                <th className="py-3 px-6">1</th>
                <th className="py-3 px-6">2</th>
                <th className="py-3 px-6">3</th>
                <th className="py-3 px-6">4</th>
                <th className="py-3 px-6">5</th>
                <th className="py-3 px-6">6</th>
                <th className="py-3 px-6">7</th>
                <th className="py-3 px-6">8</th>
                <th className="py-3 px-6">9</th>
                <th className="py-3 px-6">Result</th>
                <th className="py-3 px-6">Bet status</th>
                <th className="py-3 px-6">Win Amount</th>
                <th className="py-3 px-6">Lose Amount</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">time</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {gameHistory.map((game, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <td className="py-3 px-6">{game.username}</td>
                  <td className="py-3 px-6">{game.mode}</td>
                  <td className="py-3 px-6">{game.bet_on0}</td>
                  <td className="py-3 px-6">{game.bet_on1}</td>
                  <td className="py-3 px-6">{game.bet_on2}</td>
                  <td className="py-3 px-6">{game.bet_on3}</td>
                  <td className="py-3 px-6">{game.bet_on4}</td>
                  <td className="py-3 px-6">{game.bet_on5}</td>
                  <td className="py-3 px-6">{game.bet_on6}</td>
                  <td className="py-3 px-6">{game.bet_on7}</td>
                  <td className="py-3 px-6">{game.bet_on8}</td>
                  <td className="py-3 px-6">{game.bet_on9}</td>
                  <td className="py-3 px-6">{game.actual_no}</td>
                  <td className="py-3 px-6">{game.bet_status}</td>
                  <td className="py-3 px-6">{game.win_amount}</td>
                  <td className="py-3 px-6">{game.lose_amount}</td>
                  <td className="py-3 px-6">{game.date}</td>
                  <td className="py-3 px-6">{game.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminGameHistory;
