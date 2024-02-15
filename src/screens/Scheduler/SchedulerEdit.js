import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,KeyboardAvoidingView,Platform,
  Image,Keyboard,
  Pressable,
  ScrollView,
  Text,TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import SelectCampaignModal from '../../Components/Organisms/CMS/Scheduler/selectCampaignModal';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AppIcon from "../../Assets/Images/PNG/application.png";
import DeleteIcon from "../../Assets/Images/PNG/delete.png";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import AppText from "../../Components/Atoms/CustomText";
import CustomIconText from "../../Components/Atoms/IconText";
import SearchBox from "../../Components/Atoms/SearchBox";
import Separator from "../../Components/Atoms/Separator";
import SubHeaderText from "../../Components/Atoms/SubHeaderText";
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CommonStyles from "./style";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import { headers, CampaignData, ListHeaders, campaignData } from "./contants";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import {
  SchedulerManagerService,
  getDeviceByLocation,
  getDeviceGroupByLocation,
  getLocationList,
} from "./SchedulerApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import Loader from "../../Components/Organisms/CMS/Loader";
import ViewImageModal from '../../Components/Atoms/ViewImageModal';
import LocationsListForPlanogram from "../../Components/Organisms/Dashboard/LocationsListForPlanogram";
import moment from "moment";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { all } from "axios";
const SchedulerEdit = ({ navigation, route }) => {
  const [searchLocation,setSearchLocation]=useState("")
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  const { planogramItem } = route.params;
  const [imageView, setImageView] = useState(false);
  const [showpublishbtn, setshowpublishbtn] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [searchType, setSearchType] = useState("location");
  const [campaignType, setCampaignType] = useState(0);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(
    planogramItem.startDate ? new Date(planogramItem.startDate) : null
  );
 
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [endDate, setEndDate] = useState(
    planogramItem.endDate ? new Date(planogramItem.endDate) : null
  );
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [availablesss, setavailablesss] = useState(0);
  const [deviceab, setdeviceab] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isTimePickerVisible1, setTimePickerVisible1] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [ratioId, setRatioId] = useState(planogramItem.aspectRatioId);
  const [ratiovalue, setRatiovalue] = useState(planogramItem.aspectRatioId);
  const [isLoading, setIsLoading] = useState(false);
  const [responseValue, setResponseValue] = useState(null);
  const [getlistCampaign, setGetListCampaign] = useState([]);
  const [getSelectedCamapign, setGetSelectedCampaign] = useState([]);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [occurance, setoccurance] = useState("");
  const [priority, setpriority] = useState("");
  const [selectedImageIdsString, setSelectedImageIdsString] = useState([]);
  const [showGroupOrMedia, setShowGroupOrMedia] = useState("group");
  const [title, setTitle] = useState(planogramItem.title);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [dl_min_date, setDLMinDate] = useState(new Date());
  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("");

  const onComplete=()=>{
    setSuccessModal(false)
  }

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

    // Cleanup listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [state, setState] = useState({
    selectedDeviceGroups: [],
    selectedDevice: [],
    deviceLogicData: null,
    ratioId: null,
    planogramId: planogramItem?.planogramId,
    planogramData: null,
    campaignString: [],
    campaigns: [],
    selectedCampaign: [],
    selectedCampaignString: [],
    pCamp: [],
    pCampStr: [],
    planogramPriorityList:[],
  });
  // const [filterData, setFilterData] = useState({
  //   times: "",
  //   proirity: "",
  // });
  const [modal, setModal] = useState();
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  const [locationData,setLocationData]=useState(locationData1)
  const deviceGroupData1 = useSelector(
    (state) => state.CommonReducer.deviceGroupData
  );

  const [deviceGroupData, setdeviceGroupData] = useState(deviceGroupData1);

  const deviceData1 = useSelector((state) => state.CommonReducer.deviceData);
  const [deviceData, setdeviceData] = useState(deviceData1);
 const scrollRef = useRef(null);

  const searchLocationApi=async(searchLoc)=>{
      const slugId = await getStorageForKey("slugId");
      setIsLoading(true);

      const successCallBack = async (response) => {
        setIsLoading(false);
        setLocationData(response.data)
      };

      const errorCallBack = (error) => {
        setIsLoading(false);
        if(error?.message){
          Alert.alert(error.message);
        }
      };

    SchedulerManagerService.fetchLocationListSearch(
      { slugId,searchLoc },
      successCallBack,
      errorCallBack
    );
}
 
 const [addcampvalue, setaddcampvalue] = useState([]);
  useEffect(() => {
    scrollRef.current._listRef._scrollRef.scrollTo({
      x: 200 * currentSection,
      animated: true,
    });
  }, [currentSection]);

  useEffect(() => {
    getDevicesAndDevicesGroup(selectedLocations);
  }, [selectedLocations]);

  useEffect(() => {
    setdeviceData(deviceData1);
  }, [deviceData1]);

  useEffect(() => {
    setdeviceGroupData(deviceGroupData1);
  }, [deviceGroupData1]);


  useEffect(() => {
    if (planogramItem.startTime != null && planogramItem.endTime != null) {
      const stime = planogramItem.startDate + " " + planogramItem.startTime;
      const etime123 = planogramItem.startDate + " " + planogramItem.endTime;
      setStartTime(new Date(stime));
      setEndTime(new Date(etime123));
    }
    getLocationList();
    if (planogramItem?.planogramId) {
      getPlanogramDetails(planogramItem?.planogramId);
      getCampaigns((planogramItem?.planogramId));
    }
  }, [planogramItem]);

  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );

  let getDevicesAndDevicesGroup = async (selectedLocations) => {
    setState({ ...state, selectedDeviceGroups: [], selectedDevice: [] });
    let params = {
      ids: selectedLocations,
    };
    getDeviceGroupByLocation(params, setIsLoading);
    getDeviceByLocation(params, setIsLoading);
  };
  const [searchtext, setsearchtext] = useState('');

  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
    ratioId: resolution.aspectRatioId,
    planogramTitle: resolution.campaignTitle,
    id: resolution.campaignId,
  }));

  

  const handleDropdownChange = (item) => {
    setRatioId(item.value);
    setRatiovalue(item.label)
  };

  const handleDateChange = (date) => {
    setStartDate(date);
    setDatePickerVisible(false);
  };

  const handleDateChange1 = (date) => {
    setEndDate(date);
    setDatePickerVisible1(false);
  };

  const handleTimeChange = (date) => {

    setStartTime(date);
    setTimePickerVisible(false);
  };

  const getDateFormat = (date, format) => {
    let formated_date = '';
    if (format == 'DD-MM-YYYY') {
      formated_date = (
        (date.getDate().toString().length <= 1
          ? '0' + date.getDate()
          : date.getDate()) +
        '-' +
        ((date.getMonth() + 1).toString().length <= 1
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '-' +
        date.getFullYear()
      ).toString();
    } else if (format == 'YYYY-MM-DD') {
      formated_date = (
        date.getFullYear() +
        '-' +
        ((date.getMonth() + 1).toString().length <= 1
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        '-' +
        (date.getDate().toString().length <= 1
          ? '0' + date.getDate()
          : date.getDate())
      ).toString();
    }
    return formated_date;
  };
  
  const handleTimeChange1 = (date) => {
    setEndTime(date);
    setTimePickerVisible1(false);
  };

  const getIcon = (checked) => (
    <>
      {checked ? (
        <Ionicons name="checkbox" size={25} color={themeColor.themeColor} />
      ) : (
        <MaterialIcons
          name="check-box-outline-blank"
          color={themeColor.themeColor}
          size={25}
        />
      )}
    </>
  );

  const renderItem = ({ item, index }) => {
    return (
      <View key={item} style={Styles.itemContainer}>
        <Ionicons
          name={
            index <= currentSection
              ? "checkmark-circle"
              : "checkmark-circle-outline"
          }
          size={25}
          color={
            index <= currentSection
              ? themeColor.darkGreen
              : themeColor.textInactive
          }
        />
        <AppText
          style={[
            Styles.optionText,
            index > currentSection && {
              color: themeColor.unselectedText,
            },
          ]}
        >
          {item}
        </AppText>
      </View>
    );
  };

  const getDeviceLogic = async (planogramId) => {
    setState((prev) => {
      return { ...prev, planogramId: planogramId };
    });
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      planogramID: planogramId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      console.log('---device logic---',response)
      if (response.code == 200) {
        setState({
          ...state,
          deviceLogicData: response?.data,
          planogramId: planogramId,
        });
      } else {
        if (response?.data?.length > 0) {
          alert(response?.data[0]?.message);
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
      console.log("get DeviceLogic succuss", response);
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("get DeviceLogic error", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    SchedulerManagerService.fetchDeviceLogicList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const renderAction = () => {
    return (
      <View style={Styles.actionView}>
        <View style={Styles.iconBackView}>
          <Image source={DeleteIcon} style={Styles.iconStyle} />
        </View>
      </View>
    );
  };

  const renderCampaignHeader = () => {
    return (
      <View
        style={{
          width: width * 1.7,
          height: 100,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {ListHeaders.map((item, index) => (
          <View
            key={item + index}
            style={[Styles.headerScrollContainer(index)]}
          >
            <View style={Styles.headerThemeContainer}>
              <AppText style={Styles.listBoldText}>{item}</AppText>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const handlePlonogram = (satus) => {
    console.log(satus)
    const formattedTime1 = moment(startTime.toLocaleTimeString(), 'hh:mm:ss A');
    const formattedTime2 = moment(new Date().toLocaleTimeString(), 'hh:mm:ss A');
   

    if (
      !title ||
      !ratioId ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime
    ) {
      Alert.alert("Validation Error", "Please fill in all fields.");
    }

      
    else if(startDate.toLocaleDateString() == new Date().toLocaleDateString() && formattedTime1.isBefore(formattedTime2))
    {
        Alert.alert( "Validation Error","Start Time should be greater than current time");
    }
    else if (startDate.toLocaleDateString() == endDate.toLocaleDateString() && startTime >= endTime) {
        Alert.alert( "Validation Error","Start time should be earlier than end time");
    }
   
    else if (startDate.toLocaleDateString() > endDate.toLocaleDateString()) {
      Alert.alert( "Validation Error","Start date should be earlier than end date");
    }
   else {
      EditSubmitPress(satus);
    }
  };

  const EditSubmitPress = async (satus) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      planogramId: planogramItem.planogramId,
      data: {
        state: 'DRAFT',
        title: title,
        aspectRatioId: ratioId,
        startTime: startTime
          .toLocaleString("en-US", { hour12: false })
          .split(",")[1]
          .trim(),
        endTime: endTime
          .toLocaleString("en-US", { hour12: false })
          .split(",")[1]
          .trim(),
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
       
      },
    };

    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if(response?.status == 'SUCCESS')
      {
       Alert.alert('Success!', response.message, [
         {text: 'Okay', onPress: () => {
           if(satus == 'DRAFT')
           {
              navigation.goBack();
           }
           else
           {
             setState((prev) => {
               return { ...prev, planogramId: response?.result?.planogramId };
             });
             setState((prev) => {
               return { ...prev, planogramData: response?.result };
             }); 

             setavailablesss(response?.result?.availableSlots)
            // getDeviceLogic(response?.data?.planogramId);
           }
           setCurrentSection(1);
         }},
       ]);
      }
      else if(response?.status == 'ERROR')
      {
        
       Alert.alert('Error!', response.message, [
         {text: 'Okay', onPress: () => {
           
         }},
       ]);
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false);
      
      setIsLoading(false);
      if(error.response.data.message=="Campaign added! Can't modified."){
        console.log("prkerr",error.response.data)
        setCurrentSection(2)
        planogramCampaignStringList();
      }
      if (error?.data?.length > 0) {
        alert("Error","Campaign added! Can't modified.");
      } else {
        // alert(error?.message);
        Alert.alert("Error","Campaign added! Can't modified.");
      }
    };
    SchedulerManagerService.editschedduler(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  useEffect(() => {
   
    getResolutionData(setIsLoading);
  }, []);

  useEffect(() => {
    const foundItem = resolutionDropdownData.find(item => item.ratioId === ratioId);
    setRatiovalue(foundItem?.label)
  }, [resolutionDropdownData]);



  
  const setSelectedCmpAndCmpStr = (layoutAndLayoutStrings) => {
    let cmp = [];
    let cmpStr = [];
    
    if (layoutAndLayoutStrings && layoutAndLayoutStrings.length > 0) {
      layoutAndLayoutStrings.map((camp) => {
        if (camp.hasOwnProperty("campaignId")) {
          cmp.push(camp.campaignId);
        }
        if (camp.hasOwnProperty("campaignStringId")) {
          cmpStr.push(camp.campaignStringId);
        }
      });
      setState({
        ...state,
        selectedCampaign: cmp,
        selectedCampaignString: cmpStr,
      });
    }
  };

  const getPlanogramDetails = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      planogramId: id,
    };
    const succussCallBack = async (response) => {
     if (response && response.result) {
        setState({ ...state, planogramData: response.result });

        setdeviceab(response?.result?.deviceIds?.length)
        setavailablesss(response?.result?.availableSlots)
        if(response?.result?.deviceIds.length > 0)
        {
          setState({ ...state, selectedDevice: response.result.deviceIds });
       }
        if(response?.result?.locationIds?.length > 0)
        {
          setSelectedLocations(response.result.locationIds);
         
        }
        if(response?.result?.deviceGroupIds?.length > 0)
        {
          setState({ ...state, selectedDeviceGroups: deviceGroupIds });
          
        
        }
      }
    };

    const failureCallBack = (error) => {
    
      alert(error?.message);
      
    };

    SchedulerManagerService.getPlanogramDetail(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnAddDevice = (id) => {
    if (state?.selectedDevice?.includes(id)) {
      let remainingArr = state.selectedDevice?.filter((item) => item != id);
      setState({
        ...state,
        selectedDevice: [...remainingArr],
      });
    } else {
      setState({
        ...state,
        selectedDevice: [...state.selectedDevice, id],
      });
    }
  };
  const isDeviceCheked = (id) => {
    if (state?.selectedDevice?.includes(id)) {
      return true;
    } else {
      return false;
    }
  };
  const btnAddDeviceGroup = (id) => {
    if (state?.selectedDeviceGroups?.includes(id)) {
      let remainingArr = state.selectedDeviceGroups?.filter(
        (item) => item != id
      );
      setState({
        ...state,
        selectedDeviceGroups: [...remainingArr],
      });
    } else {
      setState({
        ...state,
        selectedDeviceGroups: [...state.selectedDeviceGroups, id],
      });
    }
  };
  const isGroupDeviceCheked = (id) => {
    if (state?.selectedDeviceGroups?.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  const btnSubmitDeviceGroup = async () => {
  if (state.selectedDeviceGroups.length <= 0  && state.selectedDevice.length<=0) {
      alert("Please Select Device or Device group.");
      return false;
    }
    let device_logic = "";
    let concatenatedString = "";
      if(state.selectedDevice.length > 0){
        concatenatedString = state.selectedDevice.map((item, index) => {
          if (index === state.selectedDevice.length - 1) {
            return `deviceIds=${item}`;
          } else {
            return `deviceIds=${item}&`;
          }
        }).join("");

      device_logic = "DEVICES"
    
    }else if (state.selectedDeviceGroups.length > 0 && state.selectedDevice.length > 0) {
      let concatenatedString2 = state.selectedDevice.map((item, index) => {
        if (index === state.selectedDevice.length - 1) {
          return `deviceIds=${item}`;
        } else {
          return `deviceIds=${item}&`;
        }
      }).join("");
      let concatenatedString1 = state.selectedDeviceGroups.map((item, index) => {
        if (index === state.selectedDeviceGroups.length - 1) {
          return `deviceGroupIds=${item}`;
        } else {
          return `deviceGroupIds=${item}&`;
        }
      }).join("");
      concatenatedString = concatenatedString2 + concatenatedString1;
      device_logic = "LOCATIONS_AND_DEVICE_GROUPS"
     
    } else if (state.selectedDeviceGroups.length > 0) {

      concatenatedString = state.selectedDeviceGroups.map((item, index) => {
        if (index === state.selectedDeviceGroups.length - 1) {
          return `deviceGroupIds=${item}`;
        } else {
          return `deviceGroupIds=${item}&`;
        }
      }).join("");
      device_logic = "DEVICE_GROUPS"
    } 
   
    

    let slugId = await getStorageForKey("slugId");
    let postData1 = {
      slugId:slugId,
      planogramId: state.planogramId,
      postData: concatenatedString,
    };

    setIsLoading(true);

    const succussCallBack = async (response) => {
     
      setIsLoading(false);
      if (response?.status == "SUCCESS") {
        setSelectedCmpAndCmpStr(state.planogramData?.layoutAndLayoutStrings);
        planogramCampaignStringList();
       
        if (currentSection !== 3) {
          setCurrentSection(currentSection + 1);
        }
      } else {
          alert(response?.message);
      }
    };
    const failureCallBack = (error) => {
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

   SchedulerManagerService.updateDeviceLogicPlanogram(
      postData1,
      succussCallBack,
      failureCallBack
    );
  };


  const resetLocationAndGroupDevice = () => {
    setState({ ...state, selectedDeviceGroups: [] });
    setSelectedLocations([]);
  };
  //  3rd stepp=============
  const renderCampaign = ({ item, index }) => {
    if (campaignType == 0) {
      return (
        <Pressable
          onPress={() => {
            addCampaign(item, index);
          }}
          style={isCampaignCheckde(item.campaignId)? Styles.campaignStrContainerActive : Styles.campaignStrContainer}
        >
          <AppText style={Styles.dateText}>{item.campaignTitle}</AppText>
          <AppText style={Styles.dateText}>
            {`Duration:  ${item.duration}s`}
          </AppText>
        </Pressable>
      );
    } else {
      return (
        <Pressable
          onPress={() => {
            addCampaignString(item, index);
          }}
          style={isCampaignStringCheckde(item.campaignStringId) ? Styles.campaignStrContainerActive : Styles.campaignStrContainer} 
        >
          <AppText style={Styles.dateText}>{item.campaignTitle}</AppText>
          <AppText style={Styles.dateText}>
            {`Duration:  ${item.displayDurationInSeconds}s`}
          </AppText>
        </Pressable>
      );
    }
  };
  const planogramCampaignList = async () => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response && response.data) {
        setState((prev) => {
          return { ...prev, campaigns: response.data };
        });
      }
      setIsLoading(false);
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error.data[0].message);
      } else {
        alert(error.message);
      }
    };

    SchedulerManagerService.getCampaignByAspectRatio(
      ratioId,
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const planogramCampaignStringList = async () => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      palamid: state.planogramId,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
    
      if (response && response.result) {
        console.log("trt",JSON.stringify(response.result))
        setState({...state,campaignString: response.result})
        setState((prev) => {
          return { ...prev, campaignString: response.result };
        });
      }
      setIsLoading(false);
    };

    const failureCallBack = (error) => {
    
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    console.log('CampaignStringList==>', params)
    SchedulerManagerService.getCampaignStringByAspectRatio(
      params,
      succussCallBack,
      failureCallBack
    );
  };


  const getCampaigns = async (id) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      palamid: id,
    };
    const succussCallBack = async (response) => {
      if (response.status == 'SUCCESS' &&  response?.result.length > 0) {
        setshowpublishbtn(true)
        setCurrentSection(2)
        planogramCampaignStringList();
      
      }
      setIsLoading(false);
    };
    const failureCallBack = (error) => {
      setIsLoading(false)
    };
    setIsLoading(true)
    SchedulerManagerService.getCampaigns(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const addCampaign = (item, index) => {
    if (state?.selectedCampaign?.includes(item.campaignId)) {
      let remainingArr = state?.selectedCampaign?.filter(
        (fitem) => fitem != item.campaignId
      );
      setState({
        ...state,
        selectedCampaign: [...remainingArr],
      });
    } else {
      setState({
        ...state,
        selectedCampaign: [...state.selectedCampaign, item.campaignId],
      });
      
    }
  };
  const addCampaignString = (item, index) => {
    if (state?.selectedCampaignString?.includes(item.campaignStringId)) {
      let remainingArr = state?.selectedCampaignString?.filter(
        (fitem) => fitem != item.campaignStringId
      );
      setState({
        ...state,
        selectedCampaignString: [...remainingArr],
      });
    } else {
      setState({
        ...state,
        selectedCampaignString: [
          ...state.selectedCampaignString,
          item.campaignStringId,
        ],
      });
    }
  };
  const isCampaignCheckde = (id) => {
    if (state.selectedCampaign.includes(id)) {
      return true;
    }
    return false;
  };
  const isCampaignStringCheckde = (id) => {
    if (state.selectedCampaignString.includes(id)) {
      return true;
    }
    return false;
  };

  const btnSubmitCampainPlanogram = async () => {
    let slugId = await getStorageForKey("slugId");
    let hasError = false;
    if (occurance === ""||occurance<=0) {
      
      if(occurance<=0){
        Alert.alert("Alert","Please enter occurance greater then 0")
      }else{
        alert("Please enter occurrence");
      }
      hasError = true;
    }  
    else if (priority === ""||priority<=0) {
      if(priority<=0){
        Alert.alert("Alert","Please enter priority greater then 0")
       
      }else if(priority === ""){
        alert("Please enter priority");
      console.log("Please enter priority");
      selectedLocations

      }
      
      hasError = true;
    } 

    if(hasError) return false;

    let postData = {
      campaignId:state.selectedCampaign.campaignId,
      planogramId: state.planogramId,
      occurance: occurance,
      startTime: moment(startTime).add(1,"seconds").format("HH:mm:ss"),
      startDate: startDate.toISOString().split("T")[0],
      endTime: endTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      endDate: endDate.toISOString().split("T")[0],
      priority: priority,
    };

    const params = {
      data: postData,
      slugId: slugId,
    };
   
    const succussCallBack = async (response) => {
     console.log("response addcapm sch2",JSON.stringify(response))
    
     if(response?.status == 'SUCCESS')
     {
      setSelectedCampaign(false);
      Alert.alert('Alert!', response.message, [
        {text: 'Okay', onPress: () => {
        
          setaddcampvalue([...addcampvalue, response.result]);
          setshowpublishbtn(true)
          setState({ ...state, selectedCampaign: []});
          setavailablesss(response?.result?.availableSlots)
          setoccurance("");
          setpriority("");
        }},
      ]);

    // publishcomp(response?.result?.slotId);
     }
     else if(response?.status == 'ERROR')
     {
      Alert.alert('Error!', response.message, [
        {text: 'Okay', onPress: () => {
          
        }},
      ]);
     }else if(response.hasOwnProperty("error"))
     {
      Alert.alert('Error!', response.error+","+response.status, [
        {text: 'Okay', onPress: () => {
          
        }},
      ]);
     }
    };
    const failureCallBack = (error) => {
      console.log("sch camp error",JSON.stringify(error))
    Alert.alert("Error",error.response)
    };

    console.log("params==>sche",JSON.stringify(params))
    SchedulerManagerService.createcampiegn(
      params,
      succussCallBack,
      failureCallBack
    );

  };

  // 4th step==================
  const getPlanogramDetailById = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      planogramId: state.planogramId,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("getPlanogramDetailById string------", response);
      setIsLoading(false);
      if (response?.code === 200) {
        if (currentSection !== 3) {
          setCurrentSection(currentSection + 1);
        }
        setState((prev) => {
          return { ...prev, planogramData: response?.data };
        });
        getPlangogramPriority()
        separatCampaigCampaignString(response?.data);
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
      console.log("getPlanogramDetailById error-------------", error);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    SchedulerManagerService.fetchByIdPlanogram(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const renderCampaignList = ({ item, index }) => {
    // if (campaignType == 0) {
      return (
        <View style={Styles.renderContainer}>
          <View style={[Styles.nameView,{ width: "25%" }]}>
            <AppText style={Styles.nameText}>{item.title}</AppText>
          </View>
          <View style={[Styles.nameView, { width: "25%" }]}>
            <AppText style={Styles.nameText}>{`${item.startDate} - ${item.endDate}`}</AppText>
          </View>
          <View style={[Styles.nameView, { width: "25%" }]}>
            <AppText style={Styles.nameText}>{`${item.startTime} - ${item.endTime}`}</AppText>
          </View>
          <View style={[Styles.nameView, { width: "25%" }]}>
            <AppText style={Styles.nameText}>{item.state}</AppText>
          </View>
        </View>
      );
    // } else {
    //   return (
    //     <View style={Styles.renderContainer}>
    //       <View style={Styles.nameView}>
    //         <AppText style={Styles.nameText}>{item.campaignStringName}</AppText>
    //       </View>
    //       <View style={[Styles.nameView, { width: "20%" }]}>
    //         <AppText style={Styles.nameText}>{item.duration}</AppText>
    //       </View>
    //       <View style={[Styles.nameView, { width: "20%" }]}>
    //         <AppText style={Styles.nameText}>-</AppText>
    //         {/* <AppText style={Styles.nameText}>{item.size}</AppText> */}
    //       </View>
    //       {/* {renderAction()} */}
    //     </View>
    //   );
    // }
  };
  const separatCampaigCampaignString = (layout) => {
    let data = layout?.layoutAndLayoutStrings;
    let pCamp = [];
    let pCampStr = [];
    data.map((item) => {
      if (item.hasOwnProperty("campaignId")) {
        pCamp.push(item);
      } else {
        pCampStr.push(item);
      }
    });

    setState((prev) => {
      return { ...prev, pCamp: pCamp, pCampStr: pCampStr };
    });
  };


  const getPlangogramPriority=async()=>{
    let slugId = await getStorageForKey("slugId");
    let params = {
      planogramId: state.planogramId,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("getPlangogramPriority string------", response);
      setIsLoading(false);
      if (response?.code === 200) {
        setState({...state,planogramPriorityList:response?.data})
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
      console.log("getPlangogramPriority error-------------", error);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    SchedulerManagerService.fetchPlangogramPriorityList(
      params,
      succussCallBack,
      failureCallBack
    );
  }


  

 
  
  const btnSubmitPlanogramPriority=async(btnType)=>{
    let slugId = await getStorageForKey("slugId");
    let postData=[]
    state?.planogramPriorityList?.map((plan,pInd)=>{
      postData.push(({
        planogramId:plan.planogramId,
        "priority": pInd+1
      }))
    })
    let params = {
      postData: postData,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("getPlangogramPriority string------", response);
      setIsLoading(false);
      if (response?.code === 200) {
        btnSubmittedStatus(btnType)
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
      console.log("getPlangogramPriority error-------------", error);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    SchedulerManagerService.addPlanogramPriority(
      params,
      succussCallBack,
      failureCallBack
    );
  }


  

 const makeUrlData=async(type)=>{
  const slugId = await getStorageForKey("slugId");
  let endPoint=''
  if(type =="group")
  {
   endPoint = `device-management/api/deviceGroup/planogram?deviceGroupName=${searchtext}`;
  }
  else
  {
   endPoint = `device-management/api/device/planogram?mediaPlayerName=${searchtext}`;
  }
  let params = {
    'endpoint':endPoint,
  }
  const succussCallBack = async (response) => {
    setIsLoading(false);
    if(type =="group")
    {
    setdeviceGroupData(response?.result);
    }
    else
    {
      setdeviceData(response?.result)

    }
  }
  const failureCallBack = (error) => {
    console.log("campaignAddArchiveError", error);
    if (error?.data?.length > 0) {
      alert(error?.data[0]?.message);
    } else {
      alert(error?.message);
    }
    setIsLoading(false);
  };
  
  setIsLoading(true);
  SchedulerManagerService.searchList(
    params,
    succussCallBack,
    failureCallBack
  );

 }

  const btnSubmittedStatus=async(btnType)=>{
    if(btnType=='DRAFT'){
      setSuccessModal(true);
      setSuccessMsg("Scheduler update successfully")
      setTimeout(()=>{navigation.goBack()},300)
      // Alert.alert("Info!", 'Planogram update successfully', [
      //   {
      //     text: "Ok",
      //     onPress: () => {
      //       navigation.goBack();
      //     },
      //   },
      // ]);
      return false
    }

    const slugId = await getStorageForKey("slugId");
    let params = {
      'slugId':slugId,
      'planogramID':state.planogramId
    }
    const succussCallBack = async (response) => {
      console.log('camp response',response);
        setIsLoading(false);
        if (response.code == 200) {
          setSuccessModal(true);
          setSuccessMsg("Scheduler update successfully")
          setTimeout(()=>{navigation.goBack()},300)
          // Alert.alert("Info!", 'Campaign updated successfully', [
          //   {
          //     text: "Ok",
          //     onPress: () => {
          //       navigation.goBack();
          //     },
          //   },
          // ]);
        } else {
          if (response?.data?.length > 0) {
            alert(response?.data[0]?.message);
          } else if(response?.error){
            alert(response?.error);
          }else{
            alert(response?.message);
          }
        }
    }
    const failureCallBack = (error) => {
      console.log("campaignAddArchiveError", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    
    setIsLoading(true);
    SchedulerManagerService.addSubmitStatus(
      params,
      succussCallBack,
      failureCallBack
    );
  }
  // End 4th step==============
  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <ClockHeader />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      {modal ? (
        <SelectCampaignModal
           data = {state.campaignString}
           setindex={(item) => {
           
            setState((prev) => {
              return { ...prev, selectedCampaign: item };
            });
           }}
          
          setCampaign={setSelectedCampaign}
          setModal={setModal}
        />
      ) : null}
       {imageView ? <ViewImageModal details={state.selectedCampaign?.mediaDetail[0]} setModal={setImageView} /> : null}
       <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1,marginBottom:(Platform.OS === 'ios' && isKeyboardOpen) ? 100 : 0 ,}}
    >
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Create New Scheduler"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />

          <FlatList
            data={headers}
            ref={scrollRef}
            renderItem={renderItem}
            horizontal
            style={{
              padding: moderateScale(10),
              backgroundColor: themeColor.white,
            }}
          />

          {currentSection === 0 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>
              Scheduler details
              </AppText>
              <Separator />
              <View style={Styles.bodyRowsContainer}>
                <AppTextInput
                  containerStyle={Styles.eventTitleInput}
                  value={title}
                  placeHolderText="Planogram Event Title *"
                  onChangeText={(text) => setTitle(text)}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={{
                    fontSize: moderateScale(15),
                  }}
                />

                <View style={{ marginVertical: moderateScale(10) }}>
                  <Dropdown
                    style={Styles.dropdown}
                    placeholderStyle={Styles.placeholderStyle}
                    selectedTextStyle={Styles.selectedTextStyle}
                    inputSearchStyle={Styles.inputSearchStyle}
                    iconStyle={Styles.iconStyle}
                    itemTextStyle={{ color: "#000000" }}
                    data={resolutionDropdownData}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={"Aspect Ratio"}
                    searchPlaceholder="Search..."
                    value={ratioId}
                    onChange={handleDropdownChange}
                  />
                </View>
                <CommonTitleAndText
                  title="Start Date*"
                  text={
                    startDate
                    ? getDateFormat(startDate,'DD-MM-YYYY')
                    : "Select Date"
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible(true)}
                />
                <DatePicker
                  modal
                  mode="date"
                  open={isDatePickerVisible}
                  minimumDate={dl_min_date}
                  date={startDate != null ? new Date() : new Date()}
                  onConfirm={handleDateChange}
                  onCancel={() => setDatePickerVisible(false)}
                />
                
                

                <CommonTitleAndText
                  title="End Date*"
                  text={
                    endDate
                    ? getDateFormat(endDate,'DD-MM-YYYY')
                    : "Select Date"

                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible1(true)}
                />
                <DatePicker
                  modal
                  mode="date"
                  minimumDate={new Date()}
                  open={isDatePickerVisible1}
                  date={endDate != null ? new Date() : new Date()}
                  onConfirm={handleDateChange1}
                  onCancel={() => setDatePickerVisible1(false)}
                />

                <CommonTitleAndText
                  title="Start Time*"
                  text={startTime?  moment(startTime).format("HH:mm") : "Select Time"
                  }
                  isIcon
                  isClock
                  onPress={() => {
                    console.log("Start Time button pressed");
                    setTimePickerVisible(!isTimePickerVisible);
                  }}
                />
                <DatePicker
                  modal
                  open={isTimePickerVisible}
                  date={startTime != null ? startTime : new Date()}
                  mode="time"
                  placeholder="Select time"
                  format="HH:mm"
                  minuteInterval={30} // Set the minute interval to 30 minutes
                  onDateChange={(time) => {
                    console.log(time)
                    setStartTime(time);
                  }}
                
                  onConfirm={(date) => handleTimeChange(date)}
                  onCancel={() => setTimePickerVisible(false)}
                />

                <CommonTitleAndText
                  title="End Time*"
                  text={
                    endTime
                      ?  moment(endTime).format("HH:mm") 
                         
                      : "Select Time"
                  }
                  isIcon
                  isClock
                  onPress={() => setTimePickerVisible1(true)}
                />
                <DatePicker
                  modal
                  mode="time"
                  open={isTimePickerVisible1}
                  minimumDate={new Date()}
                  date={endTime != null ? endTime : new Date()}
                  placeholder="Select time"
                  format="HH:mm"
                  minuteInterval={30} // Set the minute interval to 30 minutes
                  onDateChange={(time) => {
                    setEndTime(time);
                  }}

                  onConfirm={handleTimeChange1}
                  onCancel={() => setTimePickerVisible1(false)}
                />
                <>
                  {/* <View style={{ width: "100%", marginTop: moderateScale(2) }}>
                  <CampaignDropDown
                    dataList={[
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5", value: "5" },
                      { label: "6", value: "6" },
                      { label: "7", value: "7" },
                      { label: "8", value: "8" },
                      { label: "9", value: "9" },
                      { label: "10", value: "10" },
                    ]}
                    placeHolderText="No. of times*"
                    onChange={(item) => {
                      setFilterData({ ...filterData, times: item.value });
                    }}
                    value={filterData?.times}
                  />
                </View>

                <View style={{ width: "100%", marginTop: moderateScale(2) }}>
                  <CampaignDropDown
                    dataList={[
                      { label: "1", value: "1" },
                      { label: "2", value: "2" },
                      { label: "3", value: "3" },
                      { label: "4", value: "4" },
                      { label: "5", value: "5" },
                      { label: "6", value: "6" },
                      { label: "7", value: "7" },
                      { label: "8", value: "8" },
                      { label: "9", value: "9" },
                      { label: "10", value: "10" },
                    ]}
                    placeHolderText="No. of Priority*"
                    onChange={(item) => {
                      setFilterData({ ...filterData, proirity: item.value });
                    }}
                    value={filterData?.proirity}
                  />
                </View> */}
                </>

                <AppText style={Styles.notesText}>
                  {
                    "* In case the end time crosses midnight, the schedule will end on end date+1"
                  }
                </AppText>
              </View>
            </View>
          )}
          {currentSection === 1 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>
                SELECT MEDIA PLAYER/DEVICE
              </AppText>
              <Separator />
              <View style={Styles.subHeaderText}>
                <Pressable
                  onPress={() => setSearchType("location")}
                  style={[Styles.searchHeaderView(searchType === "location")]}
                >
                  <AppText
                    style={[Styles.searchHeaderText(searchType === "location")]}
                  >
                    {"Search by Location"}
                  </AppText>
                </Pressable>

                <Pressable
                  onPress={() => setSearchType("device")}
                  style={[Styles.searchHeaderView(searchType === "device")]}
                >
                  <AppText
                    style={[Styles.searchHeaderText(searchType === "device")]}
                  >
                    {"Search by Device"}
                  </AppText>
                </Pressable>
              </View>

              <View style={Styles.locationContainer}>
                {searchType === "location" ? (
                  <>
                    <TextInput
                      style={{ fontSize: moderateScale(14),
                      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
                      paddingVertical: moderateScale(8),
                      width: "90%",marginLeft:1,borderRadius:5,
                      color:'#000000',borderWidth:1,borderColor:'#00000026'}}
                      placeholder={`Search by Location`}
                      placeholderTextColor={"#00000026"}
                      value={searchLocation}
                      onSubmitEditing={(e) => {
                        searchLocationApi(searchLocation)
                      }}
                      onChangeText={(value) => {
                         setSearchLocation(value)
                      //onchange(item, value);
                      }}
                    />
                    {locationData && (
                      <LocationsListForPlanogram
                        data={locationData}
                        setIsLoading={setIsLoading}
                        selectedLocations={selectedLocations}
                        setSelectedLocations={setSelectedLocations}
                      />
                    )}
                  </>
                ) : (
                  <View style={Styles.deviceContainer}>
                    <View style={Styles.deviceHeaderPart}>
                      <AppText style={Styles.deviceSelectedTop}>
                        <AppText
                          style={[Styles.deviceSelectedTop, Styles.boldText]}
                        >
                          {showGroupOrMedia == "group"
                            ? `(${state.selectedDeviceGroups.length})`
                            : `(${state.selectedDevice.length})`}{" "}
                        </AppText>
                        of{" "}
                        {showGroupOrMedia == "group"
                          ? ` (${
                              deviceGroupData ? deviceGroupData.length : 0
                            }) `
                          : ` (${deviceData ? deviceData.length : 0}) `}{" "}
                        {showGroupOrMedia} selected
                      </AppText>
                      <View style={Styles.iconContainer}>
                        <Pressable
                          onPress={() => {
                            setShowGroupOrMedia("group");
                          }}
                        >
                          <FontAwesome
                            name={"navicon"}
                            size={25}
                            color={themeColor.themeColor}
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setShowGroupOrMedia("device");
                          }}
                        >
                          <Image
                            source={AppIcon}
                            style={{
                              height: 40,
                              width: 40,
                              tintColor: themeColor.themeColor,
                            }}
                          />
                        </Pressable>
                      </View>
                    </View>
                    <TextInput
                  style={{ fontSize: moderateScale(14),
                    fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
                    paddingVertical: moderateScale(8),
                    width: "80%",marginLeft:20,borderRadius:5,
                    color:'#000000',borderWidth:1,borderColor:'#00000026'}}
                  placeholder={showGroupOrMedia == "group" ? `Search by Device Group` :`Search by Device list`}
                  placeholderTextColor={"#00000026"}
                  value={searchtext}
                  onSubmitEditing={(e) => {
                    makeUrlData(showGroupOrMedia);
                  }}
                  onChangeText={(value) => {
                    setsearchtext(value)
                    //onchange(item, value);
                  }}
                />


                    {showGroupOrMedia == "group" ? (
                      <View style={Styles.deviceBodyContainer}>
                        {deviceGroupData &&
                          deviceGroupData?.map((item, dIndex) => {
                            return (
                              <View key={dIndex + "device"}>
                                <CustomIconText
                                  onPress={() => {
                                    btnAddDeviceGroup(item.deviceGroupId);
                                  }}
                                  name={item.deviceGroupName}
                                  icon={() =>
                                    getIcon(
                                      isGroupDeviceCheked(item.deviceGroupId)
                                    )
                                  }
                                />
                                {dIndex + 1 != deviceGroupData.length &&
                                  deviceGroupData.length != 1 && <Separator />}
                              </View>
                            );
                          })}
                      </View>
                    ) : (
                      <View style={Styles.deviceBodyContainer}>
                        {deviceData &&
                          deviceData?.map((item, dIndex) => {
                            return (
                              <View key={dIndex + "device"}>
                                <CustomIconText
                                  onPress={() => {
                                    btnAddDevice(item.deviceId);
                                  }}
                                  name={item.deviceName}
                                  icon={() =>
                                    getIcon(isDeviceCheked(item.deviceId))
                                  }
                                />
                                {dIndex + 1 != deviceData.length &&
                                  deviceData.length != 1 && <Separator />}
                              </View>
                            );
                          })}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}

          {currentSection === 2 && (
              <View style={Styles.bodyContainer}>
                <View style={Styles.campaignHeader}>
                  <AppText style={Styles.bodyHeaderText}>
                    SELECT CAMPAIGN
                  </AppText>
                  <AppText style={Styles.slotsText}>
                   {'Available slots:'}{availablesss}{'\n'}
                   {'(Devices:'}{deviceab}{')'}
                  </AppText>
                </View>
                <Separator />
                <View style={Styles.uploadFileHere}>
                  {selectedCampaign ? (
                    <View style={{flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',}}>
                      <View style={{padding: 10,width:'40%',
                          marginHorizontal: moderateScale(10)}}>
                        <Image
                          source={{ uri: state.selectedCampaign?.mediaDetail[0].thumbnailUrl }}
                          style={{
                            height: moderateScale(100),
                            width: moderateScale(100),
                            borderRadius: moderateScale(10),
                          }}
                        />
                        <TouchableOpacity  onPress={() => setSelectedCampaign(false)} style={{  position: 'absolute',
                          top: moderateScale(0),
                          right: moderateScale(0),
                          backgroundColor: 'white',
                          borderRadius: moderateScale(15),
                          borderWidth: moderateScale(2),
                          borderColor: themeColor.unselectedText,}}>
                          <Ionicons
                            name="close"
                            size={20}
                            color={themeColor.unselectedText}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{width:'60%',}}>
                        <AppText style={[Styles.fileName]}>
                          {state.selectedCampaign?.campaignTitle}
                        </AppText>
                        <AppText style={[Styles.fileName,{color:'black'}]}>{'Duration:'}{state.selectedCampaign?.duration}{'sec'}</AppText>
                        <AppText style={[Styles.fileName,{color:'black'}]}>{state.selectedCampaign?.aspectRatio.actualHeightInPixel}{'*'}{state.selectedCampaign?.aspectRatio.actualWidthInPixel}</AppText>
                       
                        <AppText style={[Styles.fileName,{color:'black'}]}>{state.selectedCampaign?.mediaDetail[0].fullName}</AppText>
                        <AppText
                            onPress={() => {
                              navigation.navigate(NAVIGATION_CONSTANTS.CMP_VIEW, {
                                campaignItem: {campaignId:state.selectedCampaign.campaignId},
                              })
                          }}
                          style={Styles.themeText}>
                          Preview 
                        </AppText>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <AppText style={Styles.dropText}>
                        Select Campaign Content
                      </AppText>

                      <AppText
                        style={{
                          fontSize: moderateScale(14),
                          color: themeColor.unselectedText,
                          marginVertical: moderateScale(10),
                        }}>
                        <AppText
                          onPress={() => {
                            planogramCampaignStringList();
                            setModal(true)}}
                          style={{
                            textDecorationLine: 'underline',
                          }}>
                          Click here
                        </AppText>{' '}
                        to choose file
                      </AppText>
                    </View>
                  )}
                </View>
                <View style={Styles.bodyRowsContainer}>
                  <CommonTitleAndText title="Aspect Ratio *" text={ratiovalue} />
                  <CommonTitleAndText
                    title="Start Date*"
                    text={getDateFormat(startDate,'DD-MM-YYYY')}
                    isIcon
                    isCalender
                    onPress={() => {
                     setDatePickerVisible(!isDatePickerVisible);
                    }}
                  />
                    <DatePicker
                  modal
                  mode="date"
                  open={isDatePickerVisible}
                  date={startDate != null ? startDate : new Date()}
                  minimumDate={new Date()}
                  onConfirm={handleDateChange}
                  onCancel={() => setDatePickerVisible(false)}
                />

                  <CommonTitleAndText
                    title="End Date*"
                    text={getDateFormat(endDate,'DD-MM-YYYY')}
                    isIcon
                    isCalender
                    onPress={() => {
                     
                      setDatePickerVisible1(!isDatePickerVisible1);
                    }}
                  />

                <DatePicker
                  modal
                  mode="date"
                  open={isDatePickerVisible1}
                  date={endDate != null ? endDate : new Date()}
                  minimumDate={new Date()}
                  onConfirm={handleDateChange1}
                  onCancel={() => setDatePickerVisible1(false)}
                />
                  <CommonTitleAndText
                    title="Start Time*"
                    text={ moment(startTime).format("HH:mm")}
                    isIcon
                    isClock
                    onPress={() => {
                     
                      setTimePickerVisible(!isTimePickerVisible);
                    }}
                  />
                   <DatePicker
                  modal
                  open={isTimePickerVisible}
                  date={startTime != null ? startTime : new Date()}
                  mode="time"
                  placeholder="Select time"
                  format="HH:mm"
                  //minuteInterval={30} // Set the minute interval to 30 minutes
                  onDateChange={(time) => {
                    setStartTime(time);
                  }}
                 
                  onConfirm={(date) => handleTimeChange(date)}
                  onCancel={() => setTimePickerVisible(false)}
                />

                  <CommonTitleAndText
                    title="End Time*"
                    text={ moment(endTime).format("HH:mm")}
                    isIcon
                    isClock
                    onPress={() => {
                     
                      setTimePickerVisible1(!isTimePickerVisible1);
                    }}
                  />
                   <DatePicker
                  modal
                  open={isTimePickerVisible1}
                  date={endTime != null ? endTime : new Date()}
                  mode="time"
                  placeholder="Select time"
                  format="HH:mm"
                 // minuteInterval={30} // Set the minute interval to 30 minutes
                  onDateChange={(time) => {
                    setStartTime(time);
                  }}
                 
                  onConfirm={(date) => handleTimeChange1(date)}
                  onCancel={() => setTimePickerVisible1(false)}
                />
                  <AppTextInput
                    containerStyle={Styles.eventTitleInput}
                    value={occurance}
                    keyboardType="numeric"
                    onChangeText={(text) => setoccurance(text)}
                    placeHolderText="Enter occurrence *"
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />


                   <AppTextInput
                    containerStyle={Styles.eventTitleInput}
                    value={priority}
                    keyboardType="numeric"
                    onChangeText={(text) => setpriority(text)}
                    placeHolderText="Select Priority *"
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />


                </View>
              </View>
            )}
        
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <ActionContainer
        isContinue={currentSection === 2 }
        draftText={currentSection === 1 ? "Reset" : undefined}
        continueText={
          currentSection === 2 ? "Add Campaign" : "Send For Approval"
        }
        cancelText={currentSection > 0 ? "Go Back" : "Cancel"}
        numOfButtons={3}
        onPressSave={() => {
          if (currentSection == 0) {
            handlePlonogram("Published");
          } else if (currentSection == 1) {
            btnSubmitDeviceGroup();
          } else if (currentSection == 2) {
            btnSubmitCampainPlanogram();
          }else {
            navigation.goBack();
          }
        }}
        onPressDraft={() => {
          if (currentSection == 0) {
            handlePlonogram("DRAFT");
          }
          if (currentSection == 1) {
            resetLocationAndGroupDevice();
          }
          
        }}
        onPressCancel={() => {
          console.log("currentSection",currentSection)
          if (currentSection === 0) {
            navigation.goBack();
          }
          else if (currentSection === 2) {
           if(planogramItem?.state != 'PUBLISHED')
           {
            setCurrentSection(currentSection - 1);
           }else{
            Alert.alert("Warning","Scheduler already published, Can't go back")
           }
          }
          
          else {
            setCurrentSection(currentSection - 1);
          }
        }}
      />
      {showpublishbtn && currentSection === 2 &&
      <View style={{  
        justifyContent: 'center',
        alignItems: 'center',}}>
       <TouchableOpacity
           onPress={() => {
           navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER_VIEW1,{item: planogramItem})}}
          style={ { width: '48%', backgroundColor: themeColor.themeColor,
          paddingHorizontal: moderateScale(25), borderRadius: moderateScale(10),
          borderWidth: 1,
          paddingVertical: moderateScale(10),
          paddingHorizontal: moderateScale(20),}}
        >
          <AppText style={{fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      fontSize: moderateScale(13),
      alignSelf: "center",color: themeColor.white}}>
            {"Continue"}
          </AppText>
        </TouchableOpacity>
        </View>


}
    </View>
  );
};
export default SchedulerEdit;
