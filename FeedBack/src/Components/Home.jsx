import React from 'react'
import Card from './Card'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Home() {
  const [templates, setTemplates] = useState([]) 
  const [responses, setResponses] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

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
        // Admin sees templates and all responses
        const [templatesRes, responsesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/feedback/templates', { headers }),
          axios.get('http://localhost:3000/api/feedback/responses', { headers })
        ])
        setTemplates(templatesRes.data || [])
        setResponses(responsesRes.data || [])
      } else {
        // Users see active templates
        const templatesRes = await axios.get('http://localhost:3000/api/feedback/active', { headers })
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
        'http://localhost:3000/api/feedback/submit',
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
      await axios.delete(`http://localhost:3000/api/feedback/templates/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success('Template deleted')
      fetchData(user)
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">
            {user?.role === 'ADMIN' ? 'Feedback Management' : 'Feedback Forms'}
          </h2>
          {user?.role === 'ADMIN' && (
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              onClick={() => navigate('/create-feedback')}
            >
              + Create Feedback Template
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
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
                onSubmit={handleSubmitResponse}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Admin View Component
function AdminView({ templates, responses, onDelete }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-700 mb-4">Feedback Templates ({templates.length})</h3>
        {templates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-slate-500">
            No templates yet. Create your first feedback template!
          </div>
        ) : (
          <div className="grid gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-800">{template.title}</h4>
                    <p className="text-slate-600 mt-2">{template.question}</p>
                    <p className="text-sm text-slate-500 mt-3">
                      Responses: {template._count?.responses || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => onDelete(template.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
        <h3 className="text-xl font-bold text-slate-700 mb-4">User Responses ({responses.length})</h3>
        {responses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-slate-500">
            No responses yet
          </div>
        ) : (
          <div className="grid gap-4">
            {responses.map((response) => (
              <div key={response.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-800">{response.template?.title}</h4>
                  <span className="text-yellow-500">{'⭐'.repeat(response.rating)}</span>
                </div>
                <p className="text-sm text-slate-600 mb-2">{response.template?.question}</p>
                <p className="text-slate-800 bg-slate-50 p-3 rounded">{response.answer}</p>
                <p className="text-xs text-slate-500 mt-2">
                  By {response.user?.name || response.user?.email} • {new Date(response.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// User View Component
function UserView({ templates, onSubmit }) {
  const [answers, setAnswers] = useState({})
  const [ratings, setRatings] = useState({})

  const handleSubmit = (templateId) => {
    const answer = answers[templateId]
    const rating = ratings[templateId] || 5
    
    if (!answer?.trim()) {
      toast.error('Please provide an answer')
      return
    }

    onSubmit(templateId, answer, rating)
    setAnswers(prev => ({ ...prev, [templateId]: '' }))
    setRatings(prev => ({ ...prev, [templateId]: 5 }))
  }

  return (
    <div>
      {templates.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-slate-600 mb-2">No feedback forms available yet</p>
          <p className="text-sm text-slate-500">Check back later!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-3">{template.title}</h3>
              <p className="text-slate-700 mb-4 text-lg">{template.question}</p>
              
              <textarea
                value={answers[template.id] || ''}
                onChange={(e) => setAnswers(prev => ({ ...prev, [template.id]: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-900 rounded-md focus:outline-none focus:border-blue-600 mb-4"
                rows="4"
                placeholder="Type your answer here..."
              ></textarea>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating: {ratings[template.id] || 5} / 5
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={ratings[template.id] || 5}
                  onChange={(e) => setRatings(prev => ({ ...prev, [template.id]: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1 - Poor</span>
                  <span>5 - Excellent</span>
                </div>
              </div>
              
              <button
                onClick={() => handleSubmit(template.id)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                Submit Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}