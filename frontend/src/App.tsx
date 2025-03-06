import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { useState } from 'react';
import Navbar from './components/navbar';
import TodoTable from './components/todo-table';
import Dashboard from './components/dashboard';
import LandingPage from './components/landing-page';
import ErrorBoundary from './components/error-boundary';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/" replace />;
};

const App = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTasksDeleted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg text-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && <Navbar onTasksDeleted={handleTasksDeleted} />}
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Dashboard refreshTrigger={refreshTrigger} />} />
          <Route path="/todos" element={<ProtectedRoute element={<TodoTable refreshTrigger={refreshTrigger} />} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;