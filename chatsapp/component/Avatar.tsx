import { StyleSheet, View } from 'react-native';
import React from 'react';
import { verticalScale } from '@/utils/styling';
import { AvatarProps } from '@/types';
import { colors, radius } from '@/constants/theme';
import {Image } from "expo-image";
import { getAvatarPath } from '@/services/imageService';

export const Avatar = ({
  uri,
  size = 40,
  style,
  isGroup = false,
}: AvatarProps) => {
  const source = getAvatarPath(uri, isGroup);
  return (
    <View
      style={[
        styles.avatar,
        {
          height: verticalScale(size),
          width: verticalScale(size),
        },
        style,
      ]}
    >
        <Image style={{flex:1}}
        source={typeof source === 'string' ? { uri: source } : source}
        contentFit="cover"
        transition={100}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    backgroundColor: colors.neutral200,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.neutral100,
    overflow: 'hidden',
  },
});
