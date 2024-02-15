import { Platform, StyleSheet } from 'react-native';
import { moderateScale } from '../../Helper/scaling';
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
      //   padding: 10,
    },
    bodyContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
      padding: 10,
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      padding: moderateScale(10),
    },
    schedulerView: {
      justifyContent: 'flex-start',
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(19),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
    },
    recordsText: {
      color: COLORS.lightBlack,
      fontSize: moderateScale(13),
    },
    ratioContainer: {
      paddingVertical: moderateScale(5),
    },
    SubmitContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
    },

    bulkAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
    },
    innerText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
    downStyles: {
      height: moderateScale(5),
      width: moderateScale(8),
    },
    addSchedulerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: moderateScale(5),
    },
    themeContainer: {
      width: '95%',
      alignSelf: 'center',
      marginVertical: moderateScale(10),
    },
    headerContainer: index => ({
      flexDirection: 'row',
      padding: moderateScale(10),
      backgroundColor: index === 0 ? COLORS.themeLight : 'transparant',
      alignItems: 'center',
    }),
    campaignActiveHeaderContainer: status => ({
      flexDirection: 'row',
      padding: moderateScale(10),
      backgroundColor:status ? COLORS.themeLight : '#ffffff',
      alignItems: 'center',
    }),
    campaignBody: {
      marginVertical: moderateScale(10),
    },
    headerItemContainer: {
      marginHorizontal: moderateScale(10),
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
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
      borderColor: COLORS.activeRed,
      padding: 10,
      backgroundColor: COLORS.white,
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 5,
    },
    resetText: {
      color: COLORS.activeRed,
      fontSize: 18,
    },
    submitText: {
      color: '#fff',
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
  });

export default Styles;
