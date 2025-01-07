import React, { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoGameController } from "react-icons/io5";
import { useAuth } from "../../../store/auth";
import { useNavigate } from "react-router-dom";
import { GrTransaction } from "react-icons/gr";
import { FaRegNewspaper } from "react-icons/fa";
import { PiNewspaperClippingBold } from "react-icons/pi";
const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User object:", user);

    if (!isLoading && !user?.userData?.is_Admin) {
      console.log("Access Denied: User is not an admin:", user?.userData?.is_Admin);
      navigate("/admin/access-denied");
    }
  }, [isLoading, user?.userData?.is_Admin, navigate]);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!user?.userData?.is_Admin) {
    return <h1>Access Denied</h1>;
  }

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 mt-4">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <FaUser className="mr-2" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/roles"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <FaUser className="mr-2" /> Role
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <MdManageAccounts className="mr-2" /> Manage User
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/game-history"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <IoGameController className="mr-2" /> Game History
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/register"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <IoGameController className="mr-2" /> Register Player
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/transaction"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <GrTransaction className="mr-2" /> Transaction History
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/news"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <FaRegNewspaper className="mr-2" />News
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/createNews"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium hover:bg-gray-700 rounded-md ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                <PiNewspaperClippingBold className="mr-2" />Add News
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow p-4">
          <h2 className="text-xl font-semibold">Dashboard</h2>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
