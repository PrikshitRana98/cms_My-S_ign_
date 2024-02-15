import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const ThemedButton = ({
  title = '',
  disabled="",
  containerStyle = {},
  textStyle = {},
  onClick,
}) => {
  const themeColor = useThemeContext();
  const Styles = ThemeButtonStyles(themeColor);

  return (
    <TouchableOpacity
      disabled={disabled?disabled:false}
      style={[Styles.mainContainer, containerStyle]}
      onPress={onClick}>
      <Text style={[Styles.textStyle, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ThemedButton;

const ThemeButtonStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(20),
      backgroundColor: COLORS.themeColor,
      borderRadius: moderateScale(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      fontSize: moderateScale(14),
      color: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
    },
  });
