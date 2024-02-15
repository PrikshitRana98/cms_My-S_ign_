import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";

const ActionContainer = ({
  containerStyle = {},
  onPressSave = () => {},
  onPressCancel = () => {},
  onPressDraft = () => {},
  isContinue = false,
  continueText = "Continue & Review",
  cancelText = "Cancel",
  draftText = "Save As Draft",
  saveText = "Save & Next",
  cancelStyle = {},
  continueStyle = {},
  draftStyle = {},
  saveStyle = {},
  isDisabled = false,
}) => {
  const themeColor = useThemeContext();
  const Styles = ActionStyles(themeColor);

  return (
    <View style={[Styles.mainContainer(isDisabled), containerStyle]}>
      <TouchableOpacity
        disabled={isDisabled}
        onPress={() => onPressCancel()}
        style={[Styles.commonView, Styles.cancelView(isContinue), cancelStyle]}
      >
        <AppText style={[Styles.commonText, Styles.cancelText]}>
          {cancelText}
        </AppText>
      </TouchableOpacity>
      {isContinue ? (
        <TouchableOpacity
          disabled={isDisabled}
          onPress={() => onPressSave()}
          style={[Styles.commonView, Styles.continueView, continueStyle]}
        >
          <AppText style={[Styles.commonText, Styles.nextText]}>
            {continueText}
          </AppText>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            disabled={isDisabled}
            onPress={() => onPressDraft()}
            style={[Styles.commonView, Styles.draftView, draftStyle]}
          >
            <AppText style={[Styles.commonText, Styles.draftText]}>
              {draftText}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isDisabled}
            onPress={() => onPressSave()}
            style={[Styles.commonView, Styles.nextView, saveStyle]}
          >
            <AppText style={[Styles.commonText, Styles.nextText]}>
              {saveText}
            </AppText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ActionContainer;

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
      paddingHorizontal: moderateScale(10),
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
    cancelText: {
      color: COLORS.red,
    },
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
