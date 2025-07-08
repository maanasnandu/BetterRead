import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-solid-svg-icons'
// import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import './AddBook.css'

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

const AddBook = ({ onAddBook }) => {
  const navigate = useNavigate()
  const [bookName, setBookName] = useState('')
  const [author, setAuthor] = useState('')
  const [review, setReview] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([]) // State for multi-select genres
  const [rating, setRating] = useState(0) // 0 to 5 stars
  const [errorMessage, setErrorMessage] = useState('') // State for validation messages

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
  const handleSubmit = e => {
    e.preventDefault() // Prevent default form submission behavior
    setErrorMessage('') // Clear previous error messages

    // Client-side validation
    if (!bookName.trim()) {
      setErrorMessage('Book Name is required.')
      return
    }
    if (!author.trim()) {
      setErrorMessage('Author is required.')
      return
    }
    if (selectedGenres.length === 0) {
      setErrorMessage('Please select at least one genre.')
      return
    }
    if (!review.trim()) {
      setErrorMessage('Review is required.')
      return
    }
    if (rating === 0) {
      setErrorMessage('Please provide a rating.')
      return
    }

    // Create a new book object
    const newBook = {
      id: Date.now(), // Unique ID for the book
      bookName,
      author,
      review,
      genres: selectedGenres, // Include selected genres
      rating,
      dateAdded: new Date().toLocaleDateString() // Add current date
    }

    // Call the prop function to add the book to the parent's state
    onAddBook(newBook)

    // Clear the form fields
    setBookName('')
    setAuthor('')
    setReview('')
    setSelectedGenres([]) // Clear selected genres
    setRating(0)

    // Navigate back to the dashboard after adding the book
    navigate('/dashboard')
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
                  icon={star <= rating ? faStarSolid : faStarRegular}
                  className={`star-icon ${
                    star <= rating ? 'star-icon-selected' : ''
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button type='submit' className='submit-button'>
            Add Book
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddBook
