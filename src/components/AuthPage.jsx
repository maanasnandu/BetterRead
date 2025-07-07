import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode' // Used to decode the JWT token from Google

// IMPORTANT: Ensure this path is correct for your project structure.
// If your image is in 'src/assets', you might need '../assets/BookshelfAuth.PNG'
// For this self-contained example, assuming it's in the same directory as AuthPage.jsx
import BookshelfAuthImage from '../assets/BookshelfAuth.PNG'
import BookShelfImg from '../assets/bookShelf.png'
import BookLogo from '../assets/bookLogo.png'

const GOOGLE_CLIENT_ID =
  '722735113713-e1c5bl04m18gabt2luildt63ko2lhti3.apps.googleusercontent.com'

// --- AuthPage Component ---
const AuthPage = () => {
  const [message, setMessage] = useState('') // State for custom message box
  const [showMessageBox, setShowMessageBox] = useState(false) // State to control message box visibility
  const [isRedirecting, setIsRedirecting] = useState(false) // State for redirect loading
  const navigate = useNavigate() // Initialize useNavigate hook for routing

  // Function to display a message in a custom message box
  const showMessage = msg => {
    setMessage(msg)
    setShowMessageBox(true)
    // Automatically hide the message after 3 seconds
    setTimeout(() => {
      setShowMessageBox(false)
      setMessage('')
    }, 3000)
  }

  // Callback function for successful Google login
  const handleSuccess = credentialResponse => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      console.log('Login Success: Decoded JWT:', decoded)

      // Immediately set redirecting state and show message
      setIsRedirecting(true)
      showMessage(`Welcome, ${decoded.name}! Redirecting to dashboard...`)

      // Use localStorage to persist user info, so Dashboard can access it
      localStorage.setItem('userProfile', JSON.stringify(decoded))

      console.log('Attempting to navigate to /dashboard in 1.5 seconds...')
      // Redirect to the dashboard after a short delay to show the message
      setTimeout(() => {
        console.log("Executing navigate('/dashboard')...")
        navigate('/dashboard')
        console.log("navigate('/dashboard') called.")
      }, 1500) // Give user a moment to read the message
    } catch (error) {
      console.error('Error decoding JWT or processing login:', error)
      showMessage('An error occurred during login. Please try again.')
      setIsRedirecting(false) // Hide redirecting message on error
    }
  }

  // Callback function for failed Google login
  const handleError = () => {
    console.error('Login Failed')
    showMessage('Google login failed. Please try again.')
    setIsRedirecting(false) // Hide redirecting message on error
  }

  // Render the login page
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {/* Embedded Vanilla CSS for styling */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

          body {
            margin: 0;
            font-family: 'Inter', sans-serif;
          }

          .auth-page-container {
            min-height: 100vh;
            background: linear-gradient(to bottom right, #305bab, #ffc6c6); /* from-blue-500 to-purple-600 */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem; /* p-4 */
            box-sizing: border-box; /* Ensure padding doesn't add to total width/height */
          }

          .auth-card {
            background-color: #ffffff; /* bg-white */
            border-radius: 1.5rem; /* rounded-3xl */
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); /* shadow-2xl */
            overflow: hidden;
            display: flex;
            flex-direction: column; /* flex-col */
            max-width: 72rem; /* max-w-6xl (1152px) */
            width: 100%;
            margin: auto; /* mx-auto */
            transition: transform 0.3s ease-in-out; /* transition-all duration-300 */
            border: 1px solid #f3f4f6; /* border border-gray-100 */
          }

          .auth-card:hover {
            transform: scale(1.01); /* hover:scale-[1.01] */
          }

          .image-section {
            width: 100%; /* w-full */
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem; /* p-6 */
            background-color: #f9fafb; /* bg-gray-50 */
          }

          .auth-image {
            width: 100%; /* w-full */
            height: auto; /* h-auto */
            max-width: 12rem; /* max-w-xs (192px) */
            object-fit: contain;
            border-radius: 1rem; /* rounded-2xl */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-lg */
            transition: transform 0.3s ease-in-out; /* transition-transform duration-300 */
          }

          .auth-image:hover {
            transform: scale(1.05); /* hover:scale-105 */
          }

          .content-section {
            width: 100%; /* w-full */
            padding: 2rem; /* p-8 */
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center; /* text-center */
          }

          .main-heading {
            font-size: 2.25rem; /* text-4xl */
            font-weight: 800; /* font-extrabold */
            color: #1f2937; /* text-gray-800 */
            margin-bottom: 1rem; /* mb-4 */
            line-height: 1.25; /* leading-tight */
          }

          .main-heading span {
            color: #4f46e5; /* text-indigo-600 */
          }

          .sub-text {
            font-size: 1.125rem; /* text-lg */
            color: #4b5563; /* text-gray-600 */
            margin-bottom: 2rem; /* mb-8 */
          }

          .google-login-prompt {
            color: #374151; /* text-gray-700 */
            margin-bottom: 1.5rem; /* mb-6 */
          }

          .google-login-button-container {
            display: flex;
            justify-content: center; /* justify-center */
          }

          .redirecting-message {
            margin-top: 1.5rem; /* mt-6 */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 0.75rem; /* space-y-3 */
            padding: 1rem; /* p-4 */
            background-color: #eff6ff; /* bg-blue-50 */
            border-radius: 0.75rem; /* rounded-xl */
            border: 1px solid #bfdbfe; /* border border-blue-200 */
          }

          .spinner {
            animation: spin 1s linear infinite;
            height: 2rem; /* h-8 */
            width: 2rem; /* w-8 */
            color: #4f46e5; /* text-indigo-600 */
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .redirecting-text {
            font-size: 1.25rem; /* text-xl */
            font-weight: 600; /* font-semibold */
            color: #4338ca; /* text-indigo-700 */
          }

          .message-box {
            position: fixed;
            bottom: 2rem; /* bottom-8 */
            right: 2rem; /* right-8 */
            background-color: rgba(0, 0, 0, 0.75); /* bg-black bg-opacity-75 */
            color: #ffffff; /* text-white */
            padding: 0.75rem 1.5rem; /* py-3 px-6 */
            border-radius: 0.5rem; /* rounded-lg */
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* shadow-xl */
            animation: fadeInOut 3s forwards; /* animate-fade-in-up transition-all duration-300 */
            z-index: 50;
          }

          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
          }

          /* Responsive adjustments */
          @media (min-width: 640px) { /* sm breakpoint */
            .auth-image {
              max-width: 14rem; /* sm:max-w-sm (224px) */
            }
            .main-heading {
              font-size: 3rem; /* sm:text-5xl */
              margin-bottom: 1.5rem; /* sm:mb-6 */
            }
            .sub-text {
              margin-bottom: 2.5rem; /* sm:mb-10 */
            }
            .content-section {
              padding: 2.5rem; /* sm:p-10 */
            }
          }

          @media (min-width: 768px) { /* md breakpoint */
            .auth-card {
              flex-direction: row; /* md:flex-row */
            }
            .image-section, .content-section {
              width: 50%; /* md:w-1/2 */
            }
            .content-section {
              text-align: left; /* md:text-left */
            }
            .google-login-button-container {
              justify-content: flex-start; /* md:justify-start */
            }
            .auth-image {
              max-width: 100%; /* md:max-w-full */
            }
          }
        `}
      </style>

      <div className='auth-page-container'>
        {/* Main container for the authentication card */}
        <div className='auth-card'>
          {/* Left section: Image */}
          <div className='image-section'>
            <img
              src={BookShelfImg}
              alt='The Bookshelf'
              className='auth-image'
              onError={e => {
                e.target.onerror = null // Prevent infinite loop
                e.target.src =
                  'https://placehold.co/400x400/cccccc/333333?text=Image+Not+Found'
                console.error('Image failed to load:', e.target.src)
              }}
            />
          </div>

          {/* Right section: Login form/info */}
          <div className='content-section'>
            <h1 className='main-heading'>
              Welcome to <span>The Bookshelf</span>
            </h1>
            <p className='sub-text'>
              Sign in to manage your collection and discover new reads.
            </p>

            {/* Conditional rendering based on redirecting state */}
            {isRedirecting ? (
              <div className='redirecting-message'>
                <svg
                  className='spinner'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                <span className='redirecting-text'>Redirecting...</span>
              </div>
            ) : (
              <div>
                <p className='google-login-prompt'>
                  Please sign in with your Google account:
                </p>
                {/* Google Login Button - styled by the library, centered within its container */}
                <div className='google-login-button-container'>
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    size='large'
                    shape='rectangular'
                    theme='outline'
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom Message Box */}
        {showMessageBox && (
          <div className='message-box'>
            <p>{message}</p>
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  )
}

export default AuthPage
