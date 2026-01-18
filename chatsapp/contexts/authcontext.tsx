import { AuthContextProps, UserProps } from "@/types";
import { useState, useEffect, ReactNode, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, register as registerService } from "../services/authServices";
import {jwtDecode}from "jwt-decode";
import { router } from "expo-router";


/* 🔹 JWT payload type */
type DecodedTokenProps = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  exp: number;
};


export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    signIn: async () => { },
    signUp: async () => { },
    signOut: async () => { },
    updateToken: async () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProps | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem("token");
                if (storedToken) {
                    const decoded = jwtDecode<DecodedTokenProps>(storedToken);
                    // Check if expired (exp is in seconds, Date.now() is in ms)
                    if (decoded.exp * 1000 < Date.now()) {
                        await AsyncStorage.removeItem("token");
                        setToken(null);
                        setUser(null);
                    } else {
                        setToken(storedToken);
                        setUser({
                            id: decoded.id,
                            name: decoded.name,
                            email: decoded.email,
                            avatar: decoded.avatar,
                        });
                        router.replace('/(main)/home');
                    }
                }
            } catch (error) {
                console.error("Failed to load token:", error);
                await AsyncStorage.removeItem("token");
                setToken(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const updateToken = async (token: string) => {
        try {
            const decoded = jwtDecode<DecodedTokenProps>(token);
            setToken(token);
            setUser({
                id: decoded.id,
                name: decoded.name,
                email: decoded.email,
                avatar: decoded.avatar,
            });
            await AsyncStorage.setItem("token", token);
        } catch (error) {
            console.error("Failed to decode token:", error);
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        const response = await login(email, password);
        await updateToken(response.token);
        router.replace('/(main)/home');
    };

    const signUp = async (
        email: string,
        password: string,
        name: string,
        avatar?: string
    ) => {
        const response = await registerService(email, password, name, avatar || null);
        await updateToken(response.token);
        router.replace("/(main)/home");
    };

    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/Welcome");
    };

    return (
        <AuthContext.Provider value={{ token, user, signIn, signUp, signOut, updateToken }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
