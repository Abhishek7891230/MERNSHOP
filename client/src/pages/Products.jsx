import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../utils/apiClient';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const lastProductElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await apiClient.get(`/api/products?page=${page}&limit=10`);
                setProducts(prevProducts => {
                    // Filter duplicates just in case
                    const newProducts = data.products.filter(p => !prevProducts.some(prev => prev._id === p._id));
                    return [...prevProducts, ...newProducts];
                });
                setHasMore(data.page < data.pages);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [page]);

    return (
        <div className="products-container">
            <h2>Our Products</h2>
            <div className="products-grid">
                {products.map((product, index) => {
                    if (products.length === index + 1) {
                        return <div ref={lastProductElementRef} key={product._id}><ProductCard product={product} /></div>;
                    } else {
                        return <div key={product._id}><ProductCard product={product} /></div>;
                    }
                })}
            </div>
            {loading && <div className="loading">Loading...</div>}
            {!hasMore && <div className="no-more">No more products</div>}
        </div>
    );
};

export default Products;
