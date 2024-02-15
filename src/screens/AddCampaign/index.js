import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,Dimensions,
  Image,
  ImageBackground,
  ScrollView,Platform,Sliders,
  ActivityIndicator,KeyboardAvoidingView,Keyboard,
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
import { moderateScale, width } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import { Dropdown } from "react-native-element-dropdown";
import CommonStyles from "./style";
import ColorModalPicker from "../../Components/Atoms/ColorPicker";
import {
  getMediaLibData,
  getResolutionData,
  getTemplateData,
  getWorkFlow,
} from "../../Services/AxiosService/ApiService";
import { useSelector } from "react-redux";
import Slider from "@react-native-community/slider";
import SelectMediaModal from "../../Components/Organisms/CMS/Campaign/SelectMediaModal";
import { CampaignManagerService } from "../Campaign/CompainApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CampaignRegion from "../../Components/Organisms/CMS/Campaign/CampaignRegion";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import SelectAudio from "../../Components/Organisms/CMS/Campaign/SelectAudio";
import CampaignAddTag from "../../Components/Organisms/CMS/Campaign/CampaignAddTag";
import { getMediaDataForCampAdd } from "../Campaign/CompainApi";
import { getTempleteDataForCampAdd } from "../Campaign/CompainApi";
import Loader from "../../Components/Organisms/CMS/Loader";
import { ResolutionManagerService } from "../../Services/AxiosService";
import CampaignArrangeMedia from "../../Components/Organisms/CMS/Campaign/CampaignArrangeMedia";
import CrossImage from "../../Assets/Images/PNG/delete-button.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SelectLocationModalForCampaign from "../../Components/Organisms/Devices/SelectLocationModalForCampaign";
import SuccessModal from "../../Components/Molecules/SuccessModal";

import RangeSliderRN from "rn-range-slider";
import Thumb from "../../Components/HelperComp/Thumb";
import Raill from "../../Components/HelperComp/Raill";
import RailSelected from "../../Components/HelperComp/RailSelected";
import Label from "../../Components/HelperComp/Label";
import Notch from "../../Components/HelperComp/Notch";
import RnRangeSlider from "rn-range-slider";

