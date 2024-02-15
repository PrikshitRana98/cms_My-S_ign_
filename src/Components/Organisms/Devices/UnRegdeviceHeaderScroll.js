import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {moderateScale, width} from '../../../Helper/scaling';
import {useThemeContext} from '../../../appConfig/AppContext/themeContext';
import SearchBox from '../../Atoms/SearchBox';
import CampaignDropDown from '../CMS/Campaign/CampaignDropDown';

const UnRegdeviceHeaderScroll = ({searchData,setSearchData,onChangeSearchBar,deviceGroupArr,makeRegisterMediaDataUrl,selectedMP,headers,onClick,selectedData,deviceList}) => {
  const themeColor = useThemeContext();
  const Styles = scheduleStyles(themeColor);
  const headerData = [
    'Client Identifier',
    'MP Ethernet Mac Address',
    'MP Wifi Mac Address',
    'OS',
    'Action',
  ];

  const getWidth = index => ({
    width: index==3 ? "16%" :index==0 ? '20%': '17%',
  });

  const returnValue = (value) => {
    switch (value) {
      case "Client Identifier":
        return searchData.clientIdentifier;
        break;
      case "MP Ethernet Mac Address":
        return searchData.ethernetMacAddress;
        break;
      case "MP Wifi Mac Address":
        return searchData.wifiMacAddress;
        break;
      case "OS":
        return searchData.os;
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
            style={[Styles.mainContainer, getWidth(index)]}>
            <View style={Styles.headerContainer}>
              <Text style={Styles.boldText}>{item}</Text>
              {/* {index <= 2 && (
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
            {
             selectedMP != headers[2].title &&
              <>
              {(item=="MP Ethernet Mac Address" || item=="Client Identifier" ||  item=="MP Wifi Mac Address") && (
                <SearchBox
                  changeText={(txt)=>{
                    onChangeSearchBar(item,txt)
                  }}
                  stateValue={returnValue(item)}
                  handleOnSubmitEditing={()=>{
                    makeRegisterMediaDataUrl();
                  }}
                  placeholder={`Search ${item.split(' ')[0]}`}
                  containerStyle={Styles.searchView}
                  inputStyle={{
                    fontSize: moderateScale(13),
                  }}
                />
              )}
              {
                (item=="MP Connectivity") &&
                <CampaignDropDown
                  dataList={[
                    { label: "Select connectivity", value: null },
                    { label: "CONNECTED", value: 'true'},
                    { label: "DISCONNECTED", value: false },
                  ]}
                  placeHolderText="Select connectivity"
                  containerStyle={Styles.textcontainer("dropdown")}
                  onChange={(e) => {
                    onChangeSearchBar(item,e.value)
                  }}
                  value={returnValue(item)}
                />
              }
              {
                (item=="OS") &&
                <CampaignDropDown
                  dataList={[
                    { label: "Select OS", value: null },
                    { label: "ANDROID", value: "ANDROID" },
                    { label: "WINDOWS", value: "WINDOWS" },
                    { label: "ANDROID_TV", value: "ANDROID_TV" },
                  ]}
                  placeHolderText="Select OS"
                  containerStyle={Styles.textcontainer("dropdown")}
                  onChange={(e) => {
                    onChangeSearchBar(item,e.value)
                  }}
                  value={returnValue(item)}
                />
              }
              {
                (item=="Group") &&
                <CampaignDropDown
                  dataList={deviceGroupArr}
                  placeHolderText="Device Group"
                  containerStyle={Styles.textcontainer("dropdown")}
                  onChange={(e) => {
                    onChangeSearchBar(item,e.value)
                  }}
                  value={returnValue(item)}
                />
              }
              {
                (item=="Action")&&<View style={{height:moderateScale(45)}}></View>
              }
              </>
            }
          </View>
        );
      })}
    </View>
  );
};

export default UnRegdeviceHeaderScroll;

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
      width: moderateScale(width * 3),
      paddingHorizontal: moderateScale(5),
      paddingVertical: moderateScale(10),
      marginVertical: moderateScale(1),
    },
    textcontainer: (type) => ({
      width: "90%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
  });
