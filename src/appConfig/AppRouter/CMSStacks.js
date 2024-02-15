import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import Planogram from "../../screens/Planogram";
import Scheduler from "../../screens/Scheduler";
import AddNewPlanogram from "../../screens/AddNewPlanogram";
import AddCampaign from "../../screens/AddCampaign";
import AddScheduler from "../../screens/AddScheduler";
import ResolutionManagement from "../../screens/ResolutionManagement";
import AddNewResolution from "../../screens/AddResolution";
import MediaLibrary from "../../screens/MediaLibrary";
import AddMediaLibrary from "../../screens/AddMediaLibrary";
import CampaignManagement from "../../screens/Campaign";
import CampaignString from "../../screens/CampaignString";
import RegisterNewDevice from "../../screens/RegisterDevice";
import Template from "../../screens/Template";
import ViewMedia from "../../screens/MediaLibrary/ViewMedia";
import EditMediaLib from "../../screens/MediaLibrary/EditMediaLib";
import CampaignFormManagement from "../../screens/CampaignForm";
import CreateCampaignString from "../../screens/CreateCampaignString";
import CampaignStringSubmit from "../../screens/CampaignStringSubmit";
import CampaignAdd from "../../screens/CampaignAdd";
import CampaignEditSubmit from "../../screens/CampaignStringEdit/CampaignEditSubmit";
import CampaignEditString from "../../screens/CampaignStringEdit/CampaignEditString";
import CampaignDetail from "../../screens/CampaignString/CampaignDetail";
import PlanogramIndexView from "../../screens/Planogram/PlanogramIndexView";
import SchedulerIndexView from "../../screens/Scheduler/SchedulerIndexView";
import SchedulerEdit from "../../screens/Scheduler/SchedulerEdit";
import SchedulerIndexView1 from "../../screens/Scheduler/SchedulerIndexView1"; 
import ChangePassword from "../../Components/Organisms/Dashboard/ChangePassword";
import EditMediaContent from "../../screens/MediaLibrary/EditMediaContent";
import TextContentEdit from "../../screens/MediaLibrary/TextContent";
import EditMediaCont from "../../screens/MediaLibrary/EditMediaContent2";
import ApprocalFlow from "../../screens/ApprovalFlow";
import PlanogramApproveView from "../../screens/Planogram/PlanogramApproveView";
import PlanogramEdit from "../../screens/Planogram/PlanogramEdit";
import EditCampaign from "../../screens/AddCampaign/EditCampaign";
import CampaignStringDetails from "../../screens/CampaignString/CampaignStringDetails";
import LocCampaign from "../../screens/AddCampaign/locCampaign";
import CmpPreviwe from "../../screens/Campaign/cmpPreview2";
import CmpDetail from "../../screens/Campaign/CmpDetail";
import AboutPage from "../../screens/About/AboutPage";
import Dashboard from '../../screens/Dashboard';

const CMSStack = (props) => {
  const initialScreen = props?.route?.params?.screen;
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={
        initialScreen ? initialScreen : NAVIGATION_CONSTANTS.SCHEDULER
      }
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
      name={NAVIGATION_CONSTANTS.DASHBOARD}
          component={Dashboard}/>
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.SCHEDULER}
        component={Scheduler}
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
          name={NAVIGATION_CONSTANTS.PLANOGRAM_VIEW}
          component={PlanogramIndexView}
        />

      <Stack.Screen
        name={NAVIGATION_CONSTANTS.RESOLUTION_MANAGEMENT}
        component={ResolutionManagement}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_RESOLUTION}
        component={AddNewResolution}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.MEDIA_LIBRARY}
        component={MediaLibrary}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY}
        component={AddMediaLibrary}
      />

      <Stack.Screen
        name={NAVIGATION_CONSTANTS.VIEW_MEDIA}
        component={ViewMedia}
      />

      <Stack.Screen
        name={NAVIGATION_CONSTANTS.EDIT_MEDIA_LIBRARY}
        component={EditMediaLib}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.EDIT_MEDIA_CONTENT}
        component={EditMediaCont}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.EDIT_MEDIA_CONTENT_TEXT}
        component={TextContentEdit}
      />
      <Stack.Screen name={NAVIGATION_CONSTANTS.TEMPLATE} component={Template} />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN}
        component={CampaignManagement}
      />
      <Stack.Screen
          name={"CmpPreviwe"}
          component={CmpPreviwe}
      />
      <Stack.Screen
        name={"CampaignFormManagement"}
        component={CampaignFormManagement}
      />
      <Stack.Screen
        name={'CampaignAdd'}
        component={CampaignAdd}
      />
      <Stack.Screen
          name={NAVIGATION_CONSTANTS.CMP_VIEW}
          component={CmpDetail}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN_STRING}
        component={CampaignString}
      />
      <Stack.Screen
          name={"CampaignStringDetails"}
          component={CampaignStringDetails}
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
        name={NAVIGATION_CONSTANTS.CREATE_CAMPAIGN_STRING}
        component={CreateCampaignString}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN_STRING_SUBMIT}
        component={CampaignStringSubmit}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN_EDIT_SUBMIT}
        component={CampaignEditSubmit}
      />
      <Stack.Screen
        name={NAVIGATION_CONSTANTS.CAMPAIGN_EDIT_STRING}
        component={CampaignEditString}
      /> 
     
      
      <Stack.Screen
          name={"PlanogramApproveView"}
          component={PlanogramApproveView}
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
        name={NAVIGATION_CONSTANTS.CAMPAIGN_STRING_DETAIL}
        component={CampaignDetail}
      /> 
      {/* <Stack.Screen
        name={NAVIGATION_CONSTANTS.CHANGE_PASSWORD}
        component={ChangePassword}
      />  */}
      <Stack.Screen
          name={NAVIGATION_CONSTANTS.APPROVAL_FLOW}
          component={ApprocalFlow}
      />
      <Stack.Screen 
        name={NAVIGATION_CONSTANTS.ABOUT_PAGE}
        component={AboutPage}
      />
    </Stack.Navigator>
  );
};

export default CMSStack;
