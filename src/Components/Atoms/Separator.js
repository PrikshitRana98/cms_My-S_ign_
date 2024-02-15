import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import {moderateScale} from '../../Helper/scaling';

const Separator = ({separatorStyle = {}}) => {
  const themeColor = useThemeContext();
  const Styles = SeparatorStyles(themeColor);
  return <View style={[Styles.separatorLine, separatorStyle]} />;
};

export default React.memo(Separator);

const SeparatorStyles = COLORS =>
  StyleSheet.create({
    separatorLine: {
      height: moderateScale(1),
      width: '100%',
      backgroundColor: COLORS.border,
    },
  });
