import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/component/ScreenWrapper';
import { colors, spacingY } from '@/constants/theme';
import Header from '@/component/Header';
import { Platform } from 'react-native';
import BackButton from '@/component/BackButton';

const ProfileModel = () => {
  return (
    <ScreenWrapper isModal={true} showPattern={true}>
      <View style={styles.container}>
        <Header title={"update profile"}
          leftIcon={
            Platform.OS == "ios" ? { icon: <BackButton color={colors.black} /> } : undefined
          } />

      </View>
    </ScreenWrapper>
  )
}

export default ProfileModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,

  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  }

})