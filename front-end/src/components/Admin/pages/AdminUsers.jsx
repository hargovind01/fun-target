import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/auth";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import { CiSquarePlus, CiSquareMinus } from "react-icons/ci";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [transaction,setTransaction] = useState({
    sendername:"",
    recievername:"",
    date:"",
    time:"",
    amount:""
  });

  const { user,authorizationToken } = useAuth();

  const getAllUsersData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users", {
        method: "GET",
        headers: {
          Authorization: authorizationToken,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/user/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      if (response.ok) {
        getAllUsersData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserPoints = async (id, newPoints, transactionData) => {
    try {
      // Update user points
      const response = await fetch(
        `http://localhost:8000/api/admin/user/update-points/${id}`,
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
        // Record transaction
        const transactionResponse = await fetch(
          "http://localhost:8000/api/transaction/entries",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
          }
        );
  
        if (transactionResponse.ok) {
          console.log("Transaction recorded successfully");
        } else {
          console.error("Failed to record transaction");
        }
  
        // Refresh user data
        getAllUsersData();
      } else {
        console.error("Failed to update user points");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleIncrement = (username, id, currentPoints) => {
    const newPoints = currentPoints + 100;
    const currentDate = new Date();
  
    const transactionData = {
      sendername: user.userData.username,
      recievername: username,
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
      amount: "+100",
    };
  
    updateUserPoints(id, newPoints, transactionData);
  };
  
  const handleDecrement = (username, id, currentPoints) => {
    if (currentPoints > 0) {
      const newPoints = currentPoints - 100;
      const currentDate = new Date();
  
      const transactionData = {
        sendername: user.userData.username,
        recievername: username,
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
        amount: "-100",
      };
  
      updateUserPoints(id, newPoints, transactionData);
    }
  };
  useEffect(() => {
    getAllUsersData();
  }, []);

  return (
    <section className="admin-user-section py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Players Data
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Points</th>
                <th className="py-3 px-6">Winning History</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6">Update</th>
                <th className="py-3 px-6">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {users.map((curUser, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <td className="py-3 px-6">{curUser.username}</td>
                  <td className="py-3 px-6">{curUser.phone}</td>
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() =>
                          handleDecrement(curUser.username,curUser._id, curUser.point)
                        }
                      >
                        <CiSquareMinus />
                      </button>
                      <span>{curUser.point}</span>
                      <button
                        className="text-green-500 hover:text-green-700"
                        onClick={() =>
                          handleIncrement(curUser.username,curUser._id, curUser.point)
                        }
                      >
                        <CiSquarePlus />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-6">{curUser.winning_history}</td>
                  <td className="py-3 px-6">{curUser.amount}</td>

                  {!curUser.is_Master ? (
                    <>
                      <td className="py-3 px-6 text-center">
                        <Link to={`/admin/users/${curUser._id}/edit`}>
                          <GrUpdate />
                        </Link>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteUser(curUser._id)}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminUsers;
