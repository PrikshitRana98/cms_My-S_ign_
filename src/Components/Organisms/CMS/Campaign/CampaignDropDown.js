import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown";
import { moderateScale } from "../../../../Helper/scaling";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";

function CampaignDropDown({ 
  dataList, 
  onChange, 
  value,
  placeHolderText,
  containerStyle='',
  isDisabled=false,
 }) {
  const themeColor = useThemeContext();
  const Styles = UIStyle(themeColor);
  return (
    <View>
      <Dropdown
        style={[containerStyle || Styles.dropdown,{backgroundColor:isDisabled ? themeColor.iconBackground:themeColor.white}]}
        placeholderStyle={Styles.placeholderStyle}
        selectedTextStyle={[Styles.selectedTextStyle]}
        inputSearchStyle={Styles.inputSearchStyle}
        iconStyle={Styles.iconStyle}
        itemTextStyle={{ color: "#000000" }}
        data={dataList}
        search={false}
      
        maxHeight={300}
        disable={isDisabled}
        dropdownPosition="auto"
        labelField="label"
        valueField="value"
        placeholder={placeHolderText || "Select Templates *"}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => {
          onChange(item);
        }}
      />
    </View>
  );
}
export default React.memo(CampaignDropDown)
const UIStyle = (COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginTop:0,
    },
    placeholderStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#ADB2C3",
    },
    selectedTextStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color:COLORS.textColor,
      
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: "contain",
    },
  });
