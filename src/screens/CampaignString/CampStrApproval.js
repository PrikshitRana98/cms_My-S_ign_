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
  import Entypo from "react-native-vector-icons/Entypo";
  import Slider from "@react-native-community/slider";
  import AppText from "../../Components/Atoms/CustomText";
  import DownArr from "../../Assets/Images/PNG/down_arr.png";
  import UpArrow from "../../Assets/Images/PNG/up_arr.png";
  import play from "../../Assets/Images/PNG/play-button.png";
  import pause from "../../Assets/Images/PNG/video-pause-button.png";
  import CampaignPrewiewActions from "../../Components/Organisms/CMS/Campaign/CampaignPrewiewActions";
  import { useDispatch, useSelector } from "react-redux";
  import CmpDetailMediaApproval from "../Campaign/CampaignDetailMedia";
  import CampaignStringPrewiewActions from "../../Components/Organisms/CMS/CampaignString/CampaignStringPrewiewActions";
  
  export default function CampStrApproval({ navigation, route }) {
    const themeColor = useThemeContext();
    const Styles = CampaignStyles(themeColor);
   
    let viewDetails = route?.params?.viewDetails;
    let campaignString = route?.params?.campaignString;
    const [selectedCampaignId, setselectedCampaignId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
  
    let camapignsData = route?.params?.campaigns;
    useEffect(()=>{
      for (let index = 0; index < camapignsData.length; index++) {
        const element = camapignsData[index];
        if(element?.campaignType!='ADVERTISEMENT'){
          setselectedCampaignId(element.campaignId)
          break;
        }
  
      }
    },[route?.params])
    useEffect(() => {
      selectedCampaignId!=null && getCamapaignDetails(selectedCampaignId);
    }, [selectedCampaignId]);

    useEffect(()=>{
        getCampaignStringDetailsById(campaignString.campaignStringId)
    },[])

    const getCampaignStringDetailsById = async (id) => {
        let slugId = await getStorageForKey("slugId");
    
        const params = {
          slugId: slugId,
          campaignStringId: id,
        };
        const succussCallBack = async (response) => {
          console.log("response", response);
          if (response && response.name == "Success") {
            if (response?.data) {
              navigation.navigate("CampaignStringDetails", {
                campaigns:response?.data?.campaigns,
                viewDetails: true,
                campaignString: response?.data,
              })
              // navigation.navigate(NAVIGATION_CONSTANTS.CAMPAIGN_STRING_DETAIL, {
              //   campaignItem: response?.data?.campaigns,
              //   campaignString: response?.data,
              // });
            }
          }
        };
    
        const failureCallBack = (error) => {
          console.log("error", error);
          alert(error?.message);
        };
    
        CampaignStringManagerService.fetchCampaignStringDetails(
          params,
          succussCallBack,
          failureCallBack
        );
      };
  
    const getCamapaignDetails = async (selectedCampaignId) => {
      setIsLoading(true);
      let slugId = await getStorageForKey("slugId");
      const params = {
        ids: selectedCampaignId,
        slugId: slugId,
      };
      const succussCallBack = async (response) => {
        // setIsLoading(false);
        formateCamapign(response);
        if (response?.data) {
          console.log("getCamapaignDetails success", response);
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
        }, 6000);
  
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
          for await (const a of apiResp.audios) {
            const audioURL = "NA";
            await btnGetMediaById(a.mediaDetailId).then((res) => {
              if (res?.status === "OK") {
                if (
                  res?.data &&
                  res?.data?.mediaDetails &&
                  res.data.mediaDetails.length > 0
                ) {
                  audioURL = res.data.mediaDetails[0]?.mediaUrl;
                }
              }
            });
            audiosArr = {
              audioURL,
              contentId: a.contentId,
              order: a.order,
            };
          }
        }
        setMediaAudios(audiosArr);
        setBGColor(apiResp?.backgroundColor ? apiResp.backgroundColor : "");
  
        console.log("campaignDetailsData", JSON.stringify(campaignDetailsData));
        console.log("campaignDetailsData respData", JSON.stringify(respData));
      }else{
        setIsLoading(false)
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
      console.log("datadatadatadata", data);
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
                    {mdata?.defaultDurationInSeconds?.toString()}
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
      console.log("itemitemitemitem", item);
      const totalDuration = item?.mediaArr?.reduce(
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
  
    const renderCampaignBoxes = ({ index, item }) => {
      return (
        <View style={{ width: "47%", margin: moderateScale(5) }}>
          <TouchableOpacity
            onPress={() => {
              if(item.campaignType=="ADVERTISEMENT"){
                alert("Preview is not available for advertisement")
              }else{
                selectedCampaignId != item.campaignId &&
                  setselectedCampaignId(item.campaignId);
              }
            }}
            style={[
              Styles.campaignContainer(selectedCampaignId == item.campaignId),
            ]}
          >
            {selectedCampaignId == item.campaignId ? (
              <Image
                source={pause}
                style={{ height: moderateScale(50), width: moderateScale(50) }}
              />
            ) : (
              <Image
                source={play}
                style={{ height: moderateScale(50), width: moderateScale(50) }}
              />
            )}
          </TouchableOpacity>
          <Text
            numberOfLines={1}
            style={{
              textAlign: "center",
              marginTop: moderateScale(3),
              fontSize: moderateScale(14),
              color: "#000",
            }}
          >
            {item?.campaignName}
          </Text>
        </View>
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
              title={"Campaign"+campaignString.campaignStringId}
              onClickIcon={() => navigation.goBack()}
            />
            <ThemedButton
              onClick={() => {
                setCampaignRegions([])
                setBackgroundImage({
                  transparencyInPercentage: 0,
                  url: "",
                  name: "",
                })
                setcampaignData([])
                getCamapaignDetails(selectedCampaignId);
                setSliderValue(0)
                setResetPreviewAgain(prev => prev + 1)
              }}
              title={"Preview"}
              containerStyle={{ width: "40%" }}
            />
          </View>
  
          {!viewDetails &&
            campaignData.length > 0 &&
            workFlow &&
            campaignString?.state?.toLowerCase() == "pending for approval" &&
            workFlow?.approverWorkFlow == "CAMPAIGN_STRING" && (
              <CampaignStringPrewiewActions
                campaignString={campaignString}
                navigation={navigation}
                campaignItem={campaignData[0]}
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
                // opacity: 1,
              }}
              source={
                backgroundImage?.url != "" ? { uri: backgroundImage.url } : null
              }
            >
              {campaignRegions != null &&
                campaignRegions?.map((item, index) => {
                  console.log("item", item);
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={"campaign" + index}
                      style={Styles.regionContainer(item)}
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
  
          <FlatList
            numColumns={2}
            contentContainerStyle={{ marginTop: 20 }}
            data={camapignsData}
            renderItem={renderCampaignBoxes}
          />
        </View>
      </ScrollView>
    );
  }
  
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
  