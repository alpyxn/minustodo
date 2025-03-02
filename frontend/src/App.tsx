import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import TodoTable from './components/todo-table';
import Dashboard from './components/dashboard';
import LandingPage from './components/landing-page';
import ErrorBoundary from './components/error-boundary';

function App() {
    const { keycloak, initialized } = useKeycloak();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Function to trigger reload by incrementing refreshTrigger
    const handleTasksDeleted = () => {
        setRefreshTrigger(prev => prev + 1);
    };
    
    if (!initialized) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loading loading-spinner loading-lg text-rose-600"></div>
            </div>
        );
    }
    
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                {keycloak.authenticated && <Navbar onTasksDeleted={handleTasksDeleted} />}
                <ErrorBoundary>
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                keycloak.authenticated 
                                    ? <Dashboard refreshTrigger={refreshTrigger} /> 
                                    : <LandingPage />
                            } 
                        />
                        <Route 
                            path="/todos" 
                            element={
                                keycloak.authenticated 
                                    ? <TodoTable refreshTrigger={refreshTrigger} /> 
                                    : <Navigate to="/" replace />
                            } 
                        />
                    </Routes>
                </ErrorBoundary>
            </div>
        </Router>
    );
}

export default App;