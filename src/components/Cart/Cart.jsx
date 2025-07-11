import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <ShoppingBag size={64} className="text-muted mb-3" />
          <h3 className="text-muted">Your cart is empty</h3>
          <p className="text-muted">Add some products to get started</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Shopping Cart</h3>
            <button className="btn btn-outline-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </div>

          {items.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.product.thumbnail}
                    className="img-fluid rounded-start h-100"
                    alt={item.product.title}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="card-title">{item.product.title}</h5>
                        <p className="card-text text-muted">
                          {item.product.description.substring(0, 100)}...
                        </p>
                        <p className="card-text">
                          <strong>${item.product.price}</strong>
                        </p>
                      </div>
                      <button
                        className="btn btn-outline-danger btn-sm h-fit"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <div className="input-group" style={{ width: '150px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                          }
                          min="1"
                          max={item.product.stock}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-end">
                        <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Order Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Items ({items.reduce((total, item) => total + item.quantity, 0)})</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>${getCartTotal().toFixed(2)}</strong>
              </div>
              <button className="btn btn-primary w-100">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
