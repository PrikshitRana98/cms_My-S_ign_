import React, { useEffect, useState } from "react";
import {Alert, Image, Modal, SafeAreaView, ScrollView, Text, TouchableOpacity,FlatList, View} from 'react-native';
import DownArr from '../../Assets/Images/PNG/down_arr.png';
import AppText from '../../Components/Atoms/CustomText';
import Pagination from '../../Components/Atoms/Pagination';
import CampaignDropDown from '../../Components/Organisms/CMS/Campaign/CampaignDropDown';
import ThemedButton from '../../Components/Atoms/ThemedButton';
import { getResolutionData } from "../../Services/AxiosService/ApiService";
import DatePicker from 'react-native-date-picker';
import AppTextInput from '../../Components/Atoms/AppTextInputs';
import ClockHeader from '../../Components/Atoms/ClockHeaders';
import { LocalDate,LocalDate1, moderateScale } from '../../Helper/scaling';
import {
  getUserData,
} from "../../screens/Dashboard/DashboardApi";
import {setStorageForKey} from '../../Services/Storage/asyncStorage';
import CopyRightText from '../../Components/Molecules/CopyRightText';
import SchedulerBody from '../../Components/Organisms/CMS/Scheduler/SchedulerBody';
import {useThemeContext} from '../../appConfig/AppContext/themeContext';
import SchedulerStyles from './style';
import { getSchedulerList,SchedulerManagerService,getDeviceByLocation,getDeviceGroupByLocation } from "./SchedulerApi";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Organisms/CMS/Loader";
import schedulerReducer from "../../appConfig/Redux/Reducer/schedulerReducer";
import {NAVIGATION_CONSTANTS} from '../../Constants/navigationConstant';
import CommonHeaderTitleAction from '../../Components/Atoms/CommonHeader';
import AdvSearchAndAdd from '../../Components/Atoms/AdvSearchAndAdd';
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import CreateNewHeader from '../../Components/Atoms/CreateNewHeader';
import CommonTitleAndText from '../../Components/Atoms/CommonTitleAndText';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { all } from "axios";
import { PREVILAGES } from "../../Constants/privilages";
import moment from "moment";
import SuccessModal from "../../Components/Molecules/SuccessModal";
const Scheduler = props => {
  const {navigation} = props;
  const themeColor = useThemeContext();
  const [schedularlist, setschedularlist] = useState([]);
  const [schedulerpagination, setschedulerpagination] = useState({});
  const [Isapproval, setIsapproval] = useState(false);
  const [workflowData, setworkflowData] = useState({});
  const schedularlistss = useSelector(
    (state) => state.schedulerReducer.schedulerList
  );
  
  const { authorization } = useSelector((state) => state.userReducer);
  const defaultDate = new Date();
  defaultDate.setHours(0);
  defaultDate.setMinutes(0);

  const handlePageApi = async (index) => {

    let slugId = await getStorageForKey("slugId");
    let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter`;
    setFilterData({ ...filterData, currentPage: index });
    const queryParams = [];

    for (const key in filterData) {
      
      if ( filterData[key] !== undefined &&filterData[key] !== "" && filterData[key] !== null)
      {
        if (
          filterData[key] !== undefined &&
          filterData[key] !== "" &&
          filterData[key] !== null
        ) { 
          if (key === "startDate") {
            const createdFromTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'createdFrom'}=${createdFromTimestamp}`);
          } else if (key === "endDate") {
            const createdToTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'createdTo'}=${createdToTimestamp}`);
          } else if (key === "currentPage") {
            queryParams.push(`${'currentPage'}=${index}`);
          } 
          else if (key === "device") {
            queryParams.push(`${'device'}=${filterData[key]}`);
          } 

          else if (key === "aspectRatioId") {
            if(filterData[key] != 0)
            {
            queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
            }
          } 
          else {
           queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
          }   
      }
    }
  }

  
   if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }
  
    getSchedulerList(endPoint, setIsLoading);
  
  };
  
  const totalItemCount = schedularlist?.pagination?.totalItemCount;
  const pageCount = schedularlistss?.pagination?.pageCount;
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [isDatePickerVisible1, setDatePickerVisible1] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isTimePickerVisible1, setTimePickerVisible1] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [countvalue, setcountvalue] = useState({});
  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [filterData, setFilterData] = useState({
    CreatedBy: "",
    currentPage: 1,
    PlanogramName: "",  
    aspectRatioId: 0,
    state: "",
    type: "",
    device:"",
    deviceGroup:"",
    duration: 0,
    comparator: "",
    startDate:"",
    endDate:"",
    startTime:"",
    endTime:"",
    noPerPage: 10,
    createdFrom:"",
    createdTo:"",
    ApprovedBy:"",
    sortByPlanogramName:false,
    sortByCreatedOn:false,
  });
  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );


  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
   
  }));

  const deviceData1 = useSelector((state) => state.CommonReducer.deviceData);
  const deviceData = deviceData1?.map((resolution) => ({
    label: resolution.deviceName,
    value: resolution.deviceId,
   
  }));


  const deviceGroupData1 = useSelector(
    (state) => state.CommonReducer.deviceGroupData
  );

  const deviceGroupData = deviceGroupData1?.map((resolution) => ({
    label: resolution.deviceGroupName,
    value: resolution.deviceGroupId,
   
  }));

  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("");

  const onComplete=()=>{
    setSuccessModal(false)
  }


  useEffect(() => {
    let params = {
      ids: [],
    };
    getDeviceGroupByLocation(params, setIsLoading);
    getDeviceByLocation(params, setIsLoading);
  }, []);

  useEffect(() => {
    Workflow(); 
    userDetail();
  
  }, []);


  

  const resetFilters = () => {
    setFilterData({
      CreatedBy: "",
      currentPage: 1,
      PlanogramName: "",  
      aspectRatioId: 0,
      state: "",
      type: "",
      device:"",
      duration: 0,
      comparator: "",
      startDate:"",
      endDate:"",deviceGroup:"",
      startTime:"",
      endTime:"",
      noPerPage: 10,
      createdFrom:"",
      createdTo:"",
      ApprovedBy:"",
      sortByPlanogramName:false,
      sortByCreatedOn:false
    });
    // setVisible(false);
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setTimeout(() => {
      btnSchedularData1();
    }, 500);
  };


  const handleDateChange = (date) => {
    setFilterData({
      ...filterData,
      createdFrom: new Date(date).getTime(),
    });
    setStartDate(date);
    setDatePickerVisible(false);
  };

  const handleDateChange1 = (date) => {
    setFilterData({
      ...filterData,
      createdTo: new Date(date).getTime(),
    });
    setEndDate(date);
    setDatePickerVisible1(false);
  };

  const handleTimeChange = (date) => {
   
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


  const [visible, setVisible] = useState(false); 
  
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
     // btnSchedularData();
     changeTable("all")
      countbystate();
      let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter?currentPage=1&noPerPage=10&isAdvanceSearch=false`;
      getSchedulerList(endPoint, setIsLoading);
      getResolutionData(setIsLoading);
    });
    return unsubscribe;
  }, []);


  const advancedSearchModal = () => {
    return (
      <Modal visible={visible} style={Styles.mainContainerModal}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <View style={Styles.headerContainerModal}>
              <CreateNewHeader
                title="Advance Search"
                onClickIcon={() => {
                  setVisible(false);
                }}
              />
            </View>

            <View style={{ flex: 1, paddingHorizontal: 15 }}>
              {/* date and time */}
              <CommonTitleAndText
                title="Created From"
                text={ filterData.createdFrom != "" ? LocalDate1(filterData.createdFrom): undefined}
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
                text={filterData.createdTo != "" ? LocalDate1(filterData.createdTo): undefined}
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
                title="Start Time*"
                text={filterData.startTime?moment(startTime).format("HH:mm"):"Select Time"}
                isIcon
                isClock
                onPress={() => {
                  setTimePickerVisible(!isTimePickerVisible);
                }}
              />
                <DatePicker
                    mode="time"
                    is24Hour
                    locale="en_GB"
                    modal
                    open={isTimePickerVisible}
                    date={startTime != null ? startTime : defaultDate}
                    defaultDate={new Date(0)} 
                    placeholder="Select time"
                    placeholderTextColor={themeColor.placeHolder}
                    format="HH:mm"
                    minuteInterval={30} // Set the minute interval to 30 minutes
                    onDateChange={(time) => {
                      setStartTime(time);
                    }}

                    onConfirm={(date) => handleTimeChange(date)}
                    onCancel={() => setTimePickerVisible(false)}

                />
              <CommonTitleAndText
                title="End Time*"
                text={filterData.endTime?moment(endTime).format("HH:mm"):"Select Time"}
                isIcon
                isClock
                onPress={() => setTimePickerVisible1(true)}
              />
                <DatePicker
                  mode="time"
                  modal
                  open={isTimePickerVisible1}
                  date={endTime != null ? endTime : defaultDate}
                  defaultDate={new Date(0)} 
                  placeholder="Select time"
                  format="HH:mm"
                  minuteInterval={30} // Set the minute interval to 30 minutes
                  onDateChange={(time) => {
                    setEndDate(time);
                  }}
                  onConfirm={handleTimeChange1}
                  onCancel={() => setTimePickerVisible1(false)}
                />
             
               {/*===============Durations========== */}

               <View style={Styles.ratioContainer}>
                {/* <AppText style={Styles.aspectText}>Duration (In Sec.)</AppText> */}
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
                      placeHolderText="Select sign"
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
                    keyboardType="numeric"
                    onChangeText={(value) => {
                      setFilterData({ ...filterData, duration: value });
                    }}
                    value={filterData?.duration}
                    placeHolderText='Enter Duration (in sec.)'
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(14),
                    }}
                  />
                </View>
              </View>

              {/* state========= */}
              <View style={{ width: "100%",marginVertical:moderateScale(5) }}>
                {/* <AppText style={Styles.aspectText}>State</AppText> */}
                <CampaignDropDown
                  dataList={[
                    { label: "All", value: "" },
                    { label: "DRAFT", value: "DRAFT" },
                    { label: "PENDING_FOR_APPROVAL", value: "PENDING_FOR_APPROVAL" },
                    { label: "APPROVED", value: "APPROVED" },
                    { label: "REJECTED", value: "REJECTED" },
                    { label: "FINISHED", value: "FINISHED" },  
                    // { label: "SUBMITTED", value: "SUBMITTED" },
                    { label: "PUBLISHED", value: "PUBLISHED" },
                    
                  ]}
                  placeHolderText="Select State"
                  onChange={(item) => {
                    setFilterData({ ...filterData, state: item.value });
                  }}
                  value={filterData?.state}
                />
              </View>

               {/* ratio============= */}
              <View style={{ width: "100%",marginVertical:moderateScale(5) }}>
                  {/* <AppText style={Styles.aspectText}>Aspect Ratio</AppText>                 */}

                <CampaignDropDown
                  dataList={resolutionDropdownData}
                  placeHolderText="Select Ratio"
                  onChange={(item) => {               
                    setFilterData({ ...filterData, aspectRatioId: item.value });
                  }}
                  value={filterData?.aspectRatioId}
                />
              </View>

             

              {/* ===========audio======== */}
              {/* <View style={{ width: "100%" }}>
                <AppText style={Styles.aspectText}>Audio</AppText>
                <CampaignDropDown
                  dataList={[
                    { label: "All", value: "" },
                    { label: "True", value: "True" },
                    { label: "False", value: "False" },
                  ]}
                  placeHolderText="Select Audio"
                  onChange={(item) => {
                    setfilterData({ ...filterData, audio: item.value });
                  }}
                  value={filterData?.audio}
                />
              </View> */}

              <View style={Styles.ratioContainer}>
                {/* <AppText style={Styles.aspectText}>Device Group</AppText> */}
              
                <CampaignDropDown               
                  dataList={deviceGroupData}
                  placeHolderText="Select Device Group"
                  onChange={(item) => {
                      setFilterData({ ...filterData, deviceGroup: item.value });
                  }}
                  value={filterData?.deviceGroup}
                />
              </View>

              <View style={Styles.ratioContainer}>
                {/* <AppText style={Styles.aspectText}>Device</AppText> */}
                <CampaignDropDown               
                  dataList={deviceData}
                  placeHolderText="Select Device"
                  onChange={(item) => {
                      setFilterData({ ...filterData, device: item.value });
                  }}
                  value={filterData?.device}
                />
              </View>
              <View style={[
                Styles.SubmitContainer,
                {marginTop:moderateScale(20),
                marginBottom:moderateScale(30)
                }]}>
                <TouchableOpacity
                 onPress={() => resetFilters()}
               
                  style={Styles.resetBox}
                >
                  <Text style={Styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                 onPress={() =>
                  {
                  setVisible(false)
                  btnSchedularData()}}
                  style={Styles.submitBox}
                >
                  <Text style={Styles.sumitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const [ChooseType, setChooseType] = useState([
    {
      id: 1,
      title: 'All Scheduler',
      value:'all',
      selected: true,
    },
    {
      id: 2,
      title: 'Pending',
      value:'PENDING_FOR_APPROVAL',
      selected: false,
    },
    {
      id: 3,
      title: 'Approved',
      value:'APPROVED',
      selected: false,
    },
    {
      id: 4,
      title: 'Rejected',
      value:'REJECTED',
      selected: false,
    },
    {
      id: 5,
      title: 'Drafts',
      value:'DRAFT',
      selected: false,
    },
    {
      id: 6,
      title: 'Published',
      value:'PUBLISHED',
      selected: false,
    },
    {
      id: 7,
      title: 'Finished',
      value:'FINISHED',
      selected: false,
    },
  ]);


  const btnupdatearraow = async (type) => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter`;
    const queryParams = [];

    for (const key in filterData) {
      if ( filterData[key] !== undefined &&filterData[key] !== "" && filterData[key] !== null)
      {
        if (
          filterData[key] !== undefined &&
          filterData[key] !== "" &&
          filterData[key] !== null
        ) { 
          if (key === "startDate") {
            // Alert.alert("op",new Date(filterData[key]).getTime()+"="+new Date(filterData[key]))
            const createdFromTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'createdFrom'}=${createdFromTimestamp}`);
          } else if (key === "endDate") {
            const createdToTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'createdTo'}=${createdToTimestamp}`);
          } else if (key === "currentPage") {
            if(visible == false){
            queryParams.push(`${key}=${filterData[key]}`);
            }
            else
            {
              queryParams.push(`${key}=${1}`);
            }
          } 
          else if (key === "aspectRatioId") {
            if(filterData[key] != 0)
            {
            queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
            }
          } 
          else if (key === "sortByPlanogramName") {
            if(type === "Scheduler Name")
            {
            queryParams.push(`${key}=${encodeURIComponent(filterData[key] == true ? false : true)}`);
            setFilterData({ ...filterData, sortByPlanogramName: filterData.sortByPlanogramName == true ? false :true});
   
            }

          } 
         
          else if (key === "sortByCreatedOn") {
            if(type === "Created On")
            {
            queryParams.push(`${key}=${encodeURIComponent(filterData[key]  == true ? false : false)}`);
            setFilterData({ ...filterData, sortByCreatedOn: filterData.sortByCreatedOn == true ? false :true});
               
            }
        
          } 
          else {
           queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
          }   
      }
    }
  }

  if(visible == true){
    queryParams.push(`${'isAdvanceSearch'}=${true}`);
  }
   if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }
    getSchedulerList(endPoint, setIsLoading);
  };
useEffect(()=>{
  console.log("schedularData calling",filterData.PlanogramName)
  btnSchedularData()
},[filterData.PlanogramName,filterData.CreatedBy,filterData.ApprovedBy])

  const btnSchedularData = async () => {
    // console.log("schedularData calling",filterData.PlanogramName)
    // setselectedID(4)
   
    let slugId = await getStorageForKey("slugId");
    changeTable(filterData.state)
    let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter`;
    const queryParams = [];
    
    for (const key in filterData) {
      if ( filterData[key] !== undefined &&filterData[key] !== "" && filterData[key] !== null)
      {
        if (
          filterData[key] !== undefined &&
          filterData[key] !== "" &&
          filterData[key] !== null
        ) { 
          if (key === "startDate") {
            // Alert.alert("op",new Date(filterData[key]).getTime()+"="+new Date(filterData[key]))
            const createdFromTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'createdFrom'}=${createdFromTimestamp}`);
          } else if (key === "endDate") {
            const createdToTimestamp = new Date(filterData[key]).getTime();
            queryParams.push(`${'createdTo'}=${createdToTimestamp}`);
          } else if (key === "currentPage") {
            if(visible == false){
            queryParams.push(`${key}=${filterData[key]}`);
            }
            else
            {
              queryParams.push(`${key}=${1}`);
            }
          } 
          else if (key === "aspectRatioId") {
            if(filterData[key] != 0)
            {
            queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
            }
          } 
          else {
           queryParams.push(`${key}=${encodeURIComponent(filterData[key])}`);
          }   
      }
    }
    }

    if(visible == true){
    queryParams.push(`${'isAdvanceSearch'}=${true}`);
    }
    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }
    // console.log("enjndjnjenfjnjenf=====> endpoint",endPoint)
      // setVisible(false)
      // console.log("schedularData calling1234",filterData.PlanogramName)
      getSchedulerList(endPoint, ()=>{});
  };

  const userDetail = async () => {
    let slugId = await getStorageForKey("slugId");
    let params = {
      slugId,
    };
    getUserData(params, setIsLoading);
  };


  
  const Workflow = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `service-gateway/ums/${slugId}/v1/customer/work-flow`;
    const params = {
      endpoint: endPoint,
    };
    const succussCallBack = async (response) => {
      setworkflowData(response?.data)
      if((response?.data?.approverWorkFlow == "PLANOGRAM" && userList?.data?.isSchedulerEnabled) || (response?.data?.approverWorkFlow == "PLANOGRAM_AND_CAMPAIGN" && userList?.data?.isSchedulerEnabled))
      {
        setIsapproval(true)
        await setStorageForKey('isapproval', true);
      }
     
     else
     {
      await setStorageForKey('isapproval', false);
     }
     // GetTenent();
   };
  const failureCallBack = (error) => {  
  
  };

  SchedulerManagerService.Workflow(
    params,
    succussCallBack,
    failureCallBack
  );
  };

  const userList = useSelector((state) => state.userReducer.userDetails);




  
  const btnSchedularData1 = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter?currentPage=1&noPerPage=10&isAdvanceSearch=false`;
  
    getSchedulerList(endPoint, setIsLoading);
  };


  const changeTable=(index)=>{
     
        if(index=="all"){
          console.log(index,"all")
          return setselectedID(0);
        }
        else if(index=="PENDING_FOR_APPROVAL"){
          console.log(index,"pending")
          return setselectedID(1);
        }
        else if(index=="APPROVED"){
          console.log(index,"approved")
          return setselectedID(2);
        }
        else if(index=="REJECTED"){
          console.log(index,"rejected")
          return setselectedID(3);
        }else if(index=="DRAFT"){
            console.log(index,"draft")
          return setselectedID(4);
        }else if(index=="PUBLISHED"){
            console.log(index,"published")
          return setselectedID(5);
        }else if(index=="FINISHED"){
          return setselectedID(6);
        }
        else{
          return setselectedID(0);
        }
      
    
  };



  useEffect(() => {
    if (schedularlistss?.result && schedularlistss?.result.length > 0) {
      let planogramList1 = schedularlistss?.result.map((item, index) => {
        return { ...item, checkStatus: false };
      });
     setschedularlist([...planogramList1]);
     setschedulerpagination(schedularlistss?.pagination)
    }
    else
    {
      setschedularlist([]);
    }
    // setVisible(false);
  }, [schedularlistss]);



  
  const btnOpenstopType = (id) => {
      setConfirmBoxData({
          ...confirmBoxData,
          title: "Stop Scheduler",
          description: "Are you sure you want to Stop this Scheduler ?",
          confirmModalFlag: true,
          actionType: "Stop",
          actionData: id,
          loading:false
        });
  };

  const btnOpenModelType = (state, id) => {

    switch (state) {
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Scheduler",
          description: "Are you sure you want to delete Scheduler ?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
          loading:false
        });
        break;
        case "DeleteAll":
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Delete Scheduler",
            description: "Are you sure you want to delete Scheduler ?",
            confirmModalFlag: true,
            actionType: "DeleteAll",
            actionData: id,
            loading:false
          });
          break;
      default:
          break;
    }
  };

  const btnDeleteBulkData = async () => {
    let slugId = await getStorageForKey("slugId");
    let selectedPlanogramStr = schedularlist.filter(
      (item) => (item.checkStatus == true)
    );
    let ids = selectedPlanogramStr.map((item) => {
      return item.planogramId;
    });

    const params = {
      ids: ids,
      slugId: slugId,
    };

    console.log("parammmm sechduler delete",params)

    if(ids?.length> 0)
    {
      const succussCallBack = async (response) => {
       
        if (response?.result?.badRequest.length <= 0) {
         setConfirmBoxData({
           ...confirmBoxData,
           confirmModalFlag: false,
           loading: false,
         });
         setSuccessModal(true);
         setSuccessMsg("Scheduler delete Successfully")
         
         setTimeout(() => {
               btnSchedularData();
         }, 200);
       }else if(response?.result?.badRequest.length > 0){
         setConfirmBoxData({
           ...confirmBoxData,
           confirmModalFlag: false,
           loading: false,
         });
         alert(response?.result?.badRequest[0].message)
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
     SchedulerManagerService.deleteSchedulerString(
       params,
       succussCallBack,
       failureCallBack
     );
    }
    else
    {
      Alert.alert('Alert!', 'Please select Scheduler to delete.', [
        {text: 'Okay', onPress: () => {
          setConfirmBoxData({
            ...confirmBoxData,
            confirmModalFlag: false,
            loading: false,
          });
        }},
      ]);
    }
   
 
  };


  const btnFerPormfaction = () => {
   
    switch (confirmBoxData.actionType) {
      case "Delete":
        btnDeletescheduler(confirmBoxData.actionData);
        break;
      case "Stop":
          btnstopscheduler(confirmBoxData.actionData);
          break;
      case "DeleteAll":
          {
            btnDeleteBulkData();
          }
          break;
      default:
        break;
    }
  };

  const btnstopscheduler = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      id: id,
      slugId: slugId,
    };
   
    const succussCallBack = async (response) => {
      console.log("stop sech",JSON.stringify(response))
     
      if (response?.status == 'SUCCESS' ) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessModal(true);
        setSuccessMsg("Scheduler Stop")
         
         setTimeout(() => {
               btnSchedularData();
         }, 200);
        // setTimeout(() => {
        //   Alert.alert('Success!', response?.message, [
        //     {text: 'Okay', onPress: () => {
        //       btnSchedularData();
        //     }},
        //   ]);
        // }, 300);
      }else {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert('Something went wrong')
      }
    };
    const failureCallBack = (error) => {
      Alert.alert("Error",error.message);
      console.log("StopSchedulerString error==>",JSON.stringify(error))
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    SchedulerManagerService.StopSchedulerString(
      params,
      succussCallBack,
      failureCallBack
    );
  };


  const btnDeletescheduler = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: [id],
      slugId: slugId,
    };
   
    const succussCallBack = async (response) => {
     
      if (response?.result?.badRequest.length <= 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessModal(true);
         setSuccessMsg("Scheduler delete Successfully")
         
         setTimeout(() => {
               btnSchedularData();
         }, 200);
      }else if(response?.result?.badRequest.length > 0){
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        alert(response?.result?.badRequest[0].message)
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
    SchedulerManagerService.deleteSchedulerString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  

  const countbystate = async (id) => {
    const succussCallBack = async (response) => {
        setcountvalue(response?.result)   
     };
    const failureCallBack = (error) => {  
    };

    SchedulerManagerService.Countbystate(
      {},
      succussCallBack,
      failureCallBack
    );
  };


  const onRadioBtnClick = async (item,index) => {
    setselectedID(index);
    let slugId = await getStorageForKey("slugId");
    
    if(index == 0)
    {
      let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter?currentPage=1&noPerPage=10&isAdvanceSearch=false`;
      console.log(endPoint)
      getSchedulerList(endPoint, setIsLoading);
    }
    else
    {
      let endPoint = `capsuling-service/api/capsuling/getPlanogramByFilter?currentPage=1&noPerPage=10&state=${item.value}&isAdvanceSearch=false`;
      console.log(endPoint)
      getSchedulerList(endPoint, setIsLoading);
    }
   

  };

  const [selectedID, setselectedID] = useState(0);

  const renderactions = ({item, index}) => (
       <TouchableOpacity 
       onPress={() => onRadioBtnClick(item,index)}
       style={{backgroundColor: selectedID == index ? '#dfe0f2': '#ffffff',width:170,height:50,flexDirection:'row', alignItems: 'center',borderRightWidth:1,borderRightColor:themeColor.iconGrey}} 
       >
          <View style={{ flexDirection: 'row',width:'90%'}}>
            <AppText style={[Styles.scheduleText]}>{item.title}</AppText>
            <View style={{borderRadius: 20,
              justifyContent: 'center',height:40,width:40,
              alignItems: 'center',backgroundColor:themeColor.themeColor}}>
                <Text style={{fontSize: moderateScale(14), 
                fontWeight: '500',textAlign: 'center', width:40,
                color: '#fff',}}>{bindvalue(index)}</Text>
              </View> 
          </View>
       </TouchableOpacity>
  );


  const bindvalue = index => {
    switch (index) {
      case 0:
        return countvalue?.totalPlanograms;
      case 1:
        return countvalue?.pendingPlanograms;
      case 2:
        return countvalue?.approvedPlanograms;
      case 3:
        return countvalue?.rejectionPlanograms;
        case 4:
        return countvalue?.draftPlanograms;
        case 5:
        return countvalue?.publishedPlanograms;
        case 6:
        return countvalue?.finishedPlanograms;
      default:
        return '';
    }
  };





  const Styles = SchedulerStyles(themeColor);
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
      <ClockHeader />
      <View style={Styles.headerContainer}>
        <CreateNewHeader
          title="Scheduler Management"
          onClickIcon={() => navigation.goBack()}
        />
      </View>
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={Styles.mainContainer}>
          <CommonHeaderTitleAction title="Scheduler" 
          renderDelete={authorization.includes(PREVILAGES.SCHEDULER.DELETE_SCHEDULER)} 
          btnOpenModelType={btnOpenModelType}  />
        
           <AdvSearchAndAdd
            title1="Advance Search"
            title2="+ Add Scheduler"
            containerStyle={{
              marginVertical: moderateScale(5),
            }}
            renderAdd={authorization.includes(PREVILAGES.SCHEDULER.ADD_SCHEDULER)}
            onClickSearch={() => {
              setVisible(true);
            }}
            onClickAdd={() => {
              navigation.navigate(NAVIGATION_CONSTANTS.ADD_SCHEDULER);
            }}
          />
          <View style={Styles.schedulerList}>
            <View style={{ flexDirection:'row',paddingTop:5}}>
              <FlatList horizontal
              keyExtractor={(item,index)=> index}
              data={ChooseType}
              renderItem={renderactions}
              />    
            </View>


            {/* <TouchableOpacity onPress={() => resetFilters()}>
            <AppText style={Styles.scheduleText}>All Scheduler</AppText>
             
               </TouchableOpacity>
              <AppText style={Styles.scheduleText}>Pending</AppText>
              <AppText style={Styles.scheduleText}>Approved</AppText>
              <AppText style={Styles.scheduleText}>Rejected</AppText>
              <AppText style={Styles.scheduleText}>Drafts</AppText>
              <AppText style={Styles.scheduleText}>Published</AppText>
              <AppText style={Styles.scheduleText}>Finished</AppText>
            </View> */}
            <View style={Styles.schedulerBody}>
              <SchedulerBody schedularlist={schedularlist}  
                btnSchedularData={btnSchedularData}
                setFilterData={setFilterData}
                filterData={filterData}
                approval={Isapproval}
                btnSchedularData1 ={btnupdatearraow}
                btnOpenstopType={btnOpenstopType}
                setschedularlist={setschedularlist}
                btnOpenModelType={btnOpenModelType}></SchedulerBody>
             
              
            </View>
            {schedularlist.length==0&&<AppText style={{color:'black',marginHorizontal:10,marginVertical:10}}>No Data Found</AppText>}
            
          </View>
            {schedulerpagination?.totalItemCount>0?<AppText style={[Styles.totalRecords,{color:'black'}]}>
              Total Records:{schedulerpagination?.firstItemNumber} - {schedulerpagination?.lastItemNumber} 
              {' '}of {schedulerpagination?.totalItemCount}
            </AppText>:null}
         
          


          <Pagination  
          setState={handlePageApi}
          pageNumber={filterData.currentPage}
          totalpage={pageCount}
          />
          <CopyRightText />
        </View>
      </ScrollView>
      {advancedSearchModal()}
    </View>
  );
};

export default Scheduler;
