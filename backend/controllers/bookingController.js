import { Booking } from "../models/Booking.js";

export const createBooking = async (req, res) => {
    const { userId, eventId, quantity } = req.body;
    try {
        const booking = await Booking.create({ userId, eventId, quantity });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

