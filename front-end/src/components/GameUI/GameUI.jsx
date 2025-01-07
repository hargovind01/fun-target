import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/auth";
import SpinWheel from "./SpinWheel";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./GameUI.css";
import takesound from "../../assets/Sound/Take.wav";
import betselectsound from "../../assets/Sound/betplaced.wav";
import T1 from "../../assets/TokenIMG/Token1.png";
import T5 from "../../assets/TokenIMG/Token5.png";
import T10 from "../../assets/TokenIMG/Token10.png";
import T50 from "../../assets/TokenIMG/Token50.png";
import T100 from "../../assets/TokenIMG/Token100.png";
import T500 from "../../assets/TokenIMG/Token500.png";
import T1000 from "../../assets/TokenIMG/Token1000.png";
import T5000 from "../../assets/TokenIMG/Token5000.png";
// import staticOverlayImage from "../../assets/StaticImage.png";


const socket = io("http://localhost:8000"); // Replace with your backend server address

const GameUI = () => {
  const { timeLeft, user, isLoading, authorizationToken, isLoggedIn , mode, updateMode } =
    useAuth();
  const [gameHistory, setGameHistory] = useState([]);
  const [bet, setBet] = useState(Array(10).fill(0));
  const [betAmount, setBetAmount] = useState({});
  const [lastSpinResult, setLastSpinResult] = useState(null);
  const navigate = useNavigate();
  const [totalBet,settotalBet] = useState(0);
  // const [mode, setMode] = useState(2);
  const [points, setPoints] = useState(user?.userData?.point || 0);
  const [winnings, setWinnings] = useState(0);
  const is_Admin = user?.userData?.is_Admin;

  const playSound = (sound) => {
    new Audio(sound).play();
  };

  
  useEffect(() => {
    console.log("Mode updated:", mode); // Or any other logic based on mode
  }, [mode]); 
  // Redirect to home page if user is not logged in or has zero points
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("*");
    } else if (points <= 0 && !is_Admin) {
      console.log("Admin", is_Admin);
      alert("You have 0 points. Please contact the admin for more points.");
      navigate("/panel");
    }
  }, [isLoggedIn, points, navigate]);

  const isSpinActive = timeLeft >= 50 && timeLeft <= 59;

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  // Fetch and sort game history
  const fetchGameHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/game/history", {
        method: "GET",
        headers: { Authorization: authorizationToken },
      });
      const data = await response.json();

      // Sort history so the most recent entries appear first
      const sortedData = data.sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date) || b.time.localeCompare(a.time)
      );
      setGameHistory(sortedData);
    } catch (error) {
      console.error("Error fetching game history:", error);
    }
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const handleSpinComplete = async (resultValue) => {
    setLastSpinResult(resultValue);
    const currentDate = new Date();

    // Calculate win and lose amounts
    console.log(mode)
    const winAmount = bet[resultValue] > 0 ? bet[resultValue] * 9 * mode : 0;
    const loseAmount = bet.reduce(
      (acc, curr, idx) => (idx !== resultValue ? acc + curr : acc),
      0
    );

    // Update local winnings state
    if (winAmount > 0) {
      setWinnings(winnings + winAmount);
    }

    // Update points if the user loses

    if (loseAmount > 0) {
      try {
        const id = user.userData._id;
        const pointUpdateResponse = await fetch(
          `http://localhost:8000/api/auth/updatepoints/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorizationToken,
            },
            body: JSON.stringify({ points: points }),
          }
        );

        if (!pointUpdateResponse.ok) {
          throw new Error("Failed to update points");
        }
      } catch (error) {
        console.error("Error updating points:", error);
      }
    }

    // Record game history
    const gameUpdate = {
      username: user.userData.username,
      mode: mode,
      ...Object.fromEntries(
        bet.map((value, index) => [`bet_on${index}`, value])
      ),
      actual_no: resultValue,
      bet_status: bet[resultValue] > 0 ? "Won" : "Lost",
      win_amount: winAmount,
      lose_amount: loseAmount,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
    };

    try {
      const response = await fetch("http://localhost:8000/api/game/entry", {
        method: "POST",
        headers: {
          Authorization: authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to store game data");
      }

      // Update local state after successful backend update
      settotalBet(0);
      setBet(Array(10).fill(0)); // Reset bets
      setBetAmount({}); // Clear selected bet amount
      await fetchGameHistory(); // Refetch game history
    } catch (error) {
      console.error("Error during spin completion:", error);
    }
  };

  const handleTakeButton = async () => {
    if (winnings === 0) {
      return alert("No Points To 'TAKE'");
    }

    const newPoints = points + winnings;
    try {
      const id = user.userData._id;
      const response = await fetch(
        `http://localhost:8000/api/auth/updatepoints/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ points: newPoints }),
        }
      );

      if (response.ok) {
        playSound(takesound);
        setPoints(newPoints);
        setWinnings(0); // Reset winnings after updating
      } else {
        throw new Error("Failed to record transaction");
      }
    } catch (error) {
      console.error("Error taking winnings:", error);
    }
  };

  const [selectedBet, setSelectedBet] = useState(null);
  const handleBetAmountSelection = (amount) => {
    setBetAmount({ [amount]: true });
    setSelectedBet(parseInt(amount, 10));
    console.log("Selected Bet:", amount);
  };

  const handlePlaceBet = (index) => {
    const selectedAmount = Object.keys(betAmount).find((key) => betAmount[key]);
    if (selectedAmount) {
      const betValue = parseInt(selectedAmount, 10);
      settotalBet(totalBet + betValue)

      // Check if the first bet is greater than 1
      const totalBetPlaced = bet.reduce((acc, curr) => acc + curr, 0);
      if (totalBetPlaced === 0 && betValue === 1) {
        alert("The first bet should be greater than 1.");
      }

      // Check if the user has enough points to place the bet
      if (points >= betValue) {
        const updatedBets = [...bet];
        updatedBets[index] += betValue;
        playSound(betselectsound);
        setBet(updatedBets);
        setPoints((prevPoints) => prevPoints - betValue); // Deduct the bet amount from points
      } else {
        alert("Insufficient points to place this bet.");
      }
    }
  };

  const renderBetButtons = (bets) => {
    const tokenImages = {
      1: T1,
      5: T5,
      10: T10,
      50: T50,
      100: T100,
      500: T500,
      1000: T1000,
      5000: T5000,
    };

    return bets.map((item) => (
      <button
        key={item.value}
        onClick={() => handleBetAmountSelection(item.value)}
        disabled={item.disabled}
        className={`w-10 h-10 rounded-full bg-center bg-no-repeat bg-cover hover:opacity-90 ${
          selectedBet === parseInt(item.value, 10) ? "glow-effect" : ""
        }`}
        style={{
          backgroundColor: item.color,
          backgroundImage: `url(${tokenImages[item.value]})`,
        }}
      ></button>
    ));
  };

  const handleCancelSpecificBet = (index) => {
    if (bet[index] > 0) {
      const updatedPoints = points + bet[index];
      const updatedBets = [...bet];
      settotalBet(totalBet - updatedBets[index])
      updatedBets[index] = 0; // Reset the specific bet to 0
      setBet(updatedBets); // Update the bets array
      setPoints(updatedPoints); // Update the points

      // Optionally update points in the backend
      updatePointsInBackend(updatedPoints);
    } else {
      alert("No bet placed on this option to cancel.");
    }
  };

  const handleCancelAllBets = () => {
    const totalBetAmount = bet.reduce((acc, curr) => acc + curr, 0);

    if (totalBetAmount > 0) {
      const updatedPoints = points + totalBetAmount;
      settotalBet(0);
      setBet(Array(10).fill(0)); // Reset all bets to 0
      setPoints(updatedPoints); // Update the points

      // Optionally update points in the backend
      updatePointsInBackend(updatedPoints);
    } else {
      alert("No bets placed to cancel.");
    }
  };

  return (
    <div
      id="background"
      className="min-w-full min-h-screen p-4 flex flex-col items-center"
    >
      {/* Header Section */}
      <div className="header-section flex justify-between w-full items-center">
        <div className="header-box flex flex-col items-center">
          <span className="header-title mt-1">POINTS</span>
          <span className="header-value -mt-1">{points}</span>
        </div>

        <div className="header-box flex flex-col items-center">
          <span className="header-title mt-1">WINNING</span>
          <span className="header-value -mt-1">{winnings}</span>
        </div>
      </div>

      {/* SpinWheel Section */}
      <div className="spinwheel-container relative">
        <SpinWheel onSpinComplete={handleSpinComplete} />
      </div>
      <div className="timer-last-data-container">
        {/* Timer Section */}
        <div className="timer-box">
          <span className="header-title">TIMER</span>
          <div className="header-box flex flex-col items-center">
            <span className="header-value mt-3">
              {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </span>
          </div>
          <button
            onClick={handleCancelAllBets}
            disabled={isSpinActive}
            className="w-32 h-5 bg-red-900 text-white rounded-lg hover:bg-yellow-600 shadow-md mt-5"
          >
            Cancel All Bet
          </button>
        </div>

        {/* Last 10 Data Section */}
        <div className="last-data-box">
          <span className="header-title">LAST 10 DATA</span>
          <div className="header-box  flex flex-col items-center">
            <span className="header-value mt-3">
              {gameHistory.length > 0 ? (
                gameHistory.slice(0, 10).map((item, index) => (
                  <span key={index}>
                    {item.actual_no}{" "}
                  </span>
                ))
              ) : (
                <div>No data available</div>
              )}
            </span>
          </div>
          <button
            onClick={handleTakeButton}
            disabled={isSpinActive}
            className="w-32 h-5 bg-red-900 text-white rounded-lg hover:bg-yellow-600 shadow-md mt-4"
          >
            Recieve
          </button>
        </div>
      </div>

      {/* Bet Buttons Section */}
      <div className="bet-buttons-container mt-1">
        <div className="bet-buttons-left">
          {renderBetButtons([
            { value: "1", color: "#FFFFFF" },
            { value: "5", color: "#FFFFFF" },
            { value: "10", color: "#FFFFFF" },
            { value: "50", color: "#FFFFFF" },
          ])}
        </div>

        <div className="bet-buttons-right">
          {renderBetButtons([
            { value: "100", color: "#FFFFFF" },
            { value: "500", color: "#FFFFFF" },
            { value: "1000", color: "#FFFFFF" },
            { value: "5000", color: "#FFFFFF" },
          ])}
        </div>
      </div>
      {/* Bet Inputs and Buttons */}
      <div className="py-4 px-6 rounded-lg shadow-lg mt-4">
        <div className=" flex justify-center items-center gap-11 flex-wrap">
          {bet
            .map((amount, index) => ({ index, amount })) // Add index to each item
            .sort((a, b) =>
              a.index === 0 ? 1 : b.index === 0 ? -1 : a.index - b.index
            ) // Reorder: move 0th to the end
            .map(({ amount, index }) => (
              <div
                key={index}
                className="text-center flex flex-col items-center mt-5"
              >
                <input
                  type="text"
                  value={`${amount}`}
                  readOnly
                  className="mb-1 text-center border border-gray-300 rounded p-0.5 text-xs w-14"
                />
                <button
                  onClick={() => handlePlaceBet(index)}
                  disabled={isSpinActive}
                  className="glowing-button"
                >
                  {index}
                </button>
                <button
                  onClick={() => handleCancelSpecificBet(index)}
                  disabled={isSpinActive}
                  className="cancel-bet w-14 h-5 bg-yellow-200 text-red rounded-lg hover:bg-red-600 shadow-md mt-1 "
                >
                  Cancel Bet
                </button>
              </div>
            ))}
        </div>
      </div>
      <div className="flex justify-between items-center rounded-lg shadow-lg w-full p-1 -mt-5">
  <span><button className="bg-red-900 text-white rounded">Exit</button></span>
  <span className="status-panel bg-white"> <div>The Bet Less Than 5 is Not Allowed</div><div>Your Total Bet is : {totalBet}</div></span>
  <span><button className="bg-red-900 text-white rounded">Bet Ok</button></span>
</div>

    </div>
  );
};

export default GameUI;
