import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import AddBook from './components/AddBook'

function App () {
  // const [books, setBooks] = useState(() => {
  //   const storedBooks = localStorage.getItem('books')
  //   // Add a more robust check: ensure storedBooks is not null and not the string "undefined"
  //   if (storedBooks && storedBooks !== 'undefined') {
  //     try {
  //       return JSON.parse(storedBooks)
  //     } catch (e) {
  //       console.error('Error parsing books from localStorage:', e)
  //       // If parsing fails, return an empty array to prevent app crash
  //       return []
  //     }
  //   }
  //   return []
  // })

  const [db, setDb] = useState(null)
  const [auth, setAuth] = useState(null)
  const [userId, setUserId] = useState(null)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)

  useEffect(() => {
    //localStorage.setItem('books', JSON.stringify(books))
    try {
      const firebaseConfig =
        typeof __firebase_config !== 'undefined'
          ? JSON.parse(__firebase_config)
          : {
              apiKey: 'AIzaSyCJArJGP65X6y5fTx8MhQVHlkF4-rzKTgg',
              authDomain: 'bookshelf-89436.firebaseapp.com',
              projectId: 'bookshelf-89436',
              storageBucket: 'bookshelf-89436.firebasestorage.app',
              messagingSenderId: '849294792150',
              appId: '1:849294792150:web:d29ccd441fddc773fa4077',
              measurementId: 'G-PQ87B6TTT2'
            }
      // const fireBaseConfig = JSON.parse(firebaseDetails)

      const app = initializeApp(firebaseConfig)
      const firestoreDb = getFirestore(app)
      const firebaseAuth = getAuth(app)

      setDb(firestoreDb)
      setAuth(firebaseAuth)

      const unsubscribe = onAuthStateChanged(firebaseAuth, async user => {
        if (user) {
          setUserId(user.uid)
          setIsFirebaseReady(true)
        } else {
          try {
            const initialAuthToken =
              typeof __initial_auth_token !== 'undefined'
                ? __initial_auth_token
                : null
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken)
            } else {
              await signInAnonymously(firebaseAuth)
            }
          } catch (error) {
            console.log('Error signing in firebase: ', error)
            setUserId(crypto.randomUUID())
            setIsFirebaseReady(false)
          }
        }
      })
      return () => unsubscribe()
    } catch (error) {
      console.log('Failed to Initialize Firebase', error)
      setUserId(crypto.randomUUID())
      setIsFirebaseReady(true)
    }
  }, [])

  if (!isFirebaseReady) {
    return (
      <div
        className='loading-container'
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#f3f4f6'
        }}
      >
        <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
          Initializing application...
        </p>
      </div>
    )
  }

  // const handleAddBook = newBook => {
  //   setBooks(prevBooks => [...prevBooks, newBook])
  // }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<AuthPage />} />
        <Route
          path='/dashboard'
          element={<Dashboard db={db} userId={userId} />}
        />
        <Route path='/addBook' element={<AddBook db={db} userId={userId} />} />
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
