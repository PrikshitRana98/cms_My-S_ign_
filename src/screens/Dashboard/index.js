import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,AppState,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppText from "../../Components/Atoms/CustomText";
import Greetings from "../../Components/Atoms/Greetings";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import QuickLinks from "../../Components/Molecules/QuickLinks";
import LicenseDetails from "../../Components/Organisms/Dashboard/LicenseDetails";
import Planograms from "../../Components/Organisms/Dashboard/Planograms";
import RecentActivities from "../../Components/Organisms/Dashboard/RecentActivities";
import { ThemeContext } from "../../appConfig/AppContext/themeContext";
import dashboardStyles from "./style";
import userReducer from "../../appConfig/Redux/Reducer/userReducer";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import viewIcon from "../../Assets/Images/PNG/document.png";
import {
  getActiveSiteData,
  getRecentMediaData,
  getUserData,
  userManagerService,getDeviceGroupByLocation,getDeviceByLocation,
} from "./DashboardApi";
import Fontisto from "react-native-vector-icons/Fontisto";

import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";
import { getLocationList } from "../Planogram/PlonogramApi";
import MediaAndDisplay from "../../Components/Organisms/Dashboard/MediaAndDisplay";
import SearchBox from "../../Components/Atoms/SearchBox";
import LocationsForDasboard from "../../Components/Organisms/Dashboard/LocationsForDashoard";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { checkIsApprove, getCustomerRole, getWorkFlow } from "../../Services/AxiosService/ApiService";
import { width } from "../../Helper/scaling";
import { updateDrawerIndex } from "../../appConfig/Redux/Action/userAction";
import { PREVILAGES } from "../../Constants/privilages";
import { json } from "stream/consumers";
import { fcmService } from "../../NotificationService/FCMService";
import { localNotificationService } from "../../NotificationService/LocalNotificationService";
import messaging from '@react-native-firebase/messaging';

