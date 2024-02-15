import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Dropdown } from "react-native-element-dropdown"; 
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale } from "../../Helper/scaling";

export default function DropdownComp({ 
  dataList, 
  onChange, 
  value,
  placeHolderText,
  containerStyle='',
  isDisabled=false,
 }) {
  const themeColor = useThemeContext();
  const Styles = UIStyle(themeColor);

  const renderItem = item => {
    return (
      <View style={Styles.item}>
        <Text style={Styles.textItem}>{item.label}</Text>
      </View>
    );
  };


  return (
    <View>
      <Dropdown
        style={containerStyle || Styles.dropdown}
        placeholderStyle={Styles.placeholderStyle}
        selectedTextStyle={Styles.selectedTextStyle}
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
        renderItem={renderItem}
      />
    </View>
  );
}

const UIStyle = (COLORS) =>
  StyleSheet.create({
    dropdown: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginTop:3,
    },
    placeholderStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#ADB2C3",
    },
    selectedTextStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#ADB2C3",
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
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
  });
