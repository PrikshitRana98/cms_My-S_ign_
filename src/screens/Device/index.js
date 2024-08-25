import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdvSearchAndAdd from "../../Components/Atoms/AdvSearchAndAdd";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeaderForDevice";
import Pagination from "../../Components/Atoms/Pagination";
import SearchBox from "../../Components/Atoms/SearchBox";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import DeviceListBody from "../../Components/Organisms/Devices/DeviceListBody";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import DeviceStyles from "./style";
import {
  deviceManagerService,
  getDeviceByLocation,
  getRegisterMedia,
} from "./DeviceApi";
import { useSelector } from "react-redux";
import { mediaGroupManagerService } from "../MediaPlayerGroups/MediaGroupApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import Loader from "../../Components/Organisms/CMS/Loader";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import PlanogramDownload from "../../Components/Organisms/Devices/PlanogramDownload";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import DatePicker from "react-native-date-picker";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import UnRegDeviceListBody from "../../Components/Organisms/Devices/UnRegDeviceListBody";
import { PREVILAGES } from "../../Constants/privilages";
import LocationsListForDivceSearch from "../../Components/Organisms/Dashboard/LocationsForAddDeviceSearch1";
import DeviceListBodyLocation from "../../Components/Organisms/Devices/DeviceListBodyLocation";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import { PlanogramManagerService } from "../Planogram/PlonogramApi";
import { Dropdown } from "react-native-element-dropdown";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { SchedulerManagerService } from "../Scheduler/SchedulerApi";


