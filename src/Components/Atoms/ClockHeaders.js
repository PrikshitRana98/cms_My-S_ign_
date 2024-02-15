import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import bellIcon from "../../Assets/Images/PNG/bell.png";
import ProfileImage from "../../Assets/Images/PNG/profile.jpeg";
import { ICON_NAMES } from "../../Constants/iconNames";
import {
  LocalDate,
  LocalDate1,
  moderateScale,
  verticalScale,
} from "../../Helper/scaling";
import { ThemeContext } from "../../appConfig/AppContext/themeContext";
import AppText from "./CustomText";
import { Portal } from "react-native-paper";
import Separator from "./Separator";
import { NotificationApiService } from "../../Services/AxiosService";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { FlatList } from "react-native-gesture-handler";
import ModalDropdownComp from "./DropDown";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { NotiicationModal } from "../Organisms/Dashboard/NotificationModal";

const ClockHeader = () => {
  const navigation = useNavigation();
  const dropdownCategoryref = useRef();
  const themeColor = useContext(ThemeContext);
  const Styles = clockHeaderStyles(themeColor);
  const mStyles = ModalStyles(themeColor);

  const [noticationData, setNoticationData] = useState({});
  const [notificationCount,setNoticationCount]=useState(0);
  const [notiModal, setNotiModal] = useState(false);
  const [isNotiLoading, setIsNotiLoading] = useState(false);
  const [isOpenChangePwd, setisOpenChangePwd] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  
  useFocusEffect(
    React.useCallback(() => {
      const call=123;
      getAllNotification();
      // setselectAllMediaFlag(false)
      return () => true
    }, [])
  );

  // useEffect(()=>{
  //   console.log("motiModal",String(notiModal))
  // },[notiModal])

  const getAllNotification = async () => {
    // console.log("\n\ngetAllNotification\n\n\n\n\n\n\n\n\n\n\n called")
    const slugId = await getStorageForKey("slugId");
    setIsNotiLoading(true);

    const successCallBack = async (response) => {
      
      console.log("getAllNotification notication", JSON.stringify(response.data.unreadCount));
      if ((response.status == "OK" || response.code == "200")&&JSON.stringify(noticationData)!=JSON.stringify(response.data)) {
        // setMediaDetails(response.data.mediaDetails[0]);
        setNoticationCount(response.data.unreadCount)
        setNoticationData(response.data);
      }
      setTimeout(() => {
        setIsNotiLoading(false);
      }, 300);
    };

    const errorCallBack = (error) => {
      Alert.alert(slugId,error.message);
      console.log("Error getAllNotification [notication]", JSON.stringify(error));
      // console.log("Error getAllNotification", error.config.url);
      setIsNotiLoading(false);
    };
    const endPoint = `user-management/ums/${slugId}/v1/push/web/notifications`;
    NotificationApiService.getNotifications(
      { slugId, endPoint },
      successCallBack,
      errorCallBack
    );
  };

  return (
    <View style={Styles.mainContainer}>
      <View style={Styles.clockTimeView}>
        <MaterialCommunityIcons
          name={ICON_NAMES.MCI_CLOCK}
          size={22}
          color={themeColor.themeColor}
        />
        <AppText style={Styles.timeTextStyle}>
          AEST {currentTime.toLocaleTimeString()}
        </AppText>
      </View>
      <View style={Styles.endView}>
        <TouchableOpacity
          onPress={() => {
            setNotiModal(!notiModal);
          }}
          style={Styles.iconView}
        >
          <Image source={bellIcon} style={Styles.bellStyle} />
          <View style={Styles.topTextView}>
            <AppText bold style={Styles.topText}>
              {notificationCount}
            </AppText>
          </View>
        </TouchableOpacity>

        <ModalDropdownComp
          onSelect={(_, res2) => {
            console.log("-------------------------", res2);            
            if(res2=="Change Password"){
              navigation.navigate(NAVIGATION_CONSTANTS.CHANGE_PASSWORD)
            }
          }}
          options={["Change Password"]}
          onClose={() => setisOpenChangePwd(true)}
          isFullWidth
          popupHeight={moderateScale(45)}
          ref={dropdownCategoryref}
          // onClose={() =>console.log("false")}
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
          dropdownStyle={{ width: 200, backgroundColor: "white" }}
          renderSeparator={(obj) => null}
        >
          <TouchableOpacity
            style={Styles.bulkAction}
            onPress={() => {
              dropdownCategoryref.current._onButtonPress();
            }}
          >
            <View style={Styles.profileDropView}>
              <Image source={ProfileImage} style={Styles.imageStyle} />
            </View>
          </TouchableOpacity>
        </ModalDropdownComp>
      </View>
      {notiModal && (
        <NotiicationModal
          notiModal={notiModal}
          setModal={setNotiModal}
          // setNoticationData={setNoticationData}
          // noticationData={noticationData}
          getNotifiCount={()=>{getAllNotification()}}
        />
      )}
      
    </View>
  );
};

