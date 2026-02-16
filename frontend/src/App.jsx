import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Drives from './pages/Drives';
import DriveDetails from './pages/DriveDetails';
import MyApplications from './pages/MyApplications';
import AddDrive from './pages/AddDrive';
import EmailParser from './pages/EmailParser';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/drives" element={
            <PrivateRoute>
              <Drives />
            </PrivateRoute>
          } />
          
          <Route path="/drives/add" element={
            <PrivateRoute>
              <AddDrive />
            </PrivateRoute>
          } />
          
          <Route path="/drives/parse-email" element={
            <PrivateRoute>
              <EmailParser />
            </PrivateRoute>
          } />
          
          <Route path="/drives/:id" element={
            <PrivateRoute>
              <DriveDetails />
            </PrivateRoute>
          } />
          
          <Route path="/my-applications" element={
            <PrivateRoute>
              <MyApplications />
            </PrivateRoute>
          } />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
