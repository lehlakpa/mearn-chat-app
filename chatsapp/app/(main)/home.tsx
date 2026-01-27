import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Typo from "@/component/Typo";
import ScreenWrapper from "@/component/ScreenWrapper";
import { useAuth } from "@/contexts/authcontext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import ConversatationItem from "@/component/ConversatationItem";
import Loading from "@/component/Loading";
import Button from "@/component/Button";
import { getConversations, newConversation, newMessage } from "@/socket/socketEvents";
import { ConversationProps, ResponseProps } from "@/types";
import { Avatar } from "@/component/Avatar";

const Home = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();

  const [selectedTabs, setSelectedTabs] = useState(0);
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ConversationProps[]>([]);

  useEffect(() => {
    getConversations(processConversation);
    newConversation(newConversationHandler);
    newMessage(newMessageHandler);
    getConversations(null);

    return () => {
      getConversations(processConversation, true);
      newConversation(newConversationHandler, true);
      newMessage(newMessageHandler, true);
    };
  }, []);

  const processConversation = (res: ResponseProps) => {
    if (res.success) setConversations(res.data);
  };

  const newConversationHandler = (res: ResponseProps) => {
    if (res.success && res.data?.isNew) {
      setConversations((prev) => [...prev, res.data]);
    }
  };

  const newMessageHandler = (res: ResponseProps) => {
    if (res.success) {
      const conversationId = res.data.conversationId;
      setConversations((prev) =>
        prev.map((item) =>
          item._id === conversationId
            ? { ...item, lastMessage: res.data }
            : item
        )
      );
    }
  };

  const directConversations = conversations
    .filter((c) => c.type === "direct")
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || b.createdAt).getTime() -
        new Date(a.lastMessage?.createdAt || a.createdAt).getTime()
    );

  const groupConversations = conversations
    .filter((c) => c.type === "group")
    .sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || b.createdAt).getTime() -
        new Date(a.lastMessage?.createdAt || a.createdAt).getTime()
    );

  return (
    <ScreenWrapper isModal={false} bgOpacity={0.4} showPattern>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Typo color={colors.neutral300}>Welcome back</Typo>
            <Typo size={22} color={colors.white} fontWeight="800">
              {currentUser?.name}
            </Typo>
          </View>

          {/* PROFILE AVATAR */}
          <TouchableOpacity
            onPress={() => router.push("/(main)/profileModel")}
          >
            <Avatar
              uri={currentUser?.avatar ?? undefined}
              size={42}
            />
          </TouchableOpacity>
        </View>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* TABS */}
          <View style={styles.tabs}>
            <TouchableOpacity
              onPress={() => setSelectedTabs(0)}
              style={[
                styles.tab,
                selectedTabs === 0 && styles.activeTab,
              ]}
            >
              <Typo
                fontWeight="600"
                color={selectedTabs === 0 ? colors.white : colors.neutral700}
              >
                Direct
              </Typo>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedTabs(1)}
              style={[
                styles.tab,
                selectedTabs === 1 && styles.activeTab,
              ]}
            >
              <Typo
                fontWeight="600"
                color={selectedTabs === 1 ? colors.white : colors.neutral700}
              >
                Groups
              </Typo>
            </TouchableOpacity>
          </View>

          {/* CHAT LIST */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatList}
          >
            {selectedTabs === 0 &&
              directConversations.map((item, index) => (
                <ConversatationItem key={index} item={item} router={router} />
              ))}

            {selectedTabs === 1 &&
              groupConversations.map((item, index) => (
                <ConversatationItem key={index} item={item} router={router} />
              ))}

            {!loading &&
              selectedTabs === 0 &&
              directConversations.length === 0 && (
                <Typo style={styles.emptyText}>
                  No direct messages yet
                </Typo>
              )}

            {!loading &&
              selectedTabs === 1 &&
              groupConversations.length === 0 && (
                <Typo style={styles.emptyText}>
                  No group conversations
                </Typo>
              )}

            {loading && <Loading />}
          </ScrollView>
        </View>
      </View>

      {/* FLOATING ACTION BUTTON */}
      <Button
        style={styles.fab}
        onPress={() =>
          router.push({
            pathname: "/(main)/newConversationModel",
            params: { isGroup: selectedTabs },
          })
        }
      >
        <Typo size={24} fontWeight="800" color={colors.black}>
          +
        </Typo>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
  },

  content: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius._40,
    borderTopRightRadius: radius._40,
    paddingHorizontal: spacingX._20,
    overflow: "hidden",
  },

  tabs: {
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: colors.neutral100,
    borderRadius: radius.full,
    marginTop: spacingY._15,
  },

  tab: {
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._25,
    borderRadius: radius.full,
  },

  activeTab: {
    backgroundColor: colors.primary,
  },

  chatList: {
    paddingVertical: spacingY._20,
  },

  emptyText: {
    textAlign: "center",
    color: colors.neutral500,
    marginTop: spacingY._20,
  },

  fab: {
    position: "absolute",
    bottom: verticalScale(28),
    right: verticalScale(28),
    height: verticalScale(58),
    width: verticalScale(58),
    borderRadius: radius.full,
  },
});
