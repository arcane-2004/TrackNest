import { Route, Routes } from "react-router-dom"
import Login from "./pages/UserSigninSignup"
import ForgetPassword from "./pages/ForgetPassword"
import VerifyOTP from "./pages/VerifyOTP"
import UpdatePassword from "./pages/UpdatePassword"
import Dashboard from "./pages/Dashboard"
import Super from "./components/Super"
import GettingStarted from "./pages/GettingStarted"
import Transactions from "./pages/Transactions"
import Accounts from "./pages/Accounts"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<GettingStarted/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget/password" element={<ForgetPassword />} />
        <Route path="/verify/otp" element={<VerifyOTP />} />
        <Route path="/transactions" element={<Transactions/>}/>
        <Route path="/accounts" element={<Accounts/>}/>
        <Route element={<Super />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update/password" element={<UpdatePassword />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

