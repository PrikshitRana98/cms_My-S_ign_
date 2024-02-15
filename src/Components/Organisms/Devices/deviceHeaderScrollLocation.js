import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, width} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import SearchBox from '../../Atoms/SearchBox';
import CampaignDropDown from '../CMS/Campaign/CampaignDropDown';

const DeviceHeaderScroll = ({searchData,setSearchData,onChangeSearchBar,deviceGroupArr,makeRegisterMediaDataUrl,selectedMP,headers,onClick,selectedData,deviceList}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const headerData = [
    'Media Player Name',
    'Group',
    'Location',
    'Latitude',
    'Longitude',
    'OS',
    'Camera',
  ];

  const getWidth = index => ({
    width: index === 0 ? '13%' : index === 3 || index === 4 ? '7%' : '9%',
  });
  const returnWidth=()=>{
    return `${100/7}%`
  }

  const returnValue = (value) => {
    switch (value) {
      case "Media Player Name":
        return searchData.MediaPlayerName;
        break;
      case "Group":
        return searchData.GroupId;
        break;
      case "Location":
        return searchData.Location;
        break;
      case "OS":
        return searchData.os;
        break;
      case "MP Connectivity":
        return searchData.connectivity;
        break;
      default:
        break;
    }
  };

  // MediaPlayerName:null,
  // GroupId:null,
  // Location:null,
  // os:null,//capital-ANDROID,
  // connectivity:null,//true|false
  return (
    <View style={Styles.headerView}>
      {headerData?.map((item, index) => {
        return (
          <View
            key={item + index}
            style={[Styles.mainContainer, {width:returnWidth()}]}>
            <View style={Styles.headerContainer}>
              <Text style={Styles.boldText}>{item}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default DeviceHeaderScroll;

const scheduleStyles = COLORS =>
  StyleSheet.create({
    mainContainer: {
      paddingHorizontal: moderateScale(5),
      justifyContent: 'center',
      marginHorizontal: moderateScale(2),
    },
    headerContainer: {
      backgroundColor: COLORS.themeLight,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: moderateScale(5),
      height: moderateScale(50),
    },
    iconView: {
      backgroundColor: COLORS.white,
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    boldText: {
      fontSize: moderateScale(16),
      fontWeight: '500',
      color: COLORS.textColor,
      marginHorizontal: moderateScale(15),
    },
    searchView: {
      marginHorizontal: moderateScale(10),
      width: '95%',
      height: moderateScale(45),
    },
    alignIcon: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    renderContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconCenterView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    headerView: {
      flexDirection: 'row',
      alignItems: 'center',
      width: moderateScale(width * 4.1),
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    textcontainer: (type) => ({
      width: "110%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
  });
