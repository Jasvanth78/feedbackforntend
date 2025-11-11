import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUsers(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
      setLoading(false)
    }
  }

  const handlePromoteToAdmin = async (userId) => {
    if (!window.confirm('Are you sure you want to promote this user to ADMIN?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/users/${userId}/role`,
        { role: 'ADMIN' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('User promoted to ADMIN successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error(error.response?.data?.error || 'Failed to promote user')
    }
  }

  const handleDemoteToUser = async (userId) => {
    if (!window.confirm('Are you sure you want to demote this admin to USER?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/users/${userId}/role`,
        { role: 'USER' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success('Admin demoted to USER successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error demoting user:', error)
      toast.error(error.response?.data?.error || 'Failed to demote user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error.response?.data?.error || 'Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 mb-2">
            User Management
          </h1>
          <p className="text-purple-200">Manage user roles and permissions</p>
        </div>

        <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/40 border-b border-purple-500/20">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Responses</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-500/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-white">
                      {user.name}
                      {user.id === currentUser.id && (
                        <span className="ml-2 text-xs bg-purple-600/40 border border-purple-400/40 text-purple-200 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-purple-200">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === 'ADMIN'
                            ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white'
                            : 'bg-linear-to-r from-blue-500 to-cyan-500 text-white'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-purple-200">{user._count.feedbackResponses}</td>
                    <td className="px-6 py-4 text-purple-200">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.id !== currentUser.id && (
                          <>
                            {user.role === 'USER' ? (
                              <button
                                onClick={() => handlePromoteToAdmin(user.id)}
                                className="px-3 py-1 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm rounded-lg transition-all transform hover:scale-105 shadow-lg"
                              >
                                Promote to Admin
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDemoteToUser(user.id)}
                                className="px-3 py-1 bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white text-sm rounded-lg transition-all transform hover:scale-105 shadow-lg"
                              >
                                Demote to User
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-3 py-1 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white text-sm rounded-lg transition-all transform hover:scale-105 shadow-lg"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-12 text-purple-200">
              No users found
            </div>
          )}
        </div>

        <div className="mt-6 bg-slate-800/40 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
          <p className="text-purple-200 text-sm">
            <strong className="text-white">Total Users:</strong> {users.length} | 
            <strong className="text-white ml-3">Admins:</strong> {users.filter(u => u.role === 'ADMIN').length} | 
            <strong className="text-white ml-3">Regular Users:</strong> {users.filter(u => u.role === 'USER').length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserManagement
