import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'

// --- Main App Component (integrates routing) ---
function App () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        {/* Fallback for any unmatched routes */}
        <Route
          path='*'
          element={
            <div className='min-h-screen bg-gray-100 flex items-center justify-center font-inter'>
              <h1 className='text-4xl text-gray-700'>404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
      {/* Tailwind CSS and Inter Font CDN links - crucial for styling */}
      <script src='https://cdn.tailwindcss.com'></script>
      <link
        href='https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800&display=swap'
        rel='stylesheet'
      />
    </BrowserRouter>
  )
}

export default App
