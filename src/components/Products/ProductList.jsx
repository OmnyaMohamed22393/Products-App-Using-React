import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductCard from './ProductCard';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, X } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSearchTerm, setLastSearchTerm] = useState('');
  const [shortlistedProducts, setShortlistedProducts] = useState([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.trim() && debouncedSearchTerm !== lastSearchTerm) {
      searchProducts(debouncedSearchTerm);
    } else if (!debouncedSearchTerm.trim() && lastSearchTerm) {
      setFilteredProducts(products);
      setSearchError(null);
      setLastSearchTerm('');
    }
  }, [debouncedSearchTerm, products, lastSearchTerm]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setSearchError(null);
    if (value.trim() && value.trim().length < 2) {
      setSearchError('Please enter at least 2 characters to search');
    } else {
      setSearchError(null);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (query) => {
    try {
      setSearchLoading(true);
      setSearchError(null);
      const data = await productService.searchProducts(query);
      setFilteredProducts(data);
      setLastSearchTerm(query);
      if (data.length === 0) {
        setSearchError(`No products found for "${query}". Try different keywords.`);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleShortlist = (productId) => {
    setShortlistedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchError(null);
    setLastSearchTerm('');
    setFilteredProducts(products);
  };

  const retrySearch = () => {
    if (debouncedSearchTerm.trim()) {
      searchProducts(debouncedSearchTerm);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-outline-danger btn-sm" onClick={fetchProducts}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              {searchLoading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
              ) : (
                <Search size={20} />
              )}
            </span>
            <input
              type="text"
              className={`form-control ${searchError ? 'is-invalid' : ''}`}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={searchLoading}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={clearSearch}
                disabled={searchLoading}
              >
                <X size={20} />
              </button>
            )}
            {searchError && (
              <div className="invalid-feedback">
                {searchError}
              </div>
            )}
          </div>

          {searchError && searchError.includes('No products found') && (
            <div className="mt-2">
              <small className="text-muted">
                Try searching for: "phone", "laptop", "shoes", "watch", or "bag"
              </small>
            </div>
          )}

          {searchError && searchError.includes('Search failed') && (
            <div className="mt-2">
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={retrySearch}
                disabled={searchLoading}
              >
                Retry Search
              </button>
            </div>
          )}
        </div>

        <div className="col-md-6 text-end">
          <div className="d-flex flex-column align-items-end">
            <span className="text-muted">
              {searchTerm.trim() ? (
                <>Showing {filteredProducts.length} results for "{searchTerm}"</>
              ) : (
                <>Showing {filteredProducts.length} products</>
              )}
            </span>
            {searchLoading && (
              <small className="text-primary mt-1">
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                Searching...
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onShortlist={handleShortlist}
            isShortlisted={shortlistedProducts.includes(product.id)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !searchLoading && !searchError && (
        <div className="text-center py-5">
          <Search size={64} className="text-muted mb-3" />
          <h4 className="text-muted mb-2">No products found</h4>
          <p className="text-muted">
            {searchTerm.trim() 
              ? `We couldn't find any products matching "${searchTerm}"`
              : "No products available at the moment"
            }
          </p>
          {searchTerm.trim() && (
            <button className="btn btn-outline-primary mt-3" onClick={clearSearch}>
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
