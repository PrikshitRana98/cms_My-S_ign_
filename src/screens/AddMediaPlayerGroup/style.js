import React from 'react';
import {StyleSheet} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    subContainer: {
      padding: moderateScale(10),
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },
    createNewStyles: {
      flexDirection: 'row',
      paddingVertical: moderateScale(10),
    },
    playerIdentifier: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(3),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
    },
    iconView: {
      height: moderateScale(23),
      width: moderateScale(23),
      borderRadius: moderateScale(12),
      backgroundColor: COLORS.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerText: {
      fontSize: moderateScale(17),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
    },
    backIcon: {
      height: moderateScale(12),
      width: moderateScale(7),
    },
    bodyContainer: {
      paddingVertical: moderateScale(10),
      backgroundColor: COLORS.white,
      marginVertical: moderateScale(10),
    },
    bodyHeaderText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(15),
    },
    optionText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(15),
      marginHorizontal: moderateScale(5),
      color: COLORS.textColor,
    },
    bodyRowContainer: {
      margin: moderateScale(10),
      backgroundColor: COLORS.white,
      padding: 10,
    },
    headerItemStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      padding: moderateScale(20),
    },
    actionView: {
      width: '48%',
    },
  });
export default Styles;
