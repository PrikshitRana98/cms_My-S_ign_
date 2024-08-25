import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert, Platform, BackHandler, ActivityIndicator } from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";

import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import Video from "react-native-video";
import Pdf from "react-native-pdf";
import FastImage from 'react-native-fast-image';
import VideoComponent from "../../Components/Molecules/VideoComponent";
import WebView from "react-native-webview";
import SvgIcons from "../../Assets/Images/SvgIcons";

export default function CmpDetailMediaApproval({
  mediaArray,
  transparencyInPercentage,
  resetPreviewAgain,
  mediaAudios,
  audioCampaignDurationInSec,
  totalDurationOfCampaignInSeconds,
  isAudioEnabled,
  sliderValue
}) {
  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);

  // console.log("123232--mediaAudios>",JSON.stringify(mediaAudios))

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(isAudioEnabled);
  const [currentIndex, setCurrentIndex] = React.useState(0);
// console.log('isAudioEnabledisAudioEnabled===>',isAudioEnabled)
const [seekposition, setseekposition] = React.useState(0);
const videoPlayer = React.useRef()

const [videoInd, setvideoInd] = React.useState({ opacity: 0 });

  let intervalId;
  useEffect(() => {
    let interValTime = 0;
    if (
      mediaArray[currentIndex]?.nodata || !mediaArray[currentIndex]?.durationInSeconds) {
      interValTime = 0;
    } else {
      interValTime = parseInt(mediaArray[currentIndex]?.durationInSeconds) * 1000;
    }
    intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaArray.length);
    }, interValTime);
    return () => clearInterval(intervalId);
  }, [currentIndex,resetPreviewAgain]);

  const onBuffer = ({ isBuffering }) => {
    setvideoInd({ opacity: isBuffering ? 1 : 0 });
  };

  const onEnd = () => {
    setIsPlaying(false);
  };

  const onLoad = () => {
    setvideoInd({ opacity: 0 });
  };
  onLoadStart = () => {
    setvideoInd({ opacity: 1 });
  };

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
  //     navigation.goBack();
  //     console.log('device back')
  // })
  // }, [navigation])

  useLayoutEffect(() => {
    if (videoPlayer.current) {
      console.log(seekposition)
      videoPlayer.current.seek(seekposition);
    }},[seekposition]);

  let CalculateFunction = () => {
    let tot = 0;
    let mArray = mediaArray;
    let vval = sliderValue;

    for (let index = 0; index < mArray.length; index++) {
      const element = mArray[index];
      tot = tot + element?.durationInSeconds;
      if (tot >= sliderValue) {
        setCurrentIndex(index);
        for (let innn = 0; innn < index; innn++) { 
          vval = vval - mArray[innn].defaultDurationInSeconds;
        }
        setseekposition(vval)
        break;
      }
    }
    clearInterval(intervalId);
  };

  useEffect(() => {
    // console.log("sliderValue", sliderValue);
    if (sliderValue != 0) {
      CalculateFunction();
    }
  }, [sliderValue]);

  const returnMediaView = () => {
    let item = mediaArray[currentIndex];    
    
    if (!item) {
      return (
        <Text style={{ width: "100%", height: "100%" }}>Content not found</Text>
      );
    }
    if (item?.mediaType == "VIDEO") {
      return (
        // <VideoComponent
        //   ref={videoPlayer}
        //   videoUrl={`${item?.url}`}
        //   isMuted={!isMuted}
        // />
        <Pressable
        onPress={() => {
          setIsPlaying(!isPlaying);
        }}
        style={[{ height: "100%", width: "100%", justifyContent: "center" }]}
      >
        <Video
          ref={videoPlayer}
          source={{ uri: item?.url }}
          controls={false}
          resizeMode={"contain"}
          paused={isPlaying}
          style={{flex: 1,
            backgroundColor: "#00000"}}
          muted={!isMuted}
          fullScreen={false}
          onBuffer={onBuffer}
          onLoad={onLoad}
          onEnd={onEnd}
          onLoadStart={onLoadStart}
        />
        <ActivityIndicator
          animating
          size="large"
          color={themeColor.themeColor}
          style={[
            { position: "absolute", alignSelf: "center" },
            { opacity: videoInd.opacity },
          ]}
        />
      </Pressable>
      );
    }else if (item.hasOwnProperty("widgetType")) {      
      return (
        <View
        style={{ backgroundColor: "#00000",height:"100%",justifyContent:"center",alignItems:"center", }}
      >
        <Image
          source={SvgIcons[item.widgetType.toLowerCase()]}
          style={{width:"50%",tintColor:themeColor.themeColor,resizeMode:"contain",}}
          resizeMode="contain"
        />
        {/* <FastImage 
            source={SvgIcons[item.widgetType]}
            resizeMode={true?FastImage.resizeMode.stretch:FastImage.resizeMode.contain}
            style={{ width: "100%", height: "100%" }}
          /> */}
      </View>
      );
    } else if (item?.mediaType == "IMAGE") {
      const istrue=item.displayMode=="STRETCH_TO_FIT"?true:false;
      return (
        <View style={{ backgroundColor: "#00000" }}>
           <FastImage 
            source={{ uri: item.url }}
            resizeMode={istrue?FastImage.resizeMode.stretch:FastImage.resizeMode.contain}
            style={{ width: "100%", height: "100%" ,}}
           />
         
        </View>
      );
    } else if (item?.mediaType == "PDF") {
      return (
        <Pdf
          trustAllCerts={false}
          source={{ uri: item?.url }}
          enablePaging={true}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={{ width: "100%", height: "100%" }}
        />
      );
    } else if (item?.mediaType == "TEXT") {
      return (
        <Text style={{ width: "100%", height: "100%" }}>
          {" "}
          {item.url}
        </Text>
        
      );
    }else if (item?.type == "HTML") {
      return (
        <WebView
          source={{html: item.htmlForMobile}}
          minimumFontSize={15}
          automaticallyAdjustContentInsets={false}
          injectedJavaScript={`if (document.documentElement) {
            document.documentElement.style.touchAction = 'manipulation';
            document.body.style.touchAction = 'manipulation';
            document.addEventListener('gesturestart', function (e) {
              e.preventDefault();
            });
          }`}
          setBuiltInZoomControls={Platform.OS === 'android'&&true}
          setDisplayZoomControls={Platform.OS === 'android'&&false}
          containerStyle={{fontSize:20,}}
          textZoom={300}
          style={{
            marginTop: 0,
            // padding:10,
            // alignSelf:'center',
            fontSize:20,
            width:"100%",
            height:350,
            backgroundColor:'white',
          }}
          
        />


      );
    } else {
      return (
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../Assets/Images/PNG/document.png")}
            style={{ height: 50, width: 50 }}
          />
          <Text style={{ color: themeColor.themeColor, fontSize: 20 }}>
            {" "}
            {item?.name ? item?.name : "Content not found"}{'\n'}
            {item?.name&&item?.type}
          </Text>
        </View>
      );
    }
  };

  return <View style={Styles.fullFlex}>{returnMediaView()}</View>;
}

const CampaignStyles = (COLORS) =>
  StyleSheet.create({
    regionContainer: (item) => ({
      height: `${item.heightInPercentage}%`,
      width: `${item.widthInPercentage}%`,
      borderWidth: 1,
      borderStyle: "dashed",
      position: "absolute",
      top: `${item.topLeftCoordinateYInPercentage}%`,
      left: `${item.topLeftCoordinateXInPercentage}%`,
      justifyContent: item.contentToDisplay ? "flex-end" : "center",
    }),
    headerContainer: {
      backgroundColor: COLORS.white,
      padding: moderateScale(10),
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fullFlex: {
      flex: 1,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.backgroundColor,
      padding: moderateScale(10),
      alignSelf: "baseline",
    },
    totalRecords: {
      margin: moderateScale(10),
      fontFamily: FONT_FAMILY.OPEN_SANS_REGULAR,
      fontSize: moderateScale(13),
    },
    campaignContainer: (active) => ({
      width: "100%",
      height: moderateScale(120),
      borderRadius: moderateScale(5),
      borderWidth: moderateScale(2),
      borderColor: active ? COLORS.themeColor : "#0000000F",
      backgroundColor: COLORS.placeHolder,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    }),
  });