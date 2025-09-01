import { Route, Routes } from "react-router-dom"
import Login from "./pages/UserSigninSignup"
import ForgetPassword from "./pages/ForgetPassword"
import VerifyOTP from "./pages/VerifyOTP"
import UpdatePassword from "./pages/UpdatePassword"

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forget/password" element={<ForgetPassword/>} />
        <Route path="/verify/otp" element={<VerifyOTP/>} />
        <Route path="/update/password" element={<UpdatePassword />} />
      </Routes>
    </>
  )
}

export default App

