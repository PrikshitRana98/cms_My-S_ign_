import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import { useThemeContext } from "../../appConfig/AppContext/themeContext";
 
import { moderateScale, width } from "../../Helper/scaling";
import { FONT_FAMILY } from "../../Assets/Fonts/fontNames";
import Video from "react-native-video";
import Pdf from "react-native-pdf";
import SvgIcons from "../../Assets/Images/SvgIcons";

const CmpDetailMediaApproval = ({mediaArr,sliderValue}) => {
  const themeColor = useThemeContext();
  console.log("mediaArr12345ty",mediaArr)
  const Styles = CampaignStyles(themeColor);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(true);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [mediaArray, setMediaArray] = React.useState(mediaArr);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', async() => {
      navigation.goBack();
      console.log('device back')
  })
  }, [navigation])
 

  useEffect(() => {
    let interValTime = 0
    if(mediaArr[currentIndex]?.nodata || !mediaArr[currentIndex]?.defaultDurationInSeconds){
      interValTime=0
    }
    else if(mediaArr[currentIndex].hasOwnProperty("widgetType")){
      interValTime=5000
    }else{
      interValTime = parseInt(mediaArr[currentIndex]?.defaultDurationInSeconds) * 1000
    }
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaArr.length);
    }, interValTime);
    return () => clearInterval(intervalId);
  }, [currentIndex]);


  const returnMediaView = () => {
    let item = mediaArr[currentIndex];
    if (!item) {
      return (
        <Text style={{ width: "100%", height: "100%" }}>Content not found</Text>
      );
    }
    if (item.hasOwnProperty("widgetType")) {
      
      return (
        <View
        style={{ backgroundColor: "#00000",justifyContent:"center",alignItems:"center" }}
      >
        <Image
          source={SvgIcons[item.widgetType.toLowerCase()]}
          style={{width: "50%", height: "50%",tintColor:"black",resizeMode:"contain"}}
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
          }}
        >
          <Video
            source={{
              uri: `${item?.videoUrl}`,
            }}
            resizeMode="contain"
            paused={isPlaying}
            style={{
              flex: 1,
            }}
            muted={isMuted}
          />
        </Pressable>
      );
    } else if (item?.type == "IMAGE") {
      return (
        <View style={{}}>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      );
    } else if (item?.type == "PDF") {
      return (
        <Pdf
          trustAllCerts={false}
          source={{ uri: item?.pdfUrl }}
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
    } else if (item?.type == "TEXT") {
      return (
        <Text style={{ width: "100%", height: "100%" }}>
          {" "}
          {item.htmlForMobile}
        </Text>
      );
    }else{
        return (
          <View style={{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
            <Image
            source={require("../../Assets/Images/PNG/document.png")}
            style={{height:50,width:50}}
          />
          <Text style={{ color:'#000',fontSize:20 }}>
          {" "}
          {(item?.name) ? item?.name :'Content not found'}
        </Text>
          </View>
        );
    }
  };


  return (
    <View style={Styles.fullFlex}>
      {returnMediaView()}
    </View>
  );
};

export default CmpDetailMediaApproval;

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
      flexDirection:"row",
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
