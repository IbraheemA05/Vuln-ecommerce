import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProducts from '../components/FeaturedProducts';
import WhyChooseUs from '../components/WhyChooseUs';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <FeaturedProducts />
            <WhyChooseUs />
            <Testimonials />
            <Newsletter />
        </>
    );
};

export default HomePage;
