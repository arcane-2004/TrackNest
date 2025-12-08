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
import Category from "./pages/Category"
import AccountViewPage from "./pages/AccountViewPage"
import PageNotFound from "./pages/PageNotFound"
import Budget from "./pages/Budget"
import Analysis from "./pages/Analysis"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<GettingStarted/>} />
        <Route path="/*" element={<PageNotFound/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget/password" element={<ForgetPassword />} />
        <Route path="/verify/otp" element={<VerifyOTP />} />
        <Route path="/transactions" element={<Transactions/>}/>
        <Route path="/accounts" element={<Accounts/>}/>
        <Route path="/category" element={<Category/>}/>
        <Route path="/account/:id" element={<AccountViewPage/>} />
        <Route element={<Super />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update/password" element={<UpdatePassword />} />
        </Route>
        <Route path="/budget" element={<Budget/>} />
        <Route path="/analysis" element={<Analysis/>} />
      </Routes>
    </>
  )
}

export default App

