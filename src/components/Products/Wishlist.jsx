import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from './ProductCard'

export default function Wishlist () {
    const wishlist = useSelector((state) => state.wishlist);

    return (
        <div className="container my-4">
            <h2 className="mb-4">My Wishlist ❤️</h2>

            {wishlist.length === 0 ? (
                <p className="text-muted">Your wishlist is empty.</p>
            ) : (
                <div className="row">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

