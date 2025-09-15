import React from 'react';

const WhyChooseUs = () => {
    const features = [
        { icon: "fas fa-shipping-fast", title: "Fast Shipping", description: "Get your orders delivered quickly and efficiently across the country." },
        { icon: "fas fa-headset", title: "24/7 Support", description: "Our dedicated support team is always ready to help you with any questions." },
        { icon: "fas fa-undo-alt", title: "Easy Returns", description: "Not satisfied? Return your purchase within 30 days for a full refund." }
    ];

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose VulnStore?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">We provide exceptional service and quality products to ensure your satisfaction every time you shop with us.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-blue-600 text-4xl mb-4">
                                <i className={feature.icon}></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
