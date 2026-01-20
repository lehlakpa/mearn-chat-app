import { StyleSheet, View } from "react-native";
import React from "react";
import { HeaderProps } from "@/types";
import Typo from "./Typo";
import { colors } from "@/constants/theme";


const Header = ({ title = "", leftIcon, rightIcon, style }: HeaderProps) => {
    return (
        <View style={[styles.container, style]}>
            {/* Left Icon */}
            <View style={styles.leftIcon}>
                {leftIcon && (
                    <View style={leftIcon.style}>
                        {leftIcon.icon}
                    </View>
                )}
            </View>

            {/* Title */}
            {title && (
                <Typo style={styles.title}>
                    {title}
                </Typo>
            )}

            {/* Right Icon */}
            <View style={styles.rightIcon}>
                {rightIcon && (
                    <View style={rightIcon.style}>
                        {rightIcon.icon}
                    </View>
                )}
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: 16,
    },
    title: {
        position: "absolute",
        width: "100%",
        textAlign: "center",
        zIndex: 10,
        fontSize: 18,
        fontWeight: "600",
    },
    leftIcon: {
        alignSelf:"flex-start",
        zIndex:20
    },
    rightIcon: {
        alignSelf: "flex-end",
        zIndex: 20,
    },

});
