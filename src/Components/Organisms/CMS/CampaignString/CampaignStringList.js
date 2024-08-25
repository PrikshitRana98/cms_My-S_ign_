import React, { useState } from "react";
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
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import DownArr from "../../../../Assets/Images/PNG/down_arr.png";
import UpArrow from "../../../../Assets/Images/PNG/up_arr.png";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import CampaignStringScrollHeader from "./CampaignStringScrollHeader";
import viewIcon from "../../../../Assets/Images/PNG/document.png" 
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import DeleteIcon from "../../../../Assets/Images/PNG/delete.png";
import ThemedText from "../../../Atoms/ThemedText";
import CampaignChildList from "./CampaignChild";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
// import {campaignStringData} from './constants';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { PREVILAGES } from "../../../../Constants/privilages";
import PlanogramToolPin from "../Planogram/PlanogramToolPin";

const CampaignStringList = ({
  campaignStringList,
  filterData,
  setFilterData,
  btnCampaignStringData,
  btnOpenModelType,
  setCampaignStrList,
  selectAllCampaingFlag,
  setSelectAllCampaingFlag,
  workFlow,
}) => {
  const themeColor = useThemeContext();
  const Styles = CampaignStringStyles(themeColor);
  const [selectedCampaignString, setSelectedCampaignString] = useState("");
  const navigation = useNavigation();
  const { authorization, isApprover , customerRole} = useSelector(
    (state) => state.userReducer
  );

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commoncell, { width: returnwidth() }]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };
  const numberOffLoops = (value, index) => {
    let campaigns = value.campaigns;
    let noOfLoops = campaigns.reduce((acc, a) => acc + a.numberOfLoops, 0);
    return (
      <View style={[Styles.commoncell, { width: returnwidth() }]}>
        <AppText style={Styles.commonText}>{noOfLoops}</AppText>
      </View>
    );
  };

  const getBackgroundColor = (value) => {
    if (value?.toLowerCase() === "published") {
      return {
        backgroundColor: themeColor.pubGreenBack,
      };
    } else if (value?.toLowerCase() === "submitted") {
      return {
        backgroundColor: themeColor.themeLight,
      };
    } else if (value?.toLowerCase() === "draft") {
      return {
        backgroundColor: themeColor.draftYellowBack,
      };
    }
  };

  const getTextColor = (value) => {
    if (value?.toLowerCase() === "published") {
      return {
        color: themeColor.pubGreen,
      };
    } else if (value?.toLowerCase() === "submitted") {
      return {
        color: themeColor.themeColor,
      };
    } else if (value?.toLowerCase() === "draft") {
      return {
        color: themeColor.draftYellow,
      };
    }
  };

  const onchange = (type, value) => {
    if (type == "Campaign String") {
      setFilterData({ ...filterData, name: value });
    } else if (type == "Created By") {
      setFilterData({ ...filterData, created_by: value });
    } else if(type=="State"){
      setFilterData({ ...filterData, state: value });
    }
  };

  const renderState = (item, index) => {
    return (
      <View
        style={[
          Styles.commoncell,
          { width: returnwidth(), flexDirection: "row" },
        ]}
      >
        <ThemedText
          title={item.state}
          containerStyle={[Styles.statusView, getBackgroundColor(item.state)]}
          textStyles={getTextColor(item.state)}
        />

        {item.state.toLowerCase() != "draft" && (
          <Pressable
            style={{ marginLeft: 3 }}
            onPress={() => {
              onPressToolTip(item);
            }}
          >
            <FontAwesome
              name={"info-circle"}
              color={themeColor.themeColor}
              size={20}
            />
          </Pressable>
        )}
      </View>
    );
  };

  const deleteCampaign = (item) => {
    console.log("itemitem", item);
    btnOpenModelType("DeleteCampaign", item);
  };

  const renderAction = (id, item) => {
    return (
      <View
        style={[
          Styles.commoncell,
          { width: returnwidth(), flexDirection: "row",justifyContent:'flex-start' },
        ]}
      >
        {/* ======view detail====== */}
        { authorization.includes(
            PREVILAGES.CAMPAIGN_STRING.VIEW_CAMPAIGN_STRING
          ) && (
            <Pressable
              onPress={() =>
                
                navigation.navigate("CampaignStringDetails", {
                  campaigns: item?.campaigns,
                  viewDetails: true,
                  campaignString: item,
                })
              }
              style={Styles.iconBackView}
            >
              <Ionicons name="eye" size={20} color={themeColor.themeColor} />
            </Pressable>
          )}
        {/* ======edit campign string===== */}
       
        {item.isUsed != true &&
          item.state != "PUBLISHED" &&
          authorization.includes(
            PREVILAGES.CAMPAIGN_STRING.EDIT_CAMPAIGN_STRING
          ) && (
            <Pressable
              onPress={() =>
                navigation.navigate(
                  NAVIGATION_CONSTANTS.CAMPAIGN_EDIT_STRING,
                  {
                    campaignItem: item,
                  }
                )
              }
              style={Styles.iconBackView}
            >
              <Feather name="edit" size={20} color={themeColor.themeColor} />
            </Pressable>
          )}
        {/* /* ======delete campign string===== */}
        {item.state != "PUBLISHED" &&
          authorization.includes(
            PREVILAGES.CAMPAIGN_STRING.DELETE_CAMPAIGN_STRING
          ) &&  (
            <Pressable
              onPress={() => {
                btnOpenModelType("Delete", id);
              }}
              style={Styles.iconBackView}
            >
              <Image source={DeleteIcon} style={Styles.iconStyle} />
            </Pressable>
          )}
        {/* ======clone campign string===== */}

        {(authorization.includes(
          PREVILAGES.CAMPAIGN_STRING.ADD_CAMPAIGN_STRING
        )) && (
          <Pressable
            style={Styles.iconBackView}
            onPress={() => {
              btnOpenModelType("Clone", id);
            }}
          >
            <Ionicons
              name="copy-outline"
              size={20}
              color={themeColor.themeColor}
            />
          </Pressable>
        )}

        {/* =====approval====== */}
        {item.canApprove && item.state === "PENDING FOR APPROVAL" && (
          <Pressable
            style={Styles.iconBackView}
            onPress={() => {
              navigation.navigate("CampaignStringDetails", {
                campaigns: item?.campaigns,
                viewDetails: false,
                campaignString: item,
              });
              // navigation.navigate("CampainDtringDetails", {
              //   campaignItem: item?.campaigns,
              //   campaignString: item,
              // });
            }}
          >
             <Image
              source={viewIcon}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
          </Pressable>
        )}
      </View>
    );
  };

  const multielectCompaign = (index) => {
    campaignStringList[index].checkStatus =
      !campaignStringList[index].checkStatus;
    setCampaignStrList([...campaignStringList]);

    let chekeddata = campaignStringList.filter(
      (item) => item.checkStatus == true
    );
    if (chekeddata.length == campaignStringList.length) {
      setSelectAllCampaingFlag(true);
    } else {
      setSelectAllCampaingFlag(false);
    }
  };

  const setSelectAllCampaingFlag1 = (value) => {
    setSelectAllCampaingFlag(value);
    let campaignStrList1;
    if (value) {
      campaignStrList1 = campaignStringList?.map((item, index) => {
        return { ...item, checkStatus: true };
      });
    } else {
      campaignStrList1 = campaignStringList?.map((item, index) => {
        return { ...item, checkStatus: false };
      });
    }
    setCampaignStrList([...campaignStrList1]);
  };

  const getListOfApprovers = (approversArray) => {
    let approvalNameArray = [];
    for (let index = 0; index < approversArray.length; index++) {
      if (approversArray[index]?.workFlowActivityType === "SUBMIT") break;
      approvalNameArray.push(approversArray[index]);
    }
    return approvalNameArray;
  };

  const renderApprovedRejectView = (value, index, item) => {
    if (item.state !== "DRAFT") {
      if (item.workFlowActivity && item?.workFlowActivity.length > 0) {
        let approvedData = getListOfApprovers(item.workFlowActivity);
        if (approvedData.length > 0) {
          return (
            <View style={[Styles.commonView, { width: returnwidth() }]}>
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
            <View style={[Styles.commonView, { width: returnwidth() }]}>
              <AppText style={Styles.commonText}>--</AppText>
            </View>
          );
        }
      } else {
        return (
          <View style={[Styles.commonView, { width: returnwidth() }]}>
            <AppText style={Styles.commonText}>--</AppText>
          </View>
        );
      }
    } else {
      return (
        <View style={[Styles.commonView, { width: returnwidth() }]}>
          <AppText style={Styles.commonText}>--</AppText>
        </View>
      );
    }
  };

  const renderCampaignStringItems = ({ item, index }) => {
    return (
      <React.Fragment key={item.campaignStringName + index}>
        <View style={Styles.renderContainer}>
          <View style={{ width: returnwidth(), flexDirection: "row" }}>
            <Pressable
              onPress={() => {
                multielectCompaign(index);
              }}
              style={[Styles.iconView, { width: "20%" }]}
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

            <TouchableOpacity
              onPress={() => {
                if (selectedCampaignString === item.campaignStringName) {
                  setSelectedCampaignString("");
                } else {
                  setSelectedCampaignString(item.campaignStringName);
                }
              }}
              style={[Styles.nameView, { width: "80%" }]}
            >
              <AppText style={Styles.nameText}>
                {item.campaignStringName}
              </AppText>
              <Image
                source={
                  selectedCampaignString === item.campaignStringName
                    ? DownArr
                    : UpArrow
                }
                style={Styles.downStyles}
              />
            </TouchableOpacity>
          </View>
          {renderTextView(item.createdByFullName, index)}
          {workFlow &&
            workFlow?.approverWorkFlow == "CAMPAIGN_STRING" &&
            renderApprovedRejectView("sa", index, item)}
          {renderDuretionView(item.displayDurationInSeconds, index)}
          {numberOffLoops(item, index)}
          {renderState(item, index)}
          {renderAction(item.campaignStringId, item)}
        </View>
        {selectedCampaignString === item.campaignStringName ? (
          <CampaignChildList
            data={item.campaigns}
            workFlow={workFlow}
            itemData={item}
            deleteCampaign={deleteCampaign}
          />
        ) : null}
      </React.Fragment>
    );
  };

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

  const returnwidth = () => {
    let value = 100 / 6;
    if (workFlow && workFlow?.approverWorkFlow == "CAMPAIGN_STRING") {
      value = 100 / 7;
    }
    // console.log(value,'widthlist')
    return `${value}%`;
  };

  const renderDuretionView = (value) => {
    const { minutes, seconds } = convertSecondsToMinutesAndSeconds(value);
    return (
      <View
        style={[
          Styles.commoncell,
          {
            width: returnwidth(),
            flexDirection: "row",
            justifyContent: "space-between",
            
          },
        ]}
      >
        <View style={Styles.durationCell}></View>
        <View style={[Styles.durationCell,{padding:0,}]}>
          <AppText style={[Styles.commonText,{textAlign:"center",margin:0,width:"100%"}]}>
            {`${minutes}m:${seconds}s` || "-"}
          </AppText>
        </View>
      </View>
    );
  };
  const ListEmptyComponent = ({ item }) => {
    return (
      <View style={{backgroundColor:themeColor.white}}>
        <Text
        style={{
          padding: 10,
          fontSize: 16,
          marginLeft: width / 3 - 80,
          color: "black",
          }}
      >
        No Data Found
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
    <>
      <PlanogramToolPin
        visible={toolTipStatus}
        pinnedPlanogram={pinnedPlanogram}
        setToolTipStatus={setToolTipStatus}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={Styles.mainContainer}
      >
        <FlatList
          scrollEnabled={false}
          data={campaignStringList}
          renderItem={renderCampaignStringItems}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={
            <CampaignStringScrollHeader
              filterData={filterData}
              onchange={onchange}
              workFlow={workFlow}
              btnCampaignStringData={btnCampaignStringData}
              setSelectAllCampaingFlag={setSelectAllCampaingFlag1}
              selectAllCampaingFlag={selectAllCampaingFlag}
            />
          }
        />
      </ScrollView>
    </>
  );
};

export default CampaignStringList;

const CampaignStringStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.cardBorder,
      width: "100%",
      margin: 10,
    },
    campaignContainer: {
      backgroundColor: COLORS.white,
      paddingStart: 30,
    },
    renderContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      margin: moderateScale(0.5),
    },
    renderCampaignContainer: {
      flexDirection: "row",
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: "contain",
    },
    nameView: {
      backgroundColor: COLORS.white,
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    downStyles: {
      height: moderateScale(7),
      width: moderateScale(11),
      resizeMode: "contain",
      tintColor: COLORS.themeColor,
    },
    commonView: {
      width: "12.5%",
      marginHorizontal: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(5),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    iconBackView: {
      height: moderateScale(32),
      width: moderateScale(32),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    stateView: { alignItems: "center", justifyContent: "center", width: "15%" },
    statusView: {
      alignSelf: "center",
    },
    commoncell: {
      marginHorizontal: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(5),
    },
    durationCell: {
      width: "50%",
      marginHorizontal: moderateScale(0.5),
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScale(5),
    },
  });
