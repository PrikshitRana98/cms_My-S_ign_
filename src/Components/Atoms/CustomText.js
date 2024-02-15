import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';

const AppText = props => {
  const themeColor = useThemeContext();
  const Styles = textStyles(themeColor);

  const {children = '', style = {}} = props;
  const textProps = {...props};
  delete textProps?.children;

  return (
    <Text style={[{color:themeColor.textColor},Styles.textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};
export default AppText;

const textStyles = COLORS =>
  StyleSheet.create({
    textStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(16),
      color: COLORS.textColor,
    },
  });
