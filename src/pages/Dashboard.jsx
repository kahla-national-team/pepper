"use client"
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Stays from './Stays';
import Services from './Services';
import { useMapVisibility } from '../context/MapVisibilityContext';
import ServiceMap from '../components/ServiceMap';
import MapToggleWrapper from '../components/MapToggleWrapper';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [service, setService] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isMapVisible } = useMapVisibility();

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/check');
        setIsAuthenticated(res.data.authenticated);
        if (!res.data.authenticated) navigate('/login');
      } catch (err) {
        console.error('Erreur auth:', err);
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  // Récupère les infos du service et stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceRes = await axios.get('/api/user/service');
        setService(serviceRes.data);

        const statsRes = await axios.get('/api/user/stats');
        setStats(statsRes.data);

        setLoading(false);
      } catch (err) {
        console.error('Erreur API:', err);
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Vues" value={stats.views} />
          <StatCard label="Réservations" value={stats.bookings} />
          <StatCard label="Clients" value={stats.clients} />
        </div>
      )}

      {/* Service hébergé */}
      {service ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Votre service : {service.type === 'skani' ? 'Hébergement Skani' : 'Service Khidma'}
          </h2>
          {service.type === 'skani' ? <Stays /> : <Services />}
        </div>
      ) : (
        <p className="text-gray-600 mb-8">Vous n'avez encore hébergé aucun service.</p>
      )}

      {/* Recent Activity with Map */}
      <div className="relative">
        <MapToggleWrapper>
          <ServiceMap />
        </MapToggleWrapper>
        
        <div className={`grid gap-6 ${isMapVisible ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Stays</h2>
            <Stays />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Recent Services</h2>
            <Services />
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white shadow rounded-xl p-4 text-center">
    <div className="text-xl font-bold">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

export default Dashboard;
