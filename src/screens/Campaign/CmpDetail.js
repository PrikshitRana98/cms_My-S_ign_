import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ClockHeader from "../../Components/Atoms/ClockHeaders";

import { useSelector } from "react-redux";
import Loader from "../../Components/Organisms/CMS/Loader";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { moderateScale, width } from "../../Helper/scaling";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import play from "../../Assets/Images/PNG/play-button.png";
import pause from "../../Assets/Images/PNG/video-pause-button.png";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";

import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import Pdf from "react-native-pdf";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import CmpDetailMedia from "./CmpDetailMedia";
import { CampaignManagerService } from "./CompainApi";
import { baseUrl } from "../../Services/AxiosService/axios";
import axios from "axios";
import WebView from "react-native-webview";
import { ImageBackground } from "react-native";

const CmpDetail = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignRegions, setSelectedCampaignRegions] = useState(null);
  const [mediaData, setMediaData] = useState(null);
  const [backgroundImageContentId,setbackgroundImageContentId]=useState('')
  const [bgImage,setBgImage]=useState({})
  const [bgColor,setBgColor]=useState('')

  const [totalDuration, setTotalDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const { campaignItem } = route.params;

  useEffect(() => {
    if (campaignItem?.campaignId) {
      btnGetCampaignDetails(campaignItem?.campaignId);
    }
  }, [campaignItem]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
      console.log('device back')
  })
  }, [navigation])

  useEffect(() => {
    getMediaDataForCampAdd(setIsLoading);
  }, []);
  useEffect(() => {
    if (selectedCampaign != null && mediaData != null) {
      btnSelectedCampaignData();
    }
  }, [mediaData, selectedCampaign]);

  const getMediaDataForCampAdd = async (setIsLoading = () => {}) => {
    const slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const successCallBack = async (response) => {
      setMediaData(response);
      setIsLoading(false);
    };
    const errorCallBack = (response) => {
      console.log("errorCallBack responseError", response);
      setIsLoading(false);
    };

    CampaignManagerService.fetchMediaList(
      { slugId },
      successCallBack,
      errorCallBack
    );
  };

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
        console.log("backgroundImageContentId111",response.data.backgroundImageContentId)
        setbackgroundImageContentId(response.data.backgroundImageContentId)
        setTotalDuration(response?.data?.totalDurationOfCampaignInSeconds);
        setSelectedCampaign(response.data);
        setBgColor(response.data.backgroundColor)
        console.log("bgcolor",response.data.backgroundColor)
        await btnGetMediaById(response.data.backgroundImageContentId)
            .then((res) => {
              if (res.status === "OK") {
                setBgImage(res.data.mediaDetails[0])
                console.log("bgimge",res.data.mediaDetails[0]);
              } else {
                console.log({ nodata: "no" });
              }
            })
            .catch(() => {
              console.log({ nodata: "no" });
            });
      }
    };

    const failureCallBack = (error) => {
      setIsLoading(false);
      // console.log("deleteCampaignString", error);
    };

    CampaignStringManagerService.fetchCampaignDetails(
      params,
      succussCallBack,
      failureCallBack
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
        .get(`${baseUrl}content-management/cms/${slugId}/v1/media/${mediaId}`, {
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

  const btnSelectedCampaignData = () => {
    let media = mediaData?.data?.mediaDetails;
    let mRegions = selectedCampaign.regions;

    setIsLoading(true);

    let resgion = mRegions.map((item, index) => {
      let mediaForRegion = media.find(
        (mItem) =>
          mItem.mediaDetailId ==
          item.globalRegionContentPlaylistContents[0]?.mediaDetailId
      );
      let playerDataArr = item.globalRegionContentPlaylistContents;
      let mediaArr1 = [];
      if (playerDataArr.length > 0) {
        playerDataArr.map(async (pData) => {
          await btnGetMediaById(pData.mediaDetailId)
            .then((res) => {
              if (res.status === "OK") {
                mediaArr1.push(res.data.mediaDetails[0]);
              } else {
                mediaArr1.push({ nodata: "no" });
              }
            })
            .catch(() => {
              mediaArr1.push({ nodata: "no" });
            });
        });
      }
      return { ...item, mediaForRegion: mediaForRegion, mediaArra: mediaArr1 };
    });

    setTimeout(() => {
      setSelectedCampaignRegions([...resgion]);
      setIsLoading(false);
    }, 10000);
  };
  

  return (
    <View style={Styles.fullFlex}>
      <Loader visible={isLoading} />
      <ClockHeader />
      <View style={Styles.headerContainer}>
        <CreateNewHeader
          title={selectedCampaign?.layoutDescription || "Campaign"}
          onClickIcon={() => navigation.goBack()}
        />
        <ThemedButton
          onClick={()=>{
            if (campaignItem?.campaignId) {
              btnGetCampaignDetails(campaignItem?.campaignId);
              setSliderValue(0);
            }
          }}
          title={'Preview Again'}
          containerStyle={{width: '40%'}}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[Styles.mainContainer, { width: "100%" }]}>
          {selectedCampaign && (
            <View
              style={{
                height: 400,
                width: "97%",
                borderRadius: 2,
                borderWidth: 1,
                margin: moderateScale(5),
              }}
            >
              <ImageBackground
              imageStyle={{
                borderRadius: 5,
                height: "100%",
                width: "100%",
                position: "relative",
                backgroundColor: bgColor?bgColor:"white",
                // opacity: ,
              }}
              source={bgImage.imageUrl!=null?{uri:bgImage.imageUrl}:null}
              >
              {selectedCampaign != null &&
                selectedCampaignRegions?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={"campaign" + index}
                      style={Styles.regionContainer(item)}
                    >
                      {console.log("mediaArra----1234567",index, item.mediaArra)}
                      <CmpDetailMedia sliderValue={parseInt(sliderValue)} mediaArr={item.mediaArra} isMute={item.isAudioEnabled} />
                    </TouchableOpacity>
                  );
                })}
              </ImageBackground>
            </View>
          )}
          {totalDuration != 0 && (
           <>
            <Slider
              style={{
                width:width*0.98,
                height: 40,
                marginLeft: -7,
                marginTop: 20,
              }}
              minimumValue={0}
              maximumValue={totalDuration}
              value={sliderValue}
              onValueChange={(value) => {
                setSliderValue(value); 
              }}
              thumbTintColor="#21B4E4"
              minimumTrackTintColor="#223577"
              maximumTrackTintColor="#000000"
            />
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{width:45,height:45,backgroundColor:'#0056a8',justifyContent:'center',alignItems:'center',borderRadius:25}}>
                <Text style={{color:'#fff'}}>{parseInt(sliderValue)}</Text>
              </View>
              <View style={{width:45,height:45,backgroundColor:'#0056a8',justifyContent:'center',alignItems:'center',borderRadius:25}}>
                <Text style={{color:'#fff'}}>{totalDuration}</Text>
              </View>
            </View>
           </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CmpDetail;

const CampaignStyles = (COLORS) =>
  StyleSheet.create({
    regionContainer: (item) => ({
      height: `${item.heightInPercentage}%`,
      width: `${item.widthInPercentage}%`,
      borderWidth: 1,
      borderStyle: "dashed",
      position: "absolute",
      top: `${item.topLeftCoordinateYInPercentage}%`,
      left: `${item.topLeftCoordinateXInPercentage}%`,
      justifyContent: item.contentToDisplay ? "flex-end" : "center",
    }),
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fullFlex: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
      alignSelf: "baseline",
    },
    totalRecords: {
      margin: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
    },
    campaignContainer: (active) => ({
      width: "100%",
      height: moderateScale(120),
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(2),
      borderColor: active ? COLORS.themeColor : "#0000000F",
      backgroundColor: COLORS.placeHolder,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    }),
  });
