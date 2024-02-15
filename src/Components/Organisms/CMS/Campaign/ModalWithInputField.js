import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import ThemedButton from "../../../Atoms/ThemedButton";
import { moderateScale } from "../../../../Helper/scaling";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import AppTextInput from "../../../Atoms/AppTextInputs";

const ModalWithInputField = ({ visible = false,visibleAction, onSubmitModal,value,setValue, errorMessage,setErrorMessage }) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
 

  
  return (
    <Portal>
      <Modal
        visible={visible}
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
        
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.locationContainer}>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <AppText style={Styles.locationHeader}>
                Reason of Rejection
              </AppText>
              <AppText style={{marginTop:50}}>
                Reason*
              </AppText>
              <AppTextInput
                containerStyle={Styles.eventTitleInput}
                placeHolderText="Reason*"
                placeholderTextColor={themeColor.placeHolder}
                value={value}
                onChangeText={(text) => {
                  setValue(text);
                  if(text.trim().length > 0) {
                    setErrorMessage("")
                  }else{
                    setErrorMessage("Enter reason")
                  }
                }}
                textInputStyle={{
                  fontSize: moderateScale(15),
                }}
              />
              {
                errorMessage && <Text style={{color:'red'}}>
                  {errorMessage}
                </Text>
              }
              </View>
            <View
              style={{
                flexDirection: "row",
                alignItem: "center",
                justifyContent: "center",
                marginTop:30,
              }}
            >
              <ThemedButton
                onClick={() => {
                  visibleAction(false)
                  setErrorMessage("")
                }}
                title="Cancel"
                containerStyle={Styles.cancelButtonContainer}
                textStyle={Styles.cancelButtonText}
              />
              <ThemedButton
                onClick={() => {
                  onSubmitModal()
                }}
                title="Reject"
                textStyle={{
                  fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default ModalWithInputField;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "center",
      padding: 15,
    },
    textinputContainer:{
      width: "100%",
      justifyContent: "center",
      alignItems: 'center',
    },
    locationContainer: {
      // height: "72%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(10),
      alignItems: "center",
      padding: moderateScale(20),
      justifyContent: "space-between",
    },
    cancelButtonContainer:{
      backgroundColor: "transparent",
      borderColor: "red",
      borderWidth: 1,
      marginRight: 12,
    },
    cancelButtonText:{
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                  color: "red",
    },
    locationHeader: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
      textAlign:'center'
    },
    baseLineContainer: {
      alignItems: "baseline",
    },
    brandContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
      width: "100%",
    },
    iconAndNameView: {
      flexDirection: "row",
      alignItems: "center",
    },
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      width:'100%',
      alignSelf:'center'
    },
    brandText: {
      fontSize: moderateScale(18),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(10),
    },
  });
