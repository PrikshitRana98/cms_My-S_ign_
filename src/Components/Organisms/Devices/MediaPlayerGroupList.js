import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeContext } from "../../../appConfig/AppContext/themeContext";
import MediaPlayerScrollHeader from "./MediaPlayerScrollHeader";

import Feather from "react-native-vector-icons/Feather";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FONT_FAMILY } from "../../../Assets/Fonts/fontNames";
import DownArr from "../../../Assets/Images/PNG/down_arr.png";
import UpArrow from "../../../Assets/Images/PNG/up_arr.png";
import { moderateScale } from "../../../Helper/scaling";
import AppText from "../../Atoms/CustomText";
import MediaChildList from "./MediaChildList";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION_CONSTANTS } from "../../../Constants/navigationConstant";
import { useSelector } from "react-redux";
import DeleteIcon from "../../../Assets/Images/PNG/delete.png";
import { PREVILAGES } from "../../../Constants/privilages";



const MediaPlayerGroupList = ({ deviceGroupList,selectedData,setSelectedData,btnOpenModelType }) => {
  const themeColor = useThemeContext();
  const Styles = MediaPlayerStyles(themeColor);
  const [selectedMediaPlayerName, setSelectedMediaPlayerName] = useState("");
  const [viewGrpList,setViewGrpList]=useState(false);
  
  const { authorization } = useSelector((state) => state.userReducer);

  const renderTextView = (value, index) => {
    return (
      <View style={[Styles.commonView, Styles.textView]}>
        <AppText style={Styles.commonText}>{value}</AppText>
      </View>
    );
  };
  let navigation = useNavigation();

  const renderAction = (item) => {
    return (
      <View  style={[Styles.commonView, { width: "19%" }]}>
        <View style={Styles.iconBackContainer}>
          {/* <TouchableOpacity
          style={Styles.iconBackView}
          onPress={()=>{console.log(item)
            // setViewGrpList(true)
            // navigation.navigate("viewmediagroupList")
          }} 
          >
            <Feather name="view" size={20} color={themeColor.themeColor} />
          </TouchableOpacity> */}
          {authorization.includes(PREVILAGES.DEVICE_GROUP.EDIT_DEVICE_GROUP) &&<TouchableOpacity activeOpacity={0.5} style={Styles.iconBackView} onPress={()=>{ navigation.navigate(NAVIGATION_CONSTANTS.EDIT_MEDIA_PLAYER_GROUP,{mediaData:item})}}>
            <Feather name="edit" size={20} color={themeColor.themeColor} />
          </TouchableOpacity>}

          {(authorization.includes(PREVILAGES.DEVICE_GROUP.EDIT_DEVICE_GROUP) &&authorization.includes(PREVILAGES.DEVICE_GROUP.ADD_DEVICE_GROUP))&&<TouchableOpacity activeOpacity={0.5} style={Styles.iconBackView} onPress={()=>{ navigation.navigate('DraggableCompents',{mediaData:item})}}>
            <FontAwesome6 name="arrow-right-arrow-left" size={20} color={themeColor.themeColor} />
          </TouchableOpacity>}
          {authorization.includes(PREVILAGES.DEVICE_GROUP.DELETE_DEVICE_GROUP) && <TouchableOpacity activeOpacity={0.5} style={Styles.iconBackView} onPress={()=>{btnOpenModelType('Delete',item.deviceGroupId)}}>
          <Image source={DeleteIcon} 
            style={{height: moderateScale(20),
              width: moderateScale(20),
              resizeMode: "contain",
            }} 
          /> 
          </TouchableOpacity>}
        </View>
      </View>
    );
  };

  const isChecked = (id) => {
    if (selectedData.includes(id)) return true;
    return false;
  };
  const addRemData = (id) => {
    console.log('isChecked(id',isChecked(id))
    if (isChecked(id)) {
      let remdata = selectedData.filter((d) => d != id);
      setSelectedData([...remdata]);
    } else {
      setSelectedData([...selectedData, id]);
    }
  };
  const multiSelectUnselect=(status)=>{
    if (deviceGroupList.length <=0) return false;
    if(status==false){
        let seldata = deviceGroupList.map((media)=>{
          return media.deviceGroupId
        })
        setSelectedData([...seldata]);
    }else{
      setSelectedData([]);
    }
  }

  const renderCampaignStringItems = ({ item, index }) => {
    console.log("deviceGroupIddeviceGroupId  jjjssoonn ok",item.deviceGroupName,JSON.stringify(item.device.length))
    return (
      <React.Fragment key={item.deviceGroupName + index}>
        <View style={Styles.renderContainer}>
          <Pressable
            style={Styles.iconView}
            onPress={() => {
              addRemData(item.deviceGroupId);
            }}
          >
            {isChecked(item.deviceGroupId) ? (
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
          <TouchableOpacity
            disabled={item.device.length<=0}
            onPress={() => {
              console.log(selectedMediaPlayerName === item.deviceGroupName,selectedMediaPlayerName,"================>>>>>>>>>>>>>>>>>>",item.device.length,selectedMediaPlayerName , item.deviceGroupName)
              if (selectedMediaPlayerName === item.deviceGroupName) {
                setSelectedMediaPlayerName(" ");
              } else {
                setSelectedMediaPlayerName(item.deviceGroupName);
              }
            }}
            style={Styles.nameView}
          >
            <AppText style={Styles.nameText}>{item.deviceGroupName}</AppText>
            {item.device.length>0&&<Image
              source={
                selectedMediaPlayerName == item.deviceGroupName
                  ? DownArr
                  : UpArrow
              }
              style={Styles.downStyles}
            />}
          </TouchableOpacity>
          {renderTextView(item.created, index)}
          {renderTextView(item.created, index)}
          {renderAction(item)}
        </View>
        {(selectedMediaPlayerName === item.deviceGroupName) ? (<>
          <AppText>{JSON.stringify(item.panels)}</AppText>
          <MediaChildList data={item.device} />
          </>
        ) : null}
      </React.Fragment>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      style={Styles.mainContainer}
    >
      <FlatList
        scrollEnabled={false}
        data={deviceGroupList}
        
        renderItem={renderCampaignStringItems}
        ListHeaderComponent={<MediaPlayerScrollHeader onClick={(status)=>multiSelectUnselect(status)} deviceGroupList={deviceGroupList} selectedData={selectedData}/>}
      />
     {/* {viewGrpList&& <ViewGroupList
      deviceGroupList={deviceGroupList}
      selectedData={selectedData}
      setSelectedData={setSelectedData}
      btnOpenModelType={btnOpenModelType}
      />} */}
    </ScrollView>
  );
};

export default MediaPlayerGroupList;

const MediaPlayerStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      backgroundColor: COLORS.cardBorder,
      width: "100%",
      marginHorizontal: moderateScale(10),
    },
    renderContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "100%",
      margin: moderateScale(0.5),
    },
    iconView: {
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(10),
    },
    nameView: {
      width: "35%",
      backgroundColor: COLORS.white,
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(10),
      marginEnd: moderateScale(0.5),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    nameText: {
      color: COLORS.textColor,
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    downStyles: {
      height: moderateScale(7),
      width: moderateScale(11),
      resizeMode: "contain",
      tintColor: COLORS.themeColor,
    },
    commonView: {
      width: "19%",
      marginHorizontal: moderateScale(0.5),
      backgroundColor: COLORS.white,
      justifyContent: "center",
      paddingHorizontal: moderateScale(15),
      paddingVertical: moderateScale(8),
    },
    commonText: {
      color: COLORS.textColor,
      fontSize: moderateScale(15),
      paddingHorizontal: moderateScale(15),
      margin: moderateScale(0.5),
      backgroundColor: COLORS.white,
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
    },
    iconBackView: {
      height: moderateScale(28),
      width: moderateScale(28),
      borderRadius: moderateScale(14),
      backgroundColor: COLORS.themeLight,
      justifyContent: "center",
      alignItems: "center",
      padding: moderateScale(5),
      marginHorizontal:moderateScale(5),

    },
    iconBackContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(2),
    },
  });
