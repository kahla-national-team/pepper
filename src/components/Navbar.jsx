import { Link } from 'react-router-dom';
import logo from '../assets/logo-nav.svg';
import Button from './Button';

const Navbar = () => {
  return (
    <nav className="bg-white text-black p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-gray-300">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="space-x-4">
          <Link to="/service1" className="hover:text-gray-200">Stays</Link>
          <Link to="/service2" className="hover:text-gray-200">Services</Link>
        </div>
        <div className="space-x-8">
          <Link to="/dashboard" className="hover:text-gray-300">host service</Link>
          <Link to="/login" className="hover:text-gray-300">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
