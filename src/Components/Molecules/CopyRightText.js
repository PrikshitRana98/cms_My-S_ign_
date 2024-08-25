import React from 'react';
import {StyleSheet, View} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from '../Atoms/CustomText';

const CopyRightText = ({containerStyle}) => {
  const themeColor = useThemeContext();
  const Styles = CopyrightStyles(themeColor);
  return (
    <View style={[Styles.mainContainer, containerStyle]}>
      <AppText style={Styles.textStyle}>
        ©Panasonic 2024. All rights reserved.
      </AppText>
      {/* <AppText style={Styles.textStyle}>Need Help?</AppText> */}
    </View>
  );
};

export default CopyRightText;
const CopyrightStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop:20
    },
    textStyle: {
      fontSize: moderateScale(12),
      color: COLORS.heavyBlack,
      opacity: 0.7,
    },
  });
