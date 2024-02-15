import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import DownArrow from "../../Assets/Images/PNG/down_arr.png";
import UpArrow from "../../Assets/Images/PNG/up_arr.png";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";

const CustomIconTextValue = ({
  icon = () => {},
  name = "",
  high = null,
  low = null,
  isChevron = true,
  isChevronUp = true,
  isTextBold = true,
  containerStyle = {},
  isChecked = false,
  iconNameContainerStyle = {},
  onPressArrow = () => {},
}) => {
  const themeColor = useThemeContext();
  const Styles = IconTextValueStyles(themeColor);

  const colorTextWrap = (number1, number2) => {
    return (
      <View style={Styles.textWrap}>
        <AppText style={[Styles.brandText]}>{"("}</AppText>
        <AppText style={Styles.greenText}>{number1}</AppText>
        <AppText style={[Styles.brandText]}>{", "}</AppText>
        <AppText style={Styles.redText}>{number2}</AppText>
        <AppText style={[Styles.brandText]}>{")"}</AppText>
      </View>
    );
  };

  return (
    <View style={[Styles.brandContainer, containerStyle]}>
      <View style={[Styles.iconAndNameView, iconNameContainerStyle]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {isChevron && (
            <TouchableOpacity
              style={{
                padding: moderateScale(5),
                marginRight: 10,
              }}
              onPress={onPressArrow}
            >
              <Image
                source={isChevronUp ? UpArrow : DownArrow}
                style={Styles.arrowStyle}
              />
            </TouchableOpacity>
          )}
          {icon()}
        </View>
        <View
          style={[Styles.brandTextView, { width: "70%", flexWrap: "wrap" }]}
        >
          <AppText
            style={[
              Styles.brandText,
              {
                fontFamily: isTextBold
                  ? FONT_FAMILY.OPEN_SANS_SEMI_BOLD
                  : FONT_FAMILY.OPEN_SANS_REGULAR,
              },
            ]}
          >
            {name}
          </AppText>
          {high != null && low != null && colorTextWrap(high, low)}
        </View>
      </View>
    </View>
  );
};

export default CustomIconTextValue;

const IconTextValueStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(0),
    },
    brandContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(0),
      paddingVertical: moderateScale(10),
    },
    iconAndNameView: {
      flexDirection: "row",
      alignItems: "center",
    },
    brandTextView: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: moderateScale(8),
    },
    brandText: {
      fontSize: moderateScale(12),
      color: COLORS.textColor,
    },
    textWrap: {
      flexDirection: "row",
      alignItems: "center",
      padding: moderateScale(1),
    },
    greenText: {
      color: COLORS.activeGreen,
      fontSize: moderateScale(14),
      fontWeight: "600",
    },
    redText: {
      color: COLORS.activeRed,
      fontSize: moderateScale(14),
      fontWeight: "600",
    },
    seperatorLine: {
      height: moderateScale(1),
      width: "100%",
      backgroundColor: COLORS.border,
    },
    arrowStyle: {
      height: moderateScale(8),
      width: moderateScale(15),
      tintColor: COLORS.themeColor,
    },
  });
