import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import AddNewButton from "../Atoms/AddNewButton";
import SubHeaderText from "../Atoms/SubHeaderText";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import AppText from "../Atoms/CustomText";
import { useSelector } from "react-redux";
import { PREVILAGES } from "../../Constants/privilages";
const QuickLinks = ({isSchedulerEnabled}) => {
  const themeColor = useThemeContext();
  const Styles = QuickStyle(themeColor);
  const navigation = useNavigation();
  const { authorization } = useSelector((state) => state.userReducer);

  return (
    <View style={Styles.mainContainer}>
      {authorization.includes(PREVILAGES.MEDIA.ADD_MEDIA)&&<SubHeaderText
        title="Quick Links"
        containerStyle={Styles.headerStyle}
        textStyle={Styles.headerTextStyle}
      />}
      <View style={Styles.buttonContainer}>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        {authorization.includes(PREVILAGES.MEDIA.ADD_MEDIA) && <Pressable
          onPress={() => {
            navigation.navigate(NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY)
          }}
          style={[Styles.mainContainer1, Styles.headerStyle]}
        >
          <View style={[Styles.IconView]}>
            <AppText style={[Styles.textStyle, Styles.addStyle]}>
              +
            </AppText>
          </View>
          <AppText style={[Styles.textStyle]}>
            Add New Media
          </AppText>
        </Pressable>}
        {authorization.includes(PREVILAGES.DEVICE_ONBOARD.ADD_DEVICE_ONBOARD) && <Pressable
          onPress={() => {
            navigation.navigate(NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE)
          }}
          style={[Styles.mainContainer1, Styles.headerStyle]}
        >
          <View style={[Styles.IconView]}>
            <AppText style={[Styles.textStyle, Styles.addStyle]}>
              +
            </AppText>
          </View>
          <AppText style={[Styles.textStyle]}>
            Add New Device
          </AppText>
        </Pressable>}
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
        
        {(authorization.includes(PREVILAGES.PLANOGRAM.ADD_PLANOGRAM) || authorization.includes(PREVILAGES.SCHEDULER.ADD_SCHEDULER)) &&<Pressable
          onPress={() => {
            (isSchedulerEnabled==true) ?
            navigation.navigate(NAVIGATION_CONSTANTS.ADD_SCHEDULER)
            :
            navigation.navigate(NAVIGATION_CONSTANTS.ADD_NEW_PLANOGRAM)
          }}
          style={[Styles.mainContainer1, Styles.headerStyle]}
        >
          <View style={[Styles.IconView]}>
            <AppText style={[Styles.textStyle, Styles.addStyle]}>
              +
            </AppText>
          </View>
          <AppText style={[Styles.textStyle]}>
            {
              (isSchedulerEnabled==true) ?
              "Add New Scheduler"
              :
              "Add New Planogram"
            }
          </AppText>
        </Pressable>}
       {authorization.includes(PREVILAGES.CAMPAIGN.ADD_CAMPAIGN) && <Pressable
          onPress={() => {
            navigation.navigate(NAVIGATION_CONSTANTS.ADD_NEW_CAMPAIGN)
          }}
          style={[Styles.mainContainer1, Styles.headerStyle]}
        >
          <View style={[Styles.IconView]}>
            <AppText style={[Styles.textStyle, Styles.addStyle]}>
              +
            </AppText>
          </View>
          <AppText style={[Styles.textStyle]}>
            Add New Campaign
          </AppText>
        </Pressable>}
        </View>
      </View>
    </View>
  );
};

export default QuickLinks;
const QuickStyle = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.cardBorder,
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
    },
    headerStyle: {
      borderBottomColor: COLORS.border,
      borderBottomWidth: moderateScale(1),
      paddingHorizontal: moderateScale(7),
      marginVertical: moderateScale(10),

    },
    headerTextStyle: {
      paddingBottom: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(17),
    },
    buttonContainer: {
      paddingHorizontal: moderateScale(8),
    },
    mainContainer1: {
      paddingVertical: 5,
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(25),
      borderColor: COLORS.unselectedText,
      borderWidth: moderateScale(1),
      flexDirection: 'row',
      alignItems: 'center',
      width:'48%'
    },
    IconView: {
      width: moderateScale(30),
      height: moderateScale(30),
      borderRadius: moderateScale(25),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textStyle: {
      color: COLORS.themeColor,
      fontSize: moderateScale(10),
      marginHorizontal: moderateScale(5),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    addStyle: {
      fontSize: moderateScale(18),
    },
  });
