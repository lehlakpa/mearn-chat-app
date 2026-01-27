import { AuthContextProps, UserProps } from "@/types";
import { useState, useEffect, ReactNode, createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login, register as registerService } from "../services/authServices";
import { jwtDecode } from "jwt-decode";
import { router } from "expo-router";
import { connectSocket, disconnectSocket } from "@/socket/socket";

 

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
         
        loadToken();
    }, []);


    const loadToken = async () => {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode<DecodedTokenProps>(storedToken);
                if (decoded.exp && decoded.exp < Date.now() / 1000) {
                    await AsyncStorage.removeItem("token");

                    gotoWelcome();
                    return;

                }
                setToken(storedToken);
                await connectSocket();
                setUser({
                    id: decoded.id,
                    name: decoded.name,
                    email: decoded.email,
                    avatar: decoded.avatar,
                });
                GotoHome();


            }
            catch (error) {
                gotoWelcome();
                console.log("failed to decode token ", error);
            }
            finally {
                setIsLoading(false);
            }

        } else {
            gotoWelcome();
            setIsLoading(false);
        }
    }

    const GotoHome = () => {
        setTimeout(()=>{
            router.replace("/(main)/home");
        },1500);
    }
    const gotoWelcome = () => {
        setTimeout(() => {
            router.replace("/(auth)/Welcome");
        },1500); 
    }


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
        await connectSocket();
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
        await connectSocket();
        router.replace("/(main)/home");
    };

    const signOut = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem("token");
        disconnectSocket();
        router.replace("/(auth)/Welcome");
    };

    return (
        <AuthContext.Provider value={{ token, user, signIn, signUp, signOut, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);
