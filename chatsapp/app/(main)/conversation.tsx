import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/component/ScreenWrapper'
import Typo from '@/component/Typo'

const conversation = () => {
  return (
    <ScreenWrapper isModal={true}>
      <Typo>conversation</Typo>
    </ScreenWrapper>
  )
}

export default conversation

const styles = StyleSheet.create({})