import { AuthContextProps, UserProps } from "@/types";
import { useState, ReactNode, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, register as registerService } from "../services/authServices";
import jwtDecode from "jwt-decode";
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

    const updateToken = async (token: string) => {
        setToken(token);
        await AsyncStorage.setItem("token", token);

        const decoded = jwtDecode<DecodedTokenProps>(token);

        setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            avatar: decoded.avatar,
        });
    };

    const signIn = async (email: string, password: string) => {
        const response = await login(email, password);
        await updateToken(response.token);
        router.replace("/(main)/home");
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
        <AuthContext.Provider value={{
            token,
            user,
            signIn,
            signUp,
            signOut,
            updateToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
