import axios from 'axios';

let loadingCounter = 0;
let setLoadingGlobal = null;

export const setGlobalLoadingFunction = (setLoading) => {
  setLoadingGlobal = setLoading;
};

const updateLoadingState = () => {
  if (setLoadingGlobal) {
    setLoadingGlobal(loadingCounter > 0);
  }
};

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    loadingCounter++;
    updateLoadingState();

    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    loadingCounter--;
    updateLoadingState();
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    loadingCounter--;
    updateLoadingState();
    return response;
  },
  (error) => {
    loadingCounter--;
    updateLoadingState();

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axios;
