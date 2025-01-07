import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/auth";
import { MdDelete } from "react-icons/md";

const AdminNews = () => {
  const [news, setNews] = useState([]);

  const { user,authorizationToken } = useAuth();

  const getAllNews = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/news/newsInfo", {
            method: "GET",
            headers: {
                Authorization: authorizationToken,
            },
        });

        const data = await response.json();
        console.log(data)
        // Ensure 'news' is an array before updating state
        if (Array.isArray(data.news)) {
            setNews(data.news);
        } else {
            console.error("Invalid news format received:", data);
            setNews([]); // Fallback to an empty array
        }
    } catch (error) {
        console.log("Error fetching news:", error);
        setNews([]); // Fallback to an empty array
    }
};


  const deleteNews = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/news/deleteNews/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.ok) {
        getAllNews();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllNews();
  }, []);

  return (
    <section className="admin-user-section py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          News Data
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Start Time</th>
                <th className="py-3 px-6">News</th>
                <th className="py-3 px-6">End Time</th>
                <th className="py-3 px-6">Date of Post</th>
                <th className="py-3 px-6">Time of Post</th>
                <th className="py-3 px-6">News Editor</th>
                <th className="py-3 px-6">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {news.map((curNews, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <td className="py-3 px-6">{curNews.time1}</td>
                  <td className="py-3 px-6">{curNews.news}</td>
                  <td className="py-3 px-6">{curNews.time2}</td>
                  <td className="py-3 px-6">{curNews.date_of_post}</td>
                  <td className="py-3 px-6">{curNews.time_of_post}</td>
                  <td className="py-3 px-6">{curNews.news_editor}</td>
                      <td className="py-3 px-6 text-center">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteNews(curNews._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminNews;
