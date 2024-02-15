import React, { useState } from "react";
import { Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import UpDownArr from "../../../../Assets/Images/PNG/updown.png";
import { moderateScale, width } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import AppText from "../../../Atoms/CustomText";
import HeaderSearch from "../../../Atoms/HeaderSearch";
import CampaignDropDown from "../Campaign/CampaignDropDown";

const PlanogramScrollHeader = ({
  onchange,
  filterData,
  btnPlonogramData,
  btnAllCheckUnchecked,
  workFlow,
}) => {
  let headerData = [
    "Planogram Name",
    "Created By",
    "Date & Time",
    "Created On",
    "State",
    "Running/Not Running",
    "Action",
  ];
  let statusArr = [
    { label: "All", value: "" },
    { label: "DRAFT", value: "DRAFT" },
    { label: "SUBMITTED", value: "SUBMITTED" },
    { label: "PUBLISHED", value: "PUBLISHED" },
  ];
  if (
    workFlow &&
    (workFlow?.approverWorkFlow == "PLANOGRAM" ||
      workFlow?.approverWorkFlow == "PLANOGRAM_AND_CAMPAIGN")
  ) {
    headerData = [
      "Planogram Name",
      "Created By",
      "Approved/Rejected By",
      "Date & Time",
      "Created On",
      "State",
      "Running/Not Running",
      "Action",
    ];
    statusArr = [
      { label: "All", value: "" },
      { label: "Draft", value: "DRAFT" },
      { label: "Published", value: "PUBLISHED" },
      { label: "Approved", value: "APPROVED" },
      { label: "Rejected", value: "REJECTED" },
      { label: "Pending for approval", value: "PENDING_FOR_APPROVAL" },
    ];
  }
  
  const returnwidth = () => {
    let value = 100 / 7;
    if (
      workFlow &&
      (workFlow?.approverWorkFlow == "PLANOGRAM" ||
        workFlow?.approverWorkFlow == "PLANOGRAM_AND_CAMPAIGN")
    ) {
      value = 100 / 8;
    }
    return `${value}%`;
  };
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const [checkboxAll, setCheckboxAll] = useState(false);

  const regEx = new RegExp("[ /]");

  const returnValue = (value) => {
    switch (value) {
      case "Planogram Name":
        return filterData.PlanogramName;
        break;
      case "Created By":
        return filterData.CreatedBy;
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
      {headerData?.map((item, index) => {
        return (
          <View
            key={ index}
            style={[Styles.mainContainer(returnwidth(), index)]}
          >
            {index === 0 && (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Pressable
                  onPress={() => {
                    btnAllCheckUnchecked(!checkboxAll);
                    setCheckboxAll(!checkboxAll);
                  }}
                  style={[Styles.iconCenterView, { marginLeft: 8 }]}
                >
                  {checkboxAll == false ? (
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
                <View style={{ width: "70%" }}>
                  <View style={Styles.headerContainer1}>
                    <AppText style={Styles.boldText}>{item}</AppText>
                    {item == "Planogram Name" && (
                      <Pressable
                        onPress={() => {
                          onchange(item, "sd", "yes");
                        }}
                      >
                        <Image source={UpDownArr} style={Styles.arrowStyle} />
                      </Pressable>
                    )}
                  </View>
                  <View style={[Styles.textcontainer1]}>
                    <TextInput
                      style={[Styles.textInputStyle]}
                      placeholder={`Search by ${item.split(regEx)[0]}`}
                      placeholderTextColor={"#00000026"}
                      value={returnValue(item)}
                      onSubmitEditing={(e) => {
                        btnPlonogramData();
                      }}
                      onChangeText={(value) => {
                        onchange(item, value);
                        btnPlonogramData();
                      }}
                    />
                  </View>
                </View>
              </View>
            )}

            {index != 0 && (
              <View style={Styles.headerContainer}>
                <AppText style={Styles.boldText}>{item}</AppText>
                {item == "Created On" && (
                  <Pressable
                    onPress={() => {
                      onchange(item, "sd", "yes");
                    }}
                  >
                    <Image source={UpDownArr} style={Styles.arrowStyle} />
                  </Pressable>
                )}
              </View>
            )}

            {/* {
              item == "State" && 
            } */}
            {item == "State" && (
              <CampaignDropDown
                dataList={statusArr}
                placeHolderText="State"
                containerStyle={Styles.textcontainer123("dropdown")}
                onChange={(e) => {
                  onchange(item, e.value);
                }}
                value={returnValue(item)}
              />
            )}
            {item == "Created By" && (
              <View style={[Styles.textcontainer]}>
                <TextInput
                  style={[Styles.textInputStyle, { color: "black" }]}
                  placeholder={`Search by ${item.split(regEx)[0]}`}
                  placeholderTextColor={"#00000026"}
                  value={returnValue(item)}
                  onSubmitEditing={(e) => {
                    btnPlonogramData();
                  }}
                  onChangeText={(value) => {
                    onchange(item, value);
                  }}
                />
              </View>
            )}

            {/* <HeaderSearch placeholder={`Search by ${item.split(regEx)[0]}`} /> */}
          </View>
        );
      })}
    </View>
  );
};

export default React.memo(PlanogramScrollHeader);

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: (width1, index) => ({
      paddingHorizontal: index == 0 ? 0 : moderateScale(15),
      justifyContent: "center",
      marginRight: moderateScale(2),
      width: width1,
    }),
    textcontainer: {
      width: "97%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: "row",
      alignItems: "center",
    },
    textcontainer1: {
      width: "100%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: "row",
      alignItems: "center",
    },
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: "100%",
      color: COLORS.textColor,
    },
    container: {
      width: "97%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      flexDirection: "row",
      alignItems: "center",
    },
    textInputStyle: {
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_MEDIUM,
      paddingVertical: moderateScale(8),
      width: "100%",
      color: COLORS.textColor,
    },
    headerContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: moderateScale(5),
      marginLeft: moderateScale(10),
      height: moderateScale(50),
      width: "96%",
    },
    headerContainer1: {
      backgroundColor: COLORS.themeLight,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: moderateScale(5),
      marginLeft: moderateScale(10),
      height: moderateScale(50),
      width: "100%",
    },
    arrowStyle: {
      height: moderateScale(16),
      width: moderateScale(8),
      tintColor: COLORS.themeColor,
      resizeMode: "contain",
    },
    boldText: {
      fontSize: moderateScale(14),
      color: COLORS.textColor,
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
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
      width: moderateScale(width * 4.8),
      marginVertical: moderateScale(1),
    },
    textcontainer123: (type) => ({
      width: "90%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
  });
