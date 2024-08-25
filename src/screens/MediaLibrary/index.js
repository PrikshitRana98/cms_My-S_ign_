import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AppIcon from "../../Assets/Images/PNG/appIcon.png";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import InfoImage from "../../Assets/Images/PNG/info.png";
import MenuIcon from "../../Assets/Images/PNG/menu.png";
import AdvSearchAndAdd from "../../Components/Atoms/AdvSearchAndAdd";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import AppText from "../../Components/Atoms/CustomText";
import Pagination from "../../Components/Atoms/Pagination";
import Actions from "../../Components/Atoms/PlanogramActions";
import Separator from "../../Components/Atoms/Separator";
import ThemedText from "../../Components/Atoms/ThemedText";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import MediaScrollHeader from "../../Components/Organisms/CMS/MediaLibrary/mediaScrollHeader";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import {
  ListCampaignData,
  MediaListHeader,
  blankImg,
  campaignData,
  headers,
  mediaImage,
} from "./constants";
import MediaStyles from "./style";
import { MediaLibraryService } from "../../Services/AxiosService";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import Store from "../../appConfig/Redux/store";
import {
  removeMediaLib,
  updateMediaLib,
} from "../../appConfig/Redux/Action/mediaLibAction";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native-paper";
import {
  getArchivedList,
  getMediaLibData,
  updateToArchive,
} from "../../Services/AxiosService/ApiService";
import { useFocusEffect } from "@react-navigation/native";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import { TextInput } from "react-native-gesture-handler";
import DatePicker from "react-native-date-picker";
import AdvanceSrch from "./AdvanceSrch";
import SuccessModal from "../../Components/Molecules/SuccessModal";
import ConfirmBox from "../../Components/Organisms/CMS/ConfirmBox";
import Loader from "../../Components/Organisms/CMS/Loader";
import CommonHeaderTitleActionMedia from "../../Components/Atoms/commonHeaderMedia";
import MediaActions from "./MediaAction";
import { MediaApiService } from "./MediaApi";
import { PREVILAGES } from "../../Constants/privilages";
import { resetRedux } from "../../appConfig/AppRouter/Contents";


export const _getAllMediaBySearchFilter = (queryParamsData) => {
  const params = new URLSearchParams(queryParamsData).toString();
  // console.log(`/v1/media/search?${params}`)
  return params;
};

const dispatch = Store;

const blankImage = blankImg;

