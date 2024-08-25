
import React from 'react';
import {NAVIGATION_CONSTANTS} from '../../Constants/navigationConstant';
import {width} from '../../Helper/scaling';
import Dashboard from "../../appConfig/AppRouter/DashboardStack";
import CMSStack from './CMSStacks';
import {CommonHeader} from './CommonHeader';
import {Content} from './Contents';
import DeviceStack from './DeviceStack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutPage from '../../screens/About/AboutPage';
import SettingStack from './SettingsStack';
import TermCond from '../../screens/Settings/TermCond';
import Policy from '../../screens/Settings/Policy';
import ThirdParty from '../../screens/Settings/ThirdParty';

const DrawerStack = ({navigation}) => {
  const Drawer = createDrawerNavigator();

  return (
    <>
      <CommonHeader navigation={navigation} />
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          header: CommonHeader,
          drawerType: 'front',
          drawerStyle: {
            width: width * 0.75,
          },
        }}
        drawerContent={Content}>
        <Drawer.Screen
          name={NAVIGATION_CONSTANTS.DASHBOARD}
          component={Dashboard}
        />
        <Drawer.Screen name={NAVIGATION_CONSTANTS.CMS} component={CMSStack} />

        <Drawer.Screen
          name={NAVIGATION_CONSTANTS.DEVICE}
          component={DeviceStack}
        />
         <Drawer.Screen
          name={NAVIGATION_CONSTANTS.SETTINGS}
          component={SettingStack}
        />
        {/* <Drawer.Screen
          name={NAVIGATION_CONSTANTS.ABOUT_PAGE}
          component={AboutPage}
        />
       <Drawer.Screen
          name={NAVIGATION_CONSTANTS.TERMCOND}
          component={TermCond}
        />
        <Drawer.Screen
          name={NAVIGATION_CONSTANTS.POLICY}
          component={Policy}
        />
        <Drawer.Screen
          name={NAVIGATION_CONSTANTS.THIRDPARTY}
          component={ThirdParty}
        /> */}
      </Drawer.Navigator>
    </>
  );
};
export default DrawerStack;

