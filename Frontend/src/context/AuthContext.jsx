import React, { createContext, useContext, useState, useEffect } from "react";
import { Api, sessionStore, sessionRemove, handleApiError } from "../components/common/Api/api";
import { useToast } from "../components/common/Toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        // Load user from sessionStorage on mount
        const storedUser = sessionStorage.getItem("users");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await Api.post("/auth/login", { email, password });
            const { token, user: userData } = response.data.data;
            
            // The userData object now includes 'role' from the updated backend
            sessionStore(token, userData);
            setUser(userData);
            addToast("Login successful!", "success");
            return true;
        } catch (error) {
            handleApiError(error, null, addToast);
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await Api.post("/auth/register", { username, email, password });
            addToast("Registration successful! Please login.", "success");
            return true;
        } catch (error) {
            handleApiError(error, null, addToast);
            return false;
        }
    };

    const logout = () => {
        sessionRemove();
        setUser(null);
        addToast("Logged out successfully", "info");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
