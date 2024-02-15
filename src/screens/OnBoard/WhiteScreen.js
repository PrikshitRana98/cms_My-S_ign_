import { View, Text,StyleSheet,Image } from 'react-native'
import React from 'react'
import { ThemeContext, useThemeContext } from '../../appConfig/AppContext/themeContext'
import AppText from '../../Components/Atoms/CustomText'
import { moderateScale } from '../../Helper/scaling'
import { useNavigation, } from '@react-navigation/native'
import { CommonHeader } from '../../appConfig/AppRouter/CommonHeader'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FONT_FAMILY } from '../../Assets/Fonts/fontNames'
import { removeKeyInStorage, setStorageForKey } from '../../Services/Storage/asyncStorage'
import { ASYNC_STORAGE } from '../../Constants/asyncConstants'
import { NAVIGATION_CONSTANTS } from '../../Constants/navigationConstant'
import SignEdgeLogon from '../../Assets/Images/PNG/signedge-logo.png'
import PanasonicLogo from '../../Assets/Images/PNG/panasonic.png';


const WhiteScreen = () => {
    const navigation=useNavigation();
    const themeColor=useThemeContext();
    const Styles = ScreenStyle(themeColor);


    const backToLogin= async()=>{
        await removeKeyInStorage(ASYNC_STORAGE.USER_DETAILS);
        await removeKeyInStorage("authToken");

        await setStorageForKey(ASYNC_STORAGE.LOGGED, false);

        await removeKeyInStorage(ASYNC_STORAGE.LOGGED);
        await removeKeyInStorage('is_scheduler_enabled');
        
        navigation.reset({
        index: 0,
        routes: [{name: NAVIGATION_CONSTANTS.LOGIN}],
        });

        
    }

  return (
    <View style={{flex:1,alignItems:'center',backgroundColor:'white',overflow:'hidden'}}>
        <View style={Styles.headerView}>
        <Image source={SignEdgeLogon} style={Styles.logoView} />
        <Image source={PanasonicLogo} style={Styles.logoView} />
        </View>
        <View style={Styles.txtCont}>
            <AppText style={[Styles.text,{color:'black',fontSize:moderateScale(18)}]}>Organization settings not configured.{'\n'}Please connect your Customer Admin.</AppText>
            <TouchableOpacity
                onPress={()=>backToLogin()} 
                style={Styles.btn}>
                <AppText style={[Styles.text,{color:'white'}]}>BACK</AppText>
            </TouchableOpacity>
        </View>
    </View>
  )
}

export default WhiteScreen

const ScreenStyle = COLORS =>
  StyleSheet.create({
   btn:{
    marginVertical:20,
    backgroundColor:COLORS.themeColor,
    paddingHorizontal:moderateScale(15),
    paddingVertical:moderateScale(10),
    borderRadius:10
   },
   text:{
    fontSize:moderateScale(16),
    fontFamily:FONT_FAMILY.OPEN_SANS_SEMI_BOLD
   },
   headerView: {
    flex:0.1,
    height: moderateScale(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    width: '100%',
    paddingHorizontal: moderateScale(10),
    shadowColor: '#0000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity:  0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  txtCont:{flex:0.9,
    justifyContent:"center",
    alignItems:'center',
    backgroundColor:COLORS.white
    },
  logoView: {width: '35%', resizeMode: 'contain'},
  });