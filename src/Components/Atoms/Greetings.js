import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
import {ThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from './CustomText';

const Greetings = ({name}) => {
  const themeColor = useContext(ThemeContext);
  const Styles = GreetingsStyle(themeColor);

  return (
    <View style={Styles.mainContainer}>
      <AppText style={Styles.textStyle}>Hi, {name}</AppText>
    </View>
  );
};

export default Greetings;

const GreetingsStyle = COLORS =>
  StyleSheet.create({
    mainContainer: {
      width: '100%',
      marginVertical: moderateScale(10),
    },
    textStyle: {
      fontSize: moderateScale(22),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
  });
