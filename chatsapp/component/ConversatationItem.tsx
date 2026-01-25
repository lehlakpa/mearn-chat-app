import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { Avatar } from '@/component/Avatar'
import Typo from '@/component/Typo'
import moment from 'moment'
import { TouchableOpacity } from 'react-native'
import { ConversationLIstItemProps } from '@/types'
import { useAuth } from '@/contexts/authcontext'
import { useRouter } from 'expo-router'


const ConversatationItem = ({ item, showDivider }: ConversationLIstItemProps) => {

    const router = useRouter();
    const { user: currentUser } = useAuth();
    //console.log("conversation item",item);

    const lastMessage: any = item.lastMessage;
    const isDirect = item.type == "direct";
    let avatar = item.avatar;
    const otherParticipants = isDirect ? item.participants?.find(p => p._id !== currentUser?.id) : null;

    if (isDirect && otherParticipants) avatar = otherParticipants.avatar;





    const getLastMessagecontent = () => {
        if (!lastMessage?.createdAt) return "Say Hi 👋";
        return lastMessage?.attachement ? "Image" : lastMessage?.content;

    }

    const getLastMessageTime = () => {
        if (!lastMessage?.createdAt) return null;

        const messageDate = moment(lastMessage.createdAt);
        const today = moment();
        if (messageDate.isSame(today, "day")) {
            return messageDate.format("hh:mm A");
        }
        if (messageDate.isSame(today, 'week')) {
            return messageDate.format("ddd");
        }
        return messageDate.format("DD/MM/YY");
    }
    const openConversation = () => {
        router.push({
            pathname: "/(main)/conversation",
            params: {
                id: item._id,
                name: item.name,
                avatar: item.avatar,
                type: item.type,
                participants: JSON.stringify(item.participants)
            }
        })
    }
    return (
        <View>
            <TouchableOpacity style={styles.container}
                onPress={openConversation}>
                <View>
                    <Avatar uri={avatar||undefined} size={47} isGroup={!isDirect} />
                </View>

                <View style={{ flex: 1 }}>
                    <View style={styles.row}>
                        <Typo size={17} fontWeight={"600"}>
                            {isDirect ? otherParticipants?.name : item?.name}
                        </Typo>
                        {
                            lastMessage && (
                                <Typo size={13} color={colors.neutral400}>{getLastMessageTime()}</Typo>
                            )
                        }
                    </View>
                    <Typo size={15} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
                        {getLastMessagecontent()}

                    </Typo>
                </View>
            </TouchableOpacity>
            {showDivider && <View style={styles.divider} />}
        </View>
    )
}

export default ConversatationItem;

const styles = StyleSheet.create({
    container: {
        gap: spacingX._10,
        marginVertical: spacingY._12,
        flexDirection: "row",
        alignItems: "center"
    },
    content: {
        flex: 1,
        gap: spacingY._5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"

    },
    divider: {
        height: 1,
        width: "95%",
        alignSelf: "flex-end",
        backgroundColor: colors.neutral100,
    }
})