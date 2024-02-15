import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";

const AppTextInput = ({
  value = "",
  onChangeText,
  isPassword = false,
  isEditable = true,
  placeHolderText = "",
  placeholderTextColor = "grey",
  returnKeyType = "default",
  autoComplete = "off",
  textContentType = "none",
  containerStyle = {},
  textInputStyle = {},
  handleOnSubmitEditing,
  handleOnFocus,
  handleOnBlur,
  keyboardType="default",
  showError = false,
  errorText = "",
  ...restProps
}) => {
  const themeColor = useThemeContext();
  const Styles = TextStyles(themeColor);
  return (
    <View style={[Styles.containerStyle, containerStyle]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[Styles.textInputStyle, textInputStyle]}
        editable={isEditable}
        keyboardType={keyboardType}
        placeholder={placeHolderText}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={isPassword}
        autoCapitalize="none"
        onSubmitEditing={handleOnSubmitEditing}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...restProps}
      />
      {showError && <AppText style={Styles.ErrorText}>{errorText}</AppText>}
    </View>
  );
};
export default AppTextInput;

const TextStyles = (COLORS) =>
  StyleSheet.create({
    containerStyle: {
      padding: moderateScale(3),
    },
    textInputStyle: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      height: 45,
    },
    ErrorText: {
      color: COLORS.activeRed,
      fontSize: moderateScale(12),
    },
  });
