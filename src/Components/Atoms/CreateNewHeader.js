import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import LeftArr from '../../Assets/Images/PNG/left_arr.png';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from './CustomText';

const CreateNewHeader = ({
  title = '',
  containerStyle = {},
  iconStyle = {},
  onClickIcon = () => {},
}) => {
  const themeColor = useThemeContext();
  const Styles = HeaderStyles(themeColor);

  return (
    <View style={[Styles.mainContainer, containerStyle]}>
      <TouchableOpacity onPress={onClickIcon} style={Styles.iconView}>
        <Image source={LeftArr} style={Styles.backIcon} />
      </TouchableOpacity>
      <AppText style={Styles.headerText}>{title}</AppText>
    </View>
  );
};

export default CreateNewHeader;

const HeaderStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: moderateScale(10),
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
      color: COLORS.textColor,
    },
    backIcon: {
      height: moderateScale(12),
      width: moderateScale(7),
      resizeMode: 'contain',
    },
  });
