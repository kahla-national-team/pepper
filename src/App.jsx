import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Service1 from './pages/Service1';
import Service2 from './pages/Service2';
import ProtectedRoute from './components/ProtectedRoute';
import Calendar from './pages/Calendar';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname === '/';
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="w-full min-h-screen m-0 bg-white flex flex-col">
      {showNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service1" 
            element={
              <ProtectedRoute>
                <Service1 />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service2" 
            element={
              <ProtectedRoute>
                <Service2 />
              </ProtectedRoute>
            } 
          />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
