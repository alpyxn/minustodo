import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface User {
    username: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
                setUser({ username: payload.preferred_username });
            } catch (error) {
                console.error('Error parsing token:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return { user, logout };
}