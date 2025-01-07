import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/login_img.png";
import servicesLogo from "../../assets/DP_Services.png";
import sound from "../../assets/Sound/Paymentsound.wav";
import "./PointTransferUI.css";

const PointTransferUI = () => {
  const [news, setNews] = useState([]);
  const [point, setPoint] = useState(0);
  const [password, setPassword] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isScrolling, setIsScrolling] = useState(true);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

  const { LogoutUser, isLoggedIn, isLoading, user, authorizationToken } = useAuth();
  const navigate = useNavigate();
  const newsContainerRef = useRef(null);

  // Common Function: Fetch user points when user data is available
  useEffect(() => {
    if (user?.userData?.point) {
      setPoint(user.userData.point);
    }
  }, [user]);

  // Common Function: Redirect to login page if not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // Common Function: Fetch news data from the API
  useEffect(() => {
    const getAllNews = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/news/getNews", {
          method: "GET",
          headers: {
            Authorization: authorizationToken,
          },
        });
        const data = await response.json();
        setNews(Array.isArray(data.news) ? data.news : []);
      } catch (error) {
        console.error("Error fetching news:", error);
        setNews([]);
      }
    };
    getAllNews();
  }, [authorizationToken]);

  // Play sound
  const playSound = () => {
    new Audio(sound).play();
  };

  // Handle Logout
  const handleLogout = () => {
    LogoutUser();
    navigate("/");
  };

  // Handle Games Navigation
  const handlegames = () => {
    navigate("/game");
  };

  // Handle Password Submission
  const handlePasswordSubmit = () => {
    setIsPasswordModalOpen(false);
    handleTransaction();
  };

  // Handle Transaction
  const handleTransaction = async () => {
    if (point <= 0) {
      alert("No points available to transfer.");
      return;
    }
    const masterUsername = "Atikesh"; // Replace with actual master username or ID
    try {
      const transferResponse = await fetch(
        "http://localhost:8000/api/auth/pointTransfer",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({ points: point, masterUsername }),
        }
      );

      if (transferResponse.ok) {
        await recordTransaction(masterUsername);
        await deductPoints();
        setPoint(0);
        playSound();
        alert("Points transferred successfully.");
      } else {
        alert("Transaction failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during transaction:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Helper Function: Record transaction
  const recordTransaction = async (masterUsername) => {
    const transactionData = {
      sendername: user.userData.username,
      recievername: masterUsername,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      amount: point,
    };
    const response = await fetch(
      "http://localhost:8000/api/transaction/entries",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to record transaction.");
    }
  };

  // Helper Function: Deduct points
  const deductPoints = async () => {
    const response = await fetch(
      `http://localhost:8000/api/auth/deducepoints/${user.userData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authorizationToken,
        },
        body: JSON.stringify({ points: point, password }),
      }
    );
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message);
    }
  };

  // Handle Scrolling
  useEffect(() => {
    const scrollAutomatically = () => {
      if (newsContainerRef.current && isScrolling) {
        newsContainerRef.current.scrollLeft += 2;
        requestAnimationFrame(scrollAutomatically);
      }
    };
    if (isScrolling) {
      requestAnimationFrame(scrollAutomatically);
    }
  }, [isScrolling]);

  const handleStopScrolling = () => {
    setIsScrolling(false);
    setIsScrollbarVisible(true);
    setTimeout(() => {
      setIsScrolling(true);
      setIsScrollbarVisible(false);
    }, 3000);
  };

  const handleManualScroll = (e) => {
    if (newsContainerRef.current) {
      newsContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  // Render loading state
  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <div
        className="min-w-full min-h-screen p-4 flex flex-col items-center"
        style={{ backgroundColor: "#FFCC99" }}
      >
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-5xl">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            POINT TRANSFER
          </button>
          <div className="text-black font-bold text-lg mt-2 md:mt-0">
            POINT: {point}
          </div>
        </div>

        {/* Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Enter Password</h2>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
              />
              {errorMessage && (
                <div className="text-red-600 text-sm mb-2">{errorMessage}</div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="bg-gray-400 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image and Title Section */}
        <div className="flex flex-row items-center justify-center mt-6 w-full max-w-5xl">
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Lakshmi and Ganesh"
              className="rounded-lg w-52 md:w-60 h-auto"
            />
          </div>
          <div className="ml-4 flex-grow">
            <img
              src={servicesLogo}
              alt="DP Services Logo"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Live Result Section */}
        <div className="bg-pink-500 text-black rounded-lg py-4 px-6 mt-6 w-full max-w-5xl">
          <div className="font-bold text-center text-lg mb-4">
            🌧️ LIVE RESULT 🌧️
          </div>
          <div
            className="bg-yellow-400 relative overflow-x-auto"
            style={{ textTransform: "uppercase" }}
          >
            <div
              className={`scrolling-content ${isScrolling ? "" : "paused"}`}
              onClick={handleStopScrolling}
              ref={newsContainerRef}
              onWheel={handleManualScroll} // Enable manual scroll when user scrolls with mouse
            >
              {news.concat(news).map((curNews, index) => (
                <div key={index} className="news-item">
                  <div
                    className="font-bold text-xl"
                    style={{ textTransform: "uppercase" }}
                  >
                    {curNews.news}
                  </div>
                  <div className="flex justify-between w-full px-4 mt-2">
                    <div>{curNews.time1}</div>
                    <div>{curNews.code}</div>
                    <div>{curNews.time2}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Games Section */}
        <div className="flex flex-col items-center mt-6 w-full max-w-5xl">
          <div className="flex justify-center w-full mb-4">
            <div className="flex flex-col items-center border border-red-600 p-4 rounded-lg">
              <div className="text-black font-bold text-lg md:text-xl">
                FUN KALYAN
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex flex-row justify-center space-x-4 w-full">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
              onClick={handlegames}
            >
              GAMES
            </button>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
              onClick={handleLogout}
            >
              LogOut
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointTransferUI;
