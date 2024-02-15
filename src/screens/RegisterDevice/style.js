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
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
    },
    createNewStyles: {
      flexDirection: 'row',
      paddingVertical: moderateScale(10),
    },
    iconView: {
      height: moderateScale(23),
      width: moderateScale(23),
      borderRadius: moderateScale(12),
      backgroundColor: COLORS.iconBackground,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      height: moderateScale(12),
      width: moderateScale(7),
    },
    headerText: {
      fontSize: moderateScale(17),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: moderateScale(170),
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
      marginHorizontal: moderateScale(20),
      marginVertical: moderateScale(15),
      color: COLORS.textColor,
    },
    numLicenseText: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(15),
      color: COLORS.textColor,
    },
    bodyRowsContainer: {
      padding: moderateScale(10),
    },
    playerIdentifier: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      marginVertical: moderateScale(5),
    },
    playerIdentifierDis: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      backgroundColor:'#D9DAE5',
      borderColor: COLORS.border,
      paddingVertical: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      marginVertical: moderateScale(5),
    },
    dropDownDis:{ 
      borderColor: "#00000026",
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      marginTop:3,
      backgroundColor:"#D9DAE5"
    },
    playerIdentifierHalfWidth: {
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      paddingVertical: moderateScale(3),
      paddingHorizontal: moderateScale(15),
      marginVertical: moderateScale(5),
      width: '48%'
    },
    actionStyle: {
      width: '49%',
    },
    centeredView: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
    },
    errorText:{
      color:COLORS.activeRed,
      marginLeft:moderateScale(2)
    },
    themeContainer: {
      width: '95%',
      alignSelf: 'center',
      marginVertical: moderateScale(10),
    },
    themeContainer1: {
      width: '48%',
      alignSelf: 'center',
      marginVertical: moderateScale(10),
    },
    btnContainer:{
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(20),
      // backgroundColor: COLORS.themeColor,
      borderColor:"#6666",
      borderRadius: moderateScale(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    subContainer321: {
      borderWidth: moderateScale(1),
      borderColor: COLORS.border,
      padding: moderateScale(10),
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
export default Styles;
