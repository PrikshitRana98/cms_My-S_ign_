import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import SearchBox from "../../../Atoms/SearchBox";
import AppText from "../../../Atoms/CustomText";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import AppTextInput from "../../../Atoms/AppTextInputs";
import {
  getCampaignData,
  getCampaignSearchData,
} from "../../../../screens/Campaign/CompainApi";
import CampaignDropDown from "./CampaignDropDown";



const CampaignScrollHeader = ({
  onchange,
  searchData,
  makeUrlData,
  selectAllCampaingFlag,
  setSelectAllCampaingFlag,
  workFlow
}) => {
  
  let headerData =  []
  let statusArr=[]
  
  
  if(workFlow && (workFlow.approverWorkFlow === "CAMPAIGN" || workFlow.approverWorkFlow ==='PLANOGRAM_AND_CAMPAIGN')){
    headerData=[
      "Campaign Name",
      "Created By",
      "Approved/Rejected By",
      "Published On",
      "Duration",
      "Tag",
      "Type",
      "State",
      "Action",
    ];
    statusArr=[
      { label: "All", value: "" },
      { label: "Draft", value: "DRAFT" },
      { label: "Published", value: "PUBLISHED" },
      { label: "Approved", value: "APPROVED" },
      { label: "Rejected", value: "REJECTED" },
      { label: "Pending for approval", value: "PENDING_FOR_APPROVAL" },
    ]
  }else{
    
    headerData=[
      "Campaign Name",
      "Created By",
      "Created On",
      "Published On",
      "Duration",
      "Tag",
      "Type",
      "State",
      "Action",
    ];
    statusArr=[
      { label: "All", value: "" },
      { label: "DRAFT", value: "DRAFT" },
      { label: "SUBMITTED", value: "SUBMITTED" },
      { label: "PUBLISHED", value: "PUBLISHED" },
    ]
  }




  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const [checkboxAll, setCheckboxAll] = useState(false);

  const returnValue = (value) => {
    switch (value) {
      case "Campaign Name":
        return searchData.name;
        break;
      case "Created By":
        return searchData.created_by;
        break;
      case "State":
        return searchData.state;
        break;
      case "Tag":
        return searchData.tags;
        break;
      case "Type":
        return searchData.type;
        break;
      case "Duration":
        return searchData.duration;
        break;
      default:
        break;
    }
  };
  return (
    <View style={Styles.headerView}>
      <Pressable
        onPress={() => {
          setSelectAllCampaingFlag(!selectAllCampaingFlag);
        }}
        style={Styles.iconCenterView}
      >
        {selectAllCampaingFlag == false ? (
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
      {headerData?.map((item, index) => {
        return (
          <View key={item + index} style={[Styles.mainContainer(index)]}>
            <View style={Styles.headerContainer}>
              <AppText style={Styles.boldText}>{item}</AppText>
              {/* {index <= 3 && (
                <View style={Styles.alignIcon}>
                  <Ionicons
                    name="chevron-up"
                    size={15}
                    color={themeColor.black}
                  />
                  <Ionicons
                    name="chevron-down"
                    size={15}
                    color={themeColor.black}
                  />
                </View>
              )} */}
            </View>

            {item == "Type" && (
              <CampaignDropDown
                dataList={[
                  { label: "All", value: "" },
                  { label: "NORMAL", value: "NORMAL" },
                  { label: "LEMMA", value: "ADVERTISEMENT" },
                  { label: "MOVING WALL", value: "MOVING_WALL" },
                  
                ]}
                placeHolderText="Type"
                containerStyle={Styles.textcontainer("dropdown")}
                onChange={(e) => {
                  onchange(item, e.value);
                }}
                value={returnValue(item)}
              />
            )}

            {item == "State" && (
              <CampaignDropDown
                dataList={statusArr}
                placeHolderText="State"
                containerStyle={Styles.textcontainer("dropdown")}
                onChange={(e) => {
                  onchange(item, e.value);
                }}
                value={returnValue(item)}
              />
            )}
            {(item == "Campaign Name" ||
              item == "Created By" ||
              item == "Tag") && (
              <View style={[Styles.textcontainer("input")]}>
                <TextInput
                  style={[Styles.textInputStyle]}
                  placeholder={`Search by `+item}
                  placeholderTextColor={"#00000026"}
                  value={returnValue(item)}
                  onSubmitEditing={(e) => {
                    makeUrlData(1,10);
                  }}
                  onChangeText={(value) => {
                    onchange(item, value);
                  }}
                />
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default CampaignScrollHeader;
const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: (index) => ({
      paddingHorizontal: moderateScale(5),
      justifyContent: "center",
      marginHorizontal: moderateScale(2),
      width: index === 0 ? "15%" :index === 4 ?"8.5%":index === 7 ?"10.5%": "10%",
    }),
    headerContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: moderateScale(5),
      height: moderateScale(50),
    },
    iconView: {
      backgroundColor: COLORS.white,
    },
    iconRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    boldText: {
      fontSize: moderateScale(16),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    searchView: {
      marginHorizontal: moderateScale(10),
      width: "90%",
      // height: moderateScale(40),
    },
    alignIcon: {
      justifyContent: "center",
      alignItems: "center",
    },
    renderContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
      flexDirection: "row",
      alignItems: "center",
    },
    iconCenterView: {
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    headerView: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: moderateScale(width *5.8),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: "100%",
      color:COLORS.textColor,
    },
    textcontainer: (type) => ({
      width: "85%",
      backgroundColor: COLORS.white,
      alignSelf:"flex-start",
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(5),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
  });
