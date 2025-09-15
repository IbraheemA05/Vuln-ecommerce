import React from 'react';

const HeroSection = () => {
    return (
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-10 md:mb-0">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Deals</h1>
                    <p className="text-xl mb-8 opacity-90">Find the latest trends at unbeatable prices. Shop now and save big!</p>
                    <div className="flex space-x-4">
                        <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition">Shop Now</button>
                        <button className="border border-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition">Learn More</button>
                    </div>
                </div>
                <div className="md:w-1/2">
                    <img src="https://picsum.photos/seed/ecommerce-hero/600/400.jpg" alt="E-commerce hero image" className="rounded-lg shadow-lg" />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
