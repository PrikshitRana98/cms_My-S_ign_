import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from './CustomText';
const AddNewButton = ({
  title = '',
  containerStyle = {},
  iconStyle = {},
  textStyle = {},
  onClick,
  addStyle = {},
}) => {
  const themeColor = useThemeContext();
  const Styles = ButtonStyles(themeColor);
  return (
    <Pressable onPress={()=>{onClick()}} style={[Styles.mainContainer, containerStyle]}>
      <View style={[Styles.IconView, iconStyle]}>
        <AppText style={[Styles.textStyle, Styles.addStyle, addStyle]}>
          +
        </AppText>
      </View>
      <AppText style={[Styles.textStyle, textStyle]}>Add New {title}</AppText>
    </Pressable>
  );
};

export default AddNewButton;

const ButtonStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      padding: 5,
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(25),
      borderColor: COLORS.unselectedText,
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    IconView: {
      width: moderateScale(40),
      height: moderateScale(40),
      borderRadius: moderateScale(25),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      color: COLORS.themeColor,
      fontSize: moderateScale(15),
      marginHorizontal: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    addStyle: {
      fontSize: moderateScale(26),
    },
  });
