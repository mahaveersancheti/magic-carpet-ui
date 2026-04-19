import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Auth/Signin';
import Signup from './pages/Auth/Signup';
import OtpVerification from './pages/Auth/OtpVerification';
import MainLayout from './layouts/MainLayout';
import DashboardHome from './pages/Dashboard/Home';
import ProductList from './pages/Dashboard/Products';
import AddProductPage from './pages/Dashboard/AddProduct';

function App() {
  return (
    <div className="min-h-screen bg-color-bg font-['DM Sans']">
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OtpVerification />} />
        
        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product" element={<AddProductPage />} />
          <Route path="/leads" element={<div className="p-10">Leads Page (Coming Soon)</div>} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
