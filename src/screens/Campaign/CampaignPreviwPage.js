import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import { baseUrl } from "../../Services/AxiosService/axios";
import axios from "axios";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import Loader from "../../Components/Organisms/CMS/Loader";
import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import CmpDetailMediaApproval from "./CampaignDetailMedia"
import Slider from "@react-native-community/slider";
import AppText from "../../Components/Atoms/CustomText";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import Entypo from "react-native-vector-icons/Entypo";
import UpArrow from "../../Assets/Images/PNG/up_arr.png";
import play from "../../Assets/Images/PNG/play-button.png";
import pause from "../../Assets/Images/PNG/video-pause-button.png";
import CampaignPrewiewActions from "../../Components/Organisms/CMS/Campaign/CampaignPrewiewActions";
import { useDispatch, useSelector } from "react-redux";
import TrackPlayer, {AppKilledPlaybackBehavior,
  Capability,State,
  usePlaybackState,
  RepeatMode,} from 'react-native-track-player';
import { opacity } from "react-native-reanimated";
import CmpDetailMedia from "./CmpDetailMedia";

//setup tack player


// export { startAudio };

export default function CampaignPreviwPage({ navigation, route }) {
  const setupPlayer=async()=> {
    let isSetup = false;
    try {
      await TrackPlayer.getCurrentTrack();
      isSetup = true;
    }
    catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
        ],
        progressUpdateEventInterval: 2,
      });
  
      isSetup = true;
    }
    finally {
      return isSetup;
    }
  }
  
  // Function to start playing the audio
  const startAudio = async (songurl) => {
    // Add your audio track details here (url, title, artist, etc.)
    const track = {
      id: '1',
      url:songurl ,
      title: 'Audio Title',
      artist: 'Audio Artist',
      // ... other track details
    };
    const isSetup=await setupPlayer()
    // Check if the track is already in the queue, and add it if not
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (!currentTrack || currentTrack.id !== track.id&&isSetup) {
      // console.log("If the track is already in the queue, just play it================>",isSetup,songurl)
      await TrackPlayer.reset();
      await TrackPlayer.add([track]);
      await TrackPlayer.play();
    } else {
      // If the track is already in the queue, just play it
      await TrackPlayer.play();
    }
  };

  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  let camapignsData = route?.params?.campaigns;
  let viewDetails = route?.params?.viewDetails;
  const [selectedCampaignId, setselectedCampaignId] = useState(
    camapignsData[0]?.campaignId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [audios,setaudios]=useState(null)
  const [campaignData, setcampaignData] = useState([]);
  const [campaignName, setCampaignName] = useState("");

  const [campaignRegions, setCampaignRegions] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState({
    transparencyInPercentage: 0,
    url: "",
    name: "",
  });
  const [audioCampaignDurationInSec, setAudioCampaignDurationInSec] = useState({
    audioStartBasedOnCampaignDurationInSeconds: 0,
    audioEndBasedOnCampaignDurationInSeconds: 0,
  });
  const [
    totalDurationOfCampaignInSeconds,
    setTotalDurationOfCampaignInSeconds,
  ] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [BGColor, setBGColor] = useState("");
  const [mediaAudios, setMediaAudios] = useState(null);
  const [resetPreviewAgain, setResetPreviewAgain] = useState(0);
  const workFlow = useSelector((state) => state.userReducer.workFlow);

  const onBack= async()=>{
    navigation.goBack();
    await TrackPlayer.reset();
  }
  useEffect(() => {
    getCamapaignDetails(selectedCampaignId);
    
  }, [selectedCampaignId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      // if(type=='AUDIO'||type=="VIDEO"||type.toLowerCase()=='audio'||type.toLowerCase()=="video"){
      console.log("backHand          lerbackHandl          erbackHandler")
      onBack();

  })
    
  }, [navigation])

  const getCamapaignDetails = async (selectedCampaignId) => {
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: selectedCampaignId,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      formateCamapign(response);
      // 
      if (response?.data) {
        console.log("getCamapaignDetails success", response);
        if(response.data.audios!=null){
          setaudios([...response.data.audios])
        }
      }
    };

    const failureCallBack = (error) => {
      console.log("", error);
      setIsLoading(false);
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

  const formateCamapign = async (res) => {
    if (res && res?.data) {
      setIsLoading(true);
      const campaignDetailsData = res?.data;
      if (
        campaignDetailsData &&
        campaignDetailsData?.regions &&
        campaignDetailsData?.regions?.length > 0
      ) {
        for (const r of campaignDetailsData.regions) {
          if (
            r.globalRegionContentPlaylistContents &&
            r?.globalRegionContentPlaylistContents &&
            r?.globalRegionContentPlaylistContents?.length > 0
          ) {
            for await (const rg of r.globalRegionContentPlaylistContents) {
              await btnGetMediaById(rg.mediaDetailId).then((res) => {
                if (res?.status === "OK") {
                  if (
                    res?.data &&
                    res?.data?.mediaDetails &&
                    res.data.mediaDetails.length > 0
                  ) {
                    rg.mediaName = res.data.mediaDetails[0]?.name;
                  }
                }
              });
            }
          }
        }
      }
     
      const apiResp = res.data;
      console.log("apiResp.backgroundImageContentId",apiResp.backgroundImageContentId)
      setCampaignName(apiResp.campaignName);

      let respData = [];
      if (apiResp.regions && apiResp.regions.length > 0) {
        for (const iterator of apiResp.regions) {
          if (
            iterator.globalRegionContentPlaylistContents &&
            iterator.globalRegionContentPlaylistContents.length > 0
          ) {
            for await (const i of iterator.globalRegionContentPlaylistContents) {
              let mediaDetailURL = "NA";

              await btnGetMediaById(i.mediaDetailId).then((res) => {
                if (res?.status === "OK") {
                  if (
                    res?.data &&
                    res?.data?.mediaDetails &&
                    res.data.mediaDetails.length > 0
                  ) {
                    mediaDetailURL = res.data.mediaDetails[0]?.mediaUrl;
                  }
                }
              });

              const index = respData.findIndex(
                (v) => v.campaignRegionId === iterator.campaignRegionId
              );

              if (index === -1) {
                respData.push({
                  campaignRegionId: iterator.campaignRegionId,
                  campaignRegionName: iterator.campaignRegionName,
                  isAudioEnabled: iterator.isAudioEnabled,
                  heightInPercentage: iterator?.heightInPercentage,
                  widthInPercentage: iterator?.widthInPercentage,
                  topLeftCoordinateYInPercentage:
                    iterator?.topLeftCoordinateYInPercentage,
                  topLeftCoordinateXInPercentage:
                    iterator?.topLeftCoordinateXInPercentage,
                  contentToDisplay: iterator.contentToDisplay,
                  transparencyInPercentage:
                  iterator.regionTransparencyInPercentage,
                  mediaArr: [
                    {
                      mediaDetailId: i.mediaDetailId,
                      mediaType: i.mediaType,
                      order: i.order,
                      durationInSeconds: i.durationInSeconds,
                      url: mediaDetailURL,
                      displayMode: i.displayMode,
                      name: i.name,
                    },
                  ],
                });
              } else {
                if (
                  respData[index] &&
                  respData[index] !== null &&
                  respData[index] !== undefined
                ) {
                  (respData[index]?.mediaArr).push({
                    mediaDetailId: i.mediaDetailId,
                    mediaType: i.mediaType,
                    order: i.order,
                    durationInSeconds: i.durationInSeconds,
                    url: mediaDetailURL,
                    displayMode: i.displayMode,
                  });
                }
              }
            }
          }
        }
      }

       
      setTimeout(() => {
        setIsLoading(false)
        setcampaignData([res.data]);
        setCampaignRegions(respData);
      }, 200);

      if (
        apiResp.backgroundImageContentId &&
        apiResp.backgroundImageContentId > 0
      ) {
        let mediaURL = "NA";
        let mediaName = "NA";
        await btnGetMediaById(apiResp.backgroundImageContentId).then((res) => {
          if (res?.status === "OK") {
            if (
              res?.data &&
              res?.data?.mediaDetails &&
              res.data.mediaDetails.length > 0
            ) {
              mediaName = res.data.mediaDetails[0]?.name;
              mediaURL = res.data.mediaDetails[0]?.mediaUrl;
            }
          }
        });

        console.log('bg ==image url',mediaURL);
        console.log('bg ==image transparencyInPercentage',apiResp.transparencyInPercentage)
        console.log('bg ==image name',mediaName)
        setBackgroundImage({
          url: mediaURL,
          transparencyInPercentage: apiResp.transparencyInPercentage,
          name: mediaName,
        });
      }

      if (
        apiResp.audioStartBasedOnCampaignDurationInSeconds &&
        apiResp.audioEndBasedOnCampaignDurationInSeconds
      ) {
        setAudioCampaignDurationInSec({
          audioStartBasedOnCampaignDurationInSeconds:
            apiResp.audioStartBasedOnCampaignDurationInSeconds,
          audioEndBasedOnCampaignDurationInSeconds:
            apiResp.audioEndBasedOnCampaignDurationInSeconds,
        });
      }
      if (apiResp.totalDurationOfCampaignInSeconds) {
        setTotalDurationOfCampaignInSeconds(
          apiResp.totalDurationOfCampaignInSeconds
        );
      }

      let audiosArr = null;
      if (apiResp.audios && apiResp.audios.length > 0) {
        var i=0
        
        const playSongWithInterval= async(arr, index)=> {
          // Check if index is within the array bounds
          if (index < arr.length) {
            console.log("-----------------------------",arr[index]);
            console.log("apiResp.audios",apiResp.audios,arr[index].order);
            let audioURL = "NA";
            await btnGetMediaById(arr[index].contentId).then((res) => {
              console.log("btnGetMediaById(a.contentId)============>",JSON.stringify(res.data.mediaDetails[0].name));
              startAudio(res.data.mediaDetails[0].audioUrl)
              if (res?.status === "OK") {
                if (
                  res?.data &&
                  res?.data?.mediaDetails &&
                  res.data.mediaDetails.length > 0
                ) {
                  audioURL = res.data.mediaDetails[0]?.audioURL;
                  startAudio(res.data.mediaDetails[0].audioUrl)
                }
              }
            });
            audiosArr = {
              audioURL,
              contentId: arr[index].contentId,
              order: arr[index].order,
            };
            index++;
            setTimeout(function () {
              playSongWithInterval(arr, index);
            }, 30*1000); 
          }
        }
        const myArray = ["Element 1", "Element 2", "Element 3", "Element 4"];
        playSongWithInterval(apiResp.audios, 0);

        // for await (const a of apiResp.audios) {
        //   console.log("apiResp.audios",apiResp.audios,a.order);
        //   let audioURL = "NA";
        //   await btnGetMediaById(a.contentId).then((res) => {
        //     // console.log("btnGetMediaById(a.contentId)============>",JSON.stringify(res.data.mediaDetails[0].audioUrl));
        //     startAudio(res.data.mediaDetails[0].audioUrl)
        //     if (res?.status === "OK") {
        //       if (
        //         res?.data &&
        //         res?.data?.mediaDetails &&
        //         res.data.mediaDetails.length > 0
        //       ) {
        //         audioURL = res.data.mediaDetails[0]?.audioURL;
        //         startAudio(res.data.mediaDetails[0].audioUrl)
        //       }
        //     }
        //   });
        //   audiosArr = {
        //     audioURL,
        //     contentId: a.contentId,
        //     order: a.order,
        //   };
        // }
      }
      setMediaAudios(audiosArr);
      setBGColor(apiResp?.backgroundColor ? apiResp.backgroundColor : "");

      
      setIsLoading(false);
    }
  };

  const RegionListHeaders = [
    "Region Name",
    "Offset",
    "Duration (in seconds)",
    "Restricted Location",
    "Audio(on/off)",
  ];

  const RegionRenderCampaignHeader = () => {
    return (
      <View
        style={{
          width: moderateScale(width * 3),
          height: 100,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {RegionListHeaders.map((item, index) => (
          <View
            key={item + index}
            style={[Styles.headerScrollContainer1(index)]}
          >
            <View style={Styles.headerThemeContainer}>
              <AppText style={Styles.listBoldText}>{item}</AppText>
            </View>
          </View>
        ))}
      </View>
    );
  };
  const [selectedCampaignDrop, setSelectedCampaignDrop] = useState("");

  const RCampaignChildList = ({ data }) => {
    
    return (
      <>
        {data?.map((mdata) => {
          return (
            <View style={Styles.renderContainer1}>
              <View style={[Styles.nameView, { width: "20%" }]}>
                <Entypo
                  name="image-inverted"
                  size={20}
                  color={themeColor.themeColor}
                />
                <AppText style={[Styles.nameText]}>{mdata?.mediaName}</AppText>
              </View>
              <View style={[Styles.nameView, { width: "20%" }]}>
                <AppText style={Styles.nameText}></AppText>
              </View>
              <View style={[Styles.nameView, { width: "20%" }]}>
                <AppText style={Styles.nameText}>
                  {mdata?.durationInSeconds?.toString()}
                </AppText>
              </View>
              <View style={[Styles.nameView, { width: "20%" }]}>
                <AppText style={Styles.nameText}> </AppText>
              </View>
              <View style={[Styles.nameView, { width: "20%" }]}>
                <AppText style={Styles.nameText}> </AppText>
              </View>
            </View>
          );
        })}
      </>
    );
  };
  const RegionrenderCampaignList = ({ item, index }) => {
   
    const totalDuration = item?.globalRegionContentPlaylistContents?.reduce(
      (acc, a) => acc + parseInt(a.durationInSeconds),
      0
    );
    return (
      <>
        <View style={Styles.renderContainer1}>
          <View style={[Styles.nameView, { width: "20%" }]}>
            <Pressable
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
              onPress={() => {
                if (selectedCampaignDrop === item.campaignRegionName) {
                  setSelectedCampaignDrop("");
                } else {
                  setSelectedCampaignDrop(item.campaignRegionName);
                }
              }}
            >
              <AppText style={Styles.nameText}>
                {item.campaignRegionName}
              </AppText>
              <Image
                source={
                  selectedCampaignDrop === item.campaignRegionName
                    ? DownArr
                    : UpArrow
                }
                style={Styles.downStyles}
              />
            </Pressable>
          </View>
          <View style={[Styles.nameView, { width: "20%" }]}>
            <AppText style={Styles.nameText}>
              {`L:${item?.topLeftCoordinateXInPixel} | T:${item?.topLeftCoordinateYInPixel} | W:${item.widthInPixel} | H:${item.heightInPixel}`}
            </AppText>
          </View>
          <View style={[Styles.nameView, { width: "20%" }]}>
            <AppText style={Styles.nameText}>{totalDuration}</AppText>
          </View>
          <View style={[Styles.nameView, { width: "20%" }]}>
            <AppText style={Styles.nameText}>{"No"}</AppText>
          </View>
          <View style={[Styles.nameView, { width: "20%" }]}>
            <AppText style={Styles.nameText}>
              {item?.isAudioEnabled ? "Enable" : "Disable"}
            </AppText>
          </View>
        </View>
        {selectedCampaignDrop === item.campaignRegionName ? (
          <RCampaignChildList data={item.globalRegionContentPlaylistContents} />
        ) : null}
      </>
    );
  };

  const ListHeaders = [
    "Background Image",
    "Background Color",
    "Transparency",
    "Tags",
  ];
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
  const renderCampaignList = ({ item, index }) => {
    let campaignTags1 = "--";
    if (item?.campaignTags != "--" && item?.campaignTags.length > 0) {
      campaignTags1 = item?.campaignTags
        .map(function (val) {
          return val.campaignTag;
        })
        .join(",");
    }
    return (
      <View style={Styles.renderContainer}>
        <View style={[Styles.nameView, { width: "25%" }]}>
          {
            backgroundImage?.url && <Image source={{uri:backgroundImage?.url}} style={{width:80,height:50}}/>
          }
        </View>
        <View style={[Styles.nameView, { width: "25%" }]}>
          <View
            style={{
              height: 29,
              width: 70,
              backgroundColor: item?.backgroundColor || "#000",
            }}
          />
        </View>
        <View style={[Styles.nameView, { width: "25%" }]}>
          <AppText style={Styles.nameText}>
            {item?.transparencyInPercentage?.toString()}
          </AppText>
        </View>
        <View style={[Styles.nameView, { width: "25%" }]}>
          <AppText style={Styles.nameText}>{campaignTags1}</AppText>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, paddingBottom: 20 }}
      contentContainerStyle={{ paddingBottom: 40 }}
      
    >
      <View style={Styles.fullFlex}>
        <Loader visible={isLoading} />
        <ClockHeader />
        <View style={Styles.headerContainer}>
          <CreateNewHeader
            title={"Campaign"}
            onClickIcon={async() => {
              onBack()
              
            }}
          />
          <ThemedButton
            onClick={() => {
              setCampaignRegions([])
              setcampaignData([])
              setBackgroundImage({
                transparencyInPercentage: 0,
                url: "",
                name: "",
              })
              getCamapaignDetails(selectedCampaignId);
              setSliderValue(0)
              setResetPreviewAgain(prev => prev + 1)
            }}
            title={"Preview Again"}
            containerStyle={{ width: "40%" }}
          />
        </View>
        {!viewDetails &&
          campaignData.length > 0 &&
          campaignData[0]?.canApprove &&
          workFlow &&
          campaignData[0]?.state?.toLowerCase() == "pending for approval" &&
          (workFlow.approverWorkFlow === "CAMPAIGN" ||
            workFlow.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN") && (
            <CampaignPrewiewActions
              campaignItem={campaignData[0]}
              navigation={navigation}
              setIsLoading={setIsLoading}
            />
          )}

        {!viewDetails && campaignData.length > 0 && (
          <ScrollView
            horizontal
            contentContainerStyle={{ marginBottom: 20 }}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            style={{}}
          >
            <FlatList
              data={campaignData}
              renderItem={renderCampaignList}
              ListHeaderComponent={renderCampaignHeader}
            />
          </ScrollView>
        )}
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
              backgroundColor: BGColor ? BGColor : "#0000",
              // opacity: backgroundImage?.url != "" ? 1-parseFloat(backgroundImage?.transparencyInPercentage) : 0,
            }}
            source={
              backgroundImage?.url != "" ? { uri: backgroundImage.url } : null
            }
          > 
          
            {campaignRegions != null &&
              campaignRegions?.map((item, index) => {
                
                let tp = 1;
                if(item?.transparencyInPercentage){
                  tp=1-item?.transparencyInPercentage;
                }
                console.log("tptptptptptp", backgroundImage);
                // {console.log("mediaArra11122233333----", item.mediaArra)}
                backgroundImage?.url != "" ? console.log('bgbgbgbgbg',1-parseFloat(backgroundImage?.transparencyInPercentage)) : 1
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    key={"campaign" + index}
                    style={Styles.regionContainer(item,tp)}
                  >
                    <CmpDetailMediaApproval
                      sliderValue={sliderValue}
                      audioCampaignDurationInSec={audioCampaignDurationInSec}
                      transparencyInPercentage={item.transparencyInPercentage}
                      totalDurationOfCampaignInSeconds={
                        totalDurationOfCampaignInSeconds
                      }
                      startFrom={15}
                      mediaArray={item.mediaArr}
                      resetPreviewAgain={resetPreviewAgain}
                      isAudioEnabled={item.isAudioEnabled}
                      mediaAudios={mediaAudios}
                    />
                  </TouchableOpacity>
                );
              })}
          </ImageBackground>
        </View>
        

        {totalDurationOfCampaignInSeconds != 0 && (
          <>
            <Slider
              style={{
                width: width * 0.98,
                height: 40,
                marginLeft: -7,
                marginTop: 20,
              }}
              minimumValue={0}
              maximumValue={totalDurationOfCampaignInSeconds}
              value={sliderValue}
              onValueChange={(value) => {
                setSliderValue(value);
              }}
              thumbTintColor="#21B4E4"
              minimumTrackTintColor="#223577"
              maximumTrackTintColor="#000000"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
                <Text style={{ color: "#fff" }}>{parseInt(sliderValue)}</Text>
              </View>
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
                <Text style={{ color: "#fff" }}>
                  {totalDurationOfCampaignInSeconds}
                </Text>
              </View>
            </View>
          </>
        )}

        {!viewDetails &&
          campaignData.length > 0 &&
          campaignData[0]?.regions && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              style={{}}
            >
              <FlatList
                data={campaignData[0]?.regions}
                renderItem={RegionrenderCampaignList}
                ListHeaderComponent={RegionRenderCampaignHeader}
              />
            </ScrollView>
          )}
      </View>
    </ScrollView>
  );
}

