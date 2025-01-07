import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-red-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            Go Back Home
          </a>
        </div>
        <img
          src="https://via.placeholder.com/400x300"
          alt="Error illustration"
          className="mt-8 w-full h-auto"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
