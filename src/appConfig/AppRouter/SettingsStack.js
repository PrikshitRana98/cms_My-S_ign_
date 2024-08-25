import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {NAVIGATION_CONSTANTS} from '../../Constants/navigationConstant';

import TermCond from '../../screens/Settings/TermCond';
import Policy from '../../screens/Settings/Policy';
import ThirdParty from '../../screens/Settings/ThirdParty';
import AboutPage from '../../screens/About/AboutPage';


const SettingStack = props => {
  const initialScreen = props?.route?.params?.screen;
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={
        initialScreen ? initialScreen : NAVIGATION_CONSTANTS.SETTINGS
      }
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ABOUT_PAGE}
        component={AboutPage}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.TERMCOND}
        component={TermCond}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.POLICY}
        component={Policy}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.THIRDPARTY}
        component={ThirdParty}
      />
    </Stack.Navigator>
  );
};

export default SettingStack;
