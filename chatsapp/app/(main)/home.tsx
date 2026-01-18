import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Typo from '@/component/Typo'
import ScreenWrapper from '@/component/ScreenWrapper'

const home = () => {
  return (
    <ScreenWrapper isModal={false} showPattern={false}>
        <Typo>home</Typo>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({})