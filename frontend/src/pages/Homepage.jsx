import React, { useState } from 'react';
import HomePageNavbar from '../Components/HomepageComponents/HomePageNavbar';
import HeroSection from '../Components/HomepageComponents/HeroSection';
import ServicesSection from '../components/HomepageComponents/ServicesSection';
import AboutSection from '../Components/HomepageComponents/AboutSection';
import ContactSection from '../Components/HomepageComponents/ContactSection';
import Footer from '../Components/HomepageComponents/Footer';

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      
        <HomePageNavbar  isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <HeroSection/>
        <ServicesSection/>
        <AboutSection/>
        <ContactSection/>
        <Footer/>

     
    </div>
  );
};

export default Homepage;
