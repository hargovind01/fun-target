import React from "react";
import { useAuth } from "../../../store/auth";
import { useState } from "react";
import { useEffect } from "react";
const AdminTransaction = () => {

    const [transactions,setTransactions] = useState([]);
    

    const { authorizationToken } = useAuth();
    
    const getAllTransaction = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/transaction/enquries", {
            method: "GET",
            headers: {
              Authorization: authorizationToken,
            },
          });
          const data = await response.json();
          setTransactions(data);
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
        getAllTransaction();
      }, []);

  return (
    <section className="admin-user-section py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          Transaction Details
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Sender Name</th>
                <th className="py-3 px-6">Reciever Name</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">time</th>
                <th className="py-3 px-6">amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {transactions.map((curTransactions, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  <td className="py-3 px-6">{curTransactions.sendername}</td>
                  <td className="py-3 px-6">{curTransactions.recievername}</td>
                  <td className="py-3 px-6">{curTransactions.date}</td>
                  <td className="py-3 px-6">{curTransactions.time}</td>
                  <td className="py-3 px-6">{curTransactions.amount}</td>
                    
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminTransaction;
