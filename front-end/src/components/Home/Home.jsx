import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/DP.png'; // Import the image
import service_logo from "../../assets/DP_Services.png";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // Redirect to the login page after 10 seconds
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [navigate]);

  return (
    <>
      <div
        className="flex flex-col items-center justify-center min-h-screen min-w-screen"
        style={{ backgroundColor: '#FFCC99' }} // Using a solid background color
      >
        {/* Logo Section */}
        <div className="relative w-64 h-64 bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center">
          {/* Inner Circle */}
          <div className="w-52 h-52 bg-white rounded-full shadow-inner flex items-center justify-center overflow-hidden">
            {/* Logo */}
            <img
              src={logo} // Use the imported image
              alt="Funrep Logo"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Outer Decorations */}
          <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" />
        </div>

        {/* Service Logo */}
        <div className="mt-4">
          <img src={service_logo} alt="Service Logo" className="w-48" />
        </div>

        {/* Disclaimer Scrolling Text */}
        <div className="w-full mt-6 overflow-hidden whitespace-nowrap">
          <p className="text-md font-bold text-black animate-marquee">
          यह वेबसाइट केवल 18 वर्ष और उससे अधिक आयु के उपयोगकर्ताओं के लिए है। यदि आपकी आयु 18 वर्ष से कम है, तो कृपया इस वेबसाइट का उपयोग न करें। इस वेबसाइट पर उपलब्ध सभी सामग्री केवल सूचना और मनोरंजन के उद्देश्य से है। 
          </p>
        </div>
      </div>

      {/* CSS Styles */}
      <style>
        {`
          .animate-marquee {
            display: inline-block;
            animation: marquee 15s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
        `}
      </style>
    </>
  );
}

export default Home;