const Dashboard = ({ navigation }) => {
  const themeColor = useContext(ThemeContext);
  const Styles = dashboardStyles(themeColor);
  const [licenseDetails,setLicenseDetails]=useState({});
  const userList = useSelector((state) => state.userReducer.userDetails);
  const userInfo = useSelector((state) => state.userReducer.userRole);
  const userActive = useSelector((state) => state.userReducer.activeSite);

  const [userRole,setUseRole]=useState("")
  const { authorization } = useSelector(
    (state) => state.userReducer
  );
  const activeSideCount = useSelector((state) => state.userReducer.activeSideCount);
  const [isLoading, setIsLoading] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const [recentCampaign, setRecentCampaign] = useState(null);
  const [recentCampaignString, setRecentCampaignString] = useState(null);
  const [recentpublished, setRecentPublished] = useState([]);
  const [recentInActive, setRecentInActive] = useState([]);
  const [planogramRunning, setPlanogramRunning] = useState([]);
  const [planogramLive, setPlanogramLive] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [recentDevices, setResentDevices] = useState([]);
  const [recentMedia, setRecentMedia] = useState(null);
  const [recentInactiveDevices, setRecentInactiveDevices] = useState(null);
  const [locationSelected, setLocationSelected] = useState(null);
  const [recentPlanoSche, setrecentPlanoSche] = useState(null);
  const [mpData, setMPData] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  const userData = useSelector(
    (state) => state?.userReducer?.userDetails?.data
  );
  useEffect(() => {
    let params = {
      ids: [],
    };
    getDeviceGroupByLocation(params, setIsLoading);
    getDeviceByLocation(params, setIsLoading);
  }, []);


  const CallingFunction=()=>{
    setTimeout(() => {
      getLocationList();
      getWorkFlow(navigation);
      checkIsApprove();
      getCustomerRole();
      getLicenseDetails()
    }, 500);
    userDetail();
    getSiteData();
  }

  const handleAppStateChange = async(nextAppState) => {
    console.log("22222222222222222\n\n ==>",nextAppState)
    if (nextAppState === 'active') {
      CallingFunction()
      if(authorization.length>0){
        getDashboardDetails();
      }
    }
  };

  useEffect(() => {
   // navigation.navigate(NAVIGATION_CONSTANTS.TEMPLATE)
    const subscription=AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove()
    };
  }, []);


  const workFlow = useSelector((state) => state.userReducer.workFlow);
  const isApprover = useSelector((state) => state.userReducer.isApprover);
  const dispatch = useDispatch();

  useEffect(()=>{
    CallingFunction()
  },[1])

  useEffect(()=>{
  if(userInfo){
    setUseRole(userInfo.userRole[0].roleName)
  }
  },[userInfo])

  useFocusEffect(
    useCallback(() => {
      console.log("Dash board focuse---->")
      const handleBackPress = () => {
        if (backPressCount === 0) {
          setBackPressCount(1 + backPressCount);
          setTimeout(() => setBackPressCount(0), 2000);
          if (Platform.OS == "android") {
            Toast.show("Press again to exit the app.", Toast.SHORT);
          }
        } else if (backPressCount === 1) {
          BackHandler.exitApp();
        }
        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );
      return () => subscription.remove();
    }, [backPressCount])
  );

  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);

  useEffect(() => {
    if (locationSelected != null) {
      getMediaPlayerData(locationSelected.locationId);
    }
  }, [locationSelected]);

  const getMediaPlayerData = async (locationId) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      locationId: locationId,
    };
    const succussCallBack = async (response) => {
      
      setMPData(response?.result[0]);
    };

    const failureCallBack = (error) => {
      console.log("fetchConnectedDisconnectedDevices",error)
      setIsLoading(false)
      // Alert.alert("Error",error.message);
    };

    userManagerService.fetchConnectedDisconnectedDevices(
      params,
      succussCallBack,
      failureCallBack
    );
  };

 

  useEffect(() => {    
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("navigation addListener--->")
      if(authorization){
        getDashboardDetails();
      }
      dispatch(updateDrawerIndex({ index: 0, subIndex: 0 }));
    });
    return unsubscribe;
  }, [authorization]);

  const [isSchedulerEnabled, setisSchedulerEnabled] = useState(null);

  const getDashboardDetails = () => {
    getStorageForKey("is_scheduler_enabled").then((is_scheduler_enabled) => {
      let is_scheduler_enabled1 = "";
      if (is_scheduler_enabled == "true" || is_scheduler_enabled == true) {
        is_scheduler_enabled1 = true;
        setisSchedulerEnabled(true);
      } else if (is_scheduler_enabled == "false" || is_scheduler_enabled == false) {
        is_scheduler_enabled1 = false;
        setisSchedulerEnabled(false);
      }

      setTimeout(() => {
        const me=authorization.includes("VIEW_SCHEDULER");
        console.log("authorization.MEDIA.VIEW_MEDIA)--->sss", me,)
        if(authorization.includes(PREVILAGES.MEDIA.VIEW_MEDIA)){
          getRecentMediaData();
        }
        if(authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER)){
          console.log("calling the ruuning sch/plano===> sche true------>")
          getRecentSchedulerPlanogram(1,5,is_scheduler_enabled1);
        }else if(authorization.includes(PREVILAGES.PLANOGRAM.VIEW_PLANOGRAM)||authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER)){
          console.log("calling the ruuning sch/plano===>")
          getplanogramLiveData(is_scheduler_enabled1);
          getplanogramRunningData(is_scheduler_enabled1);
        }
      }, 500);
      
      setTimeout(() => {
        if(authorization.includes(PREVILAGES.CAMPAIGN.VIEW_CAMPAIGN)){
          getRecentCampaignData();
        }
        if(authorization.includes(PREVILAGES.CAMPAIGN_STRING.VIEW_CAMPAIGN_STRING)){
          getRecentCampaignStringData();
        }
        if(authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER)){
          console.log("calling the ruuning sch/plano===> sche true------>")
          getRecentSchedulerPlanogram(1,5,is_scheduler_enabled1);
        } 
        if(authorization.includes(PREVILAGES.PLANOGRAM.VIEW_PLANOGRAM)||authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER)){
          console.log("calling the ruuning sch/plano===>")
          getplanogramLiveData(is_scheduler_enabled1);
          getplanogramRunningData(is_scheduler_enabled1);
        }
      }, 600);
      
      setTimeout(() => {
        if(authorization.includes(PREVILAGES.DEVICE.VIEW_DEVICE)){
          getRecentDevices();
          getRecentInactiveDevices();
          getRecentInActiveData();
          getRecentPublishedData();
        }
        
      }, 100);
      setTimeout(() => {
        // fetchApprovedRejectedPlano(is_scheduler_enabled1);
        // fetchUnApprovalPlano(is_scheduler_enabled1);
      }, 2600);
    });
  };

  const getRecentMediaData = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
    setIsLoading(false)
      console.log("getRecentMediaData sucess")
      
      if (response) {
        setRecentMedia(response);
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("getRecentMediaData error",error)
      // Alert.alert("Error ",error.message);
    };
    userManagerService.recentMediaList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentSchedulerPlanogram = async (currentPage = 1, limit = 5,is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      
      if (response) {
        setrecentPlanoSche(response);
      }
    };

    const failureCallBack = (error) => {
      console.log("line 329 dashboard")
      setIsLoading(false)
      setIsLoading(false)
      // Alert.alert("Error",error.message);
    };

    if (is_scheduler_enabled) {
      userManagerService.recentScheduler(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.recentPlanogram(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };
  const getRecentCampaignStringData = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    setIsLoading(true)
    const succussCallBack = async (response) => {
      setIsLoading(false)
      if (response) {
        setRecentCampaignString(response);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      
    };

    userManagerService.recentCampaignStringList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentCampaignData = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false)
      console.log("get Camapaign Data diaData sucess",)
      if (response && response?.data) {
        setRecentCampaign(response);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false)
      console.log("getRecent Camapign Data error-->",error)
      // Alert.alert("Error",error.message);
    };

    userManagerService.recentCamapignList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentDevices = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false)
      setResentDevices(response);
    };

    const failureCallBack = (error) => {
      console.log("line 419 dashboard")
      setIsLoading(false)
      // Alert.alert("Error",error.message);
    };

    userManagerService.recentDevices(params, succussCallBack, failureCallBack);
  };

  const getRecentInactiveDevices = async (currentPage = 1, limit = 5) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      currentPage,
      limit,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false)
      setRecentInactiveDevices(response);
    };

    const failureCallBack = (error) => {
      console.log("line 441 dashboard")
      setIsLoading(false)
      // Alert.alert("Error",error.message);
    };

    userManagerService.recentInactiveDevices(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const fetchUnApprovalPlano = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response.data) {
        setUnApprovedPlano(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("line 466 dashboard")
      // Alert.alert("Error",error.message);
      
    };

    if (is_scheduler_enabled == true || is_scheduler_enabled == "true") {
      userManagerService.fetchUnApprovalPlanoSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.fetchUnApprovalPlano(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };
  const fetchApprovedRejectedPlano = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response.data) {
        setApprovedRejectedPlano(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("line 498 dashboard")
      // Alert.alert("Error",error.message);
    };
    if (is_scheduler_enabled == true || is_scheduler_enabled == "true") {
      userManagerService.fetchApprovedRejectedPlanoSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.fetchApprovedRejectedPlano(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };


  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM message:', remoteMessage);
      onNotification(remoteMessage)
    });

    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        openModule(remoteMessage?.notification?.title) 
      }
    });

  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.notification) {
      openModule(remoteMessage?.notification?.title)
    }
  });


    return unsubscribe;
  }, []);


  let notificationMessageId;

  const onNotification = async notify => {
    let uniquedNotifId = Math.floor(Math.random() * 1000 + 1);
    const options = {
      soundName: 'notification_sound.mp3',
      playSound: true,
    };
  
    if (notify?.notification?.title) {
     // openModule(notify?.notification?.title)
      if (notificationMessageId != notify.messageId) {
        localNotificationService.showNotification(
          uniquedNotifId,
          notify?.notification?.title,
          notify?.notification?.body,
          notify?.notification,
          options,
        );
        notificationMessageId = notify.messageId;
      }
    }
  };

  const openModule = (title) =>
    {
      setTimeout(()=>{
        localNotificationService.cancelAllLocalNotifications();
      },8000)
     
      if (title == 'Added Template' || title == 'Updated Template' || title == 'Edit Template' || title == 'Deleted Template') {
        navigation.navigate(NAVIGATION_CONSTANTS.TEMPLATE)
      }
      if (title == 'Aspect Ratio Added' ||  title == 'Aspect Ratio Updated' || title == 'Aspect Ratio Deleted') {
        navigation.navigate(NAVIGATION_CONSTANTS.RESOLUTION_MANAGEMENT)
      }
      if (title == 'DEVICE ADDED' || title == 'DEVICE EDITED' || title == 'Delete Device' || title == 'Replace Device') {
        navigation.navigate(NAVIGATION_CONSTANTS.VIEW_ALL_DEVICES)
      }
      if (title == 'Added Campaign String' || title == 'Updated Campaign String'  || title == 'Delete Campaign String' || title == 'Campaign String Approved' || title == 'Campaign String Rejected')  {
        navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING)
      }
      if (title == 'Campaign Added' || title == 'Campaign Updated' || title == 'Campaign Deleted' || title == 'Campaign Approved' || title == 'Campaign Rejected')  {
        navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN)
      }
     
      if (title == 'Media Added' || title == 'Updated Media' || title == 'Delete Media') {
        navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_LIBRARY)
      }
      if (title == 'Add Device Group'  ||  title == 'Updated Device Group'  || title == 'Edit Device Group' || title == 'Delete Device Group') {
        navigation.navigate(NAVIGATION_CONSTANTS.MEDIA_PLAYER_GROUPS)
      }
     
      if (title == 'Add Scheduler' || title == 'Edit Scheduler' ||  title == 'Updated Scheduler' || title == 'Delete Scheduler' || title == 'Scheduler Approved' || title == 'Scheduler Rejected') {
        navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER)
      }
      if (title == 'Add Planogram' || title == 'Edit Planogram' || title == 'Updated Planogram'  || title == 'Delete Planogram' || title == 'Planogram Approved' || title == 'Planogram Rejected')  {
        navigation.navigate(NAVIGATION_CONSTANTS.PLANOGRAM)
      }
    }

  const onOpenNotification = async notify => {
    if (notify?.notification) {
      openModule(notify?.notification?.title)
    }
  };



  const userDetail = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
    };
    getUserData(params, setIsLoading);
  };

  const getSiteData = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
    };
    getActiveSiteData(params, setIsLoading);
  };

  const getRecentInActiveData = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response && response?.data) {
        setRecentInActive(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("line 640 dashboard",error.message)
      // Alert.alert("Error",error.message);
    };

    userManagerService.recentInActiveList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getRecentPublishedData = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response && response?.data) {
        setRecentPublished(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("line 664 dashboard",error)
      // Alert.alert("Error",error.message);
    };

    userManagerService.recentPublishedList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const getplanogramRunningData = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if ( response?.result) {
        setPlanogramRunning(response.result);
      }else if(response?.data){
        setPlanogramRunning(response.data);
      }
    };

    const failureCallBack = (error) => {
      // Alert.alert("Error",error.message);
      console.log("line 691 dashboard",error)
    };

    if (is_scheduler_enabled) {
      userManagerService.recentPlanogarmRunningListSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.recentPlanogarmRunningList(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };

  const getplanogramLiveData = async (is_scheduler_enabled) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("----->setPlanogramLive123",JSON.stringify(response))
      if (response && response?.data) {
        // console.log("----->setPlanogramLive",JSON.stringify(response.data))
        setPlanogramLive(response.data);
      }
    };

    const failureCallBack = (error) => {
      // Alert.alert("Error",error.message)
      console.log("line 725 dashboard",error)
      
    };
    if (is_scheduler_enabled) {
      userManagerService.recentPlanogramLiveListSch(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      userManagerService.recentPlanogramLiveList(
        params,
        succussCallBack,
        failureCallBack
      );
    }
  };

  const getLicenseDetails=async()=>{
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
     console.log("rrereer license--->",JSON.stringify(response))
     if(response?.data){
      setLicenseDetails(response.data)
     }
    };

    const failureCallBack = (error) => {
      // Alert.alert("Error",error.message)
      console.log("line 758 dashboard",error,)
      
    };
    if (true) {
      userManagerService.fetchUserDetails(
        params,
        succussCallBack,
        failureCallBack
      );
    }


  }

  
 

  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <ClockHeader />
      <ScrollView
        style={Styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={Styles.subContainer}>
          <Greetings
            name={userInfo ? userInfo?.fullName : null}
          />

          {userRole=="CUSTOMER_ADMIN"&&<LicenseDetails
            licenseDetails={licenseDetails}
            userList={userList?.data}
            userActive={userActive}
            activeSideCount={activeSideCount}
          />}
          
          <View style={Styles.hariarchyContainer}>
          <AppText style={Styles.headerText}>Location Hierarchy</AppText>
            {/* <SearchBox isIcon placeholder="Search Location" /> */}
            <>
              {locationData1 && (
                <LocationsForDasboard
                  data={locationData1}
                  setIsLoading={setIsLoading}
                  locationSelected={locationSelected}
                  setLocationSelected={setLocationSelected}
                  selectedLocations={selectedLocations}
                  setSelectedLocations={setSelectedLocations}
                />
              )}
            </>
            <MediaAndDisplay data={locationSelected} mpData={mpData} />
          </View>
          {userRole=="CUSTOMER_ADMIN"&& <QuickLinks isSchedulerEnabled={isSchedulerEnabled} /> }
          {userRole=="CUSTOMER_ADMIN"&&<Planograms
            planogramRunning={planogramRunning}
            planogramLive={planogramLive}
            isSchedulerEnabled={isSchedulerEnabled}
          />}

          <RecentActivities
            recentMedia={recentMedia}
            recentCampaign={recentCampaign}
            recentCampaignString={recentCampaignString}
            recentpublished={recentpublished}
            recentPlanoSche={recentPlanoSche}
            isSchedulerEnabled={isSchedulerEnabled}
            recentInActive={recentInActive}
            recentDevices={recentDevices}
            recentInactiveDevices={recentInactiveDevices}
            getRecentMediaData={getRecentMediaData}
            getRecentCampaignStringData={getRecentCampaignStringData}
            getRecentSchedulerPlanogram={getRecentSchedulerPlanogram}
            getRecentCampaignData={getRecentCampaignData}
            getRecentDevices={getRecentDevices}
            getRecentInactiveDevices={getRecentInactiveDevices}
          />
          {/* isSchedulerEnabled != true && workFlow */}
          {/* {true &&
            (workFlow?.approverWorkFlow === "PLANOGRAM" ||
              workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN") && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Pressable
                    onPress={() => {
                      setplanogramApprovalFlag(true);
                    }}
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: planogramApprovalFlag ? 1 : 0,
                    }}
                  >
                    <AppText style={{ fontSize: 12, color: "#000" }}>
                      {isSchedulerEnabled == true
                        ? "SCHEDULER APPROVAL"
                        : "PLANOGRAM APPROVAL"}
                    </AppText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setplanogramApprovalFlag(false);
                    }}
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: !planogramApprovalFlag ? 1 : 0,
                    }}
                  >
                    <AppText style={{ fontSize: 12, color: "#000" }}>
                      {isSchedulerEnabled == true
                        ? "APPROVED/REJECTED SCHEDULER"
                        : "APPROVED/REJECTED PLANOGRAM"}
                    </AppText>
                  </Pressable>
                </View>

                <FlatList
                  ListEmptyComponent={ListEmptyComponent}
                  data={
                    planogramApprovalFlag
                      ? unApprovedPlano
                      : approvedRejectedPlano
                  }
                  renderItem={renderCampaignList}
                  ListHeaderComponent={renderCampaignHeader}
                />
              </>
            )
          } */}

          <CopyRightText />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;
