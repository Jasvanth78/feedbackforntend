import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function FeedbackDetail() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const [template, setTemplate] = useState(null)
  const [answers, setAnswers] = useState([])
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(true)
  const API_URL = import.meta.env.VITE_BASE_URL

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  const fetchTemplate = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/feedback/active`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const foundTemplate = response.data.find(t => t.id === templateId)
      if (foundTemplate) {
        setTemplate(foundTemplate)
      
        const questions = foundTemplate.question.split('\n\n').filter(q => q.trim())
        setAnswers(new Array(questions.length).fill(''))
      } else {
        toast.error('Feedback template not found')
        navigate('/home')
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching template:', error)
      toast.error('Failed to load feedback template')
      setLoading(false)
    }
  }

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    
    const hasEmptyAnswer = answers.some(ans => !ans?.trim())
    if (hasEmptyAnswer) {
      toast.error('Please answer all questions')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const combinedAnswer = answers.join('\n\n')
      
      await axios.post(
        `${API_URL}/api/feedback/submit`,
        { templateId, answer: combinedAnswer, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      toast.success('Feedback submitted successfully!')
      navigate('/home')
    } catch (error) {
      const msg = error?.response?.data?.error || 'Failed to submit feedback'
      toast.error(msg)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Template not found</div>
      </div>
    )
  }

  const questions = template.question.split('\n\n').filter(q => q.trim())

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-slate-800/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl p-6">
          <button
            onClick={() => navigate('/home')}
            className="mb-4 px-4 py-2 bg-slate-700/60 hover:bg-slate-700/80 text-white rounded-lg transition-all inline-flex items-center gap-2 border border-purple-500/30"
          >
            ← Back to Feedbacks
          </button>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-400 to-blue-400">
            {template.title}
          </h1>
          <p className="text-purple-200 mt-2">Please answer all questions below</p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-slate-800/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl p-8">
            {/* Questions */}
            {questions.map((question, index) => (
              <div key={index} className="mb-6">
                <label className="block text-purple-100 mb-3 text-lg font-medium">
                  <span className="inline-block px-3 py-1 bg-purple-600/30 border border-purple-400/40 rounded-full text-sm mr-2">
                    Q{index + 1}
                  </span>
                  {question}
                </label>
                <textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/40 border border-purple-400/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-white placeholder-purple-300/50 backdrop-blur-sm"
                  rows="4"
                  placeholder={`Your answer for question ${index + 1}...`}
                  required
                ></textarea>
              </div>
            ))}

            {/* Rating */}
            <div className="mb-6 mt-8 p-6 bg-slate-700/30 border border-purple-400/20 rounded-xl">
              <label className="block text-lg font-medium text-purple-200 mb-3">
                Overall Rating: {rating} / 5 {'⭐'.repeat(rating)}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full accent-purple-500 h-2"
              />
              <div className="flex justify-between text-sm text-purple-300 mt-2">
                <span>1 - Poor</span>
                <span>2 - Fair</span>
                <span>3 - Good</span>
                <span>4 - Very Good</span>
                <span>5 - Excellent</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="px-6 py-3 bg-slate-700/60 hover:bg-slate-700/80 text-white rounded-lg transition-all border border-purple-500/30"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
