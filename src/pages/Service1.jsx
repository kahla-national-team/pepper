"use client"
import PropTypes from "prop-types"
import "../styles/concierge.css"
import house from '../assets/house.png'
import king from '../assets/images.png'

const ServiceCard = ({ title, description, icon, price, provider, onClick }) => {
  return (
    <div className="service-card">
      <div className="service-header">
        <div className="service-icon">
          <img src={house} alt={title} />
        </div>
        <h3 className="service-title">{title}</h3>
        <p className="service-description">{description}</p>
      </div>
      
      <div className="service-content">
        {provider && (
          <div className="host-info">
            <img 
              src={king} 
              alt={provider.name} 
              className="host-avatar"
            />
            <span className="host-name">{provider.name}</span>
          </div>
        )}
      </div>

      <div className="service-footer">
        <div className="price-rating">
          <span className="price">{price}</span>
          <div className="rating">
            <span>★</span>
            <span>{provider?.rating}</span>
            {provider?.reviewCount && (
              <span className="reviews">({provider.reviewCount} reviews)</span>
            )}
          </div>
        </div>
        <button onClick={onClick} className="book-button">
          Book Service
        </button>
      </div>
    </div>
  )
}

ServiceCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    rating: PropTypes.number,
    reviewCount: PropTypes.number,
  }),
  onClick: PropTypes.func,
}

export default function ConciergeServices() {
  const handleBookService = (service) => {
    console.log(`Booking ${service} service`)
  }

  return (
    <div className="concierge-section">
      <div className="services-grid">
        <ServiceCard
          title="Housekeeping"
          description="Professional cleaning services tailored to your schedule. Daily, weekly, or one-time deep cleaning options available."
          icon="https://placehold.co/100x100"
          price="From $75"
          provider={{
            name: "سايمون بيتريكوف",
            image: "/placeholder.svg?height=40&width=40",
            rating: 4.9,
            reviewCount: 124
          }}
          onClick={() => handleBookService("Housekeeping")}
        />
      </div>
    </div>
  )
}
