import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/Profile';
import PlaywrightBasics from './pages/PlaywrightBasics/PlaywrightBasics';
import TypeScriptBasics from './pages/TypeScriptBasics/TypeScriptBasics';
import POM from './pages/POM/POM';

function App() {
  const { currentUser } = useAuth();

  return (
    <Layout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={currentUser ? <Navigate to="/" replace /> : <Register />}
        />

        {/* Protected routes */}
        <Route path="/playwright" element={
          <ProtectedRoute><PlaywrightBasics /></ProtectedRoute>
        } />
        <Route path="/typescript" element={
          <ProtectedRoute><TypeScriptBasics /></ProtectedRoute>
        } />
        <Route path="/pom" element={
          <ProtectedRoute><POM /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
