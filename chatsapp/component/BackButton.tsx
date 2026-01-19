import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { colors } from '@/constants/theme'
import { BackButtonProps } from '@/types'
import Ionicons from '@expo/vector-icons/Ionicons';

export const BackButton = ({
    style, iconSize = 26, color = colors.text
}: BackButtonProps & { iconSize?: number }) => {
    const router = useRouter();
    return (
        <TouchableOpacity onPress={() => router.back()} style={[styles.button, style]}>
            <Ionicons name="caret-back-outline" size={iconSize} color={color} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 20, // Optional: for touch feedback shape
        backgroundColor: 'rgba(0,0,0,0.07)' // Optional: subtle background
    }
})