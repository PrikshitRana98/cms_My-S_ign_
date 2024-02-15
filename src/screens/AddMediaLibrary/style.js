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
    bodyContainer: {
      paddingVertical: moderateScale(10),
      backgroundColor: COLORS.white,
      margin: moderateScale(10),
    },
    bodyHeaderText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(15),
      color: COLORS.textColor,
    },
    bodySubHeaderText: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      margin: moderateScale(10),
      color: COLORS.textColor,
    },
    itemContainer: active => ({
      justifyContent: 'center',
      width: '30%',
      padding: moderateScale(15),
      alignItems: 'center',
      borderRadius: moderateScale(10),
      borderWidth: moderateScale(1),
      borderColor: COLORS.searchBorder,
      margin: moderateScale(5),
      backgroundColor: active ? COLORS.themeColor : undefined,
    }),
    iconImageStyle: active => ({
      height: moderateScale(25),
      width: moderateScale(30),
      resizeMode: 'contain',
      backgroundColor: active ? COLORS.themeColor : undefined,
      tintColor: active ? COLORS.white : undefined,
    }),
    filetype: active => ({
      color: active ? COLORS.white : 'black',
      margin: moderateScale(5),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    }),
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
    uploadMultpleFileCont:{
      padding: moderateScale(5),
      borderRadius: moderateScale(10),
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: moderateScale(10),
    },
    dropText: {
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    disclaimerView: {
      margin: moderateScale(15),
    },
    disclaimerHeading: {
      fontSize: moderateScale(11),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    disclaimerText: {
      fontSize: moderateScale(13),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      color: COLORS.lightBlack,
    },
    uploadedView: {
      margin: moderateScale(15),
    },
    uploadedText: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    fileNameText: {
      fontSize: moderateScale(12),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    uploadedContainer: {
      marginVertical: moderateScale(10),
    },
    tickIcon: {
      position: 'absolute',
      top: -5,
      right: -5,
      height: moderateScale(24),
      width: moderateScale(24),
      borderRadius: moderateScale(12),
      backgroundColor: 'white',
      borderWidth: moderateScale(1),
      borderColor: COLORS.themeColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tickImage: {
      tintColor: COLORS.themeColor,
      height: moderateScale(12),
      width: moderateScale(20),
      resizeMode: 'contain',
    },
    uploadVideoStyle: {
      backgroundColor: 'white',
      borderRadius: moderateScale(5),
      borderColor: COLORS.unselectedText,
      borderWidth: moderateScale(1),
      margin: moderateScale(10),
    },
    button:{
      marginVertical:moderateScale(10),
      borderRadius:10,
      height:moderateScale(45),
      backgroundColor:COLORS.themeColor,
      justifyContent:"center",
      alignItems:'center',
    },
    removeBtn:{
      backgroundColor:'white',
      borderColor:"red",
      borderWidth:1,
      marginVertical:moderateScale(10),
      borderRadius:10,
      height:moderateScale(45),
      justifyContent:"center",
      alignItems:'center',
    }
  });
export default Styles;
