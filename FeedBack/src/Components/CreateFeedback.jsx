import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function CreateFeedbackTemplate() {
  const [formData, setFormData] = useState({
    title: '',
    question: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title || !formData.question) {
      toast.error('Title and question are required')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:3000/api/feedback/templates',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      
      toast.success('Feedback template created successfully!')
      navigate('/Home')
    } catch (error) {
      console.error('Create template error:', error)
      const msg = error?.response?.data?.error || error?.message || 'Failed to create template'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Create Feedback Template</h1>
          <p className="text-slate-600 mb-6">Create a new feedback question that users can respond to</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="title">
                Feedback Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 text-lg"
                placeholder="e.g., Course Satisfaction Survey"
              />
              <p className="text-xs text-slate-500 mt-1">Give your feedback a descriptive title</p>
            </div>

            <div className="mb-6">
              <label className="block text-slate-700 text-sm font-medium mb-2" htmlFor="question">
                Question *
              </label>
              <textarea
                id="question"
                name="question"
                required
                value={formData.question}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:border-blue-600 text-lg"
                placeholder="e.g., How satisfied are you with the course content and delivery?"
              ></textarea>
              <p className="text-xs text-slate-500 mt-1">The question users will answer</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">📝 How it works:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Users will see this feedback template on their Home page</li>
                <li>• They can submit their answers and ratings</li>
                <li>• You'll be able to view all responses in the admin dashboard</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Creating...' : 'Create Template'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/Home')}
                className="flex-1 bg-slate-500 text-white py-3 px-4 rounded-md hover:bg-slate-600 focus:outline-none font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
