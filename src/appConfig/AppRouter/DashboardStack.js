import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import DashboardIndex from "../../screens/Dashboard/index";
import AddMediaLibrary from "../../screens/AddMediaLibrary";
import RegisterNewDevice from "../../screens/RegisterDevice";
import AddNewPlanogram from "../../screens/AddNewPlanogram";
import AddScheduler from "../../screens/AddScheduler";
import AddCampaign from "../../screens/AddCampaign";
import Scheduler from "../../screens/Scheduler";
import Planogram from "../../screens/Planogram";
import ReplaceDevice from "../../screens/RegisterDevice/ReplaceDevice";

const CMSStack = (props) => {
  const initialScreen = props?.route?.params?.screen;
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={
        initialScreen ? initialScreen : NAVIGATION_CONSTANTS.DASHBOARD
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.INDEX}
        component={DashboardIndex}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY}
        component={AddMediaLibrary}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE}
        component={RegisterNewDevice}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_SCHEDULER}
        component={AddScheduler}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_NEW_PLANOGRAM}
        component={AddNewPlanogram}
      />
     <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_NEW_CAMPAIGN}
        component={AddCampaign}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.SCHEDULER}
        component={Scheduler}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.PLANOGRAM}
        component={Planogram}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.REPLACE_DEVICE}
        component={ReplaceDevice}
      />
    
    </Stack.Navigator>
  );
};

export default CMSStack;
