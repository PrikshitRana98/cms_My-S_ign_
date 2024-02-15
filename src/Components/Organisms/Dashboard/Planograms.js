import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import DownArr from "../../../Assets/Images/PNG/down_arr.png";
import { moderateScale } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import AppText from "../../Atoms/CustomText";
import Separator from "../../Atoms/Separator";
import SubHeaderText from "../../Atoms/SubHeaderText";
import PlanogramsList from "../../Molecules/PlanogramList";

const Planograms = ({
  planogramRunning,
  planogramLive,
  isSchedulerEnabled,
}) => {
  const themeColor = useThemeContext();
  const Styles = PlanogramsStyles(themeColor);
  
  const [planogramApprovalFlag, setplanogramApprovalFlag] = useState(true);

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.headerView}>
        <SubHeaderText
          title={isSchedulerEnabled == true ? "Schedulers" : "Planograms"}
          textStyle={Styles.headerTextStyle}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 20,
          paddingHorizontal: 10,
        }}
      >
        <Pressable
          onPress={() => {
            setplanogramApprovalFlag(true);
          }}
          style={{
            borderBottomColor: "black",
            borderBottomWidth: planogramApprovalFlag ? 1 : 0,
          }}
        >
          <AppText style={{ fontSize: 12, color: "#000" }}>
            {isSchedulerEnabled == true
              ? "Running Schedulers"
              : "Running Planogram"}
          </AppText>
        </Pressable>
        <Pressable
          onPress={() => {
            setplanogramApprovalFlag(false);
          }}
          style={{
            borderBottomColor: "black",
            borderBottomWidth: !planogramApprovalFlag ? 1 : 0,
          }}
        >
          <AppText style={{ fontSize: 12, color: "#000" }}>
            {isSchedulerEnabled == true
              ? "Ready to go live schedulers"
              : "Ready to go live planograms"}
          </AppText>
        </Pressable>
      </View>
    
      <Separator />
      <PlanogramsList
        isSchedulerEnabled={isSchedulerEnabled}
        planogramApprovalFlag={planogramApprovalFlag}
        data={planogramApprovalFlag ? planogramRunning : planogramLive}
      />
    </View>
  );
};

export default Planograms;

const PlanogramsStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.border,
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      paddingVertical: moderateScale(15),
    },
    dropdownOptions: {
      right: 0,
      left: 0,
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "gray",
      width: 250,
      alignSelf: "flex-end",
      marginRight: moderateScale(15),
    },
    option: {
      padding: moderateScale(10),
      borderBottomWidth: 1,
      borderBottomColor: "gray",
    },
    optionText: {
      fontSize: moderateScale(16),
    },
    headerView: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: moderateScale(15),
    },
    textAndIcon: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
      borderBottomColor: COLORS.themeColor,
      borderBottomWidth: moderateScale(3),
      paddingBottom: moderateScale(10),
    },
    themeText: {
      fontSize: moderateScale(14),
      color: COLORS.themeColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
    },

    headerTextStyle: {
      paddingBottom: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(17),
    },
    downArr: {
      tintColor: COLORS.chevronInactive,
      width: moderateScale(13),
      height: moderateScale(8),
    },
  });
