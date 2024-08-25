import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import { FONT_FAMILY } from "../../../../Assets/Fonts/fontNames";
import { moderateScale } from "../../../../Helper/scaling";
import { useThemeContext } from "../../../../appConfig/AppContext/themeContext";
import ActionContainer from "../../../Atoms/ActionContainer";
import CommonTitleAndText from "../../../Atoms/CommonTitleAndText";
import AppText from "../../../Atoms/CustomText";
import SearchBox from "../../../Atoms/SearchBox";
import Separator from "../../../Atoms/Separator";
import InfoImage from "../../../../Assets/Images/PNG/info.png";
import crossIcon from "../../../../Assets/Images/PNG/delete-button.png";
import { campaignData1 } from "./constants";

const SelectMediaModal = ({
  setModal,
  data = [],
  mediaModalType,
  onClick,
  setArrangeModal,
  regionData,
  selectedBgImg,
  seleAudioData,
}) => {
  const themeColor = useThemeContext();
  const Styles = ModalStyles(themeColor);
  const [selectedIndex, setSelectedIndex] = useState();
  const [mediaData, setMediaData] = useState(data);
  const [selRegionData, setselRegionData] = useState([]);
  

  useEffect(() => {
    setData();
    setMediaData([...data]);
  }, []);

  const setData=()=>{
   
    if(mediaModalType == "regionMedia"){
      if(typeof regionData !== "undefined"){
        setselRegionData([...regionData])
      }
    }else if(mediaModalType == "audio"){
        setselRegionData([...seleAudioData])
    }else{
      setselRegionData([selectedBgImg])
    }
  }

  const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  function niceBytes(x) {
    let l = 0,
      n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l];
  }

  const btnSaveData = () => {
    if (selRegionData.length <= 0) {
      alert("Please select data");
      return false;
    }
    if (mediaModalType == "regionMedia" || mediaModalType == "audio") {
      onClick(selRegionData);
      setModal(false);
      
      // mediaModalType == "regionMedia" && setArrangeModal(true);
    } else {
      onClick(selRegionData);
      setModal(false);
    }
  };

  const brnSelectMediaData = (itrem,index) => {
    let data1 = mediaData;
    if (mediaModalType == "regionMedia" || mediaModalType == "audio") {
      if(!isImageSelected(itrem)){
        setselRegionData([...selRegionData,itrem]) 
      }else{
        // let remData = selRegionData.filter((sel)=>sel.mediaDetailId!=itrem.mediaDetailId)
        // setselRegionData([...remData])
        console.log("again added",itrem.mediaDetailId)
        setselRegionData([...selRegionData,itrem]) 
      }
    } else {
      setselRegionData([itrem]) 
    }
  };

  const isImageSelected=(item)=>{
    let isDataPresent = selRegionData.findIndex((sel)=>sel?.mediaDetailId==item?.mediaDetailId)
    
    if(isDataPresent>=0){
      return true;
    }else{
      return false;
    }
  }

  const renderCampaign = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          brnSelectMediaData(item,index);
        }}
        key={item.name + index}
        style={[Styles.campaignContainer(isImageSelected(item))]}
      >
        {item?.type === "IMAGE" ? (
          <>
            <Image source={{ uri: item.imageUrl }} style={Styles.imageStyle} />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </>
        ) : item?.type === "VIDEO" ? (
          <>
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={Styles.imageStyle}
            />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </>
        ) : item?.type === "FACEBOOK" ? (
          <View
            style={[
              Styles.imageStyle,
              {
                backgroundColor: "#F2F4FC",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={{ uri: item.thumbnailUrl }}
              style={Styles.imageStyleIcon}
            />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </View>
        ) : item?.type === "DOC" ? (
          <View
            style={[
              Styles.imageStyle,
              {
                backgroundColor: "#F2F4FC",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={require("../../../../Assets/Images/PNG/document.png")}
              style={Styles.imageStyleIcon}
            />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </View>
        ) : item?.type === "PDF" ? (
          <View
            style={[
              Styles.imageStyle,
              {
                backgroundColor: "#F2F4FC",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Image
              source={require("../../../../Assets/Images/PNG/document.png")}
              style={Styles.imageStyleIcon}
            />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </View>
        ) : item.type == "AUDIO" ? (
          <View style={[Styles.imageStyle, Styles.mediaContainerView]}>
            <Image
              source={require("../../../../Assets/Images/PNG/music-file.png")}
              style={Styles.imageStyleIcon}
            />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </View>
        ) : item.type == "URL" ? (
          <View style={[Styles.imageStyle, Styles.mediaContainerView]}>
            <Image
              source={require("../../../../Assets/Images/PNG/flash.png")}
              style={Styles.imageStyleIcon}
            />
            <Image source={InfoImage} style={Styles.infoStyle} />
          </View>
        ) : (
          item.type === "TEXT" && (
            <View style={[Styles.imageStyle, Styles.mediaContainerView]}>
              <Text
                source={{ uri: item.contentToDisplay?.imageUrl }}
                style={{ width: "100%" }}
              >
                {" "}
                {item.contentToDisplay?.htmlForMobile}{" "}
              </Text>
            </View>
          )
        )}
        <AppText style={Styles.videoName}>
          {item.name}.{item.fileExtension}
        </AppText>
        <AppText style={Styles.dateText}>{niceBytes(item.mediaSize)}</AppText>
      </TouchableOpacity>
    );
  };

  return (
    <Portal>
      <Modal
        visible
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View style={Styles.mainContainer}>
          <View style={Styles.campaignContainerView}>
            <View style={Styles.headerView}>
              <AppText style={Styles.bodyHeaderText}>Select Media</AppText>
              <Pressable
              onPress={() => {
                setModal(false);
              }}
              style={{ padding: 5, position: "absolute", right: 4, top: 13 }}
            >
              <Image source={crossIcon} style={Styles.infoStyle} />
            </Pressable>
            </View>
            <Separator />
           {
            mediaData.length>0 ?
            <>
             <View style={Styles.headerPart}>
              {/* <CommonTitleAndText
                title="Start Date*"
                text="2022/12/22"
                isIcon
                isCalender
              /> */}
              {/* <SearchBox
                isIcon
                placeholder="Search image"
                inputStyle={{ fontSize: moderateScale(14) }}
              /> */}
            </View>
            <FlatList
              numColumns={2}
              data={mediaData}
              renderItem={renderCampaign}
            />
            </>
            :
            <AppText style={[Styles.bodyHeaderText,{textAlign:'center'}]}>Data not found</AppText>
           }
           {
             mediaData.length>0 &&
            <ActionContainer
              isContinue
              onPressSave={() => {
                btnSaveData(); 
              }}
              onPressCancel={() => setModal(false)}
              continueText="OK"
              continueStyle={Styles.actionStyle}
              cancelStyle={Styles.actionStyle}
            />
           }
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default SelectMediaModal;

const ModalStyles = (COLORS) =>
  StyleSheet.create({
    mainContainer: {
      height: "100%",
      justifyContent: "flex-end",
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
      fontSize: moderateScale(14),
      fontFamily: FONT_FAMILY.OPEN_SANS_SEMI_BOLD,
      marginHorizontal: moderateScale(10),
      marginVertical: moderateScale(10),
      color: COLORS.textColor,
    },
    headerPart: {
      padding: moderateScale(10),
    },
    campaignContainer: (active) => ({
      margin: moderateScale(5),
      width: "47%",
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(1),
      borderColor: active ? "red" : "#0000000F",
      overflow: "hidden",
    }),
    imageStyle: {
      height: moderateScale(100),
      width: "100%",
    },
    imageStyleIcon: {
      height: moderateScale(40),
      width: moderateScale(40),
      resizeMode: "contain",
    },
    mediaContainerView: {
      backgroundColor: "#F2F4FC",
      justifyContent: "center",
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
      top: moderateScale(0),
    },
    actionStyle: {
      width: "49%",
    },
  });
