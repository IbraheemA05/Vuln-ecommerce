import React from 'react';
import * as api from '../services/api';

const CartContext = React.createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    const fetchCart = async () => {
        try {
            const cartData = await api.getCart();
            setCart(cartData);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // Handle case where user has no cart yet or other errors
            setCart({ items: [], total: 0 }); 
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity) => {
        try {
            const updatedCart = await api.addToCart({ productId, quantity });
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to add to cart:", error);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const updatedCart = await api.removeFromCart(productId);
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to remove from cart:", error);
        }
    };

    const updateCartItem = async (productId, quantity) => {
        try {
            const updatedCart = await api.updateCartItem(productId, quantity);
            setCart(updatedCart);
        } catch (error) {
            console.error("Failed to update cart item:", error);
        }
    };

    const value = { cart, loading, fetchCart, addToCart, removeFromCart, updateCartItem };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return React.useContext(CartContext);
};
