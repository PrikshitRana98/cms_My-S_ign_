import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from './CustomText';

const ThemedText = ({title = '', textStyles = {}, containerStyle = {}}) => {
  const themeColor = useThemeContext();
  const Styles = ThemeStyles(themeColor);
  return (
    <View style={[Styles.mainContainer, containerStyle]}>
      <AppText style={[Styles.statusStyle, textStyles]}>{title}</AppText>
    </View>
  );
};

export default ThemedText;

const ThemeStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      borderRadius: moderateScale(20),
      alignSelf: 'flex-start',
    },
    statusStyle: {
      alignSelf: 'flex-start',
      fontSize: moderateScale(13),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
  });
