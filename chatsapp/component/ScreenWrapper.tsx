import { Dimensions, ImageBackground, Platform, StatusBar, StyleSheet, View } from 'react-native'
import React from 'react'
import { ScreenWrapperProps } from '@/types'
import { colors } from '@/constants/theme';

const { height, width } = Dimensions.get("window");

const ScreenWrapper = ({
  children,
  style,
  showPattern = false,
  isModal = false,
  bgOpacity = 1,
  backgroundColor,
}: ScreenWrapperProps & { backgroundColor?: string; isModal?: boolean }) => {
  let paddingTop = Platform.OS === "ios" ? height * 0.06 : 50;
  let paddingBottom = 0;

  if (isModal) {
    paddingTop = Platform.OS === "ios" ? height * 0.02 : height * 0.45;
    paddingBottom = height * 0.2;
  }

  return (
    <ImageBackground
      style={{
        flex: 1,
        backgroundColor: backgroundColor
          ? backgroundColor
          : isModal
          ? colors.white
          : colors.neutral100,
      }}
      imageStyle={{ opacity: showPattern ? bgOpacity : 0 }}
      source={require("../assets/images/bgPattern.png")}
    >
      <View style={[{ flex: 1, paddingTop, paddingBottom }, style]}>
        <StatusBar barStyle="dark-content" />
        {children}
      </View>
    </ImageBackground>
  );
};

export default ScreenWrapper;