const MediaLibrary = ({ navigation }) => {

  const videoIcon=require('../../Assets/Images/PNG/Video.png')
  const audioIcon=require('../../Assets/Images/PNG/Audio.png')
  const imgIcon=require('../../Assets/Images/PNG/Image.png')
  const txtIcon=require('../../Assets/Images/PNG/text-format.png')
  const pdfIcon=require('../../Assets/Images/PNG/pdf.png')
  const docIcon=require('../../Assets/Images/PNG/Doc.png')
  const pptIcon=require('../../Assets/Images/PNG/ppt.png')
  const htmlIcon=require('../../Assets/Images/PNG/html.png')
  const rssIcon=require('../../Assets/Images/PNG/rss.png')
  const twiterIcon=require('../../Assets/Images/PNG/twitter.png')
  const fbIcon=require('../../Assets/Images/PNG/facebook.png')
  const stremIcon=require('../../Assets/Images/PNG/stream.png')
  const urlIcon=require('../../Assets/Images/PNG/url.png')
  

  

  const [mediaTotalCount,setmediaTotalCount]=useState(0);
  const [archiveTotalCount,setarchiveTotalCount]=useState(0);
  const [message,setMessage]=useState("")
  const [isModal,setisModal]=useState(false);
  const [selectAllMediaFlag,setselectAllMediaFlag]=useState(false);
  const [selectAllArchievedFlag,setselectAllArchievedFlag]=useState(false);
  const [MediaListData, setMediaListData] = useState([]);
  const [ArchivedListData, setArchivedListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [pageCount,setPageCount]=useState(1)
  const [confirmBoxData, setConfirmBoxData] = useState({
    loading: false,
    title: "",
    description: "",
    confirmModalFlag: false,
    actionData: null,
    actionType: "",
  });

  const MediaList = useSelector((state) => state.MediaLibReducer.MediaLibList);
  
  const { authorization } = useSelector((state) => state.userReducer);
  const ArchivedList = useSelector(
    (state) => state.MediaLibReducer.ArchivedList
  );


  useEffect(() => {
     
    // Alert.alert("ok",JSON.stringify(MediaList.data))
    if (MediaList?.data?.mediaDetails && MediaList?.data.mediaDetails.length > 0) {
      // setPageCount(MediaList.paginationDetail.pageCount);
      let mediaList1 = MediaList?.data.mediaDetails.map((item, index) => {
        return { ...item, checkStatus: false };
      });
      setMediaListData([...mediaList1]);
    }else{
      setMediaListData([]);
      setselectAllMediaFlag(false)
    }
    
  }, [MediaList]);

  useEffect(() => {
    // const data=[]
    if (ArchivedList?.data?.mediaDetails&& ArchivedList?.data?.mediaDetails.length > 0) {
      let ArchivedList1 = ArchivedList?.data.mediaDetails.map((item, index) => {
        return { ...item, checkStatus: false };
      });
      // data=[...ArchivedList1]
      setArchivedListData([...ArchivedList1]);
    }else{
      setArchivedListData([]);
      setselectAllArchievedFlag(false);
      // data=[]
    }
    // dispatch(updateMediaLib())

  }, [ArchivedList]);

  const [activeHeader, setActiveheader] = useState(0);

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [header, setHeader] = useState("Media Library");

  const [PageSize, setPageSize] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [mediaName, setMediaName] = useState("");
  const [uploadedBy, setuplodedBy] = useState("");
  const [tag, settag] = useState("");
  const [duration, setDuration] = useState("");
  const [uploadedDate, setuploadedDate] = useState("");

  // Advance search ********************************//

  const [AdvSrchModal, setAdvSrchModal] = useState(false);
  const [advUrl, setAdvurl] = useState("");
  const [srchObj, setSrchObj] = useState({
    created_date: { lte: "", gte: "" },
    duration_in_seconds: { gt: "" },
    file_size: { gt: "" },
    content_type: { eq: "" },
    tag: { eq: "" },
  });

  /***********************************************/

  const themeColor = useThemeContext();
  const Styles = MediaStyles(themeColor);
  const myStyles = HeaderStyles(themeColor);

  const [viewType, setViewType] = useState("list");

  const btnFerPormfaction = () => {
    
    switch (confirmBoxData.actionType) {
      case "Delete":
        setMessage("Delete media successfully")
        handleDeletePress(confirmBoxData.actionData)
        break;
      case "Archived":
        
        // console.log("confirmBoxData.actionData",confirmBoxData.actionData)
        handleArchive(confirmBoxData.actionData);
        break;

      case "ArchivedAll":
        setMessage("Archive media successfully")  
      // console.log("confirmBoxData.actionData",confirmBoxData.actionData)
      handleBulkArchived()
      break

      case "UnarchivedAll":
        setMessage("Unarchive media successfully")
        // console.log("confirmBoxData.actionData",confirmBoxData.actionData)
        handleBulkArchived()
      break

      case "DeleteAll":
        {
          setMessage("Delete media successfully")
          handleBulkDeletePress()
        }
        break;
      case "DeleteCampaign":
        {
          setMessage("Delete media successfully")
          btnDeleteCampaign(confirmBoxData.actionData)
        }
        break;
      default:
        break;
    }
  };

  const btnOpenModelType = (state, id) => {
    console.log("btnOpenModelType",state,id)
    switch (state) {
      case "Delete":
        setMessage("Delete media successfully")
        setConfirmBoxData({
          ...confirmBoxData,
          title: "Delete Selected Media",
          description: "Are you sure you want to delete Selected Media?",
          confirmModalFlag: true,
          actionType: "Delete",
          actionData: id,
        });
        break;
      case "Archived":
        if(header=="Archived"){
          console.log("archiveeee",id)
          setMessage("Unarchived media successfully")
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Unarchived Media",
            description: "Are you sure you want to unarchive selected media?",
            confirmModalFlag: true,
            actionType: "Archived",
            actionData: id,
          });

        }else{
          console.log("archiveeee",id)
          setMessage("Archive media successfully")
          setConfirmBoxData({
            ...confirmBoxData,
            title: "Archived Media",
            description: "Are you sure you want to archive selected media?",
            confirmModalFlag: true,
            actionType: "Archived",
            actionData: id,
          });
        }
        break;
      case "DeleteAll":
        {
         if(header=="Media Library"){
          let selectedCampStr = MediaListData.filter(
            (item) => item.checkStatus == true
          );
          let mediaaa=selectedCampStr.map((item)=>{
            return item.mediaDetailId
          })
          if (selectedCampStr.length <= 0) {
            
            Alert.alert("Warning", "Please select media");
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
         }else if(header=="Archived"){
          let selectedCampStr = ArchivedListData.filter(
            (item) => item.checkStatus == true
          );
          if (selectedCampStr.length <= 0) {
            Alert.alert("Warning", "Please select media ");
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
        }
        break;
        case "UnarchivedAll":
          {
            
             let selectedCampStr = ArchivedListData.filter(
               (item) => item.checkStatus == true
             );
             if (selectedCampStr.length <= 0) {
               Alert.alert("Warning", "Please select media ");
             } else {
              setConfirmBoxData({
                ...confirmBoxData,
                title: "UnArchived Media",
                description: "Are you want to unarchive all selected data ?",
                confirmModalFlag: true,
                actionType: "UnarchivedAll",
                actionData: id,
              });
              }
          }
          
        break;
        case "ArchivedAll":
          {
            
             let selectedCampStr = MediaListData.filter(
               (item) => item.checkStatus == true
             );
             if (selectedCampStr.length <= 0) {
               Alert.alert("Warning", "Please select media ");
             } else {
              
              setConfirmBoxData({
                ...confirmBoxData,
                title: "Archived Media",
                description: "Are you want to archive all selected data ?",
                confirmModalFlag: true,
                actionType: "ArchivedAll",
                actionData: id,
              });
             
            }
          }
        break;
      default:
        break;
    }
  };

  const handleAllSelect=(value) => {
      setselectAllMediaFlag(value);
      if(header=="Media Library"){
        let mediaList1;
      if (value) {
        mediaList1 = MediaList.data?.mediaDetails.map((item, index) => {
          return { ...item, checkStatus: true };
        });
      } else {
        mediaList1 = MediaList.data?.mediaDetails.map((item, index) => {
          return { ...item, checkStatus: false };
        });
      }
      setMediaListData([...mediaList1]);
      }
      else if(header=="Archived"){

        let archivedList1;
        if (value) {
          archivedList1 = ArchivedList.data?.mediaDetails.map((item, index) => {
            return { ...item, checkStatus: true };
          });
        } else {
          archivedList1 = ArchivedList.data?.mediaDetails.map((item, index) => {
            return { ...item, checkStatus: false };
          });
        }
        setArchivedListData([...archivedList1]);

      }
    }

    const multielectCompaign = (index) => {

      if(header=="Media Library"){
        MediaListData[index].checkStatus =
        !MediaListData[index].checkStatus;
        setMediaListData([...MediaListData]);
    
        let chekeddata = MediaListData.filter(
          (item) => item.checkStatus == true
        );
        if (chekeddata.length == MediaListData.length) {
          setselectAllMediaFlag(true);
        } else {
          setselectAllMediaFlag(false);
        }
        
      }
      else if(header=="Archived"){

        ArchivedListData[index].checkStatus =
        !ArchivedListData[index].checkStatus;
        setMediaListData([...ArchivedListData]);
    
        let chekeddata = MediaListData.filter(
          (item) => item.checkStatus == true
        );
        if (chekeddata.length == ArchivedListData.length) {
          setselectAllMediaFlag(true);
        } else {
          setselectAllMediaFlag(false);
        }
      

      }     
    };
  

  const handlePageSize=()=>{
    setPageSize(PageSize+10)
  }

  const handleViewMedia = (data = {}) => {
    console.log("dddd", data);
    navigation.navigate(NAVIGATION_CONSTANTS.VIEW_MEDIA, { data: data });
  };

  handleContentEdit=(data = {}) => {
    const type=data.type
    console.log(type)
    if(type=="TEXT"||type=="HTML"){
      navigation.navigate(NAVIGATION_CONSTANTS.EDIT_MEDIA_CONTENT_TEXT,{data:data});
    }else{
      navigation.navigate(NAVIGATION_CONSTANTS.EDIT_MEDIA_CONTENT,{ data: data });
    }
    
  };

  const handleEditPress = (data = {}) => {
    navigation.navigate(NAVIGATION_CONSTANTS.EDIT_MEDIA_LIBRARY, {
      data,
      type: "edit",
    });
  };

  const handleArchive = async (data) => {
    var url = "";
    if (header == "Media Library") {
      url = "archive";
    } else {
      url = "unarchive";
    }
    const title = url.charAt(0).toUpperCase() + url.slice(1);
    // console.log("archiveee",url.capitalize());
    setConfirmBoxData({ ...confirmBoxData, loading: true });
    const onSuccess=()=>{
      setisModal(true)
      call_getApi()
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });

    }
    updateToArchive(data, url, onSuccess);
  };

  const handleBulkArchived = async () => {
    const params = {};

    console.log("handleBulkArchived")
    if(header=="Media Library"){
      params["url"]="archive"
      let selectedCampStr = MediaListData.filter(
        (item) => item.checkStatus == true
      );
       params["ids"]=selectedCampStr.map((item)=>{
        return item.mediaDetailId
      })
    }else if(header=="Archived"){
      params["url"]="unarchive"
      let selectedCampStr = ArchivedListData.filter((item) => item.checkStatus == true);
        params["ids"]=selectedCampStr.map((item)=>{
        return item.mediaDetailId
      })
      
    }
    var slugId = "";
    try {
      slugId = await getStorageForKey("slugId");
    } catch (error) {
      console.log(error);
    }
    params["slugId"]=slugId
    
    const succussCallBack = async (response) => {
      console.log("\n\n\nwererer\n\n\n\n\n",JSON.stringify(response))
      if (response.status == "OK") {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setselectAllMediaFlag(false)
        setisModal(true)
        call_getApi();
        } else {
        Alert.alert("Error",response.data.badRequest[0].message);
        // setConfirmBoxData({
        //   ...confirmBoxData,
        //   confirmModalFlag: false,
        //   loading: false,
        // })
      }
    };

    const failureCallBack = (error) => {
      console.log("error of delete", error, slugId);
      // Alert.alert("Error","");
      // setConfirmBoxData({
      //   ...confirmBoxData,
      //   confirmModalFlag: false,
      //   loading: false,
      // });
    };

    // console.log("\n\n\n****************\n\n",params.ids)
    // Alert.alert("ok",JSON.stringify(params))

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    MediaLibraryService.ChangeToArchive(
      params,
      succussCallBack,
      failureCallBack
    );
    
  };

  const handleBulkDeletePress = async () => {
    const params = {};

    console.log("btnDeleteBulkData")
    if(header=="Media Library"){
      let selectedCampStr = MediaListData.filter(
        (item) => item.checkStatus == true
      );
       params["ids"]=selectedCampStr.map((item)=>{
        return item.mediaDetailId
      })

      
    }else if(header=="Archived"){
      let selectedCampStr = ArchivedListData.filter((item) => item.checkStatus == true);
        params["ids"]=selectedCampStr.map((item)=>{
        return item.mediaDetailId
      })
      
    }
    var slugId = "";
    try {
      slugId = await getStorageForKey("slugId");
    } catch (error) {
      console.log(error);
    }
    params["slugId"]=slugId
    
    const succussCallBack = async (response) => {
      if (response.status == "OK" &&response.data.badRequest.length == 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setisModal(true)
        setselectAllMediaFlag(false)
        call_getApi();
        dispatch(removeMediaLib([data]));
      } else {
        Alert.alert("Error",response.data.badRequest[0].message,[
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => {
            setConfirmBoxData({
              ...confirmBoxData,
              confirmModalFlag: false,
              loading: false,
            });
            setisModal(false)
          }},
        ]);
      }
      
    };

    const failureCallBack = (error) => {
      console.log("error of delete", error, slugId);
      Alert.alert("Error",error.message);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
    };

    // console.log("\n\n\n****************\n\n",params.ids)
    // Alert.alert("ok",JSON.stringify(params))

    setConfirmBoxData({ ...confirmBoxData, loading: true });
    MediaLibraryService.DeleteMediaLib(
      params,
      succussCallBack,
      failureCallBack
    );
    
  };

  const handleDeletePress = async (data) => {
    var slugId = "";
    try {
      slugId = await getStorageForKey("slugId");
    } catch (error) {
      console.log(error);
    }

    const params = {
        ids: [data],
        slugId,
      };

    const succussCallBack = async (response) => {
      if (response.status == "OK" &&response.data.badRequest.length == 0) {
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
        setisModal(true)
        call_getApi();
        dispatch(removeMediaLib([data]));
      } else {
        Alert.alert("Error",response.data.badRequest[0].message);
        setConfirmBoxData({
          ...confirmBoxData,
          confirmModalFlag: false,
          loading: false,
        });
      }
      console.log("response of delete", data);
    };

    const failureCallBack = (error) => {
      console.log("error of delete", error, slugId);
      setConfirmBoxData({
        ...confirmBoxData,
        confirmModalFlag: false,
        loading: false,
      });
      Alert.alert("Error",error.message);
    };

    
    setConfirmBoxData({ ...confirmBoxData, loading: true });
    MediaLibraryService.DeleteMediaLib(
      params,
      succussCallBack,
      failureCallBack
    );
    
  };

  useFocusEffect(
    React.useCallback(() => {
      const call=123;
      call_getApi();
      // setselectAllMediaFlag(false)
      return () => console.log("useFocusEffect")
    }, [advUrl,PageSize])
  );

  const onComplete = () => {
    setisModal(false);
    // navigation.goBack();
  };

  // useEffect(() => {
  //   call_getApi();
  //   console.log("this advvvvvvvvv", advUrl);
  // }, [1, advUrl,PageSize]);

  const getMediaDataCount=async ()=>{

    const slugId = await getStorageForKey("slugId");
    // setIsLoading(true);
    const endPoint=`service-gateway/cms/${slugId}/v1/total-media-archive-count`
    const successCallBack = async (response) => {
      const count=response.data.totalMediaCount-response.data.totalArchiveCount
      if(count>0){
      setmediaTotalCount(count);
      }
      setarchiveTotalCount(response.data.totalArchiveCount);
    };
  
    const errorCallBack = (error) => {
     console.log("Error",error)
      setIsLoading(false);
      if(error.status==401||error.status=="401"||error.message=="Request failed with status code 401"){
        
        Alert.alert("Unauthorized", 'Please login', [
          {
            text: "Ok",
            onPress: () => {
              resetRedux()
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
              
            },
          },
        ]);
      }else{
        Alert.alert("Something went wrong. Please try later")
      }
    };
  
    MediaApiService.getMediaCount(
      { slugId, endPoint },
      successCallBack,
      errorCallBack
    );
  }

  useEffect(()=>{
    call_getApi()
  },[mediaName,uploadedBy,tag])

  const call_getApi = async (uploadedDate1="") => {
    const params = {
      page: currentPage,
      pageSize: 10+PageSize,
      isArchive: false,
    };
    
    if (duration) {
      params["duration"] = duration;
    }

    if (mediaName) {
      params["mediaName"] = mediaName;
    }  
    if (uploadedBy) {
      params["uploadedBy"] = uploadedBy;
    } 
    if (typeof(uploadedDate1)=="number") {
      params["uploadedDate"] = uploadedDate1;
    } 
     if (tag) {
      params["tag"] = tag;
    } 
    
    getMediaDataCount()
    getArchivedList(()=>{}, params, (q = advUrl));
    getMediaLibData(()=>{}, params, (q = advUrl));
  };

  const call_getApiDate = async (uploadedDate1="") => {
    const params = {
      page: currentPage,
      pageSize: 10+PageSize,
      isArchive: false,
    };
    
    if (duration) {
      params["duration"] = duration;
    }

    if (mediaName) {
      params["mediaName"] = mediaName;
    }  
    if (uploadedBy) {
      params["uploadedBy"] = uploadedBy;
    } 
    if (typeof(uploadedDate1)=="number") {
      params["uploadedDate"] = uploadedDate1;
    } 
     if (tag) {
      params["tag"] = tag;
    } 
    
    getMediaDataCount()
    getArchivedList(setIsLoading, params, (q = advUrl));
    getMediaLibData(setIsLoading, params, (q = advUrl));
  };

  const handleCallApi = async (data) => {
    // setCurrentPage(data)
    const params = {
      page: data,
      pageSize: 10+PageSize,
      isArchive: false,
    };

    if (duration) {
      params["duration"] = duration;
    }

    if (mediaName) {
      params["mediaName"] = mediaName;
    }  
    if (uploadedBy) {
      params["uploadedBy"] = uploadedBy;
    } 
      
     if (tag) {
      params["tag"] = tag;
    } 
    // console.log('params',params);
    getMediaDataCount()
    if(header=="Media Library"){
      getMediaLibData(setIsLoading, params, (q = advUrl));
    }else if(header=="Archived"){
      getArchivedList(setIsLoading, params, (q = advUrl));
    }
  };

  

  const changeHeader = (item, index) => {
    setHeader(item.name);
    if(item.name=="Media Library"){
      setPageCount(MediaList?.paginationDetail?.pageCount)
      setselectAllMediaFlag(false)
      handleCallApi(1);
    }else if(item.name=="Archived"){
      setPageCount(ArchivedList?.paginationDetail?.pageCount)
      setselectAllMediaFlag(false)
      handleCallApi(1);
    }
    setActiveheader(index);
    
  };

  const renderCampaign = ({ item, index }) => {
    console.log('item?.thumbnailUrl',item?.thumbnailFilePath)
    return (
      <View key={item.name + index} style={Styles.campaignContainer}>
        <View style={{flexDirection:"row",justifyContent:"center"}}>
        {(item?.thumbnailUrl != null&&item?.thumbnailFilePath!=null) ? (
          <Image
            source={{ uri: item?.thumbnailUrl }}
            style={[Styles.imageStyle,]}
          />
        ) : (
          <Image
          source={item.type.toLowerCase()=="text"?txtIcon
          :item.type.toLowerCase()=="url"?urlIcon
          :item.type.toLowerCase()=="image"?imgIcon
          :item.type.toLowerCase()=="html"?htmlIcon
          :item.type.toLowerCase()=="rss"?rssIcon
          :item.type.toLowerCase()=="facebook"?fbIcon
          :item.type.toLowerCase()=="twitter"?twiterIcon
          :item.type.toLowerCase()=="stream_url"?stremIcon
          :item.type.toLowerCase()=="pdf"?pdfIcon
          :item.type.toLowerCase()=="audio"?audioIcon
          :item.type.toLowerCase()=="ppt"?pptIcon
          :item.type.toLowerCase()=="doc"?docIcon
          :item.type.toLowerCase()=="video"?videoIcon
          :"" 
        }
            resizeMode="contain"
            style={[Styles.imageStyle,{width:moderateScale(150)}]}
          />
        )}
          <View style={{position:"absolute",right:10,}}>
          {/* <Image source={InfoImage} style={Styles.infoStyle} /> */}
          
            <TouchableOpacity
            onPress={() => {
              multielectCompaign(index);
            }}
            style={{
              // backgroundColor:"white",
              justifyContent: 'center',
              marginEnd:5,
              padding:0,
              // opacity:0.5

              // paddingHorizontal: moderateScale(1),
            }}
          >
            {item.checkStatus == false ? (
              <MaterialIcons
                name="check-box-outline-blank"
                color={themeColor.themeColor}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            )}
          </TouchableOpacity> 
          </View>
        </View>
        <AppText style={Styles.nameText}>
          {item.name}.{item.type}
        </AppText>
        <AppText style={Styles.dateText}>
          {item.date} by {item.fullName}
        </AppText>
        <Separator />
        <MediaActions
          showall = {true}
          header={header}
          mediaType={item.type}
          iconContainerStyle={{
            backgroundColor: themeColor.themeLight,
          }}
          containerStyle={{
            paddingHorizontal: moderateScale(1)
          }}
          handleDeletePress={() => btnOpenModelType("Delete",item.mediaDetailId)}
          handleEditPress={() => handleEditPress(item)}
          handleContentEdit={()=>handleContentEdit(item)}
          handleViewMedia={() => handleViewMedia(item)}
          handleArchive={() => btnOpenModelType("Archived",item.mediaDetailId)}
        />
       
      </View>
    );
  };

  const renderAction = (item) => {
    return (
      <View style={Styles.actionView}>
        <MediaActions
          showall = {false}
          mediaType={item.type}
          header={header}
          iconContainerStyle={{
            backgroundColor: themeColor.themeLight,
            marginHorizontal: moderateScale(5),
          }}
          containerStyle={{
            paddingHorizontal: moderateScale(10),
            backgroundColor: "white",
          }}
          handleDeletePress={() => btnOpenModelType("Delete",item.mediaDetailId)}
          handleEditPress={() => handleEditPress(item)}
          handleViewMedia={() => handleViewMedia(item)}
          handleContentEdit={()=>handleContentEdit(item)}
          handleArchive={() => btnOpenModelType("Archived",item.mediaDetailId)}
        />
      </View>
    );
  };

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.textView,{width:index==1?"15%":"18%"}]}>
        <AppText style={[Styles.commonText,{textTransform: 'capitalize'}]}>{value}</AppText>
      </View>
    );
  };

  const renderDateTime = (value) => {
    return (
      <View style={[Styles.commonView, Styles.textView]}>
        <AppText style={[Styles.commonText, { textAlign: "center" }]}>
          {value}
        </AppText>
      </View>
    );
  };

  const renderMediaList = ({ item, index }) => {

    const tagsArr=[item.tags.map(e=>{return e.title})]
    return (
      <View style={Styles.renderContainer}>
        <TouchableOpacity
          onPress={() => {
            multielectCompaign(index);
          }}
          style={Styles.iconView}
        >
          {item.checkStatus == false ? (
            <MaterialIcons
              name="check-box-outline-blank"
              color={themeColor.themeColor}
              size={25}
            />
          ) : (
            <MaterialIcons
              name="check-box"
              color={themeColor.themeColor}
              size={25}
            />
          )}
        </TouchableOpacity>
        <View style={Styles.nameView}>
          {(item?.thumbnailUrl != null&&item?.thumbnailFilePath!=null) ? (
            <Image
              source={{uri: item?.thumbnailUrl }}
              style={Styles.imageIconStyle}
            />
          ) : (
            <View style={{ borderWidth: 0 }}>
              <Image
                source={item.type.toLowerCase()=="text"?txtIcon
                        :item.type.toLowerCase()=="url"?urlIcon
                        :item.type.toLowerCase()=="image"?imgIcon
                        :item.type.toLowerCase()=="html"?htmlIcon
                        :item.type.toLowerCase()=="rss"?rssIcon
                        :item.type.toLowerCase()=="facebook"?fbIcon
                        :item.type.toLowerCase()=="twitter"?twiterIcon
                        :item.type.toLowerCase()=="stream_url"?stremIcon
                        :item.type.toLowerCase()=="pdf"?pdfIcon
                        :item.type.toLowerCase()=="audio"?audioIcon
                        :item.type.toLowerCase()=="ppt"?pptIcon
                        :item.type.toLowerCase()=="doc"?docIcon
                        :item.type.toLowerCase()=="video"?videoIcon
                        :'' 
                      }
                    resizeMode="contain"
                style={[Styles.imageIconStyle,]}
              />
            </View>
          )}
          <Text numberOfLines={1} style={Styles.nameText}>{item.name}</Text>
        </View>

        {renderTextView(item.defaultDurationInSeconds + " sec",1)}
        {renderDateTime(item.tags.length > 0 ? tagsArr.join(",") : "")}
        {renderTextView(item.fullName,2)}
        {renderDateTime(new Date(item.createdOn).toLocaleDateString())}
        {renderAction(item)}
      </View>
    );
  };

  const renderInput = (item, index, state, setState) => {
    return (
      <View style={[myStyles.mainContainer(index)]}>
        <View style={myStyles.headerContainer}>
          <AppText style={myStyles.boldText}>{item}</AppText>
        </View>
        <View style={[myStyles.container, myStyles.searchView,{paddingHorizontal:5}]}>
          <AppTextInput
            value={state}
            placeholder={`Search by ${item}`}
            onChangeText={(e) => {setState(e)}}
            handleOnSubmitEditing={call_getApi}
            numberOfLines={1}
            placeholderTextColor={themeColor.placeHolder}
            textInputStyle={[
              myStyles.textInputStyle,
              {
                fontSize: moderateScale(14),
                paddingVertical: Platform.OS === "ios" ? 10 : 5,
              },
            ]}
            containerStyle={{
              width: "93%",
              marginHorizontal: moderateScale(5),
            }}
          />
        </View>
      </View>
    );
  };

  const renderDuration = (item, index, state, setState) => {
    return (
      <View style={[myStyles.mainContainer(index)]}>
        <View style={myStyles.headerContainer}>
          <AppText style={myStyles.boldText}>{item}</AppText>
        </View>
         
          <View style={{height:moderateScale(40)}}></View>
          {/* <AppTextInput
            value={state}
            placeholder={`Search by ${item}`}
            onChangeText={(e) => setState(e)}
            handleOnSubmitEditing={call_getApi}
            numberOfLines={1}
            placeholderTextColor={themeColor.placeHolder}
            keyboardType="numeric"
            textInputStyle={[
              myStyles.textInputStyle,
              {
                fontSize: moderateScale(13),
                paddingVertical: Platform.OS === "ios" ? 10 : 5,
              },
            ]}
            containerStyle={{
              width: "80%",
              marginHorizontal: moderateScale(5),
            }}
          /> */}
        
      </View>
    );
  };

  const renderInputGrid = (item, index, state, setState) => {
    return (
      <View style={[myStyles.mainContainerGrid(index)]}>
        <View style={myStyles.headerContainer}>
          <AppText style={myStyles.boldText}>{item}</AppText>
        </View>
        <View style={[myStyles.container, myStyles.searchView]}>
          <AppTextInput
            value={state}
            placeholder={`Search by ${item}`}
            onChangeText={(e) => setState(e)}
            handleOnSubmitEditing={call_getApi}
            numberOfLines={1}
            placeholderTextColor={themeColor.placeHolder}
            textInputStyle={[
              myStyles.textInputStyle,
              {
                fontSize: moderateScale(13),
                paddingVertical: Platform.OS === "ios" ? 10 : 5,
              },
            ]}
            containerStyle={{
              width: "70%",
              marginHorizontal: moderateScale(5),
            }}
          />
        </View>
      </View>
    );
  };

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" color="blue" />
  //     </View>
  //   );
  // }

  return (
    <View style={{flex: 1,}}>
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
      <Loader visible={isLoading}/>
      <ClockHeader />
      <ScrollView nestedScrollEnabled={true} bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.mainContainer}>
          <CommonHeaderTitleActionMedia
          title="Media Library"
          pageName="CampaignString"
          Header={header}
          // currPage={filterData.currPage}
          btnOpenModelType={btnOpenModelType}
          />
         {(header=="Media Library"&&activeHeader === 0)?<AdvSearchAndAdd
            title1="Advance Search"
            title2="+ Add Media"
            containerStyle={{
              paddingHorizontal: moderateScale(0),
            }}
            renderAdd={authorization.includes(PREVILAGES.MEDIA.ADD_MEDIA)}
            buttonStyle={{
              paddingHorizontal: 0,
            }}
            onClickSearch={() => {
             // call_getApi()
              setAdvSrchModal(true);
            }}
            onClickAdd={() => {
              // console.log("this is adva url",advUrl)
              // call_getApi()
              navigation.navigate(NAVIGATION_CONSTANTS.ADD_MEDIA_LIBRARY);
            }}
          />:<TouchableOpacity
            style={[myStyles.advbtn,{alignItems:'center'}]}
            onPress={()=>setAdvSrchModal(true)}
          >
            <AppText style={[myStyles.boldText,{color:'white'}]}>Advance Search</AppText>
            </TouchableOpacity>}
          <View style={Styles.SearchByStyles}>
            
            <View style={Styles.iconContainer}>
              <TouchableOpacity
                onPress={() => {
                  setViewType("list");
                  // setCurrentPage(1);
                }}
                style={Styles.leftCurvedContainer}
              >
                <Image source={MenuIcon} style={[Styles.iconStyle,{tintColor:viewType=="list"?'black':themeColor.themeColor}]} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setViewType("gallery");
                  // setCurrentPage(1);
                }}
                style={Styles.rightCurvedContainer}
              >
                <Image source={AppIcon} style={[Styles.iconStyle,{tintColor:viewType=="gallery"?'black':themeColor.themeColor}]} />
              </TouchableOpacity>
              
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
          >
            {headers(themeColor).map((item, index) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => changeHeader(item, index)}
              >
                <View
                  key={item.name}
                  style={Styles.headerContainer(index, activeHeader)}
                >
                  <AppText style={Styles.headerItemContainer}>
                    {item.name}
                  </AppText>
                  <ThemedText
                    title={
                      index === 0? mediaTotalCount
                      : index === 1? archiveTotalCount
                      : 0
                    }
                    containerStyle={Styles.numberStyle(item.color)}
                    textStyles={{
                      color: themeColor.white,
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {viewType === "gallery" ? (
            <View style={Styles.bodyContainer}>
              <FlatList
                scrollEnabled={false}
                numColumns={2}
                data={
                  activeHeader === 0
                    ? MediaListData
                    : activeHeader === 1
                    ? ArchivedListData
                    : []
                }
                ListHeaderComponent={<View style={{width:"100%"}}>
                  
                  {renderInputGrid("Content Name", 4, mediaName, setMediaName)}
                  <TouchableOpacity
                        onPress={() => {
                          handleAllSelect(!selectAllMediaFlag);
                        }}
                        style={[Styles.iconCenterView,{marginHorizontal:moderateScale(10)}]}
                      >
                        {selectAllMediaFlag == false ? (
                          <View style={{
                            flexDirection:"row",
                            backgroundColor:themeColor.themeLight,
                            }}>
                            <MaterialIcons
                              name="check-box-outline-blank"
                              color={themeColor.themeColor}
                              size={25}
                            />
                            <Text style={{
                              color:themeColor.textColor,
                              fontSize:moderateScale(14),
                              marginHorizontal:moderateScale(14),
                              }}>Select All 
                            </Text>
                          
                          </View>
                        ) : (
                        <View style={{
                            flexDirection:"row",
                            backgroundColor:themeColor.themeLight,
                            }}>
                          <MaterialIcons
                            name="check-box"
                            color={themeColor.themeColor}
                            size={25}
                          />
                          <Text style={{
                            color:themeColor.textColor,
                            fontSize:moderateScale(14),
                            marginHorizontal:moderateScale(5)
                            }}> All Selected </Text>
                          </View>
                        )}
                  </TouchableOpacity>
                </View>
                }
                ListHeaderComponentStyle={{
                backgroundColor:themeColor.themeLight,
                width:'100%'
                }}
                renderItem={renderCampaign}
               
              />
               
            </View>
          ) : (
            <ScrollView
              bounces={false}
              horizontal
              style={Styles.flatListContainer}
            >
              <View >
                <FlatList
                  bounces={false}
                  scrollEnabled={false}
                  // data={MediaList?.mediaDetails}
                  data={
                    activeHeader === 0
                      ? MediaListData
                      : activeHeader === 1
                      ? ArchivedListData
                      : []
                  }
                  renderItem={renderMediaList}
                  ListHeaderComponent={
                    <KeyboardAvoidingView  behavior='position' keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 10}>
                      <View style={[myStyles.headerView,{alignItems:'center'}]}>
                      <TouchableOpacity
                        onPress={() => {
                          handleAllSelect(!selectAllMediaFlag);
                        }}
                        style={Styles.iconCenterView}
                      >
                        {selectAllMediaFlag == false ? (
                          <MaterialIcons
                            name="check-box-outline-blank"
                            color={themeColor.themeColor}
                            size={25}
                          />
                        ) : (
                          <MaterialIcons
                            name="check-box"
                            color={themeColor.themeColor}
                            size={25}
                          />
                        )}
                      </TouchableOpacity>
                      {renderInput("Content Name", 0, mediaName, setMediaName)}
                      {renderDuration("Duration(In Sec)", 1, duration, setDuration)}
                      {renderInput("Tags", 2, tag, settag)}
                      {renderInput("Uploaded By", 3, uploadedBy, setuplodedBy)}
                      <View style={[myStyles.mainContainer(4)]}>
                        <View style={myStyles.headerContainer}>
                          <AppText style={myStyles.boldText}>Uploaded Date</AppText>
                        </View>
                        <TouchableOpacity
                          style={{
                            justifyContent: "center",
                            borderRadius: 5,
                            backgroundColor: themeColor.white,
                            height: 50,
                            marginHorizontal:5
                          }}
                          onPress={() => {
                            setOpen(true);

                            // call_getApi();
                          }}
                        >
                          <Text
                            style={[
                              myStyles.textInputStyle,
                              {
                                fontSize: moderateScale(13),
                                paddingHorizontal:10,
                                color: uploadedDate?themeColor.textColor:themeColor.placeHolder,
                              },
                            ]}
                          >
                            {" "}
                            {uploadedDate
                              ? uploadedDate.toLocaleDateString()
                              : "Search By Date"}
                          </Text>
                        </TouchableOpacity>
                        <DatePicker
                          modal
                          mode="date"
                          open={open}
                          date={date}
                          maximumDate={new Date()}
                          
                          onConfirm={(date) => {
                            setOpen(false);
                            setDate(date);
                            setuploadedDate(new Date(date));
                            // call_getApi()
                            call_getApiDate(new Date(date).getTime());
                            // console.log(new Date(date).getTime())
                          }}
                          onCancel={() => {
                            setOpen(false);
                            setDate(new Date());
                            call_getApi()
                            setuploadedDate("");
                          }}
                        />
                      </View>
                      <View style={[myStyles.mainContainer(4)]}>
                        <View style={myStyles.headerContainer}>
                            <AppText style={myStyles.boldText}>Action</AppText>
                        </View>
                        <View style={{height:moderateScale(40)}}></View>
                      </View>
                      </View>
                    </KeyboardAvoidingView>
                  }
                />
                {/* {(
                  (MediaList?.paginationDetail?.totalItemCount!=0)||
                  (ArchivedList?.paginationDetail?.totalItemCount!=0))?
                <TouchableOpacity onPress={()=>{
                  handlePageSize()
                  console.log("MediaList?.paginationDetail?.totalItemCount!=MediaList.length",MediaList.data.mediaDetails);
                }}>
                  <AppText style={myStyles.loadmoreText}>Load more...</AppText>
                </TouchableOpacity>:""} */}
                </View>
            </ScrollView>
          )}

          {/* <AppText style={[Styles.totalRecords,{color:'black'}]}>
            {header=="Media Library" &&MediaList?.paginationDetail?.totalItemCount == 0
              ? "No Data Found"
              : header == "Archived" &&
                ArchivedList?.paginationDetail?.totalItemCount == 0
              ? "No Data Found"
              : activeHeader > 1 && "No Records Found"}
          </AppText> */}
          {(header=="Media Library"&&activeHeader === 0)?<>
            {MediaList?.paginationDetail?.totalItemCount>0?<AppText style={[Styles.totalRecords,{color:'black'}]}>
              Total Records:{MediaList?.paginationDetail?.firstItemNumber} - {MediaList?.paginationDetail?.lastItemNumber} 
              {' '}of {MediaList?.paginationDetail?.totalItemCount}
            </AppText>:<AppText style={[Styles.totalRecords,{color:'black'}]}>
              No Data Found
            </AppText>}
          </>:(header=="Archived"&&activeHeader === 1)&&<>
            {ArchivedList?.paginationDetail?.totalItemCount>0?<AppText style={[Styles.totalRecords,{color:'black'}]}>
              Total Records:{ArchivedList?.paginationDetail?.firstItemNumber} - {ArchivedList?.paginationDetail?.lastItemNumber}
              {" "}of {ArchivedList?.paginationDetail?.totalItemCount}
            </AppText>:<AppText style={[Styles.totalRecords,{color:'black'}]}>
              No Data Found
            </AppText>
            }
          </>
          }
          
          <Pagination
                setState={e=>handleCallApi(e)}
                pageNumber={
                  header=="Media Library"?MediaList?.paginationDetail?.currentPage
                  :header=="Archived"?ArchivedList?.paginationDetail?.currentPage
                  :currentPage
                  }
                totalpage={
                  header=="Media Library"?MediaList?.paginationDetail?.pageCount
                  :header=="Archived"?ArchivedList?.paginationDetail?.pageCount
                  :pageCount
                  }
              />
          <CopyRightText />
        </View>
      </ScrollView>

      <AdvanceSrch
        srchObj={srchObj}
        setSrchObj={setSrchObj}
        modalVisible={AdvSrchModal}
        setModalVisible={setAdvSrchModal}
        setAdvurl={setAdvurl}
        callBack={() => call_getApi()}
      />

      {isModal&&<SuccessModal Msg={message} onComplete={onComplete}/>}
    </View>
  );
};

