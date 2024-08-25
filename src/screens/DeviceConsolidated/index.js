import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,Text, BackHandler,
} from "react-native";
import LeftArr from "../../Assets/Images/PNG/left_arr.png";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import AppText from "../../Components/Atoms/CustomText";
import Separator from "../../Components/Atoms/Separator";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
import DeviceStyles from "./style";
import { moderateScale } from "../../Helper/scaling";
import UserIcon from "../../Assets/Images/PNG/user.png";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import ActiveDot from "../../Assets/Images/PNG/active_dot.png";
import EditIcon from "../../Assets/Images/PNG/edit.png";
import DeleteIcon from "../../Assets/Images/PNG/delete.png";
import RepeatIcon from "../../Assets/Images/PNG/move.png";
import CalenderIcon from "../../Assets/Images/PNG/calender.png";
import OptionsIcon from "../../Assets/Images/PNG/three_dot.png";
import ThemedButton from "../../Components/Atoms/ThemedButton";
import AndroidIcon from "../../Assets/Images/PNG/android.png";
import WindowsIcon from "../../Assets/Images/PNG/windows.png";
import TvIcon from "../../Assets/Images/PNG/tv.png";
import moment from "moment";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Modal, Portal} from 'react-native-paper';
import { deviceManagerService } from "../Device/DeviceApi";


const headers = ["DEVICE/MP DETAILS", "PANEL DETAILS" ];//"DEVELOPER TOOLS"

