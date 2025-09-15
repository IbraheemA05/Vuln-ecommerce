import React from 'react';
import { getProducts } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
    const [products, setProducts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Our Products</h1>
                <p className="text-gray-600 mt-4">Browse our collection of high-quality products.</p>
            </div>

            {loading && <p className="text-center">Loading products...</p>}
            {error && <p className="text-center text-red-500">Error: {error}</p>}
            
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <ProductCard 
                            key={product._id}
                            id={product._id}
                            image={product.imageUrl || `https://picsum.photos/seed/${product._id}/300/300.jpg`}
                            title={product.name}
                            price={product.price}
                            rating={product.averageRating || 4}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
