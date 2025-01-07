import React, { useState } from "react";
import { useAuth } from "../../../store/auth";
import { useNavigate } from "react-router-dom";

function AdminCreateNews() {
    const { user, isLoading, authorizationToken } = useAuth();
    const navigate = useNavigate();

  const[news, setNews]=useState({
    time1:"",
    news:"",
    code:"",
    time2:"",
    date_of_post:"",
    time_of_post:"",
    news_editor:""
  });
  

  if(isLoading){
    return <h1>Loading...</h1>
  }
  if(user.is_Admin){
    navigate("/")
  }

  const {storeTokenInLS} = useAuth();


  const handleInput =(e)=>{
    console.log(e);
    let name = e.target.name;
    let value = e.target.value

    setNews({
      ...news,
      [name]:value,
    });
  };

  const handleCancelBtn = () =>{
    navigate("/admin")
  }

  const handleSubmit = async(e) =>{
    
    e.preventDefault();
    // alert(user);
    const payload = {
        ...news,
        time_of_post: new Date().toLocaleTimeString(),
        date_of_post: new Date().toLocaleDateString(),
        news_editor: user.userData.username,
    };

    try {
        const response = await fetch('http://localhost:8000/api/news/createNews', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload), // Use the updated payload here
        });
      const res_data = await response.json();
      console.log("res from server",res_data);
      
      if(response.ok){
        if(!authorizationToken) 
        {
          storeTokenInLS(res_data.token);
        }

        setNews({
            time1:"",
            news:"",
            code:"",
            time2:"",
            date_of_post:"",
            time_of_post:"",
            news_editor:""
        })
        console.log("time to navigate");
        navigate("/admin")
      }
      else{
        alert(res_data.extraDetails)
      }
  
      // console.log(response)
    } catch (error) {
      console.log("register",error);
      
    }
    
  };



  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/random/1920x1080/?galaxy,space')",
      }}
    >
      {/* Outer Container */}
      <div className="relative w-full max-w-4xl bg-opacity-90 p-6 md:p-8 rounded-lg shadow-lg backdrop-blur-lg">
        {/* Sword and Logo */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <img
            src="https://via.placeholder.com/200" // Replace with your shield image
            alt="Logo"
            className="w-24 h-24 md:w-36 md:h-36"
          />
        </div>

        {/* Title */}
        <form onSubmit={handleSubmit}>
        {/* Form */}
        <div className="mt-8">
          {/* Username Field */}
          <label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            News
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="News"
            type="text"
            name="news"
            id="news"
            required
            autoComplete="off"
            value={news.news}
            onChange={handleInput}
          />

          {/* Email Field */}
          <label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            Start Time
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Your Phone number"
            type="time"
            name="time1"
            id="time1"
            required
            autoComplete="off"
            value={news.time1}
            onChange={handleInput}
          />

          {/* Password Field */}
          <label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            End Time
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Code"
           type="time"
            name="time2"
            id="time2"
            required
            autoComplete="off"
            value={news.time2}
            onChange={handleInput}
          />

<label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            Code
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Code"
            type="string"
            name="code"
            id="code"
            required
            autoComplete="off"
            value={news.code}
            onChange={handleInput}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 md:mt-8 gap-4 md:gap-8">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 md:py-2 md:px-6 rounded transition duration-300">
            Add News
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 md:py-2 md:px-6 rounded transition duration-300" onClick={handleCancelBtn}>
            Cancel
          </button>
        </div>
        </form>
        {/* Character Illustration */}
        <div className="absolute bottom-4 left-2 md:left-4">
          <img
            src="https://via.placeholder.com/150" // Replace with the illustrated character image
            alt="Character"
            className="w-16 md:w-24"
          />
        </div>

        {/* Decorative Shield */}
        <div className="absolute bottom-4 right-2 md:right-4">
          <img
            src="https://via.placeholder.com/150" // Replace with decorative shield image
            alt="Shield"
            className="w-16 md:w-20"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminCreateNews;
