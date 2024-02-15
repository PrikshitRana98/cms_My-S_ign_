// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   ScrollView,
//   Text as AppText,
//   Dimensions,
// } from 'react-native';
// import RenderHTML from 'react-native-render-html';
// import { moderateScale } from 'react-native-size-matters';
// import { useNavigation } from '@react-navigation/native';
// import { ThemeContext } from '../context/ThemeContext';
// import AboutService from './api';
// import { getStorageForKey } from '../utils/StorageUtils';

import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { moderateScale } from '../../Helper/scaling'
import AppText from '../../Components/Atoms/CustomText'
import { ThemeContext } from '../../appConfig/AppContext/themeContext'
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader'
import { AboutService } from './api'
import { getStorageForKey } from '../../Services/Storage/asyncStorage'
import { Button } from 'react-native-paper'
import { NAVIGATION_CONSTANTS } from '../../Constants/navigationConstant'
import { useNavigation } from '@react-navigation/native'
import RenderHTML from 'react-native-render-html'

const AboutPage = () => {
  const navigation = useNavigation();
  const themeColor = useContext(ThemeContext);
  const Styles = AboutStyles(themeColor);
  const [title, setTitle] = useState('');
  const [info, setinfo] = useState('');

  useEffect(() => {
    getInfo();
  }, [1]);

  const getInfo = async () => {
    let slugId = await getStorageForKey('slugId');
    const params = {
      slugId: slugId,
    };
    const succussCallBack = (response) => {
      console.log('success ===>', JSON.stringify(response.data));
      const data = response.data;
      setTitle(data.title);
      setinfo(data.description);
    };

    const failureCallBack = (error) => {
      console.log('success ===>', JSON.stringify(error));
    };
    AboutService.getAboutData(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const mixedStyle = {
    body: {
      whiteSpace: 'normal',
      color: '#aaa',
      margin: 0,
    },
    ul: { margin: 0, padding: 0 },
    li: {
      color: 'black',
      paddingHorizontal: 5,
    },
    p: {
      color: 'black',
      textAlign: 'space-between',
    },
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: moderateScale(16) }}>
      <View style={Styles.headerCont}>
        <AppText style={Styles.headerText}>{title}</AppText>
      </View>
      <ScrollView contentContainerStyle={Styles.scroll}>
        <View style={{ paddingHorizontal: 10 }}>
          <View style={{ justifyContent: 'space-between' }}>
            
            <RenderHTML
              contentWidth={Dimensions.get('window').width}
              contentContainerStyle={{ textAlign: 'justify', backgroundColor: 'white', }}
              source={{ html: info }}
              tagsStyles={mixedStyle}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default React.memo(AboutPage);

const AboutStyles = (COLORS) =>
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
      flex: 1,
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(5),
      backgroundColor: COLORS.white,
    },
  });