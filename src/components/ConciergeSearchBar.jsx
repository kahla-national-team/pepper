import React from "react"
import "../styles/concierge.css"

const SearchIcon = () => (
  <span className="search-icon">🔍</span>
)

export default function ConciergeSearchBar() {
  return (
    <div className="search-container">
      <div className="search-bar">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search services..."
          className="search-input"
        />
      </div>
    </div>
  )
} 