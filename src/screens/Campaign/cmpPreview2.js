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
  Dimensions,
  Pressable,
  BackHandler,
  AppState,
  DeviceEventEmitter,
} from "react-native";
import {
  getStorageForKey,
  removeKeyInStorage,
  setStorageForKey,
} from "../../Services/Storage/asyncStorage";
import React, { useEffect, useState } from "react";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import { baseUrl } from "../../Services/AxiosService/axios";
import axios, { all } from "axios";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import Loader from "../../Components/Organisms/CMS/Loader";
import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import CmpDetailMediaApproval from "./CampaignDetailMedia";
import Slider from "@react-native-community/slider";
import AppText from "../../Components/Atoms/CustomText";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import Entypo from "react-native-vector-icons/Entypo";
import UpArrow from "../../Assets/Images/PNG/up_arr.png";
import play from "../../Assets/Images/PNG/play-button.png";
import pause from "../../Assets/Images/PNG/video-pause-button.png";
import CampaignPrewiewActions from "../../Components/Organisms/CMS/Campaign/CampaignPrewiewActions";
import { useDispatch, useSelector } from "react-redux";
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State,
  usePlaybackState,
  RepeatMode,
} from "react-native-track-player";
import { opacity } from "react-native-reanimated";
import CmpDetailMedia from "./CmpDetailMedia";
import { CampaignManagerService } from "./CompainApi";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { resetRedux } from "../../appConfig/AppRouter/Contents";
import SvgIcons from "../../Assets/Images/SvgIcons";

