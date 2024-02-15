import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import AppText from './CustomText';

const LegendView = ({data}) => {
  const themeColor = useThemeContext();
  const Styles = LegendStyles(themeColor);

  return (
    <View style={Styles.container}>
      {data.map(item => (
        <View key={item?.name} style={Styles.legendRow}>
          <View
            style={{
              width: moderateScale(20),
              height: moderateScale(20),
              borderRadius: moderateScale(5),
              backgroundColor: item.color,
              marginVertical: moderateScale(10),
            }}
          />
          <AppText style={Styles.legendText}>{item.name}</AppText>
        </View>
      ))}
    </View>
  );
};

export default LegendView;
const LegendStyles = COLORS =>
  StyleSheet.create({
    container: {
      flexDirection: 'column-reverse',
    },
    legendRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    legendText: {
      fontSize: moderateScale(15),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
  });
