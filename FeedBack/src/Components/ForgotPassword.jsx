import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const API = `${import.meta.env.VITE_BASE_URL}/api`

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      await axios.post(`${API}/forgot-password`, { email })
      toast.info('If that email exists, you will receive a reset link')
      navigate('/')
    }catch(err){
      console.error(err)
      toast.error('Server error')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Forgot password</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded mb-4" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Send reset link</button>
        </form>
      </div>
    </div>
  )
}
