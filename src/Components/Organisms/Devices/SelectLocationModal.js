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
import LocationsForAddDevice from "../Dashboard/LocationsForAddDevice";
import { useSelector } from "react-redux";
import LocationsForDasboard from "../Dashboard/LocationsForDashoard";
import LocationsListForPlanogram from "../Dashboard/LocationsListForPlanogram";

const SelectLocationModal = ({
  visible = false,
  locationSelected,
  setLocationSelected,
  setIsLoading,
  locationData1,
  selectedLocations,
  setSelectedLocations,
  setname,
  name,
  setModal,
  state,
  setState
}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  const [deviceLocation, setDeviceLocation] = useState(null);
  

  const onClickSave=()=>{
    let namessss ={"locationId": selectedLocations[0], "locationName": name[0]}
    setState({...state,deviceLocation:namessss})
    setModal(false)
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
              <LocationsForAddDevice
                data={locationData1}
                setIsLoading={setIsLoading}
                locationSelected={locationSelected}
                setLocationSelected={setLocationSelected}
                selectedLocations={selectedLocations}
                setSelectedLocations={setSelectedLocations}
                setselectionlocname={setname}
                deviceLocation={deviceLocation}
                setDeviceLocation={setDeviceLocation}
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

export default SelectLocationModal;

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
