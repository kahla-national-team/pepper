"use client"
import spong from "../assets/spang.jpg"
import tele from "../assets/tele.webp"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
// Example related services (replace with backend data)
const relatedServices = [
  {
    id: 2,
    title: "Personal Driver",
    description: "Get a private driver for your stay.",
    price: "$80/day",
    image: "/driver-service.jpg",
    provider: { name: "Driver John" }
  },
  {
    id: 3,
    title: "Housekeeping",
    description: "Daily cleaning and housekeeping.",
    price: "$40/day",
    image: "/housekeeping.jpg",
    provider: { name: "CleanPro" }
  }
];

const DetailsPage = () => {
  const { type, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace this with your backend API call
        setTimeout(() => {
          if (type === 'service' && id === '1') {
            setItem({
              id: 1,
              title: "Private Chef",
              description: "Enjoy gourmet meals prepared in your home by a professional chef. Custom menus available.",
              price: "$150/hour",
              image: tele,
              address: "123 Main St, Casablanca",
              location: { lat: 33.5731, lng: -7.5898 },
              provider: { name: "Chef Amine", rating: 4.9, reviews: 32, avatar: spong },
              available: true,
              phone: "+212 600-000000",
              email: "chef.amine@email.com",
              highlights: [
                "Custom menu planning",
                "Fresh ingredients",
                "Table service included",
                "Vegetarian options"
              ],
              language: "French, English",
              cancellation: "Free cancellation up to 24 hours before",
              included: [
                "All ingredients",
                "Cooking equipment",
                "Cleanup"
              ]
            });
          } else {
            setError('Service not found');
          }
          setLoading(false);
        }, 800);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [type, id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600 font-semibold">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-500 font-bold">Error: {error}</div>;
  }

  if (!item) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-400">Service not found.</div>;
  }

  return (
    <>
    <Navbar/>
    <div className="container mx-auto px-2 md:px-6 py-8">
    
    <div className="container mx-auto px-2 md:px-6 py-8">
      {/* ...rest of your page... */}
    </div>
      {/* Title and Provider */}
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{item.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          {item.provider?.avatar && (
            <img src={item.provider.avatar} alt={item.provider.name} className="w-9 h-9 rounded-full border-2 border-red-200" />
          )}
          <span className="font-medium text-gray-700">By <span className="text-red-500">{item.provider.name}</span></span>
          {item.provider.rating && (
            <span className="flex items-center text-yellow-400 text-sm ml-2">
              ★ {item.provider.rating}
              <span className="text-gray-500 ml-1">({item.provider.reviews})</span>
            </span>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="w-full flex justify-center mb-8">
        <div className="rounded-xl overflow-hidden shadow border border-gray-200 bg-gray-50 flex items-center justify-center"
             style={{ minHeight: '180px', maxWidth: '600px', width: '100%' }}>
          <img
            src={item.image}
            alt={item.title}
            className="w-full max-h-60 object-cover"
            style={{ borderRadius: '0.75rem' }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Info */}
        <div className="md:w-2/3">
          {/* Highlights */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
              Highlights
            </h2>
            <ul className="list-disc list-inside text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {item.highlights?.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
          {/* What's included */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="12" x="2" y="6" rx="2" /><path d="M6 10h.01" /><path d="M10 10h.01" /><path d="M14 10h.01" /></svg>
              What's included
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {item.included?.map((inc, i) => (
                <li key={i}>{inc}</li>
              ))}
            </ul>
          </div>
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
            <div className="text-gray-700">{item.description}</div>
          </div>
          {/* More Info */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Languages</h3>
              <div className="text-gray-600">{item.language}</div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Cancellation Policy</h3>
              <div className="text-gray-600">{item.cancellation}</div>
            </div>
          </div>
          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-1">Contact</h3>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 9 7 9s7-3.75 7-9c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 10 6a2.5 2.5 0 0 1 0 5.5z"/></svg>
                {item.address}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm0 14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2zm14-14a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5zm0 14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2z"/></svg>
                {item.phone}
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-1 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12l-4-4-4 4m8 0v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6m16 0V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v6"/></svg>
                {item.email}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Booking + Map */}
        <div className="md:w-1/3 flex flex-col gap-6">
          {/* Booking Card */}
          <div className="sticky top-24">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-end gap-2 mb-2">
                <span className="text-2xl font-bold text-red-500">{item.price}</span>
                <span className="text-gray-500 text-sm">/session</span>
              </div>
              <button
                className={`w-full mt-4 px-6 py-3 rounded-xl font-semibold shadow transition text-lg ${
                  item.available
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!item.available}
              >
                {item.available ? "Book Now" : "Not Available"}
              </button>
            </div>
            <div className="text-xs text-gray-400 text-center">No payment required until confirmation</div>
          </div>
          {/* Map Section */}
          <div className="bg-white rounded-2xl shadow border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Location</h3>
            <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
              {/* Replace this div with your map component */}
              <span className="text-gray-400">[Map Placeholder: {item.address}]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Services Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Related Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {relatedServices.map(service => (
            <div key={service.id} className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition group">
              <div className="overflow-hidden rounded-t-2xl">
                <img src={service.image} alt={service.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <div className="text-red-500 font-bold mb-1">{service.price}</div>
                <div className="text-xs text-gray-500 mb-2">By {service.provider.name}</div>
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm w-full">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z"/></svg>
          Reviews
        </h2>
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <img src="/avatar-chef.jpg" alt="User" className="w-8 h-8 rounded-full border" />
              <span className="font-semibold text-gray-800"> miloud </span>
              <span className="text-yellow-400">★★★★★</span>
            </div>
            <div className="text-gray-700">Amazing chef! The food was delicious and the service was perfect. Highly recommend.</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <img src="/avatar-chef.jpg" alt="User" className="w-8 h-8 rounded-full border" />
              <span className="font-semibold text-gray-800">issam</span>
              <span className="text-yellow-400">★★★★☆</span>
            </div>
            <div className="text-gray-700">Very professional and friendly. Will book again!</div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
          <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1">Can I request a specific menu?</div>
            <div className="text-gray-700">Yes, the chef will work with you to create a custom menu for your event.</div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="font-semibold text-gray-800 mb-1">Is cleanup included?</div>
            <div className="text-gray-700">Absolutely! Cleanup is always included in the service.</div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DetailsPage;