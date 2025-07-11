import axios from '../interceptors/apiInterceptor';

// Create a cancel token source for search requests
let searchCancelToken = null;

export const productService = {
  async getProducts() {
    try {
      const response = await axios.get('https://dummyjson.com/products?limit=100');
      return response.data.products;
    } catch (error) {
      throw new Error('Failed to fetch products');
    }
  },

  async getProductById(id) {
    try {
      const response = await axios.get(`https://dummyjson.com/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch product details');
    }
  },

  async searchProducts(query) {
    try {
      // Cancel previous search request if it exists
      if (searchCancelToken) {
        searchCancelToken.cancel('New search initiated');
      }

      // Validate search query
      if (!query || query.trim().length < 2) {
        throw new Error('Search query must be at least 2 characters long');
      }

      // Sanitize search query
      const sanitizedQuery = query.trim().replace(/[<>]/g, '');

      // Create new cancel token
      searchCancelToken = axios.CancelToken.source();

      const response = await axios.get(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(sanitizedQuery)}`,
        { cancelToken: searchCancelToken.token }
      );

      searchCancelToken = null;
      return response.data.products;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Request was cancelled, don't throw error
        return [];
      }

      if (error instanceof Error && error.message.includes('characters long')) {
        throw error;
      }

      throw new Error('Failed to search products. Please try again.');
    }
  }
};
