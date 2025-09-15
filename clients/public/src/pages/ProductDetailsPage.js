import React from 'react';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetailsPage = () => {
    const { id } = ReactRouterDOM.useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p className="text-center py-16">Loading product details...</p>;
    if (error) return <p className="text-center py-16 text-red-500">Error: {error}</p>;
    if (!product) return <p className="text-center py-16">Product not found.</p>;

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={product.imageUrl || `https://picsum.photos/seed/${product._id}/600/600.jpg`} alt={product.name} className="w-full rounded-lg shadow-lg" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price}</p>
                    <p className="text-gray-700 mb-6">{product.description}</p>
                    <button onClick={() => addToCart(product._id, 1)} className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
