import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { ShoppingCart, ArrowLeft, Star, Plus, Minus } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  const cartItem = items.find(item => item.product.id === product.id);
  const availableStock = product.stock - (cartItem?.quantity || 0);

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

  return (
    <div className="container mt-4">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} className="me-2" />
        Back
      </button>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <img
              src={product.images[selectedImage] || product.thumbnail}
              className="card-img-top"
              alt={product.title}
              style={{ height: '400px', objectFit: 'cover' }}
            />
          </div>

          {product.images.length > 1 && (
            <div className="d-flex gap-2 mt-3">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  className={`img-thumbnail cursor-pointer ${selectedImage === index ? 'border-primary' : ''}`}
                  alt={`${product.title} ${index + 1}`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h1 className="h3 mb-3">{product.title}</h1>

          <div className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center me-4">
              <Star size={20} className="text-warning me-1" fill="currentColor" />
              <span className="fw-bold">{product.rating.toFixed(1)}</span>
            </div>
            <span className="badge bg-primary">{product.brand}</span>
          </div>

          <div className="mb-4">
            <span className="h2 text-success">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="badge bg-danger ms-3 fs-6">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          <div className="mb-4">
            <div className="row">
              <div className="col-sm-6">
                <strong>Category:</strong> {product.category}
              </div>
              <div className="col-sm-6">
                <strong>Stock:</strong> {product.stock} available
              </div>
            </div>
          </div>

          {isAuthenticated ? (
            <>
              <div className="mb-4">
                <label className="form-label">Quantity</label>
                <div className="input-group" style={{ width: '150px' }}>
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

              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={availableStock === 0}
              >
                <ShoppingCart size={20} className="me-2" />
                {availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>

              {cartItem && (
                <div className="mt-3">
                  <span className="badge bg-success fs-6">
                    {cartItem.quantity} items in cart
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <strong>Please login to add items to cart</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
