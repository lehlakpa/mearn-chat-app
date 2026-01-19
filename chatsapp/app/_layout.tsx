import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authcontext'

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name='/(main)/profileModel' />
  </Stack>
}

const RootLayout = () => {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  )
}

export default RootLayout;


const styles = StyleSheet.create({})