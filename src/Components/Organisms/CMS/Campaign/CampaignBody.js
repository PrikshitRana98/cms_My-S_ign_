import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import AppText from "../../../Atoms/CustomText";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import ThemedText from "../../../Atoms/ThemedText";
import CampaignScrollHeader from "./CampaignScrollHeader";
import DeleteIcon from "../../../../Assets/Images/PNG/delete.png";
import EditIcon from "../../../../Assets/Images/PNG/edit.png";
import copy from "../../../../Assets/Images/PNG/copy.png";
import archive from "../../../../Assets/Images/PNG/archive.png";
import unarchive from "../../../../Assets/Images/PNG/unarchive.png";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
import { Item } from "react-native-paper/lib/typescript/components/List/List";
import { useSelector } from "react-redux";
import { PREVILAGES } from "../../../../Constants/privilages";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SchedulerInfoModal from "../../../Atoms/SchedulerInfoModal";
import PlanogramToolPin from "../Planogram/PlanogramToolPin";
import viewIcon from "../../../../Assets/Images/PNG/document.png" 


const data = [
  "KFC New Burger Ad",
  "Pizza Hut Cheesymomos",
  "Burger king Grilled",
  "Sarvodaya Hospital Clinic Ad",
  "KFC 20Rs New Menu Ad",
  "KFC New Burger Ad",
  "Pizza Hut Cheesymomos",
  "Burger king Grilled",
  "Sarvodaya Hospital Clinic Ad",
  "KFC 20Rs New Menu Ad",
];
const CampaignList = [
  {
    campaignName: "Burger King",
    createdBy: "Ragul Kumar",
    createdOn: "2023-05-15 12:30:00 AM",
    updatedOn: "2023-05-15 12:30:00 AM",
    duration: "12 secs",
    tags: "----",
    type: "Normal",
    state: "Published",
  },
];

