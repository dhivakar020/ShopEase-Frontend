// src/App.js
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CategoriesDisplay from './pages/CategoriesDisplay';
import ProductsPage from './pages/ProductsPage';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import CustomAdminPage from './pages/CustomAdminPage';
function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ margin: 0, padding: 0 }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route path="/" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <HomePage />
                </>
              </PrivateRoute>
            } />
            
            <Route path="/categories" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <CategoriesDisplay />
                </>
              </PrivateRoute>
            } />
             <Route path="/cart" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <CartPage />
                </>
              </PrivateRoute>
            } />
            <Route path="/products" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <ProductsPage />
                </>
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <ProfilePage />
                </>
              </PrivateRoute>
            } />
            <Route path="/customAdmin" element={
              <PrivateRoute>
                <>
                  <Navbar />
                  <CustomAdminPage />
                </>
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;