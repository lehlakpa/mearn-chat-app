import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Typo from "@/component/Typo";
import ScreenWrapper from "@/component/ScreenWrapper";
import { useAuth } from "@/contexts/authcontext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ConversatationItem from "@/component/ConversatationItem";

const Home = () => {
  const { user: currentUser, signOut } = useAuth();
  const router = useRouter();


  const [selectedTabs, setSelectedTabs] = useState(0);

  const handleLogout = async () => {
    await signOut();
  };
  const conversatation = [
    {
      name: "lakpaaa",
      type: "direct",
      lastMessage: {
        senderName: "challoo",
        content: "lllllllasld",
        createdAt: "slecerkfjaojroj"
      }
    },
    {
      name: "lakpaaa",
      type: "direct",
      lastMessage: {
        senderName: "challoo",
        content: "lllllllasld",
        createdAt: "slecerkfjaojroj"
      }
    },
    {
      name: "sherpa",
      type: "group",
      lastMessage: {
        senderName: "chnkmkalloo",
        content: "lllllllasld",
        createdAt: "slecerkfsdcasdjaojroj"
      }
    },
    {
      name: "shsdarpa",
      type: "group",
      lastMessage: {
        senderName: "chnkmkalloo",
        content: "lllllllasld",
        createdAt: "slecerkfsdcasdjaojroj"
      }
    }
  ]
  let directCOnversatations=conversatation
  .filter((item:any)=>item.type==="direct")
  .sort((a:any,b:any)=>{
    const aDate=new Date(a.lastMessage.createdAt||a.createdAt);
    const bDate=new Date(b.lastMessage.createdAt||b.createdAt);
    return new Date(bDate).getTime()-new Date(aDate).getTime();
  })
  let GroupCOnversatations=conversatation
  .filter((item:any)=>item.type==="group")
  .sort((a:any,b:any)=>{
    const aDate=new Date(a.lastMessage.createdAt||a.createdAt);
    const bDate=new Date(b.lastMessage.createdAt||b.createdAt);
    return new Date(bDate).getTime()-new Date(aDate).getTime();
  })


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

        <View style={styles.content}>

          <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: spacingX._20 }}>
            <View style={styles.navbar}>
              <View style={styles.tabs}>
                <TouchableOpacity onPress={() => {
                  setSelectedTabs(0)
                }} style={[styles.tabStyle, selectedTabs === 0 && styles.activeTabsStyle]}>
                  <Typo>Direct Messages</Typo>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  setSelectedTabs(0)
                }} style={[styles.tabStyle, selectedTabs === 1 && styles.activeTabsStyle]}>
                  <Typo>Groups Messages</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.conversationList}>
              {
                selectedTabs === 0 && (
                  selectedTabs === 0 && directCOnversatations.map((item: any, index: number) => {
                    return(
                      <ConversatationItem key={index} item={item}
                      router={router}
                      showDivider={ directCOnversatations.length !== index + 1}
                      />
                    )
                  }
                )
                
                )
              }

            </View>

          </ScrollView>
        </View>
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
  navbar: {
    flexDirection: "row",
    gap: spacingX._15,
    alignItems: "center",
    paddingHorizontal: spacingX._10,
  },
  tabs: {
    flexDirection: "row",
    gap: spacingX._10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
  , tabStyle: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100
  },
  activeTabsStyle: {
    backgroundColor: colors.primaryLight,

  },
  conversationList: {
    paddingVertical: spacingY._20,
  },
  settingIcon: {
    padding: spacingY._10,
    backgroundColor: colors.neutral700,
    borderRadius: radius.full,
  },
  floatingButton: {
    height: verticalScale(56),
    width: verticalScale(56),
    borderRadius: 100,
    position: "absolute",
    bottom: verticalScale(30),
    right: verticalScale(30)
  }

});
