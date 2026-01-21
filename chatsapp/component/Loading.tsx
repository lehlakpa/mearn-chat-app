import { ActivityIndicator, ActivityIndicatorProps, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'

const Loading = ({size="large",
    color=colors.primaryDark
}: ActivityIndicatorProps) => {
  return (
    <View style={{justifyContent:"center",alignItems:"center"}}>
     <ActivityIndicator size={size} color={colors.neutral300} />
    </View>
  )
}

export default Loading;