import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";

const ActionContainerTwoBtn = ({
  containerStyle = {},
  onFirstButton,
  onSecondButton,
  firstButtonTextColor = "white",
  secondButtonTextColor = "white",
  firstButtonBgColor="green",
  secondButtonBgColor="blue",
  firstButtonText,
  secondButtonText,
  isDisabled = false,
}) => {
  const themeColor = useThemeContext();
  const Styles = ActionStyles(themeColor);

  return (
    <View style={[Styles.mainContainer(isDisabled)]}>
      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => onFirstButton()}
        style={[Styles.commonView]}
      >
        <AppText style={[Styles.commonText]}>
          {firstButtonText}
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSecondButton()}
        style={[Styles.commonView, Styles.continueView]}
      >
        <AppText style={[Styles.commonText, Styles.nextText]}>
          {secondButtonText}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

export default ActionContainerTwoBtn;

const ActionStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: (isDisabled) => ({
      width: "100%",
      backgroundColor: COLORS.white,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: moderateScale(15),
      opacity: isDisabled ? 0.5 : 1,
    }),
    commonView: {
      borderRadius: moderateScale(10),
      borderWidth: 1,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(20),
    },
    commonText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(13),
      alignSelf: "center",
      color: COLORS.textColor,
    },
    cancelView: (isContinue) => ({
      borderColor: COLORS.red,
      paddingHorizontal: isContinue ? moderateScale(50) : moderateScale(15),
    }),
    
    draftView: {
      borderColor: COLORS.unselectedText,
    },
    draftText: {
      color: COLORS.unselectedText,
    },
    nextView: {
      backgroundColor: COLORS.themeColor,
    },
    continueView: {
      backgroundColor: COLORS.themeColor,
      paddingHorizontal: moderateScale(25),
    },
    nextText: {
      color: COLORS.white,
    },
  });
