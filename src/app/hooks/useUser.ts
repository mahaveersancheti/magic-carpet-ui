import { useState, useEffect } from 'react';
import { decodeToken, UserTokenPayload } from '../utils/jwt';

export const useUser = () => {
    const [user, setUser] = useState<UserTokenPayload | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = () => {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = decodeToken(token);
                    setUser(decoded);
                }
            }
            setIsLoading(false);
        };

        fetchUser();

        // Optional: Listen for storage changes if token changes in another tab
        const handleStorageChange = () => fetchUser();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return { user, isLoading };
};
