import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/component/ScreenWrapper";
import Typo from "@/component/Typo";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/authcontext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { scale, verticalScale } from "@/utils/styling";
import Header from "@/component/Header";
import { BackButton } from "@/component/BackButton";
import { Avatar } from "@/component/Avatar";
import MessageItem from "@/component/MessageItem";
import Input from "@/component/Input";
import * as ImagePicker from "expo-image-picker";
import Loading from "@/component/Loading";
import { uploadFileToCloudinary } from "@/services/imageService";
import {
  getConversations,
  getMessages,
  newMessage,
} from "@/socket/socketEvents";
import { ResponseProps, MessageProps } from "@/types";

const Conversation = () => {
  const { user: currentUser } = useAuth();

  const {
    id: conversationId,
    name: paramName,
    avatar: paramAvatar,
    type: paramType,
    participants: stringifyiedParticipants,
  } = useLocalSearchParams();

  const [conversation, setConversation] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [loading, setLoading] = useState(false);

  const currentConversation = conversation || {
    name: paramName,
    avatar: paramAvatar,
    type: paramType,
    participants: stringifyiedParticipants
      ? JSON.parse(stringifyiedParticipants as string)
      : [],
  };

  const participants = currentConversation.participants;
  const isDirect = currentConversation.type === "direct";

  const otherParticipant = isDirect
    ? participants.find((p: any) => p._id !== currentUser?.id)
    : null;

  const conversationAvatar = isDirect
    ? otherParticipant?.avatar
    : currentConversation.avatar;

  const conversationName = isDirect
    ? otherParticipant?.name
    : currentConversation.name;

  // 📁 Pick Image
  const onPickFile = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  // 🔌 Socket listeners
  useEffect(() => {
    newMessage(newMessageHandler);
    getMessages(messageHandler);
    getMessages({ conversationId });

    if (!paramName || !stringifyiedParticipants) {
      getConversations((res: ResponseProps) => {
        if (res.success) {
          const found = res.data.find(
            (c: any) => c._id === conversationId
          );
          if (found) setConversation(found);
        }
      });
    }

    return () => {
      newMessage(newMessageHandler, true);
      getMessages(messageHandler, true);
    };
  }, []);

  const messageHandler = (res: ResponseProps) => {
    if (res.success) setMessages(res.data);
  };

  const newMessageHandler = (res: ResponseProps) => {
    setLoading(false);
    if (res.success && res.data.conversationId === conversationId) {
      setMessages((prev) => [res.data as MessageProps, ...prev]);
    }
  };

  // 📤 Send Message
  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;
    if (!currentUser) return;

    setLoading(true);

    try {
      let attachment = null;

      if (selectedFile) {
        const upload = await uploadFileToCloudinary(
          selectedFile,
          "message-attachments"
        );

        if (upload.success) {
          attachment = upload.data;
        } else {
          Alert.alert("Error", "Image upload failed");
          setLoading(false);
          return;
        }
      }

      newMessage({
        conversationId,
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
        },
        content: message.trim(),
        attachement: attachment,
      });

      setMessage("");
      setSelectedFile(null);
    } catch (err) {
      Alert.alert("Error", "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper isModal={false} showPattern={false}bgOpacity={0.5}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <Header
          style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton iconSize={22} color={colors.black} />
              <Avatar
                size={38}
                uri={conversationAvatar}
                isGroup={!isDirect}
              />
              <View>
                <Typo size={16} fontWeight="600">
                  {conversationName}
                </Typo>
                {isDirect && (
                  <Typo size={12} color={colors.neutral500}>
                    online
                  </Typo>
                )}
              </View>
            </View>
          }
          rightIcon={
            <TouchableOpacity>
              <Typo size={22}>⋮</Typo>
            </TouchableOpacity>
          }
        />

        {/* MESSAGES */}
        <FlatList
          data={messages}
          inverted
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          renderItem={({ item }) => (
            <MessageItem item={item} isDirect={isDirect} />
          )}
          keyExtractor={(item) => item.id}
        />

        {/* IMAGE PREVIEW */}
        {selectedFile && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: selectedFile.uri }}
              style={styles.previewImage}
            />
            <TouchableOpacity onPress={() => setSelectedFile(null)}>
              <Typo size={16}>✕</Typo>
            </TouchableOpacity>
          </View>
        )}

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TouchableOpacity onPress={onPickFile} style={styles.attachBtn}>
            <Typo size={22}>＋</Typo>
          </TouchableOpacity>

          <Input
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            containerStyle={styles.textInput}
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={onSend}
            disabled={loading}
          >
            {loading ? (
              <Loading size="small" />
            ) : (
              <Typo size={14} fontWeight="600">
                Send
              </Typo>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Conversation;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
  messagesContent: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._10,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: spacingX._15,
    marginBottom: spacingY._10,
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._7,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: spacingX._10,
  },
  attachBtn: {
    padding: 6,
    borderRadius: radius.full,
    backgroundColor: colors.neutral100,
  },
  sendBtn: {
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  previewContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    marginHorizontal: spacingX._15,
    marginBottom: spacingY._7,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: radius._10,
  },
});
