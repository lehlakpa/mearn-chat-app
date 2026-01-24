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
    const isMe = currentUser?.id === item?.sender?.id;

    const FormatedDate =moment(item.createdAt).isSame(moment(), "day")?
    moment(item.createdAt).format("h:mm A"):
    moment(item.createdAt).format("DD/MM/YY");

    return (
        <View style={[styles.messageContainer, isMe && styles.myMessage, !isMe && styles.theirMessage]}>
            {!isMe && !isDirect && (
                <Avatar size={30} uri={item?.sender?.avatar} style={styles.messageAvatar} />
            )}
            <View style={[styles.messageBubble, isMe ? styles.myBubble : styles.theirBubble]} >
                {!isMe && (
                    <Typo color={colors.neutral900} size={13}>
                        {item.sender.name}
                    </Typo>
                )}
                {
                    item.attachment && (
                        <Image
                            source={{ uri: item.attachment }}
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