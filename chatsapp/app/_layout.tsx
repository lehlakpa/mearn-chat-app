import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/contexts/authcontext'

const StackLayout = () => {
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="index" />
    <Stack.Screen name="(auth)/Welcome" />
    <Stack.Screen name="(auth)/login" />
    <Stack.Screen name="(auth)/register" />
    <Stack.Screen name="(main)/home" />
     <Stack.Screen name="(main)/conversation" />
    <Stack.Screen name="(main)/profileModel" options={{ presentation: 'modal' }} />
    <Stack.Screen name='(main)/newConversationModel'
      options={{ presentation: 'modal' }} />
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