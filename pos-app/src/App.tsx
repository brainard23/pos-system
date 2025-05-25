import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

// Placeholder components for other routes
const Products = () => <div>Products Page (Coming Soon)</div>;
const Sales = () => <div>Sales Page (Coming Soon)</div>;
const Transactions = () => <div>Transactions Page (Coming Soon)</div>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
