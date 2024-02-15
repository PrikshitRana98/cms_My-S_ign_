import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import CustomIconTextValue from '../Atoms/IconTextValue';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeIcon from '../../Assets/Images/PNG/home_icon.png';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';

const getIcon = (isChecked, themeColor, onClick = () => {}) => (
  <TouchableOpacity onPress={() => onClick()}>
    {isChecked ? (
      <Ionicons name="checkbox" size={25} color={themeColor.themeColor} />
    ) : (
      <MaterialIcons
        name="check-box-outline-blank"
        color={themeColor.themeColor}
        size={24}
      />
    )}
  </TouchableOpacity>
);

export const LocationBrandContainer = ({
  title = '',
  count = {},
  isChevronUp = true,
  onPressArrow = () => {},
}) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  const getHomeIcon = () => (
    <Image
      source={HomeIcon}
      style={{
        height: moderateScale(23),
        width: moderateScale(23),
      }}
    />
  );
  return (
    <CustomIconTextValue
      icon={() => getHomeIcon()}
      name={title}
      high={count.high}
      low={count.low}
      isChevron={true}
      isChevronUp={true}
      isChecked={true}
      iconNameContainerStyle={Styles.baseLineContainer}
      onPressArrow={onPressArrow}
    />
  );
};
export const LocationCountryContainer = ({
  isChecked = true,
  isChevronUp = true,
  count = {},
  onPressArrow = () => {},
  onClickChecked = () => {},
  title = '',
}) => {
  const themeColor = useThemeContext();

  return (
    <CustomIconTextValue
      icon={() => getIcon(isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
      isChevron={true}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      onPressArrow={onPressArrow}
    />
  );
};

export const LocationStateContainer = ({
  isChecked,
  isChevronUp = true,
  count = {},
  onClickChecked = () => {},
  onPressArrow = () => {},
  title = '',
}) => {
  const themeColor = useThemeContext();

  return (
    <CustomIconTextValue
      icon={() => getIcon(isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
      isChevron={true}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      containerStyle={{
        paddingLeft: moderateScale(25),
      }}
      onPressArrow={onPressArrow}
    />
  );
};

export const LocationCityContainer = ({
  isChecked = false,
  isChevron = false,
  isChevronUp = true,
  count = {},
  onPressArrow = () => {},
  onClickChecked = () => {},
  title = '',
}) => {
  const themeColor = useThemeContext();

  return (
    <CustomIconTextValue
      icon={() => getIcon(isChecked, themeColor, onClickChecked)}
      name={title}
      high={count.high}
      low={count.low}
      isChevron={isChevron}
      isChevronUp={isChevronUp}
      isTextBold={false}
      isChecked={true}
      containerStyle={{
        paddingLeft: moderateScale(40),
      }}
      onPressArrow={onPressArrow}
    />
  );
};

const CommonStyles = COLORS =>
  StyleSheet.create({
    baseLineContainer: {
      alignItems: 'baseline',
    },
  });
