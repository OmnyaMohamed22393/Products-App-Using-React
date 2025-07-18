import React from 'react';
import { useLoading } from '../../context/LoadingContext';

export default function GlobalLoader () {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50" style={{ zIndex: 9999 }}>
      <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};


