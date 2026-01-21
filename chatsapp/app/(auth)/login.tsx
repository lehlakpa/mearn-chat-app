import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/component/ScreenWrapper'
import Typo from '@/component/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import{BackButton} from '@/component/BackButton'
import Input from '@/component/Input'
import { useRouter } from 'expo-router'
import Button from '@/component/Button'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/contexts/authcontext'

const Login = () => {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { signIn } = useAuth();

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Login", "All fields are required")
            return
        }
        try {
            setIsLoading(true);
            await signIn(emailRef.current, passwordRef.current);
        } catch (error: any) {
            Alert.alert("Loginfailed Error", error.message)

        } finally {
            setIsLoading(false);
        }
    }
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScreenWrapper isModal={false} showPattern={false} backgroundColor={colors.neutral900}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <BackButton iconSize={20} color={colors.white} />
                        <Typo size={17} color={colors.white}>Forgot your password</Typo>
                    </View>
                    <View style={styles.content}>
                        <ScrollView contentContainerStyle={styles.form}
                            showsVerticalScrollIndicator={false}>
                            <View style={{ gap: spacingY._20 }}>
                                <Typo fontWeight={"800"} size={30}>Get Started</Typo>
                                <Typo fontWeight={'700'} size={27}>Enter your details to Access</Typo>
                            </View>

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
                                <Typo fontWeight={'bold'} color={colors.white} size={21}>login</Typo>
                            </Button>

                            <View style={styles.footer}>
                                <Typo size={14}>Dont have an account ?</Typo>
                                <Pressable onPress={() => router.push("/(auth)/register")}>
                                    <Typo size={14} fontWeight={"bold"} color={colors.primaryDark}>signup</Typo>
                                </Pressable>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </ScreenWrapper>

        </KeyboardAvoidingView >
    )
}

export default Login

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