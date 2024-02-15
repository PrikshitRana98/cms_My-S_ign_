import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import ThemedButton from "../../../Atoms/ThemedButton";
import { height, moderateScale } from "../../../../Helper/scaling";
import Cross from "../../../../Assets/Images/PNG/close.png";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import AppTextInput from "../../../Atoms/AppTextInputs";
import moment from "moment";

const PlanogramToolPin = ({
  visible = false,
  setToolTipStatus,
  pinnedPlanogram,
}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);

  const renderToolTipp = ({ item, index }) => {
    console.log('itemitem',item)
    return (
      <TouchableHighlight
        style={{
          backgroundColor: "#000000",
          borderBottomColor: "#ffffff",
          borderBottomWidth: 1,
          justifyContent: "center",
          paddingVertical:10,
          paddingHorizontal:10
        }}
  
      >
        <View>
          <Text style={{color:'#fff'}}>
            {
              item?.approverLevel ? 
            `${item?.workFlowActivityType} Level ${item?.approverLevel} by ${item?.fullName} @ ${item?.timestampOfActivity && moment(item?.timestampOfActivity).format('DD-MM-YYYY HH:mm:ss')}`
            :
            `${item?.workFlowActivityType} by ${item?.fullName} @ ${item?.timestampOfActivity && moment(item?.timestampOfActivity).format('DD-MM-YYYY HH:mm:ss')}`
            }
             <Text>{ item.reason && `  Reason ${item.reason}`}</Text>
            </Text>
        </View>
      </TouchableHighlight>
    );
  };

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
            <Pressable
              onPress={() => setToolTipStatus(!visible)}
              style={{
                position: "absolute",
                right: -5,
                top: -5,
                height: 35,
                width: 35,
                backgroundColor: "red",
                borderRadius: 35 / 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={Cross}
                style={{ height: 20, width: 20, tintColor: "#fff" }}
              />
            </Pressable>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <AppText style={Styles.locationHeader}>
                {pinnedPlanogram?.title}
              </AppText>
              {pinnedPlanogram &&
                pinnedPlanogram?.workFlowActivity &&
                pinnedPlanogram?.workFlowActivity.length > 0 && (
                  <FlatList
                    contentContainerStyle={{marginTop:20,paddingBottom:50}}
                    data={pinnedPlanogram?.workFlowActivity}
                    renderItem={renderToolTipp}
                  />
                )}
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default PlanogramToolPin;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "center",
      padding: 15,
      // backgroundColor:'#fff'
    },
    textinputContainer: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    locationContainer: {
      height: "60%",
      backgroundColor: COLORS.black,
      borderRadius: moderateScale(10),
      alignItems: "center",
      padding: moderateScale(20),
      justifyContent: "space-between",
    },
    cancelButtonContainer: {
      backgroundColor: "transparent",
      borderColor: "red",
      borderWidth: 1,
      marginRight: 12,
    },
    cancelButtonText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: "red",
    },
    locationHeader: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
      textAlign: "center",
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
      width: "100%",
      alignSelf: "center",
    },
    brandText: {
      fontSize: moderateScale(18),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(10),
    },
  });
