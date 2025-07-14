import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t-4 border-gray-800 mt-8 pt-8 text-center text-black bg-white">
      <div className="flex justify-center space-x-6 mb-4">
        <a 
          href="https://github.com/devrahul7/DevHire-Galaxy.git" 
          aria-label="Visit our GitHub profile" 
          className="hover:text-gray-600 transition-colors duration-300"
        >
          <Github size={24} />
        </a>
        <a 
          href="https://linkedin.com" 
          aria-label="Connect with us on LinkedIn" 
          className="hover:text-gray-600 transition-colors duration-300"
        >
          <Linkedin size={24} />
        </a>
        <a 
          href="https://twitter.com" 
          aria-label="Follow us on Twitter" 
          className="hover:text-gray-600 transition-colors duration-300"
        >
          <Twitter size={24} />
        </a>
      </div>
      <p className="text-lg font-semibold">
        &copy; 2025 DevHire Galaxy. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
