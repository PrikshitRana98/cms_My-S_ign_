import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {moderateScale} from '../../../../Helper/scaling';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AppText from '../../../Atoms/CustomText';
import {useThemeContext} from '../../../../appConfig/AppContext/themeContext';

const MediaListBody = ({item, index}) => {
  const themeColor = useThemeContext();
  const Styles = MediaListStyles(themeColor);
  return (
    <View style={Styles.renderContainer}>
      <View style={Styles.iconView}>
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.themeColor}
          size={25}
        />
      </View>
      <View style={Styles.nameView}>
        <AppText style={Styles.nameText}>{item.name}</AppText>
      </View>
      <Text>MediaListBody</Text>
    </View>
  );
};

export default MediaListBody;

const MediaListStyles = COLORS =>
  StyleSheet.create({
    renderContainer: {
      flexDirection: 'row',
      width: '100%',
      margin: moderateScale(0.5),
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(10),
    },
  });
