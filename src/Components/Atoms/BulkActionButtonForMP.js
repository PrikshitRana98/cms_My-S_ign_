import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { moderateScale } from "../../Helper/scaling";
import { useSelector } from "react-redux";
import ModalDropdownComp from "./DropDown";
import { bulkDeleteResolutionData } from "../../Services/AxiosService/ApiService";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";

const BulkAction = ({ title, pageName = "", btnOpenModelType = () => {}, renderDelete=false }) => {
  const resolutionList = useSelector(
    (state) => state.ResolutionReducer.resolutionList
  );
  const dropdownCategoryref = useRef();
  const [showFeather, setShowFeather] = useState(false);

  

  const handleOptionSelect = (option) => {
    console.log("handleOptionSelect", option);
    switch (option) {
      case "Active MP":
        btnOpenModelType("Active MP", 0);
        break;
      case "Inactive MP":
        btnOpenModelType("Inactive MP", 0);
        break;
      case "Remove MP":
        btnOpenModelType("DeleteAll", 0);
        break;
      case "Mute MP":
        btnOpenModelType("Mute MP", 0);
        break;
      case "Unmute MP":
        btnOpenModelType("Unmute MP", 0);
        break;
      case "Panel On":
        btnOpenModelType("Panel On", 0);
        break;
      case "Panel Off":
        btnOpenModelType("Panel Off", 0);
        break;
      case "Manual Sync":
        btnOpenModelType("Manual Sync", 0);
        break;
      case "Force App Update":
        btnOpenModelType("Force App Update", 0);
        break;
      case "Content re-download":
        btnOpenModelType("Content re-download", 0);
        break;
    }
  };

  function getOptions() {
    if (renderDelete) {
      return [
        "Active MP",
        "Inactive MP",
        "Remove MP",
        "Mute MP",
        "Unmute MP",
        "Panel On",
        "Panel Off",
        "Manual Sync",
        "Force App Update",
        "Content re-download",
      ]
    }
    return [
      "Active MP",
      "Inactive MP",
      "Mute MP",
      "Unmute MP",
      "Panel On",
      "Panel Off",
      "Manual Sync",
      "Force App Update",
      "Content re-download",
    ]
  }

  return (
    <View>
      <ModalDropdownComp
        onSelect={(_, res2) => {
          handleOptionSelect(res2);
        }}
        options={getOptions()}
        isFullWidth
        // popupHeight={moderateScale(45)}
        ref={dropdownCategoryref}
        onClose={() => setShowFeather(false)}
        keySearchObject="name"
        renderRow={(props) => {
          return (
            <View
              style={{
                borderWidth: 2,
                borderColor: "grey",
                margin: 5,
                borderRadius: 5,
              }}
            >
              <Text
                style={[
                  Styles.textStyle,
                  { textAlign: "center", marginVertical: 5 },
                ]}
              >
                {props}
              </Text>
            </View>
          );
        }}
        dropdownStyle={{ width: 130 }}
        renderSeparator={(obj) => null}
      >
        <TouchableOpacity
          style={Styles.bulkAction}
          onPress={() => {
            setShowFeather(true);
            dropdownCategoryref.current._onButtonPress();
          }}
        >
          <Text style={Styles.textStyle}>Bulk Action</Text>
          <Feather
            name={!showFeather ? "chevron-up" : "chevron-down"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </ModalDropdownComp>
    </View>
  );
};

const Styles = StyleSheet.create({
  bulkAction: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: "gray",
  },
  dropdownContainer: {
    position: "absolute",
    backgroundColor: "#F3F5F8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(2),
    borderColor: "gray",
    width: "100%",
    top: "100%",
  },
  dropdownOption: {
    paddingVertical: 8,
    textAlign: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  textStyle: {
    color: "black",
    textAlignVertical: "center",
    fontSize: moderateScale(14),
    fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
  },
  innerText: {
    fontSize: moderateScale(12),
    color: "#000000",
  },
});

export default BulkAction;
