import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { MdDeleteSweep } from "react-icons/md";
export default function CreateFeedbackTemplate() {
  const [formData, setFormData] = useState({
    title: '',
    questions: ['', ''] // Two question fields
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_BASE_URL

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...formData.questions]
    newQuestions[index] = value
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }))
  }

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }))
  }

  const removeQuestion = (index) => {
    if (formData.questions.length > 1) {
      const newQuestions = formData.questions.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        questions: newQuestions
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title) {
      toast.error('Title is required')
      return
    }

    const filledQuestions = formData.questions.filter(q => q.trim() !== '')
    if (filledQuestions.length === 0) {
      toast.error('At least one question is required')
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      
      // Create a template with questions joined or send as array
      const templateData = {
        title: formData.title,
        question: filledQuestions.join('\n\n') // Join questions with line breaks
      }

      const response = await axios.post(
        `${API_URL}/api/feedback/templates`,
        templateData,
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
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-purple-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Create Feedback Template
            </h1>
            <p className="text-gray-200">Create a new feedback question that users can respond to</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-white text-sm font-semibold mb-2" htmlFor="title">
                Feedback Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-lg text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="e.g., Course Satisfaction Survey"
              />
              <p className="text-xs text-gray-300 mt-1">Give your feedback a descriptive title</p>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-white text-sm font-semibold">
                  Questions *
                </label>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-3 py-1 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                >
                  + Add Question
                </button>
              </div>
              
              {formData.questions.map((question, index) => (
                <div key={index} className="mb-4 bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium bg-linear-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full">
                      Question {index + 1}
                    </span>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-400 hover:text-black-300 text-sm font-medium hover:bg-black-500/10 px-3 py-1 rounded-lg transition-all"
                      >
                        <MdDeleteSweep  className='text-2xl'/>
                      </button>
                    )}
                  </div>
                  <textarea
                    id={`question-${index}`}
                    value={question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-lg text-white placeholder-gray-400 backdrop-blur-sm"
                    placeholder={`Enter question ${index + 1}...`}
                  ></textarea>
                </div>
              ))}
              
              <p className="text-xs text-gray-300 mt-2">Add one or more questions users will answer</p>
            </div>

           

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg transform hover:scale-[1.02] transition-all duration-200"
              >
                {loading ? 'Creating...' : 'Create Template'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/Home')}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg focus:outline-none font-semibold border border-white/20 transition-all duration-200"
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
