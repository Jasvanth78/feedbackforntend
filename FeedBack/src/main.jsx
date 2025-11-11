import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { HashRouter } from 'react-router-dom';
createRoot(document.getElementById('root')).render(
  <>
  <HashRouter>  
    <App />

    <ToastContainer 
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      toastStyle={{
        backgroundColor: '#1e293b',
        color: '#fff',
        borderRadius: '0.75rem',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      }}
      progressStyle={{
        background: 'linear-gradient(to right, #a855f7, #ec4899)',
      }}
    />
    </HashRouter>
  </>
)
