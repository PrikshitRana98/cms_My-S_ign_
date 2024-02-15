import React from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';

const HeaderSearch = ({
  placeholder = 'Search',
  containerStyle = {},
  inputStyle = {},
  placeholderTextColor = '#00000026',
}) => {
  const themeColor = useThemeContext();
  const Styles = SearchStyles(themeColor);
  return (
    <View style={[Styles.container, containerStyle]}>
      <TextInput
        style={[Styles.textInputStyle, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
      />
    </View>
  );
};

export default HeaderSearch;

const SearchStyles = COLORS =>
  StyleSheet.create({
    container: {
      width: '97%',
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: '100%',
    },
  });
