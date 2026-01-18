import { StyleSheet, View } from 'react-native'
import Button from '@/component/Button'
import React from 'react'
import ScreenWrapper from '@/component/ScreenWrapper'
import Typo from '@/component/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter();

    return (
        <ScreenWrapper showPattern={true} backgroundColor={colors.neutral900} bgOpacity={0.05}>
            <View style={styles.container}>
                <View style={{ alignItems: "center" }}>
                    <Typo color={colors.neutral100} size={43} fontWeight={"900"}>Bubbly</Typo>

                </View>
                <Animated.Image
                    entering={FadeInDown.duration(700).springify()}
                    source={require("../../assets/images/welcome.png")}
                    style={styles.welcomeImage}
                    resizeMode={"contain"}
                />
                <View>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        Stay Connected
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        with your friends
                    </Typo>
                    <Typo color={colors.white} size={33} fontWeight={"800"}>
                        and family
                    </Typo>
                    <Button style={{ backgroundColor: colors.white }} onPress={() => router.push("/(auth)/register")}>
                        <Typo size={23} fontWeight={"bold"} color={colors.neutral900}>Get Started</Typo>
                    </Button>
                </View>

            </View>
        </ScreenWrapper>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-around",
        paddingHorizontal: spacingX._20,
        marginTop: spacingY._10,
    },
    background: {
        flex: 1,
        backgroundColor: colors.neutral900,
    },
    welcomeImage: {
        height: verticalScale(300),
        aspectRatio: 1,
        alignSelf: "center",
    }
})