const AddCampaign = ({ navigation }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  const renderThumb = useCallback(() => <Thumb/>, []);
const renderRail = useCallback(() => <Raill/>, []);
const renderRailSelected = useCallback(() => <RailSelected/>, []);
const renderLabel = useCallback(value => <Label text={value}/>, []);
const renderNotch = useCallback(() => <Notch/>, []);
const handleValueChange = useCallback((low, high) => {

  setusermaxtime(high);
  setusermintime(low);
}, []);

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

  const [value, setValue] = useState(null);
  const [campaignName, setCampaignName] = useState("");
  const [templateTag, setTempletTag] = useState("");
  const [templateTagArr, setTempletTagArr] = useState([]);
  const [transparency, setTransparency] = useState(0);

  const [modal, setModal] = useState();
  const [arrangeModal, setArrangeModal] = useState(false);
  const [selectedBgImg, setSelectedBgImg] = useState("");
  const [selectedTemplet, setSelectedTemplet] = useState(null);
  const [mediaModalType, setMediaModalType] = useState(null);
  const [activateRegion, setActiveRegion] = useState(0);
  const [selectRegionForEdit, setSelectetRegionForEdit] = useState(-1);

  const [campaignType, setCampaignType] = useState("normal");
  const [ratioId, setRatioId] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [locationSS, setLocationSS] = useState([]);

  const [audioTime,setAudioTime]=useState({});
  const [mintime,setmintime]=useState(0);
  const [maxtime,setmaxtime]=useState(audiotiming);
  const [usermintime,setusermintime]=useState(0);
  const [usermaxtime,setusermaxtime]=useState(0);
  const [audiotiming,setaudiotiming]=useState(0);


  const [cmpArrangeModal, setCmpArrangeModal] = useState(false);
  const [duration, setDuration] = useState({
    hh: 0,
    mm: 0,
    ss: 0,
  });

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("")

  const onComplete = () => {
    setSuccessModal(false);
  };

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

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
     
      navigation.goBack();

  })
    
  }, [navigation])


  const [ratioList, setRatioList] = useState([]);
  // get media data
  React.useEffect(() => {
    getMediaDataForCampAdd(setIsLoading);
    setTimeout(() => {
      getResolutionData(setIsLoading);
    }, 1000);
  }, []);
  // // get template data
  const workFlow = useSelector((state) => state.userReducer.workFlow);
  React.useEffect(() => {
    getWorkFlow(navigation);
    getTempleteDataForCampAdd(setIsLoading);
  }, []);

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


  const audioWithregion=(region,time)=>{
    let name={};
    name[region]=time;
    setAudioTime((prev)=>({...prev,...name}));
  }


  useEffect(() => {
    let timingggg = 0
    for (let index = 0; index < selectedTemplet?.regions.length; index++) {
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
      return {
        ...region1,
        regionData: [],
        locationIds: [],
        locations: [],
        customizCheck: false,
      };
    });
    let postObj = {
      aspectRatioId: item?.aspectRatio?.aspectRatioId,
      templateId: item?.templateId,
      backgroundImageContentId: null,
      transparencyInPercentage: null,
      state: item?.tempState,
      status: item?.status,
      audioStartBasedOnCampaignDurationInSeconds: usermintime,
      audioEndBasedOnCampaignDurationInSeconds: usermaxtime,
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
    } 
    else if (mediaModalType == "regionMedia") {
      selectedTemplet.regions[activateRegion].contentToDisplay = item[0];
      let timing=0;
      item.map((region, rIndex)=>{
        timing=timing+region?.defaultDurationInSeconds
      })
      
      audioWithregion(activateRegion,timing);
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
     
    }
     else {
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
    if(item.backgroundImageContentId&&imageMediaData.length>0){
    const bgEle=  imageMediaData.filter(ele=>ele.mediaDetailId==item.backgroundImageContentId)

      setSelectedBgImg({...bgEle[0]})
    }else{
      setSelectedBgImg("");
    }
    setMediaData([...imageMediaData12]);
    setSelectetRegionForEdit(-1);
    setValue(item.value);
    btnMakePostData(item);
    
    setSelAudioData([]);
    setBgColor("#000000");
  };

  const btnSubmitData = async (btnType) => {
    if (!campaignType) {
      Alert.alert("Please enter campaign type");
      return false;
    }
    campaignType != "advertisement"
      ? btnAddCampaignData(btnType)
      : btnAddAdvertiseData(btnType);
  };

  const btnAddCampaignData = async (btnType) => {
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
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

    selectedTemplet


    if(seleAudioData.length>0)
    {
      selectedTemplet["audioEndBasedOnCampaignDurationInSeconds"]= usermaxtime
      selectedTemplet["audioStartBasedOnCampaignDurationInSeconds"]= usermintime
    }



    selectedTemplet["campaignName"] = campaignName;
    selectedTemplet["campaignDescription"] = campaignName;
    selectedTemplet["state"] = "DRAFT";
    if (bgColor != "") {
      selectedTemplet["backgroundColor"] = bgColor;
    }

    if(selectedBgImg==""){
      selectedTemplet["transparencyInPercentage"] = transparency ;
    }else{
      if (transparency != "") {
        selectedTemplet["transparencyInPercentage"] = transparency;
      }
    }

    if (selectedBgImg != "") {
      selectedTemplet["backgroundImageContentId"] =
        selectedBgImg?.mediaDetailId;
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
      if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    let params = {
      data: selectedTemplet,
      slugId,
    };
    
    
    setIsLoading(true);
    CampaignManagerService.addCampaign(
      params,
      succussCallBack,
      failureCallBack
    );
  };


  
  const onChangeDuration = (value, type) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      if (type === "HH" && value <= 23) {
        setDuration({ ...duration, hh: value });
      }
      if (type === "MM" && value <= 59) {
        setDuration({ ...duration, mm: value });
      }
      if (type === "SS" && value <= 59) {
        setDuration({ ...duration, ss: value });
      }
    }
  };

  const btnAddAdvertiseData = async (btnType) => {
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }

    if (!ratioId) {
      alert("Please select aspect ratio");
      return false;
    }

    if (duration.hh == 0 && duration.mm == 0 && duration.ss == 0) {
      alert("Please enter duration");
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
        setSuccessMsg("Campaign saved successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
        },1000)
        // Alert.alert("Info!", "Campaign saved successfully", [
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
      if (error?.response?.data?.data?.length > 0) {
        alert(error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        alert(error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    let params = {
      data: postData,
      slugId,
    };
    setIsLoading(true);
    CampaignManagerService.addAdvertisement(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const btnSubmittedStatus = async (campaignId, btnType) => {
    if (btnType == "DRAFT") {
      setSuccessMsg("Campaign saved successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
        },1000)
      // Alert.alert("Info!", "Campaign saved successfully", [
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
        setSuccessMsg("Campaign saved successfully");
        setSuccessModal(true)
        setTimeout(()=>{
          navigation.goBack();
        },1000)
        // Alert.alert("Info!", "Campaign saved successfully", [
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
    let timing=0;
    gData.map(region=>{timing=timing+region?.defaultDurationInSeconds})
    audioWithregion(activateRegion,timing);
    setSelectedTemplet({ ...selectedTemplet });
  };
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  useEffect(() => {
    // setLocationSelected(locationData1);
  }, [locationData1]);




  const [locationModal, setLocationModal] = useState(false);
  const [locationSelected, setLocationSelected] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const onChangeLocatioValue = (lData, ljsonData) => {
   
    selectedTemplet.regions[selectRegionForEdit]["locationIds"] = lData;
    setSelectedTemplet({ ...selectedTemplet });
    setLocationName(ljsonData?.locationName);
    locationSS[selectRegionForEdit]=ljsonData
    console.log("onChangeLocatioValue===>",locationSS)
    // locationSS[selectRegionForEdit].append(ljsonData?.locationName)
    setLocationSS([...locationSS])
  };

  const customization = function () {
    console.log("opopopo12345678--->",selectedTemplet.regions[selectRegionForEdit]["customizCheck"],selectRegionForEdit)
    if (!selectedTemplet.regions[selectRegionForEdit]["customizCheck"]) {
      setSelectedLocations([]); 
      console.log("locationSS[selectRegionForEdit]",selectRegionForEdit,locationSS[selectRegionForEdit])
      locationSS[selectRegionForEdit]=[];
      setLocationSS([...locationSS]);
      setLocationSelected([])
      setLocationModal(true);
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = true;
      setSelectedTemplet({ ...selectedTemplet });
    } else {
      selectedTemplet.regions[selectRegionForEdit]["locationIds"] = [];
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = false;
      setSelectedTemplet({ ...selectedTemplet });
      setLocationSelected([])
      
    }
  };

  const handleSliderChange = values => {
    alert(values)
    //setRange(values);
  };
  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <Loader visible={isLoading} />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1,marginBottom:(Platform.OS === 'ios' && isKeyboardOpen) ? 100 : 0 ,}}
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
              title="Create New Campaign"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              ADD CAMPAIGN DETAILS
            </AppText>
            <Separator />
            <View style={Styles.bodyRowsContainer}>
              <AppText style={Styles.labeltext}>Campaign Type</AppText>
              <CampaignDropDown
                dataList={[
                  { label: "Advertisement", value: "advertisement" },
                  { label: "Normal", value: "normal" },
                ]}
                placeHolderText="Select Campaign Type*"
                onChange={(item) => {
                  setCampaignType(item.value);
                }}
                value={campaignType}
              />

              <AppText style={Styles.labeltext}>Campaign Name</AppText>
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
              {campaignType == "advertisement" && (
                <View style={{ marginBottom: 5 }}>
                  <AppText style={Styles.labeltext}>Aspect ratio</AppText>

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
              {campaignType == "advertisement" && (
                <>
                  <AppText style={Styles.labeltext}>Duration*</AppText>

                  <View style={Styles.durartionContainer}>
                    <AppTextInput
                      containerStyle={Styles.durationTitleInput}
                      placeHolderText="HH"
                      placeholderTextColor={themeColor.placeHolder}
                      value={duration.hh}
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
                      value={duration.mm}
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
                      value={duration.ss}
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

              {campaignType != "advertisement" && (
                <>
                  <AppText style={Styles.labeltext}>Templates *</AppText>

                  <CampaignDropDown
                    dataList={templateShowList}
                    Styles={Styles}
                    onChange={(item) => {
                      onRegionChange(item);
                    }}
                    value={value}
                  />

                  {selectedTemplet && (
                    <>
                      <AppText style={Styles.labeltext}>Tags </AppText>

                      <CampaignAddTag
                        data={templateTagArr}
                        templateTag={templateTag}
                        removeTag={removeTag}
                        setTempletTag={setTempletTag}
                        setTempletTagArr={setTempletTagArr}
                        templateTagArr={templateTagArr}
                      />
                      <AppText style={Styles.labeltext}>Audio </AppText>
                      <SelectAudio
                        data={seleAudioData}
                        isDisabled={!selectedTemplet ? true : false}
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
                            style={{width:Dimensions.get("window").width - 70,marginHorizontal:16,marginVertical:10}}
                            min={mintime}
                            max={maxtime}
                            step={1}
                            floatingLabel
                            renderThumb={renderThumb}
                            renderRail={renderRail}
                            renderRailSelected={renderRailSelected}
                            renderLabel={renderLabel}
                            renderNotch={renderNotch}
                            onValueChanged={handleValueChange}
                          />
                         
                          <View 
                            style={{ 
                              flexDirection: "row", 
                              justifyContent: 
                              "space-between",
                              marginHorizontal:10  
                            }}
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

                      
                      <AppText style={Styles.labeltext}>
                        Background Image
                      </AppText>

                      <TouchableOpacity
                        disabled={!selectedTemplet ? true : false}
                        style={Styles.mainSelectImageContainer}
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
                      <AppText style={Styles.labeltext}>
                        Background Color
                      </AppText>
                      <ColorModalPicker
                        setModal={setColorModal}
                        modal_flag={colorModal}
                        setBgColor={setBgColor}
                      />
                      <TouchableOpacity
                        disabled={!selectedTemplet ? true : false}
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
                          <AppText
                            style={[[Styles.titleStyle, { marginTop: 10 }]]}
                          >
                            {"Set Background Media Transparency"}
                          </AppText>
                          <Slider
                            style={{
                              width:width*0.9,
                              height: 40,
                              marginLeft: -7,
                            }}
                            minimumValue={0}
                            disabled={!selectedTemplet ? true : false}
                            value={transparency?1-transparency:0}
                            maximumValue={1}
                            onValueChange={(value) => {
                            
                              setTransparency(1-value);
                            }}
                            minimumTrackTintColor="#223577"
                            maximumTrackTintColor="#000000"
                          />
                        </>
                      )}
                      
                    </>
                  )}
                </>
              )}
            </View>
            {campaignType != "advertisement" && (
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
                        opacity: selectedBgImg&&transparency ?transparency:1 ,
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
                        containerStyle={Styles.eventTitleInput}
                        value={
                          selectedTemplet?.regions[
                            selectRegionForEdit
                          ]?.zIndex.toString() || 0
                        }
                        editable={false}
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
                        inverted={false}
                        minimumValue={0}
                        value={
                          selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ]?1-selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ] : 0
                        }
                        maximumValue={1}
                        onValueChange={(value) => {
                         
                          selectedTemplet.regions[selectRegionForEdit][
                            "regionTransparencyInPercentage"
                          ] = 1-value;

                          setSelectedTemplet({ ...selectedTemplet });
                       
                        }}
                        minimumTrackTintColor="#223577"
                        maximumTrackTintColor="#000000"
                      />
                    </View>
                    <View style={Styles.audioBox}>
                      <AppText style={[Styles.titleStyle]}>
                        {"Audio (ON/Off)"}
                      </AppText>
                      <Switch
                        color={"#253D91"}
                        disabled={false}
                        value={seleAudioData.length==0 ?
                          selectedTemplet?.regions[selectRegionForEdit]
                            ?.isAudioEnabled || false : false
                        }
                       
                        onValueChange={(txt) => {
                          if(seleAudioData.length==0){
                            selectedTemplet.regions[selectRegionForEdit][
                              "isAudioEnabled"
                            ] = txt;
                            setSelectedTemplet({ ...selectedTemplet });
                        }

                        }}
                      />
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
                        // justifyContent: "center",
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
                      <View
                        style={{
                          paddingHorizontal:20
                        }}
                      >
                        {locationName && <Text style={{color:"red"}}>{JSON.stringify(locationSS[selectRegionForEdit])}</Text>}
                        {selectedTemplet?.regions[selectRegionForEdit].customizCheck&&<View >
                          {locationSS[selectRegionForEdit]?.map((ele,i)=>{
                            return<>
                            <AppText key={i} style={{
                          marginTop: 2,
                          fontSize: moderateScale(14),
                          color: "#000000",
                        }}>{ele.locationName}
                        </AppText>
                            </>
                          })}
                          </View>}
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
        isContinue={campaignType == "advertisement" && true}
        continueText={campaignType == "advertisement" && "Save & Next"}
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
        onChangeLocatioValue={onChangeLocatioValue}
      />
    </View>
  );
};
export default AddCampaign;
