import React, { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AdvSearchAndAdd from "../../Components/Atoms/AdvSearchAndAdd";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import CommonHeaderTitleAction from "../../Components/Atoms/CommonHeader";
import Pagination from "../../Components/Atoms/Pagination";
import SearchBox from "../../Components/Atoms/SearchBox";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import DeviceListBody from "../../Components/Organisms/Devices/DeviceListBody";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { moderateScale } from "../../Helper/scaling";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import DeviceStyles from "./style";

import { useSelector } from "react-redux";
import { mediaGroupManagerService } from "../MediaPlayerGroups/MediaGroupApi";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import LocationsForAddDevice from "../../Components/Organisms/Dashboard/LocationsForAddDeviceSearch";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import Loader from "../../Components/Organisms/CMS/Loader";
import { deviceManagerService } from "../Device/DeviceApi";
import Separator from "../../Components/Atoms/Separator";
import CustomIconText from "../../Components/Atoms/IconText";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
const ReplaceDevice = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = DeviceStyles(themeColor);
  const [isLoading, setIsLoading] = useState(false);

  // Device location================================
  const [locationSelected, setLocationSelected] = useState(null);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [deviceList, setDeviceList] = useState([]);

  const locationData1 = useSelector(
    (state) => state.CommonReducer.locationData
  );

  useEffect(() => {
    setLocationSelected(locationData1);
  }, [locationData1]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
    navigation.goBack();
     console.log("deviceback is pressed")
  })
  }, [navigation])

  useEffect(() => {
    let deviceData = route?.params?.deviceData;
    console.log("getDeviceByLocation(null);getDeviceByLocation(null);=======>",deviceLocation)
    if (deviceData) {
      deviceLocation && getDeviceByLocation(deviceLocation?.locationId);
    } else {
      if (deviceLocation) {
        getDeviceByLocation(deviceLocation?.locationId);
      } else {
        getDeviceByLocation(null);
      }
    }
  }, [deviceLocation]);

  const getDeviceByLocation = async (locationId) => {
    // console.log("getDeviceByLocation deviceLocation======>", locationId);
    setIsLoading(true);
    const successCallBack = async (response) => {
      setIsLoading(false);
      console.log("getDeviceByLocation success", response.result);
      // console.log("getDeviceByLocation deviceLocation", deviceLocation);
      setDeviceList(response.result);
    };

    const errorCallBack = (response) => {
      // console.log("getDeviceByLocation error", response);
      setIsLoading(false);
    };
    if(locationId!=null&&deviceLocation!=null){
      deviceManagerService.fetchDeviceByLocation(
        locationId,
        successCallBack,
        errorCallBack
      );
    }else{
      setIsLoading(false);
    }
  };
  // End Device location============================

  const goNextPage=(item)=>{
    let deviceData = route?.params?.deviceData;
    if (deviceData) {
      navigation.navigate(NAVIGATION_CONSTANTS.REPLACE_UN_REG_DEVICE_FORM,{
        deviceData: route?.params?.deviceData,
        fromRepData: item,
        deviceLocation: deviceLocation,
      });
    } else {
      navigation.navigate(NAVIGATION_CONSTANTS.REPLACE_DEVICE_FORM,{
        deviceData: item,
      });
    }
  }
  return (
    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
      <Loader visible={isLoading} />
      <View style={Styles.mainContainer}>
        <ClockHeader />
        <View style={Styles.headerContainer}>
          <CreateNewHeader
            title="Replace Device"
            onClickIcon={() => navigation.goBack()}
          />
        </View>
        <View style={Styles.subContainer321}>
          <LocationsForAddDevice
            data={locationData1}
            setIsLoading={setIsLoading}
            locationSelected={locationSelected}
            setLocationSelected={setLocationSelected}
            selectedLocations={selectedLocations}
            setSelectedLocations={setSelectedLocations}
            deviceLocation={deviceLocation}
            setDeviceLocation={(d)=>{
              console.log("))))))))))))))))))))))",d)
              setDeviceLocation(d)
            }}
          />
        </View>
      </View>

      <View
        style={[
          Styles.subContainer321,
          {
            marginTop: 8,
            justifyContent: "flex-start",
            alignItems: "flex-start",
          },
        ]}
      >
        {deviceList &&
          deviceList.map((item, dIndex) => {
            return (
              <Pressable
                key={dIndex + "device"}
                style={{
                  borderWidth: moderateScale(1),
                  borderColor: "#00000026",
                  width: "100%",
                  marginVertical: 2,
                  borderRadius: 2,
                }}
              >
                <CustomIconText
                  onPress={() => { goNextPage(item) }}
                  name={item.deviceName}
                />
                {dIndex + 1 != deviceList.length && deviceList.length != 1 && (
                  <Separator />
                )}
              </Pressable>
            );
          })}
        {deviceList.length==0 && (
          <View style={{ width: "100%" }}>
            <Text style={{ color: "#000", textAlign: "center" }}>
              No Data found
            </Text>
          </View>
        )}
      </View> 
    </ScrollView>
  );
};

export default ReplaceDevice;
