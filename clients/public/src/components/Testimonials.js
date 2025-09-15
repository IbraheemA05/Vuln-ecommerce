import React from 'react';

const Testimonials = () => {
    const testimonials = [
        { id: 1, name: "Sarah Johnson", avatar: "https://picsum.photos/seed/user1/60/60.jpg", comment: "The wireless headphones I bought exceeded my expectations! Great sound quality and comfortable fit.", rating: 5 },
        { id: 2, name: "Michael Chen", avatar: "https://picsum.photos/seed/user2/60/60.jpg", comment: "Fast shipping and excellent customer service. Will definitely shop here again!", rating: 5 },
        { id: 3, name: "Emily Rodriguez", avatar: "https://picsum.photos/seed/user3/60/60.jpg", comment: "Great deals and wide selection of products. My go-to online store for electronics!", rating: 5 }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Hear what people are saying about their experience shopping with us.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex items-center mb-4">
                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-semibold">{testimonial.name}</h4>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <i key={i} className="fas fa-star"></i>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 italic">\"{testimonial.comment}\"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
