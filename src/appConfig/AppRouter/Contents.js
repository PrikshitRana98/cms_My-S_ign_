import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import dropDown from "../../Assets/Images/PNG/down_arr.png";
import dropUp from "../../Assets/Images/PNG/up_arr.png";
import AppText from "../../Components/Atoms/CustomText";
import Separator from "../../Components/Atoms/Separator";
import { ASYNC_STORAGE } from "../../Constants/asyncConstants";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale, scale } from "../../Helper/scaling";
import {
  getStorageForKey,
  removeKeyInStorage,
  setStorageForKey,
} from "../../Services/Storage/asyncStorage";
import { useThemeContext } from "../AppContext/themeContext";
import Cms from "../../screens/Cms";
import { useDispatch, useSelector } from "react-redux";
import { PREVILAGES } from "../../Constants/privilages";
import { updateDrawerIndex } from "../Redux/Action/userAction";
import TrackPlayer from "react-native-track-player";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Content = () => {
  const navigation = useNavigation();
  const themeColor = useThemeContext();
  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });
  const { authorization, selectedIndex,workFlow } = useSelector(
    (state) => state.userReducer
  );
  const userRedData=useSelector((state) => state.userReducer.userDetails.data);
  const isSchedulerEnabled=useSelector((state) => state.userReducer.isSchedulerEnabled);
  const userdata=useSelector((state) => state.userReducer.userDetails)
  const stoptrackPlayer=async()=>{
    try {
      await TrackPlayer.reset()
      // await TrackPlayer.remove()
      console.log("audio stop123")
    } catch (error) {
      console.log("erer",error)
    }
  }

  const logout=async()=>{
    await removeKeyInStorage(ASYNC_STORAGE.USER_DETAILS);
    await setStorageForKey(ASYNC_STORAGE.LOGGED, false);
    await removeKeyInStorage("is_scheduler_enabled");
    navigation.reset({
      index: 0,
      routes: [{ name: NAVIGATION_CONSTANTS.LOGIN }],
    });
    try {
      await AsyncStorage.clear();
      console.log('Storage cleared successfully');
    } catch (error) {
      console.log('Error clearing storage:', error);
    }
  }
   const [isSchOn,setIsSchOn]=useState("") 
   const getData=async()=>{
    getStorageForKey("is_scheduler_enabled").then((is_scheduler_enabled) => {
      let is_scheduler_enabled1 = "";
      if (is_scheduler_enabled == "true" || is_scheduler_enabled == true) {
          is_scheduler_enabled1 = true;
          setIsSchOn(true);
      } else if (is_scheduler_enabled == "false" || is_scheduler_enabled == false) {
          is_scheduler_enabled1 = false;
          setIsSchOn(false);
      }

     
  });
   }
  useEffect(()=>{
    console.log("can weee call the getstorage api");
    getData()

  },[])
  // const [selectedIndex, setSelectedIndex] = useState({
  //   index: 0,
  //   subIndex: null,
  // });
  
  const dispatch = useDispatch()

  const Styles = ContentStyles(themeColor);

  const getCMSChild = () => {
    var cmsChild = [];
    if (authorization.includes(PREVILAGES.ASPECT_RATIO.VIEW_ASPECT_RATIO)) {
      cmsChild.push({
        name: "Resolution Management",
        nav: NAVIGATION_CONSTANTS.RESOLUTION_MANAGEMENT,
      });
    }
    if (authorization.includes(PREVILAGES.MEDIA.VIEW_MEDIA)) {
      cmsChild.push({
        name: "Media Library",
        nav: NAVIGATION_CONSTANTS.MEDIA_LIBRARY,
      });
    }
    if (authorization.includes(PREVILAGES.TEMPLATE.VIEW_TEMPLATE)) {
      cmsChild.push({
        name: "Template",
        nav: NAVIGATION_CONSTANTS.TEMPLATE,
      });
    }
    if (authorization.includes(PREVILAGES.CAMPAIGN.VIEW_CAMPAIGN)) {
      cmsChild.push({
        name: "Campaigns",
        nav: NAVIGATION_CONSTANTS.CAMPAIGN,
      });
    }
    if (
      authorization.includes(PREVILAGES.CAMPAIGN_STRING.VIEW_CAMPAIGN_STRING)
    ) {
      cmsChild.push({
        name: "Campaign Strings",
        nav: NAVIGATION_CONSTANTS.CAMPAIGN_STRING,
      });
    }
    if (authorization.includes(PREVILAGES.PLANOGRAM.VIEW_PLANOGRAM) 
    &&(isSchOn=="false"||isSchOn==false)
    ) {
      cmsChild.push({
        name: "Planogram",
        nav: NAVIGATION_CONSTANTS.PLANOGRAM,
      });
    }
    if (
      authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER) &&
      (isSchOn=="true"||isSchOn==true)
    ) {
      cmsChild.push({
        name: "Scheduler",
        nav: NAVIGATION_CONSTANTS.SCHEDULER,
      });
    }
    if ((authorization.includes(PREVILAGES.SCHEDULER.APPROVE_SCHEDULER)||authorization.includes(PREVILAGES.PLANOGRAM.APPROVE_PLANOGRAM))&&
    (workFlow?.approverWorkFlow!="NONE")){
      cmsChild.push({
        name: "Approval Flow",
        nav: NAVIGATION_CONSTANTS.APPROVAL_FLOW,
      });
    }

    return cmsChild;
  };

  const getDeviceChild = () => {
    var deviceChild = [];
    if (authorization.includes(PREVILAGES.DEVICE_ONBOARD.VIEW_DEVICE_ONBOARD)) {
      deviceChild.push({
        name: "Register Device",
        nav: NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE,
      });
    }
    if (authorization.includes(PREVILAGES.DEVICE.VIEW_DEVICE)) {
      deviceChild.push({
        name: "View All Devices",
        nav: NAVIGATION_CONSTANTS.VIEW_ALL_DEVICES,
      });
    }
    if (authorization.includes(PREVILAGES.DEVICE_GROUP.VIEW_DEVICE_GROUP)) {
      deviceChild.push({
        name: "Media Player Groups",
        nav: NAVIGATION_CONSTANTS.MEDIA_PLAYER_GROUPS,
      });
    }
    return deviceChild;
  };

  const handleNavigation = async (index, subIndex = 0) => {
    dispatch(updateDrawerIndex({
      index: index,
      subIndex: subIndex,
    }));

    stoptrackPlayer();
    
    if (index === 3) {
      setConfirmBoxData({
        ...confirmBoxData,
        title: "Log Out",
        description: "Are you sure you want to log out?",
        confirmModalFlag: true,
        actionType: "logout",
      });
      console.log("Log Out","Are you want to log out?")
      
    }else if(index===4){
      console.log("index 4 print")
      navigation.navigate(NAVIGATION_CONSTANTS.ABOUT_PAGE)
    } else {
      navigation.reset({
        index: index,
        routes: [
          { name: NAVIGATION_CONSTANTS.DASHBOARD },
          {
            name: NAVIGATION_CONSTANTS.CMS,
            params: {
              screen: getCMSChild()[index === 1 ? subIndex : 0]?.nav,
            },
          },
          {
            name: NAVIGATION_CONSTANTS.DEVICE,
            params: {
              screen: getDeviceChild()[index === 2 ? subIndex : 0]?.nav,
            },
          },
          
        ],
      });
    }
  };
  const getTintColor = (ind) => {
    return {
      tintColor: selectedIndex?.index === ind ? "white" : "gray",
    };
  };

  const ImagePaths = [
    require("../../Assets/Images/PNG/dash.png"),
    require("../../Assets/Images/PNG/cms.png"),
    require("../../Assets/Images/PNG/device.png"),
    require("../../Assets/Images/PNG/device.png"),
    require("../../Assets/Images/PNG/info.png")
  ];

  const renderCMS = () => {
    return (
      authorization.includes(PREVILAGES.ASPECT_RATIO.VIEW_ASPECT_RATIO) ||
      authorization.includes(PREVILAGES.MEDIA.VIEW_MEDIA) ||
      authorization.includes(PREVILAGES.TEMPLATE.VIEW_TEMPLATE) ||
      authorization.includes(PREVILAGES.CAMPAIGN.VIEW_CAMPAIGN) ||
      authorization.includes(PREVILAGES.CAMPAIGN_STRING.VIEW_CAMPAIGN_STRING) ||
      authorization.includes(PREVILAGES.PLANOGRAM.VIEW_PLANOGRAM) ||
      authorization.includes(PREVILAGES.SCHEDULER.VIEW_SCHEDULER)
    );
  };

  const renderDevice = () => {
    return (
      authorization.includes(PREVILAGES.DEVICE_ONBOARD.VIEW_DEVICE_ONBOARD) ||
      authorization.includes(PREVILAGES.DEVICE.VIEW_DEVICE) ||
      authorization.includes(PREVILAGES.DEVICE_GROUP.VIEW_DEVICE_GROUP)
    );
  };

  const getIcon = (index) => {
    return (
      <View
        style={{
          height: moderateScale(32),
          width: moderateScale(32),
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={ImagePaths[index]}
          style={[Styles.dashStyle(index), 
            getTintColor(index),
          ]}
          resizeMethod={"auto"}
        />
      </View>
    );
  };

  const getColor = (index, subIndex) => {
    if (
      selectedIndex?.index === index &&
      selectedIndex?.subIndex === subIndex
    ) {
      return {
        color: themeColor?.white,
        backgroundColor: themeColor?.activeThemeBack,
      };
    } else {
      return {
        color: themeColor.unselectedText,
        backgroundColor: "transparent",
      };
    }
  };
  const renderSubOptions = (title, index, subIndex) => {
    if (
      title === "Media Player Groups" &&
      !authorization.includes(PREVILAGES.DEVICE_GROUP.VIEW_DEVICE_GROUP)
    ) {
      return <></>;
    }
    return (
      <AppText
        key={title}
        onPress={() => {
          handleNavigation(index, subIndex);
        }}
        style={[Styles.subOptionStyles, getColor(index, subIndex)]}
      >
        {title}
      </AppText>
    );
  };
  const renderCMSChild = (index) => {
    return (
      <View style={Styles.subOptionView}>
        <View style={Styles.subOptionContainer}>
          {getCMSChild().map((item, item_index) =>
            renderSubOptions(item.name, index, item_index)
          )}
        </View>
      </View>
    );
  };
  const renderDeviceChild = (index) => {
    return (
      <View style={Styles.subOptionView}>
        <View style={Styles.subOptionContainer}>
          {getDeviceChild().map((item, item_index) =>
            renderSubOptions(item.name, index, item_index)
          )}
        </View>
      </View>
    );
  };
  const renderOptions = (title, index) => {
    return (
      <TouchableOpacity
        onPress={() => {
          
          // getDetails();
          if (selectedIndex.index === index) {
            dispatch(updateDrawerIndex({}))
          } else {
            dispatch(updateDrawerIndex({ index: index, subIndex: null }))
          }
          if (index === 0 || index === 3||index==4) {
            handleNavigation(index);
          }
        }}
        style={[Styles.textContainer]}
      >
        <View style={Styles.centeredRow}>
          {index !== 3 && getIcon(index)}
          <AppText
            style={{
              fontSize: moderateScale(18),
              color:
                selectedIndex?.index === index
                  ? themeColor.white
                  : themeColor.unselectedText,
              marginHorizontal: moderateScale(10),
              fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
            }}
          >
            {title}
          </AppText>
        </View>
        {(index === 1 || index === 2) && (
          <>
            {selectedIndex?.index === index && (
              <Image source={dropDown} style={Styles.downStyles} />
            )}
            {selectedIndex?.index !== index && (
              <Image source={dropUp} style={Styles.dropUpStyles} />
            )}
          </>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={Styles.navigationContainer}>
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          logout()
        }}
        stateOperation={() => {
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
      />
      {renderOptions("Dashboard", 0)}
      <Separator separatorStyle={Styles.separatorStyle} />
      {renderCMS() && (
        <>
          {renderOptions("CMS", 1)}
          {selectedIndex?.index === 1 && renderCMSChild(1)}
          <Separator separatorStyle={Styles.separatorStyle} />
        </>
      )}

      {renderDevice() && (
        <>
          {renderOptions("Device", 2)}
          {selectedIndex?.index === 2 && renderDeviceChild(2)}
          <Separator separatorStyle={Styles.separatorStyle} />
        </>
      )}
      <>
       {renderOptions("About", 4)}
      <Separator separatorStyle={Styles.separatorStyle} />
      </>
      {renderOptions("Log Out", 3)}
    </View>
  );
};

const ContentStyles = (COLORS) =>
  StyleSheet.create({
    navigationContainer: {
      flex: 1,
      backgroundColor: COLORS.themeColor,
      paddingHorizontal: moderateScale(15),
    },
    subContainer: {
      flex: 1,
      backgroundColor: "white",
    },
    dashStyle: (index) => ({
      height: moderateScale(index == 4 ? 30 : 25),
      width: moderateScale(index == 4 ? 30 : 25),
      tintColor: "white",
    }),
    deviceStyle: {
      height: moderateScale(23),
      width: moderateScale(27),
    },
    textContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      justifyContent: "space-between",
      paddingVertical: moderateScale(10),
    },
    subOptionContainer: {
      width: "100%",
      justifyContent: "flex-start",
      marginRight: scale(25),
    },
    subOptionView: {
      marginStart: scale(40),
    },
    subOptionStyles: {
      color: "white",
      fontSize: moderateScale(15),
      padding: moderateScale(5),
      borderRadius: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginVertical: scale(2),
    },
    downStyles: {
      tintColor: COLORS.white,
      height: moderateScale(8),
      width: moderateScale(13),
    },
    dropUpStyles: {
      tintColor: COLORS.unselectedText,
      height: moderateScale(8),
      width: moderateScale(13),
    },
    separatorStyle: {
      backgroundColor: "#40559E",
    },
    centeredRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  });
