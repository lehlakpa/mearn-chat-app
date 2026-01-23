import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
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
import { useRouter } from 'expo-router'
import { updateProfile } from '@/socket/socketEvents'
import { uploadFileToCloudinary } from '@/services/imageService'
import * as ImagePicker from 'expo-image-picker';

const ProfileModel = () => {
  const { user, signOut, updateToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter();


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
  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    //console.log(result);

    if (!result.canceled) {
      setUserdata({ ...userdata, avatar: result.assets[0].uri });
    }

  }

  useEffect(() => {
    updateProfile(processUpdateProfile);
    return () => {
      updateProfile(processUpdateProfile, true);

    }
  }, [])

  const processUpdateProfile = (res: any) => {
    console.log("got response", res);
    setLoading(false);

    if (res.success) {
      updateToken(res.data.token);
      Alert.alert("Success", res.msg);
    } else {
      Alert.alert("Error", res.msg);
    }


  }


  const handleSubmit = async () => {
    let { name, avatar } = userdata;
    if (!name.trim()) {
      Alert.alert("User", "please Enter your name");
      return;
    }
    let data = { name, avatar };

    // If avatar is an object with a uri property (from ImagePicker), upload it
    if (avatar && typeof avatar === 'object' && 'uri' in avatar) {
      setLoading(true);
      const res = await uploadFileToCloudinary({ uri: (avatar as any).uri }, "profiles");
      //console.log(res);
      if (res.success) {
        data.avatar = res.data;
      } else {
        Alert.alert("Error", res.msg || "Image upload failed");
        setLoading(false);
        return;
      }
    }
    updateProfile(data);
    try {
      if (avatar && avatar.startsWith("file://")) {
        // upload image
        let response = await uploadFileToCloudinary({ uri: avatar }, "profiles");
        if (response.success) {
          avatar = response.data;
        } else {
          Alert.alert("Error", response.msg || "Image upload failed");
          setLoading(false);
          return;
        }
      }
      updateProfile(({ name, avatar }: { name: string; avatar: string | null }) => {
        console.log("Profile update sent", { name, avatar });
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      setLoading(false);
    }
  }

  const showLOgoutAlert = () => {
    Alert.alert("Confrom", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel"
      }, {
        text: "Logout",
        onPress: () => handleLogout(),
        style: "destructive"
      }

    ]);

  }


  const handleLogout = async () => {
    router.back();
    await signOut();

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

            <TouchableOpacity style={styles.editIcon} onPress={onPickImage}>
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
          {!loading && (
            <Button
              onPress={showLOgoutAlert}
              style={{
                backgroundColor: colors.rose,
                height: verticalScale(56),
                width: verticalScale(56),
              }}
            >
              <Text>Logout</Text>
            </Button>
          )}
          <Button
            style={{ flex: 1 }}
            onPress={handleSubmit}
            loading={loading}
          >
            <Text>Update</Text>
          </Button>
        </View>
      </View>
    </ScreenWrapper>
  )
}

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

export default ProfileModel
