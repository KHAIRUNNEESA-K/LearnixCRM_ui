import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('learnix_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('learnix_user', JSON.stringify(userData));
        if (token) localStorage.setItem('learnix_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('learnix_user');
        localStorage.removeItem('learnix_token');
    };

    const updateProfile = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('learnix_user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
