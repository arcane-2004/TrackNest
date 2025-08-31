import { Route, Routes } from "react-router-dom"
import Login from "./pages/UserSigninSignup"
import ForgetPassword from "./pages/ForgetPassword"
import { OtpVerify } from "./pages/OtpVerify"

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forget/password" element={<ForgetPassword/>} />
        <Route path="/otp/verify" element={<OtpVerify />} />
      </Routes>
    </>
  )
}

export default App
