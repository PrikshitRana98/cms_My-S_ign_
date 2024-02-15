import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';
import DownArr from '../../Assets/Images/PNG/down_arr.png';
import SearchIcon from '../../Assets/Images/PNG/search.png';
import { moderateScale } from '../../Helper/scaling';
import { useThemeContext } from '../../appConfig/AppContext/themeContext';
import AppTextInput from './AppTextInputs';
// import CalenderIcon from '../../Assets/Images/PNG/calender.png';
import CalenderIcon from '../../Assets/Images/PNG/calender.png';

const SearchBox = ({
  isIcon = false,
  stateValue,
  changeText,
  placeholder = 'Search',
  containerStyle = {},
  inputStyle = {},
  placeholderColor = '#00000026',
  iconStyle = {},
  isDownArr,
  isCalender = false,
  handleOnSubmitEditing
}) => {
  const themeColor = useThemeContext();
  const Styles = SearchStyles(themeColor);
  return (
    <View style={[Styles.container, containerStyle]}>
      {isIcon && (
        <Image source={SearchIcon} style={[Styles.searchIcon, iconStyle]} />
      )}
      <AppTextInput
        value={stateValue && stateValue}
        numberOfLines={1}
        placeholder={placeholder}
        onChangeText={(e) => changeText(e)}
        placeholderTextColor={themeColor.placeHolder}
        textInputStyle={[Styles.textInputStyle, inputStyle]}
        containerStyle={{
          width: '80%',
          marginHorizontal: moderateScale(5),
        }}
        handleOnSubmitEditing={handleOnSubmitEditing}
      />
      {isCalender && (
        <Image source={CalenderIcon} style={[Styles.calenderIcon, iconStyle]} />
      )}
      {isDownArr && (
        <Image source={DownArr} style={[Styles.downIcon, iconStyle]} />
      )}
    </View>
  );
};

export default SearchBox;

const SearchStyles = COLORS =>
  StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    textInputStyle: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: Platform.OS === 'ios' ? moderateScale(10) : undefined,
    },
    searchIcon: {
      height: moderateScale(19),
      width: moderateScale(19),
    },
    downIcon: {
      height: moderateScale(6),
      width: moderateScale(10),
      resizeMode: 'contain',
    },
    calenderIcon: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: 'contain',
    },
  });
