import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeaderForCampaign";
import AppText from "../../Components/Atoms/CustomText";
import Pagination from "../../Components/Atoms/Pagination";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import ThemedText from "../../Components/Atoms/ThemedText";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import CampaignBody from "../../Components/Organisms/CMS/Campaign/CampaignBody";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CampaignStyles from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  CampaignManagerService,
  getCampaignArchiveData,
  getCampaignData,
  getCampaignPageData,
  getCampaignSearchData,
} from "./CompainApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { removeCampaingnList } from "../../appConfig/Redux/Action/campaignAction";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import AdvSearchAndAdd from "../../Components/Atoms/AdvSearchAndAdd";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import Loader from "../../Components/Organisms/CMS/Loader";
import { getResolutionData, getWorkFlow } from "../../Services/AxiosService/ApiService";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import { PREVILAGES } from "../../Constants/privilages";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import PaginationComp from "../../Components/Atoms/PaginationComp";

const CampaignManagement = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [selectAllCampaingFlag, setSelectAllCampaingFlag] = useState(false);
  const [tabName, setTabName] = useState("All Campaign");
  const [campaignForm, setCampaignForm] = useState({
    aspectRatio: "",
    durationSign: "",
    audio: "",
    regionSign: "",
    region: "",
    state: "",
    duration: "",
    tag: "",
  });
  const [campaignCounts, setCampaignCounts] = useState({});
  const [campaignHeaders, setCampaignHeaders] = useState([
    {
      name: "All Campaign",
      count: 0,
      color: themeColor.themeColor,
      status: true,
    },
    {
      name: "Archived",
      count: 0,
      color: themeColor.failedRed,
      status: false,
    },
    // {
    //   name: "Draft",
    //   count: 0,
    //   color: themeColor.archiveBlue,
    //   status: false,
    // },
    // {
    //   name: "Published",
    //   count: 0,
    //   color: themeColor.draftYellow,
    //   status: false,
    // },
    // {
    //   name: "Submitted",
    //   count: 0,
    //   color: themeColor.uploadGreen,
    //   status: false,
    // },
  ]);
  const [campaignList,setcamaignList]=useState({})

  const dispatch = useDispatch();
 
  const { authorization,userRole } = useSelector((state) => state.userReducer);
  const [isLocRestricted,setisLocRestricted]=useState(userRole?.isUserLocationRestricted)
  const campaignArchiveList = useSelector(
    (state) => state.CampaignReducer.campaignArchiveList
  );
  let totalItemCount =0;
  let numPerPage = 0;
  let currentPage = 0;
  let pageCount = 0;

  const [searchData, setSearchData] = useState({
    pageNumber: 1,
    noPerPage: 10,
    createdBy: "",
    campaignName: "",
    aspectRatioId: 0,
    tags: "",
    state: "",
    regions: 0,
    type: "",
    regionsSign: "eq",
    duration: 0,
    durationSign: "eq",
    isArchieved: false,
    audio: "",
    isUsedForUseEffect: "",
  });

  const [successModal,setSuccessModal]=useState(false)
  const [successMsg,setSuccessMsg]=useState("")

  const onComplete = () => {
    setSuccessModal(false);
  };
 
  const getCmpData = async (endPoint,setIsLoading = () => {}) => {
    const slugId = await getStorageForKey("slugId");
    setIsLoading(true);
  
    const successCallBack = async (response) => {
      // console.log("get cmp data",response)
      setcamaignList(response)
      let paginationDetail = response?.paginationDetail;
      let campaigns = response?.data;
      
      if(campaigns.length>0){
        let campaigns1 = campaigns?.map((item, index) => {
          return { ...item, checkStatus: false };
        });
        setCampaignData([...campaigns1]);
      }else{
        setCampaignData([]);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
  
    const errorCallBack = (response) => {
      console.log('getCmpData error', response)
      setIsLoading(false);
    };
  
    CampaignManagerService.ftchCampdata(
      { slugId,endPoint },
      successCallBack,
      errorCallBack
    );
  };

  useEffect(() => {
    getWorkFlow(navigation)
    getResolutionData(setIsLoading);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("ffff00000000000cccccccccuuuusssss")
      makeUrlData();
      btnGetCmpaignCounts();
    });
    return unsubscribe;
  }, []);

  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );
  const workFlow = useSelector(
    (state) => state.userReducer.workFlow
  );
 

  const resolutionDropdownData = resolutionList.map((resolution) => ({
    label: resolution.resolutions,
    value: resolution.aspectRatioId,
  }));

  const getArchiveData = async (countData) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      if (response.paginationDetail) {
        setCData(countData, response?.paginationDetail?.totalItemCount);
      }
      
    };

    const failureCallBack = (error) => {
      console.log("getArchiveData responce error==", response);
    };

    CampaignManagerService.getArchiveData(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnGetCmpaignCounts = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("responseresponse123", response);
      if (response?.data) {
        // setCData(response?.data)
        setCampaignCounts(response?.data);
        setTimeout(() => {
          getArchiveData(response?.data);
        }, 1000);
      }
    };

    const failureCallBack = (error) => {
      console.log("btnCloneCampaign response", error);
    };
    CampaignManagerService.getCmpaignDataCount(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const setCData = (data, archiveCount) => {
    let allData = 0;
    if (data?.totalCampaigns) {
      allData = data?.totalCampaigns - archiveCount;
    } else {
      allData = data?.totalCampaigns;
    }

    let x = [
      {
        name: "All Campaign",
        count: allData || 0,
        color: themeColor.themeColor,
        status: tabName=="All Campaign"?true:false,
      },
      {
        name: "Archived",
        count: archiveCount || 0,
        color: themeColor.failedRed,
        status: tabName=="Archived"?true:false,
      },
      // {
      //   name: "Draft",
      //   count: data?.draftCampaigns || 0,
      //   color: themeColor.archiveBlue,
      //   status: false,
      // },
      // {
      //   name: "Published",
      //   count: data?.publishedCampaign || 0,
      //   color: themeColor.draftYellow,
      //   status: false,
      // },
      // {
      //   name: "Submitted",
      //   count: data?.submittedCampaigns || 0,
      //   color: themeColor.uploadGreen,
      //   status: false,
      // },
    ];
    setCampaignHeaders([...x]);
    // console.log("xxxxxxxxxxxxxxxx", x);
  };

  // useEffect(()=>{
  //   makeUrlData()
  // },[searchData])

  const makeUrlData = async (page = "", noOfItems = "") => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `service-gateway/cms/${slugId}/v1/campaign/search`;
    const queryParams = [];

    if (page != "" && noOfItems != "") {
      setSearchData({ ...searchData, pageNumber: page, noPerPage: noOfItems });
    }

    for (const key in searchData) {
      if (
        searchData[key] != undefined &&
        searchData[key] != "" &&
        searchData[key] !== null &&
        searchData[key] !== 0 &&
        key != "isUsedForUseEffect"
      ) {
        console.log("key 306",key,searchData[key])
        if (key == "pageNumber" && page != "") {
          queryParams.push(`${key}=${page}`);
        } else if (key == "noPerPage" && noOfItems != "") {
          queryParams.push(`${key}=${noOfItems}`);
        } else {
          queryParams.push(`${key}=${searchData[key]}`);
        }
      } else if (key == "isArchieved") {
        queryParams.push(`${key}=${searchData[key]}`);
      }
    }
    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }
    getCmpData(endPoint, ()=>{});
  };

  const resetFormApi = async () => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `content-management/cms/${slugId}/v1/campaign/search`;
    let seadata = {
      ...searchData,
      pageNumber: 1,
      noPerPage: 10,
      regions: 0,
      regionsSign: "eq",
      aspectRatioId: 0,
      state: "",
      type: "",
      duration: 0,
      durationSign: "eq",
      audio: "",
      tags: "",
    };
    setSearchData({ ...seadata });
    let queryParams = [];
    for (const key in seadata) {
      if (
        seadata[key] != undefined &&
        seadata[key] != "" &&
        seadata[key] !== null &&
        seadata[key] !== 0 &&
        key != "isUsedForUseEffect"
      ) {
        queryParams.push(`${key}=${seadata[key]}`);
      } else if (key == "isArchieved") {
        queryParams.push(`${key}=${seadata[key]}`);
      }
    }
    if (queryParams.length > 0) {
      endPoint += `?${queryParams.join("&")}`;
    }
    getCmpData(endPoint, setIsLoading);
  };

  const handlePageApi = async (index) => {
    let slugId = await getStorageForKey("slugId");
    let endPoint = `content-management/cms/${slugId}/v1/campaign/search`;
    setSearchData({ ...searchData, pageNumber: index });
    for (const key in searchData) {
      if (
        searchData[key] != undefined &&
        searchData[key] != "" &&
        searchData[key] !== null &&
        searchData[key] !== 0 &&
        key != "isUsedForUseEffect"
      ) {
        console.log(key)
        if (key == "pageNumber") {
          endPoint = `${endPoint}?${key}=${index}`;
        } else if (key == "isArchieved") {
          console.log("sdsdddddddddddddddddddddddddddddddddddddddddddd")
          endPoint = `${endPoint}&${key}=${searchData[key]}`;
        } else {
          endPoint = `${endPoint}&${key}=${searchData[key]}`;
        }
      }else if (key == "isArchieved") {
        endPoint = `${endPoint}&${key}=${searchData[key]}`;
      }
    }
    console.log('endPointendPoint===> ',endPoint,searchData.isArchieved)
    getCmpData(endPoint, setIsLoading);
    setVisible(false);
  };

  const btnresetSearchData = () => {
    setSearchData({
      pageNumber: 1,
      noPerPage: 10,
      audio: "",
      createdBy: "",
      campaignName: "",
      aspectRatioId: 0,
      tags: "",
      state: "",
      regions: 0,
      type: "",
      regionsSign: null,
      duration: 0,
      durationSign: "",
      isArchieved: false,
    });
  };

  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const btnOpenModelType = (state, id, item = "") => {
    
    switch (state) {
      case "Edit":
        {
          navigation.navigate(NAVIGATION_CONSTANTS.EDIT_CAMPAIGN, {
            campaignItem: item,
          });
        }
        break;
        case "LocationEdit":
        {
          navigation.navigate(NAVIGATION_CONSTANTS.LOC_EDITCAMPAIGN, {
            campaignItem: item,
          });
        }
        break;
      case "Delete":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Campaign",
          description: "Are you sure you want to delete Campaign ?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
        });
        break;
      case "Clone":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Clone Campaign",
          description: "Are you sure you want to clone Campaign ?",
          confirmModalFlag: true,
          actionType: "Clone",
          actionData: id,
        });
        break;
      case "Archive":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Archive Campaign",
          description: "Are you sure you want to archive Campaign ?",
          confirmModalFlag: true,
          actionType: "Archive",
          actionData: id,
        });
        break;
      case "UnArchive":
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Un-Archive Campaign",
          description: "Are you sure you want to Un-Archive Campaign ?",
          confirmModalFlag: true,
          actionType: "UnArchive",
          actionData: id,
        });
        break;
      case "DeleteAll":
        {
          let selectedCampStr = campaignData.filter(
            (item) => item.checkStatus == true
          );
          if (selectedCampStr.length <= 0) {
            Alert.alert("Inform", "Please select campaign");
          } else {
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Delete confirm",
              description: "Are you want to delete all selected data ?",
              confirmModalFlag: true,
              actionType: "DeleteAll",
              actionData: 0,
            });
          }
        }
        break;
      case "ArchivedAll":
        {
          console.log("hfhhgf");
          let selectedCampStr = campaignData.filter(
            (item) => item.checkStatus == true
          );
          if (selectedCampStr.length <= 0) {
            Alert.alert("Inform", "Please select campaign");
          } else {
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Archive confirm",
              description: "Are you want to archive all selected data ?",
              confirmModalFlag: true,
              actionType: "ArchivedAll",
              actionData: 0,
            });
          }
        }
        break;
      case "UnarchivedAll":
        {
          let selectedCampStr = campaignData.filter(
            (item) => item.checkStatus == true
          );
          if (selectedCampStr.length <= 0) {
            Alert.alert("Inform", "Please select campaign");
          } else {
            setConfirmBoxData({
              ...confirmBoxData,
              title: "Un-Archive confirm",
              description: "Are you want to un-archive all selected data ?",
              confirmModalFlag: true,
              actionType: "UnarchivedAll",
              actionData: 0,
            });
          }
        }
        break;
      default:
        break;
    }
  };

  const btnFerPormfaction = () => {
    switch (confirmBoxData.actionType) {
      case "Delete":
        btnDeleteCampaign(confirmBoxData.actionData);
        break;
      case "Clone":
        btnCloneCampaign(confirmBoxData.actionData);
        break;
      case "Archive":
        btnArchiveCampaign(confirmBoxData.actionData);
        break;
      case "ArchivedAll":
        btnArchiveCampaign(confirmBoxData.actionData);
        break;
      case "UnArchive":
        btnUnArchiveCampaign(confirmBoxData.actionData);
        break;
      case "UnarchivedAll":
        btnUnArchiveCampaign(confirmBoxData.actionData);
        
        break;
      case "DeleteAll":
        btnDeleteBulkData();
        break;

      default:
        break;
    }
  };

  const btnArchiveCampaign = async (id = 0) => {
    let slugId = await getStorageForKey("slugId");
    let ids = id;
    if (ids == 0) {
      ids = campaignData.filter((item) => item.checkStatus == true);
      ids = ids.map((val) => {
        return val.campaignId;
      });
    }
    const params = {
      ids: ids,
      slugId: slugId,
    };

    const succussCallBack = async (response) => {
      setSelectAllCampaingFlag(false)
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      makeUrlData();
      btnGetCmpaignCounts();
    };

    const failureCallBack = (error) => {
      console.log("btnCloneCampaign response", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignManagerService.archiveCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnUnArchiveCampaign = async (id = 0) => {
    let slugId = await getStorageForKey("slugId");
    let ids = id;
    if (ids == 0) {
      ids = campaignData.filter((item) => item.checkStatus == true);
      ids = ids.map((val) => {
        return val.campaignId;
      });
    }
    const params = {
      ids: ids,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      setSelectAllCampaingFlag(false)
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      makeUrlData();
      btnGetCmpaignCounts();
    };

    const failureCallBack = (error) => {
      console.log("btnCloneCampaign response", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignManagerService.unArchiveCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnCloneCampaign = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: id,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      // if (response?.code == 200) {
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      makeUrlData();
      btnGetCmpaignCounts();
      // }
    };

    const failureCallBack = (error) => {
      console.log("btnCloneCampaign response", error);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignManagerService.cloneCampaign(
      params,
      succussCallBack,
      failureCallBack
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


  const btnDeleteCampaign = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: [id],
      slugId: slugId,
    };

    const succussCallBack = async (response) => {
      
      if (response.data.badRequest.length <= 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessModal(true)
        setSuccessMsg("Campaign delete successfully")
        setTimeout(() => {
          makeUrlData();
          btnGetCmpaignCounts();
        }, 300);
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
      console.log("campaignDeleteError", response);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };
    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignManagerService.DeleteCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnDeleteBulkData = async () => {
    let slugId = await getStorageForKey("slugId");

    let selectedCampStr = campaignData.filter(
      (item) => item.checkStatus == true
    );
    let ids = selectedCampStr.map((item) => {
      return item?.campaignId;
    });
    const params = {
      slugId: slugId,
      ids: ids,
    };
    const succussCallBack = async (response) => {
      setSelectAllCampaingFlag(false)
      if (response.data.badRequest.length == 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setSuccessModal(true)
        setSuccessMsg("Campaign delete successfully")
        setTimeout(() => {
          makeUrlData();
          btnGetCmpaignCounts();
        }, 300);
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
      // console.log('campaignDeleteError', response)
    };
    setConfirmBoxData({ ...confirmBoxData, loading: true });
    CampaignManagerService.DeleteCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const advancedSearchModal = () => {
    let statusArr=[]
    if(workFlow && (workFlow.approverWorkFlow === "CAMPAIGN" || workFlow.approverWorkFlow ==='PLANOGRAM_AND_CAMPAIGN')){
      statusArr=[
        { label: "All", value: "" },
        { label: "Draft", value: "DRAFT" },
        { label: "Published", value: "PUBLISHED" },
        { label: "Approved", value: "APPROVED" },
        { label: "Rejected", value: "REJECTED" },
        { label: "Pending for approval", value: "PENDING_FOR_APPROVAL" },
      ]
    }else{
      statusArr=[
        { label: "All", value: "" },
        { label: "DRAFT", value: "DRAFT" },
        { label: "SUBMITTED", value: "SUBMITTED" },
        { label: "PUBLISHED", value: "PUBLISHED" },
      ]
    }



    return (
      <Modal visible={visible} 
        onRequestClose={()=> setVisible(false)}
        style={Styles.mainContainerModal}
      >
        <SafeAreaView style={{ flex: 1 }}>
        <ScrollView  contentContainerStyle={{ paddingBottom: (Platform.OS === 'ios' && isKeyboardOpen) ? 200 : 0 , }}>
            <View style={Styles.headerContainerModal}>
              <CreateNewHeader
                title="Advance Search"
                onClickIcon={() => {
                  setVisible(false);
                }}
              />
            </View>
            <View style={{ flex: 1, paddingHorizontal: 15 }}>
              {/* ratio============= */}
              <View style={{ width: "100%" }}>
                <AppText style={Styles.aspectText}>Aspect Ratio</AppText>
                <CampaignDropDown
                  dataList={resolutionDropdownData}
                  placeHolderText="Select Ratio"
                  onChange={(item) => {
                    console.log("item.value ", item);
                    setSearchData({ ...searchData, aspectRatioId: item.value });
                  }}
                  value={searchData?.aspectRatioId}
                />
              </View>
              {/* no of resion======== */}
              <View style={Styles.ratioContainer}>
                <AppText style={Styles.aspectText}>No. of Regions</AppText>
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
                        setSearchData({
                          ...searchData,
                          regionsSign: item.value,
                        });
                      }}
                      value={searchData?.regionsSign}
                    />
                  </View>
                  <AppTextInput
                    containerStyle={Styles.noOfregionInput}
                    onChangeText={(value) => {
                      const sanitizedInput = value.replace(/[^0-9]/g, "");
                      setSearchData({ ...searchData, regions: sanitizedInput });
                    }}
                    keyboardType="numeric"
                    value={searchData?.regions}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                </View>
              </View>

              {/* state========= */}
              <View style={{ width: "100%" }}>
                <AppText style={Styles.aspectText}>State</AppText>
                <CampaignDropDown
                  dataList={statusArr}
                  placeHolderText="Select State"
                  onChange={(item) => {
                    setSearchData({ ...searchData, state: item.value });
                  }}
                  value={searchData?.state}
                />
              </View>

              {/*===============Durations========== */}

              <View style={Styles.ratioContainer}>
                <AppText style={Styles.aspectText}>Durations(in seconds)</AppText>
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
                        setSearchData({
                          ...searchData,
                          durationSign: item.value,
                        });
                      }}
                      value={searchData?.durationSign}
                    />
                  </View>

                  <AppTextInput
                    containerStyle={Styles.noOfregionInput}
                    onChangeText={(value) => {
                      const sanitizedInput = value.replace(/[^0-9]/g, "");
                      setSearchData({
                        ...searchData,
                        duration: sanitizedInput,
                      });
                    }}
                    keyboardType="numeric"
                    value={searchData?.duration}
                    placeholderTextColor={themeColor.placeHolder}
                    textInputStyle={{
                      fontSize: moderateScale(15),
                    }}
                  />
                </View>
              </View>

              {/* ===========audio======== */}
              <View style={{ width: "100%" }}>
                <AppText style={Styles.aspectText}>Audio</AppText>
                <CampaignDropDown
                  dataList={[
                    { label: "All", value: "" },
                    { label: "Yes", value: "True" },
                    { label: "No", value: "False" },
                  ]}
                  placeHolderText="Select Audio"
                  onChange={(item) => {
                    console.log("Select AudioSelect AudioSelect Audio")
                    setSearchData({ ...searchData, audio: item.value });
                  }}
                  value={searchData?.audio}
                />
              </View>

              <View style={Styles.ratioContainer}>
                <AppText style={Styles.aspectText}>Tag</AppText>
                <AppTextInput
                  containerStyle={Styles.tagInput}
                  onChangeText={(value) => {
                    setSearchData({ ...searchData, tags: value });
                  }}
                  value={searchData?.tags}
                  placeholderTextColor={themeColor.placeHolder}
                  textInputStyle={{
                    fontSize: moderateScale(15),
                  }}
                />
              </View>
              <View style={Styles.SubmitContainer}>
                <TouchableOpacity
                  onPress={() => {
                    resetFormApi();
                    setVisible(false) 
                  }}
                  style={Styles.resetBox}
                >
                  <Text style={Styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    makeUrlData()
                    setVisible(false)
                  }}
                  style={Styles.submitBox}
                >
                  <Text style={Styles.submitText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  useEffect(() => {
    makeUrlData();
  }, [searchData.isUsedForUseEffect]);

  const onChangeTab = (type) => {
    setTabName(type);
    // setSearchData({ ...searchData, noPerPage:10, pageNumber:1 });
    console.log("change hhhhhhhhhhhheasder",searchData.pageNumber)
    switch (type) {
      case "Archived":
        setSearchData({
          ...searchData,
          isArchieved: true,
          state: "",
          pageNumber:1,
          isUsedForUseEffect: "Archived",
        });
        break;
      case "Draft":
        setSearchData({
          ...searchData,
          isArchieved: false,
          state: "DRAFT",
          isUsedForUseEffect: "Draft",
        });
        break;
      case "Published":
        setSearchData({
          ...searchData,
          isArchieved: false,
          state: "PUBLISHED",
          isUsedForUseEffect: "PUBLISHED",
        });
        break;
      case "Submitted":
        setSearchData({
          ...searchData,
          isArchieved: false,
          state: "SUBMITTED",
          isUsedForUseEffect: "SUBMITTED",
        });
        break;
      case "All Campaign":
        setSearchData({
          ...searchData,
          isArchieved: false,
          state: "",
          pageNumber:1,
          isUsedForUseEffect: "All Campaign",
        });
        // makeUrlData(1, "", false);
        break;
      default:
        break;
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <ConfirmBox
        title={confirmBoxData.title}
        description={confirmBoxData.description}
        visible={confirmBoxData.confirmModalFlag}
        yesLoading={confirmBoxData.loading}
        yesButtonClick={() => {
          btnFerPormfaction();
        }}
        stateOperation={() => {
          console.log("no presssss")
          setConfirmBoxData({
            ...confirmBoxData,
            loading: false,
            confirmModalFlag: false,
          });
          setIsLoading(false)
        }}
      />

      <Loader visible={isLoading} />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.bodyContainer}>
          <CommonHeaderTitleAction
            titleTextStyle={{
              fontSize: moderateScale(17),
            }}
            title="Campaign Management"
            Header={tabName}
            pageName="CampaignString"
            totalItemCount={totalItemCount}
            currPage={searchData.pageNumber}
            btnOpenModelType={btnOpenModelType}
          />
          {tabName != "All Campaign" && (
            <ThemedButton
              onClick={() => {
                resetFormApi();
                setVisible(true);
              }}
              containerStyle={{
                width: "95%",
                alignSelf: "center",
                marginVertical: moderateScale(10),
              }}
              title="Advance Search"
            />
          )}
          {tabName == "All Campaign" && (
            <AdvSearchAndAdd
              title1="Advance Search"
              title2="Add Campaign"
              containerStyle={{
                marginVertical: moderateScale(5),
              }}
              onClickSearch={() => {
                resetFormApi();
               
                setVisible(true);
              }}
              onClickAdd={() => {
                btnresetSearchData();
                navigation.navigate(NAVIGATION_CONSTANTS.ADD_NEW_CAMPAIGN);
              }}
              renderAdd={authorization.includes(PREVILAGES.CAMPAIGN.ADD_CAMPAIGN)&&isLocRestricted==false}
            />
          )}

          <View style={Styles.campaignBody}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
            >
              {campaignHeaders.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    let data12 = campaignHeaders?.map((item) => {
                      return { ...item, status: false };
                    });
                    data12[index].status = true;
                    setSearchData({...searchData,pageNumber: 1,
                      noPerPage: 10,})
                    setCampaignHeaders([...data12]);
                    console.log("data12",data12,searchData.pageNumber)
                    onChangeTab(item.name);

                  }}
                  activeOpacity={0.7}
                  key={item.name}
                  style={Styles.campaignActiveHeaderContainer(item.status)}
                >
                  <AppText style={Styles.headerItemContainer}>
                    {item.name}
                  </AppText>
                  <ThemedText
                    title={item.count.toString()}
                    containerStyle={Styles.themedText(item.color)}
                    textStyles={{
                      color: themeColor.white,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
           
            <CampaignBody
              campaignForm={campaignForm}
              setIsLoading={setIsLoading}
              searchData={searchData}
              setSearchData={setSearchData}
              makeUrlData={makeUrlData}
              campaignList={campaignData}
              workFlow={workFlow}
              setCampaignData={setCampaignData}
              btnOpenModelType={btnOpenModelType}
              selectAllCampaingFlag={selectAllCampaingFlag}
              setSelectAllCampaingFlag={setSelectAllCampaingFlag}
            />
            {/* )} */}
            {/* {campaignData.length <= 0 && (
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
          {campaignData?.length ? (
            <>
              <AppText style={[Styles.totalRecords,{color:'black'}]}>
                  {`Total Records : ${campaignList?.paginationDetail.firstItemNumber} -${campaignList?.paginationDetail.lastItemNumber} of ${campaignList?.paginationDetail.totalItemCount}`}
                </AppText>
              <PaginationComp
                // setState={handlePageApi}
                
                onClick={handlePageApi}
                pageNumberLimit={5}
                currentPage1={searchData.pageNumber}
                totalPages={campaignList?.paginationDetail?.pageCount}
              />
            </>
          ) : null}

          <CopyRightText />
        </View>
      </ScrollView>
      {advancedSearchModal()}
    </View>
  );
};

export default CampaignManagement;
