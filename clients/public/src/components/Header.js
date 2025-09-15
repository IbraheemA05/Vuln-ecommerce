import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
const { Link } = ReactRouterDOM;

const Header = () => {
    const { user, logout } = useAuth();
    const { cart } = useCart();
    const cartItemCount = cart ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">Vuln<span className="text-gray-800">Store</span></Link>
                </div>
                
                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
                        <li><Link to="/products" className="text-gray-600 hover:text-blue-600">Products</Link></li>
                        <li><Link to="/about" className="text-gray-600 hover:text-blue-600">About</Link></li>
                        <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</Link></li>
                    </ul>
                </nav>

                <div className="flex items-center space-x-4">
                    <button className="text-gray-600 hover:text-blue-600">
                        <i className="fas fa-search"></i>
                    </button>
                    <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
                        <i className="fas fa-shopping-cart"></i>
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
                        )}
                    </Link>
                    <button className="md:hidden text-gray-600">
                        <i className="fas fa-bars"></i>
                    </button>
                    <div className="hidden md:flex items-center space-x-4 ml-4">
                        {user ? (
                            <>
                                <span>Welcome, {user.name}</span>
                                <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
                                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
