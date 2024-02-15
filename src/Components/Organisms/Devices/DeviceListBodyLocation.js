import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import AndroidIcon from "../../../Assets/Images/PNG/android.png";
import WindowsIcon from "../../../Assets/Images/PNG/windows.png";
import TvIcon from "../../../Assets/Images/PNG/tv.png";
import { moderateScale, width } from "../../../Helper/scaling";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import AppText from "../../Atoms/CustomText";
import DeviceHeaderScroll from "./deviceHeaderScrollLocation";
import ThemedButton from "../../Atoms/ThemedButton";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { NAVIGATION_CONSTANTS } from "../../../Constants/navigationConstant";
import EditIcon from "../../../Assets/Images/PNG/edit.png";
import moment from "moment";

const DeviceListBodyLocation = ({
  navigation,
  dataList,
  searchData,
  setSearchData,
  deviceGroupArr,
  makeRegisterMediaDataUrl,
  selectedMP,
  headers,
  selectedData,
  setSelectedData,
  btnOpenModelType,
}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const returnWidth=()=>{
    return `${100/7}%`
  }
  const renderTextView = (item, index,type) => {
    switch (type) {
      case 'name':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
            <AppText style={Styles.commonText}>{item?.deviceName || '--'}</AppText>
          </View>
        break;
      case 'group':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
            <AppText style={Styles.commonText}>{item?.deviceGroupName || '--'}</AppText>
          </View>
        break;
      case 'location':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
            <AppText style={Styles.commonText}>{item?.location?.locationName || '--'}</AppText>
          </View>
        break;
      case 'latitude':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
            <AppText style={Styles.commonText}>{item?.latitudeDMS || '--'}</AppText>
          </View>
      case 'longitude':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
            <AppText style={Styles.commonText}>{item?.longitudeDMS || '--'}</AppText>
          </View>
      case 'os':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
        {item.deviceOs.toLowerCase() == "windows" ? (
          <Image
            source={WindowsIcon}
            resizeMode="contain"
            style={Styles.iconStyles}
          />
        ) : item.deviceOs.toLowerCase() == "android" ? (
          <Image
            resizeMode="contain"
            source={AndroidIcon}
            style={Styles.iconStyles}
          />
        ) : (
          <Image
            resizeMode="contain"
            source={TvIcon}
            style={Styles.iconStyles}
          />
        )}
          </View>
      case 'camera':
        return  <View style={[Styles.commonView,{width:returnWidth()}]}>
            <AppText style={Styles.commonText}>{'--'}</AppText>
          </View>
        break;
      default:
        break;
    }
    
  };

  const renderDeviceItems = ({ item, index }) => {
    return (
      <View style={Styles.renderContainer}>
        {renderTextView(item,1,'name')}
        {renderTextView(item,1,'group')}
        {renderTextView(item,1,'location')}
        {renderTextView(item,1,'latitude')}
        {renderTextView(item,1,'longitude')}
        {renderTextView(item,1,'os')}
        {renderTextView(item,1,'camera')}
      </View>
    );
  };

  // change text input data======
  const onChangeSearchBar = (type, value) => {
    console.log("onChangeSearchBar", type, value);

    if (type == "Media Player Name") {
      setSearchData({ ...searchData, MediaPlayerName: value });
    } else if (type == "Group") {
      setSearchData({
        ...searchData,
        GroupId: value,
        isUsedForUseEffect: value,
      });
    } else if (type == "Location") {
      setSearchData({ ...searchData, Location: value });
    } else if (type == "OS") {
      setSearchData({
        ...searchData,
        os: value,
        isUsedForUseEffect: value,
      });
      // isUsedForUseEffect:value,
    } else if (type == "MP Connectivity") {
      setSearchData({
        ...searchData,
        connectivity: value,
        isUsedForUseEffect: value,
      });
    }
  };
  //end change text input data======

  // checkbox code==========
  const isChecked = (id) => {
    if (selectedData.includes(id)) return true;
    return false;
  };
  const addRemData = (id) => {
    if (isChecked(id)) {
      let remdata = selectedData.filter((d) => d != id);
      setSelectedData([...remdata]);
    } else {
      setSelectedData([...selectedData, id]);
    }
  };
  const multiSelectUnselect = (status) => {
    if (dataList.length <= 0) return false;
    if (status == false) {
      let seldata = dataList.map((device) => {
        return device.deviceId;
      });
      setSelectedData([...seldata]);
    } else {
      setSelectedData([]);
    }
  };
  //End checkbox code==========
  const ListEmptyComponent =  ({ item }) => {
    return (
      <View style={{backgroundColor:"white"}}>
        <Text
        style={{
          padding: 10,
          fontSize: 18,
          marginLeft:30,
          color:'black'
        }}
      >
        No Data Found
      </Text>
      </View>
    );
  };
  return (
      <ScrollView  bounces={false} horizontal={true} style={Styles.mainContainer}>
      <FlatList
        scrollEnabled={false}
        data={dataList}
        renderItem={renderDeviceItems}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={
          <DeviceHeaderScroll
            deviceGroupArr={deviceGroupArr}
            onChangeSearchBar={onChangeSearchBar}
            searchData={searchData}
            setSearchData={setSearchData}
            makeRegisterMediaDataUrl={makeRegisterMediaDataUrl}
            selectedMP={selectedMP}
            headers={headers}
            onClick={(status) => multiSelectUnselect(status)}
            deviceList={dataList}
            selectedData={selectedData}
          />
        }
      />
    </ScrollView>
  );
};

export default DeviceListBodyLocation;

const scheduleStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.themeLight,
      width: "100%",
    },
    nameView: {
      width: "13%",
      margin: 0,
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(15),
    },
    commonView: {
      width: "9%",
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(9),
      paddingVertical:moderateScale(8)
    },
    groupView: { width: "7%" },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    renderContainer: {
      flexDirection: "row",
      width: "100%",
      margin: moderateScale(0.5),
    },
    statusText: {
      fontSize: moderateScale(16),
      padding: moderateScale(5),
      paddingHorizontal: moderateScale(15),
      borderRadius: moderateScale(15),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    centeredView: { alignItems: "center" },
    actionView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    OSView: {
      width: "7%",
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    iconStyles: {
      backgroundColor: "white",
      height: moderateScale(35),
      width: moderateScale(25),
    },
    actionContainer: { width: "15%" },
    iconBackView: {
      height: moderateScale(32),
      width: moderateScale(32),
      borderRadius: moderateScale(17),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
    },
    actionIcons: {
      height: moderateScale(20),
      width: moderateScale(20),
      resizeMode: "contain",
    },
  });
