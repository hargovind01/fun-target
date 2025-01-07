import React, { useEffect, useState } from "react";
import { useAuth } from "../../../store/auth";
import { MdDelete } from "react-icons/md";

const AdminRoles = () => {
  const [users, setUsers] = useState([]);
  const { authorizationToken } = useAuth();
  

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

  const updateUserRole = async (id, newRole) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/admin/user/update/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: authorizationToken,
          },
          body: JSON.stringify({
            is_Admin: newRole === "Admin",
          }),
        }
      );

      if (response.ok) {
        getAllUsersData();
      } else {
        console.error("Failed to update user role");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsersData();
  }, []);

  return (
    <section className="admin-user-section py-8 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6 text-gray-700">
          User Roles
        </h1>
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">Username</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Update Role</th>
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
                  <td className="py-3 px-6">
                    {curUser.is_Admin
                      ? curUser.is_Master
                        ? "Master"
                        : "Admin"
                      : "Player"}
                  </td>
                  {!curUser.is_Master ? (
                    <>
                      <td className="py-3 px-6">
                        <select
                          className="border rounded-md p-2 text-sm"
                          value={curUser.is_Admin ? "Admin" : "Player"}
                          onChange={(e) =>
                            updateUserRole(curUser._id, e.target.value)
                          }
                        >
                          <option value="Player">Player</option>
                          <option value="Admin">Admin</option>
                        </select>
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

export default AdminRoles;
