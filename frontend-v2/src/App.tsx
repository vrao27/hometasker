import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';   
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Scoreboard from './pages/Scoreboard';
import Settings from './pages/Settings';
import About from './pages/About';
import AddTask from './pages/AddTask';
import ProtectedRoute from './components/ProtectedRoutes';
import { getToken } from './services/authService'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';  

function App() {

   const isLoggedIn = Boolean(getToken());

  return (
    <Router>
       {/* ← Show navbar only after login */}
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/scoreboard" element={<ProtectedRoute><Scoreboard /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
        <Route path="*"  element={
            isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
          } /> 


      </Routes>
    </Router>
  );
}

export default App;
