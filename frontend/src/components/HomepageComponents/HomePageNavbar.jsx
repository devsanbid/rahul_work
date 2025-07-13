import React from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePageNavbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const navigate = useNavigate();
  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
       {/* <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-6"> */}

        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">DG</span>
            </div>
            <span  onClick={() => navigate('/')}  className="text-2xl font-bold text-gray-800">DevHire Galaxy</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-orange-600 transition-colors">Services</a>
            <a href="#about" className="text-gray-700 hover:text-orange-600 transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-orange-600 transition-colors">Contact</a>
            <button onClick={() => navigate('/login')} className="bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
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
              <button  onClick={() => navigate('/login')} className="w-full mt-2 bg-orange-600 text-white px-6 py-2 rounded-full hover:bg-orange-700 transition-colors">
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

export default HomePageNavbar;
