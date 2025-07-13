import React from 'react';
import { Zap, Users, Star, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive development solutions tailored to your business needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-orange-600 mb-4">
              <span className="text-2xl">&lt;/&gt;</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Frontend Development</h3>
            <p className="text-gray-600 mb-4">React, Vue, Angular experts for stunning user interfaces</p>
            <button className="text-orange-600 font-semibold flex items-center hover:text-orange-700 transition-colors">
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-orange-600 mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Backend Development</h3>
            <p className="text-gray-600 mb-4">Node.js, Python, Java specialists for robust server solutions</p>
            <button className="text-orange-600 font-semibold flex items-center hover:text-orange-700 transition-colors">
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-orange-600 mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Full Stack Solutions</h3>
            <p className="text-gray-600 mb-4">Complete development teams for end-to-end project delivery</p>
            <button className="text-orange-600 font-semibold flex items-center hover:text-orange-700 transition-colors">
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-xl hover:shadow-lg transition-all transform hover:scale-105">
            <div className="text-orange-600 mb-4">
              <Star className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Mobile Development</h3>
            <p className="text-gray-600 mb-4">iOS, Android, and cross-platform mobile app developers</p>
            <button className="text-orange-600 font-semibold flex items-center hover:text-orange-700 transition-colors">
              Learn More <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
