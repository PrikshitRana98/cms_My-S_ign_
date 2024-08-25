import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { height, moderateScale } from "../../Helper/scaling";
import AppText from "../../Components/Atoms/CustomText";
import { ThemeContext } from "../../appConfig/AppContext/themeContext";
import CreateNewHeader from "../../Components/Atoms/CreateNewHeader";
import { TermService } from "./api";
import { getStorageForKey } from "../../Services/Storage/asyncStorage";
import { Button } from "react-native-paper";
import { NAVIGATION_CONSTANTS } from "../../Constants/navigationConstant";
import { useNavigation } from "@react-navigation/native";
import RenderHTML from "react-native-render-html";
import CopyRightText from "../../Components/Molecules/CopyRightText";
import Loader from "../../Components/Organisms/CMS/Loader";
import ClockHeader from "../../Components/Atoms/ClockHeaders";
import { WebView } from "react-native-webview";

const TermCond = () => {
  const [isLoader, setIsLoader] = useState(false);
  const navigation = useNavigation();
  const themeColor = useContext(ThemeContext);
  const Styles = TermStyles(themeColor);
  const [title, setTitle] = useState("");
  const [info, setinfo] = useState("");

  useEffect(() => {
    getInfo();
  }, [1]);

  

  const getInfo = async () => {
    let slugId = await getStorageForKey("slugId");
    const params = {
      slugId: slugId,
    };
    const succussCallBack = (response) => {
      console.log("success ===> of TC", JSON.stringify(response.data));
      if (response?.data) {
        const data = response.data;
        setinfo(response?.data);
      }
      setIsLoader(false);
    };

    const failureCallBack = (error) => {
      console.log("success ===terrer>", JSON.stringify(error.response.data));
      setinfo("No Data Found")
      setIsLoader(false);
    };
    setIsLoader(true);
    TermService.getTC(params, succussCallBack, failureCallBack);
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
    strong: {},
  };

  const [webViewHeight, setWebViewHeight] = useState(height); // Initial height, adjust as needed

  const onMessage = (event) => {
    const height = parseInt(event.nativeEvent.data);
    setWebViewHeight(height);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: moderateScale(10) }}>
      <Loader visible={isLoader} />
      <ClockHeader />
      <View style={{ backgroundColor: "white", padding: moderateScale(10) }}>
        <CreateNewHeader
          title="Terms & Conditions"
          onClickIcon={() => navigation.goBack()}
        />
      </View>
      <ScrollView contentContainerStyle={[Styles.scroll]}>
        <View style={{ paddingHorizontal: 0, flex: 1 }}>
          <View style={{ justifyContent: "space-between" }}>
            {/* <RenderHTML
              // contentWidth={Dimensions.get('window').width}
              // contentContainerStyle={{  backgroundColor: 'red',justifyContent:"center", }}
              source={{ html: info }}
              tagsStyles={mixedStyle}
            /> */}
            
            <WebView
              source={{ uri: info }}
              containerStyle={{
                width: Dimensions.get("window").width,
                marginBottom: 0,
              }}
              javaScriptEnabled={true}
              scalesPageToFit={false}
              onMessage={onMessage}
              injectedJavaScript={
                "window.ReactNativeWebView.postMessage(document.body.scrollHeight)"
              }
              textZoom={80}
              style={{
                width: Dimensions.get("window").width -20,
                backgroundColor: "#FFFFFF",
                height: Platform.OS == 'android' ? webViewHeight + 50 : Dimensions.get("window").height +50,
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

export default React.memo(TermCond);

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
      paddingHorizontal: moderateScale(5),
      backgroundColor: COLORS.appBackground,
    },
  });
