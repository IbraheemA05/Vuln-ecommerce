import React from 'react';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
    const products = [
        { id: 1, title: "Wireless Headphones", price: "89.99", image: "https://picsum.photos/seed/headphones/300/300.jpg", rating: 4.5 },
        { id: 2, title: "Smart Watch", price: "199.99", image: "https://picsum.photos/seed/watch/300/300.jpg", rating: 5 },
        { id: 3, title: "Bluetooth Speaker", price: "59.99", image: "https://picsum.photos/seed/speaker/300/300.jpg", rating: 4 },
        { id: 4, title: "Laptop Stand", price: "29.99", image: "https://picsum.photos/seed/stand/300/300.jpg", rating: 4.5 }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Products</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Explore our handpicked selection of trending items that customers love.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id}
                            id={product.id}
                            image={product.image}
                            title={product.title}
                            price={product.price}
                            rating={product.rating}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
