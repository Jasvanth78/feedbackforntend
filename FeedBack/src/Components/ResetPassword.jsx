
import { useState} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const id = searchParams.get('id');
  const [password, setPassword] = useState('');
  const API = 'http://localhost:3000/api';

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/reset-password`, { userId: id, token, newPassword: password });
      toast.success('Password reset, please login');
      navigate('/');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reset password');
    }
  };

  if (!token || !id) {
    return <p>Invalid link</p>;
  }

  return (
    <form onSubmit={submit}>
      <label>New password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" />
      <button type="submit">Reset password</button>
    </form>
  );
}