import {StyleSheet} from 'react-native';
import {moderateScale, verticalScale} from '../../Helper/scaling';

const Styles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: 'grey',
      width: '100%',
      
    },
    backgroundImage: {
      flex: 1,
    },
    emailAndPwd: {
      backgroundColor: COLORS.white,
      // paddingHorizontal: moderateScale(10),
      paddingVertical:moderateScale(15),
      // width: '98%',
      justifyContent: "center",
      alignSelf: 'center',
      // marginVertical: verticalScale(15),
      borderRadius: moderateScale(10),
    },
    emailContainer: {
      padding: 0,
    },
    emailInput: {
      fontSize: moderateScale(18),
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(2),
      borderColor: '#5cb85c',
      marginBottom: verticalScale(20),
    },
    passwordInput: {
      // padding: moderateScale(10),
      fontSize: moderateScale(18),
      paddingHorizontal:moderateScale(5),
      backgroundColor: 'white',
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(2),
      borderColor: '#5cb85c',
      width:"100%",
      height:49
    },
    passwordInput2: {
      // paddingHorizontal: moderateScale(5),
      fontSize: moderateScale(18),
      backgroundColor: 'white',
      // borderRadius: moderateScale(5),
      // borderWidth: moderateScale(2),
      // borderColor: '#5cb85c',
      
    },
    txt:{
      fontSize:15,
      color:COLORS.textColor,
    },
    warningTxt:{
      fontSize:14,
      color:'red',
      marginHorizontal:15
    },
    forgotTxt:{
      color:COLORS.themeColor,
      marginHorizontal:10,
      fontSize:16,
    },
    passCont:{maxWidth:'98%',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    height:48,
    marginVertical:5,
    marginHorizontal:3,
    paddingVerticle:2,
    paddingHorizontal:0
  },
  themeButton: {
    // width:'96%', 
    minWidth:"90%",
    marginHorizontal:5,
    backgroundColor: COLORS.themeColor,
  },
  });
export default Styles;
