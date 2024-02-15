import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {moderateScale} from '../../Helper/scaling';
import AppText from './CustomText';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Pagination = ({pageNumber,totalpage,setState,onClick}) => {
  const themeColor = useThemeContext();
  const Styles = PaginationStyles(themeColor);

  const renderView = (index, active) => {

    return (
      <TouchableOpacity
        key={index}
        onPress={()=>onClick(index+1,5)}
        style={[
          Styles.activeView,
          {
            backgroundColor:
              index + 1 === active ? themeColor.white : themeColor.themeLight,
          },
        ]}>
        <AppText
        style={{
            fontSize: moderateScale(12),
            color: themeColor.textColor,
            fontFamily:
              index + 1 === active
                ? FONT_FAMILY.OPEN_SANS_BOLD
                : FONT_FAMILY.OPEN_SANS_MEDIUM,
          }}>
          {index + 1}
        </AppText>
      </TouchableOpacity>
    );
  };

  const data = Array(totalpage).fill(0);
  return (
    <View style={Styles.mainContainer}>
       <TouchableOpacity
        onPress={()=>{
          if(pageNumber>1){
            onClick(pageNumber-1,5)
          }
        }}
        >
        <Ionicons name="chevron-back" size={25} color={themeColor.black} />
      </TouchableOpacity>

      {data.map((item, index) => renderView(index, pageNumber))}
      <TouchableOpacity
        onPress={()=>{
          if(pageNumber<totalpage){
            onClick(pageNumber+1,5)
          }
        }}
        >
      <Ionicons
        name="chevron-forward-outline"
        size={25}
        color={themeColor.black}
      />
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const PaginationStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: moderateScale(10),
      flexWrap:'wrap'
    },
    activeView: {
      height: moderateScale(25),
      width: moderateScale(25),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      margin: moderateScale(5),
      borderRadius: moderateScale(5),
    },
  });
