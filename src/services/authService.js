import axios from '../interceptors/apiInterceptor';

export const authService = {
  async login(credentials) {
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  async register(userData) {
    try {
      // Since DummyJSON doesn't have a register endpoint, we'll simulate it
      const response = await axios.post('https://dummyjson.com/users/add', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        gender: userData.gender,
      });

      // Simulate a token for registration
      const user = {
        ...response.data,
        token: 'dummy-token-' + Date.now()
      };

      return user;
    } catch (error) {
      throw new Error('Registration failed. Please try again.');
    }
  }
};
