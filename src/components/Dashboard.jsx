import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  faBook,
  faTh,
  faBookmark,
  faGrip,
  faCog,
  faPlusSquare
} from '@fortawesome/free-solid-svg-icons'

import { collection, query, onSnapshot, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import Footer from './Footer'

const Dashboard = ({ db, userId }) => {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('posts') // State to manage active tab
  const [books, setBooks] = useState([])
  const [isLoadingBooks, setIsLoadingBooks] = useState(true)

  useEffect(() => {
    // Retrieve user profile from local storage
    const storedProfile = localStorage.getItem('userProfile')
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile))
    } else {
      // Redirect to home if no profile is found
      navigate('/')
    }
  }, [navigate])

  useEffect(() => {
    if (db && userId) {
      setIsLoadingBooks(true)
      const appId = typeof __app_id != 'undefined' ? __app_id : 'default-app-id'
      const booksCollectionRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/books`
      )

      const q = query(booksCollectionRef, where('userId', '==', userId))

      const unsubscribe = onSnapshot(
        q,
        snapshot => {
          const fetchedBooks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          setBooks(fetchedBooks)
          setIsLoadingBooks(false)
        },
        error => {
          console.error('Error Fetching Books: ', error)
          setIsLoadingBooks(false)
        }
      )

      return () => unsubscribe()
    } else if (userId === null) {
      setIsLoadingBooks(false)
      setBooks([])
    }
  }, [db, userId])

  // Handle user logout
  const handleLogout = async () => {
    try {
      const authInstance = getAuth()
      await authInstance.signOut()
      localStorage.removeItem('userProfile') // Clear user profile from local storage
      navigate('/') // Redirect to home page
    } catch (error) {
      console.log('Error Signing out: ', error)
    }
  }

  // Show loading state if user profile is not yet loaded
  if (!userProfile || isLoadingBooks) {
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
          Loading dashboard...
        </p>
      </div>
    )
  }

  // // Combined array for bookshelf content
  // const shelfContent = [
  //   // Row 1
  //   { type: 'book', height: 'h-40', color: 'bg-blue-300' },
  //   { type: 'book', height: 'h-48', color: 'bg-red-300' },
  //   { type: 'book', height: 'h-36', color: 'bg-green-300' },
  //   { type: 'decorative', icon: '🌵' }, // Cactus
  //   // Row 2
  //   { type: 'decorative', icon: '👓' }, // Glasses
  //   { type: 'book', height: 'h-44', color: 'bg-purple-300' },
  //   { type: 'book', height: 'h-52', color: 'bg-yellow-300' },
  //   { type: 'decorative', icon: '🗓️' }, // Calendar
  //   // Row 3
  //   { type: 'book', height: 'h-40', color: 'bg-indigo-300' },
  //   { type: 'book', height: 'h-48', color: 'bg-pink-300' },
  //   { type: 'decorative', icon: '🤠' }, // Hat
  //   { type: 'book', height: 'h-36', color: 'bg-teal-300' },
  //   // Row 4
  //   { type: 'decorative', icon: '🌐' }, // Globe
  //   { type: 'book', height: 'h-44', color: 'bg-orange-300' },
  //   { type: 'book', height: 'h-52', color: 'bg-lime-300' },
  //   { type: 'decorative', icon: '🌹' } // Rose
  // ]

  return (
    <div className='dashboard-container'>
      {/* Top Navigation Bar (Instagram-like) */}
      <header className='header'>
        <div className='header-content'>
          <h1 className='app-title'>Bookshelf</h1> {/* App Name */}
          <div className='header-icons'>
            {/* <button className='icon-button'>
              <FontAwesomeIcon icon={faPlusSquare} className='icon' />{' '}
              {/* Add Post Icon 
            </button> */}
            {/* <button className='icon-button'>
              <FontAwesomeIcon icon={faCog} className='icon' />{' '}
             
            </button> */}
          </div>
        </div>
      </header>

      {/* Main content wrapper, centered and with max-width */}
      <div className='main-content-wrapper'>
        {/* Profile Header Section */}
        <div className='profile-header'>
          <div className='profile-picture-wrapper'>
            {userProfile.picture ? (
              <img
                src={userProfile.picture}
                alt='User Profile'
                className='profile-picture'
              />
            ) : (
              <div className='profile-picture-placeholder'>
                <FontAwesomeIcon icon={faBook} className='profile-icon' />
              </div>
            )}
          </div>
          <div className='profile-info'>
            <div className='profile-name-section'>
              <p className='profile-name'>{userProfile.name}</p>
              <button className='edit-profile-button'>Edit Profile</button>
            </div>
            <p className='profile-bio'>
              🌸 Book lover, avid reader, and reviewer.
            </p>
            <div className='profile-stats'>
              <div className='stat-item'>
                <p className='stat-value'>{books.length}</p>
                <p className='stat-label'>Books</p>
              </div>
              <div className='stat-item'>
                <p className='stat-value'>1.5k</p>
                <p className='stat-label'>Followers</p>
              </div>
              <div className='stat-item'>
                <p className='stat-value'>2</p>
                <p className='stat-label'>Following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className='navigation-tabs'>
          <button
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <FontAwesomeIcon icon={faBook} className='tab-icon' />
            <span className='tab-label'>Bookshelf</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <FontAwesomeIcon icon={faGrip} className='tab-icon' />
            <span className='tab-label'>Reviews</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => setActiveTab('books')}
          >
            <FontAwesomeIcon icon={faBookmark} className='tab-icon' />
            <span className='tab-label'>Saved</span>
          </button>
        </div>

        {/* Posts Grid (Content based on active tab would go here) */}
        {/* <div className='grid grid-cols-4 gap-4 p-4 bg-white rounded-xl shadow-lg'>
        
          {/* Add more placeholder books to fill out the grid if needed 
          {Array.from({ length: 16 - bookItems.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className='flex flex-col items-center justify-end p-2 rounded-lg'
            >
              <div className='w-8 h-40 bg-gray-200 rounded-md shadow-md mb-1'></div>
            </div>
          ))}
        </div> */}
        <div className='posts-grid'>
          {/* Bookshelf Grid */}

          {/* {activeTab === 'posts' &&
            [...Array(5)].map((_, i) => (
              <div key={i} className='post-item'>
                {/* Placeholder for images - in a real app, you'd load actual images here
                <img
                  src={`https://placehold.co/300x300/e2e8f0/94a3b8?text=Book+${
                    i + 1
                  }`}
                  alt={`Post ${i + 1}`}
                  className='post-image'
                />
                {/* Optional overlay for likes/comments on hover 
                <div className='post-overlay'>
                  <span className='post-stats'>❤️ 123</span>
                  <span className='post-stats'>💬 45</span>
                </div>
              </div>
            ))} */}
          {activeTab === 'posts' && books.length > 0 ? (
            books.map(book => (
              <div
                key={book.id}
                className='post-item bg-white rounded-lg shadow-md overflow-hidden'
              >
                {/* Generic book cover placeholder */}
                <img
                  src={`https://placehold.co/400x300/e2e8f0/94a3b8?text=${encodeURIComponent(
                    book.bookName
                  )}`}
                  alt={book.bookName}
                  className='w-full h-48 object-cover'
                />
                <div className='p-4'>
                  <h6 className='text-sm font-semibold text-gray-900 mb-1'>
                    {book.bookName}
                  </h6>
                  <p className='text-sm text-gray-600 mb-2'>by {book.author}</p>
                  {book.genres && book.genres.length > 0 && (
                    <p className='text-xs text-gray-500 mb-2'>
                      Genres: {book.genres.join(', ')}
                    </p>
                  )}
                  <div className='flex items-center mb-2'>
                    {/* Display stars based on rating */}
                    {/* {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesomeIcon
                        key={star}
                        icon={faStarSolid}
                        className={`text-yellow-400 ${star > book.rating ? 'opacity-30' : ''}`}
                      />
                    ))} */}
                    <span className='ml-2 text-sm text-gray-500'>
                      ({book.rating}/5)
                    </span>
                  </div>
                  <p className='text-gray-700 text-sm line-clamp-3'>
                    {book.review}
                  </p>
                  <p className='text-xs text-gray-400 mt-2'>
                    Added on: {book.dateAdded}
                  </p>
                </div>
              </div>
            ))
          ) : activeTab === 'posts' && books.length === 0 ? (
            <div className='col-span-full text-center text-gray-500 py-10'>
              No books added yet. Click the '+' icon in the footer to add one!
            </div>
          ) : null}
          {activeTab === 'saved' && (
            <div className='no-content-message'>No saved books yet.</div>
          )}
          {activeTab === 'books' && (
            <div className='no-content-message'>No books added yet.</div>
          )}
        </div>
        <Footer />
        {/* Logout Button */}
        <div className='logout-section'>
          <button onClick={handleLogout} className='logout-button'>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
