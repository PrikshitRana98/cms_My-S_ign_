
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
          name={NAVIGATION_CONSTANTS.ABOUT_PAGE}
          component={AboutPage}
        />
      </Drawer.Navigator>
    </>
  );
};
export default DrawerStack;

