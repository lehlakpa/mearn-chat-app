import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenWrapper from '@/component/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import Header from '@/component/Header';
import { BackButton } from '@/component/BackButton';
import { Avatar } from '@/component/Avatar';
import * as Icon from 'phosphor-react-native';
import { verticalScale } from '@/utils/styling';
import Typo from '@/component/Typo';
import Input from '@/component/Input';
import { useAuth } from '@/contexts/authcontext';
import { UserDataProps } from '@/types';
import Button from '@/component/Button';

const ProfileModel = () => {
  const { user } = useAuth();

  const [userData, setUserData] = useState<UserDataProps>({
    name: '',
    email: '',
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || null,
      });
    }
  }, [user]);

  const leftIcon = {
    icon: <BackButton iconSize={20} color={colors.black} />,
  };

  return (
    <ScreenWrapper isModal bgOpacity={0.4} showPattern>
      <View style={styles.container}>
        <Header title="Update Profile" leftIcon={leftIcon} />

        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Avatar uri={userData.avatar} size={170} />

            <TouchableOpacity style={styles.editIcon}>
              <Icon.Pencil
                size={verticalScale(20)}
                color={colors.neutral800}
                weight="bold"
              />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.inputGroup}>
            {/* Email */}
            <View>
              <Typo style={styles.label}>Email</Typo>
              <Input
                value={userData.email}
                onChangeText={(text) =>
                  setUserData({ ...userData, email: text })
                }
                containerStyle={styles.input}
              />
            </View>

            {/* Name */}
            <View>
              <Typo style={styles.label}>Name</Typo>
              <Input
                value={userData.name}
                onChangeText={(text) =>
                  setUserData({ ...userData, name: text })
                }
                containerStyle={styles.input}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Button style={{backgroundColor:colors.rose,height:verticalScale(56),
          width:verticalScale(56)
        }}>
          <Icon.SignOut size={verticalScale(20) } color={colors.white} weight='bold'/>

        </Button>
        <Button style={{flex:1}}>
          <Typo color={colors.black} fontWeight="600">Update</Typo>
        </Button>
      

      </View>
    </ScreenWrapper>
  );
};

export default ProfileModel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    paddingHorizontal: spacingX._20,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  avatarContainer: {
    width: verticalScale(170),
    height: verticalScale(170),
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIcon: {
    position: 'absolute',
    bottom: spacingY._5,
    right: spacingY._7,
    backgroundColor: colors.neutral100,
    borderRadius: 100,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 10px rgba(0,0,0,0.25)'
      },
      android: { elevation: 4 },
      default: { boxShadow: '0px 2px 10px rgba(0,0,0,0.25)' }
    })
  },

  inputGroup: {
    width: '100%',
    gap: spacingY._20,
  },

  label: {
    paddingLeft: spacingX._10,
    marginBottom: spacingY._5,
  },

  input: {
    borderColor: colors.neutral350,
    paddingLeft: spacingX._20,
    backgroundColor: colors.neutral300,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingY._20,
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral200,
    borderTopWidth: 1,
    marginBottom: spacingY._10
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15
  }
});
