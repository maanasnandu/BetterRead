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
import Footer from './Footer'

const Dashboard = () => {
  const navigate = useNavigate()
  const [userProfile, setUserProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('posts') // State to manage active tab

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

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userProfile') // Clear user profile from local storage
    navigate('/') // Redirect to home page
  }

  // Show loading state if user profile is not yet loaded
  if (!userProfile) {
    return (
      <div className='loading-container'>
        <p className='loading-text'>Loading dashboard or redirecting...</p>
      </div>
    )
  }

  // Combined array for bookshelf content
  const shelfContent = [
    // Row 1
    { type: 'book', height: 'h-40', color: 'bg-blue-300' },
    { type: 'book', height: 'h-48', color: 'bg-red-300' },
    { type: 'book', height: 'h-36', color: 'bg-green-300' },
    { type: 'decorative', icon: '🌵' }, // Cactus
    // Row 2
    { type: 'decorative', icon: '👓' }, // Glasses
    { type: 'book', height: 'h-44', color: 'bg-purple-300' },
    { type: 'book', height: 'h-52', color: 'bg-yellow-300' },
    { type: 'decorative', icon: '🗓️' }, // Calendar
    // Row 3
    { type: 'book', height: 'h-40', color: 'bg-indigo-300' },
    { type: 'book', height: 'h-48', color: 'bg-pink-300' },
    { type: 'decorative', icon: '🤠' }, // Hat
    { type: 'book', height: 'h-36', color: 'bg-teal-300' },
    // Row 4
    { type: 'decorative', icon: '🌐' }, // Globe
    { type: 'book', height: 'h-44', color: 'bg-orange-300' },
    { type: 'book', height: 'h-52', color: 'bg-lime-300' },
    { type: 'decorative', icon: '🌹' } // Rose
  ]

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
                <p className='stat-value'>65</p>
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

          {activeTab === 'posts' &&
            [...Array(5)].map((_, i) => (
              <div key={i} className='post-item'>
                {/* Placeholder for images - in a real app, you'd load actual images here */}
                <img
                  src={`https://placehold.co/300x300/e2e8f0/94a3b8?text=Book+${
                    i + 1
                  }`}
                  alt={`Post ${i + 1}`}
                  className='post-image'
                />
                {/* Optional overlay for likes/comments on hover */}
                <div className='post-overlay'>
                  <span className='post-stats'>❤️ 123</span>
                  <span className='post-stats'>💬 45</span>
                </div>
              </div>
            ))}
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
