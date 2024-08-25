import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  BackHandler,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal, Portal, Switch } from "react-native-paper";
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
import CampaignRegionLoc from "../../Components/Organisms/CMS/Campaign/CampaignRegionLoc";
import { openAsBlob } from "fs";


function convertToobj(data) {
  const finalOutput = {};
  data.forEach(entry => {
    const regionKey = entry.region.toString();

    if (!finalOutput[regionKey]) {
      finalOutput[regionKey] = {
        campaignRegionId: entry.region,
        locationId: entry.value
      };
    }
  });

  return finalOutput;
}

function getAllLocationNames(data) {
  const locationNames = [];

  data.forEach(region => {
    if (region.locations && Array.isArray(region.locations)) {
      region.locations.forEach(location => {
        if (location.locationName) {
          locationNames.push({"region":region.layoutRegionId,"value":String(location.locationId),"label":String(location.locationName)});
        }
      });
    }
  });

  return locationNames;
}

const LocCampaign = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CommonStyles(themeColor);

  
  
  const [saveModal, setSaveModal] = useState(false);
  const [reglocationArr,setRegLocationArr]=useState([])
  const [LocData,setLocData]=useState([]);
  const [filteredLoc,setFilterLoc]=useState()
  const [selectedLValue,setselectedLValue]=useState({})

 
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
  const [transparency, setTransparency] = useState();
  const [locationName, setLocationName] = useState(null);
  

  const [modal, setModal] = useState();
  const [arrangeModal, setArrangeModal] = useState(false);
  const [selectedBgImg, setSelectedBgImg] = useState("");
  const [selectedTemplet, setSelectedTemplet] = useState({});
  const [orgData,setOrgData]=useState({});
  const [mediaModalType, setMediaModalType] = useState(null);
  const [activateRegion, setActiveRegion] = useState(0);
  const [selectRegionForEdit, setSelectetRegionForEdit] = useState(-1);
  const [campaignType, setCampaignType] = useState(null);
  const [cmpArrangeModal, setCmpArrangeModal] = useState(false);
  const [ratioId, setRatioId] = useState(null);
  const [duration, setDuration] = useState({hh: 0,mm: 0,ss: 0,});
  const [ratioList, setRatioList] = useState([]);

  const [localContent,setLocalContent]=useState([]);
  const [chooseloc,setchooseloc]=useState({})
 
  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );
  
  //For Edit =====================================================
  const { campaignItem } = route.params;
  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("")

  const onComplete = () => {
    setSuccessModal(false);
  };

  
  const getfilterDataByLoc=async(id)=>{
    const storedData = await AsyncStorage.getItem('myObject');
    const parsedData = storedData ? JSON.parse(storedData) : [];
   
    const slugId = await getStorageForKey("slugId");
   
    const ObjOp=convertToobj(reglocationArr)
    const urlEncodedOutput = encodeURIComponent(JSON.stringify(ObjOp))
    
    const endPoint = `service-gateway/cms/${slugId}/content-playlist/${id}?q=${urlEncodedOutput}`;
    const params={};
   // const myselectedDate={...orgData};
    const myselectedDate = { ...orgData, 'regions':parsedData };
    const onSuccess=(response)=>{
      
       function updateRegionDataById(ids, dataArray,result) {
        setIsLoading(true)
        console.log("updateRegionDataById===>",)
        ids.forEach(id => {
          dataArray.forEach((ele,index) => {
            const isEditable=ele.locations.some(location => location.locationId === parseInt(id.value))
            if (isEditable) {
                ele.isEdit = true;
                setIsLoading(false);
               let regData11=[] ; 
              response.result.forEach(loc=>{
                loc.localRegionContentPlaylistContents.forEach((e,i)=>{
                  regData11.push(e.mediaDetail)
                })
              })
              ele.regionData = [...regData11];
            }
            else{
              ele.isEdit = false
            }
          });
        });
        setTimeout(()=>{setIsLoading(false)},2000)
      }
      updateRegionDataById(reglocationArr, myselectedDate.regions,response.result);
      setSelectedTemplet(myselectedDate);
    }

    const onfailure=(error)=>{
      setSelectedTemplet(myselectedDate);
     Alert.alert("Error",error.message)
    }
    
    CampaignStringManagerService.getDatabyLoc(
      {params,endPoint},
      onSuccess,
      onfailure
    );
    
  }

  useEffect(() => {
    getWorkFlow(navigation);
      getMediaDataForCampAdd(setIsLoading);
        // get template data
      getTempleteDataForCampAdd(setIsLoading);

    let {campaignId} = campaignItem;
    btnGetCampaignDetails(campaignId); // it causing rerendering after loction first time 
    console.log("media list change----->",MediaList)
    }, [1]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
     console.log('device back', )
  })
  }, [navigation])

  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);

  useEffect(()=>{
    let {campaignId} = campaignItem;
    getfilterDataByLoc(campaignId);
    },[reglocationArr])

   // React.useEffect(() => {
    //   // makeTemplateDropDownList();
    // }, [templateList]);
  
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
  

  // const getResolutionData = async (setIsLoading = () => {}) => {
  //   const slugId = await getStorageForKey("slugId");
  //   setIsLoading(true);

  //   const successCallBack = async (response) => {
     
  //     if (response?.data && response?.data?.length > 0) {
  //       const modifyData = response?.data;
  //       let resolutionDropdownData = modifyData.map((resolution) => ({
  //         label: `${resolution.aspectRatio} (${resolution.defaultWidthInPixel} x ${resolution.defaultHeightInPixel})`,
  //         value: resolution.aspectRatioId,
  //       }));
       
  //       setRatioList(resolutionDropdownData);
  //     }
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 1000);
  //   };

  //   const errorCallBack = (response) => {
  //     setIsLoading(false);
  //   };

  //   ResolutionManagerService.fetchResolutionList(
  //     { slugId },
  //     successCallBack,
  //     errorCallBack
  //   );
  // };
  // const btnGetMediaById = async (mediaId) => {
  //   const token = await getStorageForKey("authToken");
  //   const slugId = await getStorageForKey("slugId");
  //   const authHeader = {
  //     Authorization: `Bearer ${token}`,
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //   };
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .get(`${baseUrl}service-gateway/cms/${slugId}/v1/media/${mediaId}`, {
  //         headers: authHeader,
  //       })
  //       .then((response) => {
  //         resolve(response?.data);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // };


  const btnSetCamapaignEditValues = async(campaignData) => {
    if (campaignData) {
      // contentId
      let mData = MediaList?.data?.mediaDetails;

      // let regiondata = campaignData?.regions[0]?.globalRegionContentPlaylistContents

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
        region.isEdit=false;
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

      
      if (campaignData?.campaignType?.toLowerCase() == "advertisement") {
        let du = secondsToHMS(campaignData?.totalDurationOfCampaignInSeconds);
        
        let camDu = {
          hh: du.hours,
          mm: du.minutes,
          ss: du.seconds,
        };
        setDuration(camDu);
      }
      setCampaignType(campaignData?.campaignType?.toLowerCase());
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
        audioStartBasedOnCampaignDurationInSeconds: 1,
        audioEndBasedOnCampaignDurationInSeconds: 0,
        audios: campaignData?.audios,
        campaignTags: campaignData?.campaignTags,
        regions: regiondata,
        campaignName: campaignData?.campaignName,
        campaignDescription: campaignData?.campaignName,
      };
       await AsyncStorage.setItem('myObject', JSON.stringify(regiondata)); 

      setSelectedTemplet(postObj);
      setOrgData(postObj)
     
      
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
        // console.log("-fetch loc-------",JSON.stringify(response.data))
        let tempArr=[];
        let locationArr =[{"label": "Global", "region": 0, "value": "0"}]; 
        locationArr.push(...getAllLocationNames(response.data.regions))
        setLocData(locationArr)
       
        setFilterLoc({"label": "Global", "region": 0, "value": "0"})
       
        tempArr=response.data.regions.map((item,)=>{
          let temObj={};
        
          if(item.locations.length>0){
            temObj[item.campaignRegionId]={"campaignRegionId":item.campaignRegionId,"locations":item.locations}
          }
          return temObj;
        });

        btnSetCamapaignEditValues(response.data);
       
        // setSelectedCampaign(response.data);
        // btnSelectedCampaignData(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("getting error",error)
      setIsLoading(false);
      if(error.response.data){
        Alert.alert("Error",error.response.data.message)
      }else{
        Alert.alert("Error","Error in getting of camapign details.")
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
  // get media data
 

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
    console.log("opoopopo",item)
    if (mediaModalType == "image") {
      setSelectedBgImg(item[0]);
    } else if (mediaModalType == "regionMedia") {
      selectedTemplet.regions[activateRegion].contentToDisplay = item[0];

      let locContents=item.map((region,rIndex)=>{
        console.log(region?.mediaDetailId);

        return {
          displayMode: "NORMAL",
          durationInSeconds: region?.defaultDurationInSeconds,
          entryAnimationId: 1,
          exitAnimationId: 1,
          mediaDetailId: region?.mediaDetailId,
          order: rIndex + 1,
          transparencyInPercentage: 1,
          fileExtension:region?.fileExtension,
          type:region?.type,
          mediaName:region?.name,
          image:region.imageUrl?region.imageUrl:"",
          
          height: -1,
          zIndex: -1,
          width: -1,
          topLeftCoordinateXInPixel: -1,
          topLeftCoordinateYInPixel: -1,
        }
      })
      
      setLocalContent(locContents)


      let rData = item.map((region, rIndex) => {
        
        return {
          displayMode: "NORMAL",
          durationInSeconds: region?.defaultDurationInSeconds,
          entryAnimationId: 1,
          exitAnimationId: 1,
          mediaDetailId: region?.mediaDetailId,
          order: rIndex + 1,
          transparencyInPercentage: 1,

          fileExtension:region?.fileExtension,
          type:region?.type,
          mediaName:region?.name,
          image:region.imageUrl?region.imageUrl:"",          

          height: -1,
          zIndex: -1,
          width: -1,
          topLeftCoordinateXInPixel: -1,
          topLeftCoordinateYInPixel: -1,

          // contentId: region?.mediaDetailId,
          // contentVersionId: region?.version,
          
          // mediaVersionId: region?.version,
          // mediaType: region?.type,
        };
      });

      selectedTemplet.regions[activateRegion].regionData = item;
      selectedTemplet.regions[
        activateRegion
      ].globalRegionContentPlaylistContents = rData;
      console.log("xcxzcxcglobalRegionContentPlaylistContents",JSON.stringify(selectedTemplet))
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
    campaignType != "advertisement"
      ? btnAddCampaignData(btnType)
      : btnAddAdvertiseData(btnType);
  };

  const btnSubmitData1 = async (btnType) => {
    if (!campaignType) {
      Alert.alert("Please enter campaign type");
      return false;
    }
    campaignType != "advertisement"
      ? btnAddCampaignData1(btnType)
      : btnAddAdvertiseData(btnType);
  };


  const btnAddCampaignData1 = async (btnType) => {
    setIsLoading(true);
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }
    if (selectedTemplet == null) {
      Alert.alert("Please select a template");
      return false;
    }

    let returntype = true;
    // if (selectedTemplet.regions.length > 0) {
    //   for (let index = 0; index < selectedTemplet.regions.length; index++) {
    //     // if (
    //     //   selectedTemplet?.regions[index]?.regionData &&
    //     //   selectedTemplet?.regions[index]?.regionData?.length <= 0
    //     // ) {
    //     //   Alert.alert(
    //     //     `Please select media for ${selectedTemplet.regions[index].templateRegionName} region`
    //     //   );
    //     //   returntype = false;
    //     //   setIsLoading(false);
    //     //   break;
    //     // }
    //   }
    // }

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

   
    const slugId = await getStorageForKey("slugId");
    const succussCallBack = async (response) => {
     setIsLoading(false);
      if (response.code == 200) {
        if(btnType=="SUBMITTED"){
          console.log("data is saved")
          // Alert.alert("Success","Data is saved successfully",[
          //  {text: 'OK', onPress: () => navigation.goBack()},
          // ])
          // navigation.goBack();
        }
        btnGetCampaignDetails(campaignItem?.campaignId)

        setTimeout(()=>{
         
          setFilterLoc(selectedLValue.value)
          setchooseloc({campaignRegionId:parseInt(selectedLValue.region),locationId:parseInt(selectedLValue.value)})
        },2000)
                         
        function filterByValue( filterValue) {
          const result= LocData.filter(item => item.value === filterValue);
          return result;
        }
        const filteredObjects = filterByValue(selectedLValue.value);
        const queryArr=filteredObjects.map((item)=>{
      
        })
        setRegLocationArr(filteredObjects);
      

        
      } else if (response.code != 200) {
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
        Alert.alert("Error",error?.response?.data?.message);
      } else if (error?.response?.data?.data?.length > 0) {
        Alert.alert("Error1",error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        Alert.alert("Error2",error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    const datforSubmit=[]
    selectedTemplet.regions.forEach((ele,index)=>{
      console.log("localRegionContentPlaylistContents---->",ele.globalRegionContentPlaylistContents)
      if(ele.isEdit){
         datforSubmit.push({
          campaignRegionId: ele.campaignRegionId,
          locationId: String(chooseloc.locationId),
          localRegionContentPlaylistContents:ele.globalRegionContentPlaylistContents
        })
      }
    })
    let params = {
      data:datforSubmit,
      slugId:slugId,
      campaignId: campaignItem?.campaignId,
    };
    console.log("edoit camploc",params);
    
    setIsLoading(true);
    CampaignManagerService.editCmpLoc(
      params,
      succussCallBack,
      failureCallBack
    );
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
    setIsLoading(true);
    if (campaignName.trim().length <= 0) {
      alert("Please enter campaign name");
      return false;
    }
    if (selectedTemplet == null) {
      Alert.alert("Please select a template");
      return false;
    }

    let returntype = true;
    // if (selectedTemplet.regions.length > 0) {
    //   for (let index = 0; index < selectedTemplet.regions.length; index++) {
    //     if (
    //       selectedTemplet?.regions[index]?.regionData &&
    //       selectedTemplet?.regions[index]?.regionData?.length <= 0
    //     ) {
    //       Alert.alert(
    //         `Please select media for ${selectedTemplet.regions[index].templateRegionName} region`
    //       );
    //       returntype = false;
    //       break;
    //     }
    //   }
    // }

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

   
    const slugId = await getStorageForKey("slugId");
    const succussCallBack = async (response) => {
     console.log("sds",JSON.stringify(response))
      setIsLoading(false);
      if (response.code == 200) {
        // btnSubmittedStatus(campaignItem?.campaignId, btnType);
        if(btnType=="SUBMITTED"){
          Alert.alert("Success","Data is saved successfully",[
           {text: 'OK', onPress: () => navigation.goBack()},
          ])
          // navigation.goBack();
        }
        console.log("---->","Data is saved successfully")
        btnGetCampaignDetails(campaignItem?.campaignId)
      } else if (response.code != 200) {
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
        Alert.alert("Error",error?.response?.data?.message);
      } else if (error?.response?.data?.data?.length > 0) {
        Alert.alert("Error1",error?.response?.data?.data[0].message);
      } else if (error?.data?.length > 0) {
        Alert.alert("Error2",error?.data[0]?.message);
      } else {
        alert(error?.message);
      }
      setIsLoading(false);
    };
    const datforSubmit=[]
    selectedTemplet.regions.forEach((ele,index)=>{
      if(ele.isEdit){
         datforSubmit.push({
          campaignRegionId: ele.campaignRegionId,
          locationId: String(chooseloc.locationId),
          localRegionContentPlaylistContents:ele.globalRegionContentPlaylistContents
        })
      }
    })
    let params = {
      data:datforSubmit,
      slugId:slugId,
      campaignId: campaignItem?.campaignId,
    };
    console.log("edoit camploc",datforSubmit.length,JSON.stringify(datforSubmit));
    
    setIsLoading(true);
    CampaignManagerService.editCmpLoc(
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
    selectedTemplet.regions[index].globalRegionContentPlaylistContents=[];
    console.log("selectedTemplet-- remove data---> ",selectedTemplet.regions[index]);
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

  

  const [locationModal, setLocationModal] = useState(false);
  const [locationSelected, setLocationSelected] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  // const onChangeLocatioValue = (lData) => {
  //   selectedTemplet.regions[selectRegionForEdit]["locationIds"] = lData;
  //   setSelectedTemplet({ ...selectedTemplet });
  // };
  const onChangeLocatioValue = (lData, ljsonData) => {
    selectedTemplet.regions[selectRegionForEdit]["locationIds"] = lData;
    setSelectedTemplet({ ...selectedTemplet });
    setLocationName(ljsonData?.locationName);
    
  };

  const customization = function () {
    if (!selectedTemplet.regions[selectRegionForEdit]["customizCheck"]) {
      setSelectedLocations([]);
      setLocationModal(true);
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = true;
      setSelectedTemplet({ ...selectedTemplet });
    } else {
      selectedTemplet.regions[selectRegionForEdit]["locationIds"] = [];
      selectedTemplet.regions[selectRegionForEdit]["customizCheck"] = false;
      setSelectedTemplet({ ...selectedTemplet });
    }
  };


  const noclick = (e) =>
  {
    setIsLoading(true);
      setFilterLoc(e.value)
      setchooseloc({campaignRegionId:parseInt(e.region),locationId:parseInt(e.value)})
 
    function filterByValue( filterValue) {
      const result= LocData.filter(item => item.value === filterValue);
      return result;
    }
    const filteredObjects = filterByValue(e.value);
    setRegLocationArr(filteredObjects);
    setTimeout(()=>{setIsLoading(false);},2000)
  }

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <Loader visible={isLoading} />
      <Portal>
      <Modal
        visible={saveModal}
        onDismiss={() => onComplete()}
        style={{
          flex: 1,
          paddingHorizontal:16
        }}>
        <View style={{height: '50%',
        borderRadius:20,
        backgroundColor:"white",
        padding: moderateScale(20),
      }}>
          <View style={Styles.modalView}>
            <AppText style={{color:"black",fontSize:moderateScale(18)}}>
              Are you sure you want to save media?
            </AppText>
          </View>
          <View style={{justifyContent:"flex-end",flexDirection:'row',columnGap:16,marginTop:40}}>
            <TouchableOpacity style={{
              borderColor:'red',
              borderWidth:1,
              paddingHorizontal:16,
              paddingVertical:10,
              borderRadius:10
              }}
              onPress={()=>{
                console.log("data----->")
                noclick(selectedLValue);
                setSaveModal(false);
              }}
              >
              <AppText style={{color:"red",fontSize:moderateScale(14)}}>
                Cancel
              </AppText> 
            </TouchableOpacity>
            <TouchableOpacity style={{
              backgroundColor:themeColor.themeColor,
              borderWidth:1,
              paddingHorizontal:16,
              paddingVertical:10,
              borderRadius:10
              }}
              onPress={()=>{
                console.log("data----->")
                setSaveModal(false);
                btnSubmitData1("SUBMITTED");
              }}
              >
              <AppText style={{color:"white",fontSize:moderateScale(14)}}>
                Save
              </AppText> 
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Portal>
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
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
              title="Campaign Location"
              onClickIcon={() => navigation.goBack()}
            />
          </View>
          <Separator />
          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              Campaign Details {"("}{campaignName}{")"}
            </AppText>
            <Separator />
            <View style={Styles.bodyRowsContainer}>
              {campaignType?.toLowerCase() != "advertisement" && (
                <>
                  <AppText style={Styles.labeltext}>Location</AppText>
                  <CampaignDropDown
                    dataList={LocData}
                    placeHolderText="Select Location"
                    onChange={(e) => {
                    
                     if(typeof(filteredLoc)=="object"){
                      if(filteredLoc.label=="Global"){
                        noclick(e)
                      }
                      }
                      else{
                        setselectedLValue(e);
                        setSaveModal(true);
                      }
                     
                    }}
                    value={filteredLoc}
                  />
                </>
              )}
            </View>
            {campaignType?.toLowerCase() != "advertisement" && (
              <>
                {/*Region===============================regions====== */}
                <AppText style={Styles.labeltext}>All Media </AppText>
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
                        opacity: !selectedBgImg ? 1 :  1-transparency ,
                      }}
                      source={
                        selectedBgImg ? { uri: selectedBgImg.imageUrl } : null
                      }
                    >
                      <CampaignRegionLoc
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
                    
                    <Text style={{ color: "#000000", fontSize: 14, marginTop: 15 }}>
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
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </ScrollView>

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
      {/* <SelectLocationModalForCampaign
        visible={locationModal}
        setModal={setLocationModal}
        setIsLoading={setIsLoading}
        locationSelected={locationSelected}
        setLocationSelected={setLocationSelected}
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        locationData1={locationData1}
        onChangeLocatioValue={onChangeLocatioValue}
      /> */}
    </View>
  );
};
export default LocCampaign;
