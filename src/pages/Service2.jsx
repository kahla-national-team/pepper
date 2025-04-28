"use client"
import PropTypes from "prop-types"

const ServiceCard = ({ title, description, icon, price, provider, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
      <div className="p-4 border-b border-gray-100">
        <div className="w-12 h-12 mb-3">
          <img src={icon} alt={title} className="w-full h-full object-cover rounded-md" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      <div className="p-4">
        {provider && (
          <div className="flex items-center gap-3 mb-4">
            <img src={provider.image} alt={provider.name} className="w-8 h-8 rounded-full object-cover" />
            <span className="text-sm text-gray-600 font-medium">{provider.name}</span>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <span className="text-rose-500 font-semibold">{price}</span>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span className="text-rose-500">★</span>
            <span>{provider?.rating}</span>
            {provider?.reviewCount && (
              <span className="text-gray-500">({provider.reviewCount} reviews)</span>
            )}
          </div>
        </div>
        <button onClick={onClick} className="px-4 py-2 bg-rose-500 text-white text-sm rounded hover:bg-rose-600 transition">
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
    <div className="px-6 py-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[
          {
            title: "Housekeeping",
            description: "Professional cleaning services tailored to your schedule. Daily, weekly, or one-time deep cleaning options available.",
            price: "From $75",
            provider: {
              name: "Maria Rodriguez",
              image: "/placeholder.svg?height=40&width=40",
              rating: 4.9,
              reviewCount: 124
            }
          },
          {
            title: "Personal Chef",
            description: "Enjoy gourmet meals prepared in your rental by experienced chefs. Special dietary requirements accommodated.",
            price: "From $150",
            provider: {
              name: "Chef Thomas",
              image: "/placeholder.svg?height=40&width=40",
              rating: 4.8,
              reviewCount: 87
            }
          },
          {
            title: "Transportation",
            description: "Private drivers and luxury vehicles available for airport transfers or city exploration. 24/7 availability.",
            price: "From $60",
            provider: {
              name: "James Wilson",
              image: "/placeholder.svg?height=40&width=40",
              rating: 4.7,
              reviewCount: 56
            }
          },
          {
            title: "Business Services",
            description: "Meeting room bookings, printing, scanning, and administrative support for business travelers.",
            price: "From $45",
            provider: {
              name: "Sarah Johnson",
              image: "/placeholder.svg?height=40&width=40",
              rating: 4.6,
              reviewCount: 42
            }
          },
          {
            title: "Laundry & Dry Cleaning",
            description: "Premium laundry and dry cleaning with pickup and delivery to your rental property.",
            price: "From $30",
            provider: {
              name: "Michael Chen",
              image: "/placeholder.svg?height=40&width=40",
              rating: 4.9,
              reviewCount: 78
            }
          },
          {
            title: "Personal Shopping",
            description: "Grocery shopping, gift purchasing, and personal shopping assistance with delivery to your door.",
            price: "From $40",
            provider: {
              name: "Emily Parker",
              image: "/placeholder.svg?height=40&width=40",
              rating: 4.8,
              reviewCount: 93
            }
          }
        ].map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            description={service.description}
            icon="https://placehold.co/100x100"
            price={service.price}
            provider={service.provider}
            onClick={() => handleBookService(service.title)}
          />
        ))}
      </div>
    </div>
  )
}
