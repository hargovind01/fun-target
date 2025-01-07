import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import logo from "../../assets/login_img.png";
import servicesLogo from "../../assets/DP_Services.png"; // Add your services logo here

function LoginPage() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { storeTokenInLS } = useAuth();

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("USER:",user)
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const res_data = await response.json();
        storeTokenInLS(res_data.token);

        alert("Login successful");
        setUser({
          username: "",
          password: "",
        });
        navigate("/panel");
      } else {
        alert("INVALID CREDENTIALS");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
<div
    className="h-screen w-full bg-cover bg-center relative"
    style={{ backgroundColor: "#FFCC99" }}
  >
    {/* Top Section */}
    <div className="flex items-center p-4 space-x-8">
      {/* Main Logo */}
      <img
        src={logo}
        alt="Main Logo"
        className="w-64 h-64 md:w-80 md:h-80 object-contain"
      />

      {/* Services Logo */}
      <img
        src={servicesLogo}
        alt="Services Logo"
        className="w-full h-auto md:h-40 object-contain"
      />
    </div>

    {/* Title Section */}
    <div className="bg-gradient-to-b from-orange-300 to-orange-200 border-2 border-red-600 rounded-lg mx-4 p-4 text-center">
      <div className="text-black font-bold text-lg mb-2">
        Satta Matka DPBOSS Kalyan Matka Result
      </div>
      <p className="text-black text-sm leading-relaxed">
        DPBOSS.Service is the No. 1 Matka Sites welcomes you full-heartedly.
        Here below you can find the perfect guess by the top guesser along
        with the Fast Matka Result too. Aaj Ka Satta Kalyan Fix Single Jodi
        free update here you find top Matka Market of India Kalyan Main Milan
        Rajdhani* *kalyan Matka Tips *fast Matka Result *kalyan Main Rajdhani
        Matka Chart *Matka Guessing by DPBOSS By App Best Matka Site By DPBOSS
      </p>
    </div>
    <br/>
    {/* Bottom Section */}
    <div className="absolute bottom-4 left-4 flex items-center">
      {/* Login Section */}
      <div className="bg-pink-500 p-6 w-72 md:w-96 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-4 uppercase">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleInput}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleInput}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </form>
      </div>

      {/* Enter Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        className="ml-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded shadow-lg transition duration-300"
      >
        Enter
      </button>
    </div>
  </div>
  );
}

export default LoginPage;
