import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/component/ScreenWrapper'
import Typo from '@/component/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import BackButton from '@/component/BackButton'
import Input from '@/component/Input'
import { useRouter } from 'expo-router'
import Button from '@/component/Button'
import { Ionicons } from '@expo/vector-icons'

const Register = () => {
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!nameRef.current || !emailRef.current || !passwordRef.current) {
            Alert.alert("Sign Up", "All fields are required")
            return
        }
        setIsLoading(true);
        // Simulate API call
        // await registerUser(...)
        setIsLoading(false);
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScreenWrapper isModal={false} showPattern={false} backgroundColor={colors.neutral900}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={20} color={colors.white} />
                        <Typo size={17} color={colors.white}>Need some help?</Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}>
                            <View style={{ gap: spacingY._20 }}>
                                <Typo fontWeight={"800"} size={30}>Let's get started</Typo>
                                <Typo fontWeight={'700'} size={27}>create an account to continue</Typo>
                            </View>
                            <Input
                                icon={<Ionicons name="person" size={26} color={colors.neutral300} />}
                                placeholder='Enter Name'
                                onChangeText={(value: string) => nameRef.current = value}
                            />
                            <Input
                                icon={<Ionicons name="mail" size={26} color={colors.neutral300} />}
                                placeholder='Enter email'
                                onChangeText={(value: string) => emailRef.current = value}
                            />
                            <Input
                                icon={<Ionicons name="lock-closed" size={26} color={colors.neutral300} />}
                                placeholder='Enter password'
                                secureTextEntry
                                onChangeText={(value: string) => passwordRef.current = value}
                            />
                            <Button loading={isLoading} title='signup' onPress={handleSubmit}>
                                <Typo fontWeight={'bold'} color={colors.white} size={21}>Sign Up</Typo>
                            </Button>

                            <View style={styles.footer}>
                                <Typo size={14}>Already have an account? </Typo>
                                <Pressable onPress={() => router.push("/(auth)/login")}>
                                    <Typo size={14} fontWeight={"bold"} color={colors.primaryDark}>Login</Typo>
                                </Pressable>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>

        </KeyboardAvoidingView >
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    header: {
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._10,
        paddingBottom: spacingY._30,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        paddingHorizontal: spacingX._20,
        paddingTop: spacingY._20,
    },
    form: {
        flex: 1,
        gap: spacingY._20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
    }
})