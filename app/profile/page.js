'use client';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Profile from '@/views/Profile/Profile';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
