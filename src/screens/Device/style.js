import {StyleSheet} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: moderateScale(10),
    },
    backText: {
      fontSize: moderateScale(15),
      color: 'black',
      fontWeight: '500',
      alignSelf: 'center',
    },
    recordsText: {
      color: COLORS.textColor,
      fontSize: moderateScale(16),
    },
    bulkAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.border,
    },
    schedulerView: {
      justifyContent: 'flex-start',
    },
    addDeviceStyle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(5),
    },
    themeTextStyle: {
      fontSize: moderateScale(14),
    },
    deviceList: {
      margin: moderateScale(5),
      marginVertical: moderateScale(15),
    },
    deviceTopic: {
      padding: moderateScale(5),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerText: {
      fontSize: moderateScale(16),
      fontWeight: '500',
      color: COLORS.textColor,
      padding: moderateScale(10),
    },
    inactiveTopic: {
      padding: moderateScale(5),
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    totalRecords: {
      margin: moderateScale(10),
    },
    numberContainer: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(15),
      alignItems: 'center',
      justifyContent: 'center',
    },
    deviceLocationView: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
      padding: moderateScale(10),
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
     // advance search==
     mainContainerModal: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    headerContainerModal: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },

    tagInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
      width: "100%",
    },
    styleRatio: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    noOfregionInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingHorizontal: moderateScale(15),
      width: "58%",
    },
    resetBox: {
      borderWidth: 1,
      borderColor: COLORS.red,
      padding: 10,
      // backgroundColor: COLORS.red,
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 5,
    },
    resetText: {
      color: "#fff",
      fontSize: 18,
    },
    submitBox: {
      borderWidth: 1,
      borderColor: COLORS.themeColor,
      padding: 10,
      backgroundColor: COLORS.themeColor,
      width: 100,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 5,
    },
    ContainerDropDown: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 140,
      borderWidth: 1,
      marginRight: 12,
      borderWidth: 1,
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: "#00000026",
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(15),
    },
    regionsDorpdown: {
      position: "absolute",
      backgroundColor: "#fff",
      width: 140,
      borderWidth: 1,
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: "#00000026",
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(15),
    },
    aspectText: {
      marginVertical: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(16),
      color: COLORS.textColor,
    },
    themedText: color => ({
      backgroundColor: color,
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
    }),
    SubmitContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
    },
  });
export default Styles;
