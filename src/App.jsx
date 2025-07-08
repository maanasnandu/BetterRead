import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import AddBook from './components/AddBook'

// --- Main App Component (integrates routing) ---
function App () {
  const [books, setBooks] = useState(() => {
    const storedBooks = localStorage.getItem('books')
    // Add a more robust check: ensure storedBooks is not null and not the string "undefined"
    if (storedBooks && storedBooks !== 'undefined') {
      try {
        return JSON.parse(storedBooks)
      } catch (e) {
        console.error('Error parsing books from localStorage:', e)
        // If parsing fails, return an empty array to prevent app crash
        return []
      }
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books))
  }, [books])

  const handleAddBook = newBook => {
    setBooks(prevBooks => [...prevBooks, newBook])
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route path='/dashboard' element={<Dashboard books={books} />} />
        <Route
          path='/addBook'
          element={<AddBook onAddBook={handleAddBook} />}
        />
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
