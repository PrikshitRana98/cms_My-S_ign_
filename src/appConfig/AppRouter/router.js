import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View } from "react-native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import Login from "../../screens/Login";
import DrawerStack from "./drawer";
import { CommonHeader } from "./CommonHeader";
import RegisterDevice from "../../screens/RegisterDevice";
import CalenderView from "../../screens/Device/CalenderView";
import EditUnRegisterDevice from "../../screens/RegisterDevice/EditUnRegisterDevice";
import ReplaceDevice from "../../screens/RegisterDevice/ReplaceDevice";
import ReplaceUnregDeviceForm from "../../screens/RegisterDevice/ReplaceUnregDeviceForm";
import ReplaceDeviceForm from "../../screens/RegisterDevice/ReplaceDeviceForm";
import ChangePassword from "../../Components/Organisms/Dashboard/ChangePassword";
import CampainDtringDetails from "../../screens/CampaignString/CampainDtringDetails";
import WhiteScreen from "../../screens/OnBoard/WhiteScreen";
import CampaignPreviwPage from "../../screens/Campaign/CampaignPreviwPage";
import CmpDetailMediaApproval from "../../screens/Campaign/CmpDetailMediaApproval";
import CampStrApproval from "../../screens/CampaignString/CampStrApproval";
import PlanogramApproveView from "../../screens/Planogram/PlanogramApproveView";
import AddMediaLibrary from "../../screens/AddMediaLibrary";
import AddNewPlanogram from "../../screens/AddNewPlanogram";
import AddCampaign from "../../screens/AddCampaign";
import AddScheduler from "../../screens/AddScheduler";
import Scheduler from "../../screens/Scheduler";
import Planogram from "../../screens/Planogram";
import { headers } from "../../screens/MediaLibrary/constants";
import SchedulerIndexView1 from "../../screens/Scheduler/SchedulerIndexView1";
import SchedulerEdit from "../../screens/Scheduler/SchedulerEdit";
import PlanogramEdit from "../../screens/Planogram/PlanogramEdit";
import SchedulerIndexView from "../../screens/Scheduler/SchedulerIndexView";
import PlanogramIndexView from "../../screens/Planogram/PlanogramIndexView";
import CampaignStringDetails from "../../screens/CampaignString/CampaignStringDetails";
import CmpPreviwe from "../../screens/Campaign/cmpPreview2";

const AppRouter = ({ initialScreen }) => {
  const Stack = createStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
        initialRouteName={initialScreen}
      >
        <Stack.Screen name={NAVIGATION_CONSTANTS.LOGIN} component={Login} />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.DRAWER_STACK}
          component={DrawerStack}
          options={{ title: 'Welcome', headerStyle: {
            backgroundColor: '#e7305b'
         } }}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.WHITE_SCREEN}
          component={WhiteScreen}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.CHANGE_PASSWORD}
          component={ChangePassword}
        />
        <Stack.Screen
          name={"CmpDetailApproval"}
          component={CmpDetailMediaApproval}
        />
        <Stack.Screen
          name={"CampaignStringDetails"}
          component={CampaignStringDetails}
        />
        <Stack.Screen
          name={"CmpPreviwe"}
          component={CmpPreviwe}
      />
        <Stack.Screen
          name={"CampainDtringDetails"}
          component={CampainDtringDetails}
        />
        <Stack.Screen
          name={"CampaignPreviwPage"}
          component={CampaignPreviwPage}
        />
         <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_NEW_CAMPAIGN}
        component={AddCampaign}
      />
       
      <Stack.Screen
        name={"CampStrApproval"}
        component={CampStrApproval}
      />
        <Stack.Screen
          name={"PlanogramApproveView"}
          component={PlanogramApproveView}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.PLANOGRAM_VIEW}
          component={PlanogramIndexView}
        />
        <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY}
        component={AddMediaLibrary}
        options={{header:CommonHeader}}
      />
        <Stack.Screen
        name={NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE}
        component={RegisterDevice}
      />
      
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_NEW_PLANOGRAM}
        component={AddNewPlanogram}

      />
     
      <Stack.Screen name={"CalenderView"} component={CalenderView} />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.SCHEDULER}
        component={Scheduler}
      /> 
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_SCHEDULER}
        component={AddScheduler}
      /> 
      <Stack.Screen
          name={NAVIGATION_CONSTANTS.SCHEDULER_VIEW}
          component={SchedulerIndexView}
        />  
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.PLANOGRAM}
        component={Planogram}
      />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.PLANOGRAM_EDIT}
          component={PlanogramEdit}
      />
     
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.SCHEDULER_VIEW1}
        component={SchedulerIndexView1}
      />
       <Stack.Screen
        name={NAVIGATION_CONSTANTS.SCHEDULER_EDIT}
        component={SchedulerEdit}
      />
        
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.REPLACE_UN_REG_DEVICE_FORM}
          component={ReplaceUnregDeviceForm}
        />
        <Stack.Screen
          name={NAVIGATION_CONSTANTS.REPLACE_DEVICE_FORM}
          component={ReplaceDeviceForm}
        />
        <Stack.Screen
        name={NAVIGATION_CONSTANTS.REPLACE_DEVICE}
        component={ReplaceDevice}
      />
        
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default AppRouter;
