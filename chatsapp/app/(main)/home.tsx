import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Typo from '@/component/Typo'
import ScreenWrapper from '@/component/ScreenWrapper'
import { useAuth } from '@/contexts/authcontext'
import Button from '@/component/Button'

const home = () => {
  const {user,signOut}=useAuth();
  console.log(user);

  const handleLogout = async () => {
    await signOut();
  };
  return (
    <ScreenWrapper isModal={false} showPattern={false}>
        <Typo>hey lakpa </Typo>

        <Button onPress={handleLogout}>
          <Typo>logout</Typo>
        </Button>
    </ScreenWrapper>
  )
}

export default home

const styles = StyleSheet.create({})