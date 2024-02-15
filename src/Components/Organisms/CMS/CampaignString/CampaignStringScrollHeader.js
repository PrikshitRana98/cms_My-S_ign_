import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UpDownArr from "../../../../Assets/Images/PNG/updown.png";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import HeaderSearch from "../../../Atoms/HeaderSearch";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import CampaignDropDown from "../Campaign/CampaignDropDown";

const CampaignStringScrollHeader = ({
  btnCampaignStringData,
  onchange,
  filterData,
  selectAllCampaingFlag,
  setSelectAllCampaingFlag,
  workFlow,
}) => {
  const themeColor = useThemeContext();
  const Styles = HeaderStyles(themeColor);
  const regEx = new RegExp("[ /]");
  let HeaderData = [
    "Campaign String",
    "Created By",
    "Duration",
    "No. of Loops",
    "State",
    "Action",
  ];
  let actionData = [
    { label: "All", value: "" },
    { label: "DRAFT", value: "DRAFT" },
    { label: "SUBMITTED", value: "SUBMITTED" },
    { label: "PUBLISHED", value: "PUBLISHED" },
  ];
  // console.log("workFlow.approverWorkFlow", workFlow?.approverWorkFlow);
  if (workFlow && workFlow?.approverWorkFlow === "CAMPAIGN_STRING") {
    HeaderData = [
      "Campaign String",
      "Created By",
      "Approved/ Rejected",
      "Duration",
      "No. of Loops",
      "State",
      "Action",
    ];
    actionData = [
      { label: "All", value: "" },
      { label: "DRAFT", value: "DRAFT" },
      { label: "PUBLISHED", value: "PUBLISHED" },
      { label: "APPROVED", value: "APPROVED" },
      { label: "REJECTED", value: "REJECTED" },
      { label: "PENDING FOR APPROVAL", value: "PENDING_FOR_APPROVAL" },
    ];
  }

  const returnwidth = () => {
    let value = 100 / 6;
    if (workFlow && workFlow?.approverWorkFlow == "CAMPAIGN_STRING") {
      value = 100 / 7;
    }
    // console.log(value, "width");
    return `${value}%`;
  };

  const returnValue = (value) => {
    switch (value) {
      case "Campaign String":
        return filterData.name;
        break;
      case "Created By":
        return filterData.created_by;
        break;
      case "State":
        return filterData.state;
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
      {HeaderData?.map((item, index) => {
        return (
          <View
            key={item + index}
            style={[Styles.mainContainer(returnwidth())]}
          >
            <View
              style={
                // item == "Duration"? 
                  Styles.headerContainercenter
                  // : Styles.headerContainer
              }
            >
              {/* {item == "Duration" ? ( */}
                <AppText style={[Styles.boldText, { textAlign: "center" }]}>
                  {item}
                </AppText>
              {/* ) : (
                <AppText style={Styles.boldText}>{item}</AppText>
              )} */}
            </View>
          
            {item == "Duration" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                }}
              >
                <AppText style={Styles.boldText}>{"Campaign"}</AppText>
                <AppText style={Styles.boldText1}>{"Total"}</AppText>
              </View>
            )}
            {(item == "Campaign String" || item == "Created By") && (
              <View style={[Styles.textcontainer]}>
                <TextInput
                  style={[Styles.textInputStyle]}
                  placeholder={`Search by ${item.split(regEx)[0]}`}
                  placeholderTextColor={"#00000026"}
                  value={returnValue(item)}
                  onSubmitEditing={(e) => {
                    btnCampaignStringData();
                  }}
                  onChangeText={(value) => {
                    onchange(item, value);
                  }}
                />
              </View>
            )}
            {
              item == "State" && (
                <CampaignDropDown
                  dataList={actionData}
                  placeHolderText="State"
                  containerStyle={Styles.textcontainer123("dropdown")}
                  onChange={(e) => {
                    onchange(item, e.value);
                  }}
                  value={returnValue(item)}
                />
              )}
          </View>
        );
      })}
    </View>
  );
};

export default CampaignStringScrollHeader;

const HeaderStyles = (COLORS) =>
  StyleSheet.create({
    headerView: {
      flexDirection: "row",
      alignItems: "flex-start",
      width: moderateScale(width * 5),
      padding: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    iconCenterView: {
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
    },
    mainContainer: (width) => ({
      paddingHorizontal: moderateScale(10),
      justifyContent: "center",
      marginHorizontal: moderateScale(2),
      width: width,
    }),
    arrowStyle: {
      height: moderateScale(16),
      width: moderateScale(8),
      tintColor: COLORS.themeColor,
      resizeMode: "contain",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: moderateScale(5),
      height: moderateScale(50),
      width: "96%",
    },
    headerContainercenter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: moderateScale(5),
      height: moderateScale(50),
      width: "88%",
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginLeft: 10,
    },
    boldText1: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginRight: 30,
    },
    textcontainer: {
      width: "88%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: "row",
      alignItems: "center",
    },
    textcontainer1: {
      width: "97%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(5),
    },
    textcontainer123: (type) => ({
      width: "80%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: "100%",
      color: COLORS.textColor,
    },
  });
