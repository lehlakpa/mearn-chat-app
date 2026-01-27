import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import ScreenWrapper from "@/component/ScreenWrapper";
import Header from "@/component/Header";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { BackButton } from "@/component/BackButton";
import { Avatar } from "@/component/Avatar";
import * as ImagePicker from "expo-image-picker";
import Input from "@/component/Input";
import Typo from "@/component/Typo";
import { useAuth } from "@/contexts/authcontext";
import Button from "@/component/Button";
import { verticalScale } from "@/utils/styling";
import { getContacts, newConversation } from "@/socket/socketEvents";
import { uploadFileToCloudinary } from "@/services/imageService";

const NewConversationModel = () => {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const { isGroup } = useLocalSearchParams();
  const isGroupMode = isGroup === "1";

  const [groupAvatar, setGroupAvatar] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    getContacts(processGetContacts);
    newConversation(processNewConversation);
    getContacts(null);

    return () => {
      getContacts(processGetContacts, true);
      newConversation(processNewConversation, true);
    };
  }, []);

  const processGetContacts = (res: any) => {
    if (res.success && currentUser) {
      setContacts(
        res.data.filter(
          (c: any) => (c._id || c.id) !== currentUser.id
        )
      );
    }
  };

  const processNewConversation = (res: any) => {
    setIsLoading(false);
    if (res.success) {
      router.replace({
        pathname: "/(main)/conversation",
        params: {
          id: res.data._id,
          name: res.data.name,
          avatar: res.data.avatar,
          type: res.data.type,
          participants: JSON.stringify(res.data.participants),
        },
      });
    } else {
      Alert.alert("Error", res.msg);
    }
  };

  const onPickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });

    if (!result.canceled) setGroupAvatar(result.assets[0]);
  };

  const toggleParticipants = (user: any) => {
    const id = user._id || user.id;
    setSelectedParticipants((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const onSelectUser = (user: any) => {
    if (!currentUser) return;

    const id = user._id || user.id;

    if (isGroupMode) {
      toggleParticipants(user);
    } else {
      newConversation({
        type: "direct",
        participants: [currentUser.id, id],
      });
    }
  };

  const createGroup = async () => {
    if (!groupName.trim() || selectedParticipants.length < 2) return;

    setIsLoading(true);
    let avatar = null;

    if (groupAvatar) {
      const upload = await uploadFileToCloudinary(
        groupAvatar,
        "groupAvatar"
      );
      if (upload.success) avatar = upload.data;
    }

    newConversation({
      type: "group",
      name: groupName,
      avatar,
      participants: [currentUser!.id, ...selectedParticipants],
    });
  };

  return (
    <ScreenWrapper isModal={false} bgOpacity={0.5} showPattern={false}>
      <Header
        title={isGroupMode ? "New Group" : "New Chat"}
        leftIcon={<BackButton iconSize={22} />}
      />

      {/* GROUP INFO */}
      {isGroupMode && (
        <View style={styles.groupCard}>
          <TouchableOpacity onPress={onPickImage}>
            <Avatar
              size={90}
              uri={groupAvatar?.uri}
              isGroup
            />
            <View style={styles.cameraBadge}>
              <Typo size={14}>📷</Typo>
            </View>
          </TouchableOpacity>

          <Input
            placeholder="Group name"
            value={groupName}
            onChangeText={setGroupName}
            containerStyle={styles.groupInput}
          />
        </View>
      )}

      {/* CONTACT LIST */}
      <ScrollView
        contentContainerStyle={styles.contactList}
        showsVerticalScrollIndicator={false}
      >
        {contacts.map((user, index) => {
          const id = user._id || user.id;
          const selected = selectedParticipants.includes(id);

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.contactRow,
                selected && styles.contactSelected,
              ]}
              onPress={() => onSelectUser(user)}
            >
              <Avatar size={48} uri={user.avatar} />
              <Typo fontWeight="500">{user.name}</Typo>

              {isGroupMode && (
                <View style={styles.checkboxWrap}>
                  <View
                    style={[
                      styles.checkbox,
                      selected && styles.checkboxActive,
                    ]}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* CREATE GROUP BUTTON */}
      {isGroupMode && selectedParticipants.length >= 2 && (
        <View style={styles.bottomBar}>
          <Button
            loading={isLoading}
            disabled={!groupName.trim()}
            onPress={createGroup}
          >
            <Typo fontWeight="600">Create Group</Typo>
          </Button>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default NewConversationModel;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  groupCard: {
    alignItems: "center",
    paddingVertical: spacingY._15,
    gap: spacingY._10,
  },
  groupInput: {
    width: "85%",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    padding: 4,
  },
  contactList: {
    paddingHorizontal: spacingX._15,
    paddingBottom: verticalScale(120),
    gap: spacingY._10,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._10,
    borderRadius: radius._12,
    gap: spacingX._10,
  },
  contactSelected: {
    backgroundColor: colors.neutral100,
  },
  checkboxWrap: {
    marginLeft: "auto",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacingX._15,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral100,
  },
});
