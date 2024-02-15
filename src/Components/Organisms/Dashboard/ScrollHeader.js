import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import { moderateScale } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import SubHeaderText from "../../Atoms/SubHeaderText";

const ScrollHeader = ({ data, setValue, value }) => {
  const themeColor = useThemeContext();
  const Styles = HeaderStyles(themeColor);
  const handleItemPress = (item) => {
    setValue(item);
  };
  return (
    <ScrollView
      bounces={false}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {data.map((item, index) => {
        return (
          <SubHeaderText
            onPress={() => handleItemPress(item)}
            key={item + index}
            title={item}
            textStyle={{
              fontSize: moderateScale(15),
              color: value === item ? themeColor.textColor : themeColor.border,
              paddingBottom: moderateScale(10),
              fontFamily:
                value === item
                  ? FONT_FAMILY.OPEN_SANS_SEMI_BOLD
                  : FONT_FAMILY.OPEN_SANS_REGULAR,
            }}
            containerStyle={{
              marginHorizontal: moderateScale(10),
              borderBottomWidth: moderateScale(2),
              borderBottomColor: value === item ? "#253D91" : "transparent",
            }}
          />
        );
      })}
    </ScrollView>
  );
};

export default ScrollHeader;

const HeaderStyles = (COLORS) =>
  StyleSheet.create({
    headerTextContainer: (index, item) => ({
      marginHorizontal: moderateScale(10),
      borderBottomWidth: moderateScale(2),
      borderBottomColor: value === item ? COLORS.themeColor : "transparent",
    }),
  });
