import React from 'react';
import { login as apiLogin, signup as apiSignup } from '../services/api';
import { useCart } from './CartContext';

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState(() => localStorage.getItem('token'));
    const { fetchCart } = useCart();

    React.useEffect(() => {
        if (token) {
            // Here you would typically fetch user data based on the token
            // For now, we'll just set a placeholder user if a token exists.
            setUser({ name: 'Authenticated User' });
            fetchCart();
        } else {
            setUser(null);
        }
    }, [token]);

    const login = async (credentials) => {
        const response = await apiLogin(credentials);
        localStorage.setItem('token', response.token);
        setToken(response.token);
        // You might get user data back from the login response
        setUser(response.user || { name: 'Authenticated User' });
        fetchCart();
    };

    const signup = async (userData) => {
        const response = await apiSignup(userData);
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response.user || { name: 'New User' });
        fetchCart();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, login, signup, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};
