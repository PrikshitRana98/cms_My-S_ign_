import React, { useEffect, useState, useRef } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  TextInput,
  ScrollView,
  Keyboard,
  Share,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
} from "react-native";
import { SchedulerManagerService } from "../Scheduler/SchedulerApi";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import AppText from "../../Components/Atoms/CustomText";
import Pagination from "../../Components/Atoms/Pagination";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import PlanogramBody from "../../Components/Organisms/CMS/Planogram/planogramBody";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import PlanogramStyles from "./style";
import AdvSearchAndAdd from "../../Components/Atoms/AdvSearchAndAdd";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import { moderateScale } from "../../Helper/scaling";
import { PlanogramManagerService, getPlonogramData } from "./PlonogramApi";
import {
  getDeviceByLocation,
  getDeviceGroupByLocation,
} from "../../screens/Scheduler/SchedulerApi";
import { useDispatch, useSelector } from "react-redux";
import plonogramReducer from "../../appConfig/Redux/Reducer/plonogramReducer";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Loader from "../../Components/Organisms/CMS/Loader";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import DatePicker from "react-native-date-picker";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import { Dropdown } from "react-native-element-dropdown";
import {
  getResolutionData,
  getWorkFlow,
} from "../../Services/AxiosService/ApiService";
import { PREVILAGES } from "../../Constants/privilages";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import moment from "moment";

