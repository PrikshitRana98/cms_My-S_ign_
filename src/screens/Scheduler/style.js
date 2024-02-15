import {StyleSheet} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';

const Styles = COLORS =>
  StyleSheet.create({
    fullFlex: {
      flex: 1,
    },
    ratioContainer: {
      paddingVertical: moderateScale(5),
    },
    nameView: {
      width: '40%',
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    listBoldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    renderContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: 700,
      margin: moderateScale(0.5),
      backgroundColor: COLORS.shadow,
    },
    headerThemeContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
      height: moderateScale(50),
    },
    headerScrollContainer: index => ({
      justifyContent: 'center',
      width: index === 0 ? '40%' : '20%',
      backgroundColor: COLORS.themeLight,
    }),
    eventTitleStyle: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(2),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    themeText: {
      fontSize: moderateScale(12),
      color: COLORS.themeColor,
      textDecorationLine: 'underline',
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    dropText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
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
    imageCampaignView: {
      padding: 10,width:'30%',
      marginHorizontal: moderateScale(10),
    },
    subHeaderText: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(20),
      justifyContent: 'space-between',
    },
    searchHeaderView: active => ({
      borderBottomWidth: active ? moderateScale(2) : undefined,
      borderBottomColor: active ? COLORS.themeColor : undefined,
      paddingBottom: moderateScale(12),
    }),
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
    },
    searchHeaderText: active => ({
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: active ? COLORS.textColor : COLORS.unselectedText,
    }),
    EventTitle: {
      fontSize: moderateScale(15),
      fontWeight: "bold",
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
  
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
    bodyContainer: {
      paddingVertical: moderateScale(10),
      backgroundColor: COLORS.white,
      marginVertical: moderateScale(10),
    },
    deviceContainer: {
      paddingVertical: moderateScale(10),
      // paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      marginVertical: moderateScale(10),
      borderColor: COLORS.border,
    },
    deviceSelectedTop: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    boldText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    deviceHeaderPart: {
      paddingHorizontal: moderateScale(15),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: "100%",
      color:COLORS.textColor,
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deviceBodyContainer: {},
    imageStyle: {
      height: moderateScale(100),
      width: moderateScale(150),
      borderRadius: moderateScale(10),
    },
    campaignStrContainer:{
      margin: moderateScale(5),
      width: '48%',
      height: moderateScale(110),
      width: moderateScale(150),
      borderRadius: moderateScale(10),
      borderWidth:1,
      borderColor: COLORS.border ,
      paddingHorizontal:10,
      justifyContent: 'center'
    },
    campaignStrContainerActive:{
      margin: moderateScale(5),
      width: '48%',
      height: moderateScale(110),
      width: moderateScale(150),
      borderRadius: moderateScale(10),
      borderWidth:1,
      borderColor: COLORS.themeColor ,
      paddingHorizontal:10,
      justifyContent: 'center'
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },
    subContainer: {
      padding: moderateScale(10),
    },
    campaignContainer:status=>({
      margin: moderateScale(5),
      width: '48%',
      height: moderateScale(110),
      width: moderateScale(150),
      borderRadius: moderateScale(10),
      borderWidth:1,
      borderColor: !status ? COLORS.border : COLORS.barGreen,
      paddingHorizontal:10,
      justifyContent: 'center'
    }),
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
    },
    bodyHeaderText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(15),
      color: COLORS.textColor,
    },
    bodyRowsContainer: {
      padding: moderateScale(10),
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
    errorText:{
      color:COLORS.activeRed
    },
    dropdown: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 250,
    },
    optionText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(15),
      marginHorizontal: moderateScale(5),
      color: COLORS.textColor,
    },
    titleView: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      marginTop: 3,
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
    recordsText: {
      color: COLORS.textColor,
      fontSize: moderateScale(16),
    },
    titleStyle: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(19),
      color: COLORS.textColor,
      marginVertical: moderateScale(5),
    },
    innerText: {
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
    },
    bulkAction: {
      flexDirection: 'row',
      alignItems: 'baseline',
      padding: moderateScale(10),
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(2),
      borderColor: COLORS.searchBorder,
    },
    downStyles: {
      height: moderateScale(5),
      width: moderateScale(8),
    },
    addSchedulerView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: moderateScale(5),
    },
    schedulerList: {
      margin: moderateScale(5),
      marginVertical: moderateScale(15),
    },
    scheduleTopic: {
      padding: moderateScale(5),
      flexDirection:'row',
      backgroundColor: COLORS.themeLight,
     // justifyContent: 'flex-start',
      //alignSelf: 'flex-start',
    },
    scheduleText: {
      fontSize: moderateScale(16),
      fontWeight: '500',
      color: COLORS.textColor,
      padding: moderateScale(10),
    },
    schedulerBody: {},
    totalRecords: {
      margin: moderateScale(10),
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
      borderColor: 'red',
      padding: 10,
      backgroundColor: 'white',
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 10,
    },
    resetText: {
      color: "red",
      fontSize: 18,
    },
    sumitText:{ 
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
      borderRadius: 10,
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
    titleName:{
      fontSize: moderateScale(15),
      color:COLORS.textColor
    },
    fileName: {
      fontSize: moderateScale(16),
      color:COLORS.textColor,
    }
  });
export default Styles;
