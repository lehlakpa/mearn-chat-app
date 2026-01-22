import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native'
import React, { useEffect, useState } from 'react'

import ScreenWrapper from '@/component/ScreenWrapper'
import Header from '@/component/Header'
import { BackButton } from '@/component/BackButton'
import { Avatar } from '@/component/Avatar'
import Typo from '@/component/Typo'
import Input from '@/component/Input'
import Button from '@/component/Button'

import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { useAuth } from '@/contexts/authcontext'
import { UserDataProps } from '@/types'

const profileModel = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const [userdata, setUserdata] = useState<UserDataProps>({
    name: '',
    email: '',
    avatar: null,
  })

  useEffect(() => {
    if (user) {
      setUserdata({
        name: user.name ?? '',
        email: user.email ?? '',
        avatar: user.avatar ?? null,
      })
    }
  }, [user])

  const handleSubmit = () => {
    setLoading(true)
    console.log('Updated User Data:', userdata)
    setLoading(false)
  }

  const handleLogout = () => {
    console.log('Logout pressed')
  }

  return (
    <ScreenWrapper isModal={false}>
      <View style={styles.container}>
        <Header
          title="Update Profile"
          leftIcon={
            Platform.OS === 'android'
              ? <BackButton iconSize={20} color={colors.black} />
              : null
          }
          style={{ marginVertical: spacingY._15 }}
        />

        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Avatar uri={userdata.avatar ?? undefined} size={170} />

            <TouchableOpacity style={styles.editIcon}>
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Typo style={{ paddingLeft: spacingX._20 }}>Email</Typo>
            <Input
              value={userdata.email}
              editable={false}
              containerStyle={{
                borderColor: colors.neutral300,
                paddingLeft: spacingX._20,
              }}
            />
          </View>

          {/* Name */}
          <View style={styles.inputContainer}>
            <Typo style={{ paddingLeft: spacingX._20 }}>Name</Typo>
            <Input
              value={userdata.name}
              containerStyle={{
                borderColor: colors.neutral300,
                paddingLeft: spacingX._20,
              }}
              onChange={(value) =>
                setUserdata({ ...userdata, name: value.nativeEvent.text })
              }
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            style={{ flex: 1 }}
            onPress={handleSubmit}
            loading={loading}
          >
            <Text>Update</Text>
          </Button>

          <Button
            onPress={handleLogout}
            style={{
              backgroundColor: colors.rose,
              height: verticalScale(56),
              width: verticalScale(56),
            }}
          >
            <Text>Logout</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default profileModel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacingY._20,
  },

  form: {
    gap: spacingY._20,
    marginTop: spacingY._15,
  },

  avatarContainer: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: spacingY._20,
  },

  editIcon: {
    position: 'absolute',
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    padding: spacingY._7,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  inputContainer: {
    gap: spacingY._7,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacingY._20,
    paddingTop: spacingY._15,
    gap: scale(20),
    borderTopColor: colors.neutral200,
    borderTopWidth: 1,
  },
})
