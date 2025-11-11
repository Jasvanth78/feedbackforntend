import './App.css'
import Login from './Components/Login'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import ForgotPassword from './Components/ForgotPassword'
import ResetPassword from './Components/ResetPassword'
import CreateFeedback from './Components/CreateFeedback'
import UserManagement from './Components/UserManagement'
import FeedbackDetail from './Components/FeedbackDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/create-feedback" element={<CreateFeedback />} />
      <Route path="/user-management" element={<UserManagement />} />
      <Route path="/feedback/:templateId" element={<FeedbackDetail />} />
    </Routes>
  )
}

export default App
