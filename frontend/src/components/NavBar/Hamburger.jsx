import React, { useState } from "react"
import "./Hamburger.scss"

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className={`menu ${isOpen ? "menu-opened" : ""}`}>
      <button
        className={`menu-open-button ${isOpen ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="hamburger hamburger-1"></span>
        <span className="hamburger hamburger-2"></span>
        <span className="hamburger hamburger-3"></span>
      </button>
      <div className="menu-items">
        <a href="#" className="menu-item">
          <i className="fa fa-bar-chart"></i>
        </a>
        <a href="#" className="menu-item">
          <i className="fa fa-plus"></i>
        </a>
        <a href="#" className="menu-item">
          <i className="fa fa-heart"></i>
        </a>
        <a href="#" className="menu-item">
          <i className="fa fa-envelope"></i>
        </a>
      </div>
    </nav>
  )
}

export default Hamburger
