'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="protected-loading">
        <div className="protected-loading__spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return children;
}

export default ProtectedRoute;
