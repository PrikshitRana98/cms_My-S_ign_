import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,Keyboard,
  InputAccessoryView,
  Modal,
  Pressable,KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import AddNewButton from "../../Components/Atoms/AddNewButton";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import AppText from "../../Components/Atoms/CustomText";
import Separator from "../../Components/Atoms/Separator";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import ThemedText from "../../Components/Atoms/ThemedText";
import SelectLocationModal from "../../Components/Organisms/Devices/SelectLocationModal";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import RegisterStyles from "./style";
import { getUserData, userManagerService } from "../Dashboard/DashboardApi";
import { useDispatch, useSelector } from "react-redux";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import { PlanogramManagerService } from "../Planogram/PlonogramApi";
import { setDeviceGroup } from "../../appConfig/Redux/Action/commonAction";
import { Portal } from "react-native-paper";
import Loader from "../../Components/Organisms/CMS/Loader";
import { AddDevicefun, deviceManagerService } from "../Device/DeviceApi";
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import UnRegDeviceListBody from "../../Components/Organisms/Devices/UnRegDeviceListBody";
import { PREVILAGES } from "../../Constants/privilages";

const cantrolPenalsList = [
  {
    label: "RJ45",
    value: "RJ45",
  },
  {
    label: "Rj45-QM",
    value: "RJ45_QM",
  },
  {
    label: "RS-232-IWB",
    value: "RS232_IWB",
  },
  {
    label: "RS-232-Others",
    value: "PANEL_OTHERS",
  },
  {
    label: "RS-232-Projector RZ-670",
    value: "PROJECTOR_RZ660",
  },
  {
    label: "RS-232-Projector RZ-670 With Arduino",
    value: "PROJECTOR_RZ660_WITH_ARDUINO",
  },
  {
    label: "RS-232-Projector TX410D",
    value: "PROJECTOR_TX410D",
  },
  {
    label: "RS-232-Projector TX410D With Arduino",
    value: "PROJECTOR_TX410D_WITH_ARDUINO",
  },
  {
    label: "RS-232-QM",
    value: "RS232_QM",
  },
  {
    label: "RS-232-RM/HDMI only",
    value: "RS232_RM_HDMI_ONLY",
  },
  {
    label: "RS-232-UMP",
    value: "RS232_UMP",
  },
  {
    label: "RS-232-Video Wall",
    value: "RS232_VIDEO_WALL",
  },
  {
    label: "SL5 Display",
    value: "SL5_DISPLAY",
  },
];

