import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LoadingProvider, useLoading } from './context/LoadingContext';
import { setGlobalLoadingFunction } from './interceptors/apiInterceptor';
import Navbar from './components/Navbar/Navbar';
import ProductList from './components/Products/ProductList';
import ProductDetail from './components/Products/ProductDetail';
import Cart from './components/Cart/Cart';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import GlobalLoader from './components/Shared/GlobalLoader';
import 'bootstrap/dist/css/bootstrap.min.css';

const RootLayout = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setGlobalLoadingFunction(setLoading);
  }, [setLoading]);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Navbar />
          <main>
            <Outlet />
          </main>
          <GlobalLoader />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

const AuthRedirectWrapper = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProductList />
      },
      {
        path: "products/:id",
        element: <ProductDetail />
      },
      {
        path: "products",
        element: <ProductList />
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        )
      },
      {
        path: "login",
        element: (
          <AuthRedirectWrapper>
            <Login />
          </AuthRedirectWrapper>
        )
      },
      {
        path: "register",
        element: (
          <AuthRedirectWrapper>
            <Register />
          </AuthRedirectWrapper>
        )
      },
      {
        path: "*",
        element: <Navigate to="/" replace />
      }
    ]
  }
]);

const App = () => {
  return (
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>
  );
};

export default App;
