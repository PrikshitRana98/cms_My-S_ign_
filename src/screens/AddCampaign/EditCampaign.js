import React, { useEffect,useCallback, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,Dimensions,
  ScrollView,Platform,Keyboard,  KeyboardAvoidingView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  BackHandler,
} from "react-native";
import { Switch } from "react-native-paper";
import ActionContainer from "../../Components/Atoms/ActionContainer";
import AppTextInput from "../../Components/Atoms/AppTextInputs";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonTitleAndText from "../../Components/Atoms/CommonTitleAndText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import AppText from "../../Components/Atoms/CustomText";
import Separator from "../../Components/Atoms/Separator";
import { moderateScale,width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { Dropdown } from "react-native-element-dropdown";
import CommonStyles from "./style";
import ColorModalPicker from "../../Components/Atoms/ColorPicker";
import {
  getMediaLibData,
  getTemplateData,
  getWorkFlow,
} from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import SelectMediaModal from "../../Components/Organisms/CMS/Campaign/SelectMediaModal";
import { CampaignManagerService } from "../Campaign/CompainApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CampaignRegion from "../../Components/Organisms/CMS/Campaign/CampaignRegion";
import CampaignArrangeMedia from "../../Components/Organisms/CMS/Campaign/CampaignArrangeMedia";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import SelectAudio from "../../Components/Organisms/CMS/Campaign/SelectAudio";
import CampaignAddTag from "../../Components/Organisms/CMS/Campaign/CampaignAddTag";
import { getMediaDataForCampAdd } from "../Campaign/CompainApi";
import { getTempleteDataForCampAdd } from "../Campaign/CompainApi";
import Loader from "../../Components/Organisms/CMS/Loader";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import CrossImage from "../../Assets/Images/PNG/delete-button.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ResolutionManagerService } from "../../Services/AxiosService";
import SelectLocationModalForCampaign from "../../Components/Organisms/Devices/SelectLocationModalForCampaign";
import axios from "axios";
import SuccessModal from "../../Components/Molecules/SuccessModal";

import Thumb from "../../Components/HelperComp/Thumb";
import Raill from "../../Components/HelperComp/Raill";
import RailSelected from "../../Components/HelperComp/RailSelected";
import Label from "../../Components/HelperComp/Label";
import Notch from "../../Components/HelperComp/Notch";
import RnRangeSlider from "rn-range-slider";
import { jwtDecode } from "jwt-decode";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { resetRedux } from "../../appConfig/AppRouter/Contents";


const EditCampaign = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const [currentSection, setCurrentSection] = useState(0);
  const [colorModal, setColorModal] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(false);
  const [templateShowList, setTempleteShowList] = useState([]);
  const templateList = useSelector(
    (state) => state.TemplateReducer.templateList
  );
  const [imageMediaData, setImageMediaData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [seleAudioData, setSelAudioData] = useState([]);
  const [mediaData, setMediaData] = useState([]);
  const MediaList = useSelector((state) => state.MediaLibReducer.MediaLibList);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [templateTag, setTempletTag] = useState("");
  const [templateTagArr, setTempletTagArr] = useState([]);
  const [transparency, setTransparency] = useState();
  const [locationName, setLocationName] = useState([]);
  

  const [modal, setModal] = useState();
  const [arrangeModal, setArrangeModal] = useState(false);
  const [selectedBgImg, setSelectedBgImg] = useState("");
  const [selectedTemplet, setSelectedTemplet] = useState({});
  const [mediaModalType, setMediaModalType] = useState(null);
  const [activateRegion, setActiveRegion] = useState(0);
  const [selectRegionForEdit, setSelectetRegionForEdit] = useState(-1);
  const [campaignType, setCampaignType] = useState('');
  const [cmpArrangeModal, setCmpArrangeModal] = useState(false);
  const [ratioId, setRatioId] = useState(null);
  const [duration, setDuration] = useState({
    hh: 0,
    mm: 0,
    ss: 0,
  });
  const [ratioList, setRatioList] = useState([]);

  //For Edit =====================================================
  const { campaignItem } = route.params;
  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("")
  const [mintime,setmintime]=useState(0);
  const [maxtime,setmaxtime]=useState(audiotiming);
  const [usermintime,setusermintime]=useState(0);
  const [usermaxtime,setusermaxtime]=useState(0);
  const [audiotiming,setaudiotiming]=useState(0);
  const [cmpgnType,setcmpgnType]=useState([
    { label: "NORMAL", value: "NORMAL" },
  ])

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


  const renderThumb = useCallback(() => <Thumb/>, []);
  const renderRail = useCallback(() => <Raill/>, []);
  const renderRailSelected = useCallback(() => <RailSelected/>, []);
  const renderLabel = useCallback(value => <Label text={value}/>, []);
  const renderNotch = useCallback(() => <Notch/>, []);
  const handleValueChange = useCallback((low, high) => {
    console.log(low,high)
    setusermaxtime(high);
    setusermintime(low);
  }, []);


  const onComplete = () => {
    setSuccessModal(false);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
     
  })
  }, [navigation])

  useEffect(() => {
    let {
      templateId,
      campaignTags,
      backgroundColor,
      campaignTitle,
      campaignId,
    } = campaignItem;
    btnGetCampaignDetails(campaignId);
  }, [MediaList]);

  const getResolutionData = async (setIsLoading = () => {}) => {
    const slugId = await getStorageForKey("slugId");
    setIsLoading(true);

    const successCallBack = async (response) => {
    
      if (response?.data && response?.data?.length > 0) {
        const modifyData = response?.data;
        let resolutionDropdownData = modifyData.map((resolution) => ({
          label: `${resolution.aspectRatio} (${resolution.defaultWidthInPixel} x ${resolution.defaultHeightInPixel})`,
          value: resolution.aspectRatioId,
        }));
       
        setRatioList(resolutionDropdownData);
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    const errorCallBack = (response) => {
      setIsLoading(false);
    };

    ResolutionManagerService.fetchResolutionList(
      { slugId },
      successCallBack,
      errorCallBack
    );
  };
  const btnGetMediaById = async (mediaId) => {
    const token = await getStorageForKey("authToken");
    const slugId = await getStorageForKey("slugId");
    const authHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${baseUrl}service-gateway/cms/${slugId}/v1/media/${mediaId}`, {
          headers: authHeader,
        })
        .then((response) => {
          resolve(response?.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const btnSetCamapaignEditValues = (campaignData) => {
    console.log("campaignData",JSON.stringify(campaignData))
    if (campaignData) {
      let mData = MediaList?.data?.mediaDetails;

     
      let regiondata = campaignData?.regions;
      let finalRegion = [];
      regiondata.map((region) => {
        let fdata = [];
        let contentData = region?.globalRegionContentPlaylistContents;
        contentData?.map((data,index) => {
          let findIndex = mData?.findIndex(
            (rdata) => data.contentId == rdata.mediaDetailId
          );
          if (findIndex > -1) {
            let mediaDta=mData[findIndex];
            mediaDta.displayMode=data.displayMode
            fdata.push(mediaDta);
          }
        });
        region.templateRegionName = region.layoutRegionName;
        region.regionData = fdata;
        let locationIds = [];
        if (region.locations.length > 0) {
          region.locationIds = [region.locations[0]?.locationId];
          region.customizCheck = true;
        } else {
          region.locationIds = locationIds;
          region.customizCheck = false;
        }
        finalRegion.push(region);
      });

      let trans = campaignData?.transparencyInPercentage || 0;
     
      if (trans) {
        setTransparency(trans);
      } else {
        setTransparency(0);
      }
      // set tags
      let tags = campaignData?.campaignTags?.map((tag) => {
        return tag.campaignTag;
      });
      // aoudio
      let audio = [];
      mData?.map((data) => {
        let findInde = campaignData?.audios?.findIndex(
          (rdata) => rdata.contentId == data.mediaDetailId
        );
        if (findInde > -1) {
          audio.push(data);
        }
      });
      //backgroundImageContentId
      if (campaignData?.backgroundImageContentId) {
        let findIndex = mData?.findIndex(
          (rdata) =>
            rdata.mediaDetailId == campaignData?.backgroundImageContentId
        );
        if (findIndex > -1) {
        
          setSelectedBgImg(mData[findIndex]);
        }
      }

      
      if (campaignData?.campaignType?.toLowerCase() !== "normal") {
        let du = secondsToHMS(campaignData?.totalDurationOfCampaignInSeconds);
        
        let camDu = {
          hh: du.hours,
          mm: du.minutes,
          ss: du.seconds,
        };
        setDuration(camDu);
      }
      console.log("campaignData?.campaignType",campaignData?.campaignType)
      setCampaignType(campaignData.campaignType.toUpperCase());
      setRatioId(campaignData?.aspectRatio?.aspectRatioId);
      setSelAudioData([...audio]);
      setTempletTagArr([...tags]);
      setBgColor(campaignData?.backgroundColor);
      setCampaignName(campaignData?.campaignName);
      setValue(campaignData?.templateId);

  let postObj = {
        aspectRatioId: campaignData?.aspectRatio?.aspectRatioId,
        templateId: campaignData?.templateId,
        backgroundImageContentId: null,
        transparencyInPercentage: null,
        state: campaignData?.state,
        status: campaignData?.status,
        audioStartBasedOnCampaignDurationInSeconds: campaignData?.audioStartBasedOnLayoutDurationInSeconds,
        audioEndBasedOnCampaignDurationInSeconds: campaignData?.audioEndBasedOnLayoutDurationInSeconds,
        audios: campaignData?.audios,
        campaignTags: campaignData?.campaignTags,
        regions: regiondata,
        campaignName: campaignData?.campaignName,
        campaignDescription: campaignData?.campaignName,
      };
      setSelectedTemplet(postObj);
      if(campaignData?.audioStartBasedOnLayoutDurationInSeconds)
      {
     setusermintime(campaignData?.audioStartBasedOnLayoutDurationInSeconds)
      setusermaxtime(campaignData?.audioEndBasedOnLayoutDurationInSeconds)
      }

      
    }
  };
  function secondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }
  const btnGetCampaignDetails = async (campaignId) => {
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: campaignId,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      
      setIsLoading(false);
      if (response?.data) {
        btnSetCamapaignEditValues(response.data);
        // setSelectedCampaign(response.data);
        // btnSelectedCampaignData(response.data);
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      if(error.response.data){
        Alert.alert("Error",error.response.data.data)
      }else{
        if(error.message=="Request failed with status code 401"){
          Alert.alert("Unauthorized!", 'Please login.', [
            {
              text: "Ok",
              onPress: () => {
                resetRedux()
                navigation.reset({
                  index: 0,
                  routes: [{ name: NAVIGATION_CONSTANTS.LOGIN }],
                });
              },
            },
          ]);
        }else{
        Alert.alert("Error","Error in getting of camapign details.")
        }
      }
      
    };

    CampaignStringManagerService.fetchCampaignDetails(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  //end for edit
  const workFlow = useSelector((state) => state.userReducer.workFlow);
  const getvaluess = async() =>
    {
      console.log("\n getting values \n")
      
      const token=await getStorageForKey("authToken");  
      const decodedHeader = jwtDecode(token);
      

      console.log("valyess-->",decodedHeader.is_moving_walls_enabled,decodedHeader.is_advertisement_enabled)
      let cmptypeArr=[]
      if(decodedHeader.is_advertisement_enabled){
        cmptypeArr.push({ label: "LEMMA", value: "ADVERTISEMENT"})
      }
      if(decodedHeader.is_moving_walls_enabled){
        cmptypeArr.push({ label: "MOVING WALL", value: "MOVING_WALL" })
      }
      setcmpgnType([...cmpgnType,...cmptypeArr])

      console.log(cmptypeArr)

    }
  // get media data
  React.useEffect(() => {
    getWorkFlow(navigation);
    getvaluess()
    getMediaDataForCampAdd(setIsLoading);
    getResolutionData(setIsLoading);
  }, [1]);
  // get template data
  React.useEffect(() => {
    getTempleteDataForCampAdd(setIsLoading);
  }, [1]);

  React.useEffect(() => {
    makeTemplateDropDownList();
  }, [templateList]);

  // manage media data====
  React.useEffect(() => {
    let imageMediaData1 = [];
    let imageMediaData12 = [];
    let imageMediaData123 = [];

    MediaList?.data?.mediaDetails?.map((item) => {
      if (item.type == "IMAGE" && item.isFileReadyForPlay == "PROCESSED") {
        imageMediaData1.push({ ...item, statusFlag: false });
      }
      if (item.isFileReadyForPlay == "PROCESSED" && item.type != "AUDIO") {
        imageMediaData12.push({ ...item, statusFlag: false });
      }
      if (item.isFileReadyForPlay == "PROCESSED" && item.type == "AUDIO") {
        imageMediaData123.push({ ...item, statusFlag: false });
      }
    });

    setImageMediaData([...imageMediaData1]);
    setMediaData([...imageMediaData12]);
    setAudioData([...imageMediaData123]);
  }, [MediaList]);

  const makeTemplateDropDownList = () => {
    if (templateList.length > 0) {
      const modifykeys = (data, index) => {
        const { templateName, templateId, ...rest } = data;
        return {
          label: templateName,
          value: templateId,
          templateName: templateName,
          templateId: templateId,
          ...rest,
        };
      };
      let modiFyiedData = templateList.map((data, index) =>
        modifykeys(data, index)
      );
      setTempleteShowList(modiFyiedData);
    }
  };

  const btnMakePostData = (item) => {
    let regins = item.regions.map((region1, index) => {
      return { ...region1, regionData: [] };
    });

    let postObj = {
      aspectRatioId: item?.aspectRatio?.aspectRatioId,
      templateId: item?.templateId,
      backgroundImageContentId: null,
      transparencyInPercentage: null,
      state: item?.tempState,
      status: item?.status,
      audioStartBasedOnCampaignDurationInSeconds: 0,
      audioEndBasedOnCampaignDurationInSeconds: 0,
      audios: [],
      campaignTags: [],
      regions: regins,
      campaignName: campaignName,
      campaignDescription: campaignName,
    };

    if (item?.layoutTags) {
      let layoutTags = item?.layoutTags.split(",");
      setTempletTagArr([...layoutTags]);
    }
    setSelectedTemplet(postObj);
  };

  const fnPlayningMedia = (item) => {
    if (mediaModalType == "image") {
      setSelectedBgImg(item[0]);
    } else if (mediaModalType == "regionMedia") {
      selectedTemplet.regions[activateRegion].contentToDisplay = item[0];

      let rData = item.map((region, rIndex) => {
        return {
          contentId: region?.mediaDetailId,
          contentVersionId: region?.version,
          contentType: "IMAGE",
          mediaDetailId: region?.mediaDetailId,
          mediaVersionId: region?.version,
          mediaType: region?.type,
          order: rIndex + 1,
          durationInSeconds: region?.defaultDurationInSeconds,
          transparencyInPercentage: 1,
          entryAnimationId: 1,
          exitAnimationId: 1,
          displayMode: "NORMAL",
        };
      });

      selectedTemplet.regions[activateRegion].regionData = item;
      selectedTemplet.regions[
        activateRegion
      ].globalRegionContentPlaylistContents = rData;
      setSelectedTemplet({ ...selectedTemplet });
    } else {
      setSelAudioData([...item]);
    }
  };
  const openArrangeModal = (index) => {
    setActiveRegion(index);
    setMediaModalType("regionMedia");
    setModal(true);
    // setArrangeModal(true);
  };

  const removeItemFromRegion = (index) => {
   
    return false;
    if (selectedTemplet.regions[activateRegion].regionData.length == 1) {
      delete selectedTemplet.regions[activateRegion]["contentToDisplay"];
    }
    selectedTemplet.regions[activateRegion].regionData.splice(index, 1);
    setSelectedTemplet({ ...selectedTemplet });
  };

  const removeTag = (index) => {
    if (templateTagArr.length > 0) {
      templateTagArr.splice(index, 1);
      setTempletTagArr([...templateTagArr]);
    }
  };
  const removeAudio = (index) => {
    if (seleAudioData.length > 0) {
      seleAudioData.splice(index, 1);
      setSelAudioData([...seleAudioData]);
    }
  };

  const onRegionChange = (item) => {
    let imageMediaData12 = [];
    mediaData?.map((item) => {
      if (item.isFileReadyForPlay == "PROCESSED" && item.type != "AUDIO") {
        imageMediaData12.push({ ...item, statusFlag: false });
      }
    });
    setMediaData([...imageMediaData12]);
    setSelectetRegionForEdit(-1);
    setValue(item.value);
    btnMakePostData(item);
  };
  const btnSubmitData = async (btnType) => {
    if (!campaignType) {
      Alert.alert("Please enter campaign type");
      return false;
    }
    campaignType.toLowerCase() == "normal"
      ? btnAddCampaignData(btnType)
      : btnAddAdvertiseData(btnType);
  };

  useEffect(() => {
    let timingggg = 0
    for (let index = 0; index < selectedTemplet?.regions?.length; index++) {
      for (let index1 = 0; index1 < selectedTemplet?.regions[index].regionData.length; index1++) {
        timingggg = timingggg + selectedTemplet?.regions[index].regionData[index1].defaultDurationInSeconds
      }
    }
    setaudiotiming(timingggg)
   
    if(timingggg >0)
    {
      setmaxtime(timingggg)
      setusermaxtime(timingggg)
    }
  }, [selectedTemplet]);

  const btnAddAdvertiseData = async (btnType) => {
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }
    if (campaignName.trim().length > 15) {
      console.log("Please enter a valid campaign name between 3 and 15 characters")
      alert("Please enter a valid campaign name between 3 and 15 characters");
      return false;
    }
    if (!ratioId) {
      alert("Please select aspect ratio");
      return false;
    }

    if (duration.hh == 0 && duration.mm == 0 && duration.ss == 0) {
      alert("Please enter duration");
      return false;
    }else if (duration.hh >= 23 || duration.mm >=60 && duration.ss >=60) {
      alert("Please enter duration horus not more than 23, minutes not more than 59 and second not more than 59");
      return false;
    }

    let total_seconds =
      parseFloat(duration.hh) * 3600 +
      parseFloat(duration.mm) * 60 +
      parseFloat(duration.ss);
    
    let postData = {
      aspectRatioId: ratioId,
      campaignName: campaignName,
      durationInHH: duration.hh,
      durationInMM: duration.mm,
      durationInSS: duration.ss,
      duration: total_seconds,
    };

    const slugId = await getStorageForKey("slugId");
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response.code == 200) {
        setSuccessModal(true)
        setSuccessMsg("Campaign edit successfully")
        setTimeout(()=>{
          navigation.goBack();
        },800)
        // Alert.alert("Info!", "Campaign edit successfully", [
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
        } else if (response?.error) {
          alert(response?.error);
        } else {
          alert(response?.message);
        }
      }
    };
    const failureCallBack = (error) => {

      console.log("er 63".error)
      if (error?.response?.data?.data?.length > 0) {
        Alert.alert('Error',error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        Alert.alert('Error',error?.data[0]?.message);
      } else {
        // Alert.alert('677',error?.message);
        if(error.message=="Request failed with status code 401"){
          Alert.alert("Unauthorized!", 'Please login.', [
            {
              text: "Ok",
              onPress: () => {
                resetRedux()
                navigation.reset({
                  index: 0,
                  routes: [{ name: NAVIGATION_CONSTANTS.LOGIN }],
                });
              },
            },
          ]);
        }

      }
      setIsLoading(false);
    };
    let lastUrl=campaignType=="ADVERTISEMENT"?"campaign-advertisement":"movingwall-advertisement"
    let endPoint=`service-gateway/cms/${slugId}/v1/${lastUrl}/${campaignItem?.campaignId}`
    let params = {
      data: postData,
      endPoint:endPoint,
      slugId,
      campaignId: campaignItem?.campaignId,
    };
    setIsLoading(true);
    CampaignManagerService.editAdvertisement(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnAddCampaignData = async (btnType) => {
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }
    if (campaignName.trim().length > 15) {
      console.log("Please enter a valid campaign name between 3 and 15 characters")
      alert("Please enter a valid campaign name between 3 and 15 characters");
      return false;
    }
    if (selectedTemplet == null) {
      Alert.alert("Please select a template");
      return false;
    }

    let returntype = true;
    if (selectedTemplet.regions.length > 0) {
      for (let index = 0; index < selectedTemplet.regions.length; index++) {
        if (
          selectedTemplet?.regions[index]?.regionData &&
          selectedTemplet?.regions[index]?.regionData?.length <= 0
        ) {
          Alert.alert(
            `Please select media for ${selectedTemplet.regions[index].templateRegionName} region`
          );
          returntype = false;
          break;
        }
      }
    }

    if (!returntype) {
      return false;
    }

    let selAudioData1 = [];
    if (seleAudioData.length > 0) {
      for (let index = 0; index < seleAudioData.length; index++) {
        selAudioData1.push({
          contentVersionId: seleAudioData[index].version,
          contentId: seleAudioData[index].mediaDetailId,
          order: index + 1,
        });
      }
    }
    let campTag = [];
    if (templateTagArr.length > 0) {
      campTag = templateTagArr.map((tag) => {
        return { campaignTag: tag };
      });
      selectedTemplet["campaignTags"] = campTag;
    }

    selectedTemplet["audios"] = selAudioData1;
    if (selectedBgImg != "") {
      selectedTemplet["backgroundImageContentId"] = selectedBgImg.mediaDetailId;
      selectedTemplet["backgroundImageContentVersionId"] =
        selectedBgImg.version;
    }

    selectedTemplet["campaignName"] = campaignName;
    selectedTemplet["campaignDescription"] = campaignName;
    selectedTemplet["state"] = "DRAFT";
    if (bgColor != "") {
      selectedTemplet["backgroundColor"] = bgColor;
    }
    if (transparency != "") {
      selectedTemplet["transparencyInPercentage"] = transparency;
    }
    if (selectedBgImg != "") {
      selectedTemplet["backgroundImageContentId"] =
        selectedBgImg?.mediaDetailId;
    }

    if(seleAudioData.length>0)
    {
      selectedTemplet["audioEndBasedOnCampaignDurationInSeconds"]= usermaxtime
      selectedTemplet["audioStartBasedOnCampaignDurationInSeconds"]= usermintime
    }



    
    const slugId = await getStorageForKey("slugId");
    const succussCallBack = async (response) => {
    
      setIsLoading(false);
      if (response.code == 200) {
        btnSubmittedStatus(response?.data?.campaignId, btnType);
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
     
      if (error?.response?.data?.message) {
        alert(error?.response?.data?.message);
      } else if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    let params = {
      data: selectedTemplet,
      slugId,
      campaignId: campaignItem?.campaignId,
    };

    console.log("edit camp",JSON.stringify(params))
    setIsLoading(true);
    CampaignManagerService.editCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnSubmittedStatus = async (campaignId, btnType) => {
    if (btnType == "DRAFT") {
      setSuccessModal(true)
      setSuccessMsg("Campaign updated successfully")
      // Alert.alert("Info!", "Campaign updated successfully", [
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
      campaignId: campaignId,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response.code == 20) {
        setSuccessModal(true);
        setSuccessMsg("Campaign edited successfully");
        setTimeout(()=>{
          navigation.goBack();
        },800)
        
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
      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };

    setIsLoading(true);
    CampaignManagerService.campaignSubmittedStatusAdd(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const removeRegionData = (index) => {
    selectedTemplet.regions[index].regionData = [];
    setSelectedTemplet({ ...selectedTemplet });
  };

  const onSubmitArrangeData = (rData, gData) => {
    selectedTemplet.regions[activateRegion].regionData = rData;
    selectedTemplet.regions[
      activateRegion
    ].globalRegionContentPlaylistContents = gData;
    setSelectedTemplet({ ...selectedTemplet });
  };

  const onChangeDuration = (value, type) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      if (type === "HH" && value ) {
        setDuration({ ...duration, hh: value });
      }
      if (type === "MM" && value ) {
        setDuration({ ...duration, mm: value });
      }
      if (type === "SS" && value <= 59) {
        setDuration({ ...duration, ss: value });
      }
    }
  };

  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  useEffect(() => {
    setLocationSelected([]);
  }, [locationData1]);

  const [locationModal, setLocationModal] = useState(false);
  const [locationSelected, setLocationSelected] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const onLocationCancel=()=>{
    selectedTemplet.regions[selectRegionForEdit]["locationIds"] = [];
    selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = false;
    setSelectedTemplet({ ...selectedTemplet });
    setLocationSelected([]);
}
  const onChangeLocatioValue = (lData, ljsonData) => {
    selectedTemplet.regions[selectRegionForEdit]["locationIds"] = lData;
    setSelectedTemplet({ ...selectedTemplet });
    console.log("data in edit camp==========>",JSON.stringify(ljsonData))
    setLocationName(ljsonData);
    
  };

  const customization = function () {
    if (!selectedTemplet.regions[selectRegionForEdit]["customizCheck"]) {
      setSelectedLocations([])
      setLocationModal(true);
      setLocationSelected([]) 
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = true;
      setSelectedTemplet({ ...selectedTemplet });
      
    } else {
      selectedTemplet.regions[selectRegionForEdit]["locationIds"] = [];
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = false;
      setSelectedTemplet({ ...selectedTemplet });  
      setLocationSelected([])    
    }
  };

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <Loader visible={isLoading} />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "margin"}
        style={{
          flex: 1,
          marginBottom: Platform.OS === "ios" && isKeyboardOpen ? 100 : 0,
          // backgroundColor:"red"
        }}
      >
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {modal && (
          <SelectMediaModal
            data={
              mediaModalType == "regionMedia"
                ? mediaData
                : mediaModalType == "image"
                ? imageMediaData
                : audioData
            }
            regionData={
              selectedTemplet?.regions
                ? selectedTemplet?.regions[activateRegion]?.regionData
                : []
            }
            selectedBgImg={selectedBgImg}
            seleAudioData={seleAudioData}
            mediaModalType={mediaModalType}
            onClick={fnPlayningMedia}
            setArrangeModal={setArrangeModal}
            setModal={setModal}
          />
        )}

        {cmpArrangeModal && (
          <CampaignArrangeMedia
            data={selectedTemplet?.regions}
            removeItemFromRegion={removeItemFromRegion}
            setArrangeModal={setArrangeModal}
            activateRegion={activateRegion}
            setCmpArrangeModal={setCmpArrangeModal}
            onSubmitArrangeData={onSubmitArrangeData}
          />
        )}

        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <CreateNewHeader
              title="Edit Campaign"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              Campaign Details
            </AppText>
            <Separator />
            <View style={Styles.bodyRowsContainer}>
              <AppText style={Styles.labeltext}>Campaign Type*</AppText>

              <CampaignDropDown
                isDisabled={true}
                dataList={cmpgnType}
                placeHolderText="Select Campaign Type*"
                onChange={(item) => {
                  setCampaignType(item.value);
                }}
                value={campaignType}
              />
              <AppText style={Styles.labeltext}>Campaign Name*</AppText>

              <AppTextInput
                containerStyle={Styles.eventTitleInput}
                placeHolderText="Campaign Name *"
                placeholderTextColor={themeColor.placeHolder}
                value={campaignName}
                onChangeText={(text) => {
                  setCampaignName(text);
                }}
                textInputStyle={{
                  fontSize: moderateScale(15),
                }}
              />
              {campaignType.toUpperCase() != "NORMAL" && (
                <View style={{ marginBottom: 5 }}>
                  <AppText style={Styles.labeltext}>Aspect ratio*</AppText>

                  <CampaignDropDown
                    dataList={ratioList}
                    placeHolderText="Select aspect ratio*"
                    onChange={(item) => {
                      setRatioId(item.value);
                    }}
                    value={ratioId}
                  />
                </View>
              )}
              {campaignType.toUpperCase() != "NORMAL" && (
                <>
                  <AppText style={Styles.labeltext}>Duration*</AppText>
                  <View style={Styles.durartionContainer}>
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="HH"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.hh?.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        onChangeDuration(text, "HH");
                      }}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="MM"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.mm?.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        onChangeDuration(text, "MM");
                      }}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="SS"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.ss?.toString()}
                      keyboardType="numeric"
                      onChangeText={(text) => {
                        onChangeDuration(text, "SS");
                      }}
                      textInputStyle={{
                        fontSize: moderateScale(15),
                      }}
                    />
                  </View>
                </>
              )}

              {campaignType?.toUpperCase() == "NORMAL" && (
                <>
                  {/* <AppText style={Styles.labeltext}>Templates *</AppText>
                  <CampaignDropDown
                    dataList={templateShowList}
                    Styles={Styles}
                    isDisabled={!true}
                    onChange={(item) => {
                      onRegionChange(item);
                    }}
                    value={value}
                  /> */}
                  <AppText style={Styles.labeltext}>Audio </AppText>

                  <SelectAudio
                    isDisabled={!selectedTemplet ? true : false}
                    data={seleAudioData}
                    setMediaModalType={(i) => setMediaModalType(i)}
                    setModal={setModal}
                    removeAudio={(i) => removeAudio(i)}
                  />

                  {seleAudioData.length>0 && maxtime > 0 && (
                        <>
                          <AppText
                            style={[[Styles.titleStyle, { marginVertical: 10,marginLeft:5 }]]}
                          >
                            {"Set Audio Duration"}
                          </AppText>
                          <RnRangeSlider
                            style={{width:Dimensions.get("window").width-70,marginVertical:10,marginHorizontal:16}}
                            min={mintime}
                            max={maxtime}
                            step={1}
                            low={usermintime}
                            high={usermaxtime}
                            floatingLabel
                            renderThumb={renderThumb}
                            renderRail={renderRail}
                            renderRailSelected={renderRailSelected}
                            renderLabel={renderLabel}
                            renderNotch={renderNotch}
                            onValueChanged={handleValueChange}
                          />
                         
                          <View
                            style={{ flexDirection: "row", justifyContent: "space-between",marginHorizontal:10  }}
                          >
                          <View
                            style={{
                              width: 45,
                              height: 45,
                              backgroundColor: "#0056a8",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 25,
                            }}
                          >
                            <Text style={{ color: "#fff" }}>{parseInt(usermintime)}</Text>
                          </View>
                          <View style={{
                              width: 45,
                              height: 45,
                              backgroundColor: "#0056a8",
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 25,
                            }}
                          >
                            <Text style={{ color: "#fff" }}>
                              {usermaxtime}
                            </Text>
                          </View>
                         </View>
                        </>
                      )}


                  <AppText style={Styles.labeltext}>Tags </AppText>

                  <CampaignAddTag
                    data={templateTagArr}
                    templateTag={templateTag}
                    removeTag={removeTag}
                    setTempletTag={setTempletTag}
                    setTempletTagArr={setTempletTagArr}
                    templateTagArr={templateTagArr}
                  />
                  <AppText style={Styles.labeltext}>Background Image </AppText>

                  <TouchableOpacity
                    style={Styles.mainSelectImageContainer}
                    disabled={!selectedTemplet ? true : false}
                    onPress={() => {
                      setMediaModalType("image");
                      setModal(true);
                    }}
                  >
                    {selectedBgImg && (
                      <Pressable
                        onPress={() => {
                          setSelectedBgImg("");
                        }}
                        style={{
                          height: 30,
                          width: 30,
                          position: "absolute",
                          right: 7,
                          top: 7,
                        }}
                      >
                        <Image
                          style={{ height: 30, width: 30 }}
                          source={CrossImage}
                        />
                      </Pressable>
                    )}
                    {selectedBgImg ? (
                      <Image
                        source={{
                          uri: selectedBgImg?.imageUrl,
                        }}
                        style={{ width: 90, height: 90 }}
                      />
                    ) : (
                      <>
                        <Image
                          source={require("../../Assets/Images/PNG/select.png")}
                          style={{ width: 90, height: 90 }}
                        />
                        <Text style={{ color: "#ADB2C3" }}>
                          Upload background image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <AppText style={Styles.labeltext}>Background Color </AppText>

                  <ColorModalPicker
                    setModal={setColorModal}
                    modal_flag={colorModal}
                    setBgColor={setBgColor}
                  />

                  <TouchableOpacity
                    isDisabled={!selectedTemplet ? true : false}
                    onPress={() => setColorModal(true)}
                  >
                    <View style={Styles.colorPickerBox}>
                      <AppText style={{ color: "#ADB2C3" }}>
                        Select background color
                      </AppText>
                      <View
                        style={[
                          Styles.colorPickerSeleBox,
                          { backgroundColor: bgColor },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  {selectedBgImg && (
                    <>
                      <AppText style={[[Styles.titleStyle, { marginTop: 10 }]]}>
                        {"Set Background Media Transparency"}
                      </AppText>
                      <Slider
                        style={{
                          width:width*0.9,
                          height: 40,
                          marginLeft: -7,
                        }}
                        minimumValue={0}
                        value={transparency?transparency:1}
                        maximumValue={1}
                        onValueChange={(value) => {
                          setTransparency(value);
                        }}
                        minimumTrackTintColor="#223577"
                        maximumTrackTintColor="#000000"
                      />
                    </>
                  )}
                </>
              )}
            </View>
            {campaignType?.toUpperCase() == "NORMAL" && (
              <>
                {/*Region===============================regions====== */}
                {selectedTemplet?.regions && (
                  <View
                    style={{
                      height: 400,
                      width: "100%",
                      borderRadius: 2,
                      borderWidth: 1,
                      padding: 5,
                    }}
                  >
                    <ImageBackground
                      imageStyle={{
                        borderRadius: 5,
                        height: "100%",
                        width: "100%",
                        position: "relative",
                        backgroundColor: bgColor,
                        // opacity: transparency,
                        opacity: !selectedBgImg ? 1 : 1-transparency ,
                      }}
                      source={
                        selectedBgImg ? { uri: selectedBgImg.imageUrl } : null
                      }
                    >
                      <CampaignRegion
                        setLocationName={setLocationName}
                        selectedBgImg={mediaModalType}
                        removeRegionData={removeRegionData}
                        regions={selectedTemplet?.regions}
                        setActiveRegion={setActiveRegion}
                        setSelectetRegionForEdit={setSelectetRegionForEdit}
                        setCmpArrangeModal={setCmpArrangeModal}
                        selectMediaForRegion={(index) => {
                          openArrangeModal(index);
                        }}
                      />
                    </ImageBackground>
                  </View>
                )}

                {selectedTemplet?.regions && selectRegionForEdit > -1 && (
                  <View style={{ padding: 5 }}>
                    <AppText style={[Styles.regionSubTitleStyle]}>
                      {
                        selectedTemplet.regions[selectRegionForEdit][
                          "templateRegionName"
                        ]
                      }
                    </AppText>
                    {/* <View style={{ marginTop: 10 }}>
                      <AppText style={[Styles.titleStyle]}>{"zIndex"}</AppText>
                      <AppTextInput
                        editable={false}
                        containerStyle={Styles.eventTitleInput}
                        value={
                          selectedTemplet?.regions[
                            selectRegionForEdit
                          ]?.zIndex.toString() || 0
                        }
                        placeHolderText="Enter zIndex"
                        placeholderTextColor={themeColor.placeHolder}
                        onChangeText={(txt) => {
                          selectedTemplet.regions[selectRegionForEdit][
                            "zIndex"
                          ] = txt;
                          setSelectedTemplet({ ...selectedTemplet });
                        }}
                        textInputStyle={{
                          fontSize: moderateScale(15),
                        }}
                      />
                    </View> */}

                    <View style={{ marginTop: 8 }}>
                      <AppText style={[Styles.titleStyle]}>
                        {"Set Media Transparency"}
                      </AppText>
                      <Slider
                        style={{
                          width:width*0.9,
                          height: 40,
                          marginLeft: -7,
                        }}
                        minimumValue={0}
                        inverted={false}
                        value={
                          selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ]?selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ] : 0
                        }
                        maximumValue={0.99}
                        onValueChange={(value) => {
                          console.log("regionTransparencyInPercentage",value)
                          selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ] = value ;
                          setSelectedTemplet({ ...selectedTemplet });
                        }}
                        minimumTrackTintColor="#223577"
                        maximumTrackTintColor="#000000"
                      />
                    </View>
                    <View style={Styles.audioBox}>
                      <AppText style={[Styles.titleStyle]}>
                        {"Audio (ON/OFF)"}
                      </AppText>
                      {seleAudioData.length==0?<Switch
                        color={"black"}
                        value={seleAudioData.length==0 ?
                          selectedTemplet?.regions[selectRegionForEdit]?.isAudioEnabled || false : false
                        }
                        onValueChange={(txt) => {
                          console.log("adui chang121e-->",selectRegionForEdit,txt)
                          if(seleAudioData.length==0){
                            console.log("adui change-->",selectRegionForEdit,txt)
                            selectedTemplet.regions[selectRegionForEdit][
                              "isAudioEnabled"
                            ] = txt;
                            setSelectedTemplet({ ...selectedTemplet });
                        }
                        }}
                      />:
                      <Switch
                        color={"black"}
                        value={false}
                        onValueChange={(txt) => {
                          console.log("adui chang121e-1342->",selectRegionForEdit,txt)
                          if(seleAudioData.length==0){
                            console.log("adui change-->",selectRegionForEdit,txt)
                            selectedTemplet.regions[selectRegionForEdit][
                              "isAudioEnabled"
                            ] = false;
                            setSelectedTemplet({ ...selectedTemplet });
                          }}
                        }
                      />
                    }
                    </View>
                    <Text
                      style={{ color: "#000000", fontSize: 14, marginTop: 15 }}
                    >
                      Offset
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <CommonTitleAndText
                        title="Width"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "widthInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                      <CommonTitleAndText
                        title="Height"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "heightInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                      <CommonTitleAndText
                        title="Top"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "topLeftCoordinateYInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                      <CommonTitleAndText
                        title="Left"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "topLeftCoordinateXInPixel"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                    </View>
                    <CommonTitleAndText
                        title="Zindex"
                        text={
                          selectedTemplet.regions[selectRegionForEdit][
                            "zIndex"
                          ]
                        }
                        containerStyle={{ borderWidth: 0, paddingLeft: 0 }}
                      />
                    {/*=============cutomize checkbox======== */}
                    <Pressable
                      style={{
                        flexDirection: "row",
                        marginTop: 20,
                      }}
                      onPress={() => {
                        customization();
                      }}
                    >
                      <View>
                        {!selectedTemplet?.regions[selectRegionForEdit]
                          .customizCheck ? (
                          <MaterialIcons
                            name="check-box-outline-blank"
                            color={"#253D91"}
                            size={25}
                          />
                        ) : (
                          <MaterialIcons
                            name="check-box"
                            color={themeColor.themeColor}
                            size={25}
                          />
                        )}
                      </View>
                      {/*  */}
                      <AppText>Do you want to allow customization?</AppText>
                    </Pressable>

                    {selectedTemplet.regions[selectRegionForEdit]["locationIds"]
                      .length > 0 && (
                      <View style={{paddingHorizontal:18}}>
                        {locationName.length>0 && locationName?.map((item,i)=>{return (
                        <AppText
                          key={i}
                          style={{
                            marginTop: 4,
                            fontSize: moderateScale(14),
                            color: "black",
                          }}
                        >{item.locationName}
                        </AppText>)
                       })}
                      </View>
                    )}
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <ActionContainer
        isContinue={campaignType.toUpperCase() != "NORMAL" && true}
        continueText={campaignType.toUpperCase() != "NORMAL" && "Save & Next"}
        saveText={
          workFlow &&
          (workFlow?.approverWorkFlow === "CAMPAIGN" ||
            workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN")
            ? "Submit"
            : "Save & Next"
        }
        numOfButtons={2}
        onPressSave={() => {
          btnSubmitData("SUBMITTED");
        }}
        onPressCancel={() => {
          navigation.goBack();
        }}
        onPressDraft={() => {
          btnSubmitData("DRAFT");
        }}
      />
      <SelectLocationModalForCampaign
        visible={locationModal}
        setModal={setLocationModal}
        setIsLoading={setIsLoading}
        locationSelected={locationSelected}
        setLocationSelected={setLocationSelected}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        locationData1={locationData1}
        onLocationCancel={onLocationCancel}
        onChangeLocatioValue={onChangeLocatioValue}
      />
    </View>
  );
};
export default EditCampaign;
