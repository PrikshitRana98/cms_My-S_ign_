import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useContext, useRef, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { height, moderateScale } from "../../Helper/scaling";
import AppText from "../../Components/Atoms/CustomText";
import { ThemeContext } from "../../appConfig/AppContext/themeContext";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import { TermService, ThirdPartyService } from "./api";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { Button } from "react-native-paper";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import Loader from "../../Components/Organisms/CMS/Loader";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import { WebView } from "react-native-webview";

const ThirdParty = () => {
  const [isLoader, setIsLoader] = useState(false);
  const navigation = useNavigation();
  const themeColor = useContext(ThemeContext);
  const Styles = TermStyles(themeColor);
  const [title, setTitle] = useState("");
  const [info, setinfo] = useState("");

  useEffect(() => {
    getInfo();
  }, [1]);

  const { height: deviceHeight } = Dimensions.get("window");

  console.log("Device Height:", deviceHeight);

  const getInfo = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    const succussCallBack = (response) => {
      console.log("success ===> third partuy", JSON.stringify(response.data));
      const data = response.data;
      if (data) {
        //  setTitle(data.title);
        setinfo(data);
      }
      setIsLoader(false);
    };

    const failureCallBack = (error) => {
      console.log(
        "success ===terrer> third party",
        JSON.stringify(error.response.data)
      );
      setIsLoader(false);
      setinfo("No Data Found");
    };
    setIsLoader(true);
    ThirdPartyService.getthirdParty(params, succussCallBack, failureCallBack);
  };

  const mixedStyle = {
    body: {
      whiteSpace: "normal",
      color: "black",
      margin: 0,
      padding: 5,
      // justifyContent:"center",
      textAlign: "justify",
    },

    ul: { margin: 0, padding: 0, textAlign: "justify" },
    li: {
      color: "black",
      paddingHorizontal: 5,
    },
    p: {
      color: "black",
      textAlign: "space-between",
      textAlign: "justify",
    },
    strong: {
      color: "black",
      fontSize: "18px",
    },
    p: {
      strong: {
        color: "black",
        fontSize: "18px",
      },
    },
  };

  const handleMessage = (event) => {
    // Update height based on message received from WebView
    const newHeight = parseInt(event.nativeEvent.data);
    console.log(
      "dsds------------- cvcvfv  dfgdg  dgdg  dgd--------------->",
      newHeight
    );
    if (!isNaN(newHeight)) {
      // setWebviewHeight(newHeight);
    }
  };

  const [webViewHeight, setWebViewHeight] = useState(300); // Initial height, adjust as needed

  const onMessage = (event) => {
    const height = parseInt(event.nativeEvent.data);
    setWebViewHeight(height);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: moderateScale(10),
        backgroundColor: themeColor.appBackground,
      }}
    >
      <Loader visible={isLoader} />
      <ClockHeader />
      <View
        style={{
          paddingHorizontal: moderateScale(10),
          backgroundColor: "white",
        }}
      >
        <CreateNewHeader
          title="Third Party Licenses"
          onClickIcon={() => navigation.goBack()}
        />
      </View>
      {/* <View style={Styles.headerCont}>
        <AppText style={[Styles.headerText,{fontWeight:600,marginTop:10}]}>Third Party License </AppText>
      </View> */}
      <ScrollView contentContainerStyle={[Styles.scroll]}>
        <View style={{ paddingHorizontal: 1 }}>
          <View style={{ justifyContent: "space-between" }}>
            <WebView
              source={{ uri: info }}
              scalesPageToFit={false}
              textZoom={80}
              javaScriptEnabled={true}
              onMessage={onMessage}
              injectedJavaScript={
                "window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
              }
              
              style={{
                width: Dimensions.get("window").width -20,
                height: Platform.OS == 'android' ? webViewHeight + 50 : Dimensions.get("window").height +50
                // height:Dimensions.get('window').height
                //   height: 9470,

                // height:"auto",
                // maxHeight:Dimensions.get("window").height*12.8,
              }} // You can adjust the style as needed
            />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: moderateScale(10),
        }}
      >
        <CopyRightText
          containerStyle={{
            marginVertical: 5,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default React.memo(ThirdParty);

const TermStyles = (COLORS) =>
  StyleSheet.create({
    headerCont: {
      height: moderateScale(45),
      paddingHorizontal: moderateScale(8),
    },
    headerText: {
      color: "black",
      fontSize: moderateScale(18),
    },
    scroll: {
      // flex: 1,
      paddingVertical: moderateScale(10),
      // paddingHorizontal: moderateScale(5),
      backgroundColor: COLORS.appBackground,
    },
  });
