import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Building the Future of Developer Hiring
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              DevHire Galaxy revolutionizes how companies find and hire top development talent. 
              Our platform connects businesses with skilled developers across the galaxy, 
              making remote collaboration seamless and efficient.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Over 10,000 verified developers</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">Average matching time: 48 hours</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-gray-700">98% client satisfaction rate</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-8 rounded-xl shadow-xl">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">10K+</div>
                  <div className="text-sm text-gray-600">Developers</div>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">500+</div>
                  <div className="text-sm text-gray-600">Companies</div>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="bg-orange-100 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
