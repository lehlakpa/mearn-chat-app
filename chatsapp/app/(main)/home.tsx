import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import Typo from "@/component/Typo";
import ScreenWrapper from "@/component/ScreenWrapper";
import { useAuth } from "@/contexts/authcontext";
import { colors, radius, spacingX } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ScreenWrapper isModal={false} bgOpacity={0.4} showPattern>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typo color={colors.neutral200}>
              Welcome back ,{" "}
              <Typo size={20} color={colors.white} fontWeight="800">
                {currentUser?.name}
              </Typo>
            </Typo>
          </View>

          <TouchableOpacity
            style={styles.settingIcon}
            onPress={() => router.push("/(main)/profileModel")}
          >
            <Ionicons
              name="settings-sharp"
              size={verticalScale(22)}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}></View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  settingIcon: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._50,
    borderTopRightRadius: radius._50,
    paddingHorizontal: spacingX._20,
    borderCurve: "continuous",
    overflow: "hidden",
  },
});