const DeviceConsolidated = ({ navigation, route }) => {
  const themeColor = useThemeContext();
  const Styles = DeviceStyles(themeColor);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deviceInfo, setDeviceInfo] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  useEffect(() => {
    const deviceDetail = route?.params?.deviceDetail;
    setDeviceInfo(deviceDetail);
    console.log("deviceDetail", deviceDetail);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      
      navigation.goBack();

  })
    
  }, [navigation])

  const DownloadDevicelogs=async()=>{


  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => setSelectedIndex(index)}
        key={item}
        style={Styles.itemContainer}
      >
        <View>
          <AppText style={[Styles.headerOptionText,{color:'black'}]}>{item}</AppText>
          {selectedIndex === index && <View style={Styles.selectedBar} />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTitleAndValue = (title, value) => {
    return (
      <View style={{ padding: moderateScale(10) }}>
        <AppText style={Styles.titleStyle}>{title}</AppText>
        <AppText style={Styles.valueStyle}>{value}</AppText>
      </View>
    );
  };
  const renderConnectivity = (title, value) => {
    return (
      <View style={{ padding: moderateScale(10) }}>
        <AppText style={Styles.titleStyle}>{title}</AppText>
        <ThemedButton
          title={value}
          containerStyle={{
            backgroundColor:
              value?.toLowerCase() === "connected"
                ? themeColor.barLightGreen
                : themeColor.barLightRed,
            borderRadius: moderateScale(20),
            alignSelf: "flex-start",
            marginVertical: moderateScale(5),
            paddingVertical: moderateScale(8),
          }}
          textStyle={{
            color:
              value?.toLowerCase() === "connected"
                ? themeColor.activeGreen
                : themeColor.activeRed,
          }}
        />
      </View>
    );
  };

  const renderOS = (title, value) => {
    return (
      <View style={{ padding: moderateScale(10) }}>
        <AppText style={Styles.titleStyle}>{title}</AppText>
        {value?.toLowerCase() == "windows" ? (
          <Image
            source={WindowsIcon}
            resizeMode="contain"
            style={{
              width: moderateScale(23),
              height: moderateScale(28),
              resizeMode: "contain",
            }}
          />
        ) : value?.toLowerCase() == "android" ? (
          <Image
            resizeMode="contain"
            source={AndroidIcon}
            style={{
              width: moderateScale(23),
              height: moderateScale(28),
              resizeMode: "contain",
            }}
          />
        ) : (
          <Image
            resizeMode="contain"
            source={TvIcon}
            style={{
              width: moderateScale(23),
              height: moderateScale(28),
              resizeMode: "contain",
            }}
          />
        )}
      </View>
    );
  };

  const renderActionView = () => {
    return (
      <View style={Styles.actionView}>
        <View style={Styles.iconBackView}>
          {/* <Image source={EditIcon} style={Styles.actionIcons} /> */}
          <FontAwesome5 name={"power-off"} size={20} color={themeColor.red}/>
        </View>
        <View style={Styles.iconBackView}>
          {/* <Image source={CalenderIcon} style={Styles.actionIcons} /> */}
          <Ionicons name={"volume-mute"} size={20} color={themeColor.themeColor}/>
        </View>
        {/* <View style={Styles.iconBackView}>
          <Image source={RepeatIcon} style={Styles.actionIcons} />
        </View> */}
        <View style={Styles.iconBackView}>
          <Image source={DeleteIcon} style={Styles.actionIcons} />
        </View>
        {/* <View style={Styles.iconBackView}>
          <Image source={OptionsIcon} style={Styles.actionIcons} />
        </View> */}
      </View>
    );
  };

  const returnPanelview = (title, value) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <AppText style={Styles.titleStyle}>{title}</AppText>
        <AppText style={Styles.valueStyle}>{value}</AppText>
      </View>
    );
  };

  return (
    <View style={Styles.mainContainer}>
      <ClockHeader />
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={Styles.subContainer}>
          <View style={Styles.headerContainer}>
            <View style={Styles.createNewStyles}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={Styles.iconView}
              >
                <Image source={LeftArr} style={Styles.backIcon} />
              </TouchableOpacity>
              <AppText style={[Styles.headerText,{color:'black'}]}>
                Device Consolidated View
              </AppText>
            </View>
          </View>
          <Separator />
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={headers}
            renderItem={renderItem}
            horizontal
            style={{
              paddingHorizontal: moderateScale(10),
              backgroundColor: themeColor.white,
            }}
          />
          <View style={Styles.playerNameView}>
            <Image
              source={UserIcon}
              style={{
                height: moderateScale(14),
                width: moderateScale(14),
                resizeMode: "contain",
              }}
            />
            <AppText
              style={{
                color: themeColor.unselectedText,
                fontSize: moderateScale(14),
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
                marginHorizontal: moderateScale(10),
              }}
            >
              Media Player Name :
            </AppText>
            <AppText
              style={{
                color: themeColor.textColor,
                fontSize: moderateScale(14),
                fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
              }}
            >
              {`${deviceInfo?.deviceName || "-"}`}
            </AppText>
            <Image
              source={ActiveDot}
              style={{
                width: moderateScale(12),
                height: moderateScale(12),
                marginHorizontal: moderateScale(5),
              }}
            />
          </View>

          {selectedIndex == 0 &&(
            <View style={Styles.bodyContainer}>
              {renderTitleAndValue(
                "Media Player Name",
                `${deviceInfo?.deviceName || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Group",
                `${deviceInfo?.deviceGroupName || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Identifier",
                `${deviceInfo?.clientGeneratedDeviceIdentifier || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Location",
                `${deviceInfo?.location?.locationName || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Wifi Mac Address",
                `${deviceInfo?.deviceWifiMacAddress || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Ethernet Mac Address",
                `${deviceInfo?.deviceEthernetMacAddress || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Local Server IP",
                `${deviceInfo?.ipAddress || "-"}`
              )}
              <Separator />
              {renderConnectivity(
                "Media Player Connectivity",
                `${deviceInfo?.deviceConnectivity || "-"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player IP",
                `${deviceInfo?.ipAddress || "-"}`
              )}
              <Separator />
              {renderOS(
                "Media Player OS",
                `${deviceInfo?.deviceOs || "android"}`
              )}
              <Separator />
              {renderTitleAndValue(
                "Media Player Status",
                `${deviceInfo?.status==1?"Active":"Inactive" }`
              )}
              <Separator />

              {renderTitleAndValue(
                "App Version",
                `${deviceInfo?.appVersion || "-"}`
              )}
              <Separator />
              {renderTitleAndValue("Latitude", `${deviceInfo?.latitude || "-"}`)}
              <Separator />
              {renderTitleAndValue("Longitude", `${deviceInfo?.longitude || "-"}`)}
              <Separator />
              {renderTitleAndValue("Last Sync", deviceInfo?.lastSyncTime?`${moment(deviceInfo?.lastSyncTime).format("DD-MM-YYYY, hh:mm a")}`:"-")}
              <Separator />
              {renderTitleAndValue("Last Connectivity", deviceInfo?.timeOfDeviceStatus?`${moment(deviceInfo?.timeOfDeviceStatus).format("DD-MM-YYYY, hh:mm a")}`:"-")}
              <Separator />
            </View>
           ) 
          }
          {
            selectedIndex==1&& (
              <>
                {deviceInfo?.panels &&
                  deviceInfo?.panelForJson?.map((panel) => {
                    return (<>
                      <View
                        style={{
                          padding: 20,
                          backgroundColor: "#fff",
                          marginVertical: 6,
                        }}
                      >
                        {returnPanelview(
                          "Serial Number",
                          `${panel.panelSerialNumber || "-"}`
                        )}
                        {returnPanelview(
                          "Panel Name",
                          `${panel.panelName || "-"}`
                        )}
                        {returnPanelview(
                          "Panel Control",
                          `${panel.panelControl || "-"}`
                        )}
                        {returnPanelview("Panel IP", `${panel.panelIp || "-"}`)}
                        {returnPanelview("HDMI Connectivity", `${panel.hdmiActivityStatus || "-"}`)}
                        {returnPanelview("Panel Connectivity", `${panel.panelActivityStatus || "-"}`)}
                        {returnPanelview("Last Connectivity",panel.timeOfPanelStatus? `${moment(panel.timeOfPanelStatus).format("DD-MM-YYYY, hh:mm a")}`:"-")}
                        
                      </View>
                      {/* {(panel.hdmiActivityStatus=="connected"||panel.hdmiActivityStatus=="CONNECTED")&&<View style={{backgroundColor:themeColor.white,paddingHorizontal:moderateScale(15)}}>
                        <AppText style={{color:themeColor.textColor}}>Action</AppText>
                        {renderActionView()}
                        </View>
                      } */}
                      </>
                    );
                  })}
              </>
            )
          }
          {
            selectedIndex==2&&(
              <>
              <View style={{backgroundColor:themeColor.white,flexDirection:"row",paddingHorizontal:15,alignItems:'center',justifyContent:'space-evenly',padding:15}}>
                <TouchableOpacity style={Styles.iconBackView} onPress={()=>setModalVisible(true)}>
                  <MaterialIcons name={"list-alt"} size={25} color={themeColor.themeColor}/>
                </TouchableOpacity>
                {/* <TouchableOpacity style={Styles.iconBackView} onPress={()=>setModalVisible2(true)}>
                  <MaterialCommunityIcons name={"playlist-check"} size={25} color={themeColor.themeColor}/>
                </TouchableOpacity> */}
              </View>
              <Portal>
              <Modal
                animationType="slide"
                transparent={true}
                style={{
                  flex: 1,padding:20
                }}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert('Modal has been closed.');
                  setModalVisible(!modalVisible);
                }}>
                  
                <View style={{ height:"60%",
                    backgroundColor:'white'}}>
                    <View style={{backgroundColor:themeColor.themeColor,padding:10}}>
                    <AppText style={{color:'white',fontSize:18}}> Download Log File</AppText>
                    </View>
                    <View style={{padding:15}}>
                      <AppText style={{fontSize:15,color:'black'}}>Are you sure you want to download current log?{JSON.stringify(deviceInfo)}</AppText>
                      
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'flex-end',paddingHorizontal:20,paddingVertical:30}}>
                      <TouchableOpacity
                        style={{marginRight:10,backgroundColor:themeColor.themeColor,paddingHorizontal:20,paddingVertical:15, borderRadius:10 }}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <AppText style={{color:'white',fontSize:20}}>No</AppText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{marginLeft:10,backgroundColor:themeColor.themeColor,paddingHorizontal:20,paddingVertical:15, borderRadius:10 }}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <AppText style={{color:'white',fontSize:20}}>Yes</AppText>
                      </TouchableOpacity>
                    </View>
                </View>
              </Modal>
              </Portal>
              <Portal>
              <Modal
                animationType="slide"
                transparent={true}
                style={{
                  flex: 1,padding:20,borderRadius:10
                }}
                visible={modalVisible2}
                onRequestClose={() => {
                  // Alert.alert('Modal has been closed.');
                  setModalVisible2(!modalVisible2);
                }}>
                  
                <View style={{ height:"60%",
                    backgroundColor:'white'}}>
                    <View style={{backgroundColor:themeColor.themeColor,padding:10}}>
                    <AppText style={{color:'white',fontSize:18}}> Download Log File</AppText>
                    </View>
                   
                    <View style={{flexDirection:'row',justifyContent:'flex-end',paddingHorizontal:20,paddingVertical:30}}>
                      
                      <TouchableOpacity
                        style={{marginLeft:10,backgroundColor:themeColor.themeColor,paddingHorizontal:20,paddingVertical:15, borderRadius:10 }}
                        onPress={() => setModalVisible2(!modalVisible2)}>
                        <AppText style={{color:'white',fontSize:20}}>Cancel</AppText>
                      </TouchableOpacity>
                    </View>
                </View>
              </Modal>
              </Portal>
              </>
            )
          }

        </View>
      </ScrollView>
      
    </View>
  );
};

export default DeviceConsolidated;
