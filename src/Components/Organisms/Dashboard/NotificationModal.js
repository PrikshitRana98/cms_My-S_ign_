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
    FlatList,
    Alert,
    ScrollView,
  } from "react-native";
  import React, { useContext, useEffect, useRef, useState } from "react";
  import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
  import FontAwesome from "react-native-vector-icons/FontAwesome";
  import Entypo from "react-native-vector-icons/Entypo";
  import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import { ThemeContext } from "../../../appConfig/AppContext/themeContext";
import { getStorageForKey } from "../../../Services/Storage/asyncStorage";
import { NotificationApiService } from "../../../Services/AxiosService";
import { LocalDate1, moderateScale } from "../../../Helper/scaling";
import AppText from "../../Atoms/CustomText";
import Separator from "../../Atoms/Separator";
import { useFocusEffect } from "@react-navigation/native";
import { all } from "axios";
import Loader from "../../Organisms/CMS/Loader";
export const NotiicationModal =({ notiModal, setModal,getNotifiCount }) => {
    const themeColor = useContext(ThemeContext);
    const mStyles = ModalStyles(themeColor);
    const [isNotiLoading, setIsNotiLoading] = useState(false);
    const flatListRef = useRef(null);
    const [notificationData,setnotificationData]=useState([])
    const [scrollenbl,setscrollenbl]=useState(false)
    const [scrollindex,setscrollindex]=useState(0)
  
    useEffect(() => {
      console.log("noticatiooooooonnndd");
      getAllNotification();
    }, []);


    const getAllNotification = async () => {
      console.log("\n\ngetAllNotification\n called")
      const slugId = await getStorageForKey("slugId");
      setIsNotiLoading(true);
  
      const successCallBack = async (response) => {        
        console.log("getAllNotification notication\n\n", );
        if ((response.status == "OK" || response.code == "200")&&JSON.stringify(notificationData)!=JSON.stringify(response.data)) {
          // setMediaDetails(response.data.mediaDetails[0]);
          // setNoticationCount(response.data.unreadCount)
          setnotificationData(response.data.notifications);
        }
        setTimeout(() => {
          setIsNotiLoading(false);
        }, 300);
      };
  
      const errorCallBack = (error) => {
        Alert.alert(slugId,error.message);
        console.log("Error getAllNotification [notication]", JSON.stringify(error));
        console.log("Error getAllNotification", error.config.url);
        setIsNotiLoading(false);
      };

      const endPoint = `user-management/ums/${slugId}/v1/push/web/notifications`;
      NotificationApiService.getNotifications(
        { slugId, endPoint },
        successCallBack,
        errorCallBack
      );
    };

    const renderItems=(item,index)=>{
     return(
      
          <TouchableOpacity
            key={item.item.messageId}
            onPress={() => {
              setIsNotiLoading(true);
              markRead(item.item.messageId,item)
            }}
            style={mStyles.campaignContainer(item.item.read)}
          >
            <FontAwesome
              name={"circle"}
              size={15}
              color={"#CC5500"}
            />
            <View style={{ marginHorizontal: 5 }}>
              <Text style={mStyles.modalText}>
                {item.item.messageString}
              </Text>
              <Text style={mStyles.modalText}>
                {LocalDate1(item.item.sentOn)}
              </Text>
            </View>
          </TouchableOpacity>
      
      )
    }
    
    const markRead = async (messageId,item) => {

      const slugId = await getStorageForKey("slugId");
      const successCallBack = async (response) => {
        const newData = [...notificationData];
        newData[item?.index].read = true;
        setIsNotiLoading(false);
        setnotificationData(newData);
      };

      const errorCallBack = (response) => {
        console.log("Error notication", response);
        Alert.alert("Error","Error occured")
        setIsNotiLoading(false);
      };
      const params = {
        messageIds: [messageId],
        slugId: slugId,
      };

      const endPoint = `user-management/ums/${slugId}/v1/push/web/read`;
      NotificationApiService.markRead(
        { params, endPoint },
        successCallBack,
        errorCallBack
      );
    };

    return (
      <>
      
        <Modal
          visible
          style={{
            flex: 1,
            justifyContent: "flex-end",
          }}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          onRequestClose={()=>{
            console.log("opop")
            // getAllNotification()
            setModal(false)
          }}
          transparent
        >
           <Loader visible={isNotiLoading} />
          <View style={mStyles.mainContainer}>
            <View style={mStyles.campaignContainerView}>
              <View style={mStyles.headerView}>
                <AppText style={mStyles.bodyHeaderText}>Notifications </AppText>
                <TouchableOpacity
                  onPress={() => {
                    getNotifiCount()
                    setModal(false)
                  }}
                  style={mStyles.headerPart}
                >
                  <Entypo name={"cross"} size={20} color={themeColor.black} />
                </TouchableOpacity>
              </View>
              <Separator />
              {/* {isNotiLoading ? (
                <View style={{ justifyContent: "center", marginTop: 30 }}>
                  <ActivityIndicator size={30} />
                </View>
              ) : ( */}
                <FlatList
                  scrollEnabled={true}
                  ref={flatListRef}
                  data={notificationData}
                  keyExtractor={(item) => item.index}
                  renderItem={renderItems}
                 />
              {/* )} */}
              {/* <ScrollView>
              {notificationData.map((item,index)=>{
                // console.log(index)
                return(
                  
                )
                })
              }
              </ScrollView> */}
            </View>
          </View>
        </Modal>
      </>
    );
  };


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
      backgroundColor: !active ? "#E3FBFE" : "white",
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