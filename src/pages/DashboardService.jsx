"use client";
import React, { useState } from 'react';
import ServiceCard from "../components/ServiceCard";
import ConciergeServices from '../components/dashboard/ConciergeServices';

const DashboardService = () => {
  // Dummy stats for display
  const [stats] = useState({ views: 123, bookings: 12, clients: 8 });
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    providerName: "John Doe",
    providerRating: 5,
    providerReviewCount: 0,
    providerImage: "/placeholder-avatar.png",
    image: "",
    address: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const fileUrl = URL.createObjectURL(files[0]);
      setForm({ ...form, image: fileUrl });
      setImagePreview(fileUrl);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAddService = (e) => {
    e.preventDefault();
    const newService = {
      id: Date.now(),
      title: form.title,
      description: form.description,
      price: form.price,
      provider: {
        name: form.providerName,
        rating: Number(form.providerRating),
        reviewCount: Number(form.providerReviewCount),
        image: form.providerImage,
      },
      image: form.image,
      address: form.address,
    };
    setServices([newService, ...services]);
    setForm({
      title: "",
      description: "",
      price: "",
      providerName: "John Doe",
      providerRating: 5,
      providerReviewCount: 0,
      providerImage: "/placeholder-avatar.png",
      image: "",
      address: "",
    });
    setImagePreview("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Views" value={stats.views} />
        <StatCard label="Bookings" value={stats.bookings} />
        <StatCard label="Clients" value={stats.clients} />
      </div>

      <h1 className="text-3xl font-bold mb-8">Host Your Service</h1>
      <form
        onSubmit={handleAddService}
        className="bg-white rounded-xl shadow p-6 mb-10 max-w-2xl mx-auto"
      >
        <div className="flex flex-col gap-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Service Title"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price (e.g. $100/hour)"
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="providerName"
            value={form.providerName}
            onChange={handleChange}
            placeholder="Provider Name"
            className="border rounded px-3 py-2"
            required
          />
          {/* Image upload input */}
          <div className="flex flex-col col-span-2 mb-4">
            <label className="mb-1 font-semibold">Service Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 rounded-lg h-40 w-auto object-cover border"
                style={{ maxWidth: 320 }}
              />
            )}
          </div>
          <input
            name="providerImage"
            value={form.providerImage}
            onChange={handleChange}
            placeholder="Provider Avatar URL"
            className="border rounded px-3 py-2"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="border rounded px-3 py-2"
            required
          />
        </div>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Service Description"
          className="border rounded px-3 py-2 mt-4 w-full"
          required
        />
        <button
          type="submit"
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Add Service
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4">Your Services</h2>
      {services.length === 0 ? (
        <div className="text-gray-500">No services yet. Add your first service above!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-8 mt-10">Concierge Services</h1>
      <ConciergeServices />
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

export default DashboardService;