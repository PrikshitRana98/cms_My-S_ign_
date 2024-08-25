import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Foundation from "react-native-vector-icons/Foundation";
import FontAwesome from "react-native-vector-icons/FontAwesome"
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import ThemedText from "../../../Atoms/ThemedText";
import PlanogramScrollHeader from "./planogramHeaderScroll";
import moment from "moment";
import DeleteIcon from "../../../../Assets/Images/PNG/delete.png";
import Feather from "react-native-vector-icons/Feather";
import Fontisto from "react-native-vector-icons/Fontisto";
import DownArr from "../../../../Assets/Images/PNG/down_arr.png";
import UpArrow from "../../../../Assets/Images/PNG/up_arr.png";
import pause from "../../../../Assets/Images/PNG/pause.png";
import viewIcon from "../../../../Assets/Images/PNG/document.png";

import { useNavigation } from "@react-navigation/native";
import { NAVIGATION_CONSTANTS } from "../../../../Constants/navigationConstant";
import { useSelector } from "react-redux";
import { PREVILAGES } from "../../../../Constants/privilages";
import PlanogramToolPin from "./PlanogramToolPin";

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
export const schedulers = [
  {
    Schedulername: data[0],
    created_by: "User 1",
    datetime: "2023-05-15T12:30:00Z",
    created_on: "2023-05-15",
    state: "Draft",
    running: true,
    action_status: "in progress",
  },
  {
    Schedulername: data[1],
    created_by: "User 2",
    datetime: "2023-05-16T08:00:00Z",
    created_on: "2023-05-16",
    state: "Draft",
    running: false,
    action_status: "completed",
  },
  {
    Schedulername: data[2],
    created_by: "User 3",
    datetime: "2023-05-17T16:45:00Z",
    created_on: "2023-05-17",
    state: "Draft",
    running: false,
    action_status: "not started",
  },
  {
    Schedulername: data[3],
    created_by: "User 4",
    datetime: "2023-05-18T11:15:00Z",
    created_on: "2023-05-18",
    state: "Draft",
    running: false,
    action_status: "not started",
  },
  {
    Schedulername: data[4],
    created_by: "User 5",
    datetime: "2023-05-19T17:30:00Z",
    created_on: "2023-05-19",
    state: "Draft",
    running: true,
    action_status: "in progress",
  },
  {
    Schedulername: data[5],
    created_by: "User 1",
    datetime: "2023-05-20T14:45:00Z",
    created_on: "2023-05-20",
    state: "Published",
    running: false,
    action_status: "completed",
  },
  {
    Schedulername: data[6],
    created_by: "User 2",
    datetime: "2023-05-21T09:00:00Z",
    created_on: "2023-05-21",
    state: "Draft",
    running: true,
    action_status: "in progress",
  },
  {
    Schedulername: data[7],
    created_by: "User 3",
    datetime: "2023-05-22T16:15:00Z",
    created_on: "2023-05-22",
    state: "Draft",
    running: false,
    action_status: "not started",
  },
  {
    Schedulername: data[8],
    created_by: "User 4",
    datetime: "2023-05-23T10:30:00Z",
    created_on: "2023-05-23",
    state: "Published",
    running: false,
    action_status: "not started",
  },
];
const PlanogramBody = ({
  plonogramList,
  filterData,
  setFilterData,
  btnPlonogramData,
  btnPlonogramData1,
  btnOpenModelType,
  setPlanogramList,
  workFlow,
}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const [selectedPlanogramString, setSelectedPlanogramString] = useState("");
  const navigation = useNavigation();
  const { authorization, isApprover } = useSelector((state) => state.userReducer); 

  const [searchQuery, setSearchQuery] = useState("");

  const onchange = (type, value, sortUnsort = "no") => {

    if (type == "Planogram Name" && sortUnsort == "yes") {
      setFilterData({
        ...filterData,
        sortByPlanogramName: !filterData.sortByPlanogramName,
      });
    } else if (type == "Created On" && sortUnsort == "yes") {
      
      btnPlonogramData1();
    } else if (type == "Planogram Name") {
      setFilterData({ ...filterData, PlanogramName: value });
    } else if (type == "Created By") {
      setFilterData({ ...filterData, CreatedBy: value });
    } else if(type == "State"){
      setFilterData({ ...filterData, state: value });
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
  const renderState = (value, index,item) => {
    return (
      <View
        style={[
          Styles.commonView,
          { width: returnwidth(), flexDirection: "row", alignItems: "center" },
        ]}
      >
        <ThemedText
          title={value}
          containerStyle={[Styles.statusView, getBackgroundColor(value)]}
          textStyles={getTextColor(value)}
        />
        {
          
        (item.state.toLowerCase()!="draft")&&
          <Pressable onPress={()=>{
            onPressToolTip(item)
          }}>
             <FontAwesome name={"info-circle"} color={themeColor.themeColor} size={20}/>
          </Pressable>
        }
      </View>
    );
  };
  const renderRunning = (value, index) => {
    // console.log("this is render running of plano==>\n",value)
    return (
      <View style={[Styles.commonView, { width: returnwidth() }]}>
        <AppText style={Styles.commonText}>
          {value ? "Running" : "Not Running"}
        </AppText>
      </View>
    );
  };

  const deleteCampaign = (item) => {
    btnOpenModelType("DeleteCampaign", item);
  };

  const btnAllCheckUnchecked = (value) => {
    let planogramList1;
    if (value) {
      planogramList1 = plonogramList?.map((item, index) => {
        return { ...item, checkStatus: true };
      });
    } else {
      planogramList1 = plonogramList?.map((item, index) => {
        return { ...item, checkStatus: false };
      });
    }
    setPlanogramList([...planogramList1]);
  };

  const returnwidth = () => {
    let value = 100 / 7;
    if (
      (workFlow && workFlow?.approverWorkFlow == "PLANOGRAM") ||
      workFlow?.approverWorkFlow == "PLANOGRAM_AND_CAMPAIGN"
    ) {
      value = 100 / 8;
    }
    return `${value}%`;
  };

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView, { width: returnwidth() }]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };

  const renderTimeView = (value, index) => {
    return (
      <View style={[Styles.commonView, { width: returnwidth(),paddingHorizontal:5 }]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };

  const renderAction = (id, item) => {
    return (
      <View style={[Styles.actionView, { width: returnwidth() }]}>
        {authorization.includes(PREVILAGES.PLANOGRAM.VIEW_PLANOGRAM) && <TouchableOpacity
          style={Styles.iconBackView}
          onPress={() =>
            navigation.navigate("PlanogramApproveView", {
              item: item,
              buttonShow:false,
            })
          }
        >
          <Ionicons name="eye" size={18} color={themeColor.themeColor} />
        </TouchableOpacity>}

        
        
        {item.state != "PUBLISHED" &&authorization.includes(PREVILAGES.PLANOGRAM.DELETE_PLANOGRAM) &&  (
          <Pressable
            onPress={() => {
              btnOpenModelType("Delete", id);
            }}
            style={Styles.iconBackView}
          >
           
           <Image source={DeleteIcon} 
              style={{height: moderateScale(20),
                    width: moderateScale(20),
                    resizeMode: "contain",
                  }} 
            />
          </Pressable>
        )}

        {isApprover && <Pressable
          style={Styles.iconBackView}
          onPress={() => {
            btnOpenModelType("Clone", id);
          }}
        >
          <Ionicons
            name="copy-outline"
            size={18}
            color={themeColor.themeColor}
          />
        </Pressable>}

        {item.state?.toLowerCase() === "published"&&item.planogramStopButtonAction!="HIDE"&& authorization.includes(PREVILAGES.PLANOGRAM.EDIT_PLANOGRAM) && (
          <TouchableOpacity
            style={[Styles.iconBackView,{justifyContent:"center",alignItems:"center",padding:0}]}
            onPress={() => btnOpenModelType("PAUSE", id)}
          >
            <Ionicons name={"stop-circle-outline"} color={themeColor.themeColor} size={24}/>
          </TouchableOpacity>
        )}
        {item.state?.toLowerCase() === "published"&&item.planogramStopped==true&& authorization.includes(PREVILAGES.PLANOGRAM.EDIT_PLANOGRAM) && (
          <TouchableOpacity
            style={[Styles.iconBackView,{justifyContent:"center",alignItems:"center",padding:0}]}
            activeOpacity={1}
          >
            <Feather name={"minus-circle"} color={themeColor.red} size={24}/>
          </TouchableOpacity>
        )}
        
        {item.state != "PUBLISHED" && authorization.includes(PREVILAGES.PLANOGRAM.EDIT_PLANOGRAM) && (
          <Pressable
            onPress={() =>
              navigation.navigate(NAVIGATION_CONSTANTS.PLANOGRAM_EDIT, {
                planogramItem: item,
              })
            }
            style={Styles.iconBackView}
          >
            <Feather name="edit" size={20} color={themeColor.themeColor} />
          </Pressable>
        )}
        {workFlow &&
          item.canApprove &&
          item.state?.toLowerCase() == "pending for approval" &&
          (workFlow.approverWorkFlow === "PLANOGRAM" ||
            workFlow.approverWorkFlow === "PLANOGRAM_AND_CAMPAIGN") && (
            <Pressable
              onPress={() =>
                navigation.navigate("PlanogramApproveView", {
                  item: item,
                  buttonShow:true,
                })
              }
              style={Styles.iconBackView}
            >
              <View style={Styles.iconBackView}>
              <Image
                            source={viewIcon}
                            style={{ height: 20, width: 20, resizeMode: "contain" }}></Image>
              {/* <Fontisto name="copy" color={themeColor.themeColor} size={20} /> */}
              {/* <Ionicons
            name="copy-outline"
            size={20}
            color={themeColor.themeColor}
          /> */}
              </View>
            </Pressable>
          )}
      </View>
    );
  };

  const multielectCompaign = (index) => {
    plonogramList[index].checkStatus = !plonogramList[index].checkStatus;
    setPlanogramList([...plonogramList]);
  };
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

  const renderSchedulerItems = ({ item, index }) => {
    const formattedCreatedOn = moment(item?.createdOn).format("DD/MM/YYYY");
    const formattedStartDate = moment(item.startDate).format("DD-MM-YYYY");
    const formattedEndDate = moment(item.endDate).format("DD-MM-YYYY");
    const formattedStartTime = moment(item.startTime, "HH:mm:ss").format(
      "hh:mm A"
    );
    const formattedEndTime = moment(item.endTime, "HH:mm:ss").format("hh:mm A");

    return (
      <React.Fragment key={item.planogramId}>
        <View style={Styles.renderContainer}>
          <View style={{ width: returnwidth(), flexDirection: "row" }}>
            <Pressable
              onPress={() => {
                multielectCompaign(index);
              }}
              style={[Styles.iconView, { width: "30%" }]}
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
              activeOpacity={1}
              style={[Styles.nameView, { width: "80%" }]}
            >
              <AppText style={Styles.nameText}>{item.title}</AppText>
              <Image
                source={
                  selectedPlanogramString === item.planogramName
                    ? DownArr
                    : UpArrow
                }
                style={Styles.downStyles}
              />
            </TouchableOpacity>
          </View>

          {renderTextView(item.createdByName, index)}
          {workFlow &&
            (workFlow?.approverWorkFlow == "PLANOGRAM" ||
            workFlow?.approverWorkFlow == "PLANOGRAM_AND_CAMPAIGN")&&
            renderApprovedRejectView(formattedCreatedOn, index, item)}

          {item.startDate && item.endDate && item.startTime && item.endTime
            ? renderTimeView(
                `${formattedStartDate} - ${formattedEndDate}, ${formattedStartTime} - ${formattedEndTime}`,
                index
              )
            : renderTextView("----", index)}

          {renderTextView(formattedCreatedOn, index)}
          {renderState(item.state, index,item)}
          {renderRunning(item.isCurrentlyRunning, index)}
          {renderAction(item.planogramId, item)}
        </View>
      </React.Fragment>
    );
  };

  const [toolTipStatus,setToolTipStatus]=useState(false)
  const [pinnedPlanogram,setPinnedPlanogram]=useState([])
  const onPressToolTip=(planogram)=>{
    setToolTipStatus(true)
    setPinnedPlanogram(planogram)
  }
  const ListEmptyComponent =  ({ item }) => {
    return (
      <View key={"bssd31a"} style={{padding:15,backgroundColor:themeColor.appBackground,marginTop:15}}>
        <AppText
        style={{
          padding: 10,
          fontSize: 18,
          // marginLeft:width/2-80,
          color:'black',
        }}
      >
        No Data Found
      </AppText>
      </View>
    );
  };
  return (
    <ScrollView
      horizontal={true}
      style={Styles.mainContainer}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      btnAllCheckUnchecked
    >
      <PlanogramToolPin
        visible={toolTipStatus}
        pinnedPlanogram={pinnedPlanogram}
        setToolTipStatus={setToolTipStatus}
      />
      <FlatList
        scrollEnabled={false}
        data={plonogramList}
        // keyExtractor={(item,index)=>item.planogramId}
        renderItem={renderSchedulerItems}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={
          <PlanogramScrollHeader
            filterData={filterData}
            onchange={onchange}
            workFlow={workFlow}
            btnPlonogramData={btnPlonogramData}
            btnAllCheckUnchecked={btnAllCheckUnchecked}
          />
        }
      />
    </ScrollView>
  );
};

export default React.memo(PlanogramBody);

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      width: "100%",
    },
    nameView: {
      width: "20%",
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
    },
    iconStyle: {
      height: moderateScale(18),
      width: moderateScale(18),
      resizeMode: "contain",
    },
    iconBackView1: {
      height: moderateScale(25),
      width: moderateScale(25),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
    commonView: {
      marginHorizontal: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(10),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    renderContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      margin: moderateScale(0.5),
    },
    statusView: {
      margin: moderateScale(5),
      paddingVertical: moderateScale(7),
      alignSelf: "center",
    },
    textView: { width: "12%" },
    actionView: {
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "flex-start",
      flexDirection: "row",
    },
    runningView: { width: "12%" },
    stateView: { alignItems: "center", width: "12%", flexDirection: "row" },
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
      marginHorizontal: moderateScale(5),
    },
  });