const Planogram = (props) => {
  const defaultDate = new Date();
  defaultDate.setHours(0);
  defaultDate.setMinutes(0);

  const themeColor = useThemeContext();
  const Styles = PlanogramStyles(themeColor);
  const navigation = props?.navigation;
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [isTimePickerVisible1, setTimePickerVisible1] = useState(false);
  const [endTime, setEndTime] = useState(new Date());
  const [planogramList, setPlanogramList] = useState([]);
  const [paginationDetails, setPaginationDetails] = useState({});
  const [locationData, setLocationData] = useState([]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const onComplete2 = () => {
    setIsSuccess(false);
  };

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

  const [searchLocation, setSearchLocation] = useState("");

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });
  const [filterData, setFilterData] = useState({
    currentPage: 1,
    noPerPage: 10,
    CreatedBy: "",
    PlanogramName: "",
    state: "",
    aspectRatioId: "",
    duration: "",
    comparator: "gt",
    location: "",
    deviceId: "",
    createdFrom: "",
    createdTo: "",
    startTime: "",
    endTime: "",
    sortByPlanogramName: "",
    sortByCreatedOn: "",
    isCloned: false,
  });

  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );

  const { authorization, isApprover } = useSelector(
    (state) => state.userReducer
  );
  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
    ratioId: resolution.aspectRatioId,
    campaignTitle: resolution.campaignTitle,
    id: resolution.campaignId,
  }));

  const locationDropdownData = locationData.map((item) => ({
    label: item.locationId,
    value: item.locationName,
  }));

  const deviceGroupData1 = useSelector(
    (state) => state.CommonReducer.deviceGroupData
  );
  useEffect(() => {
    let params = {
      ids: [],
    };
    // getDeviceGroupByLocation(params, setIsLoading);
    // getDeviceByLocation(params, setIsLoading);
  }, []);
  const deviceData1 = useSelector((state) => state.CommonReducer.deviceData);
  const deviceData = deviceData1?.map((resolution) => ({
    label: resolution.deviceName,
    value: resolution.deviceId,
  }));

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

    // Cleanup listeners when the component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const deviceGroupData = deviceGroupData1?.map((resolution) => ({
    label: resolution.deviceGroupName,
    value: resolution.deviceGroupId,
  }));

  const dispatch = useDispatch();
  const plonogramList = useSelector(
    (state) => state.plonogramReducer.plonogramList
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      btnPlonogramData();
      console.log("focus--------------->");
      getResolutionData(setIsLoading);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (plonogramList?.data) {
      let planogramList1 = plonogramList?.data.map((item, index) => {
        return { ...item, checkStatus: false };
      });
      if (plonogramList?.paginationDetail) {
        setPaginationDetails(plonogramList?.paginationDetail);
      }
      setPlanogramList([...planogramList1]);
    }
  }, [plonogramList]);

  useEffect(() => {
    btnPlonogramData();
  }, [
    filterData.PlanogramName,
    filterData.sortByPlanogramName,
    filterData.state,
    filterData.CreatedBy,
    filterData.location,
  ]);

  const btnPlonogramData = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `service-gateway/cms/${slugId}/planogram/getPlanogramByFilter`;
    let isAdvancedSearch=false

    const queryParams = [];

    for (const key in filterData) {
      if (
        filterData[key] !== undefined &&
        filterData[key] !== "" &&
        filterData[key] !== null
      ) {
        if (key === "createdFrom") {
           isAdvancedSearch=true
          const createdFromTimestamp = new Date(filterData[key]).getTime();
          queryParams.push(`${key}=${createdFromTimestamp}`);
        } else if (key === "createdTo") {
          isAdvancedSearch=true
          const createdToTimestamp = new Date(filterData[key]).getTime();
          queryParams.push(`${key}=${createdToTimestamp}`);
        } else if (key === "currentPage") {
          
          queryParams.push(`${key}=${filterData[key]}`);
        } else if (key === "location") {
          
          queryParams.push(`${"locationId"}=${filterData[key]}`);
          console.log("location-->", filterData["location"]);
        }
        // else if(key=="comparator"){
        //   if(filterData["duration"]){
        //   console.log("comparatorcomparator",filterData[key],filterData["duration"]);
        //   queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
        //   }else{
        //     queryParams.push(`${key}=${encodeURIComponent('gt')}`);
        //     queryParams.push(`${'duration'}=${encodeURIComponent('1')}`)

        //   }
        // }
        else {
          queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
        }
      }
    }

    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }

    endPoint=endPoint+`&isAdvancedSearch=${isAdvancedSearch}`

    console.log("endpoint", endPoint);

    getPlonogramData(endPoint, () => {},navigation);
  };

  const btnPlonogramData1 = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `service-gateway/cms/${slugId}/planogram/getPlanogramByFilter`;

    const queryParams = [];

    for (const key in filterData) {
      if (
        filterData[key] !== undefined &&
        filterData[key] !== "" &&
        filterData[key] !== null
      ) {
        if (key === "createdFrom") {
          const createdFromTimestamp = new Date(filterData[key]).getTime();
          queryParams.push(`${key}=${createdFromTimestamp}`);
        } else if (key === "createdTo") {
          const createdToTimestamp = new Date(filterData[key]).getTime();
          queryParams.push(`${key}=${createdToTimestamp}`);
        } else if (key === "currentPage") {
          queryParams.push(`${key}=${filterData[key]}`);
        } else if (key === "sortByCreatedOn") {
          queryParams.push(`${key}=${!filterData[key]}`);
          setFilterData({
            ...filterData,
            sortByCreatedOn: !filterData.sortByCreatedOn,
          });
        }
      }
    }

    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }
    console.log("btn1111 api");
    getPlonogramData(endPoint, setIsLoading,navigation);
  };

  const resetAdvanceSearch = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `service-gateway/cms/${slugId}/planogram/getPlanogramByFilter?currentPage=1&noPerPage=10&isCloned=false`;
    getPlonogramData(endPoint, () => {},navigation);
    // setVisible(false);
  };

  const btnStopPlanogram = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      data: { planogramId: id },
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      // console.log("response", response);
      if (response?.code == 200) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessMsg("Planogram Stopped Successfully");
        btnPlonogramData();
        setIsSuccess(true);
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
      console.log("deleteCampaignString", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    PlanogramManagerService.stopPlanogram(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnDeletePlanogram = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: [id],
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      // console.log("response", response);
      if (response?.data?.badRequest.length <= 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessMsg("Planogram Delete Successfully");
        btnPlonogramData();
        setIsSuccess(true);
      } else if (response?.data?.badRequest.length > 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert(response?.data?.badRequest[0].message);
      }
    };
    const failureCallBack = (error) => {
      console.log("deleteCampaignString", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    PlanogramManagerService.deleteCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnDeleteBulkData = async () => {
    let slugId = await getStorageForKey("slugId");
    let selectedPlanogramStr = planogramList.filter(
      (item) => item.checkStatus == true
    );
    let ids = selectedPlanogramStr.map((item) => {
      return item.planogramId;
    });

    const params = {
      ids: ids,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response?.data?.badRequest.length <= 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessMsg("Planogram Delete Successfully");
        btnPlonogramData();
        setIsSuccess(true);
      } else if (response?.data?.badRequest.length > 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert(response?.data?.badRequest[0].message);
      }
    };

    const failureCallBack = (error) => {
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    PlanogramManagerService.deleteCampaignString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  useEffect(() => {
    getWorkFlow(navigation);
    getLocationPlanogram();
  }, [1]);
  const workFlow = useSelector((state) => state.userReducer.workFlow);
  // console.log('workFlow---',workFlow)
  let statusArr = [
    { label: "State", value: "" },
    { label: "DRAFT", value: "DRAFT" },
    { label: "SUBMITTED", value: "SUBMITTED" },
    { label: "PUBLISHED", value: "PUBLISHED" },
  ];
  if (
    workFlow &&
    (workFlow?.approverWorkFlow == "PLANOGRAM" ||
      workFlow?.approverWorkFlow == "PLANOGRAM_AND_CAMPAIGN")
  ) {
    statusArr = [
      { label: "State", value: "" },
      { label: "Draft", value: "DRAFT" },
      { label: "Published", value: "PUBLISHED" },
      { label: "Approved", value: "APPROVED" },
      { label: "Rejected", value: "REJECTED" },
      { label: "Pending for approval", value: "PENDING_FOR_APPROVAL" },
    ];
  }
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

  const getDevicePlanogram = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("Sucess Device", response);
    };

    const failureCallBack = (error) => {
      console.log("error Device", error);
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    PlanogramManagerService.getDeviceList(
      params,
      succussCallBack,
      failureCallBack
    );
  };
  const scrollViewRef = useRef(null);

  const scrollToHeight = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 200, animated: true });
    }
  };

  const btnClonePlanogram = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      ids: id,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response?.code == 200) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessMsg("Planogram Cloned Successfully");
        btnPlonogramData();
        setIsSuccess(true);
        // btnPlonogramData();
      }
    };

    const failureCallBack = (error) => {
      console.log("btnClonePlanogramString response", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    PlanogramManagerService.clonePlanogramString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const handleDateChange = (date) => {
    setFilterData({
      ...filterData,
      createdFrom: date.toISOString().split("T")[0],
    });
    setStartDate(date);
    setDatePickerVisible(false);
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

  const handleDateChange1 = (date) => {
    setFilterData({
      ...filterData,
      createdTo: date.toISOString().split("T")[0],
    });
    setEndDate(date);
    setDatePickerVisible1(false);
  };

  const handleTimeChange = (date) => {
    console.log("Time changed:", date);
    setFilterData({
      ...filterData,
      startTime: moment(date).format("HH:mm"),
    });
    setStartTime(date);
    setTimePickerVisible(false);
  };

  const handleTimeChange1 = (date) => {
    setFilterData({
      ...filterData,
      endTime: moment(date).format("HH:mm"),
    });
    setEndTime(date);
    setTimePickerVisible1(false);
  };

  const resetFilters = () => {
    setFilterData({
      currentPage: 1,
      noPerPage: 10,
      CreatedBy: "",
      PlanogramName: "",
      createdFrom: "",
      createdTo: "",
      state: "",
      isCloned: false,
      aspectRatioId: "",
      duration: "",
      comparator: "gt",
      location: "",
      deviceId: "",
      startTime: "",
      endTime: "",
    });
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    resetAdvanceSearch();
  };

  const advancedSearchModal = () => {
    return (
      <Modal visible={visible} style={Styles.mainContainerModal}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={Styles.headerContainerModal}>
            <CreateNewHeader
              title="Advance Search"
              onClickIcon={() => {
                setVisible(false);
              }}
            />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <ScrollView ref={scrollViewRef}>
              {/* <ScrollView contentContainerStyle={{ paddingBottom: (Platform.OS === 'ios' && isKeyboardOpen) ? 200 : 0 , }}> */}
              <View style={{ flex: 1, paddingHorizontal: 15 }}>
                <CommonTitleAndText
                  title="Created From"
                  text={
                    filterData?.createdFrom &&
                    moment(filterData?.createdFrom).format("DD-MM-YYYY")
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible(true)}
                />
                <DatePicker
                  modal
                  mode="date"
                  open={isDatePickerVisible}
                  date={startDate}
                  onConfirm={handleDateChange}
                  onCancel={() => setDatePickerVisible(false)}
                />

                <CommonTitleAndText
                  title="Created To"
                  text={
                    filterData?.createdTo &&
                    moment(filterData?.createdTo).format("DD-MM-YYYY")
                  }
                  isIcon
                  isCalender
                  onPress={() => setDatePickerVisible1(true)}
                />
                <DatePicker
                  modal
                  mode="date"
                  open={isDatePickerVisible1}
                  date={endDate}
                  onConfirm={handleDateChange1}
                  onCancel={() => setDatePickerVisible1(false)}
                />

                <CommonTitleAndText
                  title="Start Time"
                  text={filterData?.startTime}
                  isIcon
                  isClock
                  onPress={() => {
                    console.log("Start Time button pressed");
                    setTimePickerVisible(!isTimePickerVisible);
                  }}
                />
                <DatePicker
                  modal
                  mode="time"
                  open={isTimePickerVisible}
                  date={startTime}
                  defaultDate={defaultDate}
                  onConfirm={(date) => handleTimeChange(date)}
                  onCancel={() => setTimePickerVisible(false)}
                />
                <CommonTitleAndText
                  title="End Time"
                  text={filterData?.endTime}
                  isIcon
                  isClock
                  onPress={() => setTimePickerVisible1(true)}
                />
                <DatePicker
                  modal
                  mode="time"
                  open={isTimePickerVisible1}
                  date={endTime}
                  defaultDate={defaultDate}
                  onConfirm={handleTimeChange1}
                  onCancel={() => setTimePickerVisible1(false)}
                />

                {locationData && (
                  <View
                    style={{
                      width: "100%",
                      marginVertical: moderateScale(5),
                      marginBottom: isKeyboardOpen ? 200 : 0,
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
                        fontSize: moderateScale(13),
                        fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
                        color: "#ADB2C3",
                      }}
                      selectedTextStyle={{
                        fontSize: moderateScale(13),
                        fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
                        color: "black",
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
                      placeholder={"Select Location"}
                      searchPlaceholder="Search Location..."
                      value={filterData?.location}
                      onChangeText={(item) => {
                        if (item?.length > 1) {
                          searchLocationApi(item);
                        } else if (item?.length == 0) {
                          getLocationPlanogram();
                        }
                      }}
                      onChange={(item) => {
                        setFilterData({ ...filterData, location: item.label });
                        getLocationPlanogram();
                      }}
                    />
                  </View>
                )}

                {/* no of resion======== */}
                <View style={Styles.ratioContainer}>
                  <View style={Styles.styleRatio}>
                    <View style={{ width: "40%" }}>
                      <CampaignDropDown
                        dataList={[
                          { label: "=", value: "eq" },
                          { label: "<", value: "lt" },
                          { label: ">", value: "gt" },
                          { label: "<=", value: "gte" },
                          { label: ">=", value: "lte" },
                        ]}
                        placeHolderText="Select Sign"
                        onChange={(item) => {
                          setFilterData({
                            ...filterData,
                            comparator: item.value,
                          });
                        }}
                        value={filterData?.comparator}
                      />
                    </View>
                    <AppTextInput
                      containerStyle={Styles.noOfregionInput}
                      placeHolderText={"Enter duration(in seconds)"}
                      onChangeText={(item) => {
                        setFilterData({ ...filterData, duration: item });
                      }}
                      value={filterData?.duration}
                      placeholderTextColor={themeColor.placeHolder}
                      keyboardType="numeric"
                      textInputStyle={{
                        fontSize: moderateScale(12),
                      }}
                    />
                  </View>
                </View>

                {/* state========= */}
                <View
                  style={{ width: "100%", marginVertical: moderateScale(5) }}
                >
                  <CampaignDropDown
                    dataList={statusArr}
                    placeHolderText="Select State"
                    onChange={(item) => {
                      setFilterData({ ...filterData, state: item.value });
                    }}
                    value={filterData?.state}
                  />
                </View>

                {/* ratio============= */}
                <View
                  style={{ width: "100%", marginVertical: moderateScale(5) }}
                >
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
                    autoScroll={false}
                    dropdownPosition={"top"}
                    labelField="label"
                    valueField="value"
                    placeholder={"Aspect Ratio"}
                    searchPlaceholder="Search..."
                    value={filterData.aspectRatioId}
                    onChange={(item) => {
                      setFilterData({
                        ...filterData,
                        aspectRatioId: item.value,
                      });
                    }}
                  />
                </View>

                {/* Device Group============= */}
                <View style={{ marginVertical: moderateScale(5) }}>
                  {/* <AppText style={Styles.aspectText}>Device Group</AppText> */}
                  <Dropdown
                    style={Styles.dropdown}
                    placeholderStyle={Styles.placeholderStyle}
                    selectedTextStyle={Styles.selectedTextStyle1}
                    inputSearchStyle={Styles.inputSearchStyle}
                    iconStyle={Styles.iconStyle}
                    itemTextStyle={{ color: "#000000" }}
                    data={deviceGroupData}
                    // mode={'modal'}
                    maxHeight={300}
                    autoScroll={false}
                    dropdownPosition={"top"}
                    labelField="label"
                    valueField="value"
                    placeholder={"Select Device Group"}
                    value={filterData?.deviceGroup}
                    onChange={(item) => {
                      setFilterData({ ...filterData, deviceGroup: item.value });
                    }}
                  />
                </View>

                <View style={{ marginVertical: moderateScale(5) }}>
                  {/* <AppText style={Styles.aspectText}>Device</AppText> */}

                  <Dropdown
                    style={Styles.dropdown}
                    placeholderStyle={Styles.placeholderStyle}
                    selectedTextStyle={Styles.selectedTextStyle1}
                    inputSearchStyle={Styles.inputSearchStyle}
                    iconStyle={Styles.iconStyle}
                    itemTextStyle={{ color: "#000000" }}
                    data={deviceData}
                    // mode={'modal'}
                    maxHeight={300}
                    autoScroll={false}
                    dropdownPosition={"top"}
                    labelField="label"
                    valueField="value"
                    placeholder={"Select Device"}
                    value={filterData?.deviceId}
                    onChange={(item) => {
                      setFilterData({ ...filterData, deviceId: item.value });
                    }}
                  />
                </View>
                <View style={Styles.SubmitContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      resetFilters();
                    }}
                    style={Styles.resetBox}
                  >
                    <Text style={Styles.resetText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      btnPlonogramData();
                      setVisible(false);
                    }}
                    style={Styles.submitBox}
                  >
                    <Text style={[Styles.resetText, { color: "white" }]}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  };

  const btnOpenModelType = (state, id) => {
    console.log("btnOpenModelType", state, id);

    switch (state) {
      case "PAUSE":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Stop Planogram",
          description: "Are you sure you want to Stop this Planogram ?",
          confirmModalFlag: true,
          actionType: "PAUSE",
          actionData: id,
          loading: false,
        });
        break;
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Planogram",
          description: "Are you sure you want to delete Planogram?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
          loading: false,
        });
        break;
      case "Clone":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Clone Planogram ",
          description: "Are you sure you want to clone Planogram?",
          confirmModalFlag: true,
          actionType: "Clone",
          actionData: id,
          loading: false,
        });
        break;
      case "DeleteAll":
        {
          let selectedPlanogramStr = planogramList.filter(
            (item) => item.checkStatus == true
          );
          if (selectedPlanogramStr.length <= 0) {
            Alert.alert("Inform", "Please select Planogram ");
          } else {
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Delete confirm",
              description: "Are you want to delete all selected data ?",
              confirmModalFlag: true,
              actionType: "DeleteAll",
              actionData: id,
              loading: false,
            });
          }
        }
        break;
      case "DeleteCampaign":
        {
          let data = {
            aspectRatioId: id.aspectRatioId,
            planogramId: id.planogramId,
            planogramName: id.title,
          };
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Delete confirm",
            description: `Are you want to delete selected planogram ?`,
            confirmModalFlag: true,
            actionType: "DeletePlanogram",
            // actionData: data,
          });
        }
        break;
      default:
        break;
    }
  };

  const btnFerPormfaction = () => {
    switch (confirmBoxData.actionType) {
      case "PAUSE":
        btnStopPlanogram(confirmBoxData.actionData);
        break;
      case "Delete":
        btnDeletePlanogram(confirmBoxData.actionData);
        break;
      case "Clone":
        btnClonePlanogram(confirmBoxData.actionData);
        break;
      case "DeleteAll":
        {
          btnDeleteBulkData();
        }
        break;
      case "DeleteCampaign":
        {
          btnDeleteCampaign(confirmBoxData.actionData);
        }
        break;
      default:
        break;
    }
  };

  const handlePageApi = async (index) => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `service-gateway/cms/${slugId}/planogram/getPlanogramByFilter`;
    setFilterData({ ...filterData, currentPage: index });
    for (const key in filterData) {
      if (
        filterData[key] != undefined &&
        filterData[key] != "" &&
        filterData[key] !== null
      ) {
        if (key == "currentPage") {
          endPoint = `${endPoint}?${key}=${index}`;
        } else {
          endPoint = `${endPoint}&${key}=${filterData[key]}`;
        }
      }
    }
    console.log("handle api");
    getPlonogramData(endPoint, setIsLoading,navigation);
  };
  const totalItemCount = planogramList?.paginationDetail?.totalItemCount;
  const pageCount = planogramList?.paginationDetail?.pageCount;

  return (
    <View style={Styles.fullFlex}>
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          btnFerPormfaction();
        }}
        stateOperation={() => {
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
        }}
      />
      <Loader visible={isLoading} />
      {isSuccess && <SuccessModal Msg={successMsg} onComplete={onComplete2} />}
      <ClockHeader />
      <View style={Styles.headerContainer}>
        <CreateNewHeader
          title="Planogram Management"
          onClickIcon={() => navigation.goBack()}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={Styles.mainContainer}>
          <CommonHeaderTitleAction
            pageName="Planogram"
            title="Planogram"
            totalItemCount={totalItemCount}
            btnOpenModelType={btnOpenModelType}
            renderDelete={isApprover}
          />
          <AdvSearchAndAdd
            title1="Advance Search"
            title2="+ Add planogram"
            containerStyle={{
              marginVertical: moderateScale(5),
              marginHorizontal: moderateScale(10),
            }}
            renderAdd={authorization.includes(
              PREVILAGES.PLANOGRAM.ADD_PLANOGRAM
            )}
            onClickSearch={() => {
              setVisible(true);
            }}
            onClickAdd={() => {
              resetFilters();
              navigation.navigate(NAVIGATION_CONSTANTS.ADD_NEW_PLANOGRAM);
            }}
          />
          <View style={Styles.schedulerList}>
            <View style={Styles.scheduleTopic}>
              <AppText style={Styles.scheduleText}>All Planogram</AppText>
            </View>
            <View style={Styles.schedulerBody}>
              <PlanogramBody
                btnOpenModelType={btnOpenModelType}
                plonogramList={planogramList}
                setFilterData={setFilterData}
                workFlow={workFlow}
                btnPlonogramData1={btnPlonogramData1}
                filterData={filterData}
                btnPlonogramData={btnPlonogramData}
                setPlanogramList={setPlanogramList}
              />
              {/* {planogramList.length <= 0 && (
                <View>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: 20,
                      textAlign: "center",
                      marginVertical: 20,
                    }}
                  >
                    Data Not Found
                  </Text>
                </View>
              )} */}
            </View>
          </View>

          <AppText
            style={{ color: themeColor.textColor, paddingHorizontal: 10 }}
          >
            Total Records : {paginationDetails.firstItemNumber} -{" "}
            {paginationDetails.lastItemNumber} of
            {planogramList?.paginationDetail?.pageCount}{" "}
            {paginationDetails.totalItemCount}
          </AppText>
          {planogramList.length > 0 && (
            <Pagination
              setState={handlePageApi}
              pageNumber={filterData.currentPage}
              totalpage={paginationDetails.pageCount}
            />
          )}
          <CopyRightText
            containerStyle={{
              width: "100%",
            }}
          />
        </View>
      </ScrollView>
      {advancedSearchModal()}
    </View>
  );
};

export default Planogram;
