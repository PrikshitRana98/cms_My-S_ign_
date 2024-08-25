import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Image,
  FlatList,
  BackHandler,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import { moderateScale, width } from "../../Helper/scaling";
import SedulerStyles from "./style";
import Loader from "../../Components/Organisms/CMS/Loader";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import CampaignDropDown from "../../Components/Organisms/CMS/Campaign/CampaignDropDown";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SchedulerManagerService } from "./SchedulerApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DownArr from "../../Assets/Images/PNG/down_arr.png";
import AppText from "../../Components/Atoms/CustomText";
import moment from "moment";
import Toast from "react-native-simple-toast";
import ViewImageModal from '../../Components/Atoms/ViewImageModal';
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import SuccessModal from "../../Components/Molecules/SuccessModal";

const SchedulerIndexView = ({ navigation }) => {
  const route = useRoute();
  const [imageView, setImageView] = useState(false);
  const [showrejectreason, setshowrejectreason] = useState(false);
  const themeColor = useThemeContext();
  const Styles = SedulerStyles(themeColor);
  const planogramList = route.params?.item || [];
  const [isLoading, setIsLoading] = useState(false);
  const [aspectRatioList, setAspectRatioList] = useState({});
  const [deviceData, setDeviceData] = useState(null);
  const [deviceGroupData1, setDeviceGroupData1] = useState([]);
  const [deviceData1, setDeviceData1] = useState([]);
  const [locationData1, setLocationData1] = useState([]);
  const [campName, setCampName] = useState([]);
  const [selcampName, setselCampName] = useState({});
  const [openFlag, setOpenFlag] = useState("");
  const [dataType, setDateType] = useState("");
  const [rejecttext, setrejecttext] = useState("");

  const [successModal,setSuccessModal]=useState(false);
  const [successMsg,setSuccessMsg]=useState("")

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
  })
  }, [navigation])

  const onComplete = () => {
    setSuccessModal(false);
  };


  const ListHeaders = [
    "Campaign Name",
    "Date & Time",
    "Duration",
    "Occurences",
    "Action",
  ];
  const renderCampaignHeader = () => {
    return (
      <View
        style={{
          width: 770,
          height: 100,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {ListHeaders.map((item, index) => (
          <View
            key={item + index}
            style={{
              justifyContent: "center",
              width: index === 1 ? 220 : index === 0 ? 150 : 130,
              backgroundColor: themeColor.themeLight,
            }}
          >
            <View style={Styles.headerThemeContainer}>
              <AppText style={Styles.listBoldText}>{item}</AppText>
            </View>
          </View>
        ))}
      </View>
    );
  };
  const ListHeaders1 = [
    "Device Name",
    "Device Id",
    "Device Group",
    "Device Group Id",
  ];

  useEffect(() => {
    if (planogramList?.planogramId) {
      getPlanogramDetails(planogramList?.planogramId);
      getCampaigns(planogramList?.planogramId);
      aspectRatio();
    }
  }, [planogramList]);

  const getPlanogramDetails = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      planogramId: id,
    };
    const succussCallBack = async (response) => {
      if (response && response.result) {
        if (response?.result?.deviceData?.length > 0) {
          setDeviceData1(response?.result?.deviceData);
          console.log("device data sch", response?.result);
        }
      }
    };

    const failureCallBack = (error) => {
      alert(error?.message);
    };

    SchedulerManagerService.getPlanogramDetail(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const renderDeviceList = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          width: 620,
          margin: moderateScale(0.5),
          backgroundColor: themeColor.shadow,
        }}
      >
        <View style={[Styles.nameView, { width: 150 }]}>
          <AppText style={Styles.nameText}>{item.deviceName}</AppText>
        </View>
        <View style={[Styles.nameView, { width: 150 }]}>
          <AppText style={Styles.nameText}>
            {item.deviceId ? item.deviceId : "--"}
          </AppText>
        </View>
        <View style={[Styles.nameView, { width: 150 }]}>
          <AppText style={Styles.nameText}>
            {item.deviceGroup?.deviceGroupName
              ? item.deviceGroup?.deviceGroupName
              : "--"}
          </AppText>
        </View>
        <View style={[Styles.nameView, { width: 150 }]}>
          <AppText style={Styles.nameText}>
            {item.deviceGroup?.deviceGroupId
              ? item.deviceGroup?.deviceGroupId
              : "--"}
          </AppText>
        </View>
      </View>
    );
  };

  const renderCampaignList = ({ item, index }) => {
    return (
      <View style={[Styles.renderContainer, { width: 740 }]}>
        <View style={[Styles.nameView, { width: 150 }]}>
          <AppText style={Styles.nameText}>{item.camapignName}</AppText>
        </View>
        <View style={[Styles.nameView, { width: 220 }]}>
          <AppText style={Styles.nameText}>
            {item.startDate} {"-"} {item.endDate} {"\n"} {item.startTime} {"-"}{" "}
            {item.endTime}
          </AppText>
        </View>
        <View style={[Styles.nameView, { width: 130 }]}>
          <AppText style={Styles.nameText}>
            {item.campaignDuration}
            {"sec"}
          </AppText>
        </View>
        <View style={[Styles.nameView, { width: 130 }]}>
          <AppText style={Styles.nameText}>{item.occurance}</AppText>
        </View>
        <View style={[Styles.nameView, { width: 130}]}>
          <TouchableOpacity style={Styles.iconBackView}
              onPress={() => {
                navigation.navigate("CmpPreviwe", {
                  campaigns: [
                    {
                      campaignId: item?.campaignId,
                      campaigName: item?.campaignTitle,
                      approveState:""
                    },
                  ],
                  viewDetails: true,
                });
            }}>
          <Ionicons name="eye" size={21} color={themeColor.themeColor} />
        </TouchableOpacity>
      
        </View>
      </View>
    );
  };

  const renderDeviceHeader = () => {
    return (
      <View
        style={{
          width: 600,
          height: 100,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {ListHeaders1.map((item, index) => (
          <View
            key={item + index}
            style={{
              justifyContent: "center",
              width: 150,
              backgroundColor: themeColor.themeLight,
            }}
          >
            <View style={Styles.headerThemeContainer}>
              <AppText style={Styles.listBoldText}>{item}</AppText>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const [planogramForm, setPlanogramForm] = useState({
    device: "",
    locationDevice: "",
    group: "",
    location: "",
  });

  useEffect(() => {
    if (deviceData) {
      setSelectedCmpAndCmpStr();
    }
  }, [deviceData]);

  const setSelectedCmpAndCmpStr = () => {
    let { layoutAndLayoutStrings } = deviceData;
    let cmp = [];
    if (layoutAndLayoutStrings && layoutAndLayoutStrings?.length > 0) {
      layoutAndLayoutStrings.map((camp) => {
        if (camp.hasOwnProperty("campaignId")) {
          cmp.push(camp.campaignName);
        }
        if (camp.hasOwnProperty("campaignStringId")) {
          cmp.push(camp.campaignStringName);
        }
      });
      setCampName([...cmp]);
    }
  };

  const getCampaigns = async (id) => {
    let slugId = await getStorageForKey("slugId");
    setIsLoading(true);
    const params = {
      palamid: id,
    };
    const succussCallBack = async (response) => {
      if (response.status == "SUCCESS" && response?.result.length > 0) {
        setCampName(response.result);
      }
      setIsLoading(false);
    };
    const failureCallBack = (error) => {};

    SchedulerManagerService.getCampaigns(
      params,
      succussCallBack,
      failureCallBack
    );
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

    const failureCallBack = (error) => {};

    SchedulerManagerService.ratioIdString(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const fetchmediaid = async (id) => {
    let slugId = await getStorageForKey("slugId");

    const params = {
      slugId: slugId,
      campid: id,
    };
    const succussCallBack = async (response) => {
      if (response && response.data) {
        fetchmediaid1(
          response?.data?.regions[0].globalRegionContentPlaylistContents[0]
            .contentId
        );
      }
    };

    const failureCallBack = (error) => {
      alert(error?.message);
    };

    SchedulerManagerService.fetchmediaid(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const RejectScheduler = async () => {
    let slugId = await getStorageForKey("slugId");

    let postData = {
      comment: rejecttext,
    };
    const params = {
      slugid: slugId,
      data: postData,
      planogramId: planogramList?.planogramId,
    };
    const succussCallBack = async (response) => {
      setSuccessModal(true)
      setSuccessMsg("Scheduler Reject successfully");
      setTimeout(()=>{
        
        navigation.goBack()
      },1000)     
    };

    const failureCallBack = (error) => {
      alert(error?.message);
    };

    SchedulerManagerService.rejectScheduler(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const AcceptScheduler = async (id) => {
    setIsLoading(true);
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugid: slugId,
      planogramId: planogramList?.planogramId,
    };
    const succussCallBack = async (response) => {
      if (response?.data) {
        setSuccessModal(true)
        setSuccessMsg("Scheduler approved successfully");
        setTimeout(()=>{
          navigation.goBack()
        },1000)
      }

      setIsLoading(false);
    };

    const failureCallBack = (error) => {
      alert(error?.message);
      setIsLoading(false);
    };

    SchedulerManagerService.acceptScheduler(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  const fetchmediaid1 = async (id) => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
      mediaid: id,
    };
    const succussCallBack = async (response) => {
      if (response && response.message == "success") {
        setselCampName(response?.data);
        setImageView(true);
        setIsLoading(false);
      }
    };

    const failureCallBack = (error) => {
      alert(error?.message);
    };

    SchedulerManagerService.fetchmediaid1(
      params,
      succussCallBack,
      failureCallBack
    );
  };

  return (
    <View style={Styles.fullFlex}>
      <Loader visible={isLoading} />
      {successModal && <SuccessModal Msg={successMsg} onComplete={onComplete} />}
      {showrejectreason ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showrejectreason}
          onRequestClose={() => setshowrejectreason(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            <View
              style={{
                width: "80%",
                height: 250, // Set your desired height
                backgroundColor: "white",
                padding: 20,
                borderRadius: 10,
              }}
            >
              <Text style={Styles.EventTitle}>Reason of Rejection</Text>
              <Text>Reasons*</Text>
              <TextInput
                style={{
                  fontSize: moderateScale(14),
                  fontFamily: "OpenSans-Medium",
                  paddingVertical: moderateScale(8),
                  marginVertical: 10,
                  width: "100%",
                  borderRadius: 5,
                  borderColor: "#dfe0f2",
                  borderWidth: 1,
                  color: "#000000",
                }}
                placeholder={"Enter Reason"}
                placeholderTextColor={"#00000026"}
                value={rejecttext}
                onSubmitEditing={(e) => {
                  // btnPlonogramData();
                }}
                onChangeText={(value) => {
                  setrejecttext(value);
                  //onchange(item, value);
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  justifyContent: "flex-end",
                  paddingHorizontal: 16,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setrejecttext("");
                    setshowrejectreason(false);
                  }}
                  style={{
                    backgroundColor: "#E61818",
                    padding: 10,
                    borderRadius: 5,
                    margin: 5,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}> Cancel </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (rejecttext.trim() == "") {
                      Toast.show("Please enter reason.", Toast.SHORT);
                    } else {
                      setshowrejectreason(false);
                      RejectScheduler();
                    }
                  }}
                  style={{
                    backgroundColor: "#253D91",
                    padding: 10,
                    borderRadius: 5,
                    margin: 5,
                  }}
                >
                  <Text style={{ color: "#FFFFFF" }}> Reject </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}

      <ClockHeader />
      {imageView ? (
        <ViewImageModal
          details={selcampName?.mediaDetails[0]}
          setModal={setImageView}
        />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={Styles.headerContainer}>
          <CreateNewHeader
            title="View Scheduler"
            onClickIcon={() => navigation.goBack()}
          />
        </View>

        {route.params?.showbtn && (
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              justifyContent: "flex-end",
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Approve Scheduler",
                  `Are you sure you want to Approve this Scheduler ?`,
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => {
                        AcceptScheduler();
                      },
                    },
                  ]
                );
              }}
              style={{
                backgroundColor: "#253D91",
                padding: 10,
                borderRadius: 5,
                margin: 5,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}> Approve </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setshowrejectreason(true);
              }}
              style={{
                backgroundColor: "#E61818",
                padding: 10,
                borderRadius: 5,
                margin: 5,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}> Reject </Text>
            </TouchableOpacity>
          </View>
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
              <Text style={Styles.titleName}>
                {moment(planogramList.startDate).format("DD-MM-YYYY")}
              </Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event End Date</Text>
          <View style={Styles.titleView}>
            {planogramList.endDate ? (
              <Text style={Styles.titleName}>
                {moment(planogramList.endDate).format("DD-MM-YYYY")}
              </Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event Start Time</Text>
          <View style={Styles.titleView}>
            {planogramList.startTime ? (
              <Text style={Styles.titleName}>
                {moment(planogramList.startTime, "HH:mm:ss").format("HH:mm")}
              </Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Event End Time</Text>
          <View style={Styles.titleView}>
            {planogramList.endTime ? (
              <Text style={Styles.titleName}>
                {moment(planogramList.endTime, "HH:mm:ss").format("HH:mm")}
              </Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>
          <Text style={Styles.EventTitle}>Available Slots</Text>
          <View style={Styles.titleView}>
            {planogramList.endTime ? (
              <Text style={Styles.titleName}>
                {planogramList.availableSlots}
              </Text>
            ) : (
              <Text style={Styles.titleName}>-</Text>
            )}
          </View>

          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              CAMPAIGN / CAMPAIGN STRING LIST
            </AppText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              style={{
                width: "100%",
              }}
            >
              <FlatList
                data={campName}
                renderItem={renderCampaignList}
                ListHeaderComponent={renderCampaignHeader}
              />
            </ScrollView>
          </View>
          <View style={Styles.bodyContainer}>
            <AppText style={Styles.bodyHeaderText}>
              DEVICES / DEVICES GROUP LIST
            </AppText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              style={{
                width: "100%",
              }}
            >
              <FlatList
                data={deviceData1}
                renderItem={renderDeviceList}
                ListHeaderComponent={renderDeviceHeader}
              />
            </ScrollView>
          </View>

          {/* locations */}
          {/* location and devicesgroup */}
        </View>
      </ScrollView>
    </View>
  );
};

export default SchedulerIndexView;
