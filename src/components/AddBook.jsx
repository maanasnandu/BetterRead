import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
// import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import './AddBook.css'

// Firestore Imports
import { collection, addDoc } from 'firebase/firestore'

const genres = [
  'Fiction',
  'Non-Fiction',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Horror',
  'Biography',
  'History',
  'Self-Help',
  'Poetry',
  'Young Adult',
  "Children's",
  'Cookbook',
  'Travel',
  'Art',
  'Science',
  'Business',
  'Comics & Graphic Novels'
]

// AddBook component now accepts 'db' and 'userId' as props
const AddBook = ({ db, userId }) => {
  const navigate = useNavigate()
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [review, setReview] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [rating, setRating] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false) // State for submission loading

  // Handle genre checkbox change
  const handleGenreChange = e => {
    const { value, checked } = e.target
    if (checked) {
      setSelectedGenres(prevGenres => [...prevGenres, value])
    } else {
      setSelectedGenres(prevGenres =>
        prevGenres.filter(genre => genre !== value)
      )
    }
  }

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true) // Start loading state

    // Client-side validation
    if (!bookName.trim()) {
      setErrorMessage('Book Name is required.')
      setIsSubmitting(false)
      return
    }
    if (!author.trim()) {
      setErrorMessage('Author is required.')
      setIsSubmitting(false)
      return
    }
    if (selectedGenres.length === 0) {
      setErrorMessage('Please select at least one genre.')
      setIsSubmitting(false)
      return
    }
    if (!review.trim()) {
      setErrorMessage('Review is required.')
      setIsSubmitting(false)
      return
    }
    if (rating === 0) {
      setErrorMessage('Please provide a rating.')
      setIsSubmitting(false)
      return
    }

    // Ensure db and userId are available before attempting to save
    if (!db || !userId) {
      setErrorMessage('Database not ready. Please try again.')
      setIsSubmitting(false)
      return
    }

    const newBook = {
      bookName,
      author,
      review,
      genres: selectedGenres,
      rating,
      dateAdded: new Date().toLocaleDateString(),
      userId: userId // Store the user ID with the book
    }

    try {
      // Define the collection path for user-specific books
      // This follows the private data path: /artifacts/{appId}/users/{userId}/books
      const appId =
        typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'
      const booksCollectionRef = collection(
        db,
        `artifacts/${appId}/users/${userId}/books`
      )

      // Add the new book document to Firestore
      await addDoc(booksCollectionRef, newBook)

      // Clear the form fields
      setBookName('')
      setAuthor('')
      setReview('')
      setSelectedGenres([])
      setRating(0)

      // Navigate back to the dashboard after adding the book
      navigate('/dashboard')
    } catch (error) {
      console.error('Error adding document: ', error)
      setErrorMessage('Failed to add book. Please try again.')
    } finally {
      setIsSubmitting(false) // End loading state
    }
  }

  return (
    <div className='add-book-container'>
      <div className='form-card'>
        <h2 className='form-title'>Add New Book</h2>
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <form onSubmit={handleSubmit} className='form-layout'>
          {/* Book Name Input */}
          <div className='form-group'>
            <label htmlFor='bookName' className='form-label'>
              Book Name
            </label>
            <input
              type='text'
              id='bookName'
              className='form-input'
              value={bookName}
              onChange={e => setBookName(e.target.value)}
              required
            />
          </div>

          {/* Author Input */}
          <div className='form-group'>
            <label htmlFor='author' className='form-label'>
              Author
            </label>
            <input
              type='text'
              id='author'
              className='form-input'
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />
          </div>

          {/* Genre Checkbox List */}
          <div className='form-group'>
            <label className='form-label'>Genre(s)</label>
            <div className='genre-checkbox-list'>
              {genres.map(genreOption => (
                <label key={genreOption} className='genre-checkbox-item'>
                  <input
                    type='checkbox'
                    value={genreOption}
                    checked={selectedGenres.includes(genreOption)}
                    onChange={handleGenreChange}
                  />
                  {genreOption}
                </label>
              ))}
            </div>
          </div>

          {/* Review Textarea */}
          <div className='form-group'>
            <label htmlFor='review' className='form-label'>
              Review
            </label>
            <textarea
              id='review'
              rows='4'
              className='form-textarea'
              value={review}
              onChange={e => setReview(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Rating Stars */}
          <div className='form-group'>
            <label className='form-label'>Rating</label>
            <div className='star-rating'>
              {[1, 2, 3, 4, 5].map(star => (
                <FontAwesomeIcon
                  key={star}
                  icon={star <= rating ? faStarSolid : faStarSolid}
                  className={`star-icon ${
                    star <= rating ? 'star-icon-selected' : ''
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            className='submit-button'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding Book...' : 'Add Book'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBook
