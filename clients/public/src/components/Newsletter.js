import React from 'react';

const Newsletter = () => {
    return (
        <section className="bg-blue-600 py-16">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
                <p className="text-blue-100 mb-8 max-w-2xl mx-auto">Stay updated with our latest promotions, new arrivals, and exclusive offers.</p>
                
                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button type="submit" className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition">Subscribe</button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
