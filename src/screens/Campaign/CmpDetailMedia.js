import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert, Platform, Animated, Easing, Dimensions, BackHandler } from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";

import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import Video from "react-native-video";
import Pdf from "react-native-pdf";
import WebView from "react-native-webview";
import FastImage from "react-native-fast-image";
import SvgIcons from "../../Assets/Images/SvgIcons";

const CmpDetailMedia = ({ mediaArr, sliderValue,isMute=false }) => {
  const [page, setPage] = useState(1);


  const handlePageChanged = (pageNumber) => {
    setPage(pageNumber);
  
  };

  const themeColor = useThemeContext();
  const Styles = CampaignStyles(themeColor);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(isMute);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [seekposition, setseekposition] = React.useState(0);
  const videoPlayer = React.useRef()
  
  let intervalId;
  useEffect(() => {
    let interValTime = 0;
    if (mediaArr[currentIndex].hasOwnProperty("widgetType") || !mediaArr[currentIndex]?.defaultDurationInSeconds) {
      interValTime = 4000;
    }else if(mediaArr[currentIndex]?.nodata){
      interValTime=0;
    } 
    else {
      interValTime = parseInt(mediaArr[currentIndex]?.defaultDurationInSeconds) * 1000;
    }
    let changeIndex=currentIndex;
    intervalId = setInterval(() => {
      if(changeIndex<mediaArr.length){
        setCurrentIndex(changeIndex)
        changeIndex=changeIndex+1;
        let item = mediaArr[currentIndex];
      }else{
        setCurrentIndex(0);
      }
    }, interValTime);
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  useEffect(() => {
  if (videoPlayer.current) {
    videoPlayer.current.seek(seekposition);
  }},[seekposition]);
 
 
  let CalculateFunction = () => {
    let tot = 0;
    let mArray = mediaArr;
    let vval = sliderValue;
  
    for (let index = 0; index < mArray.length; index++) {
      const element = mArray[index];
      tot = tot + element?.defaultDurationInSeconds;
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
    if (sliderValue != 0) {
      CalculateFunction();
    }
    else if(sliderValue == 0)
    {
      let tot = 0;
      let mArray = mediaArr;
      let vval = sliderValue;
    
      for (let index = 0; index < mArray.length; index++) {
        const element = mArray[index];
        tot = tot + element?.defaultDurationInSeconds;
        if (tot >= sliderValue) {
           for (let innn = 0; innn < index; innn++) { 
            vval = vval - mArray[innn].defaultDurationInSeconds;
          }
          setseekposition(vval)
          break;
        }
      }
    }
  }, [sliderValue]);

  const onprogressss=(perc)=>{
  
  }

  const returnMediaView = () => {
    let item = mediaArr[currentIndex];
    
    if (!item) {
      return (
        <Text style={{ width: "100%", height: "100%", color:'black' }}>Content not found</Text>
      );
    }
    if (item.hasOwnProperty("widgetType")) {
      console.log(item.widgetType)
      return (
        <View
        style={{ backgroundColor: "#00000",justifyContent:"center",alignItems:"center" }}
      >
        <Image
          source={SvgIcons[item.widgetType.toLowerCase()]}
          style={{marginTop:10,width: "50%", height: "50%",tintColor:themeColor.themeColor,resizeMode:"contain"}}
          // resizeMethod={"contain"}
        />
        {/* <FastImage 
            source={SvgIcons[item.widgetType]}
            resizeMode={true?FastImage.resizeMode.stretch:FastImage.resizeMode.contain}
            style={{ width: "100%", height: "100%" }}
          /> */}
      </View>
      );
    }
    if (item?.type == "VIDEO") {
      return (
        <Pressable
          onPress={() => {
            setIsPlaying(!isPlaying);
          }}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
            
          }}
        >
          <Video
           ref={videoPlayer}
           source={{
              uri: `${item?.videoUrl}`,
            }}
            resizeMode="contain"
            paused={false}
            style={{
              flex: 1,
              backgroundColor: "#00000"
            }}
            controls={false}
            onProgress={onprogressss}
            muted={!isMuted}
          />
        </Pressable>
      );
    } else if (item?.type == "IMAGE") {
    
      const istrue=item.displayMode=="STRETCH_TO_FIT"?true:false;
      return (
        <View style={{ backgroundColor: "#00000" }}>
          <FastImage 
            source={{ uri: item.imageUrl }}
            resizeMode={istrue?FastImage.resizeMode.stretch:FastImage.resizeMode.contain}
            style={{ width: "100%", height: "100%" }}
          />
          {/* <Image
            source={{ uri: item.imageUrl }}
            resizeMode={istrue?"stretch":"contain"}
            style={{ width: "100%", height: "100%" }}
          /> */}
        </View>
      );
    } else if (item?.type == "PDF") {
      return (
        <Pdf
          trustAllCerts={false}
          source={{ uri: item?.pdfUrl }}
          enablePaging={true}
          page={page}
          showsVerticalScrollIndicator={true} 
          onLoadComplete={(p, filePath) => {
            
          }}
          onPageChanged={handlePageChanged}
          onError={(error) => {
           
          }}
          onPressLink={(uri) => {
           
          }}
          style={{ width: "100%", height: "100%" }}
        />
      );
    } else if (item?.type == "HTML") {
      return (
        // <Text style={{ width: "100%", height: "100%" }}>
        //   {" "}
        //   {item.htmlForMobile}
        // </Text>

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
            style={{ height: 40, width: 40, resizeMode:"contain",tintColor:"white"}}
          />
          <Text style={{ color: themeColor.white, fontSize: 15 }} numberOfLines={1} >
            {item?.name ? item?.name : "Content not found"}{"\n"}{item.type }
            
          </Text>
        </View>
      );
    }
  };

  return <View style={Styles.fullFlex}>{returnMediaView()}</View>;
};

export default CmpDetailMedia;

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
