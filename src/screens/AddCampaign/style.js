import { StyleSheet } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { moderateScale } from "../../Helper/scaling";
const Styles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.appBackground,
    },
    headerScrollContainer: (index) => ({
      justifyContent: "center",
      width: index === 0 ? "40%" : "20%",
      backgroundColor: COLORS.themeLight,
    }),
    headerThemeContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      justifyContent: "space-between",
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemContainer: {
      flexDirection: "row",
      alignItems: "center",
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
    bodyHeaderText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    bodyRowsContainer: {
      padding: moderateScale(10),
    },
    durartionContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    durationTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      width: "30%",
      paddingVertical: moderateScale(4),
      // paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(2),
      justifyContent: "center",
      alignItems: "center",
    },
    colorPickerBox:{
      backgroundColor: "#ffffff",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: '#00000026',
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
    },
    colorPickerSeleBox:{
     paddingVertical:6,width:'30%',border:'#000',marginTop:5,borderWidth:1
    },
    notesText: {
      fontSize: moderateScale(12),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      color: COLORS.lightBlack,
      padding: moderateScale(10),
    },
    scrollView: {
      backgroundColor: "white",
      padding: moderateScale(10),
    },
    subHeaderText: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: moderateScale(15),
      paddingHorizontal: moderateScale(20),
      justifyContent: "space-between",
    },
    searchHeaderView: (active) => ({
      borderBottomWidth: active ? moderateScale(2) : undefined,
      borderBottomColor: active ? COLORS.themeColor : undefined,
      paddingBottom: moderateScale(12),
    }),
    searchHeaderText: (active) => ({
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    deviceBodyContainer: {},
    imageStyle: {
      height: moderateScale(100),
      width: moderateScale(150),
      borderRadius: moderateScale(10),
    },
    campaignContainer: {
      margin: moderateScale(5),
      width: "48%",
    },
    videoName: {
      fontSize: moderateScale(12),
      marginVertical: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(10),
      color: COLORS.unselectedText,
      marginVertical: moderateScale(5),
    },
    campaignHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    renderContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      margin: moderateScale(0.5),
      backgroundColor: COLORS.shadow,
    },
    nameView: {
      width: "40%",
      backgroundColor: COLORS.white,
      justifyContent: "center",
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
      backgroundColor: "white",
      width: "20%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    iconBackView: {
      height: moderateScale(30),
      width: moderateScale(30),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: "contain",
    },
    eventTitleInput: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(4),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
    },
    searchCategoryStyle: {
      marginVertical: moderateScale(2),
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(0),
      borderRadius: moderateScale(10),
    },
    dropdown: {
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
    },
    icon: {
      marginRight: 5,
    },
    label: {
      paddingHorizontal: 8,
      fontSize: 14,
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
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    mainSelectImageContainer: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      height: moderateScale(140),
      borderColor: COLORS.dashedBorder,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      borderStyle: "dashed",
      alignItems: "center",
      justifyContent: "center",
    },
    titleStyle: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.placeHolder,
    },
    regionSubTitleStyle: {
      fontSize: moderateScale(16),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: "#000000",
      textDecorationLine: "underline",
    },
    campaignTagStyleContainer: {
      flexWrap: "wrap",
      flexDirection: "row",
      alignItems: "center",
    },
    campaignTagStyle: {
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 7,
      backgroundColor: COLORS.appBackground,
      marginLeft: 6,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    campaignTagCrosImg: {
      height: 10,
      width: 10,
      marginLeft: 7,
    },
    campaignTagText: {
      color: "#ADB2C3",
    },
    audioBox:{
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    textcontainer: (type) => ({
      // width: "80%",
      color:"black",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
    labeltext: { color: '#ADB2C3',fontSize: moderateScale(14),marginTop:10,marginLeft:1}

  });

export default Styles;
