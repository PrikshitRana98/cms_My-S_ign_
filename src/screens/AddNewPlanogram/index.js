import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,KeyboardAvoidingView,Platform,Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Dimensions,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";

import Entypo from "react-native-vector-icons/Entypo";
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
import LocationsListForPlanogram from "../../Components/Organisms/Dashboard/LocationsListForPlanogram";
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CommonStyles from "./style";
import { CampaignData, ListHeaders, campaignData, headers } from "./constants";
import DatePicker from "react-native-date-picker";
import { Dropdown } from "react-native-element-dropdown";
import {
  getResolutionData,
  getWorkFlow,
} from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import {
  PlanogramManagerService,
  getDeviceByLocation,
  getDeviceGroupByLocation,
  getLocationList,
} from "../Planogram/PlonogramApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import moment from "moment";
import { locationData } from "../../Components/Organisms/Dashboard/LocationData";
import Loader from "../../Components/Organisms/CMS/Loader";
import { Checkbox, Switch } from "react-native-paper";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import DropdownComp from "../../Components/HelperComp/DropdownComp";
import DraggableFlatList, {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from "react-native-draggable-flatlist";
import { SchedulerManagerService } from "../Scheduler/SchedulerApi";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import SuccessModal from "../../Components/Molecules/SuccessModal";
// import DropDownPicker from 'react-native-dropdown-picker';

let cdate = new Date();
let currentdate = cdate.setDate(cdate.getDate() + 1);
const RadioButton = ({ label, isSelected, onSelect }) => {
  return (
    <TouchableOpacity onPress={onSelect} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialIcons
        name={isSelected ? 'radio-button-checked' : 'radio-button-unchecked'}
        size={24}
        color={isSelected ? 'purple' : 'purple'}
      />
      <Text style={{ marginLeft: 8,color:"black" }}>{label}</Text>
    </TouchableOpacity>
  );
};

const AddNewPlanogram = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  const [isSuccessModal,setIsSuccessModal]=useState(false)
  const [msg,setMsg]=useState("");
  const [currentSection, setCurrentSection] = useState(0);
  const [searchType, setSearchType] = useState("location");
  const [campaignType, setCampaignType] = useState(0);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [endDate, setEndDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [startTimeSec, setStartTimeSec] = useState(null);
  const [iseditname, setiseditname] = useState(false);
  const [isTimePickerVisible1, setTimePickerVisible1] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [endTimeSec, setEndTimeSec] = useState(null);

  const [ratioId, setRatioId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [plonogramError, setPlonogramError] = useState("");
  const [plonogramError2, setPlonogramError2] = useState("");
  const [showGroupOrMedia, setShowGroupOrMedia] = useState("group");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [error, setError] = useState({
    planogramTitle: "",
    asspectRatio: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
  });

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
      console.log('device back')
  })
  }, [navigation])
  
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

  const defaultDate = new Date();
  defaultDate.setHours(0);
  defaultDate.setMinutes(0);

  const [state, setState] = useState({
    selectedDeviceGroups: [],
    selectedDevice: [],
    deviceLogicData: null,
    ratioId: null,
    planogramId: null,
    planogramData: null,
    campaignString: [],
    campaigns: [],
    filterCampaignString: [],
    filterCampaigns: [],
    selectedCampaign: [],
    selectedCampaignString: [],
    pCamp: [],
    pCampStr: [],
    planogramPriorityList: [],
    isPriorityPlanogram: false,
  });

  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );

  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  
  const [locationData, setLocationData] = useState(locationData1);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchtext, setsearchtext] = useState("");

  const deviceGroupData1 = useSelector(
    (state) => state.CommonReducer.deviceGroupData
  );
  const [deviceGroupData, setdeviceGroupData] = useState([]);

  const deviceData1 = useSelector((state) => state.CommonReducer.deviceData);
  const [deviceData, setdeviceData] = useState([]);

  useEffect(()=>{
    setdeviceData(deviceData1)
    setdeviceGroupData(deviceGroupData1)
  },[deviceData1,deviceGroupData1])

  

  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
    ratioId: resolution.aspectRatioId,
    campaignTitle: resolution.campaignTitle,
    id: resolution.campaignId,
  }));
  const workFlow = useSelector((state) => state.userReducer.workFlow);
  const userlocation= useSelector((state)=>state.userReducer.userRole.locations)

  useEffect(()=>{
    makeUrlData("")
  },[1])

  useEffect(() => {
    getWorkFlow(navigation);
    getResolutionData(setIsLoading);
    getLocationList();
  }, []);

  useEffect(() => {
    getDevicesAndDevicesGroup(selectedLocations);
  }, [selectedLocations]);

  const scrollRef = useRef(null);
  useEffect(() => {
    
    scrollRef.current._listRef._scrollRef.scrollTo({
      x: 200 * currentSection,
      animated: true,
    });
  }, [currentSection]);

  function formatTime(timeString) {
    if(timeString){
      const timeArray = timeString.split(':');
    const formattedTime = timeArray.slice(0, 2).join(':');
    return formattedTime;
    }else{
      return "-"
    }
  }

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

  const handlePlonogram1 = (satus) => {
    let hasError = false;
    if (!title.trim() || title === "") {
      setError((prev) => {
        return { ...prev, planogramTitle: "Please enter planogram title" };
      });
      hasError = true;
    }
    if (!state?.ratioId) {
      setError((prev) => {
        return { ...prev, asspectRatio: "Please select aspect ratio" };
      });
      hasError = true;
    }

    if (!startDate) {
      setError((prev) => {
        return { ...prev, startDate: "Select start date" };
      });
      hasError = true;
    }
    if (!endDate) {
      setError((prev) => {
        return { ...prev, endDate: "Select end date" };
      });
      hasError = true;
    }
    if (!startTime) {
      setError((prev) => {
        return { ...prev, startTime: "Select start time" };
      });
      hasError = true;
    }
    if (!endTime) {
      setError((prev) => {
        return { ...prev, endTime: "Select end time" };
      });
      hasError = true;
    }

    if (
      moment(startDate).format("DD-MM-YYYY") <
      moment(new Date()).format("DD-MM-YYYY")
    ) {
      setError((prev) => {
        return {
          ...prev,
          startDate:
            "Start date should be equals to or greater than current date.",
        };
      });
      hasError = true;
    }

    if (
      moment(endDate).format("YYYY-MM-DD") <
      moment(startDate).format("YYYY-MM-DD")
    ) {
      setError((prev) => {
        return {
          ...prev,
          endDate: "End date can not be lesser than to start date.",
        };
      });
      hasError = true;
    }

    if (
      moment(startDate).format("DD-MM-YYYY") <=
      moment(new Date()).format("DD-MM-YYYY")
    ) {
      if (
        moment(startTime).format("HHmmss") <=
        moment(new Date()).format("HHmmss")
      ) {
        console.log(
          startTime <= new Date(),
          "kjhgfcgvhbjk",
          moment(startTime).format("HHmmss"),
          "**",
          moment(new Date()).format("hh:mm:ss")
        );
        setError((prev) => {
          return { ...prev, startTime: "Please select future time." };
        });
        hasError = true;
        // Alert.alert("Validation Error", "Please select future time.");
        // return false;
      } else if (
        moment(startTime).format("HHmmss") > moment(new Date()).format("HHmmss")
      ) {
        setError((prev) => {
          return { ...prev, startTime: "" };
        });
      }
    }

    if (
      moment(endTime).format("HHmmss") < moment(startTime).format("HHmmss") &&
      moment(endDate).format("YYYY-MM-DD") ==
        moment(startDate).format("YYYY-MM-DD")
    ) {
      setError((prev) => {
        return {
          ...prev,
          endTime: "End time can not be lesser than start time.",
        };
      });
      hasError = true;
    } else if (
      moment(endTime).format("HHmmss") > moment(startTime).format("HHmmss")
    ) {
      setError((prev) => {
        return { ...prev, endTime: "" };
      });
    }

    if (hasError) {
      return false;
    }

    console.log("ha err");

    if (recState.recurrenceOnOff && recurrence.recurrenceType === null) {
      Alert.alert("Validation Error", "Please select recurrence type.");
      return false;
    }

    if (
      (recurrence.recurrenceType === "HOURLY" &&
        recurrence.repeatHours === null) ||
      recurrence.repeatHours === ""
    ) {
      Alert.alert("Validation Error", "Please select repeat hours.");
      return false;
    }

    if (
      (recurrence.recurrenceType === "MINUTE" &&
        recurrence.repeatMinutes === null) ||
      recurrence.repeatMinutes === ""
    ) {
      Alert.alert("Validation Error", "Please select repeat minute.");
      return false;
    }

    if (recurrence.recurrenceType === "WEEKLY") {
      if (recurrence.repeatWeeks === null) {
        Alert.alert("Validation Error", "Please select repeat weeks.");
        return false;
      }
      if (recurrence.weekly.length === 0) {
        Alert.alert("Validation Error", "Please select week days.");
        return false;
      }
    }

    if (
      recurrence.recurrenceType === "MONTHLY" &&
      recurrence.monthly === null
    ) {
      Alert.alert("Validation Error", "Please select month.");
      return false;
    }

    EditSubmitPress(satus);
  };

  const EditSubmitPress = async (satus) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      planogramId: state.planogramId,
      isPriorityPlanogram: state?.isPriorityPlanogram,
      data: {
        planogramId: state.planogramId,
        state: satus,
        title: title,
        aspectRatioId: state?.ratioId,
        recurrence: recurrence,
        startTime: startTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
        endTime: endTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
        startDate:startDate.toISOString().split("T")[0],
        endDate:endDate.toISOString().split("T")[0],
        isPriorityPlanogram: state?.isPriorityPlanogram,
      },
    };

    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      // console.log("response", response);
      if (response) {
        getDeviceLogic(response?.data?.planogramId);
        if(satus=="DRAFT"){
          navigation.goBack()
        }else{
         if (currentSection !== 3) {
            setCurrentSection(currentSection + 1);
          }
        }
        setResponseValue(response);
      }
    };
    const failureCallBack = (error) => {
      // console.log("response", error);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    
    PlanogramManagerService.editPlanogram(
      params,
      succussCallBack,
      failureCallBack
    );
  };


  const handlePlonogram = async (status) => {
    let hasError = false;
    if (!title.trim() || title === "") {
      setError((prev) => {
        return { ...prev, planogramTitle: "Please enter planogram title" };
      });
      hasError = true;
    }

    if (!state?.ratioId) {
      setError((prev) => {
        return { ...prev, asspectRatio: "Please select aspect ratio" };
      });
      hasError = true;
    }

    if (!startDate) {
      setError((prev) => {
        return { ...prev, startDate: "Select start date" };
      });
      hasError = true;
    }
    if (!endDate) {
      setError((prev) => {
        return { ...prev, endDate: "Select end date" };
      });
      hasError = true;
    }
    if (!startTime) {
      setError((prev) => {
        return { ...prev, startTime: "Select start time" };
      });
      hasError = true;
    }
    if (!endTime) {
      setError((prev) => {
        return { ...prev, endTime: "Select end time" };
      });
      hasError = true;
    }

    if (
      moment(startDate).format("YYYY-MM-DD") <
      moment(new Date()).format("YYYY-MM-DD")
    ) {
      setError((prev) => {
        return {
          ...prev,
          startDate:
            "Start date should be equals to or greater than current date.",
        };
      });
      hasError = true;
    }

    if (
      moment(endDate).format("YYYY-MM-DD") <
      moment(startDate).format("YYYY-MM-DD")
    ) {
      setError((prev) => {
        return {
          ...prev,
          endDate: "End date can not be lesser than to start date.",
        };
      });
      hasError = true;
    }

    if (endTime < startTime&&(moment(endDate).format("YYYY-MM-DD") ==moment(startDate).format("YYYY-MM-DD"))) {
      
      setError((prev) => {
        return {
          ...prev,
          endTime: "End time can not be lesser than start time.",
        };
      });
      hasError = true;
    }

    if (
      moment(startDate).format("YYYY-MM-DD") <=
      moment(new Date()).format("YYYY-MM-DD")
    ) {
      if (startTime <= new Date()) {
        setError((prev) => {
          return { ...prev, startTime: "Please select future time." };
        });
        hasError = true;
        // Alert.alert("Validation Error", "Please select future time.");
        // return false;
      }
    }

    if (hasError) {
      return false;
    }

    if (recState.recurrenceOnOff && recurrence.recurrenceType === null) {
      Alert.alert("Validation Error", "Please select recurrence type.");
      return false;
    }

    if (
      (recurrence.recurrenceType === "HOURLY" &&
        recurrence.repeatHours === null) ||
      recurrence.repeatHours === ""
    ) {
      Alert.alert("Validation Error", "Please select repeat hours.");
      return false;
    }

    if (
      (recurrence.recurrenceType === "MINUTE" &&
        recurrence.repeatMinutes === null) ||
      recurrence.repeatMinutes === ""
    ) {
      Alert.alert("Validation Error", "Please select repeat minute.");
      return false;
    }

    if (recurrence.recurrenceType === "WEEKLY") {
      if (recurrence.repeatWeeks === null) {
        Alert.alert("Validation Error", "Please select repeat weeks.");
        return false;
      }
      if (recurrence.weekly.length === 0) {
        Alert.alert("Validation Error", "Please select week days.");
        return false;
      }
    }

    if (
      recurrence.recurrenceType === "MONTHLY" &&
      recurrence.monthly === null
    ) {
      Alert.alert("Validation Error", "Please select month.");
      return false;
    }

    let postData = {
      title: title,
      aspectRatioId: state?.ratioId,
      recurrence: recurrence,
      isPriorityPlanogram:state?.isPriorityPlanogram,
      startTime: startTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      startDate: startDate.toISOString().split("T")[0],
      endTime: endTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      endDate: endDate.toISOString().split("T")[0],
      state: status,
    };
    

    let slugId = await getStorageForKey("slugId");
    const params = {
      data: postData,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
     
      setIsLoading(false);
      if (response?.code == 200) {
        
        setState((prev) => {
          return { ...prev, planogramId: response?.data?.planogramId };
        });
        getDeviceLogic(response?.data?.planogramId);
        if(status=="DRAFT"){
          navigation.goBack()
        }else{
         if (currentSection !== 3) {
            setCurrentSection(currentSection + 1);
          }
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
     
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

   
    PlanogramManagerService.addPlanogram(
      params,
      succussCallBack,
      failureCallBack
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
    };

    const failureCallBack = (error) => {
      console.log("line 559 prik eror",JSON.stringify(error))
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    PlanogramManagerService.fetchDeviceLogicList(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  // ==============2nd step========================

  let getDevicesAndDevicesGroup = async (selectedLocations) => {
    setState({ ...state, selectedDeviceGroups: [], selectedDevice: [] });
    let params = {
      ids: selectedLocations,
    };
    console.log("location id selected",selectedLocations)
    getDeviceGroupByLocation(params, setIsLoading);
    getDeviceByLocation(params, setIsLoading);
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
    if (
      state.selectedDeviceGroups.length <= 0 &&
      selectedLocations.length <= 0 &&
      state.selectedDevice.length <= 0
    ) {
      alert("Please select device groups or locations");
      return false;
    }
    let device_logic = "";
    if (state.selectedDevice.length > 0) {
      device_logic = state?.deviceLogicData?.filter(
        (item) => item.key == "DEVICES"
      );
    } else if (
      state.selectedDeviceGroups.length > 0 &&
      selectedLocations.length > 0
    ) {
      device_logic = state?.deviceLogicData?.filter(
        (item) => item.key == "LOCATIONS_AND_DEVICE_GROUPS"
      );
    } else if (state.selectedDeviceGroups.length > 0) {
      device_logic = state?.deviceLogicData?.filter(
        (item) => item.key == "DEVICE_GROUPS"
      );
    } else if (selectedLocations.length > 0) {
      device_logic = state?.deviceLogicData?.filter(
        (item) => item.key == "LOCATIONS"
      );
    }

    let postData = "";
    if (device_logic[0].key == "DEVICES") {
      postData = {
        deviceLogic: {
          key: "DEVICES",
          overwrite: false,
          deviceIds: state.selectedDevice,
        },
      };
    } else if (device_logic[0].key == "LOCATIONS") {
      postData = {
        deviceLogic: {
          key: "LOCATIONS",
          overwrite: false,
          locationIds: selectedLocations,
        },
      };
    } else if (device_logic[0].key == "DEVICE_GROUPS") {
      postData = {
        deviceLogic: {
          key: "DEVICE_GROUPS",
          overwrite: false,
          deviceGroupIds: state.selectedDeviceGroups,
        },
      };
    } else if (device_logic[0].key == "LOCATIONS_AND_DEVICE_GROUPS") {
      postData = {
        deviceLogic: {
          key: "LOCATIONS_AND_DEVICE_GROUPS",
          overwrite: false,
          locations: [
            {
              locationId: selectedLocations[0],
              deviceGroupIds: state.selectedDeviceGroups,
            },
          ],
        },
      };
    }
    let slugId = await getStorageForKey("slugId");
    let postData1 = {
      slugId: slugId,
      deviceLogicId: device_logic[0].deviceLogicId,
      planogramId: state.planogramId,
      postData: postData,
    };

    setIsLoading(true);
    const succussCallBack = async (response) => {
      console.log("711---<",JSON.stringify(response))
      setIsLoading(false);
      if (response?.code == 200) {
        planogramCampaignStringList();
        planogramCampaignList();
        if (currentSection !== 3) {
          setCurrentSection(currentSection + 1);
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
      console.log("733---<",JSON.stringify(error.response))
      setIsLoading(false);
      if (error?.data?.length > 0) {
        Alert.alert("Error",error?.data[0]?.message);
      } else if(error?.response){
        Alert.alert("Error",error.response.data.message)
      }
      else {
        Alert.alert("Error",error?.message);
      }
    };

    PlanogramManagerService.updateDeviceLogicPlanogram(
      postData1,
      succussCallBack,
      failureCallBack
    );
  };

  const resetLocationAndGroupDevice = () => {
    setState({ ...state, selectedDeviceGroups: [] });
    setSelectedLocations([]);
  };

  const removeCampaignIndex = (index) => {
    if (state.selectedCampaign.length > 0) {
      const dataArr=[...state.selectedCampaign] 
      dataArr.splice(index, 1);
      setState({...state,selectedCampaign:dataArr});
    }
  };

  const removeCampaignStringIndex = (index) => {
    if (state.selectedCampaignString.length > 0) {
      const dataArr=[...state.selectedCampaignString] 
      dataArr.splice(index, 1);
      setState({...state,selectedCampaignString:dataArr});
    }
  };

  const RemoveCampaign = ({ item, index }) => {
    const ind=index
    const data1=state.campaignString.filter((item)=>state.selectedCampaignString.includes(item.campaignStringId))
    console.log("Remove Campaign--->",state.selectedCampaignString,data1)
    if(item){
      if (campaignType == 0) {
        return (
          <View
            style={{
              width:Dimensions.get("window").width*0.8,
              backgroundColor:"white",
              borderWidth:1,
              flexDirection:"row",
              justifyContent:"space-between",
              alignItems:"center",
              borderRadius:10,paddingLeft:16,
              paddingRight:5,
              marginVertical:5,}}
          >
            <Text style={{color:"black",textAlignVertical:"center"}} numberOfLines={1}>
              {item.campaignTitle!=undefined?item.campaignTitle:""}
            </Text>
            <TouchableOpacity
                style={{borderWidth:0,height:38,alignItems:'center',justifyContent:'center'}}
                onPress={(index) => {
                  removeCampaignIndex(ind);
                  console.log("close",ind)
                }}
              >
                <Entypo name="cross" color="#000" size={25} />
              </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View
            style={{width:Dimensions.get("window").width*0.8,backgroundColor:"white",borderWidth:1,borderRadius:10,paddingHorizontal:16 ,marginVertical:5,flexDirection:"row",justifyContent:"space-between"}}
          >
            <Text style={{color:"black",textAlignVertical:"center"}} numberOfLines={1}>
            {item.campaignStringName}
            </Text>
            <TouchableOpacity
                style={{borderWidth:0,height:38,alignItems:'center',justifyContent:'center'}}
                onPress={(index) => {
                  removeCampaignStringIndex(ind);
                  console.log("close",ind)
                }}
              >
                <Entypo name="cross" color="#000" size={25} />
              </TouchableOpacity>
          </View>
        );
      }
    }
  };
  // ==============End 2nd step========================

  // 3rd steps===========================
  const renderCampaign = ({ item, index }) => {
    if (campaignType == 0) {
      return (
        <Pressable
          onPress={() => {
            addCampaign(item, index);
          }}
          style={
            isCampaignCheckde(item.campaignId)
              ? Styles.campaignStrContainerActive
              : Styles.campaignStrContainer
          }
        >
          <AppText  numberOfLines={1} style={Styles.dateText}>{item.campaignTitle}</AppText>
        
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
          style={
            isCampaignStringCheckde(item.campaignStringId)
              ? Styles.campaignStrContainerActive
              : Styles.campaignStrContainer
          }
        >
          
          <AppText style={Styles.dateText}>{item.campaignStringName}</AppText>
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
      
      if (response && response.data) {
        setState((prev) => {
          return {
            ...prev,
            campaigns: response.data,
            filterCampaigns: response.data,
          };
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

    PlanogramManagerService.getCampaignByAspectRatio1(
      state.ratioId,
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const planogramCampaignStringList = async () => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      // console.log("response cmapign str list", response);
      if (response && response.data) {
        setState((prev) => {
          return {
            ...prev,
            campaignString: response.data,
            filterCampaignString: response.data,
          };
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

    PlanogramManagerService.getCampaignStringByAspectRatio(
      state.ratioId,
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const addCampaign = (item, index) => {
    console.log("add item-->",item)
    if (state?.selectedCampaign?.includes(item.campaignId)) {
      let remainingArr = state?.selectedCampaign?.filter(
        (fitem) => fitem != item.campaignId
      );
      setState({
        ...state,
        selectedCampaign: [...state.selectedCampaign, item.campaignId],
      });
    } else {
      setState({
        ...state,
        selectedCampaign: [...state.selectedCampaign, item.campaignId],
      });
    }
  };
  const addCampaignString = (item, index) => {
    setState({
      ...state,
      selectedCampaignString: [
        ...state.selectedCampaignString,
        item.campaignStringId,
      ],
    });
    // if (state?.selectedCampaignString?.includes(item.campaignStringId)) {
    //   let remainingArr = state?.selectedCampaignString?.filter(
    //     (fitem) => fitem != item.campaignStringId
    //   );
    //   setState({
    //     ...state,
    //     selectedCampaignString: [
    //       ...state.selectedCampaignString,
    //       item.campaignStringId,
    //     ],
    //   });
    // } else {
    //   setState({
    //     ...state,
    //     selectedCampaignString: [
    //       ...state.selectedCampaignString,
    //       item.campaignStringId,
    //     ],
    //   });
    // }
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

    let {
      selectedCampaign,
      selectedCampaignString,
      campaignString,
      campaigns,
    } = state;

    if (selectedCampaign.length <= 0 && selectedCampaignString.length <= 0) {
      alert("Please select campaign or campaign string");
      return false;
    }

    // let selCamp = selectedCampaign.concat(selectedCampaignString);

    let campaignAndCampaignStrings = [];
    if (selectedCampaign.length > 0) {
      selectedCampaign.map((camp, campInd) => {
        campaignAndCampaignStrings.push({
          campaignId: camp,
          order: campInd + 1,
        });
      });
    }
    if (selectedCampaignString.length > 0) {
      selectedCampaignString.map((camp, campInd) => {
        campaignAndCampaignStrings.push({
          campaignStringId: camp,
          order: campInd + selectedCampaign.length + 1,
        });
      });
    }

    let postData = {
      planogramId: state.planogramId,
      campaignAndCampaignStrings: campaignAndCampaignStrings,
    };

    let params = {
      postData: postData,
      planogramId: state.planogramId,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response?.code === 200) {
        getPlanogramDetailById();
        if (currentSection !== 3) {
          setCurrentSection(currentSection + 1);
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
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error.data[0].message);
      } else {
        alert(error.message);
      }
    };

    PlanogramManagerService.updateCampaigCampaigStringPlanogram(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  // End 3rd steps=======================

  // 4th step==================
  const getPlanogramDetailById = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      planogramId: state.planogramId,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response?.code === 200) {
        if (currentSection !== 3) {
          setCurrentSection(currentSection + 1);
        }
        setState((prev) => {
          return { ...prev, planogramData: response?.data };
        });
        separatCampaigCampaignString(response?.data);
        getPlangogramPriority();
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
    };

    PlanogramManagerService.fetchByIdPlanogram(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const renderCampaignList = ({ item, index, drag, isActive }) => {
    return (
      <TouchableOpacity
        onLongPress={item.title === title ? drag : null}
        activeOpacity={1}
        disabled={isActive}
        style={Styles.renderContainer}
      >
        <View
          style={[
            Styles.nameView,
            {
              width: "25%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            },
          ]}
        >
          {item.title === title && (
            <Entypo name="select-arrows" color="#000" size={20} />
          )}
          <AppText
            style={[
              Styles.nameText,
              {
                marginLeft: item.title != title && 15,
              },
            ]}
          >
            {item.title}
          </AppText>
        </View>
        <View style={[Styles.nameView, { width: "25%" }]}>
          <AppText
            style={Styles.nameText}
          >{`${item.startDate} - ${item.endDate}`}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "25%" }]}>
          <AppText
            style={Styles.nameText}
          >{`${formatTime(item.startTime)}- ${formatTime(item.endTime)}`}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "25%" }]}>
          <AppText style={Styles.nameText}>{item.state}</AppText>
        </View>
      </TouchableOpacity>
    );
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
  const getPlangogramPriority = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      planogramId: state.planogramId,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response?.code === 200) {
        let plData = response?.data;
        if (plData && plData.length > 0) {
          let dd = plData.map((item, index) => {
            return {
              ...item,
              key: `item-${index}`,
              label: String(index) + "",
            };
          });
          setState({ ...state, planogramPriorityList: dd });
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
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    PlanogramManagerService.fetchPlangogramPriorityList(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const btnSubmitPlanogramPriority = async (btnType) => {
    let slugId = await getStorageForKey("slugId");
    let postData = [];
    state?.planogramPriorityList?.map((plan, pInd) => {
      postData.push({
        planogramId: plan.planogramId,
        priority: pInd + 1,
      });
    });
    let params = {
      postData: postData,
      slugId: slugId,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response?.code === 200) {
        setIsSuccessModal(true)
        setMsg("Planogram saved successfully");
        btnSubmittedStatus(btnType);
        // Alert.alert("Info!", "Planogram saved successfully", [
        //   {
        //     text: "Ok",
        //     onPress: () => {
        //       btnSubmittedStatus(btnType);
        //     },
        //   },
        // ]);
        
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
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    PlanogramManagerService.addPlanogramPriority(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const btnSubmittedStatus = async (btnType) => {
    if (btnType == "DRAFT") {
      navigation.goBack();
      // Alert.alert("Info!", "Planogram saved successfully", [
      //   {
      //     text: "Ok",
      //     onPress: () => {
      //       navigation.goBack();
      //     },
      //   },
      // ]);
      return false;
    }

    const slugId = await getStorageForKey("slugId");
    let params = {
      slugId: slugId,
      planogramID: state.planogramId,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response.code == 20) {
        console.log("Planogram saved successfully")
        navigation.goBack();
        // Alert.alert("Info!", "Planogram saved successfully", [
        //   {
        //     text: "Ok",
        //     onPress: () => {
        //       navigation.goBack();
        //     },
        //   },
        // ]);
      } else if (response.code == 21) {
        Alert.alert("Error!", response?.message, [
          {
            text: "Ok",
            onPress: () => {
              navigation.goBack();
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
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    PlanogramManagerService.addSubmitStatus(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  //=============== Searching camp camp string ====================
  const [campaignSearch, setCampaignSearch] = useState("");
  const [campaignStringSearch, setCampaignStringSearch] = useState("");

  const onChangeCampaignSearch = (txt) => {
    setCampaignSearch(txt);
    let data = [...state.filterCampaigns];
    let fData = data.filter(function (item) {
      const itemData = item.campaignTitle
        ? item.campaignTitle.toUpperCase()
        : "".toUpperCase();
      const textData = txt.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    console.log("fdata-->",JSON.stringify(fData))
    setState((pre) => {
      return { ...pre, campaigns: fData };
    });
  };
  const onChangeCampaignStringSearch = (txt) => {
    setCampaignStringSearch(txt);
    let data = [...state.filterCampaignString];
    let fData = data.filter(function (item) {
      const itemData = item.campaignStringName
        ? item.campaignStringName.toUpperCase()
        : "".toUpperCase();
      const textData = txt.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setState((pre) => {
      return { ...pre, campaignString: fData };
    });
  };

  //recurrence ==================
  const [recState, setRecState] = useState({
    recurrenceOnOff: false,
    selectedWeek: [],
  });

  const [recurrence, setRecurrence] = useState({
    repeatEvent: false,
    recurrenceType: null,
    repeatHours: null,
    repeatWeeks: null,
    repeatMinutes: null,
    weekly: [],
    weekDays: {
      sun: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
    },
    monthly: null,
  });

  const [showIntervalMinuteCheckBox, setShowIntervalMinuteCheckBox] =
    useState(false);
  const [showIntervalHourlyCheckBox, setShowIntervalHourlyCheckBox] =
    useState(false);
  const [targetValue, setTargetValue] = useState("");

  const optionValuesMin = Array.from({ length: 60 }, (_, index) => {
    if (index == 0) {
      return { label: `Repeat Every`, value: null };
    } else {
      return { label: `${index}`, value: index };
    }
  });

  const optionValuesHours = Array.from({ length: 13 }, (_, index) => {
    if (index == 0) {
      return { label: `Repeat Every`, value: null };
    } else {
      return { label: `${index}`, value: index };
    }
  });

  const optionValuesWeekly = Array.from({ length: 6 }, (_, index) => {
    if (index == 0) {
      return { label: `Repeat Every`, value: null };
    } else {
      return { label: `${index}`, value: index };
    }
  });
  const weekArra = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getBetweenTime = (startTime, endTime) => {
    const timeDifference = endTime.getTime() - startTime.getTime();
    const secondsDifference = Math.floor(timeDifference / 1000);
    return secondsDifference;
  };

  const getBetweenDays = (startDate, endDate) => {
    const timeDifference = endDate - startDate;
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.floor(timeDifference / millisecondsPerDay);
    return daysDifference;
  };

  const changeRecurrence = (type, value) => {
    if (type == "repeatWeeks") {
      setRecurrence({ ...recurrence, repeatWeeks: value });
    } else if (type == "repeatHours") {
      setRecurrence({ ...recurrence, repeatHours: value });
    } else if (type == "monthly") {
      setRecurrence({ ...recurrence, monthly: value });
    } else if (type == "repeatMinutes") {
      setRecurrence({ ...recurrence, repeatMinutes: value });
    }
  };
  const handleCheckboxChange = (status, value) => {
    if (recState.selectedWeek.includes(value)) {
      let remdata = recState.selectedWeek.filter((rem) => rem != value);
      setRecState({ ...recState, selectedWeek: remdata });
    } else {
      setRecState({
        ...recState,
        selectedWeek: [...recState.selectedWeek, value],
      });
    }
  };

  useEffect(() => {
    const updatedWeekDays = { ...recurrence.weekDays };
    if (recState.selectedWeek.includes("SUN")) {
      updatedWeekDays.sun = true;
    }
    if (recState.selectedWeek.includes("MON")) {
      updatedWeekDays.mon = true;
    }
    if (recState.selectedWeek.includes("TUE")) {
      updatedWeekDays.tue = true;
    }
    if (recState.selectedWeek.includes("WED")) {
      updatedWeekDays.wed = true;
    }
    if (recState.selectedWeek.includes("THU")) {
      updatedWeekDays.thu = true;
    }
    if (recState.selectedWeek.includes("FRI")) {
      updatedWeekDays.fri = true;
    }
    if (recState.selectedWeek.includes("SAT")) {
      updatedWeekDays.sat = true;
    }

    setRecurrence((prevRecurrence) => ({
      ...prevRecurrence,
      weekly: recState.selectedWeek,
      weekDays: updatedWeekDays,
    }));
  }, [recState.selectedWeek]);

  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      if (startTime !== endTime) {
        
        if (
          getBetweenTime(startTime, endTime) >= 1 &&
          getBetweenTime(startTime, endTime) < 60
        ) {
          setShowIntervalMinuteCheckBox(true);
          setShowIntervalHourlyCheckBox(false);
          if (recurrence.recurrenceType === "MINUTE") {
            setRecurrence({
              ...recurrence,
              repeatHours: null,
              repeatWeeks: null,
            });
          } else {
            setRecurrence({
              ...recurrence,
              repeatHours: null,
              repeatWeeks: null,
              recurrenceType: null,
            });
          }
        } else if (
          getBetweenTime(startTime, endTime) >= 60 &&
          getBetweenTime(startTime, endTime) <= 3600 * 12
        ) {
          setShowIntervalHourlyCheckBox(true);
          setShowIntervalMinuteCheckBox(false);
          if (recurrence.recurrenceType === "HOURLY") {
            let hourDifference = getBetweenTime(startTime, endTime) / 3600;
            setTargetValue(Math.floor(hourDifference));
            setRecurrence({
              ...recurrence,
              repeatMinutes: null,
              repeatWeeks: null,
            });
          } else {
            setRecurrence({
              ...recurrence,
              repeatMinutes: null,
              repeatWeeks: null,
              recurrenceType: null,
            });
          }
        } else {
          setShowIntervalMinuteCheckBox(false);
          setShowIntervalHourlyCheckBox(false);
          setRecurrence({
            ...recurrence,
            repeatMinutes: null,
            repeatWeeks: null,
            recurrenceType: null,
            repeatHours: null,
          });
        }
      }
    }
    if (
      recurrence.recurrenceType === "WEEKLY" ||
      recurrence.recurrenceType === "MONTHLY"
    ) {
      setRecurrence({
        ...recurrence,
        repeatHours: null,
        repeatMinutes: null,
      });
    }
  }, [startTime, endTime, recurrence.recurrenceType, startDate, endDate]);

  const onChangeToggle = (value) => {
    setRecState({ ...recState, recurrenceOnOff: value });
    setRecurrence({ ...recurrence, repeatEvent: value });
    if (value === false) {
      setRecurrence({
        repeatEvent: false,
        recurrenceType: null,
        repeatHours: null,
        repeatWeeks: null,
        repeatMinutes: null,
        weekly: [],
        weekDays: {
          sun: false,
          mon: false,
          tue: false,
          wed: false,
          thu: false,
          fri: false,
          sat: false,
        },
        monthly: null,
      });
    }
  };

  const returnRecurenceDesign = () => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#000" }}>Custom Recurrence</Text>
          <Switch
            value={recState.recurrenceOnOff}
            onValueChange={(value) => {
              onChangeToggle(value);
            }}
          />
        </View>
        {recState.recurrenceOnOff && (
          <View>
            {recState.recurrenceOnOff && showIntervalMinuteCheckBox && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
               
                  <RadioButton label="Interval" 
                 isSelected={recurrence.recurrenceType === "MINUTE"} 
                 onSelect={() =>   setRecurrence({ ...recurrence, recurrenceType: "MINUTE" })} />
     

               
              </View>
            )}

            {recState.recurrenceOnOff && showIntervalHourlyCheckBox && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton label="Interval" 
                 isSelected={recurrence.recurrenceType === "HOURLY"} 
                 onSelect={() => setRecurrence({ ...recurrence, recurrenceType: "HOURLY" })} />
              </View>
            )}

            {recState.recurrenceOnOff && startDate && endDate ? (
              getBetweenDays(startDate, endDate) > 7 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton label="Weekly" 
                 isSelected={ recurrence.recurrenceType === "WEEKLY"} 
                 onSelect={() => setRecurrence({ ...recurrence, recurrenceType: "WEEKLY" })} />

              
                </View>
              ) : null
            ) : null}

            {recState.recurrenceOnOff && startDate && endDate ? (
              getBetweenDays(startDate, endDate) > 30 ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                   <RadioButton label="Monthly" 
                 isSelected={ recurrence.recurrenceType === "MONTHLY"} 
                 onSelect={() => setRecurrence({ ...recurrence, recurrenceType: "MONTHLY" })} />
                </View>
              ) : null
            ) : null}
            {
              //============================== add disable code here ===================================================
              recState.recurrenceOnOff &&
                recurrence.recurrenceType === "HOURLY" && (
                  <>
                    <CampaignDropDown
                      dataList={optionValuesHours}
                      placeHolderText="Repeat Every"
                      containerStyle={Styles.textcontainer}
                      onChange={(e) => {
                        changeRecurrence("repeatHours", e.value);
                      }}
                      value={recurrence.repeatHours}
                    />
                    <AppText style={{ color: "#000", fontSize: 12 }}>
                      hour(s) (computed from start time)
                    </AppText>
                  </>
                )
            }

            {
              // add disable code here
              recState.recurrenceOnOff &&
                recurrence.recurrenceType === "MINUTE" && (
                  <>
                    <CampaignDropDown
                      dataList={optionValuesMin}
                      placeHolderText="Repeat Every"
                      containerStyle={Styles.textcontainer}
                      onChange={(e) => {
                        changeRecurrence("repeatMinutes", e.value);
                      }}
                      value={recurrence.repeatMinutes}
                    />
                    <AppText style={{ color: "#000", fontSize: 12 }}>
                      minute(s) (computed from start time)
                    </AppText>
                  </>
                )
            }

            {
              <>
                {recState.recurrenceOnOff &&
                  recurrence.recurrenceType === "WEEKLY" &&
                  startDate &&
                  endDate &&
                  getBetweenDays(startDate, endDate) > 7 && (
                    <>
                      <CampaignDropDown
                        dataList={optionValuesWeekly}
                        placeHolderText="Repeat Every"
                        containerStyle={Styles.textcontainer}
                        onChange={(e) => {
                          changeRecurrence("repeatWeeks", e.value);
                        }}
                        value={recurrence.repeatWeeks}
                      />
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        {weekArra.map((week) => {
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                alignItems: "center",
                                marginLeft: 6,
                              }}
                            >
                              <Checkbox
                                status={
                                  recState.selectedWeek.includes(week)
                                    ? "checked"
                                    : "unchecked"
                                }
                                onPress={(value) => {
                                  handleCheckboxChange(value, week);
                                }}
                              />
                              <Text style={{ color: "#000" }}>{week}</Text>
                            </View>
                          );
                        })}
                      </View>
                    </>
                  )}
              </>
            }

            {recState.recurrenceOnOff &&
              recurrence.recurrenceType === "MONTHLY" &&
              startDate &&
              endDate &&
              getBetweenDays(startDate, endDate) > 30 && (
                <>
                  <CampaignDropDown
                    dataList={[
                      // { label: "Repeat Every", value: "" },
                      { label: "First day of Month", value: "START_OF_MONTH" },
                      { label: "15th of the Month", value: "MIDDLE_OF_MONTH" },
                      { label: "Last Day of the Month", value: "END_OF_MONTH" },
                    ]}
                    placeHolderText="Select Value"
                    containerStyle={Styles.textcontainer}
                    onChange={(e) => {
                      changeRecurrence("monthly", e.value);
                    }}
                    value={recurrence.monthly}
                  />
                </>
              )}
          </View>
        )}
      </>
    );
  };
  const searchLocationApi = async (searchLoc) => {
    const slugId = await getStorageForKey("slugId");
    // setIsLoading(true);
    const successCallBack = async (response) => {
      console.log("------->",response.data)
      setLocationData(response.data[0]);
      setIsLoading(false);
    };

    const errorCallBack = (error) => {
      setIsLoading(false);
      if (error?.message) {
        // setLocationData([]);
        Alert.alert("Error",error.response.data.message);
      }
    };

    SchedulerManagerService.fetchLocationListSearch(
      { slugId, searchLoc },
      successCallBack,
      errorCallBack
    );
  };
  const makeUrlData = async (type) => {
    const slugId = await getStorageForKey("slugId");
    let endPoint = "";
    if (type == "group") {
      endPoint = `device-management/api/deviceGroup/planogram?deviceGroupName=${searchtext}`;
    } else {
      endPoint = `device-management/api/device/planogram?mediaPlayerName=${searchtext}`;
    }
    let params = {
      endpoint: endPoint,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (type == "group") {
        setdeviceGroupData(response?.result);
      } else {
        setdeviceData(response?.result);
      }
    };
    const failureCallBack = (error) => {
      
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };

    // setIsLoading(true);
    SchedulerManagerService.searchList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  // const handleDateConfirm=(date)=>{
  //   {
  //     console.log("start date==op=>",date)
  //     setStartDate(date);
  //     setError((prev) => {
  //       return { ...prev, startDate: "" };
  //     });
  //     setError((prev) => {
  //       return { ...prev, endDate: "" };
  //     });
  //     setDatePickerVisible(false);
  //   }
  // }
  const handleDateConfirm = (date) => {
    // Convert the date to UTC format to ensure consistency
    const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    const localDate=new Date(date).toLocaleDateString()

    setStartDate(localDate);

    setError((prev) => ({ ...prev, startDate: '' }));
    setError((prev) => ({ ...prev, endDate: '' }));

    setDatePickerVisible(false);
  };
  const [scrollenable, setscrollenable] = useState(true);
  const onComplete=()=>{
    setIsSuccessModal(false)
  }

  return (
    <View style={Styles.mainContainer}>
      <Loader visible={isLoading} />
      <ClockHeader />
      {isSuccessModal&&<SuccessModal Msg={msg} onComplete={onComplete}/>}
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1,marginBottom:(Platform.OS === 'ios' && isKeyboardOpen) ? 100 : 0 ,}}
    >
    

      <ScrollView
        scrollEnabled={scrollenable}
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Create New Planogram"
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
                ADD PLANOGRAM DETAILS
              </AppText>
              <Separator />
              <View style={Styles.bodyRowsContainer}>
                <AppTextInput
                  containerStyle={Styles.eventTitleInput}
                  value={title}
                  placeHolderText="Planogram Event Title *"
                  onChangeText={(text) => {
                    setTitle(text);
                    if (text.trim().length <= 0) {
                      setError((prev) => {
                        return {
                          ...prev,
                          planogramTitle: "Please enter planogram title",
                        };
                      });
                    } else {
                      setError((prev) => {
                        return { ...prev, planogramTitle: "" };
                      });
                    }
                  }}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={{
                    fontSize: moderateScale(15),
                  }}
                />
                {error?.planogramTitle && (
                  <Text style={Styles.errorText}>{error?.planogramTitle}</Text>
                )}
                <View style={{ marginVertical: moderateScale(10) }}>
                  <Dropdown
                    style={Styles.dropdown}
                    placeholderStyle={Styles.placeholderStyle}
                    selectedTextStyle={[Styles.selectedTextStyle,{color:"black"}]}
                    inputSearchStyle={[Styles.inputSearchStyle,{color:"black"}]}
                    iconStyle={Styles.iconStyle}
                    itemTextStyle={{ color: "#000000" }}
                    data={resolutionDropdownData}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={"Aspect Ratio *"}
                    searchPlaceholder="Search..."
                    value={state.ratioId}
                    onChange={(item) => {
                      setState({ ...state, ratioId: item.value });
                      setError((prev) => {
                        return { ...prev, asspectRatio: "" };
                      });
                    }}
                  />
                  {error?.asspectRatio ? (
                    <Text style={Styles.errorText}>{error?.asspectRatio}</Text>
                  ) : null}
                </View>
                <CommonTitleAndText
                  title="Start Date*"
                  text={
                    startDate
                      ? moment(startDate).format("DD-MM-YYYY")
                      : "Select Date"
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible(true)}
                />
                {error?.startDate && (
                  <Text style={Styles.errorText}>{error?.startDate}</Text>
                )}
                <DatePicker
                  mode="date"
                  modal
                  open={isDatePickerVisible}
                  date={startDate != null ? new Date() : new Date()}
                  minimumDate={new Date()}
                  onConfirm={(date)=>  {
                        setStartDate(date);
                        setError((prev) => {
                          return { ...prev, startDate: "" };
                        });
                        setError((prev) => {
                          return { ...prev, endDate: "" };
                        });
                        setDatePickerVisible(false);
                      }}
                  onCancel={() => setDatePickerVisible(false)}
                />

                <CommonTitleAndText
                  title="End Date*"
                  text={
                    endDate
                      ? moment(endDate).format("DD-MM-YYYY")
                      : "Select Date"
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible1(true)}
                />
                {error?.endDate && (
                  <Text style={Styles.errorText}>{error?.endDate}</Text>
                )}
                <DatePicker
                  mode="date"
                  modal
                  minimumDate={new Date()}
                  open={isDatePickerVisible1}
                  date={endDate != null ? new Date() : new Date()}
                  onConfirm={(date) => {
                    setEndDate(date);
                    setDatePickerVisible1(false);
                    setError((prev) => {
                      return { ...prev, startDate: "" };
                    });
                    setError((prev) => {
                      return { ...prev, endDate: "" };
                    });
                  }}
                  onCancel={() => setDatePickerVisible1(false)}
                />

                <CommonTitleAndText
                  title="Start Time*"
                  text={
                    startTime
                      ? formatTime(startTime
                      .toLocaleString("en-US", { hour12: false })
                      .split(",")[1])
                      : "Select Time"
                  }
                  isIcon
                  isClock
                  onPress={() => {
                    setTimePickerVisible(!isTimePickerVisible);
                  }}
                />
                {error?.startTime ? (
                  <Text style={Styles.errorText}>{error?.startTime}</Text>
                ) : null}
                <DatePicker
                  mode="time"
                  modal
                  open={isTimePickerVisible}
                  date={startTime != null ? startTime : defaultDate}
                  // minimumDate={new Date()}
                  onConfirm={(date) => {
                    const updatedDate = new Date(date);

                    updatedDate.setSeconds(0);
                    console.log("daaa-->",updatedDate,moment(date).format("hh:mm "))
                    setStartTime(updatedDate);
                    setStartTimeSec(date)
                    setTimePickerVisible(false);
                    setError((prev) => {
                      return { ...prev, startTime: "" };
                    });
                    setError((prev) => {
                      return { ...prev, endTime: "" };
                    });
                  }}
                  onCancel={() => setTimePickerVisible(false)}
                />

                <CommonTitleAndText
                  title="End Time*"
                  text={
                    endTime
                      ? formatTime(endTime
                        .toLocaleString("en-US", { hour12: false })
                        .split(",")[1])
                      : "Select time"
                  }
                  isIcon
                  isClock
                  onPress={() => setTimePickerVisible1(true)}
                />
                {error?.endTime ? (
                  <Text style={Styles.errorText}>{error?.endTime}</Text>
                ) : null}
                <DatePicker
                  mode="time"
                  modal
                  open={isTimePickerVisible1}
                  date={endTime != null ? endTime : defaultDate}
                  onDateChange={(time) => {
                    const updatedDate = new Date(time);
                    updatedDate.setSeconds(0);
                    setEndTime(updatedDate);
                  }}
                  onConfirm={(date) => {
                    const updatedDate = new Date(date);
                    updatedDate.setSeconds(0);
                    setEndTime(updatedDate);
                    setEndTimeSec(date)
                    setTimePickerVisible1(false);
                    setError((prev) => {
                      return { ...prev, startTime: "" };
                    });
                    setError((prev) => {
                      return { ...prev, endTime: "" };
                    });
                  }}
                  onCancel={() => setTimePickerVisible1(false)}
                />
                {/* <DatePicker
                  mode="time"
                  modal
                  open={isTimePickerVisible1}
                  date={endTime != null ? endTime : new Date()}
                  minimumDate={new Date()}
                  onConfirm={(date) => {
                    setEndTime(date);
                    setTimePickerVisible1(false);
                    setError((prev) => {
                      return { ...prev, startTime: "" };
                    });
                    setError((prev) => {
                      return { ...prev, endTime: "" };
                    });
                  }}
                  onCancel={() => setTimePickerVisible1(false)}
                /> */}
                {timeError && <Text style={Styles.errorText}>{timeError}</Text>}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <Text style={{ color: "#000" }}>Is Priority Planogram</Text>
                  <Switch
                    value={state.isPriorityPlanogram}
                    onValueChange={(value) => {
                      setState((prev) => {
                        return { ...prev, isPriorityPlanogram: !state.isPriorityPlanogram };
                      });
                    }}
                  />
                </View>
                {returnRecurenceDesign()}

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
                      style={{
                        fontSize: moderateScale(14),
                        fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
                        paddingVertical: moderateScale(8),
                        paddingHorizontal: moderateScale(8),
                        width: "100%",
                        marginLeft: 1,
                        borderRadius: 5,
                        color: "#000000",
                        borderWidth: 1,
                        borderColor: "#00000026",
                      }}
                      placeholder={`Search by Location`}
                      placeholderTextColor={"#00000026"}
                      value={searchLocation}
                      onSubmitEditing={(e) => {
                        searchLocationApi(searchLocation);
                      }}
                      onChangeText={(value) => {
                        setSearchLocation(value);
                        searchLocationApi(value);
                      }}
                    />
                    {locationData1 && (
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
                        devices selected
                      </AppText>
                      <View style={Styles.iconContainer}>
                        <Pressable
                          style={{
                            backgroundColor:showGroupOrMedia=="group"?themeColor.appBackground:"white",
                            padding:5
                          }}
                          onPress={() => {
                            setShowGroupOrMedia("group");
                          }}
                        >
                          <FontAwesome
                            name={"navicon"}
                            size={25}
                            color={showGroupOrMedia=="group"? themeColor.themeColor:"grey"}
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
                              height: 35,
                              width: 35,
                              tintColor: showGroupOrMedia=="device"?themeColor.themeColor:"grey",
                              backgroundColor:showGroupOrMedia=="device"?themeColor.appBackground:"white",
                              marginLeft:5
                            }}
                          />
                        </Pressable>
                      </View>
                    </View>
                    <TextInput
                      style={{
                        fontSize: moderateScale(14),
                        fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
                        paddingVertical: moderateScale(8),
                        paddingHorizontal: moderateScale(8),
                        width: "95%",
                        borderRadius: 5,
                        color: "#000000",
                        borderWidth: 1,
                        borderColor: "#00000026",
                        marginVertical: 10,
                        alignSelf: "center",
                      }}
                      placeholder={
                        showGroupOrMedia == "group"
                          ? `Search by Device Group`
                          : `Search by Device list`
                      }
                      placeholderTextColor={"#00000026"}
                      value={searchtext}
                      onSubmitEditing={(e) => {
                        makeUrlData(showGroupOrMedia);
                      }}
                      onChangeText={(value) => {
                        setsearchtext(value);
                        makeUrlData(showGroupOrMedia);
                      }}
                    />
                    {showGroupOrMedia == "group" ? (
                      <View style={Styles.deviceBodyContainer}>
                        {deviceGroupData&&deviceGroupData.length>0 ?
                          deviceGroupData?.map((item, dIndex) => {
                            return (
                              <View key={dIndex + "device"}>
                                <CustomIconText
                                  onPress={() => {
                                    btnAddDeviceGroup(item.deviceGroupId);
                                  }}
                                  name={item.deviceGroupName}
                                  containerStyle={{maxWidth:"95%"}}
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
                          }):<View style={{padding:10}}>
                              <AppText style={{color:"gray"}}>No Device Group Found</AppText>
                            </View>
                        }
                      </View>
                    ) : (
                      <View style={Styles.deviceBodyContainer}>
                        {deviceData&&deviceData.length ?
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
                          }):<View style={{padding:10}}>
                          <AppText style={{color:"gray"}}>No Device Found</AppText>
                        </View>}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          )}
          {currentSection === 2 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>
                SELECT A CAMPAIGN/CAMPAIGN STRING
              </AppText>
              <Separator />
              <View style={Styles.subHeaderText}>
                <Pressable
                  onPress={() => setCampaignType(0)}
                  style={[Styles.searchHeaderView(campaignType === 0)]}
                >
                  <AppText
                    style={[Styles.searchHeaderText(campaignType === 0)]}
                  >{`Campaign (${state.campaigns.length})`}</AppText>
                </Pressable>

                <Pressable
                  onPress={() => setCampaignType(1)}
                  style={[Styles.searchHeaderView(campaignType === 1)]}
                >
                  <AppText
                    style={[Styles.searchHeaderText(campaignType === 1)]}
                  >{`Campaign Strings (${state.campaignString.length})`}</AppText>
                </Pressable>
              </View>
              <View style={{ marginHorizontal: moderateScale(15),alignItems:"center",}}>
                {campaignType == 0 ? (
                  <>
                    <>
                      <SearchBox
                        placeholder="Search by Campaign"
                        isIcon
                        stateValue={campaignSearch}
                        containerStyle={Styles.searchCategoryStyle}
                        changeText={(txt) => {
                          onChangeCampaignSearch(txt);
                        }}
                        iconStyle={{
                          height: moderateScale(15),
                          width: moderateScale(15),
                        }}
                        inputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                      {state.campaigns.length <= 0 ? (
                        <AppText style={Styles.dateText}>
                          {`No data found`}
                        </AppText>
                      ) : (
                        <View style={{width:'100%'}}>
                            <FlatList
                              scrollEnabled={false}
                              numColumns={2}
                              data={state.campaigns}
                              renderItem={renderCampaign}
                            />
                        </View>
                        
                      )}
                    </>
                  </>
                  ) : (
                    <>
                      <>
                        <SearchBox
                          placeholder="Search by Campaign String"
                          isIcon
                          changeText={(txt) => {
                            onChangeCampaignStringSearch(txt);
                          }}
                          stateValue={campaignStringSearch}
                          containerStyle={Styles.searchCategoryStyle}
                          iconStyle={{
                            height: moderateScale(15),
                            width: moderateScale(15),
                          }}
                          inputStyle={{
                            fontSize: moderateScale(15),
                          }}
                        />
                        {state.campaignString.length <= 0 ? (
                          <AppText style={Styles.dateText}>
                            {`No data found`}
                          </AppText>
                        ) : (
                          <View style={{width:'100%'}}>
                            <FlatList
                              scrollEnabled={false}
                              numColumns={2}
                              data={state.campaignString}
                              renderItem={renderCampaign}
                            />
                          </View>
                        )}
                      </>
                    </>
                  )
                }
              </View>
              <View style={{padding:16}}>
              {campaignType == 0 && state.selectedCampaign.length>0 ? (
                <>
                  <AppText style={{ color: "black", fontSize:moderateScale(18) ,marginVertical:5 }}>
                    Selected Campaigns
                  </AppText>
                  
                  <View style={{marginBottom:10,width:"100%"}}>
                    <Separator/>
                  </View>
                  <View style={{alignItems:"center"}}>
                    <FlatList
                      scrollEnabled={false}
                      numColumns={1}
                      data={state.selectedCampaign.map((id) => state.campaigns.find((item) => item.campaignId === id))}
                      renderItem={RemoveCampaign}
                      
                    />
                  </View>
                </>
              ) : (
                campaignType == 1 &&state.selectedCampaignString.length>0&&(
                  <>
                  <AppText style={{ color: "black", fontSize:moderateScale(18) ,marginVertical:5 }}>
                    Selected Campaign Strings
                  </AppText>
                  
                  <View style={{marginBottom:10,width:"100%"}}>
                    <Separator/>
                  </View>
                  <View style={{alignItems:"center"}}>
                  <FlatList
                    scrollEnabled={false}
                    numColumns={1}
                    data={[...state.selectedCampaignString.map((id) => state.campaignString.find((item) => item.campaignStringId === id))]}
                    renderItem={RemoveCampaign}
                  />
                  </View>
                </>
                )
              )}
              </View>
            </View>
          )}
          {currentSection === 3 && (
            <View style={Styles.bodyContainer}>
              <AppText style={Styles.bodyHeaderText}>
                Review Planogram Priority
              </AppText>
              <Separator />
              <View style={Styles.subHeaderText}>
                {/* <Pressable onPress={() =>  setCampaignType(0)} style={[Styles.searchHeaderView(campaignType === 0)]}>
                <AppText style={[Styles.searchHeaderText(campaignType === 0)]}>{`Campaign (${state.pCamp.length})`}</AppText>
              </Pressable>

              <Pressable onPress={() =>  setCampaignType(1)} style={[Styles.searchHeaderView(campaignType === 1)]}>
                <AppText style={[Styles.searchHeaderText(campaignType === 1)]}>{`Campaign Strings (${state.pCampStr.length})`}</AppText>
              </Pressable> */}
              </View>
              {state.planogramPriorityList?.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  scrollEnabled={scrollenable}
                >
                  <NestableScrollContainer>
                    <NestableDraggableFlatList
                      data={state.planogramPriorityList}
                      renderItem={renderCampaignList}
                      keyExtractor={(item) => item.key}
                      onDragBegin={() => {
                        setscrollenable(false);
                      }}
                      onRelease={() => {
                        setscrollenable(true);
                      }}
                      onDragEnd={({ data }) => {
                        setscrollenable(true);
                        setState({ ...state, planogramPriorityList: data });
                      }}
                      ListHeaderComponent={renderCampaignHeader}
                    />
                  </NestableScrollContainer>
                </ScrollView>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <ActionContainer
        isContinue={currentSection === 2}
        draftText={currentSection === 1 ? "Reset" : undefined}
        continueText={
          currentSection === 2 ? "Continue & Review" : "Send For Approval"
        }
        cancelText={currentSection > 0 ? "Go Back" : "Cancel"}
        saveText={
          currentSection === 3 &&
          workFlow &&
          (workFlow?.approverWorkFlow === "PLANOGRAM" ||
            workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN")
            ? "Send for approval"
            : "Save & Next"
        }
        numOfButtons={3}
        onPressSave={() => {
          if (currentSection == 0) {
            if (iseditname == true) {
              handlePlonogram1("SUBMITTED");
            }
            else
            {
              handlePlonogram("SUBMITTED");
            }
           
          } else if (currentSection == 1) {
            btnSubmitDeviceGroup();
          } else if (currentSection == 2) {
            btnSubmitCampainPlanogram();
          } else if (currentSection == 3) {
            btnSubmitPlanogramPriority("SUBMITTED");
          } else {
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
          if (currentSection == 3) {
            btnSubmitPlanogramPriority("DRAFT");
          }
        }}
        onPressCancel={() => {
          if (currentSection === 0 ) {
            navigation.goBack();
          } 
          if (currentSection === 1 ) {
            setiseditname(true);
            setCurrentSection(currentSection - 1);
          } 
          else {
            setCurrentSection(currentSection - 1);
          }
        }}
      />
    </View>
  );
};
export default AddNewPlanogram;
