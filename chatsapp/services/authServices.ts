import axios, { AxiosError } from "axios";
import { API_URL } from "../constants";

export const login = async (
    email: string,
    password: string
): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email,
            password,
        });

        return response.data;
    } catch (error) {
        const err = error as AxiosError<any>;
        console.error(err);

        const msg =
            err.response?.data?.message || "Login failed";

        throw new Error(msg);
    }
};

export const register = async (
    email: string,
    password: string,
    name: string,
    avatar?: string | null
): Promise<{ token: string }> => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            name,
            avatar,
            email,
            password,
        });

        return response.data;
    } catch (error) {
        const err = error as AxiosError<any>;
        console.error(err);

        const msg =
            err.response?.data?.message || "Registration failed";

        throw new Error(msg);
    }
};
