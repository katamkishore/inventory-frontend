import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import OTPVerification from './pages/OTPVerification/OTPVerification'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import DashboardLayout from './components/DashboardLayout/DashboardLayout'
import Home from './pages/Home/Home'
import Product from './pages/Product/Product'
import AddProduct from './pages/Product/AddProduct'
import Invoice from './pages/Invoice/Invoice'
import Statistics from './pages/Statistics/Statistics'
import Setting from './pages/Setting/Setting'

function App() {
  const { user } = useAuth()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? '/home' : '/login'} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/home" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/add" element={<AddProduct />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
