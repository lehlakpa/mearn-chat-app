import { Router } from "expo-router";
import { ReactNode } from "react"; // 4.6k (gzipped: 1.9k)
import {
    TextInput,
    TextInputProps,
    TextProps,
    TextStyle,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;
};
export type BackButtonProps = {
    style?: ViewStyle;
    color?: string;
    iconSize: number;
};
export type AvatarProps = {
    size?: number;
    uri?: string;
    style?: ViewStyle;
    isGroup?: boolean;
}

export type HeaderProps = {
    title?: String;
    style?: ViewStyle;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;


}
export interface UserDataProps {
    name: string;
    email: string;
    avatar?: string | null;
}

export interface UserProps {
    email: string;
    name: string;
    avatar?: string | null;
    id?: string;
    // Add any additional fields from the token payload as needed
}
export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
    label?: string;
    iconStyle?: TextStyle;
    error?: string;

}

export interface DecodedTokenProps {
    user: UserProps;
    exp: number;
    iat: number;

}

export type AuthContextProps = {
    token: string | null;
    user: UserProps | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (
        email: string,
        password: string,
        name: string,
        avatar?: string
    ) => Promise<void>;
    signOut: () => Promise<void>;
    updateToken: (token: string) => Promise<void>;
}
export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    isModal: boolean;
    showPattern?: boolean;
    bgOpacity?: number;
}

export type ResponseProps = {
    success: boolean;
    data?: any;
    msg?: string;
}