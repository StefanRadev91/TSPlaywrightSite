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
import K6 from './pages/K6/K6';
import Postman from './pages/Postman/Postman';
import QACI from './pages/QACI/QACI';

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

        {/* Content pages (public) */}
        <Route path="/playwright" element={<PlaywrightBasics />} />
        <Route path="/typescript" element={<TypeScriptBasics />} />
        <Route path="/pom" element={<POM />} />
        <Route path="/k6" element={<K6 />} />
        <Route path="/postman" element={<Postman />} />
        <Route path="/qa-ci" element={<QACI />} />

        {/* Protected routes */}
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
}

export default App;
