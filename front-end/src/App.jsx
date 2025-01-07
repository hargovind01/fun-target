import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css'
import Home from './components/Home/Home'
import GameUI from './components/GameUI/GameUI'
import LoginPage from './components/Auth/LoginPage'
import RegistrationPage from './components/Auth/RegistrationPage'
import PointTransferUI from "./components/GameUI/PointTransferUI"
import AdminLayout from "./components/Admin/layouts/AdminLayout"
import AdminUsers from "./components/Admin/pages/AdminUsers"
import AdminRoles from "./components/Admin/pages/AdminRoles"
import AdminDashboard from "./components/Admin/pages/AdminDashboard"
import AdminGameHistory from "./components/Admin/pages/AdminGameHistory"
import ErrorPage from "./components/ErrorPage"
import AdminUpdate from "./components/Admin/pages/AdminUpdate"
import AdminTransaction from "./components/Admin/pages/AdminTransaction"
import AdminNews from "./components/Admin/pages/AdminNews"
import AdminCreateNews from"./components/Admin/pages/AdminCreateNews"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/register" element={<RegistrationPage />} /> */}
          <Route path="/panel"element={<PointTransferUI/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/admin" element={<AdminLayout />} >
              <Route path="dashboard" element={<AdminDashboard/>} />
              <Route path="roles" element={<AdminRoles/>} />
              <Route path="users" element={<AdminUsers />}/>
              <Route path="game-history" element={<AdminGameHistory/>} />
              <Route path="register" element={<RegistrationPage/>} />
              <Route path="users/:id/edit" element={<AdminUpdate/>}/>
              <Route path="transaction" element={<AdminTransaction/>}/>
              <Route path="news" element={<AdminNews/>}/>
              <Route path="createNews" element={<AdminCreateNews/>}/>
          </Route>
          <Route path="/game" element={<GameUI/>}/>
          <Route path="*" element={<ErrorPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
