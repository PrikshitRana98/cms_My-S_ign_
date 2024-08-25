import React, {useEffect, useState} from 'react';
import {Alert, LogBox, SafeAreaView, StatusBar,PermissionsAndroid} from 'react-native';
import {Provider, useSelector} from 'react-redux';
import AppRouter from './src/appConfig/AppRouter/router';
import Store from './src/appConfig/Redux/store';
import { useDispatch } from "react-redux";
import {ThemeContext} from './src/appConfig/AppContext/themeContext';
import Color from './src/Assets/Color/Color';
import AppLoader from './src/Components/Atoms/Loader';
import {getStorageForKey} from './src/Services/Storage/asyncStorage';
import {NAVIGATION_CONSTANTS} from './src/Constants/navigationConstant';
import {PaperProvider} from 'react-native-paper';
// import 'react-native-gesture-handler ';

import {
  setUserAuthorizations,
} from "./src/appConfig/Redux/Action/userAction";
import { jwtDecode } from 'jwt-decode';
LogBox.ignoreAllLogs();

const App = () => {
  const dispatch = useDispatch();
  const {appLoader} = useSelector(state => state.CommonReducer);
  const [initialScreen, setInitialScreen] = useState();
  const [isShow, setIsShow] = useState(false);
  const handleStack = async () => {
    
    const logged = await getStorageForKey('logged');
    const checkid=await getStorageForKey("slugId");
    const authToken=await getStorageForKey('authToken');

    
    if ((logged == 'true'||logged==true)&&authToken!=null) {
      setInitialScreen(NAVIGATION_CONSTANTS.DRAWER_STACK);
      setIsShow(true);
      getvaluess();
    } else  {
      setInitialScreen(NAVIGATION_CONSTANTS.LOGIN);
      setIsShow(true);
    }
  };

  useEffect(() => {
    handleStack();
  },[1]);


  useEffect(() => {
    if(Platform.OS=="android"){
      
       requestNotifPermission()
     }
   
   }, []);
 
   const requestNotifPermission = async () => {    
     try {
         const granted = await PermissionsAndroid.request(
           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,         
         );      
       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        
       } else {
        
       }
     } catch (err) {
       console.warn(err);
     }
   };

   

  const getvaluess = async() =>
  {
    
    const logged = await getStorageForKey('authorities');
    const token=await getStorageForKey("authToken");

    const decodedHeader = jwtDecode(token);
    dispatch(setUserAuthorizations(decodedHeader?.authorities));
    
    setInitialScreen(NAVIGATION_CONSTANTS.DRAWER_STACK);
    setIsShow(true);
         
  }
  
  return (
    <ThemeContext.Provider value={Color.lightThemeColors}>
      <PaperProvider>
        {appLoader && <AppLoader />}
        {isShow ? <AppRouter initialScreen={initialScreen} /> : <AppLoader />}
      </PaperProvider>
    </ThemeContext.Provider>
  );
};

const ReduxApp = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#000"} />
      <Provider store={Store}>{<App />}</Provider>
    </SafeAreaView>
  );
};
export default ReduxApp;