const Device = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = DeviceStyles(themeColor);
  const [selectedMP, setSelectedMP] = useState("Registered MP");
  const [deviceGroupArr, setDeviceGroupArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadModal, setDownLoadModal] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [unRgMediaData, setUnRgMediaData] = useState([]);
  const [locMediaData, setLocRgMediaData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [paginationData,setPaginationData]=useState({})
  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });
  const headers = [
    {
      title: "Registered MP",
      count: 20,
      color: themeColor.themeColor,
    },
    {
      title: "Device Location MP",
      count: 11,
      color: themeColor.activeGreen,
    },
  ];
  const { isApprover, authorization } = useSelector((state) => state.userReducer);

  const [successModal,setSuccessModal]=useState(false)
  const [successMsg,setSuccessMsg]=useState("")

  const onComplete = () => {
    setSuccessModal(false);
  };

  const renderNumber = (number, color = themeColor.themeColor) => (
    <View style={[Styles.numberContainer, { backgroundColor: color }]}>
      <Text
        style={{
          color: themeColor.white,
        }}
      >
        {number}
      </Text>
    </View>
  );

  const getDeviceGroup = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      // console.log("success get device planogram", response);
      setIsLoading(false);
      if (response?.code === 200) {
        let dArr = response?.result?.map((d) => {
          return { label: d.deviceGroupName, value: d.deviceGroupId };
        });
        // console.log("dArr", dArr);
        setDeviceGroupArr([{ label: "Device group", value: null }, ...dArr]);
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("error get device planogram", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    mediaGroupManagerService.fetchMediaGroupList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  // register media================================

  const getRegisterMedia = async (endPoint,setIsLoading=()=>{}) => {
    setIsLoading(true);
    const successCallBack = async (response) => {
     console.log("getRegisterMedia success", response.result);
      setIsLoading(false);
      setMediaData(response.result);
      setPaginationData(response.pagination)
      
    };

    const errorCallBack = (response) => {
      setIsLoading(false);
      console.log("getRegisterMedia error", response);
      Alert.alert("Error",error.response.data.message)
      
    };

    deviceManagerService.fetchRegisterMedia(
      { endPoint },
      successCallBack,
      errorCallBack
    );
  };

  const [searchData, setSearchData] = useState({
    numPerPage: 10,
    currentPage: 1,
    MediaPlayerName: null,
    startDate: null,
    endDate: null,
    GroupId: null,
    Location: null,
    os: null,
    connectivity: null,
    panelStatus: null,
    isUsedForUseEffect: "",
  });
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    getDeviceGroup();
    const unsubscribe = navigation.addListener("focus", () => {
      makeRegisterMediaDataUrl();
      selectedLocations.length > 0 && getDeviceByLocation();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (
      (selectedMP === "Registered MP" ||
        searchData.isUsedForUseEffect === "Registered MP") &&
      searchData.isUsedForUseEffect != "openSearch"
    ) {
      makeRegisterMediaDataUrl();
    }
  }, [searchData.isUsedForUseEffect]);

  useEffect(()=>{
    makeRegisterMediaDataUrl()
  },[searchData.MediaPlayerName,searchData.Location,searchData.os])

 

  const makeRegisterMediaDataUrl = () => {
    let endPoint = `device-management/api/device/getAllByAdvanceSearchandFilter`;
    const queryParams = [];
    for (const key in searchData) {
      if (
        searchData[key] != undefined &&
        searchData[key] != "" &&
        searchData[key] !== null &&
        searchData[key] !== 0 &&
        key != "isUsedForUseEffect"
      ) {
        if (key == "startDate") {
          queryParams.push(
            `${"fromDate"}=${new Date(searchData[key]).getTime()}`
          );
        } else if (key == "endDate") {
          queryParams.push(
            `${"toDate"}=${new Date(searchData[key]).getTime()}`
          );
        } else {
          queryParams.push(`${key}=${searchData[key]}`);
        }
      } else {
        if (key == "connectivity" && searchData[key] == false) {
          queryParams.push(`${key}=${searchData[key]}`);
        }
      }
    }
    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }

    getRegisterMedia(endPoint,()=>{});
    console.log("endPoint", endPoint);
  };
  // end register media================================

  // Device location================================
  const [selectedLocations, setSelectedLocations] = useState([]);
  // const [deviceLocation, setDeviceLocation] = useState(null);
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );

  useEffect(() => {
    if (selectedLocations) {
      if (selectedLocations.length > 0) {
        getDeviceByLocation();
      } else {
        setLocRgMediaData([]);
      }
      console.log("selectedLocationsselectedLocations", selectedLocations);
    }
  }, [selectedLocations]);

  const getDeviceByLocation = async () => {
    setIsLoading(true);

    const successCallBack = async (response) => {
      setIsLoading(false);
      console.log("getDeviceByLocation success", response);
      setLocRgMediaData(response.result);
    };

    const errorCallBack = (response) => {
      console.log("getDeviceByLocation error", response);
      setIsLoading(false);
    };

    if (selectedLocations.length > 0) {
      let endP = "";
      endP += `?locationIds=${selectedLocations.join("&locationIds=")}`;
      console.log("endPendP", endP);

      let params = {
        ids: endP,
      };
      deviceManagerService.getAllDevicesByLocation(
        params,
        successCallBack,
        errorCallBack
      );
    }
  };
  // End Device location============================

  // End un-register-url============================

  const [searchUnRegData, setSearchUnRegData] = useState({
    numPerPage: 100,
    currentPage: 1,
    clientIdentifier: null,
    ethernetMacAddress: null,
    wifiMacAddress: null,
    os: null,
    isUsedForUseEffect: "",
  });

  // useEffect(() => {
  //   if (selectedMP == "Unregistered MP" || searchUnRegData.isUsedForUseEffect == "Unregistered MP"
  //   ) {
  //     makeUnRegisterMediaDataUrl();
  //   }
  // }, [searchUnRegData.isUsedForUseEffect]);

  const makeUnRegisterMediaDataUrl = () => {
    let endPoint = `device-management/api/unregistereDdevice`;
    const queryParams = [];
    for (const key in searchUnRegData) {
      if (
        searchUnRegData[key] != undefined &&
        searchUnRegData[key] != "" &&
        searchUnRegData[key] !== null &&
        searchUnRegData[key] !== 0 &&
        key != "isUsedForUseEffect"
      ) {
        queryParams.push(`${key}=${searchUnRegData[key]}`);
      }
    }

    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }

    getUnRegisterMedia(endPoint);
    console.log("endPoint", endPoint);
  };

  const getUnRegisterMedia = async (endPoint) => {
    setIsLoading(true);
    const successCallBack = async (response) => {
      
      setMediaData(response.result);
      setUnRgMediaData(response.result);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    const errorCallBack = (error) => {
      if(error?.response?.data?.message){
      Alert.alert("Error",error.response.data.message)
    }else{
      Alert.alert("Error",error.message)
    }
      setIsLoading(false);
    };

    deviceManagerService.fetchUnRegisterMedia(
      { endPoint },
      successCallBack,
      errorCallBack
    );
  };

  // End un-register-url============================
  const tabClick = (title) => {
    console.log(title, "tabclick");
    setSelectedMP(title);
    setSelectedLocations([]);
    setLocRgMediaData([]);
    if (title === "Registered MP") {
      setSearchData({
        numPerPage: 100,
        currentPage: 1,
        MediaPlayerName: null,
        GroupId: null,
        Location: null,
        panelStatus: null,
        os: null,
        connectivity: null,
        isUsedForUseEffect: title,
      });
      setSearchUnRegData({ ...searchUnRegData, isUsedForUseEffect: title });
    } else if (title === "Unregistered MP") {
      setSearchUnRegData({
        numPerPage: 100,
        currentPage: 1,
        clientIdentifier: null,
        ethernetMacAddress: null,
        wifiMacAddress: null,
        os: null,
        isUsedForUseEffect: title,
      });
      setSearchData({
        ...searchData,
        isUsedForUseEffect: title,
      });
    } else {
      setSearchData({
        numPerPage: 100,
        currentPage: 1,
        MediaPlayerName: null,
        GroupId: null,
        Location: null,
        panelStatus: null,
        os: null, //capital-ANDROID,
        connectivity: null, //true|false
        isUsedForUseEffect: title,
      });
      setSearchUnRegData({ ...searchUnRegData, isUsedForUseEffect: title });
    }
  };

  const btnOpenModelType = (state, id) => {
    console.log("action=", state, "id=", id);
    switch (state) {
      case "Unmute":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Unmute Media Player",
          description: "Are you sure you want to unmute the device?",
          confirmModalFlag: true,
          actionType: "Unmute",
          actionData: id,
        });
        break;
        case "Mute":
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Mute Media Player",
            description: "Are you sure you want to mute the device?",
            confirmModalFlag: true,
            actionType: "Mute",
            actionData: id,
          });
          break;
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Device",
          description: "Are you sure you want to delete selected device?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
        });
        break;
      case "Download":
        {
          setConfirmBoxData({
            ...confirmBoxData,
            actionData: id,
          });
          setDownLoadModal(true);
        }
        break;
      case "DeleteAll":
        {
          if (selectedData.length > 0) {
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Delete Device",
              description: "Are you sure you want to delete selected device?",
              confirmModalFlag: true,
              actionType: "DeleteAll",
              actionData: id,
            });
          } else {
            alert("Please select devices");
          }
        }
        break;
      case "ConnectDisconnected":
        {
          btnMuteUnmuteDevice(id, [11]);
        }
        break;
      case "Active MP":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Activate Media Player",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Active MP",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Inactive MP":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Inactive Media Player",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Inactive MP",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Mute MP":
        if (selectedData.length > 0 ) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Mute Media Player",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Mute MP",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Unmute MP":
        if (selectedData.length > 0 ) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Unmute Media Player",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Unmute MP",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Panel On":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Panel On",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Panel On",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Panel Off":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Panel Off",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Panel Off",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Manual Sync":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Manual Sync",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Manual Sync",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
        case "Redownload":{
          btnMuteUnmuteDevice([id], [10]);
          console.log(id,[10])
        }
          break;
      case "Force App Update":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Force App Update",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Force App Update",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      case "Content re-download":
        if (selectedData.length > 0) {
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Content re-download",
            description:
              "Are you sure you want to take this action on the selected devices?",
            confirmModalFlag: true,
            actionType: "Content re-download",
            actionData: id,
          });
        } else {
          alert("Please select devices");
        }
        break;
      default:
        break;
    }
  };

  const btnFerPormfaction = () => {
    switch (confirmBoxData.actionType) {
      case "Unmute":
        btnMuteUnmuteDevice([confirmBoxData.actionData], [11]);
        break;
      case "Mute":
        btnMuteUnmuteDevice([confirmBoxData.actionData], [8]);
        break;
      case "Delete":
        btnActionOnDevice(confirmBoxData.actionData, 3);
        break;
      case "DeleteAll":
        btnActionOnDevice(selectedData, 3);
        break;
      case "Active MP":
        btnActionOnDevice(selectedData, 1);
        break;
      case "Inactive MP":
        btnActionOnDevice(selectedData, 2);
        break;
      case "Mute MP":
        btnMuteUnmuteDevice(selectedData, [8]);
        break;
      case "Unmute MP":
        btnMuteUnmuteDevice(selectedData, [11]);
        break;
      case "Panel On":
        btnMuteUnmuteDevice(selectedData, [13]);
        break;
      case "Panel Off":
        btnMuteUnmuteDevice(selectedData, [14]);
        break;
      case "Manual Sync":
        btnMuteUnmuteDevice(selectedData, [9]);
        break;
      case "Force App Update":
        btnMuteUnmuteDevice(selectedData, [2]);
        break;
      case "Content re-download":
        btnMuteUnmuteDevice(selectedData, [2]);
        break;
      
      default:
        break;
    }
  };

  const getdata = () => {
    if (selectedMP === "Registered MP") {
      makeRegisterMediaDataUrl();
    } else {
      selectedLocations?.length > 0 && getDeviceByLocation();
    }
  };

  const btnActionOnDevice = async (ids, action) => {
    let params = {
      ids: ids,
      status: action,
    };
    console.log("params", params);
    setConfirmBoxData({ ...confirmBoxData, loading: true });
    setSelectedData([]);
    const succussCallBack = async (response) => {
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if (response.code == 200) {
        if (response.result.badRequest) {
          if (response.result.badRequest.length == 0) {
            setSuccessModal(true);
            setSuccessMsg(response?.message)
            setTimeout(()=>{getdata()},300)
            // Alert.alert("Success!", response?.message, [
            //   {
            //     text: "Okay",
            //     onPress: () => {
            //       getdata();
            //     },
            //   },
            // ]);
          } else {
            if (response?.result?.badRequest.length > 0) {
              alert(response?.result?.badRequest[0].message);
            }
          }
        } else {
          setSuccessModal(true);
          setSuccessMsg(response?.message)
          setTimeout(()=>{getdata()},300)
          // Alert.alert("Success!", response?.message, [
          //   {
          //     text: "Okay",
          //     onPress: () => {
          //       getdata();
          //     },
          //   },
          // ]);
        }
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };

    const failureCallBack = (error) => {
      setSelectedData([]);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    deviceManagerService.actionOnDevice(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnMuteUnmuteDevice = (ids, action) => {
    let params = {
      deviceIds: ids,
      pushIds: action,
    };
    console.log("params--->", params);
    setConfirmBoxData({ ...confirmBoxData, loading: true });

    const succussCallBack = async (response) => {
      
      setSelectedData([]);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      if (response.code == 200) {
        if (response.result.badRequest) {
          if (response.result.badRequest.length == 0) {
            setSuccessModal(true);
            setSuccessMsg(response?.message)
            setTimeout(()=>{getdata()},200)
            // Alert.alert("Success!", response?.message, [
            //   {
            //     text: "Okay",
            //     onPress: () => {
            //       getdata();
            //     },
            //   },
            // ]);
          } else {
            if (response?.result?.badRequest.length > 0) {
              alert("Error",response?.result?.badRequest[0].message);
            }
          }
        } else {
          setSuccessModal(true);
          setSuccessMsg(response?.message)
          setTimeout(()=>{getdata()},300)
          // Alert.alert("Success!", response?.message, [
          //   {
          //     text: "Okay",
          //     onPress: () => {
          //       getdata();
          //     },
          //   },
          // ]);
        }
      } else {
        if (response?.data?.length > 0) {
          alert("12",response?.data[0]?.message);
        } else if (response?.error) {
          console.log("sasas--->",response)
          // alert("1233",response?.error);
        } else {
          // alert("122",response?.message);
        }
      }
    };

    const failureCallBack = (error) => {
      console.log("0-0-0-00-0-0-0-0-0-0===>",JSON.stringify(error))
      setSelectedData([]);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    // console.log("btnDeleteDevice error--paramss12212-----------", params);
    deviceManagerService.offOnNoti(params, succussCallBack, failureCallBack);
  };
  const btnConnectDisconnect = (ids) => {
    let params = {
      deviceIds: ids,
      pushIds: [11],
    };

    const succussCallBack = async (response) => {
      console.log("btnConnectDisconnect success------", response);
      setIsLoading(false);
      if (response?.code === 200) {
        Alert.alert("Info!", response?.message, [
          {
            text: "Okay",
            onPress: () => {
              getdata();
            },
          },
        ]);
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("btnConnectDisconnect error-------------", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    deviceManagerService.offOnNoti(params, succussCallBack, failureCallBack);
  };
  const searchLocationApi = async (searchLoc) => {
    const slugId = await getStorageForKey("slugId");
    const successCallBack = async (response) => {
      console.log("location success", JSON.stringify(response.data));
      setLocationData([]);
      setLocationData(response.data);
      setIsLoading(false);
    };

    const errorCallBack = (error) => {
      console.log("location error", error);
      setIsLoading(false);
      setLocationData([]);
    };

    SchedulerManagerService.fetchLocationListSearch(
      { slugId, searchLoc },
      successCallBack,
      errorCallBack
    );
  };
  const getLocationPlanogram = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      
      if (response && response.data) {
        setLocationData([]);
        setLocationData(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("error", error);
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    PlanogramManagerService.locationList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [advanceSearchFlag, setAdvenceSearchFlag] = useState(false);

  const advancedSearchModal = () => {
    return (
      <Modal visible={advanceSearchFlag} style={Styles.mainContainerModal}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={Styles.headerContainerModal}>
              <CreateNewHeader
                title="Advance Search"
                onClickIcon={() => {
                  setAdvenceSearchFlag(false);
                }}
              />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
              <CommonTitleAndText
                title="Created From"
                text={
                  searchData.startDate
                    ? moment(searchData.startDate).format("DD-MM-YYYY")
                    : null
                }
                isIcon
                isCalender
                onPress={() => {
                  setDatePickerVisible(true);
                }}
              />
              <DatePicker
                modal
                mode="date"
                open={isDatePickerVisible}
                date={
                  searchData.startDate != null
                    ? searchData.startDate
                    : new Date()
                }
                onConfirm={(date) => {
                  setSearchData({ ...searchData, startDate: date });
                  setDatePickerVisible(false);
                }}
                onCancel={() => {
                  setDatePickerVisible(false);
                }}
              />

              <CommonTitleAndText
                title="Created To"
                text={
                  searchData.endDate
                    ? moment(searchData.endDate).format("DD-MM-YYYY")
                    : null
                }
                isIcon
                isCalender
                onPress={() => {
                  setDatePickerVisible1(true);
                }}
              />
              <DatePicker
                modal
                mode="date"
                open={isDatePickerVisible1}
                date={new Date()}
                // maximumDate={new Date()}
                onConfirm={(date) => {
                  setSearchData({ ...searchData, endDate: date });
                  setDatePickerVisible1(false);
                }}
                // value={searchData.endDate}
                value={searchData.endDate}
                onCancel={() => {
                  setDatePickerVisible1(false);
                }}
              />

              {/*===== selected group====== */}
              <View style={{ width: "100%", marginTop: moderateScale(2) }}>
                <CampaignDropDown
                  dataList={deviceGroupArr}
                  placeHolderText="Select Group"
                  onChange={(item) => {
                    setSearchData({ ...searchData, GroupId: item.value });
                  }}
                  value={searchData?.GroupId}
                />
              </View>

              {/* Search by location============= */}
              {locationData && (
                  <View
                    style={{
                      width: "100%",
                      marginVertical: moderateScale(5),
                      // marginBottom: isKeyboardOpen ? 200 : 0,
                    }}
                  >
                    <Dropdown
                      style={{
                        borderColor: "#00000026",
                        borderRadius: moderateScale(10),
                        borderWidth: moderateScale(1),
                        paddingVertical: moderateScale(10),
                        paddingHorizontal: moderateScale(15),
                        marginTop: 0,
                      }}
                      placeholderStyle={{
                        fontSize: moderateScale(14),
                        fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
                        color:searchData.Location?"black":"#ADB2C3",
                      }}
                      selectedTextStyle={{
                        fontSize: moderateScale(14),
                        fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
                        color: "black"
                      }}
                      inputSearchStyle={{
                        height: 40,
                        fontSize: 16,
                        color: "black",
                      }}
                      // onFocus={() => scrollToHeight()}
                      iconStyle={{
                        height: moderateScale(18),
                        width: moderateScale(18),
                        resizeMode: "contain",
                      }}
                      itemTextStyle={{ color: "#000000" }}
                      data={locationData?.map((item) => ({
                        label: item.locationId,
                        value: item.locationName,
                      }))}
                      search={true}
                      keyboardAvoiding={true}
                      maxHeight={200}
                      disable={false}
                      dropdownPosition="auto"
                      labelField="value"
                      valueField="label"
                      placeholder={searchData.Location?searchData.Location:"Select Location"}
                      searchPlaceholder="Search Location..."
                      value={searchData.Location?searchData.Location.toString():null}
                      onChangeText={(item) => {
                        if (item?.length > 1) {
                          searchLocationApi(item);
                        } else if (item?.length == 0) {
                          getLocationPlanogram();
                        }
                      }}
                      onChange={(item) => {
                        setSearchData({ ...searchData, Location: item.value });
                        console.log("0000--,",item)                        
                        getLocationPlanogram();
                      }}
                    />
                  </View>
                )}
              

              {/* connected disconnected ======== */}
              {/* <View style={{ width: "100%", marginTop: moderateScale(5) }}>
                <CampaignDropDown
                  dataList={[
                    { label: "All", value: null },
                    { label: "CONNECTED", value: true },
                    { label: "DISCONNECTED", value: false },
                  ]}
                  placeHolderText="Media Player Connectivity"
                  onChange={(item) => {
                    setSearchData({
                      ...searchData,
                      connectivity: item.value,
                    });
                  }}
                  value={searchData?.connectivity}
                />
              </View> */}

              {/* Panelstatus ========= */}
              <View style={{ width: "100%", marginTop: moderateScale(7) }}>
                <CampaignDropDown
                  dataList={[
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "INACTIVE", value: "INACTIVE" },
                  ]}
                  placeHolderText="Panel status"
                  onChange={(item) => {
                    setSearchData({ ...searchData, panelStatus: item.value });
                  }}
                  value={searchData.panelStatus}
                />
              </View>
              <View style={Styles.SubmitContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setSearchData({
                      numPerPage: 100,
                      currentPage: 1,
                      MediaPlayerName: null,
                      GroupId: null,
                      Location: null,
                      panelStatus: null,
                      os: null, //capital-ANDROID,
                      connectivity: null, //true|false
                      isUsedForUseEffect: "reset",
                    });
                    //setAdvenceSearchFlag(false);
                  }}
                  style={Styles.resetBox}
                >
                  <Text style={[Styles.resetText,{color:'red'}]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    getdata();
                    setAdvenceSearchFlag(false)
                  }}
                  style={Styles.submitBox}
                >
                  <Text style={Styles.resetText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <PlanogramDownload
        setModal={setDownLoadModal}
        deviceId={confirmBoxData.actionData}
        visible={downloadModal}
      />
      {advancedSearchModal()}
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          btnFerPormfaction();
        }}
        stateOperation={() => {
          setSelectedData([]);
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
      />
      <Loader visible={isLoading} />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <View style={Styles.mainContainer}>
        <ClockHeader />
        <CommonHeaderTitleAction
          title="All Devices"
          pageName="All Devices"
          btnOpenModelType={btnOpenModelType}
          isBulkOptionShow={((selectedMP == "Registered MP")&&(authorization.includes(PREVILAGES.DEVICE.ADD_DEVICE)||authorization.includes(PREVILAGES.DEVICE.EDIT_DEVICE)))}
        />
        {/* {selectedMP == headers[0].title && (
          <AdvSearchAndAdd
            title1="Advance Search"
            title2="+ Register New Device"
            containerStyle={{
              paddingHorizontal: moderateScale(0),
              marginVertical: moderateScale(5),
            }}
            renderAdd={authorization.includes(PREVILAGES.DEVICE.ADD_DEVICE)}
            buttonStyle={{
              paddingHorizontal: 0,
            }}
            onClickSearch={() => {
              setAdvenceSearchFlag(true);
            }}
            onClickAdd={() => {
              navigation.navigate(NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE);
            }}

          />
        )} */}
        {selectedMP == headers[0].title && (
          <ThemedButton
            onClick={() => {
              setAdvenceSearchFlag(true);
              getLocationPlanogram()
              setSearchData({
                ...searchData,
                isUsedForUseEffect: "openSearch",
              });
            }}
            containerStyle={{
              width: "95%",
              alignSelf: "center",
              marginVertical: moderateScale(10),
            }}
            title="Advance Search"
          />
        )}
        {/* {selectedMP != headers[0].title && (
          <ThemedButton
            onClick={() =>
              navigation.navigate(NAVIGATION_CONSTANTS.REGISTER_NEW_DEVICE)
            }
            containerStyle={{
              width: "95%",
              alignSelf: "center",
              marginVertical: moderateScale(10),
            }}
            title="+ Register New Device"
          />
        )} */}
        <View style={Styles.deviceList}>
          <ScrollView
            bounces={false}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {headers.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  tabClick(item.title);
                }}
                key={item.title}
                style={
                  selectedMP === item.title
                    ? Styles.deviceTopic
                    : Styles.inactiveTopic
                }
              >
                <Text style={Styles.headerText}>{item.title}</Text>
                {/* {renderNumber(item.count, item.color)} */}
              </TouchableOpacity>
            ))}
          </ScrollView>
          {selectedMP === headers[1].title && (
            <View style={Styles.deviceLocationView}>
              {
                <LocationsListForDivceSearch
                  data={locationData1}
                  setIsLoading={setIsLoading}
                  selectedLocations={selectedLocations}
                  setSelectedLocations={setSelectedLocations}
                />
              }
            </View>
          )}
          {/* {mediaData && mediaData?.length > 0 && ( */}
          {/* {selectedMP == headers[0].title ||
          selectedMP == "Device Location MP" && ( */}
          {selectedMP === "Registered MP" ? (
            <DeviceListBody
              navigation={navigation}
              dataList={mediaData.devices}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              searchData={searchData}
              setSearchData={setSearchData}
              deviceGroupArr={deviceGroupArr}
              selectedMP={selectedMP}
              headers={headers}
              makeRegisterMediaDataUrl={makeRegisterMediaDataUrl}
              btnOpenModelType={btnOpenModelType}
            />
          ) : (
            <DeviceListBodyLocation
              navigation={navigation}
              dataList={locMediaData}
              selectedData={selectedData}
              setSelectedData={setSelectedData}
              searchData={searchData}
              setSearchData={setSearchData}
              deviceGroupArr={deviceGroupArr}
              selectedMP={selectedMP}
              headers={headers}
              makeRegisterMediaDataUrl={makeRegisterMediaDataUrl}
              btnOpenModelType={btnOpenModelType}
            />
          )}

          {/* // : (
          //   <UnRegDeviceListBody
          //     navigation={navigation}
          //     dataList={unRgMediaData}
          //     selectedData={selectedData}
          //     setSelectedData={setSelectedData}
          //     searchData={searchUnRegData}
          //     setSearchData={setSearchUnRegData}
          //     deviceGroupArr={deviceGroupArr}
          //     selectedMP={selectedMP}
          //     headers={headers}
          //     makeRegisterMediaDataUrl={makeUnRegisterMediaDataUrl}
          //     btnOpenModelType={btnOpenModelType}
          //   />
          // )
          // } */}
          {/* )} */}
        </View>
        <Pagination 
        pageNumber={searchData.currentPage}
        totalpage={paginationData.pageCount}
        setState={e=>{
          setSearchData({...searchData,currentPage:e})
          getdata()
      }}

         />
        <CopyRightText />
      </View>
    </ScrollView>
  );
};

export default Device;