export default MediaLibrary;

const HeaderStyles = (COLORS) =>
  StyleSheet.create({
    headerView: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: moderateScale(width * 3.5),
      padding: moderateScale(10),
      paddingBottom:18,
      marginVertical: moderateScale(1),
    },
    iconCenterView: {
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    container: {
      width: "100%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: 10,
      flexDirection: "row",
      // alignItems: "center",/
    },
    mainContainer: (index) => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: "center",
      paddingVertical: 10,
      marginHorizontal: moderateScale(2),
      
      width:
        index === 0? "20%":index==3? "18%":index === MediaListHeader.length - 1 ? "18%" : "15%",
    }),
    mainContainerGrid: (index) => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: "center",
      paddingVertical: 10,
      marginHorizontal: moderateScale(2),
      // width:
      //   index === 0 || index === MediaListHeader.length - 1 ? "100%" : "15%",
    }),
    headerContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: moderateScale(50),
    },

    textInputStyle: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: Platform.OS === "ios" ? moderateScale(10) : undefined,
      color:'black'
    },

    boldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    loadmoreText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      marginVertical:moderateScale(5),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    searchView: { marginHorizontal: moderateScale(10), width: "90%" },
    advbtn:{
      backgroundColor:COLORS.themeColor,
      justifyContent:'center',
      // alignItems:'center',
      alignSelf:'center',
      height:moderateScale(40),
      borderColor:COLORS.themeColor,
      borderWidth:1,
      borderRadius:10,
      width:"93%"

    }
  });
