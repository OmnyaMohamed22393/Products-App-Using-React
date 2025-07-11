import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShoppingCart, Heart, Star, Plus, Minus } from 'lucide-react';

const ProductCard = ({ 
  product, 
  onShortlist, 
  isShortlisted = false 
}) => {
  const { addToCart, items } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const cartItem = items.find(item => item.product.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);
  const isInCart = !!cartItem;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (isAuthenticated && availableStock > 0) {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleShortlist = () => {
    if (onShortlist) {
      onShortlist(product.id);
    }
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="position-relative">
          <img
            src={product.thumbnail}
            className="card-img-top"
            alt={product.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <button
            className={`btn btn-sm position-absolute top-0 end-0 m-2 ${isShortlisted ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={handleShortlist}
          >
            <Heart size={16} fill={isShortlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.title}</h5>
          <p className="card-text text-muted small flex-grow-1">
            {product.description.substring(0, 100)}...
          </p>
          
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex align-items-center me-3">
              <Star size={16} className="text-warning me-1" fill="currentColor" />
              <span className="small">{product.rating.toFixed(1)}</span>
            </div>
            <span className="small text-muted">Stock: {product.stock}</span>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="h5 text-success mb-0">${product.price}</span>
              {product.discountPercentage > 0 && (
                <span className="badge bg-danger ms-2">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>
          </div>
          
          {isAuthenticated && (
            <div className="mb-3">
              <div className="input-group input-group-sm">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={availableStock}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= availableStock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
          
          <div className="d-flex gap-2">
            <Link
              to={`/products/${product.id}`}
              className="btn btn-outline-primary btn-sm flex-grow-1"
            >
              View Details
            </Link>
            
            {isAuthenticated ? (
              <button
                className="btn btn-primary btn-sm flex-grow-1"
                onClick={handleAddToCart}
                disabled={availableStock === 0}
              >
                <ShoppingCart size={16} className="me-1" />
                {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary btn-sm flex-grow-1"
              >
                Login to Buy
              </Link>
            )}
          </div>
          
          {isInCart && (
            <div className="mt-2">
              <span className="badge bg-success">
                {cartItem.quantity} in cart
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
