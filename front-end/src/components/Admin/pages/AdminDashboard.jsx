import React, { useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../../store/auth";
import img1 from "../../../assets/GlobeIMG/Lota.png";
import img2 from "../../../assets/GlobeIMG/1.png";
import img3 from "../../../assets/GlobeIMG/2.png";
import img4 from "../../../assets/GlobeIMG/3.png";
import img5 from "../../../assets/GlobeIMG/1.png";

const socket = io("http://localhost:8000");

const AdminDashboard = () => {
  const { timeLeft, updateMode } = useAuth();
  const [activeManualButtons, setActiveManualButtons] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [setMode, setSetMode] = useState("1");

  const images = [img1, img2, img3, img4, img5];

  // Handle manual result selection
  const toggleButton = (num) => {
    setActiveManualButtons([num]); // Allow only one button to be active
    socket.emit("manualResult", num); // Send the selected result to backend
  };

  const handleSetModeChange = (mode) => {
    setSetMode(mode);
    updateMode(mode); // Update the global state
    socket.emit("modeChange", mode); // Notify the server of the change
  };
  

  const renderButtons = (activeButtons) =>
    [...Array(10).keys()].map((num) => (
      <button
        key={num}
        className={`flex items-center justify-center font-bold text-lg h-12 rounded ${
          activeButtons.includes(num)
            ? "bg-green-500 text-white"
            : "bg-white border border-gray-300 text-black"
        }`}
        onClick={() => toggleButton(num)}
      >
        {num}
      </button>
    ));

  return (
    <div>
      {/* Timer Section */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold">Global Timer: {timeLeft}s</h2>
      </section>

      {/* Declare Result Manually Section */}
      <section className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Declare Result Manually</h2>
        <div className="grid grid-cols-5 gap-4">
          {renderButtons(activeManualButtons)}
        </div>
      </section>

      {/* Set Mode Section */}
      <section className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Set Mode</h2>
        <div className="flex gap-4">
          {["1", "2"].map((mode) => (
            <button
              key={mode}
              className={`p-2 rounded border ${
                setMode === mode
                  ? "bg-blue-500 text-white"
                  : "bg-white border-gray-300"
              }`}
              onClick={() => handleSetModeChange(mode)}
            >
              {mode}x
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
