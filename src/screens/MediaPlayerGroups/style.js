import React from 'react';
import {StyleSheet, View} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    fullFlex: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: 10,
      alignSelf: 'baseline',
    },
    totalRecords: {
      margin: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
    },
    searchView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(5),
      marginVertical: moderateScale(10),
    },
    themeContainer: {
      width: '95%',
      alignSelf: 'center',
      marginVertical: moderateScale(10),
    },
  });
export default Styles;
