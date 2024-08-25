import React from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "../Atoms/CustomText";
import Separator from "../Atoms/Separator";
import StartAndEndDate from "../Atoms/StartAndEndDate";
import SubHeaderText from "../Atoms/SubHeaderText";
import ThemedText from "../Atoms/ThemedText";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { useSelector } from "react-redux";

const PlanogramsList = ({ planogramApprovalFlag,containerStyle = {}, data = [],isSchedulerEnabled }) => {
  const navigation = useNavigation();
  // console.log("------data-----", data);
  const themeColor = useThemeContext();
  const userList = useSelector((state) => state.userReducer.userDetails);
  const Styles = PlanogramsStyles(themeColor);
  const onPressViewAll=()=>{
    if(isSchedulerEnabled==true){
      navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER)
    }else{
      navigation.navigate(NAVIGATION_CONSTANTS.PLANOGRAM)
    }
  }
  const returnValue=()=>{
    if(isSchedulerEnabled==true){
      return "View All Scheduler"
    }else{
      return "View All Planograms"
    }
  }
  return (
    <View style={Styles.listContainer}>
      {data.map((item, index) => {
        return (
          <View key={item.name + index}>
            <View style={[Styles.mainContainer, containerStyle]}>
              <View style={{flexDirection:'row', alignItems:'baseline',justifyContent:"space-between"}}>
              <SubHeaderText
                title={item.title}
                containerStyle={{
                  paddingBottom: moderateScale(10),
                  paddingTop: moderateScale(10),
                }}
                textStyle={{
                  fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                  fontSize: moderateScale(17),
                }}
              />
              {planogramApprovalFlag&&<ThemedText
                title={item.state}
                containerStyle={{
                  backgroundColor: themeColor.yellowBackground,
                  // marginHorizontal:35
                }}
              />}
              </View>
              <AppText style={Styles.inactiveText}>Created By : {userList?.data ? userList?.data?.customerFullName : null}</AppText>

              <StartAndEndDate
                containerStyle
                startDate={item.startDate}
                endDate={item.startDate}
              />
            </View>
            {index !== data.length - 1 && <Separator />}
          </View>
        );
      })}
      <Pressable
        onPress={() => {
          console.log('isSchedulerEnabled',isSchedulerEnabled);
          onPressViewAll()
        }}
      >
        <AppText style={Styles.themeText}>
          {
           returnValue()
          }
          </AppText>
      </Pressable>
    </View>
  );
};

export default PlanogramsList;

const PlanogramsStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      width: "100%",
      backgroundColor: COLORS.white,
      marginVertical: moderateScale(15),
      paddingHorizontal: moderateScale(10),
    },
    inactiveText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(15),
      color: COLORS.chevronInactive,
    },
    themeText: {
      fontSize: moderateScale(16),
      color: COLORS.themeColor,
      alignSelf: "center",
      textDecorationLine: "underline",
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    listContainer: {
      padding: moderateScale(10),
    },
  });
