import React from 'react';
import { useCart } from '../context/CartContext';
const { Link } = ReactRouterDOM;

const ProductCard = ({ id, image, title, price, rating }) => {
    const { addToCart } = useCart();
    return (
        <Link to={`/products/${id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2 truncate">{title}</h3>
                <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <i key={i} className={`fas ${i < Math.floor(rating) ? 'fa-star' : i < rating ? 'fa-star-half-alt' : 'far fa-star'}`}></i>
                        ))}
                    </div>
                    <span className="text-gray-600 ml-2 text-sm">({Math.floor(Math.random() * 200)})</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-blue-600">${price}</span>
                    <button onClick={(e) => { e.preventDefault(); addToCart(id, 1); }} className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm">Add to Cart</button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
