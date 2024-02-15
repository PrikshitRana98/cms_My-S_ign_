import React,{useState} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import AppText from './CustomText';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ICON_NAMES} from '../../Constants/iconNames';
import DownArrow from '../../Assets/Images/PNG/down_arr.png';
const CommonTitleAndText = ({
  containerStyle = {},
  titleStyle = {},
  textStyle = {},
  title = '',
  text = '',
  isIcon = false,
  isCalender = false,
  isClock = false,
  isDownArr = false,
  isButton = false,
  onPress= () => {},
  RightButton = () => {},
}) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  return (
    <TouchableOpacity onPress={()=>{
      onPress();
      console.log("onpresssdsdsfd")
      }} style={[Styles.mainContainer, containerStyle]}>
      <View >
        <AppText style={[Styles.titleStyle, titleStyle]}>{title}</AppText>
        <AppText style={[Styles.textStyle, textStyle]}>{text}</AppText>
      </View>
      {isIcon && (
        <>
          {isCalender && (
            <>
                <MaterialCommunityIcons
                  name="calendar"
                  size={25}
                  color={themeColor.unselectedText}
                  // onPress={onPress}
                />
            </>
          )}
          {isClock && (
            <MaterialCommunityIcons
              name={ICON_NAMES.MCI_CLOCK}
              size={22}
              color={themeColor.unselectedText}
              // onPress={onPress}
            />
          )}
          {isDownArr && <Image source={DownArrow} style={Styles.downStyle} />}
        </>
      )}
      {isButton && RightButton()}
    </TouchableOpacity>
  );
};
export default CommonTitleAndText;
const CommonStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    titleStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.placeHolder,
    },
    textStyle: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.textColor,
      marginTop: moderateScale(5),
    },
    downStyle: {
      height: moderateScale(8),
      width: moderateScale(14),
      tintColor: COLORS.unselectedText,
    },
  });