import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { use, useEffect, useState } from 'react'
import ScreenWrapper from '@/component/ScreenWrapper'
import Typo from '@/component/Typo'
import { useLocalSearchParams } from 'expo-router'
import { useAuth } from '@/contexts/authcontext'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import Header from '@/component/Header'
import { BackButton } from '@/component/BackButton'
import { Avatar } from '@/component/Avatar'
import MessageItem from '@/component/MessageItem'
import Input from '@/component/Input'
import * as ImagePicker from 'expo-image-picker';
import Loading from '@/component/Loading'
import { uploadFileToCloudinary } from '@/services/imageService'
import { getMessages, newMessage } from '@/socket/socketEvents'
import { ResponseProps } from '@/types'
import { MessageProps } from '@/types'

const conversation = () => {
  // console.log(" got conversation",data);
  const { user: currentUser } = useAuth();
  const {
    id: conversationId,
    name,
    avatar,
    type,
    particitants: stringifyiedParticipants
  } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<{ uri: string } | null>(null);
  const [messages, setMessages] = useState<MessageProps[]>([])

  const participants = JSON.parse(stringifyiedParticipants as string);
  const [loading, setloading] = useState(false);

  let conversationAvatar = avatar;
  let isDirect = type == "direct";
  const otherParticipants = isDirect ? participants.find((p: any) => p._id !== currentUser?.id) : null;

  if (isDirect && otherParticipants) conversationAvatar = otherParticipants.avatar;

  let conversatiolnName = isDirect ? otherParticipants?.name : name;
  const onPickFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    //console.log(result);

    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }


  }
  useEffect(() => {
    newMessage(newMessageHandler);
    getMessages(messageHanlder)
    getMessages({ conversationId });
    return () => {
      newMessage(newMessageHandler, true);
      getMessages(messageHanlder, true);

    }

  }, [])

  const messageHanlder = (res: ResponseProps) => {
    if (res.success) setMessages(res.data);
  }

  const newMessageHandler = (res: ResponseProps) => {
    setloading(false);
    if (res.success) {
      if (res.data.conversationId === conversationId) {
        setMessages((prev) => [res.data as MessageProps, ...prev]);
      }
      else {
        Alert.alert("error", res.msg);
      }
    }

  }
  const onSend = async () => {
    if (!message.trim() && !selectedFile) return;

    if (!currentUser) return;
    setloading(true);

    try {
      let attachement = null;
      if (selectedFile) {
        const uploadResult = await uploadFileToCloudinary(
          selectedFile,
          "message-attachements"
        );
        if (uploadResult.success) {
          attachement = uploadResult.data;
        } else {
          setloading(false);
          Alert.alert("Error", "could not send the image");
        }
      }
      // console.log("attachement",attachement)

      newMessage({
        conversationId, sender: {
          id: currentUser?.id,
          name: currentUser.name,
          avatar: currentUser.avatar
        },
        content: message.trim(),
        attachement
      });
      setMessage("");
      setSelectedFile(null);
    } catch (error) {
      console.log("error sending message", error);
      Alert.alert("Error", "Failed to send Message")

    } finally {
      setloading(false);
    }

  }

  return (
    <ScreenWrapper isModal={true} showPattern={true} bgOpacity={0.5}>
      <KeyboardAvoidingView behavior={
        Platform.OS === "ios" ? "padding" : "height"
      } style={styles.container
      }>
        {/* header */}
        <Header style={styles.header}
          leftIcon={
            <View style={styles.headerLeft}>
              <BackButton iconSize={24} color={colors.black} />
              <Avatar size={40} uri={conversationAvatar as string}
                isGroup={type == "group"} />
              <Typo color={colors.white} fontWeight={"500"} size={22}>
                {conversatiolnName}
              </Typo>
            </View>
          }
          rightIcon={
            <TouchableOpacity>
              <Typo fontWeight={"bold"} color={colors.white}>dotsThreeoutlinevertical</Typo>
            </TouchableOpacity>
          } />
        {/* messages */}
        <View style={styles.container}>
          <FlatList
            data={messages}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContent}
            renderItem={({ item }) => {
              <MessageItem item={item} isDirect={isDirect} />
            }}
            keyExtractor={(item) => { item.id }}
          />
          <View style={styles.footer}>
            <Input value={message}
              onChangeText={setMessage}
              containerStyle={
                {
                  paddingLeft: spacingX._10,
                  paddingRight: scale(65),
                  borderWidth: 0,
                }}
              placeholder="Type a message"
              icon={
                <TouchableOpacity style={styles.inputIcon} onPress={onPickFile}>
                  <Typo color={colors.black}
                    fontWeight={"bold"} size={24}>files</Typo>
                  {
                    selectedFile && selectedFile.uri && (
                      <Image
                        source={selectedFile.uri}
                        style={styles.selectedFile}
                      />
                    )
                  }
                </TouchableOpacity>
              }

            />
            <View style={styles.inputRightIcon}>
              <TouchableOpacity style={styles.inputIcon} onPress={onSend}>
                {
                  loading ? (
                    <Loading size="small" color={colors.black} />
                  ) : (
                    <Typo color={colors.black}
                      fontWeight={'bold'}
                      size={verticalScale(22)}>send</Typo>

                  )
                }

              </TouchableOpacity>
            </View>
          </View>
        </View>


      </KeyboardAvoidingView>
    </ScreenWrapper>
  )
}

export default conversation

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacingX._15,
    paddingTop: spacingY._10,
    paddingBottom: spacingY._15,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,

  },
  inputRightIcon: {
    position: "absolute",
    right: scale(10),
    top: verticalScale(15),
    paddingLeft: spacingY._12,
    borderLeftColor: colors.neutral300
  },
  selectedFile: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopEndRadius: radius.full,
    borderCurve: "continuous",
    overflow: "hidden",
    paddingHorizontal: spacingX._15,
  },
  inputIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8
  },
  footer: {
    paddingTop: spacingY._7,
    paddingBottom: spacingY._10
  },
  messagesContent: {
    paddingTop: spacingY._20,
    paddingBottom: spacingY._10,
    gap: spacingY._12

  },
  plusIcon: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 8

  }
})