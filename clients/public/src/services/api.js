const BASE_URL = '/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

const apiFetch = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
    });

    return handleResponse(response);
};

export const getProducts = () => apiFetch('/products/all');

export const getProductById = (id) => apiFetch(`/products/${id}`);

export const login = (credentials) => {
    return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const signup = (userData) => {
    return apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

// Cart API
export const getCart = () => apiFetch('/cart');

export const addToCart = (item) => {
    return apiFetch('/cart/add', {
        method: 'POST',
        body: JSON.stringify(item),
    });
};

export const removeFromCart = (productId) => {
    return apiFetch('/cart/remove', {
        method: 'POST',
        body: JSON.stringify({ productId }),
    });
};

export const updateCartItem = (productId, quantity) => {
    return apiFetch('/cart/update', {
        method: 'PUT',
        body: JSON.stringify({ productId, quantity }),
    });
};
