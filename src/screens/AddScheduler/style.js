import {StyleSheet} from 'react-native';
import {moderateScale} from '../../Helper/scaling';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    subContainer: {
      padding: moderateScale(10),
    },
    dropdown: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
    },
    placeholderStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#ADB2C3",
    },
    selectedTextStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#ADB2C3",
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },
    createNewStyles: {
      flexDirection: 'row',
    },
    errorText:{
      color:COLORS.activeRed
    },
    backIcon: {
      height: moderateScale(12),
      width: moderateScale(7),
    },
    headerText: {
      fontSize: moderateScale(17),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      color: COLORS.textColor,
    },
    iconView: {
      height: moderateScale(23),
      width: moderateScale(23),
      borderRadius: moderateScale(12),
      backgroundColor: COLORS.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: moderateScale(15),
    },
    optionText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(15),
      marginHorizontal: moderateScale(5),
      color: COLORS.textColor,
    },
    bodyContainer: {
      paddingVertical: moderateScale(10),
      backgroundColor: COLORS.white,
      marginVertical: moderateScale(10),
    },
    bodyHeaderText: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(15),
      color: COLORS.textColor,
    },
    bodyRowsContainer: {
      padding: moderateScale(10),
    },
    notesText: {
      fontSize: moderateScale(12),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      color: COLORS.lightBlack,
    },
    scrollView: {
      backgroundColor: 'white',
      padding: moderateScale(10),
    },
    subHeaderText: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(20),
      justifyContent: 'space-between',
    },
    locationContainer: {
      paddingHorizontal: moderateScale(15),
    },
    deviceContainer: {
      paddingVertical: moderateScale(10),
      // paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
    },
    deviceHeaderPart: {
      paddingHorizontal: moderateScale(15),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    deviceSelectedTop: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    boldText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deviceBodyContainer: {},
    searchHeaderView: active => ({
      borderBottomWidth: active ? moderateScale(2) : undefined,
      borderBottomColor: active ? COLORS.themeColor : undefined,
      paddingBottom: moderateScale(12),
    }),
    searchHeaderText: active => ({
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: active ? COLORS.textColor : COLORS.unselectedText,
    }),
    slotsText: {
      fontSize: moderateScale(12),
      color: COLORS.textColor,
    },
    campaignHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingEnd: moderateScale(10),
    },
    uploadFileHere: {
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      justifyContent: 'center',
      alignItems: 'center',
      margin: moderateScale(10),
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: COLORS.dashedBorder,
    },
    dropText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    themeText: {
      fontSize: moderateScale(12),
      color: COLORS.themeColor,
      textDecorationLine: 'underline',
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    fileName: {
      fontSize: moderateScale(16),
      color:COLORS.textColor,
    },
    createBy: {
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
      marginVertical: moderateScale(3),
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    imageCampaignView: {
      padding: 10,width:'30%',
      marginHorizontal: moderateScale(10),
    },
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
    },
    closeStyle: {
      position: 'absolute',
      top: moderateScale(0),
      right: moderateScale(0),
      backgroundColor: 'white',
      borderRadius: moderateScale(15),
      borderWidth: moderateScale(2),
      borderColor: COLORS.unselectedText,
    },
    eventTitleStyle: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(2),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
    },
  });

export default Styles;