export default ClockHeader;

const clockHeaderStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(15),
      borderBottomWidth: verticalScale(1),
      borderBottomColor: COLORS.border,
      backgroundColor: COLORS.appBackground,
    },
    timeTextStyle: {
      fontSize: moderateScale(17),
      color: COLORS.textColor,
      marginHorizontal: moderateScale(5),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
    },
    bulkAction: {
      flexDirection: "row",
      alignItems: "baseline",
      // padding: moderateScale(5),
    },
    textStyle: {
      color: "black",
      textAlignVertical: "center",
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    },
    imageStyle: {
      height: moderateScale(30),
      width: moderateScale(30),
      borderRadius: moderateScale(15),
      marginHorizontal: moderateScale(5),
    },
    bellStyle: {
      height: moderateScale(25),
      width: moderateScale(20),
    },
    clockTimeView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    profileDropView: {
      flexDirection: "row",
      alignItems: "center",
    },
    endView: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconView: {
      marginHorizontal: moderateScale(15),
    },
    topTextView: {
      height: moderateScale(14),
      minWidth: moderateScale(16),
      // padding:3,
      position: "absolute",
      backgroundColor: COLORS.themeColor,
      borderRadius: moderateScale(7),
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
    topText: {
      textAlign:'center',
      fontSize: moderateScale(9),
      color: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_BOLD,
    },
    downStyle: {
      height: moderateScale(6),
      width: moderateScale(10),
    },
    Input: {
      color: "black",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "black",
      paddingHorizontal: 5,
      marginVertical:2
    },
    ChgPwdTxt:{
      fontSize:moderateScale(14),
      color:COLORS.white,
      fontFamily:FONT_FAMILY.OPEN_SANS_BOLD,
      textAlign:'center'
    },
    ChgPwdBtn:{
      justifyContent:'center',
      borderWidth:1,
      borderRadius:10,
      backgroundColor:COLORS.themeColor,
      height:moderateScale(50),
      width:"100%",
      marginVertical:15,
      // marginHorizontal:10,
    },
    errTxt:{
      color:'red',
      fontSize:moderateScale(14),
    }
  });

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      //   flex: 1,
      height: "100%",
      justifyContent: "flex-end",
      // backgroundColor:"#777",
    },
    campaignContainerView: {
      height: "90%",
      backgroundColor: COLORS.white,
    },
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: moderateScale(10),
    },
    bodyHeaderText: {
      fontSize: moderateScale(18),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    headerPart: {
      borderColor: "black",
      marginHorizontal: moderateScale(10),
    },
    campaignContainer: (active) => ({
      padding: 10,
      backgroundColor: !active ? "#D3D3D3" : "white",
      marginHorizontal: 5,
      marginVertical: 2,
      flexDirection: "row",
      alignItems: "center",
    }),
    imageStyle: {
      height: moderateScale(100),
      width: "100%",
    },
    videoName: {
      fontSize: moderateScale(12),
      margin: moderateScale(5),
      color: COLORS.textColor,
    },
    dateText: {
      fontSize: moderateScale(10),
      color: COLORS.unselectedText,
      margin: moderateScale(5),
    },
    infoStyle: {
      height: moderateScale(32),
      width: moderateScale(32),
      resizeMode: "contain",
      position: "absolute",
      right: moderateScale(0),
    },
    actionStyle: {
      width: "49%",
    },
    modalText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      textAlignVertical: "auto",
    },
  });