const RegisterNewDevice = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = RegisterStyles(themeColor);
  const dispatch = useDispatch();
  const [name, setname] = useState([]);
  const [unRgMediaData, setUnRgMediaData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [deviceGroupArr, setDeviceGroupArr] = useState([]);

  const [selectedMP, setSelectedMP] = useState("Registered MP");
  const { authorization } = useSelector((state) => state.userReducer);

  const [currentSection, setCurrentSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const headers = ["Unregister Device", "Device details", "Panel Details"];
  const [locationSelected, setLocationSelected] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [state, setState] = useState({
    mpIdentity: null,
    mpName: null,
    mpOsType: null,
    deviceGroupId: null,
    macAddress: null,
    licenceCode: null,
    deviceLocation: null,
    deviceGroupList: [],
    addedResult: null,
  });

  const [error, setError] = useState({
    mpIdentity: null,
    mpName: null,
    macAddress: null,
    mpOsType: null,
    deviceGroupId: null,
    deviceLocation: null,
    licenceCode: null,
  });

  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );

  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
  }));

  useEffect(() => {
    userDetail();
    getResolutionData();
    getDevicePlanogram();
  }, []);

  const userDetail = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
    };
    getUserData(params, setIsLoading);
  };

  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );

  useEffect(() => {
    if (currentSection == 1) {
      setCurrentSection(0);
    } else {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        async () => {
          navigation.goBack();
          console.log("backkkkk", currentSection);
        }
      );
    }
  }, [navigation]);

  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);

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

  const userData = useSelector((state) => state.userReducer.userDetails);
  const userInfo = userData?.data;

  const [licenceDetails,setLicenseDetails]=useState({})

  const getDevicePlanogram = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      // console.log("success get device planogram", response);
      setIsLoading(false);
      if (response?.code === 200) {
        const deviceGroupList1 = response?.result?.map((device) => ({
          label: device.deviceGroupName,
          value: device?.deviceGroupId,
        }));
        setState({ ...state, deviceGroupList: deviceGroupList1 });
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
      // console.log("error get device planogram", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    PlanogramManagerService.getDeviceGroupList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  useEffect(() => {
    getLicenseDetails()
    const unsubscribe = navigation.addListener("focus", () => {
      if (currentSection == 0) {
        makeUnRegisterMediaDataUrl();
        console.log("\n\nwqerewn2\n");
      }
    });
    return unsubscribe;
  }, []);

  

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
      Alert.alert("Error",error.message)
      
    };
    if (true) {
      userManagerService.fetchUserDetails(
        params,
        succussCallBack,
        failureCallBack
      );
    }


  }

  const getUnRegisterMedia = async (endPoint) => {
    setIsLoading(true);
    const successCallBack = async (response) => {
      console.log("getRegisterMedia success of this", response);

      setUnRgMediaData(response.result);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    };

    const errorCallBack = (response) => {
      console.log("getRegisterMedia error", response);
      Alert.alert("wrewerr", 1);
      setIsLoading(false);
    };

    deviceManagerService.fetchUnRegisterMedia(
      { endPoint },
      successCallBack,
      errorCallBack
    );
  };

  useEffect(() => {
    if (
      (selectedMP === "Registered MP" ||
        searchUnRegData.isUsedForUseEffect === "Registered MP") &&
      searchUnRegData.isUsedForUseEffect != "openSearch"
    ) {
      makeUnRegisterMediaDataUrl();
    }
  }, [searchUnRegData.isUsedForUseEffect]);

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
    console.log("endPoint thsi is ", endPoint);
  };

  const btnOpenModelType = (state, id) => {
    switch (state) {
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
          // setDownLoadModal(true);
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
          // btnConnectDisconnect(id);
        }
        break;
      default:
        break;
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          padding: 5,
        }}
      >
        <View key={item} style={Styles.itemContainer}>
          <Ionicons
            name={
              index == currentSection
                ? "checkmark-circle"
                : "checkmark-circle-outline"
            }
            size={25}
            color={
              index == currentSection
                ? themeColor.darkGreen
                : themeColor.textInactive
            }
          />
          <AppText
            style={[
              Styles.optionText,
              index != currentSection && {
                color: themeColor.unselectedText,
              },
            ]}
          >
            {item}
          </AppText>
        </View>
      </View>
    );
  };

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const addButton = () => (
    <ThemedButton
      title="GET"
      onClick={() => {
        setModal(true);
      }}
      textStyle={{
        fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
      }}
    />
  );

  const btnValidateForm = () => {
    const {
      mpIdentity,
      mpName,
      macAddress,
      mpOsType,
      deviceGroupId,
      deviceLocation,
      licenceCode,
    } = state;
    setError((prev) => {
      return {
        ...prev,
        mpIdentity: null,
        mpName: null,
        macAddress: null,
        mpOsType: null,
        deviceGroupId: null,
        deviceLocation: null,
        licenseCode: null,
      };
    });
    let hasError = false;
    if (!mpIdentity) {
      setError((prev) => {
        return { ...prev, mpIdentity: "Please Enter Media Player Identifier" };
      });
      hasError = true;
    }
    if (!mpName) {
      setError((prev) => {
        return { ...prev, mpName: "Please Enter Media Player Name" };
      });
      hasError = true;
    }
    if (!deviceLocation) {
      setError((prev) => {
        return { ...prev, deviceLocation: "Please Select Location" };
      });
      hasError = true;
    }
    if (!licenceCode) {
      setError((prev) => {
        return { ...prev, licenceCode: "Please enter License Code" };
      });
      hasError = true;
    }
    if (!mpOsType) {
      setError((prev) => {
        return { ...prev, mpOsType: "Please Select OS Type" };
      });
      hasError = true;
    }
    if (!macAddress) {
      setError((prev) => {
        return { ...prev, macAddress: "Please Enter Mac Address" };
      });
      hasError = true;
    }

    if (hasError) {
      // console.log("hasError", hasError);
      return false;
    }

    let postData = {
      clientGeneratedDeviceIdentifier: mpIdentity,
      deviceName: mpName,
      deviceGroupId: deviceGroupId ? deviceGroupId : "",
      locationId: deviceLocation?.locationId,
      deviceOs: mpOsType,
      licenceCode: licenceCode,
      deviceEthernetMacAddress: "",
      deviceWifiMacAddress: macAddress,
      oldDeviceId: null,
      qmsBranchId: null,
      qmsDeviceCounterId: null,
      unregisteredDeviceId: null,
    };
    // console.log("postData", postData);
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("success add device", response);
      setIsLoading(false);
      if (response?.code === 200) {
        setState({ ...state, addedResult: response?.result });
        if (response?.result?.panels?.length > 0) {
          let p = [
            {
              panelId: response?.result?.panels[0].panelId,
              panelIp: response?.result?.panels[0].panelIp,
              panelName: response?.result?.panels[0].panelName,
              panelSerialNumber: response?.result?.panels[0].panelSerialNumber,
              panelControl: response?.result?.panels[0].panelControl,
            },
          ];
          setPanelArr([...p]);
        }
        setCurrentSection(currentSection + 1);
      }
      else {
        if (response?.result?.length > 0) {
          alert(response?.result[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };

    const failure = (error) => {
      setIsLoading(false);
      console.log(
        error.message,
        "error add device 517---",
        error.response.data
      );
      if (error?.response?.data?.result?.length > 0) {
        if (error?.response?.data?.result[0].field == "locationId") {
          Alert.alert("Error", "Please enter location.");
        } else {
          Alert.alert(
            "Error",error?.response?.data?.result[0]?.message
          );
        }
      } else if (error?.response?.data?.message) {
        Alert.alert("Error", error?.response?.data?.message);
      } else if (error?.data?.length > 0) {
        Alert.alert("Error", error?.data[0]?.message);
      } else {
        Alert.alert("Error", error.response.data.error);
      }
    };

    if (state.addedResult) {
      let params = {
        deviceId: state.addedResult.deviceId,
        postData: postData,
      };
      deviceManagerService.editDevice(params, succussCallBack, failure);
    } else {
      AddDevicefun(postData, succussCallBack, failure);
    }
  };
  // End step:1================================================
  // step2================================================
  const [panelArr, setPanelArr] = useState([]);
  const [ratioID, setRatioId] = useState(null);
  const addPanels = () => {
    let p = [
      {
        panelId: null,
        panelIp: null,
        panelName: null,
        panelSerialNumber: null,
        panelControl: "RJ45",
      },
    ];
    setPanelArr([...panelArr, ...p]);
  };
  const removePanel = (index) => {
    let pData = [...panelArr];
    pData.splice(index, 1);
    setPanelArr([...pData]);
    // console.log('pData',pData)
  };

  const onChangeInput = (type, index, value) => {
    let pData = [...panelArr];
    switch (type) {
      case "Name":
        {
          pData[index].panelName = value;
          setPanelArr([...pData]);
        }
        break;
      case "serial_number":
        {
          pData[index].panelSerialNumber = value;
          setPanelArr([...pData]);
        }
        break;
      case "IP_address":
        {
          pData[index].panelIp = value;
          setPanelArr([...pData]);
        }
        break;
      case "Panel_Control":
        {
          pData[index].panelControl = value;
          setPanelArr([...pData]);
        }
        break;
      default:
        break;
    }
    // console.log('pDatapData',pData)
  };

  const btnAddPanelDetails = async () => {
    const pData = [...panelArr];
    let hasError = false;
    if (!ratioID) {
      alert("Please select aspect ratio");
      return false;
    }
    for (let index = 0; index < pData.length; index++) {
      // const element = array[index];
      if (pData[index].panelName == "" || pData[index].panelControl == "") {
        hasError = true;
        alert("Please fill all required fields");
        break;
      }
    }
    if (hasError) return false;
    let postData = {
      deviceId: state.addedResult.deviceId,
      aspectRatioId: ratioID,
      panels: pData,
    };

    // console.log('postData', postData);
    setIsLoading(true);
    const succussCallBack = async (response) => {
      // console.log("success add device", response);
      setIsLoading(false);
      if (response?.result?.length > 0) {
        Alert.alert("Info!", "Device added successfully", [
          {
            text: "Ok",
            onPress: () => {
              navigation.navigate(NAVIGATION_CONSTANTS.VIEW_ALL_DEVICES);
            },
          },
        ]);
        setCurrentSection(0);
        // navigation.goBack();
      } else {
        if (response?.result?.length > 0) {
          alert(response?.result[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("error add device--->", error?.message);
      if (error?.response?.data?.result?.length > 0) {
        alert(error?.response?.data?.result[0]?.message);
      } else if (error?.response?.data?.message) {
        alert(error?.response?.data?.message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    deviceManagerService.addPanelsToDevice(
      postData,
      succussCallBack,
      failureCallBack
    );
  };
  // End step2================================================
  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'margin'}
      style={{flex: 1,marginBottom:(Platform.OS === 'ios' && isKeyboardOpen) ? 100 : 5 ,}}
    >
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title={"Register New Device"}
              onClickIcon={() => {
                if (currentSection == 1) {
                  setCurrentSection(0);
                } else {
                  navigation.goBack();
                }
              }}
            />
          </View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {
              currentSection == 0 && (
                <>
                  {authorization.includes(PREVILAGES.DEVICE.ADD_DEVICE) && (
                    <ThemedButton
                      onClick={() => {
                        setCurrentSection(1);
                      }}
                      containerStyle={[
                        Styles.themeContainer1,
                        { paddingHorizontal: 5 },
                      ]}
                      title="+Add Media Player"
                    />
                  )}
                </>
              )
              // : (
              //   <>
              //     {authorization.includes(PREVILAGES.DEVICE.DELETE_DEVICE) && (
              //       <ThemedButton
              //         onClick={
              //           () => setCurrentSection(0)
              //           // navigation.navigate(NAVIGATION_CONSTANTS.ADD_MEDIA_PLAYER_GROUP)
              //         }
              //         containerStyle={Styles.themeContainer1}
              //         title="Unregister Device"
              //       />
              //     )}
              //   </>
              // )
            }
            {currentSection == 0 && (
              <ThemedButton
                onClick={() =>
                  navigation.navigate(NAVIGATION_CONSTANTS.REPLACE_DEVICE)
                }
                containerStyle={[
                  Styles.themeContainer1,
                  {
                    width:
                      authorization.includes(PREVILAGES.DEVICE.DELETE_DEVICE) &&
                      authorization.includes(PREVILAGES.DEVICE.ADD_DEVICE)
                        ? "42%"
                        : "98%",
                    paddingHorizontal: 4,
                  },
                ]}
                title="Replace Device"
              />
            )}
          </View>

          <Separator />

          <FlatList
            data={headers}
            renderItem={renderItem}
            horizontal
            style={{
              padding: moderateScale(10),
              backgroundColor: themeColor.white,
            }}
          />
          {currentSection == 0 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>
                UNREGISTER DEVICE DETAILS
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <AppText style={Styles.numLicenseText}>
                  No. of Licenses :{" "}
                  {userInfo
                    ? licenceDetails?.usedLicense + licenceDetails?.availableLicense
                    : 0}
                </AppText>
                <ThemedText
                  containerStyle={{
                    backgroundColor: themeColor.draftYellowBack,
                    alignSelf: "center",
                  }}
                  textStyles={{
                    color: themeColor.draftYellow,
                  }}
                  title={`Used: ${userInfo&&licenceDetails?.usedLicense ? licenceDetails?.usedLicense : 0}`}
                />
                <ThemedText
                  containerStyle={{
                    backgroundColor: themeColor.pubGreenBack,
                    alignSelf: "center",
                  }}
                  textStyles={{
                    color: themeColor.pubGreen,
                  }}
                  title={`Available: ${
                    userInfo&&licenceDetails?.availableLicense ? licenceDetails?.availableLicense : 0
                  }`}
                />
              </View>
              <Separator />

              <UnRegDeviceListBody
                navigation={navigation}
                dataList={unRgMediaData}
                selectedData={selectedData}
                setSelectedData={setSelectedData}
                searchData={searchUnRegData}
                setSearchData={setSearchUnRegData}
                deviceGroupArr={deviceGroupArr}
                selectedMP={selectedMP}
                headers={headers}
                makeRegisterMediaDataUrl={makeUnRegisterMediaDataUrl}
                btnOpenModelType={btnOpenModelType}
              />
            </View>
          )}
          {currentSection === 1 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>
                Add Device Details
              </AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <AppText style={Styles.numLicenseText}>
                  No. of Licenses :{" "}
                  {userInfo&&licenceDetails?.usedLicense&&licenceDetails?.availableLicense
                    ? licenceDetails?.usedLicense + licenceDetails?.availableLicense
                    : 0}
                </AppText>
                <ThemedText
                  containerStyle={{
                    backgroundColor: themeColor.draftYellowBack,
                    alignSelf: "center",
                  }}
                  textStyles={{
                    color: themeColor.draftYellow,
                  }}
                  title={`Used: ${userInfo&&licenceDetails?.usedLicense ? licenceDetails?.usedLicense : 0}`}
                />
                <ThemedText
                  containerStyle={{
                    backgroundColor: themeColor.pubGreenBack,
                    alignSelf: "center",
                  }}
                  textStyles={{
                    color: themeColor.pubGreen,
                  }}
                  title={`Available: ${
                    userInfo&&licenceDetails?.availableLicense ? licenceDetails?.availableLicense : 0
                  }`}
                />
              </View>
              <Separator />
              <View style={Styles.bodyRowsContainer}>
                {/* identifier=========== */}
                <AppText
                  style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                >
                  Media Player Identifier *
                </AppText>
                <AppTextInput
                  containerStyle={
                    state.addedResult
                      ? Styles.playerIdentifierDis
                      : Styles.playerIdentifier
                  }
                  value={state.mpIdentity}
                  isEditable={state.addedResult ? false : true}
                  placeHolderText="Media Player Identifier *"
                  placeholderTextColor={themeColor.placeHolder}
                  onChangeText={(txt) => {
                    setState({ ...state, mpIdentity: txt });
                  }}
                  textInputStyle={{
                    fontSize: moderateScale(15),
                  }}
                />
                {error?.mpIdentity ? (
                  <Text style={Styles.errorText}>{error?.mpIdentity}</Text>
                ) : null}
                {/* Media Player Name=========== */}
                <View style={{ marginTop: moderateScale(5) }}>
                  <AppText
                    style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                  >
                    Media Player Name*
                  </AppText>
                  <AppTextInput
                    containerStyle={Styles.playerIdentifier}
                    value={state.mpName}
                    placeHolderText="Media Player Name*"
                    placeholderTextColor={themeColor.placeHolder}
                    onChangeText={(txt) => {
                      setState({ ...state, mpName: txt });
                    }}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                  {error?.mpName ? (
                    <Text style={Styles.errorText}>{error?.mpName}</Text>
                  ) : null}
                </View>
                {/* Mac Address Name=========== */}
                <View style={{ marginTop: moderateScale(5) }}>
                  <AppText
                    style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                  >
                    Mac Address*
                  </AppText>
                  <AppTextInput
                    containerStyle={Styles.playerIdentifier}
                    value={state.macAddress}
                    placeHolderText="Mac Address"
                    placeholderTextColor={themeColor.placeHolder}
                    onChangeText={(txt) => {
                      setState({ ...state, macAddress: txt });
                    }}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                  {error?.macAddress ? (
                    <Text style={Styles.errorText}>{error?.macAddress}</Text>
                  ) : null}
                </View>
                {/* os type========= */}
                <View style={{ marginTop: moderateScale(5) }}>
                  <AppText
                    style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                  >
                    OS*
                  </AppText>
                  <CampaignDropDown
                    containerStyle={
                      state.addedResult ? Styles.dropDownDis : null
                    }
                    isDisabled={state.addedResult ? true : false}
                    dataList={[
                      { label: "ANDROID", value: "ANDROID" },
                      { label: "WINDOWS", value: "WINDOWS" },
                      { label: "ANDROID_TV", value: "ANDROID_TV" },
                    ]}
                    placeHolderText="Select OS Type"
                    onChange={(item) => {
                      setState({ ...state, mpOsType: item.value });
                    }}
                    value={state?.mpOsType}
                  />
                  {error?.mpOsType ? (
                    <Text style={Styles.errorText}>{error?.mpOsType}</Text>
                  ) : null}
                </View>
                {/* device group=====  */}
                <View style={{ marginTop: moderateScale(5) }}>
                  <AppText
                    style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                  >
                    Device Group
                  </AppText>
                  <CampaignDropDown
                    dataList={state.deviceGroupList}
                    placeHolderText="Select Device group"
                    onChange={(item) => {
                      setState({ ...state, deviceGroupId: item.value });
                    }}
                    value={state?.deviceGroupId}
                  />
                </View>
                {/* Location==================== */}
                <View style={{ marginTop: moderateScale(5) }}>
                 
                  {state.addedResult ? (
                    <CommonTitleAndText
                      title="Location*"
                      text={state?.deviceLocation?.locationName}
                      containerStyle={{ backgroundColor: "#D9DAE5" }}
                      // RightButton={addButton}
                    />
                  ) : (
                    <CommonTitleAndText
                      title="Location*"
                      text={state?.deviceLocation?.locationName}
                      isButton
                      RightButton={addButton}
                    />
                  )}

                  {error?.deviceLocation ? (
                    <Text style={Styles.errorText}>
                      {error?.deviceLocation}
                    </Text>
                  ) : null}
                </View>
                {/* Media Player Name=========== */}
                <View style={{ marginTop: moderateScale(5) }}>
                  <AppText
                      style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                    >
                      License Code*
                  </AppText>
                  <AppTextInput
                    value={state.licenceCode}
                    containerStyle={
                      state.addedResult
                        ? Styles.playerIdentifierDis
                        : Styles.playerIdentifier
                    }
                    isEditable={state.addedResult ? false : true}
                    placeHolderText="License Code*"
                    placeholderTextColor={themeColor.placeHolder}
                    onChangeText={(txt) => {
                      setState({ ...state, licenceCode: txt });
                    }}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                  {error?.licenceCode ? (
                    <Text style={Styles.errorText}>{error?.licenceCode}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          )}
          {currentSection === 2 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>ADD PANEL DETAILS</AppText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                <AppText style={Styles.numLicenseText}>
                  No. of Licenses :{" "}
                  {userInfo
                    ? licenceDetails?.usedLicense + licenceDetails?.availableLicense
                    : 0}
                </AppText>
                <ThemedText
                  containerStyle={{
                    backgroundColor: themeColor.draftYellowBack,
                    alignSelf: "center",
                  }}
                  textStyles={{
                    color: themeColor.draftYellow,
                  }}
                  title={`Used: ${userInfo ? licenceDetails?.usedLicense : 0}`}
                />
                <ThemedText
                  containerStyle={{
                    backgroundColor: themeColor.pubGreenBack,
                    alignSelf: "center",
                  }}
                  textStyles={{
                    color: themeColor.pubGreen,
                  }}
                  title={`Available: ${
                    userInfo ? licenceDetails?.availableLicense : 0
                  }`}
                />
              </View>
              <Separator />
              <View style={Styles.bodyRowsContainer}>
              <AppText
                      style={{ color: "black", paddingLeft: 10, fontSize: 13 }}
                    >
                      Aspect Ratio*
                  </AppText>
                <CampaignDropDown
                  dataList={resolutionDropdownData}
                  placeHolderText="Select Ratio"
                  onChange={(item) => {
                    setRatioId(item.value);
                  }}
                  value={ratioID}
                />
                <AddNewButton
                  onClick={() => {
                    addPanels();
                  }}
                  title="Panel"
                  containerStyle={{
                    borderColor: "white",
                  }}
                  textStyle={{
                    color: "black",
                  }}
                  addStyle={{
                    alignSelf: "center",
                  }}
                  iconStyle={{
                    borderWidth: 1,
                    borderColor: themeColor.themeColor,
                  }}
                />
                {panelArr &&
                  panelArr.map((panel, pIndex) => {
                    return (
                      <View key={pIndex + "pIndex"} k style={{ marginTop: 10 }}>
                        {pIndex != 0 && <Separator />}
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: moderateScale(6),
                          }}
                        >
                          <AppTextInput
                            containerStyle={Styles.playerIdentifierHalfWidth}
                            value={panel.panelName}
                            placeHolderText="Panel Name*"
                            placeholderTextColor={themeColor.placeHolder}
                            onChangeText={(txt) => {
                              onChangeInput("Name", pIndex, txt);
                            }}
                            textInputStyle={{
                              fontSize: moderateScale(15),
                            }}
                          />
                          <AppTextInput
                            containerStyle={Styles.playerIdentifierHalfWidth}
                            value={panel.panelSerialNumber}
                            placeHolderText="Serial Number"
                            placeholderTextColor={themeColor.placeHolder}
                            onChangeText={(txt) => {
                              onChangeInput("serial_number", pIndex, txt);
                            }}
                            textInputStyle={{
                              fontSize: moderateScale(15),
                            }}
                          />
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            marginTop: moderateScale(6),
                          }}
                        >
                          <AppTextInput
                            containerStyle={Styles.playerIdentifierHalfWidth}
                            value={panel.panelIp}
                            placeHolderText="IP Address"
                            placeholderTextColor={themeColor.placeHolder}
                            onChangeText={(txt) => {
                              onChangeInput("IP_address", pIndex, txt);
                            }}
                            textInputStyle={{
                              fontSize: moderateScale(15),
                            }}
                          />
                          <View style={{ width: "48%" }}>
                            <CampaignDropDown
                              dataList={cantrolPenalsList}
                              placeHolderText="Panel Control*"
                              onChange={(item) => {
                                onChangeInput(
                                  "Panel_Control",
                                  pIndex,
                                  item.value
                                );
                              }}
                              value={panel?.panelControl}
                            />
                          </View>
                        </View>
                        {pIndex != 0 && (
                          <Text
                            onPress={() => {
                              removePanel(pIndex);
                            }}
                            style={{
                              color: "red",
                              fontSize: 18,
                              textAlign: "right",
                              marginRight: 4,
                              marginTop: 2,
                            }}
                          >
                            Remove
                          </Text>
                        )}
                      </View>
                    );
                  })}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <SelectLocationModal
        visible={modal}
        setModal={setModal}
        setIsLoading={setIsLoading}
        locationSelected={locationSelected}
        setLocationSelected={setLocationSelected}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        state={state}
        setname={setname}
        name={name}
        setState={setState}
        locationData1={locationData1}
      />

      {currentSection != 0 && (
        <ActionContainer
          isContinue
          continueText={currentSection === 0 ? "Save & Next" : "Save & Submit"}
          continueStyle={Styles.actionStyle}
          cancelStyle={Styles.actionStyle}
          onPressSave={() => {
            if (currentSection === 1) {
              btnValidateForm();
              // setModal(true);
            } else if (currentSection == 2) {
              btnAddPanelDetails();
            }
          }}
          onPressCancel={() => {
            if (currentSection === 0) {
              navigation.goBack();
            } else {
              setCurrentSection(currentSection - 1);
            }
          }}
        />
      )}
    </View>
  );
};

export default RegisterNewDevice;

