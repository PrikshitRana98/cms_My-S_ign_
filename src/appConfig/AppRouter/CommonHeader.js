import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity, View,StatusBar} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PanasonicLogo from '../../Assets/Images/PNG/panasonic.png';
import SignEdgeLogon from '../../Assets/Images/PNG/signedge-logo.png';
import {moderateScale, scale} from '../../Helper/scaling';
import {ThemeContext} from '../AppContext/themeContext';
import {DrawerActions} from '@react-navigation/native';

export const CommonHeader = ({navigation}) => {
  const themeColor = useContext(ThemeContext);
  const Styles = CommonHeaderStyles(themeColor);
  return (<>
    {/* <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = {themeColor.white} translucent = {true}/> */}
    <View style={Styles.headerView}>
      <TouchableOpacity
        onPress={() => {
          console.log("drawer toggled")
          navigation.dispatch(DrawerActions.toggleDrawer())
        }}>
        <FontAwesome name={'navicon'} size={30} color={themeColor.themeColor} />
      </TouchableOpacity>
      <Image source={SignEdgeLogon} style={Styles.logoView} />
      <Image source={PanasonicLogo} style={Styles.logoView} />
    </View>
    </>
  );
};

const CommonHeaderStyles = COLORS =>
  StyleSheet.create({
    headerView: {
      height: moderateScale(60),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: COLORS.white,
      // marginTop:10,
      width: '100%',
      paddingHorizontal: moderateScale(10),
      
    },
    headerText: {
      fontSize: moderateScale(30),
      color: COLORS.themeColor,
      fontWeight: '700',
      alignSelf: 'center',
      marginHorizontal: scale(15),
    },
    logoView: {width: '35%', resizeMode: 'contain'},
  });
