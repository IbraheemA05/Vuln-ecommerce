import React from 'react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
    const { cart, loading, removeFromCart, updateCartItem } = useCart();

    if (loading) {
        return <p className="text-center py-16">Loading cart...</p>;
    }

    if (!cart || cart.items.length === 0) {
        return <p className="text-center py-16">Your cart is empty.</p>;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
                {cart.items.map(item => (
                    <div key={item.product._id} className="flex items-center justify-between py-4 border-b">
                        <div className="flex items-center space-x-4">
                            <img src={item.product.imageUrl || `https://picsum.photos/seed/${item.product._id}/100/100.jpg`} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                            <div>
                                <h2 className="font-semibold">{item.product.name}</h2>
                                <p className="text-gray-600">${item.product.price}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <input 
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateCartItem(item.product._id, parseInt(e.target.value, 10))}
                                className="w-16 text-center border rounded"
                                min="1"
                            />
                            <button onClick={() => removeFromCart(item.product._id)} className="text-red-500 hover:text-red-700">Remove</button>
                        </div>
                    </div>
                ))}
                <div className="mt-6 text-right">
                    <h3 className="text-xl font-bold">Total: ${cart.total}</h3>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
