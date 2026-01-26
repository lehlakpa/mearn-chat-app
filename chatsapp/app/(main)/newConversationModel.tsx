import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '@/component/ScreenWrapper';
import Header from '@/component/Header';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { BackButton } from '@/component/BackButton';
import { Avatar } from '@/component/Avatar';
import * as ImagePicker from 'expo-image-picker';
import Input from '@/component/Input';
import Typo from '@/component/Typo';
import { useAuth } from '@/contexts/authcontext';
import Button from '@/component/Button';
import { verticalScale } from '@/utils/styling';
import { getContacts, newConversation } from '@/socket/socketEvents';
import { uploadFileToCloudinary } from '@/services/imageService';



const NewConversationModel = () => {
    const [groupAvatar, setGroupAvatar] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [groupName, setGroupName] = useState("");
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<any[]>([])

    const processGetContacts = (res: any) => {
        if (res.success && currentUser) {
            // Filter out the current user from the contacts list
            const filteredContacts = res.data.filter((contact: any) => (contact._id || contact.id) !== currentUser.id);
            setContacts(filteredContacts);
        }
    };

    const processNewConversation = (res: any) => {
        console.log("new conversation", res);
        setIsLoading(false);
        if (res.success) {
            router.back();
            router.push({
                pathname:"/(main)/conversation",
                params: {
                    id: res.data._id,
                    name: res.data.name,
                    avatar: res.data.avatar,
                    type: res.data.type,
                    participants: JSON.stringify(res.data.participants)
                }
            })
        }
        else {
            console.log("Error fetching /creating conversation:", res.msg);
            Alert.alert("Error", res.msg);
        }
    }

    useEffect(() => {
        getContacts(processGetContacts);
        newConversation(processNewConversation);
        getContacts(null);


        return () => {
            getContacts(processGetContacts, true);
            newConversation(processNewConversation, true)

        }
    }, [])


    const { user: currentUser } = useAuth();

    const { isGroup } = useLocalSearchParams();
    // console.log(isGroup);
    const isGroupMode = isGroup == "1";
    const router = useRouter();
    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            // allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        //console.log(result);

        if (!result.canceled) {
            setGroupAvatar(result.assets[0]);
        }

    }
    const toggleParticipants = (user: any) => {
        const userId = user._id || user.id;
        setSelectedParticipants((prev: any) => {
            if (prev.includes(userId)) {
                return prev.filter((id: string) => id !== userId);
            }
            return [...prev, userId];
        })
    }
    const onSelectUser = (user: any) => {
        if (!currentUser) {
            Alert.alert("Authentication", "Please login to continue")
            return
        }
        const userId = user._id || user.id;
        if (isGroupMode) {
            toggleParticipants(user);

        } else {
            //start the ne conversation 
            newConversation({
                type: "direct",
                participants: [currentUser.id, userId],

            });
        }


    }
    const createGroup = async () => {
        if (!groupName.trim() || !currentUser || selectedParticipants.length < 2)
            return;
        setIsLoading(true);
        try {
            let avatar = null;
            if (groupAvatar) {
                const uploadResult = await uploadFileToCloudinary(
                    groupAvatar, "groupAvatar"
                );
                if (uploadResult.success) avatar = uploadResult.data;
            }
            newConversation({
                type: "group",
                name: groupName,
                participants: [currentUser.id, ...selectedParticipants],
                avatar,
            })

        } catch (error: any) {
            console.log("Error Creating group:", error);
            Alert.alert("Error",error.message);


        }
        finally {
            setIsLoading(false);
        }


    }

    return (
        <ScreenWrapper isModal={false} showPattern={false}>
            <View style={styles.container}>
                <Header title={isGroupMode ? "new Group" : "select User"}
                    leftIcon={<BackButton iconSize={24} color={colors.black} />}
                />
                {
                    isGroupMode && (
                        <View style={styles.groupInfoContainer}>
                            <View style={styles.avatarContainer} >
                                <TouchableOpacity onPress={onPickImage} >
                                    <Avatar uri={groupAvatar?.uri ?? undefined} size={100} isGroup={true} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.groupNameContainer}>
                                <Input placeholder='Group Name'
                                    value={groupName}
                                    onChangeText={setGroupName} />
                            </View>
                        </View>

                    )
                }
                <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactList}>

                    {
                        contacts.map((user: any, index) => {
                            const userId = user._id || user.id;
                            const isSelected = selectedParticipants.includes(userId);

                            return (
                                <TouchableOpacity key={index} style={[styles.contactRow, isSelected && styles.selectedContact]}
                                    onPress={() => onSelectUser(user)}>
                                    <Avatar size={45} uri={user.avatar} />
                                    <Typo fontWeight={"500"}>{user.name}</Typo>
                                    {
                                        isGroupMode && (
                                            <View style={styles.selectIndicator}>
                                                <View style={[styles.checkbox, isSelected && styles.checked]}>

                                                </View>
                                            </View>
                                        )
                                    }
                                </TouchableOpacity>
                            );
                        })
                    }
                </ScrollView>
                {
                    isGroupMode && selectedParticipants.length >= 2 && (
                        <View style={styles.createGroupButton}>
                            <Button onPress={createGroup}
                                disabled={!groupName.trim()}
                                loading={isLoading}><Typo fontWeight={"bold"} size={17}>Create Group</Typo>
                            </Button>
                        </View>
                    )
                }
            </View>
        </ScreenWrapper>
    )
}

export default NewConversationModel

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacingX._15,
        flex: 1
    },
    groupInfoContainer: {
        alignItems: "center",
        marginTop: spacingY._10,
    },

    avatarContainer: {
        marginBottom: spacingY._10,
    },

    groupNameContainer: {
        width: "100%",
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._5,
    },
    selectedContact: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15,
    },
    contactList: {
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(150),
    },
    selectIndicator: {
        marginLeft: "auto",
        marginRight: spacingX._10,

    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary
    },
    checked: {
        backgroundColor: colors.primaryDark,
    },
    createGroupButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral100,
    }


})