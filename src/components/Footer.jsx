import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faBook,
  faPlusCircle,
  faGlobe,
  faUser
} from '@fortawesome/free-solid-svg-icons'
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <a href="#" className="footer-link">
        <FontAwesomeIcon icon={faHome} className="footer-icon" />
        <span className="footer-label">Home</span>
      </a>
      <a href="#" className="footer-link">
        <FontAwesomeIcon icon={faBook} className="footer-icon" />
        <span className="footer-label">Books</span>
      </a>
      <a href="#" className="footer-link">
        <FontAwesomeIcon icon={faPlusCircle} className="footer-icon" />
        <span className="footer-label">Add</span>
      </a>
      <a href="#" className="footer-link">
        <FontAwesomeIcon icon={faGlobe} className="footer-icon" />
        <span className="footer-label">Explore</span>
      </a>
      <a href="#" className="footer-link">
        <FontAwesomeIcon icon={faUser} className="footer-icon" />
        <span className="footer-label">Profile</span>
      </a>
    </footer>
  )
}

export default Footer
