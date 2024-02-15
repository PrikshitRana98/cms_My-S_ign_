import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";

const CustomIconText = ({
  icon = () => {},
  name = "",
  isTextBold = false,
  containerStyle = {},
  textStyle = {},
  onPress = () => {},
}) => {
  const themeColor = useThemeContext();
  const Styles = IconTextValueStyles(themeColor);

  return (
    <Pressable onPress={onPress}>
      <View style={[Styles.mainContainer, containerStyle]}>
        {icon()}
        <AppText
          style={[
            Styles.brandText,
            {
              fontFamily: isTextBold
                ? FONT_FAMILY.OPEN_SANS_SEMI_BOLD
                : FONT_FAMILY.OPEN_SANS_REGULAR,
            },
            textStyle,
          ]}
        >
          {name}
        </AppText>
      </View>
    </Pressable>
  );
};

export default CustomIconText;

const IconTextValueStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
    },
    iconAndNameView: {
      flexDirection: "row",
      alignItems: "center",
    },
    brandTextView: {
      flexDirection: "row",
      marginHorizontal: moderateScale(15),
    },
    brandText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
    textWrap: {
      flexDirection: "row",
      alignItems: "center",
      padding: moderateScale(1),
    },
    greenText: {
      color: COLORS.activeGreen,
      fontSize: moderateScale(18),
      fontWeight: "600",
    },
    redText: {
      color: COLORS.activeRed,
      fontSize: moderateScale(18),
      fontWeight: "600",
    },
    seperatorLine: {
      height: moderateScale(1),
      width: "100%",
      backgroundColor: COLORS.border,
    },
    arrowStyle: {
      height: moderateScale(8),
      width: moderateScale(13),
      tintColor: COLORS.themeColor,
    },
  });
