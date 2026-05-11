import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Flights from './pages/Flights';
import FlightDetail from './pages/FlightDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import MyBookings from './pages/MyBookings';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route bảo vệ - chỉ cho admin vào
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Route bảo vệ - phải đăng nhập
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/:id" element={<FlightDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment/:flightId" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/payment-success" element={<PrivateRoute><PaymentSuccess /></PrivateRoute>} />
            <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
      {/* Toast notification toàn app */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}