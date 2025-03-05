import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCheckDouble, FaTrash, FaChevronDown } from 'react-icons/fa';
import { keycloak } from '../auth/auth';
import { deleteAllTasks } from '../api/api';

interface User {
    username: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    const logout = () => {
        setUser(null);
    };

    return { user, logout };
}

function Navbar({ onTasksDeleted = () => {} }) {
    const isAuthenticated = keycloak.authenticated;
    const username = keycloak.tokenParsed?.preferred_username;
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLogout = () => {
        keycloak.logout();
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDeleteAllTasks = async () => {
        setShowConfirmation(false);
        setIsDeleting(true);
        try {
            await deleteAllTasks();
            // Trigger re-render after successful deletion
            onTasksDeleted();
            // You could add a notification or toast here to confirm success
        } catch (error) {
            console.error('Failed to delete all tasks:', error);
            // You could add error notification here
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link 
                            to="/" 
                            className="flex items-center space-x-2 text-white hover:text-rose-400 transition-colors"
                        >
                            <FaCheckDouble className="text-2xl text-rose-500" />
                            <span className="text-xl font-bold">Todo App</span>
                        </Link>
                    </div>

                    {/* User Section */}
                    {isAuthenticated && username && (
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button 
                                    onClick={toggleDropdown}
                                    className="flex items-center space-x-2 text-gray-300 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
                                >
                                    <FaUser className="text-rose-400" />
                                    <span className="font-medium">{username}</span>
                                    <FaChevronDown className={`ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg z-10 py-2">
                                        <button 
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setShowConfirmation(true);
                                            }}
                                            className="flex items-center px-4 py-2 text-white hover:bg-slate-600 w-full text-left"
                                            disabled={isDeleting}
                                        >
                                            <FaTrash className="mr-2 text-rose-400" />
                                            <span>Delete All Tasks</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 text-white bg-rose-600 rounded-lg 
                                         hover:bg-rose-500 transition-colors duration-200 font-medium
                                         focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 
                                         focus:ring-offset-slate-800"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete All</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to delete all tasks? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAllTasks}
                                className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete All'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;