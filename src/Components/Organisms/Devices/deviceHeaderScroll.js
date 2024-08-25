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
    'OS',
    'App version',
    'MP Status',
    'Last Sync',
    'MP Connectivity',
    'Last Connectivity',
    'Action',
  ];

  const getWidth = index => ({
    width: index === 0 ? '13.5%' :index === 2? "12.5%":index === 3 ?'7%':index === 4 ? '7%' : index === 7 ? '7%':index === 9? "90%": '9%',
  });

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
      <Pressable style={Styles.iconCenterView} onPress={()=>{
        (deviceList?.length>0 && deviceList?.length==selectedData.length)? onClick(true) :onClick(false)
      }}>
      {(deviceList?.length>0 && deviceList?.length==selectedData.length) ? (
              <MaterialIcons
                name="check-box"
                color={themeColor.themeColor}
                size={25}
              />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                color={themeColor.themeColor}
                size={25}
              />
            )}
       
      </Pressable>
      {headerData?.map((item, index) => {
        return (
          <View
            key={item + index}
            style={[Styles.mainContainer, getWidth(index)]}>
            <View style={Styles.headerContainer}>
              <Text style={[Styles.boldText]}>{item}</Text>
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
            //  selectedMP != headers[2].title &&
              <>
              {(item=="Media Player Name" ||  item=="Location") ? (
                <SearchBox
                  changeText={(txt)=>{
                    onChangeSearchBar(item,txt)
                  }}
                  stateValue={returnValue(item)}
                  handleOnSubmitEditing={()=>{
                    makeRegisterMediaDataUrl();
                  }}
                  placeholder={`Search ${item.split(' ')[0]}`}
                  containerStyle={[Styles.searchView,{width:item=="Location"?"88%":"93%"}]}
                  inputStyle={{
                    fontSize: moderateScale(13),
                    paddingHorizontal:0,
                  }}
                />
              ):(item=="OS") ?
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
              />:(item=="Group") ?
              <CampaignDropDown
                dataList={deviceGroupArr}
                placeHolderText="Select Group"
                containerStyle={Styles.textcontainer("dropdown")}
                onChange={(e) => {
                  onChangeSearchBar(item,e.value)
                }}
                value={returnValue(item)}
              />:<View style={{height:40}}></View>}
              {
                // (item=="MP Connectivity") &&
                // <CampaignDropDown
                //   dataList={[
                //     { label: "Select connectivity", value: null },
                //     { label: "CONNECTED", value: 'true'},
                //     { label: "DISCONNECTED", value: false },
                //   ]}
                //   placeHolderText="Select connectivity"
                //   containerStyle={Styles.textcontainer("dropdown")}
                //   onChange={(e) => {
                //     onChangeSearchBar(item,e.value)
                //   }}
                //   value={returnValue(item)}
                // />
              }
              
              </>
            }
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
      // paddingHorizontal: moderateScale(5),
      justifyContent: 'center',
      marginHorizontal: moderateScale(3),
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
      // marginHorizontal: moderateScale(10),
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
      width: "100%",
      backgroundColor: COLORS.white,
      borderRadius: moderateScale(5),
      borderColor: COLORS.searchBorder,
      borderWidth: moderateScale(1),
      paddingHorizontal: moderateScale(10),
      paddingVertical: type == "dropdown" ? moderateScale(5) : 0,
    }),
  });
