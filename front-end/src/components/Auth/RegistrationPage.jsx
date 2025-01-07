import React, { useState } from "react";
import { useAuth } from "../../store/auth";
import { useNavigate } from "react-router-dom";

function RegistrationPage() {
  const[users, setUser]=useState({
    username:"",
    phone:"",
    password:"",
  });
  
  const { user, isLoading, authorizationToken } = useAuth();
  const navigate = useNavigate();

  if(isLoading){
    return <h1>Loading...</h1>
  }
  if(user.is_Admin){
    navigate("/")
  }

  console.log("admin layout",user);
  



  const {storeTokenInLS} = useAuth();


  const handleInput =(e)=>{
    console.log(e);
    let name = e.target.name;
    let value = e.target.value

    setUser({
      ...users,
      [name]:value,
    });
  };

  const handleCancelBtn = () =>{
    navigate("/admin")
  }

  const handleSubmit = async(e) =>{
    e.preventDefault();
    // alert(user);
    console.log(users)
    try {
      const response = await fetch('http://localhost:8000/api/auth/register',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(users),
      });

      const res_data = await response.json();
      console.log("res from server",res_data);
      
      if(response.ok){
        if(!authorizationToken) 
        {
          storeTokenInLS(res_data.token);
        }

        setUser({
          username:"",
          phone:"",
          password:""
        })
        console.log("time to navigate");
        navigate("/admin/users")
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
        <h2 className="text-xl md:text-3xl font-bold text-center mt-16 text-green-400 uppercase">
          Join the Better Side of Reality
        </h2>

        {/* Form */}
        <div className="mt-8">
          {/* Username Field */}
          <label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            Username
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Your Username"
            type="text"
            name="username"
            id="username"
            required
            autoComplete="off"
            value={users.username}
            onChange={handleInput}
          />

          {/* Email Field */}
          <label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            Phone
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Your Phone number"
            type="number"
            name="phone"
            id="phone"
            required
            autoComplete="off"
            value={users.phone}
            onChange={handleInput}
          />

          {/* Password Field */}
          <label className="text-green-300 text-sm md:text-lg font-semibold mb-1 block">
            Password
          </label>
          <input
            className="w-full px-3 py-2 mb-4 bg-gray-900 text-white rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Your Password"
            type="password"
            name="password"
            id="password"
            required
            autoComplete="off"
            value={users.password}
            onChange={handleInput}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 md:mt-8 gap-4 md:gap-8">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 md:py-2 md:px-6 rounded transition duration-300">
            Register
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

export default RegistrationPage;
