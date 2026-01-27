import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";

import ScreenWrapper from "@/component/ScreenWrapper";
import Header from "@/component/Header";
import { BackButton } from "@/component/BackButton";
import { Avatar } from "@/component/Avatar";
import Typo from "@/component/Typo";
import Input from "@/component/Input";
import Button from "@/component/Button";

import { colors, spacingX, spacingY, radius } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import { useAuth } from "@/contexts/authcontext";
import { UserDataProps } from "@/types";
import { useRouter } from "expo-router";
import { updateProfile } from "@/socket/socketEvents";
import { uploadFileToCloudinary } from "@/services/imageService";
import * as ImagePicker from "expo-image-picker";

const ProfileModel = () => {
  const { user, signOut, updateToken } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [userdata, setUserdata] = useState<UserDataProps>({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    if (user) {
      setUserdata({
        name: user.name ?? "",
        email: user.email ?? "",
        avatar: user.avatar ?? null,
      });
    }
  }, [user]);

  useEffect(() => {
    updateProfile(processUpdateProfile);
    return () => updateProfile(processUpdateProfile, true);
  }, []);

  const processUpdateProfile = (res: any) => {
    setLoading(false);
    if (res.success) {
      updateToken(res.data.token);
      Alert.alert("Success", res.msg);
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });

    if (!result.canceled) {
      setUserdata({ ...userdata, avatar: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    let { name, avatar } = userdata;

    if (!name.trim()) {
      Alert.alert("Profile", "Please enter your name");
      return;
    }

    setLoading(true);

    try {
      if (avatar && avatar.startsWith("file://")) {
        const upload = await uploadFileToCloudinary(
          { uri: avatar },
          "profiles"
        );

        if (upload.success) {
          avatar = upload.data;
        } else {
          Alert.alert("Error", "Image upload failed");
          setLoading(false);
          return;
        }
      }

      updateProfile({ name, avatar });
    } catch {
      Alert.alert("Error", "Something went wrong");
      setLoading(false);
    }
  };

  const showLogoutAlert = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: handleLogout },
    ]);
  };

  const handleLogout = async () => {
    router.back();
    await signOut();
  };

  return (
    <ScreenWrapper isModal={false} bgOpacity={0.5} showPattern={false}>
      <Header
        title="Profile"
        leftIcon={
          Platform.OS === "android" ? (
            <BackButton iconSize={22} color={colors.black} />
          ) : null
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* AVATAR SECTION */}
        <View style={styles.avatarSection}>
          <Avatar uri={userdata.avatar ?? undefined} size={160} />
          <TouchableOpacity style={styles.editAvatarBtn} onPress={onPickImage}>
            <Text style={styles.editAvatarText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* FORM CARD */}
        <View style={styles.card}>
          <View style={styles.field}>
            <Typo size={13} color={colors.neutral600}>
              Email
            </Typo>
            <Input
              value={userdata.email}
              editable={false}
              containerStyle={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Typo size={13} color={colors.neutral600}>
              Name
            </Typo>
            <Input
              value={userdata.name}
              onChange={(e) =>
                setUserdata({
                  ...userdata,
                  name: e.nativeEvent.text,
                })
              }
              containerStyle={styles.input}
            />
          </View>
        </View>
      </ScrollView>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={showLogoutAlert}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Button
          style={styles.updateBtn}
          loading={loading}
          onPress={handleSubmit}
        >
          <Text style={{ fontWeight: "600" }}>Save Changes</Text>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileModel;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: verticalScale(120),
  },

  avatarSection: {
    alignItems: "center",
    marginTop: spacingY._20,
    marginBottom: spacingY._25,
  },

  editAvatarBtn: {
    position: "absolute",
    bottom: 6,
    right: scale(90),
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._5,
  },

  editAvatarText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },

  card: {
    marginHorizontal: spacingX._15,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderRadius: radius._15,
    gap: spacingY._15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  field: {
    gap: spacingY._5,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.neutral50,
    paddingLeft: spacingX._15,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._15,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral200,
  },

  logoutBtn: {
    width: verticalScale(54),
    height: verticalScale(54),
    borderRadius: radius.full,
    backgroundColor: colors.rose,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },

  updateBtn: {
    flex: 1,
    height: verticalScale(54),
  },
});
