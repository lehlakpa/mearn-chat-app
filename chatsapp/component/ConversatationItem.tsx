import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { Avatar } from '@/component/Avatar'
import Typo from '@/component/Typo'
import moment from 'moment'
import { TouchableOpacity } from 'react-native'


const ConversatationItem = ({ item, showDivider, router }: any) => {

    const lastMessage: any = item.lastMessage;
    const isDirect = item.type == "direct";

    const openConversation = () => {

    }
    const getLastMessagecontent = () => {
        if(!lastMessage?.createdAt) return "say heluu";
        return lastMessage?.attachment?"image":lastMessage?.content;

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
    return (
        <View>
            <TouchableOpacity style={styles.container}
                onPress={openConversation}>
                <Avatar uri={isDirect ? item.avatar : null} size={47} isGroup={!isDirect} />
                <View style={styles.content}>
                    <View style={styles.row}>
                        <Typo size={17} fontWeight={"600"}>{item?.name}</Typo>
                        {
                            lastMessage && (
                                <Typo size={13} color={colors.neutral400}>{getLastMessageTime()}</Typo>
                            )
                        }
                    </View>
                    <Typo size={15} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
                        {getLastMessagecontent}

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