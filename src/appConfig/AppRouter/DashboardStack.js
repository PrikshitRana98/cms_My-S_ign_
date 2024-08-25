import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import EditMediaLib from "../../screens/MediaLibrary/EditMediaLib";
import LocCampaign from "../../screens/AddCampaign/locCampaign";
import CampaignEditString from "../../screens/CampaignStringEdit/CampaignEditString";
import Device from '../../screens/Device';
import ViewMedia from "../../screens/MediaLibrary/ViewMedia";
import EditRegisterDevice from '../../screens/RegisterDevice/EditRegisterDevice';
import DeviceConsolidated from '../../screens/DeviceConsolidated';
import CampaignString from "../../screens/CampaignString";
import CampaignManagement from "../../screens/Campaign";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import DashboardIndex from "../../screens/Dashboard/index";
import AddNewResolution from "../../screens/AddResolution";
import AddMediaLibrary from "../../screens/AddMediaLibrary";
import MediaLibrary from "../../screens/MediaLibrary";
import CampaignEditSubmit from "../../screens/CampaignStringEdit/CampaignEditSubmit";
import EditCampaign from "../../screens/AddCampaign/EditCampaign";
import CreateCampaignString from "../../screens/CreateCampaignString";
import RegisterNewDevice from "../../screens/RegisterDevice";
import AddNewPlanogram from "../../screens/AddNewPlanogram";
import AddScheduler from "../../screens/AddScheduler";
import AddCampaign from "../../screens/AddCampaign";
import Scheduler from "../../screens/Scheduler";
import Planogram from "../../screens/Planogram";
import ResolutionManagement from "../../screens/ResolutionManagement";
import ReplaceDevice from "../../screens/RegisterDevice/ReplaceDevice";
import Template from "../../screens/Template";
import MediaPlayerGroup from '../../screens/MediaPlayerGroups';
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
      {/* megha */}
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.MEDIA_PLAYER_GROUPS}
        component={MediaPlayerGroup}
      />
      
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.EDIT_MEDIA_LIBRARY}
        component={EditMediaLib}
      />
        <Stack.Screen
        name={NAVIGATION_CONSTANTS.CREATE_CAMPAIGN_STRING}
        component={CreateCampaignString}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.DEVICE_CONSOLIDATE}
        component={DeviceConsolidated}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_RESOLUTION}
        component={AddNewResolution}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.RESOLUTION_MANAGEMENT}
        component={ResolutionManagement}
      />
       <Stack.Screen
          name={NAVIGATION_CONSTANTS.EDIT_REGISTER_DEVICE}
          component={EditRegisterDevice}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN_EDIT_STRING}
        component={CampaignEditString}
      /> 
        <Stack.Screen
        name={NAVIGATION_CONSTANTS.VIEW_MEDIA}
        component={ViewMedia}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN}
        component={CampaignManagement}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN_STRING}
        component={CampaignString}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.MEDIA_LIBRARY}
        component={MediaLibrary}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.SCHEDULER}
        component={Scheduler}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.VIEW_ALL_DEVICES}
        component={Device}
      />
 <Stack.Screen
        name={NAVIGATION_CONSTANTS.EDIT_CAMPAIGN}
        component={EditCampaign}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.LOC_EDITCAMPAIGN}
        component={LocCampaign}
      />

      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY}
        component={AddMediaLibrary}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.TEMPLATE}
        component={Template}
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
        name={NAVIGATION_CONSTANTS.CAMPAIGN_EDIT_SUBMIT}
        component={CampaignEditSubmit}
      />
     <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_NEW_CAMPAIGN}
        component={AddCampaign}
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