const CampaignBody = ({
  campaignList,
  isListDataLoading,
  campaignForm,
  setIsLoading,
  searchData,
  setSearchData,
  setCampaignData,
  makeUrlData,
  btnOpenModelType,
  selectAllCampaingFlag,
  setSelectAllCampaingFlag,
  workFlow,
}) => {
   
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const navigation = useNavigation();
  const { authorization, isApprover } = useSelector(
    (state) => state.userReducer
  );
  const {userRole } = useSelector((state) => state.userReducer);
  const [isLocRestricted,setisLocRestricted]=useState(userRole?.isUserLocationRestricted)
 

  function convertSecondsToMinutesAndSeconds(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    return {
      minutes,
      seconds,
    };
  }
  const [infoModal, setInfoModal] = useState(false);
  const [info, setInfo] = useState([]);

  const closeModal = () => {
    setInfoModal(false);
    setInfo([]);
  };

  function removeDuplicates(data) {
    const ids = data.map(({ userId }) => userId);
    const filtered = data.filter(
      ({ userId }, index) => !ids.includes(userId, index + 1)
    );
    return filtered;
  }

  const getListOfApprovers = (approversArray) => {
    let approvalNameArray = [];
    for (let index = 0; index < approversArray.length; index++) {
      if (approversArray[index].workFlowActivityType === "SUBMIT") break;
      approvalNameArray.push(approversArray[index]);
    }
    return approvalNameArray;
  };
  const renderApprovedRejectView = (value, index, item) => {
    if (item.state !== "DRAFT") {
      if (item.workFlowActivity && item.workFlowActivity.length > 0) {
        let approvedData = getListOfApprovers(item.workFlowActivity);
        if (approvedData.length > 0) {
          return (
            <View style={[Styles.commonView, Styles.textView]}>
              {getListOfApprovers(item.workFlowActivity).map(
                (activity, index) => {
                  return (
                    <AppText style={Styles.commonText}>
                      {activity.displayString}
                    </AppText>
                  );
                }
              )}
            </View>
          );
        } else {
          return (
            <View style={[Styles.commonView, Styles.textView]}>
              <AppText style={Styles.commonText}>--</AppText>
            </View>
          );
        }
      } else {
        return (
          <View style={[Styles.commonView, Styles.textView]}>
            <AppText style={Styles.commonText}>--</AppText>
          </View>
        );
      }
    } else {
      return (
        <View style={[Styles.commonView, Styles.textView]}>
          <AppText style={Styles.commonText}>--</AppText>
        </View>
      );
    }
  };

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.textView]}>
        <AppText style={Styles.commonText}>{value || "-"}</AppText>
      </View>
    );
  };

  const renderTagView = (value, index) => {
    let campaignTags1 = "";
    if (value != "--" && value != null) {
      campaignTags1 = value
        .map(function (val) {
          return val.campaignTag;
        })
        .join(",");
    }
    return (
      <View style={[Styles.commonView, Styles.textView]}>
        <AppText style={Styles.commonText}>{campaignTags1 || "-"}</AppText>
      </View>
    );
  };
  function secondsToHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  }
  function convertSecondsToMinutesAndSeconds(totalSeconds) {
    if (totalSeconds) {
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = totalSeconds % 60;
      return {
        minutes,
        seconds,
      };
    } else {
      return {
        minutes: 0,
        seconds: 0,
      };
    }
  }

  const renderDurationView = (value) => {
    const { minutes, seconds } = convertSecondsToMinutesAndSeconds(value);
    return (
      <View style={[Styles.commonView, Styles.duration]}>
        <AppText style={Styles.commonText}>
          {`${minutes}m:${seconds}s` || "-"}
        </AppText>
      </View>
    );
  };

  const renderTypeView = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.typeView]}>
        <AppText style={Styles.commonText}>{value?value.toUpperCase()=="ADVERTISEMENT"?"LEMMA":value : "-"}</AppText>
      </View>
    );
  };

  const getBackgroundColor = (value) => {
    if (value?.toLowerCase() === "submitted") {
      return {
        backgroundColor: themeColor.pubGreenBack,
      };
    } else if (value?.toLowerCase() === "draft") {
      return {
        backgroundColor: themeColor.themeLight,
      };
    } else if (value?.toLowerCase() === "published") {
      return {
        backgroundColor: themeColor.draftYellowBack,
      };
    } else if (value?.toLowerCase() === "pending for approval") {
      return {
        backgroundColor: "#0056a8",
      };
    } else if (value?.toLowerCase() === "rejected") {
      return {
        backgroundColor: "#ff1f0a40",
      };
    } else if (value?.toLowerCase() === "approved") {
      return {
        backgroundColor: "#d8faff",
      };
    }
  };

  const getTextColor = (value) => {
    if (value?.toLowerCase() === "submitted") {
      return {
        color: themeColor.pubGreen,
      };
    } else if (value?.toLowerCase() === "draft") {
      return {
        color: themeColor.themeColor,
      };
    } else if (value?.toLowerCase() === "published") {
      return {
        color: themeColor.draftYellow,
      };
    } else if (value?.toLowerCase() === "pending for approval") {
      return {
        color: themeColor.white,
      };
    } else if (value?.toLowerCase() === "rejected") {
      return {
        color: "#ff1f0a",
      };
    } else if (value?.toLowerCase() === "approved") {
      return {
        color: "#00a0a0",
      };
    }
  };

  // change text input data======
  const onchange = (type, value) => {
    if (type == "Campaign Name") {
      setSearchData({ ...searchData, campaignName: value });
    } else if (type == "Created By") {
      setSearchData({ ...searchData, createdBy: value });
    } else if (type == "Tag") {
      setSearchData({ ...searchData, tags: value });
    } else if (type == "Type") {
      setSearchData({
        ...searchData,
        type: value,
        pageNumber: 1,
        noPerPage: 10,
        isUsedForUseEffect: value,
      });
    } else if (type == "State") {
      setSearchData({
        ...searchData,
        state: value,
        pageNumber: 1,
        noPerPage: 10,
        isUsedForUseEffect: value,
      });
    } else if (type == "Duration") {
      setSearchData({ ...searchData, duration: value });
    } else {
      let v;
      if (value.length > 0) {
        v = value.toUpperCase();
      }
      setSearchData({ ...searchData, state: v });
    }
  };
  //end change text input data======

  // check campaiogn==========================
  const multielectCompaign = (index) => {
 
    campaignList[index].checkStatus = !campaignList[index].checkStatus;
    let chekeddata = campaignList.filter((item) => item?.checkStatus == true);
    setCampaignData([...campaignList]);

    console.log("length", campaignList.length, chekeddata.length);
    if (chekeddata.length == campaignList.length) {
      setSelectAllCampaingFlag(true);
    } else {
      setSelectAllCampaingFlag(false);
    }
  };

  const setSelectAllCampaingFlag1 = (value) => {
    setSelectAllCampaingFlag(value);
    let campaignList1;
    if (value) {
      campaignList1 = campaignList?.map((item, index) => {
        return { ...item, checkStatus: true };
      });
    } else {
      campaignList1 = campaignList?.map((item, index) => {
        return { ...item, checkStatus: false };
      });
    }
    setCampaignData([...campaignList1]);
  };
  //End check campaiogn==========================

  const renderStateView = (value, index) => {
    return (
      <View
        style={[
          Styles.commonView,
          Styles.stateView,
          { flexDirection: "row", alignItems: "center",paddingHorizontal:1, },
        ]}
      >
        <ThemedText
          title={value.state}
          containerStyle={[Styles.statusView, getBackgroundColor(value.state)]}
          textStyles={getTextColor(value.state)}
        />

        {value.state.toLowerCase() != "draft" &&
          value.campaign_type.toUpperCase() == "NORMAL" && (
            <TouchableOpacity
              style={{ paddingLeft: 10 }}
              onPress={() => {
                setToolTipStatus(true);
                onPressToolTip(value);
                // console.log("12345676543234567",JSON.stringify(value))
                // if(value.workFlowActivity.length>0){
                //   const Workflow=value.workFlowActivity
                // console.log("wwww",JSON.stringify(value.workFlowActivity))
                //   setInfo([...Workflow])
                // }
              }}
            >
              <FontAwesome
                name={"info-circle"}
                color={themeColor.themeColor}
                size={20}
              />
            </TouchableOpacity>
          )}
      </View>
    );
  };

  const renderSchedulerItems = ({ item, index }) => {
    
    const formattedCreatedOn = moment(item?.createdOn).format("YYYY/MM/DD");
    const { minutes, seconds } = convertSecondsToMinutesAndSeconds(
      item?.duration
    );
    return (
      <View style={Styles.renderContainer}>
        <Pressable
          onPress={() => {
            multielectCompaign(index);
          }}
          style={Styles.iconView}
        >
          {item.checkStatus == false ? (
            <MaterialIcons
              name="check-box-outline-blank"
              color={themeColor.themeColor}
              size={25}
            />
          ) : (
            <MaterialIcons
              name="check-box"
              color={themeColor.themeColor}
              size={25}
            />
          )}
        </Pressable>
        <View style={Styles.nameView}>
          <AppText style={Styles.nameText}>
            {item?.campaignTitle || "-"}
          </AppText>
        </View>
        {renderTextView(item?.createdByName, index)}
        {workFlow &&
        (workFlow?.approverWorkFlow === "CAMPAIGN" ||
          workFlow?.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN")
          ? renderApprovedRejectView(formattedCreatedOn, index, item)
          : renderTextView(formattedCreatedOn, index)}
        {renderTextView(formattedCreatedOn, index)}
        {renderDurationView(item?.duration)}
        {renderTagView(item?.campaignTags, index)}
        {renderTypeView(item?.campaign_type, index)}
        {renderStateView(item, index)}
        {
          <View style={[Styles.actionViewAction,{width:'25%'}]}>
            
              {item?.campaign_type.toUpperCase() == "NORMAL" &&
              authorization.includes(PREVILAGES.CAMPAIGN.VIEW_CAMPAIGN) && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("CmpPreviwe", {
                      campaigns: [
                        {
                          campaignId: item?.campaignId,
                          campaigName: item?.campaignTitle,
                        },
                      ],
                      viewDetails: true,
                    });
                  }}
                >
                  <View style={Styles.iconBackView}>
                  <Ionicons name="eye" size={21} color={themeColor.themeColor} />

                    {/* <Image source={view} style={[Styles.actionIcons,{tintColor:themeColor.themeColor}]} /> */}
                  </View>
                </TouchableOpacity>
              )}
            {/* ======edit===== */}
            {!item.isUsed &&
              !item.archived &&
              (item.state === "DRAFT" ||
                item.state === "PENDING FOR APPROVAL" ||
                item.state === "SUBMITTED" ||
                item.state === "REJECTED" ||
                item.state === "APPROVED") &&isLocRestricted==false&&
              authorization.includes(PREVILAGES.CAMPAIGN.EDIT_CAMPAIGN) && (
                <TouchableOpacity
                  onPress={() =>
                    btnOpenModelType("Edit", item?.campaignId, item)
                  }
                >
                  <View style={Styles.iconBackView}>
                    <Image source={EditIcon} style={Styles.actionIcons} />
                  </View>
                </TouchableOpacity>
              )}
            {/* =====delete==== */}
            {item.state !== "PUBLISHED" &&isLocRestricted==false&&
              authorization.includes(PREVILAGES.CAMPAIGN.DELETE_CAMPAIGN) && (
                <TouchableOpacity
                  onPress={() => {btnOpenModelType("Delete", item?.campaignId);}}
                >
                  <View style={Styles.iconBackView}>
                    <Image source={DeleteIcon} style={Styles.actionIcons} />
                  </View>
                </TouchableOpacity>
              )}
            {/* clone======= */}
            {(!item.archived && item?.campaign_type.toUpperCase() == "NORMAL") &&isLocRestricted==false
            && authorization.includes(PREVILAGES.CAMPAIGN.ADD_CAMPAIGN) && (
              <TouchableOpacity
                onPress={() => {
                  btnOpenModelType("Clone", item?.campaignId);
                }}
              >
                <View style={Styles.iconBackView}>
                  {/* <Image source={copy} style={Styles.actionIcons} />
                   */}
                   <Ionicons
                      name="copy-outline"
                      size={18}
                      color={themeColor.themeColor}
                    />
                </View>
              </TouchableOpacity>
            )}
            {/* archive======== */}
            {!item.archived && item.state !== "PUBLISHED" && isLocRestricted==false&&
            authorization.includes(PREVILAGES.CAMPAIGN.ADD_CAMPAIGN) && (
              <TouchableOpacity
                onPress={() => {
                  btnOpenModelType("Archive", [item?.campaignId]);
                }}
              >
                <View style={Styles.iconBackView}>
                <MaterialIcons name={"archive"} size={20} color={themeColor.themeColor}/>
                </View>
              </TouchableOpacity>
            )}
            {/* ====unarchive===== */}
            {item.archived&&isLocRestricted==false&&
            authorization.includes(PREVILAGES.CAMPAIGN.ADD_CAMPAIGN) && (
              <TouchableOpacity
                onPress={() => {
                  btnOpenModelType("UnArchive", [item?.campaignId]);
                }}
              >
                <View style={Styles.iconBackView}>
                <MaterialIcons name={"unarchive"} size={20} color={themeColor.themeColor}/>
                
                </View>
              </TouchableOpacity>
            )}
            {item.canApprove &&
              workFlow &&
              item.state?.toLowerCase() == "pending for approval" &&
              (workFlow.approverWorkFlow === "CAMPAIGN" ||
                workFlow.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN") &&isLocRestricted==false
                && (
                <TouchableOpacity
                  onPress={() => {                    
                    navigation.navigate("CmpPreviwe", {
                      campaigns: [
                        {
                          campaignId: item?.campaignId,
                          campaigName: item?.campaignTitle,
                          approveState:item.state?item.state:""
                        },
                      ],
                      viewDetails: false,
                    });
                  }}
                >
                  <View style={Styles.iconBackView}>
                  <Image
                    source={viewIcon}
                    style={{ height: 20, width: 20, resizeMode: "contain" }}
                  />
                  </View>
                </TouchableOpacity>
              )}
              {authorization.includes(PREVILAGES.CAMPAIGN.ADD_CAMPAIGN)&&item?.canEditLocationBasedPlaylist && (
              <TouchableOpacity
                onPress={() => {
                  btnOpenModelType("LocationEdit", item?.campaignId, item)
                }}
              >
                <View style={Styles.iconBackView}>
                <Entypo name={"location-pin"} size={20} color={themeColor.themeColor}/>
                
                </View>
              </TouchableOpacity>
            )}
          </View>
        }
      </View>
    );
  }

  const ListEmptyComponent = ({ item }) => {
    return (
     <View style={{backgroundColor:"white"}}>
       <Text
        style={{
          padding: 10,
          fontSize: 18,
          marginLeft: 30 ,
          color: "black",
        }}
      >
        {!isListDataLoading?"No Data Found":"Loading..."}
      </Text>
     </View>
    );
  };
  const [toolTipStatus, setToolTipStatus] = useState(false);
  const [pinnedPlanogram, setPinnedPlanogram] = useState(null);
  const onPressToolTip = (planogram) => {
    setToolTipStatus(true);
    setPinnedPlanogram(planogram);
  };
  return (
    <ScrollView
      bounces={false}
      horizontal={true}
      style={Styles.mainContainer}
      showsHorizontalScrollIndicator={false}
    >
      <PlanogramToolPin
        visible={toolTipStatus}
        pinnedPlanogram={pinnedPlanogram}
        setToolTipStatus={setToolTipStatus}
      />
      {/* {infoModal&&<SchedulerInfoModal setModal={closeModal} details={info}/>} */}
      <FlatList
        keyExtractor={(item, index) => {
          return `index${index}`
        }}
        scrollEnabled={false}
        data={campaignList}
        renderItem={renderSchedulerItems}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={
          <CampaignScrollHeader
            workFlow={workFlow}
            setIsLoading={setIsLoading}
            campaignForm={campaignForm}
            searchData={searchData}
            onchange={onchange}
            setSearchData={setSearchData}
            makeUrlData={makeUrlData}
            selectAllCampaingFlag={selectAllCampaingFlag}
            setSelectAllCampaingFlag={setSelectAllCampaingFlag1}
          />
        }
      />
    </ScrollView>
  );
};

export default CampaignBody;

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      width: "100%",
      marginBottom: moderateScale(10),
    },
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: "contain",
    },
    actionView: {
      backgroundColor: "white",
      width: "15%",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    iconBackView: {
      height: moderateScale(30),
      width: moderateScale(30),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: moderateScale(15),
      padding: moderateScale(2),
      marginRight: moderateScale(8),
    },
    nameView: {
      width: "14.5%",
      margin: 0,
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
    },
    commonView: {
      width: "17%",
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      // paddingHorizontal: moderateScale(15),
    },
    actionViewAction: {
     // width: "14%",
      marginVertical: moderateScale(0.5),
      backgroundColor: COLORS.white,
      paddingLeft: 20,
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(4),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    renderContainer: {
      flexDirection: "row",
      // width: "100%",
      margin: moderateScale(0.5),
    },
    statusView: {
      marginVertical: moderateScale(5),
      paddingVertical: moderateScale(7),
      alignSelf: "center",
    },
    textView: { width: "10%" },
    duration: { width: "9%" },
    typeView: { width: "10%" },
    stateView: { alignItems: "center", width: "10.5%" },
  });
