import React, { useRef, useState, useEffect } from "react";
import {
  FlatList,
  Text,
  Image,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Pressable,
  View,
  BackHandler,
  Dimensions,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import moment from "moment";
import LocationsListForPlanogram from "../../Components/Organisms/Dashboard/LocationsListForPlanogram";
import DatePicker from "react-native-date-picker";
import {
  SchedulerManagerService,
  getDeviceByLocation,
  getDeviceGroupByLocation,
  getLocationList,
} from "../Scheduler/SchedulerApi";

import { getResolutionData } from "../../Services/AxiosService/ApiService";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AppIcon from "../../Assets/Images/PNG/application.png";
import LeftArr from "../../Assets/Images/PNG/left_arr.png";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import AppText from "../../Components/Atoms/CustomText";
import CustomIconText from "../../Components/Atoms/IconText";
import Separator from "../../Components/Atoms/Separator";
import SubHeaderText from "../../Components/Atoms/SubHeaderText";
import SelectCampaignModal from "../../Components/Organisms/CMS/Scheduler/selectCampaignModal";
import { LocalDate1, moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CommonStyles from "./style";
import { Dropdown } from "react-native-element-dropdown";
import BurgerImage from "../../Assets/Images/PNG/burger.jpeg";
import ViewImageModal from "../../Components/Atoms/ViewImageModal";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import { locationData } from "../../Components/Organisms/Dashboard/LocationData";
import { useSelector } from "react-redux";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { all } from "axios";
import { start } from "repl";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import { convertSecondsToMinutes } from "../../Constants/asyncConstants";

const AddScheduler = ({ navigation }) => {
  const [availablesss, setavailablesss] = useState(0);
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);
  const [showpublishbtn, setshowpublishbtn] = useState(false);
  const [showGroupOrMedia, setShowGroupOrMedia] = useState("group");
  const [currentSection, setCurrentSection] = useState(0);
  const [searchType, setSearchType] = useState("location");
  const [modal, setModal] = useState();
  const [selectedCampaign, setSelectedCampaign] = useState(false);
  const [imageView, setImageView] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [isTimePickerVisible1, setTimePickerVisible1] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [addcampvalue, setaddcampvalue] = useState([]);
  const [endTime, setEndTime] = useState(null);
  const [searchtext, setsearchtext] = useState("");
  const [plonogramError, setPlonogramError] = useState("");
  const [plonogramError2, setPlonogramError2] = useState("");
  const [dateError, setDateError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [dateError1, setDateError1] = useState("");
  const [dateError2, setDateError2] = useState("");
  const [timeError1, setTimeError1] = useState("");
  const [timeError2, setTimeError2] = useState("");

  const [searchLocation, setSearchLocation] = useState("");
  const [iseditname, setiseditname] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ratiovalue, setRatiovalue] = useState("");

  const [showcampmodal, setshowcampmodal] = useState(false);
  const [choosedata, setchoosedata] = useState({});

  const [selcampName, setselCampName] = useState({});

  const [deviceab, setdeviceab] = useState(0);
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  const [locationData, setLocationData] = useState(locationData1);
  const deviceGroupData1 = useSelector(
    (state) => state.CommonReducer.deviceGroupData
  );

  const [deviceGroupData, setdeviceGroupData] = useState([...deviceGroupData1]);

  const deviceData1 = useSelector((state) => state.CommonReducer.deviceData);
  const [deviceData, setdeviceData] = useState([...deviceData1]);

  const [successModal, setSuccessModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [chooseDataTimePick, setchooseDataTimePick] = useState(false);

  const [chooseDataTimePickEnd, setchooseDataTimePickEnd] = useState(false);

  const [campaignType, setCampaignType] = useState(0);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const defaultDate = new Date();
  defaultDate.setHours(0);
  defaultDate.setMinutes(0);

  const headers = [
    "Add Scheduler Details",
    "Select Media Player/Device",
    "Select Campaigns",
  ];
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [state, setState] = useState({
    selectedDeviceGroups: [],
    selectedDevice: [],
    deviceLogicData: null,
    ratioId: null,
    planogramId: null,
    planogramData: null,
    campaignString: [],
    campaigns: [],
    selectedCampaign: [],
    selectedCampaignString: [],
    pCamp: [],
    pCampStr: [],
    planogramPriorityList: [],
  });

  const [ratioId, setratioId] = useState({
    id: "",
    name: "",
  });
  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );

  const isDeviceCheked = (id) => {
    if (state?.selectedDevice?.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        navigation.goBack();
      }
    );
  }, [navigation]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onComplete = () => {
    setSuccessModal(false);
  };

  const searchLocationApi = async (searchLoc) => {
    const slugId = await getStorageForKey("slugId");

    // setIsLoading(true);
    const successCallBack = async (response) => {
      console.log("location", response.data.childNode);
      setLocationData(response.data[0]);
      setIsLoading(false);
    };

    const errorCallBack = (error) => {
      setIsLoading(false);
      if (error?.message) {
        // Alert.alert("Error","No Location Found");
        Alert.alert("Error", error.response.data.message);
      }
    };

    SchedulerManagerService.fetchLocationListSearch(
      { slugId, searchLoc },
      successCallBack,
      errorCallBack
    );
  };

  useEffect(() => {
    getLocationList();
    getDevicesAndDevicesGroup(selectedLocations);
  }, [selectedLocations]);

  let getDevicesAndDevicesGroup = async (selectedLocations) => {
    setState({ ...state, selectedDeviceGroups: [], selectedDevice: [] });
    let params = {
      ids: selectedLocations,
    };
    getDeviceGroupByLocation(params, setIsLoading);
    getDeviceByLocation(params, setIsLoading);
  };

  useEffect(() => {
    getResolutionData(setIsLoading);
  }, []);

  const handleDropdownChange = (item) => {
    setratioId({
      ...ratioId,
      id: item.value,
      name: item.lebel,
    });
  };

  const resetLocationAndGroupDevice = () => {
    setState({ ...state, selectedDeviceGroups: [] });
    setSelectedLocations([]);
  };

  const btneditscheduler = async (status) => {
    let slugId = await getStorageForKey("slugId");

    let hasError = false;
    if (!title.trim() || title === "") {
      setPlonogramError("Please Enter Scheduler Event Title");
      hasError = true;
    } else {
      setPlonogramError("");
    }

    if (!state?.ratioId) {
      setPlonogramError2("Please Select Aspect Ratio");
      hasError = true;
    } else {
      setPlonogramError2("");
    }
    if (startDate == null) {
      setDateError1("Please Select Start Date");
      hasError = true;
    } else {
      setDateError1("");
    }
    if (endDate == null) {
      setDateError2("Please Select End Date");
      hasError = true;
    } else {
      setDateError2("");
    }

    if (startTime == null) {
      setTimeError1("Please Select Start Time");
      hasError = true;
    } else {
      setTimeError1("");
    }
    if (endTime == null) {
      setTimeError2("Please Select End Time");
      hasError = true;
    } else {
      setTimeError2("");
    }

    if (startDate.toLocaleDateString() == new Date().toLocaleDateString()) {
      const formattedTime1 = moment(
        startTime.toLocaleTimeString(),
        "hh:mm:ss A"
      );
      const formattedTime2 = moment(
        new Date().toLocaleTimeString(),
        "hh:mm:ss A"
      );
      if (formattedTime1.isBefore(formattedTime2)) {
        hasError = true;
        setTimeError1("Start Time should be greater than current time");
      } else if (
        startDate.toLocaleDateString() == endDate.toLocaleDateString()
      ) {
        if (startTime >= endTime) {
          setTimeError("Start time should be earlier than end time");

          hasError = true;
        }
      }
    } else if (startDate.toLocaleDateString() > endDate.toLocaleDateString()) {
      setDateError1("Start date should be earlier than end date");
      hasError = true;
    } else if (startDate.toLocaleDateString() == endDate.toLocaleDateString()) {
      if (startTime >= endTime) {
        setTimeError("Start time should be earlier than end time");
        hasError = true;
      }
    } else {
      hasError = false;
      setTimeError("");
    }

    if (hasError) return false;

    const params = {
      slugId: slugId,
      planogramId: state.planogramId,
      data: {
        state: "DRAFT",
        title: title,
        aspectRatioId: state?.ratioId,
        startTime: moment(startTime).add(1, "seconds").format("HH:mm:ss"),
        endTime: endTime
          .toLocaleString("en-US", { hour12: false })
          .split(",")[1]
          .trim(),
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      },
    };

    const succussCallBack = async (response) => {
      if (response?.status == "SUCCESS") {
        setSuccessMsg(response.message);
        setSuccessModal(true);
        if (status == "DRAFT") {
          navigation.goBack();
        } else {
          setState((prev) => {
            return { ...prev, planogramId: response?.result?.planogramId };
          });
          setState((prev) => {
            return { ...prev, planogramData: response?.result };
          });

          setavailablesss(response?.result?.availableSlots);
        }
        setCurrentSection(1);
      } else if (response?.status == "ERROR") {
        Alert.alert("Error!", response.message, [
          { text: "Okay", onPress: () => {} },
        ]);
      }
    };
    const failureCallBack = (error) => {};

    SchedulerManagerService.editschedduler(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnaddchedular = async (status) => {
    let slugId = await getStorageForKey("slugId");

    let hasError = false;
    if (!title.trim() || title === "") {
      setPlonogramError("Please Enter Scheduler Event Title");
      hasError = true;
    } else {
      setPlonogramError("");
    }

    if (!state?.ratioId) {
      setPlonogramError2("Please Select Aspect Ratio");
      hasError = true;
    } else {
      setPlonogramError2("");
    }
    if (startDate == null) {
      setDateError1("Please Select Start Date");
      hasError = true;
    } else {
      setDateError1("");
    }
    if (endDate == null) {
      setDateError2("Please Select End Date");
      hasError = true;
    } else {
      setDateError2("");
    }

    if (startTime == null) {
      setTimeError1("Please Select Start Time");
      hasError = true;
    } else {
      setTimeError1("");
    }
    if (endTime == null) {
      setTimeError2("Please Select End Time");
      hasError = true;
    } else {
      setTimeError2("");
    }

    if (startDate.toLocaleDateString() == new Date().toLocaleDateString()) {
      const formattedTime1 = moment(
        startTime.toLocaleTimeString(),
        "hh:mm:ss A"
      );
      const formattedTime2 = moment(
        new Date().toLocaleTimeString(),
        "hh:mm:ss A"
      );
      if (formattedTime1.isBefore(formattedTime2)) {
        hasError = true;
        setTimeError1("Start Time should be greater than current time");
      } else if (
        startDate.toLocaleDateString() == endDate.toLocaleDateString()
      ) {
        if (startTime >= endTime) {
          setTimeError("Start time should be earlier than end time");

          hasError = true;
        }
      }
    } else if (startDate.toLocaleDateString() > endDate.toLocaleDateString()) {
      setDateError1("Start date should be earlier than end date");
      hasError = true;
    } else if (startDate.toLocaleDateString() == endDate.toLocaleDateString()) {
      if (startTime >= endTime) {
        setTimeError("Start time should be earlier than end time");
        hasError = true;
      }
    } else {
      hasError = false;
      setTimeError("");
    }

    if (hasError) return false;

    let postData = {
      title: title,
      aspectRatioId: state?.ratioId,
      startTime: moment(startTime).add(1, "seconds").format("HH:mm:ss"),

      startDate: startDate.toLocaleDateString().split("/").reverse().join("-"),
      endTime: endTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      endDate: endDate.toLocaleDateString().split("/").reverse().join("-"),
      state: "DRAFT",
    };

    console.log("opopop post", postData);
    const params = {
      data: postData,
      slugId: slugId,
    };

    const succussCallBack = async (response) => {
      console.log("sched add response", JSON.stringify(response));
      if (response?.status == "SUCCESS") {
        setSuccessMsg(response.message);
        setSuccessModal(true);
        if (status == "DRAFT") {
          navigation.goBack();
        } else {
          setState((prev) => {
            return { ...prev, planogramId: response?.result?.planogramId };
          });
          setState((prev) => {
            return { ...prev, planogramData: response?.result };
          });

          setavailablesss(response?.result?.availableSlots);

          // getDeviceLogic(response?.data?.planogramId);
        }
        setCurrentSection(1);
      } else if (response?.status == "ERROR") {
        Alert.alert("Error!", response.message);
      } else if (response.hasOwnProperty("error")) {
        Alert.alert("Error", response.error);
      }
    };

    const failureCallBack = (error) => {
      console.log("error in schedul;er creation");
    };

    SchedulerManagerService.addschedduler(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
    ratioId: resolution.aspectRatioId,
    campaignTitle: resolution.campaignTitle,
    id: resolution.campaignId,
  }));

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
      console.log("campaignAddArchiveError", error);
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

  const getCampaigns = async (id) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      palamid: id,
    };
    const succussCallBack = async (response) => {
      console.log("getCampaigns--->", JSON.stringify(response));
      if (response.status == "SUCCESS" && response?.result.length > 0) {
        console.log(
          "getCampaigns--->",
          JSON.stringify(response?.result.length)
        );
        setaddcampvalue(response.result);
      }
      setIsLoading(false);
    };
    const failureCallBack = (error) => {
      setIsLoading(false);
    };
    setIsLoading(true);

    SchedulerManagerService.getCampaigns(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const updateCamapign = async () => {
    let slugId = await getStorageForKey("slugId");
    let hasError = false;
    if (choosedata.hasOwnProperty("occurance")) {
      if (choosedata?.occurance <= 0) {
        hasError = true;
        Alert.alert("Alert", "Please enter occurence greater than 0");
        return;
      }
    }
    // if (choosedata.hasOwnProperty("priority")) {
    //   console.log("priority", choosedata?.priority);
    //   if (choosedata?.priority === "" || choosedata?.priority == 0) {
    //     Alert.alert("Alert", "Please enter priority greater than 0");
    //     hasError = true;
    //     return;
    //   }
    // }

    let postData = {
      campaignId: choosedata.campaignId,
      planogramId: choosedata.planogramId,
      occurance: String(choosedata.occurance),
      priority: choosedata.priority,
      startTime: moment(startTime).add(1, "seconds").format("HH:mm:ss"),
      endTime: endTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      startDate: startDate
        .toLocaleDateString()
        .split("/")
        .reverse("")
        .join("-"),
      endDate: endDate.toLocaleDateString().split("/").reverse("").join("-"),
    };

    var endPointurl = `capsuling-service/api/capsuling/updateCampaign/${choosedata.planogramId}`;

    const params = {
      data: postData,
      id: choosedata.slotId,
      slugId: slugId,
    };

    const succussCallBack = async (response) => {
      setIsLoading(false);
      console.log("updateCampaginById sucess", JSON.stringify(response));
      if (response?.status == "SUCCESS") {
        setSuccessMsg(response.message);
        setSuccessModal(true);
        setshowcampmodal(false);
        planogramCampaignStringList();
        setavailablesss(response.result.availableSlots);
        getCampaigns(choosedata.planogramId);
        //     getPlanogramDetails(choosedata.planogramId);
      } else {
        alert(response?.message);
      }
    };
    const failureCallBack = (error) => {
      console.log("updateCampaginById eror", error.response.data);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else if (error.response.data.hasOwnProperty("message")) {
        Alert.alert("Error", error.response.data.message);
      } else {
        alert(error?.message);
      }
    };

    console.log("update camap params-->", JSON.stringify(params));

    if (!hasError) {
      console.log("passe");
      setIsLoading(true);
      SchedulerManagerService.updateCampaginById(
        params,
        succussCallBack,
        failureCallBack
      );
    } else {
      console.log("falised");
      return false;
    }
  };

  const btnSubmitCampainPlanogram = async () => {
    console.log("btnSubmitCampainPlanogram");
    let slugId = await getStorageForKey("slugId");
    let hasError = false;
    if (selectedCampaign == false) {
      Alert.alert("Alert", "Please select campaign");
      hasError = true;
    } else if (occurance === "" || occurance <= 0) {
      console.log("opopopo======>", state.selectedCampaign.campaignId);
      if (occurance <= 0) {
        Alert.alert("Alert", "Please enter occurence greater than 0");
      } else {
        alert("Please enter occurrence");
      }
      hasError = true;
    }
    // else if (priority === "" || priority <= 0) {
    //   if (priority <= 0) {
    //     Alert.alert("Alert", "Please enter priority greater than 0");
    //     // setPlonogramError2("Please enter priority greater than 0");
    //   } else if (priority === "") {
    //     alert("Please enter priority");
    //     console.log("Please enter priority");
    //     setPlonogramError2("Please enter priority");
    //   }

    //   hasError = true;
    // }

    if (hasError) {
      console.log("has error");
      return false;
    }

    let postData = {
      campaignId: state.selectedCampaign.campaignId,
      planogramId: state.planogramId,
      occurance: occurance,
      startTime: startTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      startDate: startDate.toLocaleDateString().split("/").reverse().join("-"),
      endTime: endTime
        .toLocaleString("en-US", { hour12: false })
        .split(",")[1]
        .trim(),
      endDate: endDate.toLocaleDateString().split("/").reverse().join("-"),
      // priority: priority,
      priority: 1,
    };

    const params = {
      data: postData,
      slugId: slugId,
    };

    const succussCallBack = async (response) => {
      console.log("response addcapm sch211", JSON.stringify(response));
      if (response?.status == "SUCCESS") {
        setSelectedCampaign(false);
        setaddcampvalue([...addcampvalue, response.result]);
        setshowpublishbtn(true);
        setState({ ...state, selectedCampaign: [] });
        setavailablesss(response?.result?.availableSlots);
        setoccurance("");
        setpriority("");

        setSuccessMsg(response.message);
        setSuccessModal(true);
        setSelectedCampaign(false);
        if (response.result.planogramId) {
          getCampaigns(response.result.planogramId);
        } else if (state.planogramId) {
          getCampaigns(state.planogramId);
        }

        // Alert.alert('Alert!', response.message);
      } else if (response?.status == "ERROR") {
        Alert.alert("Error!", response.message);
      } else if (response.hasOwnProperty("error")) {
        Alert.alert("Error", response.error + "," + response.status);
      }
    };
    const failureCallBack = (error) => {
      setSelectedCampaign(false);
      Alert.alert("Error", error.response.data.message);
    };
    console.log("params==>sche", JSON.stringify(params));
    SchedulerManagerService.createcampiegn(
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
      console.log("getDeviceLogic succuss", response);
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      console.log("getDeviceLogic error", error);
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

  const getDateFormat = (date, format) => {
    let formated_date = "";
    if (format == "DD-MM-YYYY") {
      formated_date = (
        (date.getDate().toString().length <= 1
          ? "0" + date.getDate()
          : date.getDate()) +
        "-" +
        ((date.getMonth() + 1).toString().length <= 1
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        date.getFullYear()
      ).toString();
    } else if (format == "YYYY-MM-DD") {
      formated_date = (
        date.getFullYear() +
        "-" +
        ((date.getMonth() + 1).toString().length <= 1
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate().toString().length <= 1
          ? "0" + date.getDate()
          : date.getDate())
      ).toString();
    }
    return formated_date;
  };

  const planogramCampaignStringList = async () => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      palamid: state.planogramId,
    };
    const succussCallBack = async (response) => {
      if (response && response.result) {
        setState((prev) => {
          return { ...prev, campaignString: response.result };
        });
      }
      setIsLoading(false);
    };

    const failureCallBack = (error) => {
      console.log("mhehee", error);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    SchedulerManagerService.getCampaignStringByAspectRatio(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const planogramCampaignList = async () => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("campaign------", response);
      if (response && response.data) {
        console.log("response.data", response.data);
        setState((prev) => {
          return { ...prev, campaigns: response.data };
        });
      }
      setIsLoading(false);
    };

    const failureCallBack = (error) => {
      console.log("error", error);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };

    SchedulerManagerService.getCampaignByAspectRatio(
      state.ratioId,
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnSubmitDeviceGroup = async () => {
    if (
      state.selectedDeviceGroups.length <= 0 &&
      state.selectedDevice.length <= 0
    ) {
      alert("Please select device or device group");
      return false;
    }
    let device_logic = "";
    let concatenatedString = "";
    if (state.selectedDevice.length > 0) {
      concatenatedString = state.selectedDevice
        .map((item, index) => {
          if (index === state.selectedDevice.length - 1) {
            return `deviceIds=${item}`;
          } else {
            return `deviceIds=${item}&`;
          }
        })
        .join("");

      device_logic = "DEVICES";
    } else if (
      state.selectedDeviceGroups.length > 0 &&
      state.selectedDevice.length > 0
    ) {
      let concatenatedString2 = state.selectedDevice
        .map((item, index) => {
          if (index === state.selectedDevice.length - 1) {
            return `deviceIds=${item}`;
          } else {
            return `deviceIds=${item}&`;
          }
        })
        .join("");
      let concatenatedString1 = state.selectedDeviceGroups
        .map((item, index) => {
          if (index === state.selectedDeviceGroups.length - 1) {
            return `deviceGroupIds=${item}`;
          } else {
            return `deviceGroupIds=${item}&`;
          }
        })
        .join("");
      concatenatedString = concatenatedString2 + concatenatedString1;

      device_logic = "LOCATIONS_AND_DEVICE_GROUPS";
    } else if (state.selectedDeviceGroups.length > 0) {
      concatenatedString = state.selectedDeviceGroups
        .map((item, index) => {
          if (index === state.selectedDeviceGroups.length - 1) {
            return `deviceGroupIds=${item}`;
          } else {
            return `deviceGroupIds=${item}&`;
          }
        })
        .join("");
      device_logic = "DEVICE_GROUPS";
    }
    let slugId = await getStorageForKey("slugId");
    let postData1 = {
      slugId: slugId,
      planogramId: state.planogramId,
      postData: concatenatedString,
    };

    setIsLoading(true);
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response?.status == "SUCCESS") {
        setdeviceab(response?.result?.length);
        planogramCampaignStringList();
        setSuccessMsg("Scheduler device added successfully");
        setSuccessModal(true);
        if (currentSection !== 3) {
          setTimeout(() => {
            setCurrentSection(currentSection + 1);
          }, 1000);
        }
      } else {
        if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };
    const failureCallBack = (error) => {
      console.log("btnSubmitDeviceGroup error", error);
      setIsLoading(false);
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
    };
    console.log("SchedulerManagerService postData1", JSON.stringify(postData1));
    SchedulerManagerService.updateDeviceLogicPlanogram(
      postData1,
      succussCallBack,
      failureCallBack
    );
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

  const onDragEnd = (data) => {
    console.log(data);
    setaddcampvalue(data);
  };

  const isGroupDeviceCheked = (id) => {
    if (state?.selectedDeviceGroups?.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  const [startDate, setStartDate] = useState(null);
  const [startDate1, setStartDate1] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [title, setTitle] = useState("");
  const [occurance, setoccurance] = useState("");
  const [priority, setpriority] = useState("");
  let [data, setData] = useState(locationData);
  const handleDateChange = (date) => {
    setStartDate(date);
  };

  const scrollRef = useRef(null);

  useEffect(() => {
    setdeviceData(deviceData1);
  }, [deviceData1]);

  useEffect(() => {
    setdeviceGroupData(deviceGroupData1);
  }, [deviceGroupData1]);

  useEffect(() => {
    scrollRef.current._listRef._scrollRef.scrollTo({
      x: 200 * currentSection,
      animated: true,
    });
  }, [currentSection]);

  const handleDateChange1 = (date) => {
    console.log("end date change", date);
    setEndDate(date);
    setDateError2("");
    setDatePickerVisible1(false);
  };

  const handleTimeChange = (date) => {
    const mDate = new Date(date).getSeconds();
    const changeDate = mDate + 1;
    setStartTime(date);
    setTimeError1("");
    setTimePickerVisible(false);
  };

  const handleTimeChange1 = (date) => {
    setEndTime(date);
    setTimeError2("");
    setTimePickerVisible1(false);
  };

  const fetchmediaid = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      campid: id,
    };
    setIsLoading(true);
    const succussCallBack = async (response) => {
      if (response && response.data) {
        setIsLoading(true);
        console.log(
          "line 1180--->",
          response?.data?.regions[0].globalRegionContentPlaylistContents[0]
        );
        fetchmediaid1(
          response?.data?.regions[0].globalRegionContentPlaylistContents[0]
            .contentId
        );
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      consolr.log("log 1189", error);
      alert(error?.message);
    };

    SchedulerManagerService.fetchmediaid(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const fetchmediaid1 = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      mediaid: id,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response && response.message == "success") {
        console.log("line 122214-->", JSON.stringify(response?.data));
        setselCampName(response?.data);
        setshowcampmodal(true);
        setIsLoading(false);
      }
    };

    const failureCallBack = (error) => {
      console.log("line 12223 error-->", JSON.stringify(error?.response.data));
      alert(error?.message);
      setIsLoading(false);
    };

    SchedulerManagerService.fetchmediaiddetails(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const RemoveCampaign = ({ item, index, drag }) => {
    const ind = index;
    if (campaignType == 0) {
      return (
        <TouchableOpacity onLongPress={drag}>
          <View
            style={{
              width: Dimensions.get("window").width * 0.85,
              backgroundColor: "white",
              borderWidth: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderRadius: 10,
              paddingLeft: 16,
              paddingRight: 5,
              height: 60,
              marginVertical: 5,
            }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {String(item?.camapignName)}
              </Text>
              <Text
                style={{ color: "black", textAlign: "center" }}
                numberOfLines={1}
              >
                Occurence :{String(item?.occurance)}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                borderWidth: 0,
                height: 38,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
              onPress={(index) => {
                fetchmediaid(item.campaignId);
                setchoosedata(item);
              }}
            >
              <MaterialIcons
                name="edit"
                size={20}
                color={themeColor.themeColor}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onLongPress={drag}>
          <View
            style={{
              width: Dimensions.get("window").width * 0.85,
              backgroundColor: "white",
              borderWidth: 1,
              height: 60,
              borderRadius: 10,
              paddingLeft: 16,
              paddingRight: 5,
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 5,
            }}
          >
            <View style={{ alignItems: "flex-start" }}>
              <Text
                style={{
                  color: "black",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {String(item?.camapignName)}
              </Text>
              <Text
                style={{ color: "black", textAlign: "center" }}
                numberOfLines={1}
              >
                Occurence :{String(item?.occurance)}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                borderWidth: 0,
                height: 38,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={(index) => {
                console.log("close", ind);
              }}
            >
              <Entypo name="cross" color="#000" size={25} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  const [dl_min_date, setDLMinDate] = useState(new Date());

  const changeddd = (date) => {
    console.log(date, "fnjfejbfjbjfte");
  };

  const handleConfirm = (date) => {
    console.log(date);
    setStartDate(date);
    setDateError1("");
    hideDatePicker();
    // Additional logic or actions after confirming the date
  };

  const minDate = new Date();

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      {showcampmodal && (
        <Modal
          showcampmodal
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <View style={Styles.mainContainer}>
              <View
                style={[
                  Styles.imageContainerView,
                  { marginTop: 20, paddingTop: 20 },
                ]}
              >
                <View style={{ paddingTop: 20 }}></View>
                <TouchableOpacity
                  onPress={() => setshowcampmodal(false)}
                  style={[
                    Styles.closeStyle,
                    { alignItems: "flex-end", marginRight: 20 },
                  ]}
                >
                  <Ionicons
                    name="close"
                    size={22}
                    color={"black"}
                    style={{
                      textAlign: "center",
                      textAlignVertical: "center",
                      height: 30,
                      width: 30,
                      fontWeight: "black",
                    }}
                  />
                </TouchableOpacity>
              </View>

              <View style={Styles.bodyContainer}>
                <View style={Styles.campaignHeader}>
                  <AppText
                    style={[
                      Styles.bodyHeaderText,
                      {
                        fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
                        fontWeight: 700,
                      },
                    ]}
                  >
                    SELECTED CAMPAIGN
                  </AppText>
                  <AppText style={Styles.slotsText}>
                    {"Available slots:"}
                    {availablesss}
                    {"\n"}
                    {"(Devices:"}
                    {deviceab}
                    {")"}
                  </AppText>
                </View>
                <Separator />
                <View style={Styles.uploadFileHere}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        padding: 10,
                        width: "40%",
                        marginHorizontal: moderateScale(10),
                      }}
                    >
                      {selcampName?.mediaDetails != null ? (
                        <Image
                          source={{
                            uri: selcampName?.mediaDetails[0].thumbnailUrl,
                          }}
                          style={{
                            height: moderateScale(100),
                            width: moderateScale(100),
                            borderRadius: moderateScale(10),
                          }}
                        />
                      ) : (
                        <View style={{ width: 40, height: 50 }} />
                      )}
                      <TouchableOpacity
                        onPress={() => setshowcampmodal(false)}
                        style={{
                          position: "absolute",
                          top: moderateScale(0),
                          right: moderateScale(0),
                          backgroundColor: "white",
                          borderRadius: moderateScale(15),
                          borderWidth: moderateScale(2),
                          borderColor: themeColor.unselectedText,
                        }}
                      >
                        <Ionicons
                          name="close"
                          size={20}
                          color={themeColor.unselectedText}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ width: "60%" }}>
                      <AppText style={[Styles.fileName]}>
                        Name: {choosedata.camapignName}
                      </AppText>
                      <AppText style={[Styles.fileName, { color: "black" }]}>
                        {"Duration:"}
                        {choosedata?.campaignDuration
                          ? convertSecondsToMinutes(
                              choosedata?.campaignDuration
                            )
                          : ""}
                      </AppText>

                      {selcampName?.mediaDetails != null && (
                        <AppText style={[Styles.fileName, { color: "black" }]}>
                          {selcampName?.mediaDetails[0].fullName}
                        </AppText>
                      )}
                      <AppText
                        onPress={() => {
                          setshowcampmodal(false);

                          navigation.navigate("CmpPreviwe", {
                            campaigns: [
                              {
                                campaignId: choosedata.campaignId,
                                campaigName: choosedata?.camapignName,
                                approveState:""
                              },
                            ],
                            viewDetails: true,
                          });
                        }}
                        style={Styles.themeText}
                      >
                        Preview
                      </AppText>
                    </View>
                  </View>
                </View>
                <View style={Styles.bodyRowsContainer}>
                  <CommonTitleAndText
                    title="Aspect Ratio *"
                    text={ratiovalue}
                  />
                  <CommonTitleAndText
                    title="Start Date"
                    text={choosedata?.startDate}
                    isIcon
                    isCalender={false}
                    onPress={() => {
                      // setDatePickerVisible(!isDatePickerVisible);
                    }}
                  />

                  <CommonTitleAndText
                    title="End Date"
                    text={choosedata?.endDate}
                    isIcon
                    isCalender={false}
                    onPress={() => {
                      // setDatePickerVisible1(!isDatePickerVisible1);
                    }}
                  />

                  <CommonTitleAndText
                    title="Start Time*"
                    text={
                      startTime
                        ? moment(startTime).format("HH:mm")
                        : "Select Time"
                    }
                    isIcon
                    isClock
                    onPress={() => {
                      setchooseDataTimePick(!chooseDataTimePick);
                    }}
                  />

                  <DatePicker
                    modal
                    open={chooseDataTimePick}
                    date={startTime != null ? startTime : new Date()}
                    mode="time"
                    placeholder="Select time"
                    format="HH:mm"
                    //minuteInterval={30} // Set the minute interval to 30 minutes
                    onDateChange={(time) => {
                      setStartTime(time);
                    }}
                    onConfirm={(date) => handleTimeChange(date)}
                    onCancel={() => setchooseDataTimePick(false)}
                  />

                  <CommonTitleAndText
                    title="End Time*"
                    text={
                      endTime ? moment(endTime).format("HH:mm") : "Select Time"
                    }
                    isIcon
                    isClock
                    onPress={() => {
                      setchooseDataTimePickEnd(!chooseDataTimePickEnd);
                    }}
                  />
                  <DatePicker
                    modal
                    mode="time"
                    open={chooseDataTimePickEnd}
                    minimumDate={new Date()}
                    date={endTime != null ? endTime : new Date()}
                    placeholder="Select time"
                    format="HH:mm"
                    minuteInterval={30} // Set the minute interval to 30 minutes
                    onDateChange={(time) => {
                      setEndTime(time);
                    }}
                    onConfirm={handleTimeChange1}
                    onCancel={() => setchooseDataTimePickEnd(false)}
                  />

                  <AppTextInput
                    containerStyle={Styles.eventTitleInput}
                    value={String(choosedata?.occurance)}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setchoosedata({ ...choosedata, occurance: text });
                    }}
                    placeHolderText={"Enter occurrence *"}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                      color: "black",
                    }}
                  />

                  {/* <AppTextInput
                    containerStyle={Styles.eventTitleInput}
                    value={
                      choosedata?.priority ? String(choosedata.priority) : ""
                    }
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setchoosedata({ ...choosedata, priority: text });
                    }}
                    placeHolderText="Select Priority *"
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  /> */}
                </View>
              </View>

              <ActionContainer
                isContinue={true}
                continueText={"Update"}
                // saveText={""}
                numOfButtons={2}
                onPressSave={(item) => {
                  console.log("opopopo0090==>", JSON.stringify(item));
                  updateCamapign();
                }}
                onPressCancel={() => {
                  setshowcampmodal(false);
                }}
                onPressDraft={() => {}}
              />
            </View>
          </ScrollView>
        </Modal>
      )}
      {successModal && (
        <SuccessModal Msg={successMsg} onComplete={onComplete} />
      )}
      {modal ? (
        <SelectCampaignModal
          data={state.campaignString}
          setindex={(item) => {
            setState((prev) => {
              return { ...prev, selectedCampaign: item };
            });
          }}
          setCampaign={setSelectedCampaign}
          setModal={setModal}
        />
      ) : null}
      {imageView && state.selectedCampaign?.mediaDetail != null ? (
        <ViewImageModal
          details={state.selectedCampaign?.mediaDetail[0]}
          setModal={setImageView}
        />
      ) : null}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          marginBottom: Platform.OS === "ios" && isKeyboardOpen ? 100 : 0,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={Styles.mainContainer}>
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
                    ADD SCHEDULER DETAILS
                  </AppText>
                  <Separator />
                  <View style={Styles.bodyRowsContainer}>
                    <AppTextInput
                      containerStyle={Styles.eventTitleStyle}
                      value={title}
                      onChangeText={(text) => {
                        {
                          setPlonogramError("");
                          setTitle(text);
                        }
                      }}
                      placeHolderText="Scheduler Title *"
                      placeholderTextColor={themeColor.placeHolder}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                    {plonogramError ? (
                      <Text style={Styles.errorText}>{plonogramError}</Text>
                    ) : null}

                    <View style={{ marginVertical: moderateScale(10) }}>
                      {/* <Text style={{color:'black'}}>{JSON.stringify(resolutionDropdownData)}</Text> */}
                      <Dropdown
                        style={[Styles.dropdown, { color: "black" }]}
                        placeholderStyle={Styles.placeholderStyle}
                        selectedTextStyle={[
                          Styles.selectedTextStyle,
                          { color: "black" },
                        ]}
                        inputSearchStyle={[
                          Styles.inputSearchStyle,
                          { color: "black" },
                        ]}
                        iconStyle={Styles.iconStyle}
                        itemTextStyle={{ color: "black" }}
                        data={resolutionDropdownData}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={"Aspect Ratio"}
                        searchPlaceholder="Search..."
                        value={state.ratioId}
                        onChange={(item) => {
                          setRatiovalue(item.label);
                          setPlonogramError2("");
                          setState({ ...state, ratioId: item.value });
                        }}
                      />
                    </View>

                    {plonogramError2 ? (
                      <Text style={Styles.errorText}>{plonogramError2}</Text>
                    ) : null}

                    <CommonTitleAndText
                      title={"Start Date*"}
                      text={
                        startDate
                          ? getDateFormat(startDate, "DD-MM-YYYY")
                          : "Select Date"
                      }
                      isIcon
                      isCalender
                      onPress={() => {
                        setDatePickerVisible(true);
                      }}
                    />

                    <DatePicker
                      modal={true}
                      style={{ borderWidth: 2 }}
                      mode="date"
                      // minimumDate={new Date(dl_min_date)}
                      date={new Date(dl_min_date)}
                      minimumDate={minDate}
                      // minimumDate={startDate1}
                      open={isDatePickerVisible}
                      onConfirm={(date) => handleConfirm(date)}
                      onCancel={hideDatePicker}
                    />

                    {dateError1 ? (
                      <Text style={Styles.errorText}>{dateError1}</Text>
                    ) : null}

                    <CommonTitleAndText
                      title="End Date*"
                      text={
                        endDate
                          ? getDateFormat(endDate, "DD-MM-YYYY")
                          : "Select Date"
                      }
                      isIcon
                      isCalender
                      onPress={() => setDatePickerVisible1(true)}
                    />
                    <DatePicker
                      mode="date"
                      modal
                      minimumDate={startDate != null ? startDate : new Date()}
                      open={isDatePickerVisible1}
                      date={endDate != null ? endDate : new Date()}
                      onConfirm={handleDateChange1}
                      onCancel={() => setDatePickerVisible1(false)}
                    />
                    {dateError2 ? (
                      <Text style={Styles.errorText}>{dateError2}</Text>
                    ) : null}

                    {dateError ? (
                      <Text style={Styles.errorText}>{dateError}</Text>
                    ) : null}

                    <CommonTitleAndText
                      title="Start Time*"
                      text={
                        startTime
                          ? moment(startTime).format("HH:mm")
                          : "Select Time"
                      }
                      isIcon
                      isClock
                      onPress={() => {
                        console.log("Start Time button pressed");
                        setTimePickerVisible(!isTimePickerVisible);
                      }}
                    />
                    <DatePicker
                      mode="time"
                      modal
                      open={isTimePickerVisible}
                      // minimumDate={new Date()}
                      date={startTime != null ? startTime : defaultDate}
                      defaultDate={new Date(0)}
                      placeholder="Select time"
                      format="HH:mm"
                      minuteInterval={30} // Set the minute interval to 30 minutes
                      onDateChange={(time) => {
                        setStartTime(time);
                      }}
                      onConfirm={(date) => handleTimeChange(date)}
                      onCancel={() => setTimePickerVisible(false)}
                    />
                    {timeError1 && (
                      <Text style={Styles.errorText}>{timeError1}</Text>
                    )}

                    <CommonTitleAndText
                      title="End Time*"
                      text={
                        endTime
                          ? moment(endTime).format("HH:mm")
                          : "Select time"
                      }
                      isIcon
                      isClock
                      onPress={() => setTimePickerVisible1(true)}
                    />
                    <DatePicker
                      mode="time"
                      modal
                      minuteInterval={30}
                      // minimumDate={new Date()}
                      open={isTimePickerVisible1}
                      date={endTime != null ? endTime : defaultDate}
                      onDateChange={(time) => {
                        setEndTime(time);
                      }}
                      onConfirm={handleTimeChange1}
                      onCancel={() => setTimePickerVisible1(false)}
                    />
                    {timeError2 && (
                      <Text style={Styles.errorText}>{timeError2}</Text>
                    )}
                  </View>

                  {timeError && (
                    <Text style={Styles.errorText}>{timeError}</Text>
                  )}
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
                      style={[
                        Styles.searchHeaderView(searchType === "location"),
                      ]}
                    >
                      <AppText
                        style={[
                          Styles.searchHeaderText(searchType === "location"),
                        ]}
                      >
                        {"Search by Location"}
                      </AppText>
                    </Pressable>

                    <Pressable
                      onPress={() => setSearchType("device")}
                      style={[Styles.searchHeaderView(searchType === "device")]}
                    >
                      <AppText
                        style={[
                          Styles.searchHeaderText(searchType === "device"),
                        ]}
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
                            width: "99%",
                            marginHorizontal: 0,
                            borderRadius: 5,
                            color: "#000000",
                            borderWidth: 1,
                            borderColor: "#00000026",
                          }}
                          placeholder={"Search by Location"}
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
                              style={[
                                Styles.deviceSelectedTop,
                                Styles.boldText,
                              ]}
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
                              : ` (${
                                  deviceData ? deviceData.length : 0
                                }) `}{" "}
                            devices selected
                          </AppText>
                          <View style={Styles.iconContainer}>
                            <Pressable
                              onPress={() => {
                                setShowGroupOrMedia("group");
                                console.log("setShowGroupOrMedia");
                              }}
                            >
                              <FontAwesome
                                name={"navicon"}
                                size={25}
                                color={
                                  showGroupOrMedia == "group"
                                    ? themeColor.themeColor
                                    : "#888888"
                                }
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
                                  tintColor:
                                    showGroupOrMedia != "group"
                                      ? themeColor.themeColor
                                      : "#888888",
                                  // tintColor:showGroupOrMedia == "group" ?themeColor.textInactive : themeColor.themeColor,
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
                            width: "80%",
                            marginLeft: 20,
                            borderRadius: 5,
                            color: "#000000",
                            borderWidth: 1,
                            borderColor: "#00000026",
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
                            //onchange(item, value);
                          }}
                        />
                        {showGroupOrMedia == "group" ? (
                          <View style={Styles.deviceBodyContainer}>
                            {deviceGroupData.length > 0 ? (
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
                                          isGroupDeviceCheked(
                                            item.deviceGroupId
                                          )
                                        )
                                      }
                                      
                                      containerStyle={{maxWidth:"95%"}}
                                    />
                                    {dIndex + 1 != deviceGroupData.length &&
                                      deviceGroupData.length != 1 && (
                                        <Separator />
                                      )}
                                  </View>
                                );
                              })
                            ) : (
                              <View
                                style={{
                                  height: 50,
                                  alignItems: "center",
                                  paddingVertical: 5,
                                }}
                              >
                                <Text style={{ fontSize: 15, color: "black" }}>
                                  No Device Group Found
                                </Text>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View style={Styles.deviceBodyContainer}>
                            {deviceData.length > 0 ? (
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
                              })
                            ) : (
                              <View
                                style={{
                                  height: 50,
                                  alignItems: "center",
                                  paddingVertical: 5,
                                }}
                              >
                                <Text style={{ fontSize: 15, color: "black" }}>
                                  No Device Found
                                </Text>
                              </View>
                            )}
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
                      {"Available slots:"}
                      {availablesss * deviceab}
                      {"\n"}
                      {"(Devices:"}
                      {deviceab}
                      {")"}
                    </AppText>
                  </View>
                  <Separator />
                  <View style={Styles.uploadFileHere}>
                    {selectedCampaign ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            padding: 10,
                            width: "40%",
                            marginHorizontal: moderateScale(10),
                          }}
                        >
                          {state.selectedCampaign?.mediaDetail!=null?<Image
                            source={{
                              uri: state.selectedCampaign?.mediaDetail[0]
                                .thumbnailUrl,
                            }}
                            style={{
                              height: moderateScale(100),
                              width: moderateScale(100),
                              borderRadius: moderateScale(10),
                            }}
                          />:<View style={{width:40,height:50}} />}
                          <TouchableOpacity
                            onPress={() => setSelectedCampaign(false)}
                            style={Styles.closeStyle}
                          >
                            <Ionicons
                              name="close"
                              size={20}
                              color={themeColor.themeColor}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: "60%" }}>
                          <AppText style={[Styles.fileName]}>
                            {state.selectedCampaign?.campaignTitle}
                          </AppText>
                          <AppText
                            style={[Styles.fileName, { color: "black" }]}
                          >
                            {"Duration:"}
                            {state.selectedCampaign?.duration}
                            {"sec"}
                          </AppText>
                          <AppText
                            style={[Styles.fileName, { color: "black" }]}
                          >
                            {
                              state.selectedCampaign?.aspectRatio
                                .actualHeightInPixel
                            }
                            {"*"}
                            {
                              state.selectedCampaign?.aspectRatio
                                .actualWidthInPixel
                            }
                          </AppText>

                          {state.selectedCampaign?.mediaDetail!=null&&<AppText
                            style={[Styles.fileName, { color: "black" }]}
                          >
                            {state.selectedCampaign?.mediaDetail[0].fullName}
                          </AppText>
                          }

                          <AppText
                            // onPress={() => setImageView(true)}
                            onPress={() => {
                              navigation.navigate("CmpPreviwe", {
                                campaigns: [
                                  {
                                    campaignId:state.selectedCampaign.campaignId,
                                    campaigName:state.selectedCampaign?.campaignTitle,
                                    approveState:""
                                  },
                                ],
                                viewDetails: true,
                              });
                              // navigation.navigate(NAVIGATION_CONSTANTS.CMP_VIEW, {
                              //   campaignItem: {campaignId:state.selectedCampaign.campaignId},
                              // })
                            }}
                            style={Styles.themeText}
                          >
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
                          }}
                        >
                          <AppText
                            onPress={() => setModal(true)}
                            style={{
                              textDecorationLine: "underline",
                            }}
                          >
                            Click here
                          </AppText>{" "}
                          to choose file
                        </AppText>
                      </View>
                    )}
                  </View>
                  <View style={Styles.bodyRowsContainer}>
                    <CommonTitleAndText
                      title="Aspect Ratio *"
                      text={ratiovalue}
                    />
                    <CommonTitleAndText
                      title="Start Date*"
                      text={getDateFormat(startDate, "DD-MM-YYYY")}
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
                      text={getDateFormat(endDate, "DD-MM-YYYY")}
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
                      text={moment(startTime).format("HH:mm")}
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
                      // minuteInterval={30} // Set the minute interval to 30 minutes
                      onDateChange={(time) => {
                        setStartTime(time);
                      }}
                      onConfirm={(date) => handleTimeChange(date)}
                      onCancel={() => setTimePickerVisible(false)}
                    />

                    <CommonTitleAndText
                      title="End Time*"
                      text={moment(endTime).format("HH:mm")}
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
                      //minuteInterval={30} // Set the minute interval to 30 minutes
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

                    {/* <AppTextInput
                      containerStyle={Styles.eventTitleInput}
                      value={priority}
                      keyboardType="numeric"
                      onChangeText={(text) => setpriority(text)}
                      placeHolderText="Select Priority *"
                      placeholderTextColor={themeColor.placeHolder}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    /> */}
                  </View>
                  {addcampvalue.length > 0 && (
                    <View style={{ paddingHorizontal: 16 }}>
                      <AppText
                        style={{
                          color: "black",
                          fontSize: moderateScale(16),
                          marginVertical: 5,
                        }}
                      >
                        Campaign Sequence
                      </AppText>
                      <AppText
                        style={{
                          color: themeColor.themeColor,
                          fontSize: moderateScale(16),
                          marginBottom: 10,
                        }}
                      >
                        (Drag to prioritize)
                      </AppText>

                      <View style={{ marginBottom: 10, width: "100%" }}>
                        <Separator />
                      </View>
                      {/* <FlatList
                        keyExtractor={(item, index) => {
                          return "index" + index;
                        }}
                        scrollEnabled={false}
                        numColumns={1}
                        data={addcampvalue}
                        renderItem={RemoveCampaign}
                      /> */}
                      <DraggableFlatList
                        data={addcampvalue}
                        scrollEnabled={false}
                        keyExtractor={(item, index) => {
                          return "index" + index;
                        }}
                        renderItem={RemoveCampaign}
                        onDragEnd={({ data }) => onDragEnd(data)}
                      />
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <ActionContainer
        // isDisabled={currentSection === 2 && !selectedCampaign}
        isContinue={currentSection === 2}
        draftText={currentSection === 1 ? "Reset" : undefined}
        cancelStyle={{
          width: currentSection === 1 ? "30%" : undefined,
        }}
        continueText={currentSection === 2 ? "Save Campaign" : null}
        draftStyle={{
          width: currentSection === 1 ? "30%" : undefined,
        }}
        cancelText={currentSection > 0 ? "Go Back" : "Cancel"}
        onPressSave={() => {
          if (currentSection == 0) {
            if (iseditname == true) {
              btneditscheduler();
            } else {
              btnaddchedular("Published");
            }
          } else if (currentSection == 1) {
            btnSubmitDeviceGroup();
          } else if (currentSection == 2) {
            console.log("save camapign-->");
            btnSubmitCampainPlanogram();
          } else {
            navigation.goBack();
          }
        }}
        onPressDraft={() => {
          if (currentSection == 0) {
            btnaddchedular("DRAFT");
          }
          if (currentSection == 1) {
            resetLocationAndGroupDevice();
          }
          if (currentSection == 3) {
            btnSubmitPlanogramPriority("DRAFT");
          }
        }}
        onPressCancel={() => {
          if (currentSection === 0) {
            navigation.goBack();
          }
          if (currentSection === 1) {
            setiseditname(true);
            setCurrentSection(currentSection - 1);
          } else {
            setCurrentSection(currentSection - 1);
          }
        }}
      />

      {showpublishbtn && currentSection === 2 && (
        <View
          style={{
            justifyContent: "center",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(NAVIGATION_CONSTANTS.SCHEDULER_VIEW1, {
                item: state.planogramData,
                campvalue: addcampvalue,
              });
            }}
            // onPress={() => onPressSave()}
            style={{
              width: "48%",
              backgroundColor: themeColor.themeColor,
              paddingHorizontal: moderateScale(25),
              borderRadius: moderateScale(10),
              borderWidth: 1,
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(20),
            }}
          >
            <AppText
              style={{
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                fontSize: moderateScale(13),
                alignSelf: "center",
                color: themeColor.white,
              }}
            >
              {"Publish"}
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
export default AddScheduler;
