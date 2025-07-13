import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">DH</span>
              </div>
              <span className="text-xl font-bold">DevHire Galaxy</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting the best developers with innovative companies across the galaxy.
            </p>
            <div className="flex space-x-4">
              <div className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors">
                <Github className="w-5 h-5" />
              </div>
              <div className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors">
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Frontend Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Backend Development</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Full Stack Solutions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mobile Development</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DevHire Galaxy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
