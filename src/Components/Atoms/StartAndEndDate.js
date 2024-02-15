import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AppText from './CustomText';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';

const StartAndEndDate = ({
  containerStyle = {},
  startDate = '',
  endDate = '',
}) => {
  const themeColor = useThemeContext();
  const Styles = commonStyles(themeColor);
  return (
    <View style={[Styles.mainContainer, containerStyle]}>
      <View style={Styles.startView}>
        <MaterialCommunityIcons
          name="clock-time-five-outline"
          size={13}
          color={themeColor.themeColor}
        />
        <AppText style={Styles.textStyle}>Start Date : {startDate}</AppText>
      </View>
      <View style={Styles.startView}>
        <MaterialCommunityIcons
          name="clock-time-five-outline"
          size={13}
          color={themeColor.themeColor}
        />
        <AppText style={Styles.textStyle}>End Date : {endDate}</AppText>
      </View>
    </View>
  );
};

export default StartAndEndDate;

const commonStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      padding: moderateScale(10),
      backgroundColor: COLORS.cardBorderLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: moderateScale(10),
      marginVertical: moderateScale(15),
    },
    startView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textStyle: {
      fontSize: moderateScale(10),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(3),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
  });
