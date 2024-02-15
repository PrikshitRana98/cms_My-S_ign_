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
} from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import UpArrow from "../../Assets/Images/PNG/up_arr.png";
import { useSelector } from "react-redux";
import Loader from "../../Components/Organisms/CMS/Loader";
import { moderateScale, width } from "../../Helper/scaling";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import play from "../../Assets/Images/PNG/play-button.png";
import pause from "../../Assets/Images/PNG/video-pause-button.png";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";
import Entypo from "react-native-vector-icons/Entypo";
import Slider from "@react-native-community/slider";
import TrackPlayer, { Capability } from "react-native-track-player";
import Pdf from "react-native-pdf";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import { CampaignManagerService } from "./CompainApi";
import { baseUrl } from "../../Services/AxiosService/axios";
import axios from "axios";
import AppText from "../../Components/Atoms/CustomText";
import ModalWithInputField from "../../Components/Organisms/CMS/Campaign/ModalWithInputField";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CmpDetailMediaApproval from "../Campaign/CmpDetailMediaApproval";
import CampaignPrewiewActions from "../../Components/Organisms/CMS/Campaign/CampaignPrewiewActions";
import CampaignStringPrewiewActions from "../../Components/Organisms/CMS/CampaignString/CampaignStringPrewiewActions";

const CampaignDetail = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);
  const [campaignItem, setCampaign] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignRegions, setSelectedCampaignRegions] = useState(null);
  const [totaldurations, setTotalDuration] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const { campaignString } = route.params;

  useEffect(() => {
    setSelectedCampaign(campaignString?.campaigns);
    btnGetCampaignDetails(campaignString?.campaigns[0].campaignId);
  }, []);

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
        makeDataCampaign(response?.data);
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

  const makeDataCampaign = (campaign) => {
    setCampaign(campaign);
    setTotalDuration(campaign?.totalDurationOfCampaignInSeconds);
    console.log("campaign--119", campaign);
    let mRegions = campaign.regions;
    setIsLoading(true);
    let regions = mRegions?.map((region) => {
      let mediaArr1 = [];

      region.globalRegionContentPlaylistContents?.map(async (content) => {
        await btnGetMediaById(content.mediaDetailId, setIsLoading)
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
      return { ...region, mediaArra: mediaArr1 };
    });
    setTimeout(() => {
      setSelectedCampaignRegions([...regions]);
      setIsLoading(false);
    }, 8000);
    console.log("regionsregionsregions", regions);
  };

  // compomnents==================

  const renderCampaignBoxes = ({ index, item }) => {
    return (
      <View style={{ width: "47%", margin: moderateScale(5) }}>
        <TouchableOpacity
          onPress={() => {
            !(campaignItem?.campaignId === item.campaignId) &&
              btnGetCampaignDetails(item.campaignId);
          }}
          style={[
            Styles.campaignContainer(
              campaignItem?.campaignId === item.campaignId
            ),
          ]}
        >
          {campaignItem?.campaignId === item.campaignId ? (
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
  // Approve========

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
          onClick={() => {}}
          title={"Preview"}
          containerStyle={{ width: "40%" }}
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
              {selectedCampaign != null &&
                selectedCampaignRegions?.map((item, index) => {
                  return (
                    <TouchableOpacity
                      activeOpacity={1}
                      key={"campaign" + index}
                      style={Styles.regionContainer(item)}
                    >
                      <CmpDetailMediaApproval mediaArr={item.mediaArra} />
                    </TouchableOpacity>
                  );
                })}
            </View>
          )}

          {totaldurations != 0 && (
            <>
              <Slider
                style={{
                  width: width * 0.98,
                  height: 40,
                  marginLeft: -7,
                  marginTop: 20,
                }}
                minimumValue={0}
                maximumValue={totaldurations}
                value={sliderValue}
                onValueChange={(value) => {
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
                  <Text style={{ color: "#fff" }}>{totaldurations}</Text>
                </View>
              </View>
            </>
          )}

          <FlatList
            numColumns={2}
            contentContainerStyle={{ marginTop: 20 }}
            data={campaignString?.campaigns}
            renderItem={renderCampaignBoxes}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CampaignDetail;

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
