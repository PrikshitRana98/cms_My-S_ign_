import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import { moderateScale } from "../../../Helper/scaling";
import AppText from "../../Atoms/CustomText";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import HomeIcon from "../../../Assets/Images/PNG/home_icon.png";
import SearchBox from "../../Atoms/SearchBox";
import DownArr from "../../../Assets/Images/PNG/down_arr.png";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Separator from "../../Atoms/Separator";
import ThemedButton from "../../Atoms/ThemedButton";
import { useSelector } from "react-redux";
import LocationsForCampaign from "../Dashboard/LocationsForCampaign";

const SelectLocationModalForCampaign = ({
  visible = false,
  setModal,
  selectedLocations,
  setSelectedLocations,
  locationSelected=[],
  setLocationSelected,
  locationData1,
  onChangeLocatioValue
}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  const [deviceLocation, setDeviceLocation] = useState(null);

 

  const onClickSave=()=>{
    console.log("\nselectedLocations==>",selectedLocations,"\nlocationSelected==>",locationSelected)
    if(selectedLocations.length < 0){
      alert('Select Location')
    }else{
      onChangeLocatioValue(selectedLocations,locationSelected);
      setModal(false)
    }
  }
  
  return (
    <Portal>
      <Modal
        visible={visible}
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.locationContainer}>
            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppText style={Styles.locationHeader}>Select Location</AppText>
              <LocationsForCampaign
                selectedLocations={selectedLocations}
                setSelectedLocations={setSelectedLocations}
                locationSelected={locationSelected}
                setLocationSelected={setLocationSelected}
                setDeviceLocation={setDeviceLocation}
                data={locationData1}
              />
            </View>
            <View style={{flexDirection:'row',alignItem:'center',justifyContent:'center'}}>

            <ThemedButton
              onClick={() => {
                setModal(false)
              }}
              title="Cancel"
              containerStyle={{backgroundColor:'transparent',borderColor:'red',borderWidth:1,marginRight:12}}
              textStyle={{
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                color:'red',
              }}
            />
            <ThemedButton
              onClick={() => {
                onClickSave();
              }}
              title="Save Location"
              textStyle={{
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
              }}
            />
            </View>

          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default SelectLocationModalForCampaign;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "center",
      padding: 20,
    },
    locationContainer: {
      height: "72%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(15),
      alignItems: "center",
      padding: moderateScale(20),
      justifyContent: "space-between",
    },
    locationHeader: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      color: COLORS.textColor,
    },
    baseLineContainer: {
      alignItems: "baseline",
    },
    brandContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: moderateScale(10),
      paddingVertical: moderateScale(10),
      width: "100%",
    },
    iconAndNameView: {
      flexDirection: "row",
      alignItems: "center",
    },
    brandText: {
      fontSize: moderateScale(18),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(10),
    },
  });
