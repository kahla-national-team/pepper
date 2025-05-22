import { ServicesRequest } from "../models/ServicesRequest.js";

export const createServicesRequest = async (req, res) => {
    const { userId, serviceId, quantity } = req.body;
    try {
        const servicesRequest = await ServicesRequest.create({ userId, serviceId, quantity });
        res.status(201).json(servicesRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getServicesRequests = async (req, res) => {
    try {
        const servicesRequests = await ServicesRequest.findAll();
        res.status(200).json(servicesRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}   

export const updateServicesRequest = async (req, res) => {
    const { id } = req.params;
    const { userId, serviceId, quantity } = req.body;
    
}


export const deleteServicesRequest = async (req, res) => {
    const { id } = req.params;
    try {
        await ServicesRequest.destroy({ where: { id } });
        res.status(200).json({ message: "Services request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getServicesRequestById = async (req, res) => {
    const { id } = req.params;
    try {
        const servicesRequest = await ServicesRequest.findByPk(id);
        res.status(200).json(servicesRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getServicesRequestByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const servicesRequest = await ServicesRequest.findAll({ where: { userId } });
        res.status(200).json(servicesRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}                   

export const getServicesRequestByServiceId = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const servicesRequest = await ServicesRequest.findAll({ where: { serviceId } });
        res.status(200).json(servicesRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
