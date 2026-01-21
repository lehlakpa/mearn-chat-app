import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/component/ScreenWrapper'
import Header from '@/component/Header'
import { Platform } from 'react-native'
import { BackButton } from '@/component/BackButton'
import { colors, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { Avatar } from '@/component/Avatar'

const profileModel = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title={"Update Profile"}
          leftIcon={Platform.OS === "android" && <BackButton color={colors.black} />}
          style={{ marginVertical: spacingY._15 }}
        />
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Avatar uri={null} size={170}/>
            <TouchableOpacity>
              <Icons.pencil size={verticalScale(20)} color={colors.neutral300}></Icons.pencil>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </View>
    </ScreenWrapper>
  )
}

export default profileModel

const styles = StyleSheet.create({
  container:{
    flex:1,
  justifyContent:"space-between",
  paddingHorizontal:spacingY._20
  },
  form:{
gap:spacingY._20,
marginTop:spacingY._15,
  }
,avatarContainer:{
  position:"relative",
  alignSelf:"center"

},
avatar:{
  alignItems:"center",
  backgroundColor:colors.neutral200,
  height:verticalScale(135),
  width:verticalScale(135),
  borderRadius:200,
  borderWidth:1,
  borderColor:colors.neutral500,
},
editIcon:{
  position:"absolute",
  bottom:spacingY._5,
  right:spacingY._7,
  borderRadius:100,
  borderColor:colors.neutral100,
shadowColor:colors.black,
shadowOffset:{
  width :0, height:0
}
,shadowOpacity:0.25,
shadowRadius:10,
padding:spacingY._7
},
inputContainer:{
  gap:spacingY._7,
}
})