

import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { moderateScale } from '../../Helper/scaling'
import AppText from '../../Components/Atoms/CustomText'
import { ThemeContext } from '../../appConfig/AppContext/themeContext'
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader'
import { Policyervice } from './api'
import { getStorageForKey } from '../../Services/Storage/asyncStorage'
import { Button } from 'react-native-paper'
import { NAVIGATION_CONSTANTS } from '../../Constants/navigationConstant'
import { useNavigation } from '@react-navigation/native'
import RenderHTML from 'react-native-render-html'
import CopyRightText from '../../Components/Molecules/CopyRightText'
import Loader from '../../Components/Organisms/CMS/Loader'
import ClockHeader from '../../Components/Atoms/ClockHeaders'

const PP = () => {
  const [isLoader,setIsLoader]=useState(false)
  const navigation = useNavigation();
  const themeColor = useContext(ThemeContext);
  const Styles = PolicyStyles(themeColor);
  const [title, setTitle] = useState('');
  const [info, setinfo] = useState('');

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    let slugId = await getStorageForKey('slugId');
    const params = {
      slugId: slugId,
    };
    const succussCallBack = (response) => {
      console.log('success plicy===>', JSON.stringify(response),'\n',Object.keys(response));
      
      if(response?.data){
        const data = response.data;
        setTitle(data.title);
        setinfo(response.data.copyright);
      }
      setIsLoader(false)
    };

    const failureCallBack = (error) => {
      console.log('success =error==policy pp>', JSON.stringify(error));
      setIsLoader(false)
    };
    setIsLoader(true)
    Policyervice.getPolicy(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const mixedStyle = {
    body: {
      whiteSpace: 'normal',
      color: 'black',
      margin: 0,
      padding:5,
      // justifyContent:"center",
      textAlign:"justify",
      
    },
    
    ul: { margin: 0, padding: 0,textAlign: 'justify'},
    li: {
      color: 'black',
      paddingHorizontal: 5,
    },
    p: {
      color: 'black',
      textAlign: 'space-between',
      textAlign: 'justify',
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: moderateScale(10) }}>
      <Loader visible={isLoader}/>
      <View style={{paddingBottom:10}} >
        <AppText style={{color:"black", fontWeight:600,fontSize:16}}>Privacy Policy</AppText>
      </View>
      <ScrollView contentContainerStyle={Styles.scroll}>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ justifyContent: 'space-between' }}>
            
            <RenderHTML
              contentWidth={Dimensions.get('window').width}
              // contentContainerStyle={{  backgroundColor: 'red',justifyContent:"center" }}
              source={{ html: info }}
              tagsStyles={mixedStyle}
            />
          </View>
        </View>
      </ScrollView>
      <CopyRightText
        containerStyle={{
          marginVertical: 5,
        }}
      />
    </SafeAreaView>
  );
};

export default React.memo(PP);

const PolicyStyles = (COLORS) =>
  StyleSheet.create({
    headerCont: {
      height: moderateScale(45),
      paddingHorizontal: moderateScale(8),
    },
    headerText: {
      color: 'black',
      fontSize: moderateScale(18),
    },
    scroll: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(5),
      backgroundColor: "white",
    },
  });