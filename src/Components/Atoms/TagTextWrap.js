import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import AppText from './CustomText';

const TagTextWrap = ({
  title = '',
  value = 0,
  tagged = 0,
  untagged = 0,
  valueTextColor = '#000',
  containerStyle = {},
}) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  return (
    <View style={[Styles.mainContainer, containerStyle]}>
      <AppText style={Styles.commonText}>{title} :</AppText>
      <AppText style={[Styles.valueText, {color: valueTextColor}]}>
        {' '}
        {value}{' '}
      </AppText>
      <AppText
        style={
          Styles.commonText
        }>{`(Tagged : ${tagged}, Untagged : ${untagged})`}</AppText>
    </View>
  );
};

export default TagTextWrap;

const CommonStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: moderateScale(10),
    },
    commonText: {
      fontSize: moderateScale(15),
      color: COLORS.textColor,
    },
    valueText: {
      fontSize: moderateScale(15),
    },
  });
