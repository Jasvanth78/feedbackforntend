import React from 'react'
import Card from './Card'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUsers } from "react-icons/fa6";
export default function Home() {
  const [templates, setTemplates] = useState([]) 
  const [responses, setResponses] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null')
    setUser(storedUser)
    fetchData(storedUser)
  }, [])

  const fetchData = async (currentUser) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      
      if (currentUser?.role === 'ADMIN') {
        
        const [templatesRes, responsesRes] = await Promise.all([
          axios.get(`${API_URL}/api/feedback/templates`, { headers }),
          axios.get(`${API_URL}/api/feedback/responses`, { headers })
        ])
        setTemplates(templatesRes.data || [])
        setResponses(responsesRes.data || [])
      } else {
        
        const templatesRes = await axios.get(`${API_URL}/api/feedback/active`, { headers })
        setTemplates(templatesRes.data || [])
      }
    } catch (err) {
      console.error('fetch data error', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResponse = async (templateId, answer, rating) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `${API_URL}/api/feedback/submit`,
        { templateId, answer, rating },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      toast.success('Feedback submitted successfully!')
      fetchData(user)
    } catch (error) {
      const msg = error?.response?.data?.error || 'Failed to submit feedback'
      toast.error(msg)
    }
  }

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm('Delete this feedback template?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_URL}/api/feedback/templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Template deleted')
      fetchData(user)
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-blue-400">
              {user?.role === 'ADMIN' ? 'Feedback Management' : 'Feedback Forms'}
            </h2>
            {user?.role === 'ADMIN' && (
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg font-medium"
                  onClick={() => navigate('/user-management')}
                >
                   <FaUsers className="inline mr-2" /> Manage Users
                </button>
                <button 
                  className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg font-medium"
                  onClick={() => navigate('/create-feedback')}
                >
                  + Create Feedback Template
                </button>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-purple-200 text-xl">Loading...</p>
          </div>
        ) : (
          <>
            {user?.role === 'ADMIN' ? (
              <AdminView 
                templates={templates} 
                responses={responses}
                onDelete={handleDeleteTemplate}
              />
            ) : (
              <UserView 
                templates={templates}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}


function AdminView({ templates, responses, onDelete }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Feedback Templates ({templates.length})
        </h3>
        {templates.length === 0 ? (
          <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg p-8 text-center">
            <p className="text-purple-200">No templates yet. Create your first feedback template!</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg p-6 hover:bg-slate-800/80 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white">{template.title}</h4>
                    <p className="text-purple-200 mt-2 whitespace-pre-wrap">{template.question}</p>
                    <div className="mt-3 inline-block px-3 py-1 bg-purple-600/30 border border-purple-400/40 rounded-full">
                      <p className="text-sm text-purple-200">
                        Responses: {template._count?.responses || 0}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(template.id)}
                    className="ml-4 px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-4">
          User Responses ({responses.length})
        </h3>
        {responses.length === 0 ? (
          <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg p-8 text-center">
            <p className="text-purple-200">No responses yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {responses.map((response) => (
              <div key={response.id} className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg p-6 hover:bg-slate-800/80 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-xl text-white">{response.template?.title}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-lg">{'⭐'.repeat(response.rating)}</span>
                    <span className="text-purple-200 text-sm ml-1">({response.rating}/5)</span>
                  </div>
                </div>
                <p className="text-sm text-purple-200 mb-3 italic whitespace-pre-wrap">{response.template?.question}</p>
                <div className="bg-slate-700/40 border border-purple-400/20 rounded-lg p-4">
                  <p className="text-white whitespace-pre-wrap">{response.answer}</p>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-600/30 border border-purple-400/40 rounded-full text-sm text-purple-200">
                    👤 {response.user?.name || response.user?.email}
                  </span>
                  <span className="text-xs text-purple-300">
                    📅 {new Date(response.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


function UserView({ templates }) {
  const navigate = useNavigate()

  return (
    <div>
      {templates.length === 0 ? (
        <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg p-12 text-center">
          <p className="text-purple-200 text-lg mb-2">No feedback forms available yet</p>
          <p className="text-sm text-purple-300">Check back later!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => {
            const questions = template.question.split('\n\n').filter(q => q.trim())
            
            return (
              <div 
                key={template.id} 
                className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-lg p-6 hover:bg-slate-800/80 hover:border-purple-400/50 transition-all cursor-pointer group transform hover:scale-[1.02]"
                onClick={() => navigate(`/feedback/${template.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-blue-400">
                    {template.title}
                  </h3>
                  <div className="px-3 py-1 bg-purple-600/30 border border-purple-400/40 rounded-full text-xs text-purple-200 whitespace-nowrap">
                    {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-purple-200 text-sm line-clamp-3">
                    {questions[0]}
                    {questions.length > 1 && <span className="text-purple-300 ml-1">...</span>}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-500/20">
                  <span className="text-purple-300 text-sm font-medium">Click to fill out</span>
                  <svg 
                    className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
