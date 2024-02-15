import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  FlatList,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import PlanogramStyles from "./style";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import { moderateScale, width } from "../../Helper/scaling";
import { PlanogramManagerService } from "./PlonogramApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import AppText from "../../Components/Atoms/CustomText";
import CampaignPrewiewActions from "../../Components/Organisms/CMS/Campaign/CampaignPrewiewActions";
import PlanogramPreviewActions from "../../Components/Organisms/CMS/Planogram/PlanogramPreviewActions";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { CampaignStringManagerService } from "../CampaignString/CampaignStringApi";
import Loader from "../../Components/Organisms/CMS/Loader";

const PlanogramApproveView = ({ navigation }) => {
  const route = useRoute();
  const themeColor = useThemeContext();
  const Styles = PlanogramStyles(themeColor);
  const planogramList = route.params?.item || [];
  const buttonShow = route.params?.buttonShow;
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatioList, setAspectRatioList] = useState([]);
  const [deviceData, setDeviceData] = useState(null);
  const [deviceGroupData1, setDeviceGroupData1] = useState([]);
  const [deviceData1, setDeviceData1] = useState([]);
  const [locationData1, setLocationData1] = useState([]);
  const [campName, setCampName] = useState([]);
  const [openFlag, setOpenFlag] = useState("");
  const [dataType, setDateType] = useState("");
  const [campaignData, setCampaignData] = useState([]);

  const [planogramForm, setPlanogramForm] = useState({
    device: "",
    locationDevice: "",
    group: "",
    location: "",
  });

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      
      navigation.goBack();

  })
    
  }, [navigation])

  useEffect(() => {
    console.log("planogramListplanogramList", planogramList);
    aspectRatio();
    fetchDeviceData();
    makeDeviceLocationList();
  }, []);

  useEffect(() => {
    if (deviceData) {
      setSelectedCmpAndCmpStr();
    }
  }, [deviceData]);

  const setSelectedCmpAndCmpStr = () => {
    let { layoutAndLayoutStrings } = deviceData;
    console.log("layoutAndLayoutStrings", layoutAndLayoutStrings);
    let campData = [];
    let cmp = [];
    if (layoutAndLayoutStrings && layoutAndLayoutStrings.length > 0) {
      layoutAndLayoutStrings.map((camp) => {
        if (camp.hasOwnProperty("campaignId")) {
          let dt = {
            title: camp.campaignName,
            id: camp.campaignId,
            duration: camp.duration,
            campaignType: camp.campaignType,
            type: "campaign",
          };
          campData.push(dt);
          cmp.push(camp.campaignName);
        }
        if (camp.hasOwnProperty("campaignStringId")) {
          let dt = {
            title: camp.campaignStringName,
            id: camp.campaignStringId,
            duration: camp.duration,
            type: "campaignString",
          };
          campData.push(dt);
          cmp.push(camp.campaignStringName);
        }
      });
      setCampaignData([...campData]);
      setCampName([...cmp]);
      console.log("campDatacampData", campData);
    }
  };

  const aspectRatio = async () => {
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: planogramList.aspectRatioId,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response && response.data) {
        setAspectRatioList(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("aspectStringError", error);
    };

    PlanogramManagerService.ratioIdString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const fetchDeviceData = async () => {
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      ids: planogramList.planogramId,
      slugId: slugId,
    };
    const succussCallBack = async (response) => {
      setIsLoading(false);
      if (response && response.data) {
        setDeviceData(response.data);
      }
    };

    const failureCallBack = (error) => {
      console.log("deviceError", error);
    };

    PlanogramManagerService.deviceList(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const makeDeviceLocationList = () => {
    let { deviceLogic } = planogramList;
    let locAndDeviceGroup = deviceLogic?.filter(
      (item) => item.key == "LOCATIONS_AND_DEVICE_GROUPS"
    );
    let deviceGroup = deviceLogic?.filter(
      (item) => item.key == "DEVICE_GROUPS"
    );
    let location = deviceLogic?.filter((item) => item.key == "LOCATIONS");
    let devices = deviceLogic?.filter((item) => item.key == "DEVICES");

    let deviceData = [];
    let locationData = [];
    let deviceGroupData = [];
    let deviceGroupLocationData = [];
    if (
      devices.length > 0 &&
      devices[0]?.devices &&
      devices[0]?.devices?.length > 0
    ) {
      setDateType("devices");
      devices[0]?.devices.map((dev) => {
        deviceData.push({ label: dev?.deviceName, value: dev?.deviceName });
      });
    } else if (
      location.length > 0 &&
      location[0]?.locations &&
      location[0]?.locations?.length > 0
    ) {
      setDateType("locations");
      location[0]?.locations.map((dev) => {
        locationData.push({
          label: dev?.locationName,
          value: dev?.locationName,
        });
      });
    } else if (
      deviceGroup.length > 0 &&
      deviceGroup[0]?.deviceTags &&
      deviceGroup[0]?.deviceTags?.length > 0
    ) {
      setDateType("device_group");
      deviceGroup[0]?.deviceTags.map((dev) => {
        deviceGroupData.push({
          label: dev?.deviceGroupName,
          value: dev?.deviceGroupName,
        });
      });
    } else if (
      locAndDeviceGroup.length > 0 &&
      locAndDeviceGroup[0]?.locations &&
      locAndDeviceGroup[0]?.locations?.length > 0
    ) {
      setDateType("locations_device_group");
      locAndDeviceGroup[0]?.locations.map((dev) => {
        locationData.push({
          label: dev?.locationName,
          value: dev?.locationName,
        });
        if (dev?.deviceGroups && dev?.deviceGroups.length > 0) {
          dev?.deviceGroups?.map((devGr) => {
            deviceGroupData.push({
              label: devGr?.deviceGroupName,
              value: devGr?.deviceGroupName,
            });
          });
        }
      });
    }
    setDeviceGroupData1([...deviceGroupData]);
    setLocationData1([...locationData]);
    setDeviceData1([...deviceData]);
  };

  const ListHeaders = ["#", "Campaign Name", "Duration(in seconds )", "Action"];

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
  const renderCampaignList = ({ item, index }) => {
    let campaignTags1 = "--";
    console.log('item------',item)
    return (
      <View style={Styles.renderContainer}>
        <View style={[Styles.nameView, { width: "16%" }]}>
          <AppText style={Styles.nameText}>{(index + 1).toString()}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "28%" }]}>
          <AppText style={Styles.nameText}>{item.title}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "28%" }]}>
          <AppText style={Styles.nameText}>{item?.duration.toString()}</AppText>
        </View>
        <View style={[Styles.nameView, { width: "28%" }]}>
          <Pressable
            onPress={() => {
              if (item.type === "campaign") {
                if(item.campaignType=="ADVERTISEMENT"){
                  alert("Preview is not available for advertisement");
                }else{
                  navigation.navigate('CmpPreviwe', {
                    campaigns: [
                      {
                        campaignId: item?.id,
                        campaigName: item?.title,
                      },
                    ],
                    viewDetails: true,
                  });
                }
              } else {
                getCampaignStringDetailsById(item.id);
              }
            }}
          >
            <MaterialIcons name="remove-red-eye" color={themeColor.themeColor} size={20} />
          </Pressable>
        </View>
      </View>
    );
  };

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

 
  return (
    <View style={Styles.fullFlex}>
      <Loader visible={isLoading}/>
      <ClockHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={Styles.headerContainer}>
          <CreateNewHeader
            title="Planogram"
            onClickIcon={() => navigation.goBack()}
          />
        </View>
        {buttonShow && (
          <PlanogramPreviewActions
            planogramItem={planogramList}
            navigation={navigation}
            setIsLoading={setIsLoading}
          />
        )}
        <View
          style={[
            Styles.mainContainer,
            { marginHorizontal: moderateScale(15) },
          ]}
        >
          <Text style={Styles.EventTitle}>Event Title</Text>
          <View style={Styles.titleView}>
            <Text style={Styles.titleName}>{planogramList.title || ""}</Text>
          </View>
          <Text style={Styles.EventTitle}>Aspect Ratio</Text>
          <View style={Styles.titleView}>
            <Text style={Styles.titleName}>
              {aspectRatioList.aspectRatio || ""}
            </Text>
          </View>

          <Text style={Styles.EventTitle}>Event Start Date</Text>
          <View style={Styles.titleView}>
            {planogramList.startDate ? (
              <Text style={Styles.titleName}>{planogramList.startDate}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event Start Time</Text>
          <View style={Styles.titleView}>
            {planogramList.startTime ? (
              <Text style={Styles.titleName}>{planogramList.startTime}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event End Date</Text>
          <View style={Styles.titleView}>
            {planogramList.endDate ? (
              <Text style={Styles.titleName}>{planogramList.endDate}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>

          <Text style={Styles.EventTitle}>Event End Time</Text>
          <View style={Styles.titleView}>
            {planogramList.endTime ? (
              <Text style={Styles.titleName}>{planogramList.endTime}</Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Is Priority Planogram</Text>
          <View style={Styles.titleView}>
            {
              <Text style={Styles.titleName}>
                {planogramList.isPriorityPlanogram ? "YES" : "NO"}
              </Text>
            }
          </View>
          {planogramList?.recurrence?.repeatEvent&&<>
          <Text style={Styles.EventTitle}>Repeat </Text>
          <View style={Styles.titleView}>
          {
            planogramList?.recurrence?.recurrenceType !== "DAILY" ?
            planogramList?.recurrence?.recurrenceType === "HOURLY" ?
            <Text style={Styles.titleName}>
                Repeat Every {planogramList?.recurrence?.repeatHours} Hours
              </Text> 
              : planogramList?.recurrence.recurrenceType === "MINUTE" ?
              <Text style={Styles.titleName}>
                Repeat Every {planogramList?.recurrence?.repeatMinutes} Minutes
              </Text>   : 
              planogramList.recurrence.recurrenceType === "MONTHLY" ? 
              planogramList.recurrence.monthly ?
              <Text style={Styles.titleName}>{planogramList?.recurrence.monthly === "START_OF_MONTH" ? "First day of Month" :
              planogramList?.recurrence.monthly === "MIDDLE_OF_MONTH" ? "15th of the Month" :
              planogramList?.recurrence.monthly === "END_OF_MONTH" ? "Last Day of the Month" : ""
              } </Text> : null
              :planogramList?.recurrence.recurrenceType === "WEEKLY" ?
              <Text style={Styles.titleName}>
              Repeat Every {planogramList?.recurrence?.repeatWeeks}week {" "}
              {planogramList?.recurrence?.weekly.join(", ")}
              </Text> : null
              : null
            }
            
          </View>
          </>}
          <Text style={Styles.EventTitle}>Campaign Name</Text>
          <View style={Styles.titleView}>
            <Text style={Styles.titleName}>
              {campName.length > 0 ? campName.join(", ") : "-"}
            </Text>
          </View>

          <View style={{ width: "100%", marginTop: 9 }}>
            <View
              style={{
                borderColor: "#00000026",
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
              }}
            >
              <Pressable
                onPress={() => {
                  setOpenFlag("device_group");
                }}
                style={{
                  paddingVertical: moderateScale(15),
                  paddingHorizontal: moderateScale(15),
                  marginTop: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#00000056" }}>Group Device{` (${deviceGroupData1?.length})`}</Text>
                <Image
                  source={DownArr}
                  style={{
                    height: moderateScale(7),
                    width: moderateScale(11),
                    resizeMode: "contain",
                    tintColor: "#00000026",
                  }}
                />
              </Pressable>
              {openFlag == "device_group" && (
                <View
                  style={{
                    padding: moderateScale(15),
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {dataType == "device_group" &&
                    deviceGroupData1.map((dGroup) => {
                      return (
                        <Text
                          style={{ color: "#000" }}
                        >{`${dGroup.label}`}</Text>
                      );
                    })}
                </View>
              )}
            </View>
          </View>

          {/* devices */}
          <View style={{ width: "100%", marginTop: 9 }}>
            <View
              style={{
                borderColor: "#00000026",
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
              }}
            >
              <Pressable
                onPress={() => {
                  setOpenFlag("devices");
                }}
                style={{
                  paddingVertical: moderateScale(15),
                  paddingHorizontal: moderateScale(15),
                  marginTop: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#00000056" }}>Devices{` (${deviceData1?.length})`}</Text>
                <Image
                  source={DownArr}
                  style={{
                    height: moderateScale(7),
                    width: moderateScale(11),
                    resizeMode: "contain",
                    tintColor: "#00000026",
                  }}
                />
              </Pressable>
              {openFlag == "devices" && (
                <View
                  style={{
                    padding: moderateScale(15),
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {dataType == "devices" &&
                    deviceData1.map((dGroup) => {
                      return (
                        <Text
                          style={{ color: "#000" }}
                        >{`${dGroup.label}`}</Text>
                      );
                    })}
                </View>
              )}
            </View>
          </View>

          {/* locations */}
          <View style={{ width: "100%", marginTop: 9 }}>
            <View
              style={{
                borderColor: "#00000026",
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
              }}
            >
              <Pressable
                onPress={() => {
                  setOpenFlag("locations");
                }}
                style={{
                  paddingVertical: moderateScale(15),
                  paddingHorizontal: moderateScale(15),
                  marginTop: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#00000056" }}>Locations{` (${locationData1?.length})`}</Text>
                <Image
                  source={DownArr}
                  style={{
                    height: moderateScale(7),
                    width: moderateScale(11),
                    resizeMode: "contain",
                    tintColor: "#00000026",
                  }}
                />
              </Pressable>
              {openFlag == "locations" && (
                <View
                  style={{
                    padding: moderateScale(15),
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {dataType == "locations" &&
                    locationData1.map((dGroup) => {
                      return (
                        <Text
                          style={{ color: "#000" }}
                        >{`${dGroup.label}`}</Text>
                      );
                    })}
                </View>
              )}
            </View>
          </View>

          {/* location and devicesgroup */}
          <View style={{ width: "100%", marginTop: 9 }}>
            <View
              style={{
                borderColor: "#00000026",
                borderRadius: moderateScale(10),
                borderWidth: moderateScale(1),
              }}
            >
              <Pressable
                onPress={() => {
                  setOpenFlag("locations_device_group");
                }}
                style={{
                  paddingVertical: moderateScale(15),
                  paddingHorizontal: moderateScale(15),
                  marginTop: 3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: "#00000056" }}>
                  Locations Device Groups{` (${deviceGroupData1?.length})`}
                </Text>
                <Image
                  source={DownArr}
                  style={{
                    height: moderateScale(7),
                    width: moderateScale(11),
                    resizeMode: "contain",
                    tintColor: "#00000026",
                  }}
                />
              </Pressable>
              {openFlag == "locations_device_group" && (
                <View
                  style={{
                    padding: moderateScale(15),
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  {dataType == "locations_device_group" && (
                    <>
                      <Text
                        style={{ color: "#000" }}
                      >{`-> ${locationData1[0].label}`}</Text>
                      {deviceGroupData1.map((dGroup) => {
                        return (
                          <Text
                            style={{ color: "#000", marginTop: 5 }}
                          >{`${dGroup.label}`}</Text>
                        );
                      })}
                    </>
                  )}
                </View>
              )}
            </View>
          </View>

          {/*=======campaign campaign string list==== */}
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
        </View>
      </ScrollView>
    </View>
  );
};

export default PlanogramApproveView;
