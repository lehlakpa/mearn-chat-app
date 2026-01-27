import { StyleSheet, View } from "react-native";
import React from "react";
import { MessageProps } from "@/types";
import { useAuth } from "@/contexts/authcontext";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { Avatar } from "./Avatar";
import Typo from "./Typo";
import moment from "moment";
import { Image } from "expo-image";

const MessageItem = ({
  item,
  isDirect,
}: {
  item: MessageProps;
  isDirect: boolean;
}) => {
  const { user: currentUser } = useAuth();

  const isMe =
    currentUser?.id === item?.sender?.id 
    // currentUser?.id === item?.sender?._id;

  const imageUri =
    item?.attachement || item?.attachment || null;

  const date = item?.createdAt;
  const formattedDate = date
    ? moment(date).isSame(moment(), "day")
      ? moment(date).format("h:mm A")
      : moment(date).format("DD/MM/YY")
    : "";

  return (
    <View
      style={[
        styles.wrapper,
        isMe ? styles.alignRight : styles.alignLeft,
      ]}
    >
      {!isMe && !isDirect && (
        <Avatar
          size={28}
          uri={item?.sender?.avatar}
          style={styles.avatar}
        />
      )}

      <View
        style={[
          styles.bubble,
          isMe ? styles.myBubble : styles.theirBubble,
        ]}
      >
        {!isMe && !isDirect && (
          <Typo size={12} fontWeight="600" color={colors.primary}>
            {item.sender?.name}
          </Typo>
        )}

        {/* IMAGE MESSAGE */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            contentFit="cover"
            transition={150}
            onError={(e) => {
              console.log("❌ Image failed:", imageUri);
            }}
          />
        )}

        {/* TEXT MESSAGE */}
        {item.content && (
          <Typo size={15} color={colors.neutral900}>
            {item.content}
          </Typo>
        )}

        {/* TIME */}
        <Typo size={11} color={colors.neutral500} style={styles.time}>
          {formattedDate}
        </Typo>
      </View>
    </View>
  );
};

export default MessageItem;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    marginVertical: spacingY._7,
    paddingHorizontal: spacingX._10,
  },

  alignRight: {
    justifyContent: "flex-end",
  },

  alignLeft: {
    justifyContent: "flex-start",
  },

  avatar: {
    marginRight: spacingX._7,
    alignSelf: "flex-end",
  },

  bubble: {
    maxWidth: "80%",
    padding: spacingX._10,
    borderRadius: radius._20,
    gap: spacingY._7,
  },

  myBubble: {
    backgroundColor: colors.myBubble,
    borderBottomRightRadius: radius._10,
  },

  theirBubble: {
    backgroundColor: colors.otherBubble,
    borderBottomLeftRadius: radius._17,
  },

  image: {
    width: verticalScale(240),
    height: verticalScale(240),
    borderRadius: radius._12,
    backgroundColor: colors.neutral200,
  },

  time: {
    alignSelf: "flex-end",
    marginTop: spacingY._5,
  },
});
