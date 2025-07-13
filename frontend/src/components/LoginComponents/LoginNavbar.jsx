import React from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginNavbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            {/* Replace this div with your logo */}
            <img 
              src="/logo.png" 
              alt="DevHire Galaxy Logo" 
              className="w-10 h-10 object-contain cursor-pointer"
              onClick={() => navigate('/')}
            />
            <span onClick={() => navigate('/')} className="text-2xl font-bold text-gray-800 cursor-pointer">
              DevHire Galaxy
            </span>
          </div>
          
          {/* Rest of your component remains the same */}
          <div>
            <button onClick={() => navigate('/login')} className="bg-orange-600 mr-6 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
             Login
            </button>
            <button onClick={() => navigate('/register')} className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
              Register
            </button>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Home</a>
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-orange-600">About</a>
              <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-orange-600">Contact</a>
              <button onClick={() => navigate('/login')} className="w-full mt-2 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="w-full mt-2 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LoginNavbar;
