import {StyleSheet} from 'react-native';
import {FONT_FAMILY} from '../../Assets/Fonts/fontNames';
import {moderateScale} from '../../Helper/scaling';
const Styles = COLORS =>
  StyleSheet.create({
    fullFlex: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    headerContainer: {
        backgroundColor: COLORS.white,
        padding: moderateScale(10),
      },
      schedulerList: {
        margin: moderateScale(5),
        marginVertical: moderateScale(15),
      },
      scheduleTopic: {
        padding: moderateScale(5),
        backgroundColor: COLORS.themeLight,
        justifyContent: 'flex-start',
        alignSelf: 'flex-start',
      },
      textcontainer:{
        width: "100%",
        backgroundColor: COLORS.white,
        borderRadius: moderateScale(5),
        borderColor: COLORS.searchBorder,
        borderWidth: moderateScale(1),
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(5)
      },
      ratioContainer:{
        marginVertical:5
      },
      scheduleText: {
        fontSize: moderateScale(16),
        fontWeight: '500',
        color: COLORS.textColor,
        padding: moderateScale(10),
      },
    bodyHeaderText: {
        fontSize: moderateScale(15),
        fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
        marginHorizontal: moderateScale(10),
        marginVertical: moderateScale(15),
        color: COLORS.textColor,
      },
    bodyContainer: {
        paddingVertical: moderateScale(10),
        backgroundColor: COLORS.white,
        marginVertical: moderateScale(10),
      },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
      padding: moderateScale(10),
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: 250,
    },
    EventTitle: {
      fontSize: moderateScale(15),
      fontWeight: "bold",
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    titleName: {
      fontSize: moderateScale(14),
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
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    headerScrollContainer: index => ({
      justifyContent: 'center',
      width: index === 0 ? '25%' : '25%',
      backgroundColor: COLORS.themeLight,
    }),
    headerScrollContainer1: index => ({
      justifyContent: 'center',
      width: index === 0 ? '16%' : '28%',
      backgroundColor: COLORS.themeLight,
    }),
    headerThemeContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
      height: moderateScale(50),
    },
    subContainer: {
      padding: moderateScale(10),
    },
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 250,
    },
    listBoldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
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
    selectedTextStyle1: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#000000",
    },

    errorText:{
      color:COLORS.activeRed
    },
    iconStyle: {
      width: moderateScale(20),
      height: moderateScale(20),
    },
    iconStyle: {
      width: moderateScale(20),
      height: moderateScale(20),
    },
    inputSearchStyle: {
      height: moderateScale(40),
      fontSize: 16,
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
    notesText: {
      fontSize: moderateScale(12),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      color: COLORS.lightBlack,
      padding: moderateScale(10),
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
    locationContainer: {
      paddingHorizontal: moderateScale(15),
    },
    locationList: {
      padding: moderateScale(10),
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
      minWidth:'46%',
      width: '47%',
      maxWidth:"47.5%",
      height: moderateScale(50),
      borderRadius: moderateScale(10),
      borderWidth:1,
      borderColor: COLORS.border ,
      paddingHorizontal:10,
      justifyContent: 'center'
    },
    campaignStrContainerActive:{
      margin: moderateScale(5),
      minWidth:'46%',
      width: '47%',
      maxWidth:"47.5%",
      height: moderateScale(50),
      borderRadius: moderateScale(10),
      borderWidth:1,
      borderColor: COLORS.themeColor ,
      paddingHorizontal:10,
      justifyContent: 'center'
    },

    campaignContainer:status=>({
      margin: moderateScale(5),
      width: '48%',
      height: moderateScale(110),
      borderRadius: moderateScale(10),
      borderWidth:1,
      borderColor: !status ? COLORS.border : COLORS.barGreen,
      paddingHorizontal:10,
      justifyContent: 'center'
    }),
    videoName: {
      fontSize: moderateScale(12),
      marginVertical: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(12),
      color: COLORS.unselectedText,
      marginVertical: moderateScale(2),
      textAlign:'center',
    },
    campaignHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    renderContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      width: '100%',
      margin: moderateScale(0.5),
      backgroundColor: COLORS.shadow,
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
    actionView: {
      backgroundColor: 'white',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    iconBackView: {
      height: moderateScale(30),
      width: moderateScale(30),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.themeLight,
      justifyContent: 'center',
      alignItems: 'center',
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: 'contain',
    },
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
    },
    searchCategoryStyle: {
      marginVertical: moderateScale(2),
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(0),
      borderRadius: moderateScale(10),
      marginHorizontal: moderateScale(4)
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
      backgroundColor: COLORS.white,
      width: 80,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-end",
      margin: moderateScale(10),
      borderRadius: 5,
    },
    resetText: {
      color: COLORS.red,
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