const CampaignStyles = (COLORS) =>
StyleSheet.create({
  regionContainer: (item,tp) => ({
    height: `${item.heightInPercentage}%`,
    width: `${item.widthInPercentage}%`,
    borderWidth: 1,
    borderStyle: "dashed",
    position: "absolute",
    zIndex:999,
    opacity:tp,
    top: `${item.topLeftCoordinateYInPercentage}%`,
    left: `${item.topLeftCoordinateXInPercentage}%`,
    justifyContent: item.contentToDisplay ? "flex-end" : "center",
  }),
  downStyles: {
    height: moderateScale(7),
    width: moderateScale(11),
    resizeMode: "contain",
    tintColor: COLORS.themeColor,
    marginLeft: 6,
  },
  headerScrollContainer: (index) => ({
    justifyContent: "center",
    width: index === 0 ? "25%" : "25%",
    backgroundColor: COLORS.themeLight,
  }),
  headerScrollContainer1: (index) => ({
    justifyContent: "center",
    width: index === 0 ? "20%" : "20%",
    backgroundColor: COLORS.themeLight,
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
  headerThemeContainer: {
    backgroundColor: COLORS.themeLight,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    marginVertical: moderateScale(5),
    height: moderateScale(50),
  },
  listBoldText: {
    fontSize: moderateScale(16),
    color: COLORS.textColor,
    marginHorizontal: moderateScale(15),
    fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
  },
  renderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    margin: moderateScale(0.5),
    backgroundColor: COLORS.shadow,
  },
  renderContainer1: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: moderateScale(width * 3),
    margin: moderateScale(0.5),
    backgroundColor: COLORS.shadow,
  },
  nameView: {
    width: "40%",
    backgroundColor: COLORS.white,
    justifyContent: "center",
    paddingHorizontal: moderateScale(15),
    paddingVertical: moderateScale(10),
    marginEnd: moderateScale(0.5),
  },
  nameText: {
    color: COLORS.textColor,
    fontSize: moderateScale(14),
    fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
  },
  actionView: {
    backgroundColor: "white",
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
