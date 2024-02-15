import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import AppText from './CustomText';

const SubHeaderText = ({title = ' ', textStyle = {},onPress= () => {}, containerStyle = {}}) => {
  const themeColor = useThemeContext();
  const Styles = SubHeaderStyles(themeColor);
  return (
    <Pressable onPress={onPress} style={[Styles.mainContainer, containerStyle]}>
      <AppText style={[Styles.textStyle, textStyle]}>{title}</AppText>
    </Pressable>
  );
};

export default SubHeaderText;

const SubHeaderStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {},

    textStyle: {
      fontSize: moderateScale(17),
      color: COLORS.textColor,
    },
  });
