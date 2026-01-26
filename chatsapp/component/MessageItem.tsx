import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { MessageProps } from '@/types'
import { useAuth } from '@/contexts/authcontext'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { Avatar } from './Avatar'
import Typo from './Typo'
import moment from 'moment'
import { Image } from 'expo-image'

const MessageItem = (
    { item, isDirect }: { item: MessageProps, isDirect: boolean }) => {

    const { user: currentUser } = useAuth();
    const isMe = currentUser?.id === item?.sender?.id || currentUser?.id === item?.sender?._id;

    const date = item?.createdAt;
    const FormatedDate = date ? (moment(date).isSame(moment(), "day")?
    moment(date).format("h:mm A"):
    moment(date).format("DD/MM/YY")) : "";

    return (
        <View style={[styles.messageContainer, isMe && styles.myMessage, !isMe && styles.theirMessage]}>
            {!isMe && !isDirect && (
                <Avatar size={30} uri={item?.sender?.avatar} style={styles.messageAvatar} />
            )}
            <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]} >
                {!isMe && !isDirect && (
                    <Typo color={colors.neutral900} size={13}>
                        {item.sender?.name}
                    </Typo>
                )}
                {
                    item.attachement && (
                        <Image
                            source={{ uri: item.attachement }}
                            contentFit='cover'
                            style={styles.attachement}
                            transition={100}
                            
                        />
                    )
                }
                {
                    item.content && <Typo size={15}>{item.content}</Typo>
                }
                <Typo style={{ alignSelf: "flex-end" }}
                    size={11} fontWeight={"500"}
                    color={colors.neutral600}>
                    {FormatedDate}
                </Typo>
            </View>
        </View>
    )
}


export default MessageItem

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: "row",
        gap: spacingX._7,
        maxWidth: "80%",

    },
    myMessage: {
        alignSelf: "flex-end",

    },
    theirMessage: {
        alignSelf: "flex-start",

    },
    messageAvatar: {
        alignSelf: "flex-end"
    },
    attachement: {
        height: verticalScale(180),
        width: verticalScale(180),
        borderRadius: radius._10
    },
    messageBubble: {
        padding: spacingX._10,
        borderRadius: radius._15,
        gap: spacingY._15
    },
    myBubble: {
        backgroundColor: colors.myBubble,
    },
    theirBubble: {
        backgroundColor: colors.otherBubble,
    }
})