export default function CmpPreviwe({ navigation, route }) {
  const [songChangeTime, setSongChangeTime] = useState(10);
  const [appstates, setappstates] = useState("active");
  const [isPlay, setIsPlay] = useState(true);
  const [cleanTimeoutId, setCleanTimeoutId] = useState(null);
  const [canPlaySong, setCanPlaySong] = useState(false);

  const [trackIPlayerId, settrackIPlayerId] = useState(0);

  const appStateChangeHandler = async (newState) => {
    if (newState === "active") {
      getCamapaignDetails(selectedCampaignId);
      await TrackPlayer.play();
      setIsPlay(true);
      await setStorageForKey("appstates", newState);
    } else if (newState === "background") {
      await setStorageForKey("appstates", newState);
      console.log("app state background");
      try {
        await TrackPlayer.pause();
        await TrackPlayer.reset();
      } catch (error) {
        console.log("error can stop track player");
      }
    }
  };

  useEffect(() => {
    AppState.addEventListener("change", (state) => {
      appStateChangeHandler(state);
    });
  }, []);

  const setupPlayer = async () => {
    let isSetup = false;
    try {
      await TrackPlayer.getCurrentTrack();
      isSetup = true;
    } catch {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: true,
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [Capability.Play, Capability.Pause],
        compactCapabilities: [Capability.Play, Capability.Pause],
        progressUpdateEventInterval: 2,
      });

      isSetup = true;
    } finally {
      return isSetup;
    }
  };

  // Function to start playing the audio
  const startAudio = async (songurl) => {
    let stateedd = await getStorageForKey("appstates");
    if (isPlay) {
      const track = {
        id: "1",
        url: songurl,
        title: "Audio Title",
        artist: "Audio Artist",
        // ... other track details
      };
      const isSetup = await setupPlayer();
      // Check if the track is already in the queue, and add it if not
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (!currentTrack || (currentTrack.id !== track.id && isSetup)) {
        // console.log("If the track is already in the queue, just play it================>",isSetup,songurl)
        await TrackPlayer.reset();
        await TrackPlayer.add([track]);
        await TrackPlayer.play();
      } else {
        // If the track is already in the queue, just play it
        await TrackPlayer.play();
      }
    }
  };

  const onBack = async () => {
    setCanPlaySong(false);
    clearTimeout(cleanTimeoutId);
    setSongChangeTime(0);
    setCleanTimeoutId(null);
    clearTimeout(trackIPlayerId);
    settrackIPlayerId(null);
    console.log("close audio--->");
    setIsPlay(false);
    try {
      await TrackPlayer.pause();
      await TrackPlayer.reset();
      console.log("----> stop track player");
    } catch (error) {
      console.log("error can stop track player");
    }
    // const backId=setTimeout(()=>{
    navigation.goBack();
    // },200);
  };

  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  let camapignsData = route?.params?.campaigns;
  let viewDetails = route?.params?.viewDetails;
  const approveState = route?.params?.campaigns[0].approveState;

  const [selectedCampaignId, setselectedCampaignId] = useState(
    camapignsData[0]?.campaignId
  );
  const [isLoading, setIsLoading] = useState(false);
  const [audios, setaudios] = useState(null);
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

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignRegions, setSelectedCampaignRegions] = useState(null);
  const [mediaData, setMediaData] = useState(null);

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
        // console.log("backgroundImageContentId111-->",JSON.stringify(response.data))
        setSelectedCampaign(response.data);
        await btnGetMediaById(response.data.backgroundImageContentId)
          .then((res) => {
            if (res.status === "OK") {
              setBgImage(res.data.mediaDetails[0]);
              console.log("bgimge", res.data.mediaDetails[0]);
            } else {
              console.log("ln215", { nodata: "no" });
            }
          })
          .catch(() => {
            console.log("ln219", { nodata: "no" });
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
      let widgetsArr = playerDataArr.filter((ele) => {
        return ele.hasOwnProperty("widgetType") && ele;
      });

      let mediaArr1 = [...widgetsArr];
      if (playerDataArr.length > 0) {
        playerDataArr.map(async (pData) => {
          await btnGetMediaById(pData.mediaDetailId)
            .then((res) => {
              if (res.status === "OK") {
                mediaArr1.push({
                  ...res.data.mediaDetails[0],
                  displayMode: pData.displayMode,
                });
              } else {
                // mediaArr1.push({ nodata: "no" });
              }
            })
            .catch(() => {
              // mediaArr1.push({ nodata: "no" });
            });
        });
      }
      return { ...item, mediaForRegion: mediaForRegion, mediaArra: mediaArr1 };
    });

    setTimeout(() => {
      setSelectedCampaignRegions([...resgion]);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    if (selectedCampaignId) {
      btnGetCampaignDetails(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  useEffect(() => {
    getMediaDataForCampAdd(setIsLoading);
  }, []);
  useEffect(() => {
    if (selectedCampaign != null && mediaData != null) {
      btnSelectedCampaignData();
    }
  }, [mediaData, selectedCampaign]);

  useEffect(() => {
    setCanPlaySong(true);
    getCamapaignDetails(selectedCampaignId);
  }, [selectedCampaignId]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        // if(type=='AUDIO'||type=="VIDEO"||type.toLowerCase()=='audio'||type.toLowerCase()=="video"){

        TrackPlayer.reset();
        onBack();
      }
    );
  }, [navigation]);

  const getCamapaignDetails = async (selectedCampaignId) => {
    setCanPlaySong(true);
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: selectedCampaignId,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      console.log("formate is 342");
      formateCamapign(response);
      if (response?.data) {
        if (response.data.audios != null) {
          setaudios([...response.data.audios]);
        }
      }
    };

    const failureCallBack = (error) => {
      console.log("getCamapaignDetails error--> ", error.response.data.error);
      if (
        error.status == 401 ||
        error.status == "401" ||
        error.message == "Request failed with status code 401"
      ) {
        Alert.alert("Unauthorized", "Please login", [
          {
            text: "Ok",
            onPress: () => {
              resetRedux();
              navigation.navigate(NAVIGATION_CONSTANTS.LOGIN);
            },
          },
        ]);
      } else {
        Alert.alert("Something went wrong. Please try later");
      }
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

  const formateCamapign = async (res) => {
    console.log("formate is 401");
    if (res && res?.data) {
      setIsLoading(true);
      const campaignDetailsData = res?.data;
      if (
        campaignDetailsData &&
        campaignDetailsData?.regions &&
        campaignDetailsData?.regions?.length > 0
      ) {
        console.log("formate is 410");
        for (const r of campaignDetailsData.regions) {
          if (
            r.globalRegionContentPlaylistContents &&
            r?.globalRegionContentPlaylistContents &&
            r?.globalRegionContentPlaylistContents?.length > 0
          ) {
            for await (const rg of r.globalRegionContentPlaylistContents) {
              await btnGetMediaById(rg.mediaDetailId)
                .then((res) => {
                  if (res?.status === "OK") {
                    if (
                      res?.data &&
                      res?.data?.mediaDetails &&
                      res.data.mediaDetails.length > 0
                    ) {
                      console.log("\n------426---->", rg);
                      rg.mediaName = res.data.mediaDetails[0]?.name;
                    }
                  }
                })
                .catch((err) => console.log("431line", err));
            }
          }
        }
      }

      const apiResp = res.data;

      setBGColor(apiResp.backgroundColor);
      setCampaignName(apiResp.campaignName);
      console.log("437-->", 437);
      let respData = [];
      if (apiResp.regions && apiResp.regions.length > 0) {
        for (const iterator of apiResp.regions) {
          if (
            iterator.globalRegionContentPlaylistContents &&
            iterator.globalRegionContentPlaylistContents.length > 0
          ) {
            for await (const i of iterator.globalRegionContentPlaylistContents) {
              let mediaDetailURL = "NA";

              await btnGetMediaById(i.mediaDetailId)
                .then((res) => {
                  if (res?.status === "OK") {
                    if (
                      res?.data &&
                      res?.data?.mediaDetails &&
                      res.data.mediaDetails.length > 0
                    ) {
                      mediaDetailURL = res.data.mediaDetails[0]?.mediaUrl;
                    }
                  }
                })
                .catch((err) => console.log("line462 err", err));

              const index = respData.findIndex(
                (v) => v.campaignRegionId === iterator.campaignRegionId
              );

              console.log("468");

              if (index === -1) {
                console.log("471");
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
                console.log("497---", respData);
              } else {
                console.log("499--->", respData);
                if (
                  respData[index] &&
                  respData[index] !== null &&
                  respData[index] !== undefined
                ) {
                  console.log(
                    "505",
                    respData[index]?.hasOwnProperty("mediaArr")
                  );
                  respData[index]?.mediaArr.push({
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

      console.log("521--->");

      setTimeout(() => {
        setIsLoading(false);
        setcampaignData([res.data]);
        setCampaignRegions(respData);
      }, 100);

      if (
        apiResp.backgroundImageContentId &&
        apiResp.backgroundImageContentId > 0
      ) {
        console.log("534--->");
        let mediaURL = "NA";
        let mediaName = "NA";
        await btnGetMediaById(apiResp.backgroundImageContentId)
          .then((res) => {
            if (res?.status === "OK") {
              if (
                res?.data &&
                res?.data?.mediaDetails &&
                res.data.mediaDetails.length > 0
              ) {
                mediaName = res.data.mediaDetails[0]?.name;
                mediaURL = res.data.mediaDetails[0]?.mediaUrl;
                console.log(
                  "bg image Data==cover>",
                  JSON.stringify(res.data.mediaDetails[0].mediaDimension)
                );
              }
            }
          })
          .catch((err) => console.log("line 544 eror", err));

        setBackgroundImage({
          url: mediaURL,
          transparencyInPercentage: apiResp.transparencyInPercentage,
          name: mediaName,
        });
      }

      console.log("561--->");

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
        var i = 0;

        console.log("584--->");

        const playSongWithInterval = async (arr, index) => {
          // Check if index is within the array bounds
          if (index < arr.length) {
            let audioURL = "NA";
            await btnGetMediaById(arr[index].contentId).then((res) => {
              // startAudio(res.data.mediaDetails[0].audioUrl)
              if (res?.status === "OK") {
                if (
                  res?.data &&
                  res?.data?.mediaDetails &&
                  res.data.mediaDetails.length > 0
                ) {
                  console.log(
                    "this is the song==-->>",
                    isPlay,
                    canPlaySong,
                    res.data.mediaDetails[0].name
                  );
                  audioURL = res.data.mediaDetails[0]?.audioURL;
                  startAudio(res.data.mediaDetails[0].audioUrl);
                  setSongChangeTime(
                    res.data.mediaDetails[0].defaultDurationInSeconds
                  );
                }
              }
            });

            console.log("611--->");

            audiosArr = {
              audioURL,
              contentId: arr[index].contentId,
              order: arr[index].order,
            };
            index++;

            console.log("618--->");

            if (
              apiResp.audioStartBasedOnCampaignDurationInSeconds >
              res.data.mediaDetails[0].defaultDurationInSeconds
            ) {
              console.log("change song--->", index++);
              const timeoutIdd = setTimeout(function () {
                playSongWithInterval(arr, index);
              }, songChangeTime * 1000);
            }
            setCleanTimeoutId(timeoutIdd);
          }
        };
        const myArray = ["Element 1", "Element 2", "Element 3", "Element 4"];

        let playId = setTimeout(() => {
          console.log("----play song with interval-----");
          playSongWithInterval(apiResp.audios, 0);
        }, apiResp.audioStartBasedOnCampaignDurationInSeconds * 1000);

        settrackIPlayerId(playId);
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
          console.log("mdata", mdata);
          return (
            <View style={Styles.renderContainer1}>
              <View style={[Styles.nameView, { width: "20%" }]}>
                {mdata.hasOwnProperty("widgetType") ? (
                  <Image
                    source={SvgIcons[mdata.widgetType.toLowerCase()]}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: themeColor.themeColor,
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <Entypo
                    name="image-inverted"
                    size={20}
                    color={themeColor.themeColor}
                  />
                )}
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
    // console.log("logg loction JxxSON--->",JSON.stringify(campaignData))

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
            <AppText style={Styles.nameText}>
              {item?.locations.length > 0 ? "Yes" : "No"}
            </AppText>
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
          {backgroundImage?.url && (
            <Image
              source={{ uri: backgroundImage?.url }}
              style={{ width: 80, height: 50 }}
            />
          )}
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
            onClickIcon={async () => {
              onBack();
            }}
          />
          <ThemedButton
            onClick={() => {
              setCampaignRegions([]);
              setcampaignData([]);
              setBackgroundImage({
                transparencyInPercentage: 0,
                url: "",
                name: "",
              });
              setSelectedCampaignRegions([]);
              getCamapaignDetails(selectedCampaignId);
              btnGetCampaignDetails(selectedCampaignId);

              setSliderValue(0);
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
              }, 1500);
              setResetPreviewAgain(0);
            }}
            title={"Preview Again"}
            containerStyle={{ width: "40%" }}
          />
        </View>
        {!viewDetails &&
          workFlow &&
          approveState.toLowerCase() == "pending for approval" &&
          (workFlow.approverWorkFlow === "CAMPAIGN" ||
            workFlow.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN") && (
            <CampaignPrewiewActions
              campaignItem={campaignData[0]}
              navigation={navigation}
              setIsLoading={setIsLoading}
              onCancelPressed={async () => {
                await TrackPlayer.reset();
              }}
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
        {/* <View
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
                //   console.log("tptptptptptp", item.mediaArr);
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
          </View> */}
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
            resizeMode="stretch"
            imageStyle={{
              borderRadius: 5,
              height: 400,
              width: Dimensions.get("window").width - 10,
              position: "relative",
              backgroundColor: BGColor ? BGColor : "white",

              opacity: backgroundImage.transparencyInPercentage
                ? 1 - backgroundImage.transparencyInPercentage
                : 1,
            }}
            source={
              backgroundImage?.url != "" ? { uri: backgroundImage.url } : null
            }
          >
            {selectedCampaign != null &&
              selectedCampaignRegions?.map((item, index) => {
                const viewOpacity =
                  item.regionTransparencyInPercentage < 1
                    ? 1 - item.regionTransparencyInPercentage
                    : 1;
                const opa = viewOpacity < 0.3 ? 0.4 : viewOpacity;
                return (
                  <TouchableOpacity
                    activeOpacity={viewOpacity}
                    key={"campaign" + index}
                    style={[
                      Styles.regionContainer(item),
                      {
                        opacity: viewOpacity,
                        paddingHorizontal:
                          item?.mediaArra[0]?.displayMode == "STRETCH_TO_FIT"
                            ? 0
                            : 5,
                      },
                    ]}
                  >
                    <CmpDetailMedia
                      sliderValue={parseInt(sliderValue)}
                      mediaArr={item.mediaArra}
                      isMute={item.isAudioEnabled}
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
                width: width * 0.95,
                height: 40,
                marginLeft: width * 0.025,
                marginTop: 20,
              }}
              minimumValue={0}
              maximumValue={totalDurationOfCampaignInSeconds}
              value={sliderValue}
              onValueChange={(value) => {
                TrackPlayer.seekTo(value);
                setSliderValue(value);
              }}
              thumbTintColor="#21B4E4"
              minimumTrackTintColor="#223577"
              maximumTrackTintColor="#000000"
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 10,
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
    regionContainer: (item, tp) => ({
      height: `${item.heightInPercentage}%`,
      width: `${item.widthInPercentage}%`,
      // borderWidth: 0,
      // borderStyle: "dashed",
      position: "absolute",
      zIndex: 999,
      opacity: tp,
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
